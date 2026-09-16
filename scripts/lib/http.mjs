// HTTP client condiviso dagli scraper.
// marinobusurbano.it sta dietro un WAF che risponde 403 alle richieste prive di
// header di navigazione: vanno inviati tutti, non solo lo User-Agent.

const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'it-IT,it;q=0.9,en;q=0.8',
  'Upgrade-Insecure-Requests': '1',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function request(url, { attempts = 3, timeout = 40000, headers = {} } = {}) {
  let lastError;
  for (let i = 1; i <= attempts; i++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      const res = await fetch(url, {
        headers: { ...BROWSER_HEADERS, ...headers },
        signal: controller.signal,
        redirect: 'follow',
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} su ${url}`);
      return res;
    } catch (err) {
      lastError = err;
      if (i < attempts) await sleep(800 * i);
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastError;
}

export async function getText(url, opts) {
  const res = await request(url, opts);
  return res.text();
}

export async function getBuffer(url, opts) {
  const res = await request(url, opts);
  return Buffer.from(await res.arrayBuffer());
}

export { sleep };
