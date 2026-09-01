import express from 'express';
import busboy from 'busboy';
import { createStorage } from './storage.mjs';

// Dev-only. Started alongside Vite by `npm run dev`. Vite proxies /api/media
// here so the site and the editor never see this port.

const PORT = Number(process.env.MEDIA_STUDIO_PORT) || 5174;
const MAX_UPLOAD = 50 * 1024 * 1024;

const storage = createStorage({ root: process.cwd() });
const app = express();
app.use(express.json({ limit: '2mb' }));

app.get('/api/media', async (_req, res) => {
  try {
    res.json(await storage.readConfig());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/media', async (req, res) => {
  try {
    res.json(await storage.writeConfig(req.body));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/text', async (_req, res) => {
  try {
    res.json(await storage.readTextConfig());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/text', async (req, res) => {
  try {
    res.json(await storage.writeTextConfig(req.body));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/media/upload', (req, res) => {
  const bb = busboy({ headers: req.headers, limits: { files: 1, fileSize: MAX_UPLOAD } });
  let slotId = 'slot';
  let filename = '';
  let truncated = false;
  const chunks = [];

  bb.on('field', (name, value) => {
    if (name === 'slotId') slotId = value;
  });
  bb.on('file', (_name, stream, info) => {
    filename = info.filename;
    stream.on('data', (c) => chunks.push(c));
    stream.on('limit', () => { truncated = true; });
  });
  bb.on('close', async () => {
    if (truncated) return res.status(413).json({ error: 'file too large' });
    if (!chunks.length) return res.status(400).json({ error: 'no file in request' });
    try {
      // saveFile returns { src, type }; type is inferred from the extension.
      res.json(await storage.saveFile(slotId, Buffer.concat(chunks), filename));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  bb.on('error', (err) => res.status(500).json({ error: err.message }));

  req.pipe(bb);
});

app.listen(PORT, () => {
  console.log(`  media studio   http://localhost:${PORT}  (proxied via Vite)`);
});
