# 🚀 Sudoku Android App - Kurulum & Çalıştırma Rehberi

## 📋 Hızlı Kontrol Listesi

- [ ] Node.js 18+ yüklü mü? (`node --version`)
- [ ] npm yüklü mü? (`npm --version`)
- [ ] Proje klasörü erişilebilir mi?
- [ ] Internet bağlantısı var mı?

## 1️⃣ Node.js Kurulumu (İlk Kez)

### Windows

1. https://nodejs.org/ ziyaret et
2. **LTS versiyonu** (18 veya daha yeni) indir
3. İndirileni çalıştır (Sonraki → Sonraki)
4. PowerShell'i yeniden başlat
5. Versiyonu doğrula:

```powershell
node --version    # v18.17.0+ olmalı
npm --version     # 9.0.0+ olmalı
```

## 2️⃣ Bağımlılıkları Yükle (İlk Kez)

```powershell
# Proje klasörüne git
cd "g:\Drive'ım\Web Projects\sudoku-android"

# npm bağımlılıklarını yükle
npm install
```

⏱️ **Bekleme Süresi**: 5-10 dakika (internet hızına bağlı)

✅ **Başarı Göstergesi**: `node_modules` klasörü oluştu

## 3️⃣ Uygulamayı Çalıştır

### A) Hızlı Test (Expo Go)

```powershell
cd "g:\Drive'ım\Web Projects\sudoku-android"
npm start
```

Çıktıda göreceksin:
```
exp://192.168.x.x:19000
```

**Android Cihazında**:
1. Google Play Store'dan **"Expo Go"** uygulamasını indir
2. Uygulamayı aç
3. "Scan QR code" tıkla
4. PowerShell'de gösterilen QR kodu oku
5. Oyun otomatik yüklenecek! 🎮

### B) Android Emulator

```powershell
cd "g:\Drive'ım\Web Projects\sudoku-android"
npm start

# Emulator'de açmak için 'a' tuşu bas + Enter
```

**Ön koşul**: Android Studio yüklü + Emulator ayarlı

### C) Yazılı Komutla Başlat

```powershell
# Expo CLI versiyonunu kontrol et
npx expo --version

# Uygulamayı başlat
npx expo start
```

## 🔄 Geliştirme İpuçları

### Hot Reload Etkinleştir

Kod değiştirdiğinde otomatik yenileme:
```powershell
# npm start çalışırken:
# 'r' tuşu → Tam yenileme
# 'w' tuşu → Web tarayıcıda aç (test için)
```

### Terminal Komutları

```powershell
# Sadece TypeScript hatalarını kontrol et
npm run type-check

# Cache temizle (hata çıkıyor ise)
npm cache clean --force

# node_modules'ı sıfırla
rm -r node_modules
npm install
```

## 🏗️ Üretim Derlemesi (APK)

### Adım 1: EAS Kurulumu

```powershell
npm install -g eas-cli
eas login
```

### Adım 2: APK Derle

```powershell
eas build --platform android --local
```

⏱️ **Bekleme Süresi**: 10-20 dakika

✅ **Çıktı**: `app-release.apk` (proje klasöründe)

### Adım 3: Cihaza Yükle

```powershell
# Android SDK Tools gerekli
adb install app-release.apk
```

## ❌ Sık Sorunlar & Çözümleri

| Sorun | Çözüm |
|-------|-------|
| `command not found: npm` | Node.js yeniden kur + PowerShell yeniden başlat |
| `EACCES permission denied` | `npm install -g expo-cli` (global kurulum) |
| `Cannot find module 'react'` | `npm install` çalıştır, tüm hataları okumak için bekle |
| Cihaz QR kodu okuyamıyor | Wifi'ye bağlı? Aynı ağda mı? Firewall açık mı? |
| Leaderboard boş | Sunucuya bağlantı kontrol et: https://oguzhanduyar.com.tr/sudoku.php?action=get_scores |
| Oyun crash ediyor | `npm start` çıktısındaki hataları oku; `npm cache clean --force` deneme |

## 📱 Cihaz Ayarları

### Android (Emulator Kurulumu)

1. Android Studio'yu aç
2. **Tools** → **Device Manager**
3. **Create Device** → Pixel 6 seç
4. **API Level 34+** seç
5. **Finish** tıkla
6. Devam ediyor... ⏳

### Android (Fiziksel Cihaz)

```powershell
# USB Debug modu aç
# Cihazı USB ile bağla

# Cihazları listele
adb devices

# Wireless ADB (WiFi ile):
adb connect 192.168.x.x:5555
```

## 🌐 Port Konfigürasyonu

Eğer 19000 portu meşgul ise:

```powershell
# Başka bir portta başlat
npx expo start --port 8081
```

## 📊 Dosya Ağacı

```
sudoku-android/
├── 📄 package.json
├── 📄 app.json
├── 📄 tsconfig.json
├── 📄 README.md
├── 📄 SETUP.md (bu dosya)
├── 📁 src/
│   ├── App.tsx
│   ├── 📁 screens/
│   ├── 📁 components/
│   ├── 📁 utils/
│   └── 📁 i18n/
├── 📁 node_modules/ (kurulumdan sonra)
└── 📁 .expo/ (cache)
```

## 🎯 İlk Çalıştırma Sonrası

1. **Ayarlar** → Dil seç (Türkçe/English)
2. **Oyun** → Yeni Oyun başlat
3. **Leaderboard** → Puanları görmek için (ilk başta boş olabilir)

## 🆘 Başarısız Olursam?

1. Tüm Node.js işlemlerini kapat
   ```powershell
   taskkill /F /IM node.exe
   ```

2. Cache temizle
   ```powershell
   npm cache clean --force
   rm -r node_modules
   ```

3. Baştan başla
   ```powershell
   npm install
   npm start
   ```

4. Hala sorun varsa:
   - Error mesajının tamamını kopyala
   - Google'de ara: `expo error [mesaj]`
   - Stack Overflow: https://stackoverflow.com

## 💡 Başarı Kriterlerine İlişkin

- ✅ `npm install` hatasız tamamlandı
- ✅ `npm start` QR kodu gösteriyor
- ✅ Cihazda "Expo Go" açıldı
- ✅ Oyun ekranı görünüyor
- ✅ Dil değiştirilebiliyor
- ✅ Leaderboard API çalışıyor

## 📞 İletişim

Sorular?
- oguzhanyeni@gmail.com
- Bana mesaj gönder

---

**Sürüm**: 1.0 | **Tarih**: 2024 | **Durum**: Hazır ✅
