const express = require('express');
const app = express();
app.use(express.json());

app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;
    console.log("تم استقبال البيانات:", username, email);
    res.json({ message: "تم التسجيل بنجاح!" });
});
app.use(express.static('images'));
const PORT = 3000;

// للسماح بقراءة البيانات المتبادلة

app.use(express.urlencoded({ extended: true }));

// تشغيل الملفات الثابتة الخاصة بموقعك (HTML, CSS, Images)
app.use(express.static(__dirname));

// صفحة تجريبية لربط كود الخادم
app.get('/api/test', (req, res) => {
    res.json({ message: "الخادم يعمل بنجاح!" });
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.listen(PORT, () => {
    console.log(`الخادم يعمل الآن على الرابط: http://localhost:${PORT}`);
});