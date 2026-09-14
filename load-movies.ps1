Write-Host "🎬 ЗАГРУЗКА ФИЛЬМОВ ИЗ TMDB" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan
Write-Host ""

# Проверяем структуру
if (!(Test-Path "backend/package.json")) {
    Write-Host "❌ Ошибка: Не найден backend/package.json" -ForegroundColor Red
    Write-Host "Запусти этот скрипт из папки cinema-app" -ForegroundColor Red
    Read-Host "Нажми Enter для выхода"
    exit 1
}

# Переходим в backend
Set-Location backend

# Проверяем node_modules
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Установка зависимостей..." -ForegroundColor Yellow
    npm install
}

Write-Host ""
Write-Host "🔄 Начинаю загрузку фильмов..." -ForegroundColor Green
Write-Host "Это может занять 5-10 минут, подожди..." -ForegroundColor Yellow
Write-Host ""

# Запускаем скрипт
node scripts/syncMovies.js

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ УСПЕШНО!" -ForegroundColor Green
    Write-Host "🎬 Фильмы загружены в MongoDB" -ForegroundColor Green
    Write-Host ""
    Write-Host "Что дальше:" -ForegroundColor Cyan
    Write-Host "1. Открой http://localhost:3000" -ForegroundColor White
    Write-Host "2. Перейди на /catalog" -ForegroundColor White
    Write-Host "3. Должны видеть 1000+ фильмов" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ ОШИБКА при загрузке!" -ForegroundColor Red
    Write-Host "Проверь:" -ForegroundColor Red
    Write-Host "- MongoDB запущена?" -ForegroundColor Yellow
    Write-Host "- API ключ правильный?" -ForegroundColor Yellow
    Write-Host "- Интернет подключен?" -ForegroundColor Yellow
    Write-Host ""
}

Read-Host "Нажми Enter для выхода"
