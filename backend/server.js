require('dotenv').config(); // โหลดค่า .env
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // อนุญาตให้ frontend ติดต่อ backend ได้

const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.JWT_SECRET || 'defaultsecret'; // คีย์สำหรับ JWT

// เชื่อมต่อฐานข้อมูล SQLite
const db = new sqlite3.Database('./userDB.db', (err) => {
    if (err) console.error(err.message);
    console.log('Connected to SQLite DB');
});

// สร้างตารางถ้ายังไม่มี
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
)`);

// API ลงทะเบียน
// API ลงทะเบียน
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบ' });
        }

        // ตรวจสอบว่า username มีอยู่ในฐานข้อมูลหรือไม่
        db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
            if (user) {
                return res.status(400).json({ message: 'ชื่อผู้ใช้นี้ถูกใช้ไปแล้ว' });
            }

            const encryptedPassword = await bcrypt.hash(password, 10);
            db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, encryptedPassword], function(err) {
                if (err) return res.status(400).json({ message: 'เกิดข้อผิดพลาดในการลงทะเบียน' });
                res.json({ message: 'ลงทะเบียนสำเร็จ' });
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// API เข้าสู่ระบบ
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบ' });

        db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
            res.json({ token });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Protected Route (เช็ค token)
app.get('/profile', verifyToken, (req, res) => {
    res.json({ message: 'ข้อมูลโปรไฟล์', userId: req.user.userId });
});

// Middleware ตรวจสอบ token
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'No token provided' });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Unauthorized' });
        req.user = decoded;
        next();
    });
}

//  Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
