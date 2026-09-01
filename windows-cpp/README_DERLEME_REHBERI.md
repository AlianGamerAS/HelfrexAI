# 🚀 HelfrexAI - Visual Studio Community ile Windows EXE Derleme Rehberi

Bu proje, **C++20**, **Win32**, **DirectX/DXGI (Donanım/VRAM Tespiti)** ve **Microsoft WebView2** teknolojileriyle geliştirilmiş tam teşekküllü bağımsız bir Windows Masaüstü (.exe) uygulamasıdır.

---

## 🛠️ Gereksinimler

1. **Visual Studio Community 2022** (veya üzeri)
   - Visual Studio Installer'da **"Desktop development with C++"** (C++ ile masaüstü geliştirme) iş yükünün seçili olduğundan emin olun.
2. **Node.js** (Arayüz derlemesi için `npm run build` çalıştırmak adına)

---

## 📦 Adım Adım Derleme ve EXE Çıktısı Alma

### 1. Adım: Arayüzü Derleyin (HTML/JS/CSS Dosyaları)
Ana proje dizininde bir terminal açıp şu komutu çalıştırın:
```bash
npm run build
```
Bu komut, `dist/` klasörü içerisine optimize edilmiş arayüz dosyalarını üretir.

### 2. Adım: Arayüzü C++ Projesine Kopyalayın
`dist/` klasörünün içeriğini `windows-cpp/bin/x64/Release/ui/` klasörünün içerisine kopyalayın (veya projedeki `windows-cpp/ui/` klasörüne koyun).

### 3. Adım: Visual Studio Çözümünü Açın
`windows-cpp/HelfrexAI.sln` dosyasına çift tıklayarak **Visual Studio Community** ile açın.

### 4. Adım: Derleme Ayarlarını Seçin
- Üst araç çubuğundaki açılır menülerden:
  - Yapılandırma: **`Release`**
  - Platform: **`x64`**
olarak seçin.

### 5. Adım: NuGet Paketlerini Geri Yükleyin (Gerekiyorsa)
Visual Studio otomatik olarak `Microsoft.Web.WebView2` paketini yükleyecektir. Yüklenmezse:
- `HelfrexAI` projesine sağ tıklayın -> **Manage NuGet Packages** -> **Restore** deyin.

### 6. Adım: Projeyi Derleyin (Build)
- Menüden **Build** -> **Build Solution** (veya klavyeden `Ctrl + Shift + B`) tuşlarına basın.
- Derleme başarıyla tamamlandığında `.exe` dosyanız hazır!

---

## 🎯 Üretilen EXE Dosyası Nerede?

Derlenen bağımsız Windows uygulaması şu dizinde yer alır:
```text
windows-cpp/bin/x64/Release/HelfrexAI.exe
```

---

## ⚙️ C++ Windows Native Motoru Neler Yapıyor?

1. **Gerçek Donanım Algılama (`HardwareDetector.cpp`)**:
   - `GlobalMemoryStatusEx` ile toplam ve boş RAM miktarını okur.
   - `DXGI` ve `Direct3D 11` çağrıları ile takılı ekran kartlarını (NVIDIA, AMD, Intel) ve dedicated VRAM belleğini doğrudan GPU sürücüsünden alır.

2. **Model İndirme ve Yönetim Motoru (`ModelEngine.cpp`)**:
   - Modelleri `%LOCALAPPDATA%\HelfrexAI\models\` altına yerel `.gguf` olarak yazar.
   - Çok iş parçacıklı (multi-threaded) arkaplan indirme ve ilerleme durumu sunar.

3. **Modern Win32 & Koyu Tema Penceresi (`main.cpp`)**:
   - Windows 10/11 **Immersive Dark Mode** başlık çubuğu (`DwmSetWindowAttribute`).
   - Yüksek DPI (4K / Per-Monitor DPI V2) tam netlik desteği.
   - Çift yönlü C++ <-> JS IPC köprüsü (`NativeBridge.cpp`).
