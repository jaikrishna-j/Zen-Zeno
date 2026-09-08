const { IncomingForm } = require('formidable');
const FormData = require('form-data');
const fs = require('fs');

const WEB3FORMS_KEY = process.env.WEB3FORMS_KEY;

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method not allowed' });
    return;
  }

  if (!WEB3FORMS_KEY) {
    res.status(500).json({ success: false, message: 'Server is missing WEB3FORMS_KEY' });
    return;
  }

  const form = new IncomingForm({
    multiples: true,
    keepExtensions: true,
    maxFileSize: 25 * 1024 * 1024,
  });

  try {
    const fields = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    const payload = new FormData();
    payload.append('access_key', WEB3FORMS_KEY);

    const name = String(fields.name || '').trim() || 'Website User';
    const email = String(fields.email || '').trim();
    const subject = String(fields.subject || '').trim() || 'New upload';
    const message = String(fields.message || '').trim() || 'No message provided';

    payload.append('name', name);
    if (email) payload.append('email', email);
    payload.append('subject', subject);
    payload.append('message', message);
    payload.append('from_name', name);

    const fileList = Array.isArray(fields.file) ? fields.file : [fields.file];
    const allFiles = [];

    for (const key of Object.keys(fields)) {
      if (key === 'file') continue;
    }

    if (files && files.file) {
      const arr = Array.isArray(files.file) ? files.file : [files.file];
      arr.forEach((file) => allFiles.push(file));
    }

    const toSend = allFiles.length ? allFiles : [];

    toSend.forEach((file) => {
      const fileBuffer = fs.readFileSync(file.filepath);
      payload.append('file', fileBuffer, {
        filename: file.originalFilename || file.newFilename,
        contentType: file.mimetype || 'application/octet-stream',
      });
    });

    const response = await new Promise((resolve, reject) => {
      const url = 'https://api.web3forms.com/submit';
      payload.submit(url, (err, res) => {
        if (err) return reject(err);
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          try {
            resolve(JSON.parse(body || '{}'));
          } catch {
            resolve({ success: false, message: body || 'Unknown response' });
          }
        });
      });
    });

    if (response && response.success) {
      res.status(200).json({ success: true, message: 'Upload sent successfully.' });
      return;
    }

    res.status(400).json({
      success: false,
      message: response && response.message ? response.message : 'Upload failed.',
    });
  } catch (error) {
    console.error('submit error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while processing upload.',
    });
  }
};
