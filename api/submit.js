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
    console.error('WEB3FORMS_KEY missing');
    res.status(500).json({ success: false, message: 'Missing WEB3FORMS_KEY in Vercel environment variables.' });
    return;
  }

  const form = new IncomingForm({
    multiples: true,
    keepExtensions: true,
    allowEmptyFiles: true,
    maxFileSize: 25 * 1024 * 1024,
  });

  try {
    const parsed = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    const { fields = {}, files = {} } = parsed || {};
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

    const uploadedFiles = files && files.file ? (Array.isArray(files.file) ? files.file : [files.file]) : [];
    const validUploadedFiles = uploadedFiles.filter((file) => file && file.size > 0 && file.filepath);

    validUploadedFiles.forEach((file) => {
      const fileStream = fs.createReadStream(file.filepath);
      payload.append('file', fileStream, {
        filename: file.originalFilename || file.newFilename,
        contentType: file.mimetype || 'application/octet-stream',
      });
    });

    console.log('Forwarding to Web3Forms', {
      hasFiles: validUploadedFiles.length > 0,
      fileNames: validUploadedFiles.map((file) => file.originalFilename || file.newFilename),
      subject,
      hasEmail: Boolean(email),
    });

    const response = await new Promise((resolve, reject) => {
      payload.submit('https://api.web3forms.com/submit', (err, res) => {
        if (err) return reject(err);

        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          try {
            resolve(JSON.parse(body || '{}'));
          } catch {
            resolve({ success: false, message: body || 'Unknown response from Web3Forms' });
          }
        });
      });
    });

    console.log('Web3Forms response', response);

    if (response && response.success) {
      res.status(200).json({ success: true, message: 'Upload sent successfully.' });
      return;
    }

    const errorMessage = response && response.message ? response.message : 'Upload failed.';
    res.status(400).json({ success: false, message: errorMessage });
  } catch (error) {
    console.error('submit error:', error);
    res.status(500).json({
      success: false,
      message: error && error.message ? error.message : 'Server error while processing upload.',
    });
  }
};
