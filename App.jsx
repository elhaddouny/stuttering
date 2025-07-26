import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Upload, Smartphone, Download, Globe, Settings, CheckCircle } from 'lucide-react'
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    websiteUrl: '',
    appName: '',
    iconFile: null
  })
  const [isConverting, setIsConverting] = useState(false)
  const [conversionComplete, setConversionComplete] = useState(false)
  const [iconPreview, setIconPreview] = useState(null)
  const [downloadUrl, setDownloadUrl] = useState('')
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleIconUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        iconFile: file
      }))
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setIconPreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleConvert = async () => {
    if (!formData.websiteUrl || !formData.appName) {
      alert('يرجى ملء جميع الحقول المطلوبة')
      return
    }

    setIsConverting(true)
    setError('')
    
    try {
      // إنشاء FormData لإرسال البيانات والملفات
      const formDataToSend = new FormData()
      formDataToSend.append('website_url', formData.websiteUrl)
      formDataToSend.append('app_name', formData.appName)
      
      if (formData.iconFile) {
        formDataToSend.append('icon', formData.iconFile)
      }

      // إرسال الطلب إلى الخادم الخلفي
      const response = await fetch('http://localhost:5000/api/convert', {
        method: 'POST',
        body: formDataToSend
      })

      const result = await response.json()

      if (result.success) {
        setDownloadUrl(`http://localhost:5000${result.download_url}`)
        setConversionComplete(true)
      } else {
        setError(result.error || 'حدث خطأ أثناء التحويل')
      }
    } catch (err) {
      setError('فشل في الاتصال بالخادم')
      console.error('Error:', err)
    } finally {
      setIsConverting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      websiteUrl: '',
      appName: '',
      iconFile: null
    })
    setIconPreview(null)
    setConversionComplete(false)
    setIsConverting(false)
    setDownloadUrl('')
    setError('')
  }

  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Smartphone className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">محول المواقع إلى تطبيقات</h1>
          </div>
          <p className="text-xl text-gray-600">حول موقعك الإلكتروني إلى تطبيق أندرويد في دقائق</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {!conversionComplete ? (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-6 w-6 mr-2 text-blue-600" />
                معلومات التطبيق
              </CardTitle>
              <CardDescription>
                أدخل رابط موقعك واختر اسم التطبيق والأيقونة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Website URL */}
              <div className="space-y-2">
                <Label htmlFor="websiteUrl">رابط الموقع الإلكتروني *</Label>
                <Input
                  id="websiteUrl"
                  name="websiteUrl"
                  type="url"
                  placeholder="https://example.com"
                  value={formData.websiteUrl}
                  onChange={handleInputChange}
                  className="text-left"
                  dir="ltr"
                />
              </div>

              {/* App Name */}
              <div className="space-y-2">
                <Label htmlFor="appName">اسم التطبيق *</Label>
                <Input
                  id="appName"
                  name="appName"
                  type="text"
                  placeholder="اسم التطبيق الذي سيظهر على الهاتف"
                  value={formData.appName}
                  onChange={handleInputChange}
                />
              </div>

              {/* Icon Upload */}
              <div className="space-y-2">
                <Label htmlFor="iconFile">أيقونة التطبيق (اختياري)</Label>
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="flex-1">
                    <Input
                      id="iconFile"
                      type="file"
                      accept="image/*"
                      onChange={handleIconUpload}
                      className="cursor-pointer"
                    />
                  </div>
                  {iconPreview && (
                    <div className="w-16 h-16 rounded-lg border-2 border-gray-200 overflow-hidden">
                      <img 
                        src={iconPreview} 
                        alt="معاينة الأيقونة" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  يُفضل أن تكون الأيقونة مربعة الشكل بحجم 512x512 بكسل أو أكبر
                </p>
              </div>

              {/* Convert Button */}
              <Button 
                onClick={handleConvert}
                disabled={isConverting || !formData.websiteUrl || !formData.appName}
                className="w-full h-12 text-lg"
              >
                {isConverting ? (
                  <>
                    <Settings className="h-5 w-5 mr-2 animate-spin" />
                    جاري التحويل...
                  </>
                ) : (
                  <>
                    <Smartphone className="h-5 w-5 mr-2" />
                    تحويل إلى تطبيق
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Success Screen */
          <Card className="w-full">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-700">تم التحويل بنجاح!</CardTitle>
              <CardDescription>
                تم إنشاء مشروع أندرويد "{formData.appName}" بنجاح
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">معلومات المشروع:</h3>
                <ul className="space-y-1 text-green-700">
                  <li><strong>اسم التطبيق:</strong> {formData.appName}</li>
                  <li><strong>الموقع:</strong> {formData.websiteUrl}</li>
                  <li><strong>نوع الملف:</strong> مشروع Android Studio</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleDownload} className="flex-1 h-12">
                  <Download className="h-5 w-5 mr-2" />
                  تحميل مشروع Android
                </Button>
                <Button variant="outline" onClick={resetForm} className="flex-1 h-12">
                  إنشاء تطبيق جديد
                </Button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">خطوات بناء التطبيق:</h3>
                <ol className="list-decimal list-inside space-y-1 text-blue-700 text-sm">
                  <li>تحميل وتثبيت Android Studio</li>
                  <li>فتح المشروع المحمل في Android Studio</li>
                  <li>بناء المشروع (Build → Build Bundle(s) / APK(s) → Build APK(s))</li>
                  <li>العثور على ملف APK في مجلد app/build/outputs/apk/</li>
                  <li>اختبار التطبيق على جهاز أندرويد</li>
                </ol>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">خطوات النشر على Google Play:</h3>
                <ol className="list-decimal list-inside space-y-1 text-yellow-700 text-sm">
                  <li>إنشاء حساب مطور على Google Play Console</li>
                  <li>دفع رسوم التسجيل (25 دولار أمريكي)</li>
                  <li>توقيع التطبيق رقمياً</li>
                  <li>تحميل ملف APK إلى Play Console</li>
                  <li>ملء معلومات التطبيق والوصف</li>
                  <li>إرسال التطبيق للمراجعة</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Globe className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">سهولة الاستخدام</h3>
              <p className="text-gray-600 text-sm">
                فقط أدخل رابط موقعك واحصل على مشروع أندرويد جاهز في دقائق
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Smartphone className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">متوافق مع الأندرويد</h3>
              <p className="text-gray-600 text-sm">
                المشاريع المُنشأة متوافقة مع جميع أجهزة الأندرويد الحديثة
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Upload className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">جاهز للبناء</h3>
              <p className="text-gray-600 text-sm">
                مشروع Android Studio كامل جاهز للبناء والنشر
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default App

