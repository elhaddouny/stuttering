# Website to App Converter - محول المواقع إلى تطبيقات

نظام شامل لتحويل المواقع الإلكترونية إلى تطبيقات أندرويد قابلة للنشر على Google Play Store.

## الميزات الرئيسية

- ✅ تحويل أي موقع إلكتروني إلى تطبيق أندرويد
- ✅ واجهة مستخدم سهلة وبديهية باللغة العربية
- ✅ دعم تحميل أيقونات مخصصة
- ✅ إنشاء مشاريع Android Studio كاملة
- ✅ دعم جميع ميزات WebView
- ✅ جاهز للنشر على Google Play Store

## التقنيات المستخدمة

### الواجهة الأمامية
- React 18
- Vite
- Tailwind CSS
- Shadcn/UI Components
- Lucide React Icons

### الخادم الخلفي
- Python Flask
- PIL (Pillow) لمعالجة الصور
- Flask-CORS للتعامل مع CORS

### تطبيق الأندرويد
- Android WebView
- Java
- Android SDK

## هيكل المشروع

```
├── website-to-app-converter/     # الواجهة الأمامية (React)
│   ├── src/
│   │   ├── App.jsx              # المكون الرئيسي
│   │   └── components/          # مكونات UI
│   ├── package.json
│   └── vite.config.js
│
├── website-to-app-backend/       # الخادم الخلفي (Flask)
│   ├── src/
│   │   ├── main.py              # الملف الرئيسي
│   │   ├── routes/
│   │   │   └── converter.py     # API التحويل
│   │   └── static/              # ملفات الواجهة الأمامية
│   ├── requirements.txt
│   └── venv/
│
├── دليل_المستخدم.md              # دليل المستخدم الشامل
└── README.md                    # هذا الملف
```

## التشغيل السريع

### 1. تشغيل النظام الكامل

```bash
cd website-to-app-backend
source venv/bin/activate
python src/main.py
```

ثم افتح المتصفح على: `http://localhost:5000`

### 2. تطوير الواجهة الأمامية (اختياري)

```bash
cd website-to-app-converter
npm install
npm run dev
```

## كيفية الاستخدام

1. **إدخال المعلومات**: أدخل رابط الموقع واسم التطبيق
2. **تحميل الأيقونة** (اختياري): ارفع أيقونة مخصصة
3. **التحويل**: انقر على "تحويل إلى تطبيق"
4. **التحميل**: حمل مشروع Android Studio
5. **البناء**: افتح المشروع في Android Studio وابني APK
6. **النشر**: ارفع التطبيق على Google Play Store

## المتطلبات

- Python 3.8+
- Node.js 16+
- Android Studio (لبناء التطبيقات)
- حساب Google Play Console (للنشر)

## الدعم

راجع ملف `دليل_المستخدم.md` للحصول على دليل شامل ومفصل.

## الترخيص

هذا المشروع مفتوح المصدر ومتاح للاستخدام والتعديل.

---

تم تطويره بواسطة Manus AI

