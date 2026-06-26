require('dotenv').config();
const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// โหลด API Key จาก .env
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ให้ Express เปิดไฟล์ในโฟลเดอร์ public (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// API สำหรับรับข้อความจากหน้าเว็บ ส่งไปให้ Gemini แล้วส่งกลับ
app.post('/api/chat', async (req, res) => {
    try {
        const { prompt } = req.body;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        res.json({ reply: response.text });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการประมวลผล' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});