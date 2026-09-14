# 🎬 CinemaApp - Запущено!

## ⏳ Статус запуска

Docker контейнеры загружаются. Это может занять **2-3 минуты** в первый раз.

### Что сейчас происходит:
1. ⬇️ MongoDB образ скачивается (~400MB)
2. 🔨 Backend собирается (npm install)
3. 🔨 Frontend собирается (npm install)
4. ✅ Все запускаются

---

## 📋 Пока ждёшь, проверь:

### Docker Desktop
- Открой Docker Desktop (уже открыто у тебя)
- Перейди на вкладку **Containers**
- Должны появиться 3 контейнера:
  - `cinema_db` (MongoDB)
  - `cinema_backend` (Node.js)
  - `cinema_frontend` (Next.js)

### Проверка портов
```bash
# В PowerShell - проверь есть ли процессы на портах
netstat -ano | findstr :3000
netstat -ano | findstr :5000
netstat -ano | findstr :27017
```

---

## ✅ Когда всё готово

Ты увидишь в логах что-то вроде:
```
cinema_backend    | Server running on port 5000
cinema_frontend   | ready - started server on 0.0.0.0:3000
cinema_db         | Listening on 27017
```

---

## 🌐 Открой в браузере

### Главное приложение
👉 **http://localhost:3000**

### Backend API (для проверки)
👉 http://localhost:5000/api/health

Должно вернуть:
```json
{
  "status": "OK",
  "timestamp": "2024-..."
}
```

---

## 🧪 Первые тесты

### 1. Проверка здоровья сервиса
```bash
curl http://localhost:5000/api/health
```

### 2. Регистрация нового юзера
Открой http://localhost:3000 → нажми "Регистрация"

Заполни:
- Username: `testuser`
- Email: `test@example.com`
- Password: `password123`

### 3. Добавление фильмов
1. Войди как админ (нужно обновить role в БД)
2. Перейди на `/admin`
3. Нажми "➕ Добавить"
4. Заполни форму

---

## 📊 Просмотр логов

### Все логи
```bash
docker-compose logs -f
```

### Только backend
```bash
docker-compose logs -f backend
```

### Только frontend
```bash
docker-compose logs -f frontend
```

### Только MongoDB
```bash
docker-compose logs -f mongodb
```

---

## 🆘 Если что-то не работает

### Frontend не грузится
```bash
docker-compose logs frontend
# Ищи ошибки в Next.js
```

### Backend не отвечает
```bash
docker-compose logs backend
# Проверь подключение к MongoDB
```

### MongoDB не запущена
```bash
docker-compose logs mongodb
```

### Полный перезапуск
```bash
docker-compose down -v
docker-compose up -d
```

---

## 🔐 Важные учетные данные (только для разработки!)

**MongoDB:**
- Username: `admin`
- Password: `password123`
- URI: `mongodb://localhost:27017`

**JWT Secret:** `cinema_secret_key_2024_super_secure`

**TMDB API Key:** Уже вставлен в конфиг

---

## 📈 Следующие шаги

1. ✅ Убедись что всё запущено
2. ✅ Создай тестовый аккаунт
3. ✅ Добавь фильмы
4. ✅ Пригласи одноклассников!

---

## 📞 Команды помощи

| Команда | Описание |
|---------|---------|
| `docker-compose ps` | Статус контейнеров |
| `docker-compose logs -f` | Все логи в реальном времени |
| `docker-compose down` | Остановить |
| `docker-compose restart` | Перезагрузить |
| `docker-compose up -d` | Запустить в фоне |

---

**Время ожидания:** ⏱️ Примерно 2-3 минуты
**Статус:** 🟡 Загружается...
