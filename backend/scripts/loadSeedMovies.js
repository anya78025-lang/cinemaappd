const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Movie = require('../models/Movie');

async function loadSeedMovies() {
  try {
    console.log('🔄 Подключение к MongoDB...');
    
    const mongoUri = process.env.MONGODB_URI || 'mongodb://admin:password123@localhost:27017/cinema?authSource=admin';
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB подключена');

    // Читаем seed файл
    const seedPath = path.join(__dirname, '../../seed-movies.json');
    const seedData = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
    
    console.log(`\n📥 Загружаю ${seedData.length} фильмов...`);
    
    let count = 0;
    for (const movieData of seedData) {
      try {
        const existing = await Movie.findOne({ tmdbId: movieData.tmdbId });
        
        if (!existing) {
          const movie = new Movie(movieData);
          await movie.save();
          console.log(`  ✓ ${movieData.title}`);
          count++;
        } else {
          console.log(`  ⊘ ${movieData.title} (уже существует)`);
        }
      } catch (err) {
        console.error(`  ✗ ${movieData.title}: ${err.message}`);
      }
    }
    
    console.log(`\n✅ Загружено: ${count} фильмов`);
    
  } catch (err) {
    console.error('❌ Ошибка:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Отключение от MongoDB...');
  }
}

loadSeedMovies();
