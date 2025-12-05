# Sudoku Android Native App

React Native + Expo ile yapılmış cyberpunk temalı Sudoku oyunu. Türkçe ve İngilizce dil desteği, leaderboard sistemi, AsyncStorage ile oyun kaydı.

## Özellikler

- 🎮 **Oyun Mekanikları**
  - Geçerli Sudoku bulmacaları (backtracking algoritması)
  - 3 zorluk seviyesi (Kolay, Orta, Zor)
  - Not sistemi (kalem modu)
  - İpucu sistemi
  - Sistem bütünlüğü (scoring)

- 🌍 **Dil Desteği**
  - Türkçe (TR)
  - İngilizce (EN)
  - Ayarlar ekranında dil değiştirme
  - AsyncStorage ile tercih kaydetme

- 🏆 **Leaderboard**
  - Sunucudan ilk 50 oyuncu başarısını getir
  - Oyuncu sıralaması gösterimi (🥇 🥈 🥉)
  - Kişisel başarı kartı (sizin sıranız)
  - 30 saniye otomatik yenileme
  - IP adresi tabanlı oyuncu takibi

- 📱 **Interface**
  - Bottom tab navigator (Oyun / Leaderboard / Ayarlar)
  - Cyberpunk tema (Koyu mavi, Neon cyan)
  - Responsive tasarım
  - iOS/Android optimizasyonu

- ⚙️ **Ayarlar**
  - Ses efektleri toggle
  - Titreşim toggle
  - Yerel verileri temizle
  - Uygulama bilgileri

## Kurulum Adımları

### Ön Koşullar

- **Node.js 18+**: https://nodejs.org/
- **npm** veya **yarn** (Node ile birlikte gelir)
- **Expo CLI**: `npm install -g expo-cli` (kurulum sonrası)
- **Android Emulator** veya **Fiziksel Android Cihaz**
  - Emulator: Android Studio SDK Manager
  - Fiziksel: USB Debugging açılı

### 1. Node.js Kurulumu

Windows için:
```powershell
# Sürümü kontrol et
node --version    # v18+ olmalı
npm --version     # 9+ olmalı
```

### 2. Proje Bağımlılıklarını Yükle

```powershell
# Proje dizinine git
cd "g:\Drive'ım\Web Projects\sudoku-android"

# Bağımlılıkları yükle
npm install
```

Bu işlem 5-10 dakika sürebilir. Tamamlandığında `node_modules` klasörü oluşacak.

### 3. Expo CLI Kurulumu

```powershell
npm install -g expo-cli
```

### 4. Uygulamayı Başlat

#### Seçenek A: Expo Go (Hızlı Test)

```powershell
npm start
# veya
expo start
```

**QR kod** göreceksin. Cihazında:
- **Android**: Google Play Store'dan "Expo Go" indir → QR kod tarafından oku
- Uygulama otomatik yüklenecek

#### Seçenek B: Android Emulator

```powershell
# Emulator'ü aç (Android Studio)
npm start

# Emulator'de açmak için: 'a' tuşu + Enter
```

#### Seçenek C: Fiziksel Cihaz

```powershell
# USB Debugging açık olduğundan emin ol
npm start

# Komutta şu talimatı izle veya sağ tıkla → QR'ı oku
```

## Yapı (Project Structure)

```
sudoku-android/
├── index.ts                    # Uygulama giriş noktası
├── app.json                    # Expo yapılandırması
├── package.json                # Bağımlılıklar
├── tsconfig.json               # TypeScript ayarları
│
└── src/
    ├── App.tsx                 # Root navigation (tab navigator)
    ├── i18n/
    │   └── translations.ts     # TR/EN çeviriler (50+ string)
    ├── utils/
    │   └── sudokuLogic.ts      # Sudoku algoritması
    ├── screens/
    │   ├── GameScreen.tsx      # Ana oyun ekranı
    │   ├── LeaderboardScreen.tsx # Leaderboard ekranı
    │   └── SettingsScreen.tsx  # Ayarlar ekranı
    └── components/
        ├── SudokuBoard.tsx     # 9x9 grid bileşeni
        ├── GameHUD.tsx         # Skor/zaman/sistem bütünlüğü
        ├── NumpadControls.tsx  # 1-9 tuşları + aksiyonlar
        └── Scoreboard.tsx      # Leaderboard widget
```

## Teknoloji Yığını

| Bileşen | Sürüm | Açıklama |
|---------|-------|----------|
| React Native | 0.73.6 | Mobil UI framework |
| Expo | 50 | React Native toolchain |
| TypeScript | 5.3 | Tip güvenliği |
| React Navigation | 6.x | Ekran navigasyonu |
| AsyncStorage | 1.x | Yerel depolama |
| Axios | 1.x | HTTP istekleri |

## API Entegrasyonu

Android app, sunucu tarafındaki `/sudoku.php` ile konuşur:

### Endpoints

#### `GET /sudoku.php?action=get_scores&limit=50`
Leaderboard verisi getir
```json
{
  "scores": [
    {
      "rank": 1,
      "player_name": "Oyuncu1",
      "high_score": 5000,
      "games_played": 10
    }
  ]
}
```

#### `POST /sudoku.php` (action=update_score)
Skor gönder
```json
{
  "action": "update_score",
  "score": 1500
}
```

#### `POST /sudoku.php` (action=set_lang)
Dil değiştir (web uyumluluğu için)
```json
{
  "action": "set_lang",
  "lang": "en"
}
```

## Üretim Derlemesi (APK Oluşturma)

### EAS CLI İle

```powershell
# EAS kurulumu
npm install -g eas-cli

# EAS hesabını başlat
eas login

# Android APK derle (5-10 dakika)
eas build --platform android --local

# İndirilen APK'yı cihaza yükle
adb install app-release.apk
```

### Yerel Derlemesi

```powershell
# Android SDK yolunu ayarla (app.json'da)
npm run android:build
```

## Sorun Giderme

### Problem: `npm install` hata veriyor
**Çözüm**: Node.js'i yeniden kur → Cache temizle `npm cache clean --force`

### Problem: QR kod okunamıyor
**Çözüm**: 
- Wifi'yi kontrol et (aynı ağda olun)
- Firewall kurallarını kontrol et
- `npm start` çıktısındaki URL'i manuel olarak ziyaret et

### Problem: Leaderboard boş gösteriyor
**Çözüm**:
- Sunucu `/sudoku.php?action=get_scores` endpoint'inin çalıştığını kontrol et
- `https://oguzhanduyar.com.tr/sudoku.php?action=get_scores` manuel olarak test et
- Database `sudoku_scores` tablosunun var olduğunu kontrol et

### Problem: Dil değişmiyor
**Çözüm**:
- AsyncStorage izinlerini kontrol et
- Android 12+: `READ/WRITE_EXTERNAL_STORAGE` izni için manifest dosyasını kontrol et

## Katkıda Bulunma

```powershell
# Yeni özellik geliştir
git checkout -b feature/yeni-ozellik

# Değişiklikleri commit et
git commit -m "Yeni özellik: [açıklama]"

# Push et
git push origin feature/yeni-ozellik
```

## Lisans

MIT

## İletişim

Sorular veya hatalar için: oguzhanyeni@gmail.com

---

**Yapı Sürümü**: 1.0.0 | **Son Güncelleme**: 2024 | **Durum**: Üretim Hazırı ✅
