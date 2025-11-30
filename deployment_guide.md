# Deployment Guide for Userex AI Assistant

This guide will help you deploy your application to **Vercel**, which is the recommended platform for Next.js applications.

## Prerequisites

- A [Vercel Account](https://vercel.com/signup)
- A [GitHub Account](https://github.com/join) (Recommended)

## Option 1: Deploy via GitHub (Recommended)

1.  **Create a GitHub Repository:**
    - Go to [GitHub.com](https://github.com/new) and create a new repository (e.g., `userex-ai-assistant`).
    - Do not initialize with README, .gitignore, or License (since you already have code).

2.  **Push your code:**
    Open your terminal in the project folder and run:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/userex-ai-assistant.git
    git branch -M main
    git push -u origin main
    ```
    *(Replace `YOUR_USERNAME` with your actual GitHub username)*

3.  **Deploy on Vercel:**
    - Go to your [Vercel Dashboard](https://vercel.com/dashboard).
    - Click **"Add New..."** -> **"Project"**.
    - Import the `userex-ai-assistant` repository you just created.

4.  **Configure Environment Variables:**
    In the deployment configuration screen, find the **"Environment Variables"** section and add the following keys (copy values from your `.env.local` file):

    - `OPENAI_API_KEY`
    - `PINECONE_API_KEY`
    - `NEXT_PUBLIC_FIREBASE_API_KEY`
    - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
    - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
    - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
    - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
    - `NEXT_PUBLIC_FIREBASE_APP_ID`
    - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

5.  **Click "Deploy"**.

## Option 2: Deploy via CLI (Quickest)

If you have the Vercel CLI installed, you can deploy directly from your terminal:

1.  Run the following command:
    ```bash
    npx vercel
    ```
2.  Follow the prompts:
    - Set up and deploy? **Yes**
    - Which scope? **(Select your account)**
    - Link to existing project? **No**
    - Project name? **userex-ai-assistant** (or press Enter)
    - In which directory? **./** (press Enter)
    - Want to modify settings? **No**

3.  **Add Environment Variables:**
    After the first deployment (which might fail due to missing keys), go to the Vercel dashboard for your new project, add the Environment Variables listed in Option 1, and then redeploy using:
    ```bash
    npx vercel --prod
    ```

## Verification

Once deployed, Vercel will provide a URL (e.g., `https://userex-ai-assistant.vercel.app`). Share this URL with your testers.
