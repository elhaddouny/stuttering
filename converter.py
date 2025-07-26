import os
import uuid
import tempfile
import zipfile
import shutil
from flask import Blueprint, request, jsonify, send_file
from werkzeug.utils import secure_filename
from PIL import Image
import time

converter_bp = Blueprint('converter', __name__)

# مجلد مؤقت لحفظ الملفات
TEMP_DIR = os.path.join(tempfile.gettempdir(), 'website_to_app')
os.makedirs(TEMP_DIR, exist_ok=True)

# قالب Android WebView
ANDROID_TEMPLATE = {
    'manifest': '''<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.websitetoapp.{package_name}">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="{app_name}"
        android:theme="@style/AppTheme">
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>''',
    
    'main_activity': '''package com.websitetoapp.{package_name};

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends Activity {{
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {{
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        webView = findViewById(R.id.webview);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.setWebViewClient(new WebViewClient());
        webView.loadUrl("{website_url}");
    }}
    
    @Override
    public void onBackPressed() {{
        if (webView.canGoBack()) {{
            webView.goBack();
        }} else {{
            super.onBackPressed();
        }}
    }}
}}''',
    
    'layout': '''<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical">

    <WebView
        android:id="@+id/webview"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />

</LinearLayout>''',
    
    'styles': '''<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="AppTheme" parent="android:Theme.Material.Light.DarkActionBar">
        <item name="android:colorPrimary">#2196F3</item>
        <item name="android:colorPrimaryDark">#1976D2</item>
        <item name="android:colorAccent">#FF4081</item>
    </style>
</resources>''',
    
    'gradle_app': '''apply plugin: 'com.android.application'

android {{
    compileSdkVersion 33
    defaultConfig {{
        applicationId "com.websitetoapp.{package_name}"
        minSdkVersion 21
        targetSdkVersion 33
        versionCode 1
        versionName "1.0"
    }}
    buildTypes {{
        release {{
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }}
    }}
}}

dependencies {{
    implementation 'androidx.appcompat:appcompat:1.6.1'
}}''',
    
    'gradle_project': '''buildscript {{
    repositories {{
        google()
        mavenCentral()
    }}
    dependencies {{
        classpath 'com.android.tools.build:gradle:7.4.2'
    }}
}}

allprojects {{
    repositories {{
        google()
        mavenCentral()
    }}
}}'''
}

def create_package_name(app_name):
    """إنشاء اسم حزمة صالح من اسم التطبيق"""
    # إزالة المسافات والأحرف الخاصة
    package_name = ''.join(c for c in app_name if c.isalnum()).lower()
    if not package_name:
        package_name = 'myapp'
    return package_name

def process_icon(icon_file, output_dir):
    """معالجة أيقونة التطبيق وإنشاء أحجام مختلفة"""
    try:
        # فتح الصورة
        img = Image.open(icon_file)
        
        # تحويل إلى RGB إذا كانت RGBA
        if img.mode == 'RGBA':
            img = img.convert('RGB')
        
        # أحجام الأيقونات المطلوبة لـ Android
        icon_sizes = {
            'mdpi': 48,
            'hdpi': 72,
            'xhdpi': 96,
            'xxhdpi': 144,
            'xxxhdpi': 192
        }
        
        # إنشاء مجلدات الأيقونات
        for density, size in icon_sizes.items():
            density_dir = os.path.join(output_dir, f'mipmap-{density}')
            os.makedirs(density_dir, exist_ok=True)
            
            # تغيير حجم الصورة
            resized_img = img.resize((size, size), Image.Resampling.LANCZOS)
            
            # حفظ الأيقونة
            icon_path = os.path.join(density_dir, 'ic_launcher.png')
            resized_img.save(icon_path, 'PNG')
        
        return True
    except Exception as e:
        print(f"خطأ في معالجة الأيقونة: {e}")
        return False

