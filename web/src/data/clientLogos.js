// Public-domain / official marks only. Add an entry only when a legitimate
// source (govt site, Wikimedia Commons) confirms free use — otherwise the
// card falls back to a text-only credit.
export const clientLogos = {
  'Edo State Ministry of Roads & Bridges': '/logos/edo-state-seal.png',
  'Edo State Oil & Gas Producing Areas Development Commission': '/logos/edo-state-seal.png',
};

export function getClientLogo(client) {
  return client ? clientLogos[client] : undefined;
}
