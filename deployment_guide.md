# Userex AI Assistant Dağıtım (Deployment) Rehberi

Bu rehber, Next.js uygulamaları için önerilen platform olan **Vercel** üzerinde uygulamanızı nasıl yayına alacağınızı anlatır.

## Gereksinimler

- Bir [Vercel Hesabı](https://vercel.com/signup)
- Bir [GitHub Hesabı](https://github.com/join) (Önerilen)

## Seçenek 1: GitHub ile Dağıtım (Önerilen)

1.  **GitHub Deposu (Repository) Oluşturun:**
    - [GitHub.com](https://github.com/new) adresine gidin ve yeni bir depo oluşturun (örneğin: `userex-ai-assistant`).
    - README, .gitignore veya Lisans ile başlatmayın (çünkü zaten kodunuz var).

2.  **Kodunuzu Yükleyin:**
    Proje klasörünüzde terminali açın ve aşağıdaki komutları çalıştırın:
    ```bash
    git remote add origin https://github.com/yasincelenk/userex-ai.git
    git branch -M main
    git push -u origin main
    ```
    *(KULLANICI_ADINIZ kısmını kendi GitHub kullanıcı adınızla değiştirin)*

3.  **Vercel Üzerinde Dağıtın:**
    - [Vercel Paneline](https://vercel.com/dashboard) gidin.
    - **"Add New..."** -> **"Project"** seçeneğine tıklayın.
    - Az önce oluşturduğunuz `userex-ai-assistant` deposunu içe aktarın (Import).

4.  **Ortam Değişkenlerini (Environment Variables) Ayarlayın:**
    Dağıtım yapılandırma ekranında, **"Environment Variables"** bölümünü bulun ve aşağıdaki anahtarları ekleyin (değerleri `.env.local` dosyanızdan kopyalayın):

    - `OPENAI_API_KEY`
    - `PINECONE_API_KEY`
    - `NEXT_PUBLIC_FIREBASE_API_KEY`
    - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
    - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
    - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
    - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
    - `NEXT_PUBLIC_FIREBASE_APP_ID`
    - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

5.  **"Deploy" butonuna tıklayın.**

## Seçenek 2: CLI ile Dağıtım (En Hızlı)

Eğer Vercel CLI yüklü ise, doğrudan terminalden dağıtım yapabilirsiniz:

1.  Aşağıdaki komutu çalıştırın:
    ```bash
    npx vercel
    ```
2.  Soruları yanıtlayın:
    - Set up and deploy? **Yes**
    - Which scope? **(Hesabınızı seçin)**
    - Link to existing project? **No**
    - Project name? **userex-ai-assistant** (veya Enter'a basın)
    - In which directory? **./** (Enter'a basın)
    - Want to modify settings? **No**

3.  **Ortam Değişkenlerini Ekleyin:**
    İlk dağıtım (anahtarlar eksik olduğu için) muhtemelen başarısız olacaktır. Yeni projeniz için Vercel paneline gidin, Seçenek 1'de listelenen Ortam Değişkenlerini ekleyin ve ardından şu komutla tekrar dağıtın:
    ```bash
    npx vercel --prod
    ```

## Doğrulama

Dağıtım tamamlandığında, Vercel size bir URL verecektir (örneğin: `https://userex-ai-assistant.vercel.app`). Bu URL'i test edecek kişilerle paylaşabilirsiniz.
