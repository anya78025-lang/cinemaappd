# 🎬 КАК ЗАПУСТИТЬ ПРИЛОЖЕНИЕ

## ✅ ТРЕБОВАНИЯ
- Docker и Docker Compose
- Node.js 16+
- npm

## 📝 ЭТАП 1: Запуск Docker контейнеров

```bash
cd cinema-app
docker-compose up -d
```

Это запустит:
- **MongoDB** на порту 27017 (логин: admin / пароль: password123)
- **Backend API** на http://localhost:5000
- **Frontend** на http://localhost:3000

Проверь что все контейнеры запущены:
```bash
docker-compose ps
```

## 📥 ЭТАП 2: Загрузка фильмов в БД

```bash
cd backend
npm install
$env:MONGODB_URI='mongodb://admin:password123@localhost:27017/cinema?authSource=admin'
node scripts/loadRealMovies.js
```

Это загрузит ~40+ реальных фильмов и сериалов из TMDb API с реальными постерами!

## 🚀 ЭТАП 3: Запуск Frontend

```bash
cd frontend
npm install
npm run dev
```

Приложение откроется на http://localhost:3000

## 🌐 ИНТЕРФЕЙС

### Главная страница
- Популярные фильмы с реальными постерами
- Быстрые ссылки на категории

### Категории
- **🎥 Фильмы** - все фильмы
- **📺 Сериалы** - все сериалы  
- **🎨 Аниме** - аниме и манга адаптации
- **❤️ Избранное** - твои любимые
- **👤 Профиль** - мой профиль

### Сайдбар
- Темный (чёрный) фон с красной графикой
- Быстрая навигация
- На мобильных: нажми ☰ МЕНЮ для открытия

## 🎥 ПРОСМОТР ФИЛЬМА

1. Клик на постер любого фильма
2. Видишь полную информацию:
   - Постер
   - Описание
   - Рейтинг
   - Жанры
   - Кнопка "▶️ СМОТРЕТЬ"
3. Видны комментарии других пользователей

## ⚙️ КОМАНДЫ

Стартовать всё:
```bash
docker-compose up -d
cd backend && npm install && node scripts/loadRealMovies.js
cd ../frontend && npm install && npm run dev
```

Остановить:
```bash
docker-compose down
```

Очистить БД:
```bash
docker exec cinema_db mongosh --username admin --password password123 --authenticationDatabase admin --eval "db.dropDatabase()"
```

## 🐛ПРОБЛЕМЫ

**Картинки не грузят?**
- Проверь интернет соединение (используются реальные URLs с TMDb)
- Попробуй перезагрузить страницу (F5)

**Приложение не запускается?**
- Проверь что Docker запущен
- Проверь что нет ошибок: `docker-compose logs`

**БД не подключается?**
- Убедись что контейнер MongoDB запущен: `docker ps`
- Проверь пароль (должен быть: password123)

## 📊 API ЭНДПОИНТЫ

```
GET  /api/movies              - получить фильмы
GET  /api/movies/:id          - одного фильма
GET  /api/comments/:movieId   - комментарии фильма
```

---

**Всё готово! Наслаждайся просмотром!** 🍿🎬
