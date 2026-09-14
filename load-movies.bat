@echo off
REM Скрипт для загрузки фильмов из TMDb в MongoDB

echo 🎬 ЗАГРУЗКА ФИЛЬМОВ ИЗ TMDB
echo =============================
echo.

REM Проверяем что мы в правильной папке
if not exist "backend\package.json" (
    echo ❌ Ошибка: Не найден backend\package.json
    echo Запусти этот скрипт из папки cinema-app
    pause
    exit /b 1
)

REM Переходим в backend
cd backend

REM Проверяем node_modules
if not exist "node_modules" (
    echo 📦 Установка зависимостей...
    call npm install
)

REM Запускаем скрипт загрузки
echo.
echo 🔄 Начинаю загрузку фильмов...
echo Это может занять 5-10 минут, подожди...
echo.

call node scripts/syncMovies.js

if %errorlevel% equ 0 (
    echo.
    echo ✅ УСПЕШНО!
    echo 🎬 Фильмы загружены в MongoDB
    echo.
    echo Что дальше:
    echo 1. Открой http://localhost:3000
    echo 2. Перейди на /catalog
    echo 3. Должны видеть 1000+ фильмов
    echo.
) else (
    echo.
    echo ❌ ОШИБКА при загрузке!
    echo Проверь:
    echo - MongoDB запущена?
    echo - API ключ правильный?
    echo - Интернет подключен?
    echo.
)

pause
