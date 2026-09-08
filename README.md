# Confidential Upload Form

This project is a confidential internal upload form used to send files, notes, and attachments to a designated email destination.

## Purpose
- Accept file uploads from a browser form
- Support multiple document and image types
- Send them securely through Web3Forms
- Keep sensitive configuration such as the access key out of the frontend code

## Security requirements
This project is intended for internal or private use only.

- Do not expose secrets in a public repository
- Store confidential values in Vercel environment variables
- Use this project only for authorized office or internal workflows
- Keep the repository private if it contains internal business data

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
4. Test the form without uploading sensitive files.

## Required environment variable for deployment
For the secure version, configure this variable in Vercel:

```text
WEB3FORMS_KEY=your_web3forms_access_key
```

This keeps the access key hidden from the browser and the public frontend.

## Deployment notes
- Deploy only through a private or restricted GitHub repository if the project is confidential.
- Use Vercel environment variables instead of hardcoding secrets.
- Verify the receiving email address in Web3Forms before production use.

## Important
- Real file uploads require Web3Forms support for attachments.
- If the current plan does not allow file uploads, the API will reject them.
- For confidential/internal use, keep the repository restricted and avoid public sharing.

## Project files
- `index.html` — upload form UI
- `styles.css` — page styling
- `script.js` — frontend submission to the Vercel API
- `api/submit.js` — secure backend route that forwards data to Web3Forms
- `package.json` — Vercel/server dependencies
- `.gitignore` — local and editor exclusions
- `vercel.json` — deployment config
