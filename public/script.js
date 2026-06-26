const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    // 1. แสดงข้อความผู้ใช้
    appendMessage(text, 'user-msg');
    userInput.value = '';
    
    // 2. ปิดปุ่มกันกดรัวๆ
    sendBtn.disabled = true;
    sendBtn.innerText = 'กำลังคิด...';

    try {
        // 3. ส่งไปหา Backend ของเรา (server.js)
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: text })
        });

        const data = await response.json();
        
        // 4. แสดงข้อความตอบกลับจาก AI
        if (data.reply) {
            appendMessage(data.reply, 'ai-msg');
        } else {
            appendMessage('เกิดข้อผิดพลาด: ไม่ได้รับข้อความตอบกลับ', 'ai-msg');
        }
    } catch (error) {
        appendMessage('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้', 'ai-msg');
    } finally {
        // 5. เปิดปุ่มให้ใช้งานต่อ
        sendBtn.disabled = false;
        sendBtn.innerText = 'ส่ง';
        userInput.focus();
    }
}

function appendMessage(text, className) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', className);
    
    // แปลงการขึ้นบรรทัดใหม่ให้เป็น <br> ใน HTML
    msgDiv.innerHTML = text.replace(/\n/g, '<br>'); 
    
    chatBox.appendChild(msgDiv);
    // เลื่อนจอลงมาล่างสุดอัตโนมัติ
    chatBox.scrollTop = chatBox.scrollHeight;
}

// ผูกการทำงานกับปุ่มคลิก และการกดปุ่ม Enter
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault(); // ป้องกันการขึ้นบรรทัดใหม่
        sendMessage();
    }
});