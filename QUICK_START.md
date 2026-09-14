# 🚀 Быстрый старт CinemaApp

## ⚡ За 3 минуты

### Способ 1: Docker Compose (рекомендуется)

1. **Убедись что Docker Desktop запущен**

2. **Перейди в папку проекта:**
```bash
cd c:\Users\Пользователь\Desktop\Новая папка (5)\cinema-app
```

3. **Запусти контейнеры:**
```bash
docker-compose up -d
```

4. **Жди 1-2 минуты, пока контейнеры стартуют**

5. **Открой браузер:**
   - 🌐 Frontend: http://localhost:3000
   - 🔌 Backend API: http://localhost:5000
   - 🗄️ MongoDB: localhost:27017

---

## 🧪 Тестирование

### Создание тестовых аккаунтов

**Обычный пользователь:**
1. Нажми "Регистрация"
2. Заполни данные:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
3. Готово! Ты вошел

**Админ аккаунт:**
1. Создай обычного юзера как выше
2. Откройте MongoDB Compass или терминал
3. Найди юзера и установи `role: 'admin'`
4. Перезагрузи страницу

---

## 📊 Добавление фильмов

### Способ 1: Через админ-панель
1. Войди как админ
2. Перейди в админ-панель
3. Нажми "➕ Добавить"
4. Заполни форму и сохрани

### Способ 2: Синхронизация с TMDb
```bash
# В терминале (в папке backend)
curl -X POST http://localhost:5000/api/movies/sync-tmdb \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

---

## 🔧 Команды Docker

**Просмотр логов:**
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

**Остановка:**
```bash
docker-compose down
```

**Остановка с удалением данных:**
```bash
docker-compose down -v
```

**Пересборка:**
```bash
docker-compose down
docker-compose up -d --build
```

---

## 🐛 Если что-то не работает

### Frontend не загружается
```bash
docker-compose logs frontend
```

### Backend не подключается к БД
```bash
docker-compose logs backend
```

### MongoDB не запускается
```bash
docker-compose logs mongodb
```

**Полный перезапуск:**
```bash
docker-compose down -v
docker-compose up -d --build
```

---

## 💾 Локальный запуск (без Docker)

### Backend
```bash
cd backend
npm install
# Отредактируй .env
npm run dev
```

### Frontend (в новом терминале)
```bash
cd frontend
npm install
npm run dev
```

---

## 📱 Доступные страницы

| Страница | URL | Описание |
|----------|-----|---------|
| Главная | `/` | Популярные фильмы |
| Каталог | `/catalog` | Все фильмы с фильтрами |
| Фильм | `/movie/:id` | Информация и просмотр |
| Вход | `/login` | Авторизация |
| Регистрация | `/register` | Создание аккаунта |
| Профиль | `/profile` | Мой профиль |
| Избранное | `/favorites` | Любимые фильмы |
| История | `/history` | История просмотров |
| Админ | `/admin` | Админ-панель (только для админов) |

---

## ✅ Чек-лист готовности

- [ ] Docker Desktop запущен
- [ ] Проект в папке `cinema-app`
- [ ] Файл `docker-compose.yml` на месте
- [ ] Файлы `.env` созданы
- [ ] Все контейнеры запущены (`docker-compose ps`)
- [ ] Frontend доступен на `http://localhost:3000`
- [ ] Backend отвечает на `http://localhost:5000/api/health`
- [ ] Можешь зарегистрироваться

---

## 🎬 Готово!

Теперь просто открывай http://localhost:3000 и наслаждайся! 🍿

Есть вопросы? Проверь логи или перезагрузи контейнеры.
