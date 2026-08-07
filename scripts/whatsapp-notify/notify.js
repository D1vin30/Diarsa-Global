const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

const TARGET_NUMBER = '2347040810278'; // 07040810278 in international format, no +
const NEEDS_FILE = path.join(__dirname, '..', '..', 'NEEDS_FROM_MD.md');
const INTERVAL_CRON = '0 */3 * * *'; // every 3 hours

function buildMessage() {
  if (!fs.existsSync(NEEDS_FILE)) {
    return 'Diarsa site: no NEEDS_FROM_MD.md file found yet.';
  }
  const content = fs.readFileSync(NEEDS_FILE, 'utf8').trim();
  const timestamp = new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' });
  return `Diarsa site — needs from MD (as of ${timestamp}):\n\n${content}`;
}

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: path.join(__dirname, '.wwebjs_auth') }),
});

client.on('qr', (qr) => {
  console.log('Scan this QR code with WhatsApp (Linked Devices):');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('WhatsApp client ready. Sending on schedule:', INTERVAL_CRON);

  cron.schedule(INTERVAL_CRON, async () => {
    try {
      const message = buildMessage();
      await client.sendMessage(`${TARGET_NUMBER}@c.us`, message);
      console.log('Sent needs-from-MD list at', new Date().toISOString());
    } catch (err) {
      console.error('Failed to send scheduled message:', err);
    }
  });

  if (process.argv.includes('--send-now')) {
    client.sendMessage(`${TARGET_NUMBER}@c.us`, buildMessage())
      .then(() => console.log('Sent immediate test message.'))
      .catch((err) => console.error('Failed to send test message:', err));
  }
});

client.on('auth_failure', (msg) => console.error('Auth failure:', msg));
client.on('disconnected', (reason) => console.error('Disconnected:', reason));

client.initialize();