def create_android_project(app_name, website_url, icon_file=None):
    """إنشاء مشروع Android WebView"""
    try:
        # إنشاء معرف فريد للمشروع
        project_id = str(uuid.uuid4())
        project_dir = os.path.join(TEMP_DIR, project_id)
        
        # إنشاء هيكل المجلدات
        os.makedirs(project_dir, exist_ok=True)
        
        # إنشاء اسم الحزمة
        package_name = create_package_name(app_name)
        
        # إنشاء مجلدات المشروع
        app_dir = os.path.join(project_dir, 'app')
        src_dir = os.path.join(app_dir, 'src', 'main')
        java_dir = os.path.join(src_dir, 'java', 'com', 'websitetoapp', package_name)
        res_dir = os.path.join(src_dir, 'res')
        layout_dir = os.path.join(res_dir, 'layout')
        values_dir = os.path.join(res_dir, 'values')
        
        for directory in [app_dir, java_dir, layout_dir, values_dir]:
            os.makedirs(directory, exist_ok=True)
        
        # إنشاء ملف AndroidManifest.xml
        manifest_path = os.path.join(src_dir, 'AndroidManifest.xml')
        with open(manifest_path, 'w', encoding='utf-8') as f:
            f.write(ANDROID_TEMPLATE['manifest'].format(
                package_name=package_name,
                app_name=app_name
            ))
        
        # إنشاء MainActivity.java
        main_activity_path = os.path.join(java_dir, 'MainActivity.java')
        with open(main_activity_path, 'w', encoding='utf-8') as f:
            f.write(ANDROID_TEMPLATE['main_activity'].format(
                package_name=package_name,
                website_url=website_url
            ))
        
        # إنشاء activity_main.xml
        layout_path = os.path.join(layout_dir, 'activity_main.xml')
        with open(layout_path, 'w', encoding='utf-8') as f:
            f.write(ANDROID_TEMPLATE['layout'])
        
        # إنشاء styles.xml
        styles_path = os.path.join(values_dir, 'styles.xml')
        with open(styles_path, 'w', encoding='utf-8') as f:
            f.write(ANDROID_TEMPLATE['styles'])
        
        # إنشاء build.gradle للتطبيق
        app_gradle_path = os.path.join(app_dir, 'build.gradle')
        with open(app_gradle_path, 'w', encoding='utf-8') as f:
            f.write(ANDROID_TEMPLATE['gradle_app'].format(package_name=package_name))
        
        # إنشاء build.gradle للمشروع
        project_gradle_path = os.path.join(project_dir, 'build.gradle')
        with open(project_gradle_path, 'w', encoding='utf-8') as f:
            f.write(ANDROID_TEMPLATE['gradle_project'])
        
        # معالجة الأيقونة إذا تم توفيرها
        if icon_file:
            process_icon(icon_file, res_dir)
        
        # إنشاء ملف ZIP للمشروع
        zip_path = os.path.join(TEMP_DIR, f'{project_id}.zip')
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for root, dirs, files in os.walk(project_dir):
                for file in files:
                    file_path = os.path.join(root, file)
                    arcname = os.path.relpath(file_path, project_dir)
                    zipf.write(file_path, arcname)
        
        # تنظيف مجلد المشروع المؤقت
        shutil.rmtree(project_dir)
        
        return {
            'success': True,
            'project_id': project_id,
            'zip_path': zip_path,
            'package_name': package_name
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

@converter_bp.route('/convert', methods=['POST'])
def convert_website():
    """تحويل موقع ويب إلى تطبيق أندرويد"""
    try:
        # الحصول على البيانات
        app_name = request.form.get('app_name')
        website_url = request.form.get('website_url')
        
        if not app_name or not website_url:
            return jsonify({
                'success': False,
                'error': 'اسم التطبيق ورابط الموقع مطلوبان'
            }), 400
        
        # التحقق من صحة URL
        if not website_url.startswith(('http://', 'https://')):
            website_url = 'https://' + website_url
        
        # معالجة الأيقونة إذا تم تحميلها
        icon_file = None
        if 'icon' in request.files:
            icon = request.files['icon']
            if icon.filename != '':
                icon_file = icon
        
        # محاكاة وقت المعالجة
        time.sleep(2)
        
        # إنشاء مشروع Android
        result = create_android_project(app_name, website_url, icon_file)
        
        if result['success']:
            return jsonify({
                'success': True,
                'project_id': result['project_id'],
                'package_name': result['package_name'],
                'download_url': f'/api/download/{result["project_id"]}'
            })
        else:
            return jsonify({
                'success': False,
                'error': result['error']
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@converter_bp.route('/download/<project_id>')
def download_project(project_id):
    """تحميل مشروع Android"""
    try:
        zip_path = os.path.join(TEMP_DIR, f'{project_id}.zip')
        
        if not os.path.exists(zip_path):
            return jsonify({
                'success': False,
                'error': 'الملف غير موجود أو انتهت صلاحيته'
            }), 404
        
        return send_file(
            zip_path,
            as_attachment=True,
            download_name=f'android_project_{project_id}.zip',
            mimetype='application/zip'
        )
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@converter_bp.route('/status')
def status():
    """التحقق من حالة الخدمة"""
    return jsonify({
        'success': True,
        'message': 'خدمة التحويل تعمل بشكل طبيعي'
    })

