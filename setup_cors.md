# Firebase Storage CORS Hatası Çözümü (Kesin Çözüm)

Bilgisayarınızda `gsutil` aracı yüklü olmadığı için komut satırından işlemi yapamadım. Ancak bunu **Google Cloud Console** üzerinden kolayca yapabilirsiniz.

## Adım 1: Google Cloud Console'u Açın
Aşağıdaki linke tıklayarak projenizin depolama (storage) ayarlarına gidin:
[https://console.cloud.google.com/storage/browser/ai-assistant-22f53.firebasestorage.app](https://console.cloud.google.com/storage/browser/ai-assistant-22f53.firebasestorage.app)

*(Eğer proje seçmenizi isterse "ai-assistant-22f53" projesini seçin)*

## Adım 2: Cloud Shell'i Açın
1.  Sayfanın sağ üst köşesindeki **Terminal İkonuna** (Activate Cloud Shell) tıklayın. (Genellikle arama çubuğunun yanındadır).
2.  Ekranın altında bir terminal penceresi açılacaktır.

## Adım 3: Komutu Yapıştırın
Açılan terminale aşağıdaki komutu **tek seferde kopyalayıp yapıştırın** ve Enter'a basın:

```bash
echo '[{"origin": ["*"],"method": ["GET", "HEAD", "PUT", "POST", "DELETE", "OPTIONS"],"responseHeader": ["*"],"maxAgeSeconds": 3600}]' > cors.json && gsutil cors set cors.json gs://ai-assistant-22f53.firebasestorage.app
```

## Adım 4: İşlem Tamam
Komut hata vermeden çalışırsa işlem tamamdır. Şimdi uygulamanıza dönüp sayfayı yenileyin ve logo yüklemeyi tekrar deneyin.
