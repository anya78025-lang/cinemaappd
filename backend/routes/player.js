const express = require('express');
const router = express.Router();
const https = require('https');
const http = require('http');

/**
 * Шаг 1: GET /api/player/aniboom/:anime_id
 * Получает ссылку на ANIBOOM плеер через Shikimori API (для аниме)
 * 
 * Как работает:
 * 1. Получаем ID аниме от фронтенда
 * 2. Обращаемся к Shikimori API для получения информации об аниме
 * 3. Ищем ссылки на видео в Shikimori
 * 4. Если не найдено, используем Kodik API как фаллбек
 * 5. Возвращаем ссылку на ANIBOOM плеер
 */

/**
 * FALLBACK: Локальная база видео (кэш)
 * Используется если внешние API недоступны
 */
const localVideoCache = {
  76120: {
    title: 'Магическая Битва / Jujutsu Kaisen',
    link: 'https://aniboom.one/anime/76120'
  },
  1: {
    title: 'Ковбой Бибоп / Cowboy Bebop',
    link: 'https://aniboom.one/anime/1'
  },
  2: {
    title: 'Евангелион',
    link: 'https://aniboom.one/anime/30'
  }
};

// Функция для HTTP/HTTPS запросов с таймаутом
const makeRequest = (url, timeout = 5000) => {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const request = protocol.get(url, { 
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      }
    }, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(null);
        }
      });
    });
    
    request.on('error', (error) => {
      reject(error);
    });
    
    // Таймаут (по умолчанию 5 секунд)
    const timer = setTimeout(() => {
      request.destroy();
      reject(new Error(`Timeout after ${timeout}ms`));
    }, timeout);
    
    request.on('response', () => clearTimeout(timer));
  });
};

/**
 * MOCK ANIBOOM ПЛЕЕР (для локального тестирования без интернета)
 * Возвращает тестовую ссылку на HTML5 видео плеер
 */
const getMockAniboomLink = (anime_id) => {
  // Формируем простой HTML (не через base64, чтобы не было кодировок)
  const htmlContent = `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ANIBOOM Mock Player</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      background: #000; 
      font-family: Arial, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 20px;
    }
    .container {
      text-align: center;
      max-width: 600px;
    }
    .player-mock {
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      border: 3px solid #dc2626;
      border-radius: 12px;
      padding: 60px 40px;
      margin-bottom: 30px;
      box-shadow: 0 0 30px rgba(220, 38, 38, 0.3);
    }
    .play-icon {
      font-size: 80px;
      margin-bottom: 20px;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }
    h2 {
      color: #dc2626;
      font-size: 28px;
      margin-bottom: 15px;
      text-shadow: 0 0 10px rgba(220, 38, 38, 0.5);
    }
    .info {
      color: #999;
      font-size: 14px;
      line-height: 1.8;
    }
    .anime-id {
      color: #fff;
      font-size: 16px;
      margin-top: 10px;
      font-weight: bold;
    }
    .message {
      color: #fbbf24;
      font-size: 13px;
      margin-top: 20px;
      padding: 15px;
      background: rgba(251, 191, 36, 0.1);
      border-left: 3px solid #fbbf24;
      text-align: left;
      border-radius: 4px;
    }
    .controls {
      display: flex;
      gap: 10px;
      justify-content: center;
      margin-top: 30px;
    }
    button {
      padding: 12px 30px;
      border: 2px solid #dc2626;
      background: #dc2626;
      color: white;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s;
      font-size: 14px;
    }
    button:hover {
      background: #991b1b;
      box-shadow: 0 0 15px rgba(220, 38, 38, 0.5);
    }
    button.secondary {
      background: transparent;
      color: #dc2626;
    }
    button.secondary:hover {
      background: rgba(220, 38, 38, 0.1);
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="player-mock">
      <div class="play-icon">▶️</div>
      <h2>ANIBOOM Тестовый Плеер</h2>
      <div class="anime-id">ID: ${anime_id}</div>
      <div class="info">
        <p>Тестовый режим (без интернета)</p>
        <p>Реальное видео загружается при подключении</p>
      </div>
    </div>
    
    <div class="message">
      ⚠️ Это тестовый плеер для локального тестирования.<br>
      Для просмотра реального видео необходимо подключение к интернету.
    </div>

    <div class="controls">
      <button onclick="location.reload()">🔄 Перезагрузить</button>
      <button class="secondary" onclick="window.open('https://aniboom.one', '_blank')">🌐 ANIBOOM</button>
    </div>
  </div>

  <script>
    console.log('Mock ANIBOOM player loaded for anime:', ${anime_id});
    console.log('Waiting for internet connection to load real video...');
  </script>
</body>
</html>
  `;

  // Кодируем в base64, но с правильной кодировкой
  return `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`;
};

/**
 * Основной маршрут для получения плеера ANIBOOM
 */
