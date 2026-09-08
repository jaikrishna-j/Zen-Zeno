# Confidential Upload Form

This project is a confidential upload form for sending files, notes, and images to a designated email address while keeping sensitive configuration out of the browser.

## Purpose
- Accept uploads from a browser form
- Support multiple document and image types
- Send submissions through Web3Forms
- Keep the access key on the server side in Vercel environment variables

## Security requirements
This project is intended for confidential use.

- Do not expose secrets in a public frontend or public repository
- Store sensitive values in Vercel environment variables
- Restrict repository access and deployment permissions to authorized users
- Only use this project for approved confidential workflows

## Local development

1. Open the project in VS Code.
2. Start a local preview:
   ```bash
   py -m http.server 8000
   ```
3. Open the form in the browser:
   ```text
   http://localhost:8000
   ```
4. Test the form with non-sensitive content before production use.

## Required environment variable for deployment
Configure this value in Vercel:

```text
WEB3FORMS_KEY=your_web3forms_access_key
```

This keeps the access key hidden from the browser and public frontend code.

## Deployment notes
- Use Vercel environment variables instead of hardcoding secrets.
- Verify the receiving email address in Web3Forms before live use.
- Restrict repository and deployment access to authorized users.

## Important
- Real file attachments require Web3Forms attachment support on the active plan.
- If the current plan does not allow file uploads, the API will reject the submission.
- The frontend does not make the Web3Forms key public, and the form fields are intentionally left optional.

## Project files
- `index.html` — upload form UI
- `styles.css` — page styling
- `script.js` — frontend submission to the Vercel API
- `api/submit.js` — secure backend route that forwards data to Web3Forms
- `package.json` — Vercel/server dependencies
- `.gitignore` — local and editor exclusions
- `vercel.json` — deployment config
