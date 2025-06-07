// server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Путь к файлу с отзывами
const DATA_FILE = path.join(__dirname, 'reviews.json');

// Разрешаем CORS и парсим JSON в теле запросов
app.use(cors());
app.use(express.json());
// Отдаём статику (HTML/CSS/JS) из папки public
app.use(express.static('public'));

// GET /api/reviews — вернуть все отзывы
app.get('/api/reviews', (req, res) => {
  // Если файл не существует, создаём с пустым массивом
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]');
  }
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  const reviews = JSON.parse(data);
  res.json(reviews);
});

// POST /api/reviews — добавить новый отзыв
app.post('/api/reviews', (req, res) => {
  const { name, category, rating, text } = req.body;

  // Простейшая валидация
  if (!name || !category || !rating || !text) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }

  // Читаем существующие отзывы
  const data = fs.existsSync(DATA_FILE)
    ? fs.readFileSync(DATA_FILE, 'utf8')
    : '[]';
  const reviews = JSON.parse(data);

  // Создаём новый отзыв
  const newReview = { name, category, rating: Number(rating), text, created: new Date() };
  reviews.push(newReview);

  // Сохраняем обратно в файл
  fs.writeFileSync(DATA_FILE, JSON.stringify(reviews, null, 2));

  // Отправляем клиенту добавленный объект
  res.status(201).json(newReview);
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});