router.get('/aniboom/:anime_id', async (req, res) => {
  try {
    const { anime_id } = req.params;
    const startTime = Date.now();
    
    if (!anime_id) {
      return res.status(400).json({ 
        success: false, 
        error: 'Не указан anime_id' 
      });
    }

    console.log(`🎬 [ANIBOOM] Ищу видео для аниме ID: ${anime_id}`);

    // ===== ПОПЫТКА 1: Локальный кэш (быстрый fallback) =====
    console.log(`💾 [LOCAL CACHE] Проверяю локальную базу...`);
    if (localVideoCache[anime_id]) {
      const cacheTime = Date.now() - startTime;
      console.log(`✅ [LOCAL CACHE] Найдено в кэше за ${cacheTime}ms`);
      
      return res.json({
        success: true,
        link: localVideoCache[anime_id].link,
        source: 'local-cache',
        title: localVideoCache[anime_id].title,
        loadTime: cacheTime
      });
    }

    // ===== ПОПЫТКА 2: Shikimori API (рекомендуется для аниме) =====
    console.log(`📡 [Shikimori] Запрашиваю информацию об аниме... (таймаут 4сек)`);
    
    try {
      const shikimoriUrl = `https://shikimori.me/api/animes/${anime_id}`;
      const animeData = await makeRequest(shikimoriUrl, 4000);
      const shikimoriTime = Date.now() - startTime;
      
      if (animeData && animeData.id) {
        if (animeData.url) {
          console.log(`✅ [Shikimori] Найдена ссылка за ${shikimoriTime}ms: ${animeData.url}`);
          const aniboomLink = `https://aniboom.one/anime/${animeData.id}`;
          
          return res.json({ 
            success: true, 
            link: aniboomLink,
            source: 'shikimori',
            title: animeData.name,
            loadTime: shikimoriTime
          });
        }
      }
    } catch (err) {
      const shikimoriTime = Date.now() - startTime;
      console.warn(`⚠️ [Shikimori] Ошибка за ${shikimoriTime}ms:`, err.message);
    }

    // ===== ПОПЫТКА 3: Kodik API (как фаллбек) =====
    console.log(`📡 [Kodik] Ищу видео в Kodik... (таймаут 4сек)`);
    
    try {
      const kodikToken = 'thpVK7d6Xfe8m';
      const kodikUrl = `https://kodikapi.com/search?token=${kodikToken}&kinopoisk_id=${anime_id}&limit=1`;
      const kodikData = await makeRequest(kodikUrl, 4000);
      const kodikTime = Date.now() - startTime;
      
      if (kodikData && kodikData.results && kodikData.results[0] && kodikData.results[0].link) {
        let playerLink = kodikData.results[0].link;
        
        if (playerLink.startsWith('//')) {
          playerLink = 'https:' + playerLink;
        }
        
        console.log(`✅ [Kodik] Найдена ссылка за ${kodikTime}ms: ${playerLink}`);
        
        return res.json({ 
          success: true, 
          link: playerLink,
          source: 'kodik',
          loadTime: kodikTime
        });
      }
    } catch (err) {
      const kodikTime = Date.now() - startTime;
      console.warn(`⚠️ [Kodik] Ошибка за ${kodikTime}ms:`, err.message);
    }

    // ===== FALLBACK: Используем Mock плеер для локального тестирования =====
    const totalTime = Date.now() - startTime;
    console.log(`⚠️ Используем Mock ANIBOOM плеер (общее время: ${totalTime}ms)`);
    const mockLink = getMockAniboomLink(anime_id);
    
    res.json({ 
      success: true,
      link: mockLink,
      source: 'mock',
      loadTime: totalTime,
      message: '⚠️ Mock плеер (нет интернета)'
    });

  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error(`❌ Критическая ошибка за ${totalTime}ms:`, error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      loadTime: totalTime
    });
  }
});

/**
 * Дополнительный маршрут для поиска по названию аниме
 * GET /api/player/search?title=название
 */
router.get('/search', async (req, res) => {
  try {
    const { title } = req.query;
    
    if (!title) {
      return res.status(400).json({ 
        success: false, 
        error: 'Не указано название' 
      });
    }

    console.log(`🔍 Ищу аниме по названию: "${title}"`);

    // Ищем в Shikimori по названию
    const searchUrl = `https://shikimori.me/api/animes?search=${encodeURIComponent(title)}&limit=5`;
    const results = await makeRequest(searchUrl);
    
    if (results && Array.isArray(results) && results.length > 0) {
      const matches = results.map(anime => ({
        id: anime.id,
        title: anime.name,
        image: anime.image?.original,
        russian: anime.russian
      }));
      
      return res.json({ 
        success: true, 
        results: matches 
      });
    }

    res.json({ 
      success: false, 
      results: [],
      message: 'Аниме не найдено'
    });

  } catch (error) {
    console.error('❌ Ошибка в поиске:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;

