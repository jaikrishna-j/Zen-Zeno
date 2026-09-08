# Office File Upload to Email

This is a static form built for Vercel that lets you upload files, images, and notes and send them to your private email using Web3Forms.

## Features
- Multiple file upload
- Accepts PDFs, images, spreadsheets, text, documents, and compressed files
- Sends form details and uploaded files to your email through Web3Forms
- Works as a public static site on Vercel

## Vercel setup

1. Push this project to a public GitHub repository.
2. Open https://vercel.com and log in with GitHub.
3. Click "New Project" and import your GitHub repo.
4. Select the repository and keep the default settings.
5. Since this is a static site, Vercel will use the root folder automatically.
6. Click "Deploy".
7. After deployment, copy the Vercel live URL.

## Local test in VS Code

1. Open the project folder in VS Code.
2. Start a local preview:
   ```bash
   py -m http.server 8000
   ```
3. Open:
   ```text
   http://localhost:8000
   ```
4. Fill out the form and upload a file.
5. Submit the form to confirm Web3Forms is sending mail.

## GitHub public repo steps

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

## Security note

- Keep the Web3Forms access key in the code only if the project is private.
- For a public repo, do not expose secrets in a way that can be abused.
- If you want stronger protection, move the access key to a Vercel env variable and use a small backend later.

## Important

- Web3Forms must be connected to the email address that should receive uploads.
- Check spam/junk mail if the message does not arrive immediately.
- This setup is intended for a simple office file-upload form and is easy to deploy on Vercel.

## Project files
- `index.html` — form layout
- `styles.css` — styling
- `script.js` — Web3Forms submission logic
- `vercel.json` — Vercel config
- `.gitignore` — ignores local and editor files
