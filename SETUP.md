# Инструкция по установке и запуску CinemaApp

## Требования

- Node.js 18+
- MongoDB 6.0+
- npm или yarn

## Способ 1: Локальный запуск (без Docker)

### 1. Клонируйте репозиторий и перейдите в папку

```bash
cd cinema-app
```

### 2. Установка Backend

```bash
cd backend
npm install
```

Создайте файл `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cinema
JWT_SECRET=your_super_secret_jwt_key_change_this
TMDB_API_KEY=your_tmdb_api_key_here
NODE_ENV=development
```

Запустите backend:

```bash
npm run dev
```

### 3. Установка Frontend

В новом терминале:

```bash
cd frontend
npm install
```

Создайте файл `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Запустите frontend:

```bash
npm run dev
```

### 4. Откройте браузер

Перейдите на `http://localhost:3000`

---

## Способ 2: Docker Compose (рекомендуется)

```bash
docker-compose up -d
```

Приложение будет доступно на:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`
- MongoDB: `localhost:27017`

---

## Получение API ключей

### TMDb API Key

1. Перейдите на https://www.themoviedb.org/settings/api
2. Зарегистрируйтесь и создайте API ключ
3. Добавьте ключ в `.env` файл backend

---

## Функции приложения

### Пользователь

- ✅ Регистрация и авторизация
- ✅ Просмотр каталога фильмов по типам (фильмы, сериалы, аниме, мультфильмы)
- ✅ Поиск и фильтрация по жанрам
- ✅ Просмотр информации о фильме
- ✅ Видеоплеер для просмотра
- ✅ Добавление в избранное
- ✅ История просмотров
- ✅ Оставление оценок и комментариев
- ✅ Личный кабинет

### Администратор

- ✅ Админ-панель
- ✅ Просмотр статистики
- ✅ Управление пользователями
- ✅ Управление фильмами (добавление, удаление, редактирование)
- ✅ Модерация комментариев
- ✅ Просмотр аналитики

---

## Структура проекта

```
cinema-app/
├── backend/
│   ├── models/              # MongoDB модели
│   │   ├── User.js
│   │   ├── Movie.js
│   │   └── Comment.js
│   ├── routes/              # API маршруты
│   │   ├── auth.js
│   │   ├── movies.js
│   │   ├── user.js
│   │   ├── comments.js
│   │   └── admin.js
│   ├── middleware/          # Middleware
│   │   ├── auth.js
│   │   └── adminAuth.js
│   ├── server.js            # Главный файл
│   ├── package.json
│   └── Dockerfile
│
├── frontend/
│   ├── pages/               # Next.js страницы
│   │   ├── index.js         # Главная страница
│   │   ├── catalog.js       # Каталог
│   │   ├── login.js         # Вход
│   │   ├── register.js      # Регистрация
│   │   ├── profile.js       # Профиль
│   │   ├── favorites.js     # Избранное
│   │   ├── history.js       # История
│   │   ├── admin.js         # Админ-панель
│   │   ├── movie/
│   │   │   └── [id].js      # Страница фильма
│   │   ├── _app.js
│   │   └── _document.js
│   ├── components/          # React компоненты
│   │   ├── Header.js
│   │   ├── Layout.js
│   │   └── MovieCard.js
│   ├── utils/
│   │   └── api.js           # API клиент
│   ├── store/
│   │   └── authStore.js     # Zustand store
│   ├── styles/
│   │   └── globals.css      # Глобальные стили
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── Dockerfile
│
├── docker-compose.yml
├── README.md
└── SETUP.md
```

---

## API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `GET /api/auth/me` - Текущий пользователь

### Фильмы
- `GET /api/movies` - Все фильмы с фильтрами
- `GET /api/movies/:id` - Информация о фильме
- `GET /api/movies/genre/:genre` - Фильмы по жанру

### Пользователь
- `GET /api/user/profile` - Профиль
- `POST /api/user/favorites/:movieId` - Добавить в избранное
- `DELETE /api/user/favorites/:movieId` - Удалить из избранного
- `POST /api/user/watch-history` - Добавить в историю
- `GET /api/user/watch-history` - История просмотров
- `GET /api/user/recommendations` - Рекомендации

### Комментарии
- `GET /api/comments/:movieId` - Комментарии фильма
- `POST /api/comments/:movieId` - Создать комментарий
- `PUT /api/comments/:commentId` - Редактировать
- `DELETE /api/comments/:commentId` - Удалить
- `POST /api/comments/:commentId/like` - Лайк

### Администратор
- `GET /api/admin/users` - Все пользователи
- `DELETE /api/admin/users/:userId` - Удалить пользователя
- `GET /api/admin/stats` - Статистика
- `POST /api/admin/movies` - Добавить фильм
- `PUT /api/admin/movies/:movieId` - Редактировать фильм
- `DELETE /api/admin/movies/:movieId` - Удалить фильм
- `GET /api/admin/comments` - Все комментарии
- `DELETE /api/admin/comments/:commentId` - Удалить комментарий

---

## Использованные технологии

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Axios

### Frontend
- React 18
- Next.js 14
- Tailwind CSS
- Zustand (State Management)
- Axios

---

## Лицензия

MIT

---

## Контакты

Вопросы или предложения? Свяжитесь с разработчиком.
