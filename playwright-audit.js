import { chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotDir = path.join(__dirname, '.playwright-mcp');

if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

const BASE_URL = 'http://localhost:5174';

const PAGES = [
  { name: 'login',         path: '/',              auth: false },
  { name: 'signup',        path: '/signup',        auth: false },
  { name: 'dashboard',     path: '/dashboard',     auth: true  },
  { name: 'orderlist',     path: '/orderlist',     auth: true  },
  { name: 'orderdetail',   path: '/orderdetail',   auth: true  },
  { name: 'customer',      path: '/customer',      auth: true  },
  { name: 'customerdetail',path: '/customerdetail',auth: true  },
  { name: 'foods',         path: '/foods',         auth: true  },
  { name: 'analytics',     path: '/analytics',     auth: true  },
  { name: 'reviews',       path: '/reviews',       auth: true  },
  { name: 'calendar',      path: '/calendar',      auth: true  },
  { name: 'chat',          path: '/chat',          auth: true  },
  { name: 'wallet',        path: '/wallet',        auth: true  },
];

function ts() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 300 });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  // Inject fake auth so PrivateRoute lets us through
  await context.addInitScript(() => {
    localStorage.setItem('user', JSON.stringify({ uid: 'test', email: 'test@test.com', displayName: 'Aziz' }));
    localStorage.setItem('token', 'fake-token-for-audit');
  });

  const page = await context.newPage();
  const bugs = [];

  // Collect console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      bugs.push({ type: 'console-error', text: msg.text() });
    }
  });
  page.on('pageerror', err => {
    bugs.push({ type: 'page-error', text: err.message });
  });

  for (const p of PAGES) {
    console.log(`\n▶ Checking: ${p.name} (${p.path})`);
    const pageBugs = [];

    page.removeAllListeners('console');
    page.removeAllListeners('pageerror');
    page.on('console', msg => {
      if (msg.type() === 'error') pageBugs.push(`[console] ${msg.text()}`);
    });
    page.on('pageerror', err => pageBugs.push(`[crash]   ${err.message}`));

    try {
      await page.goto(`${BASE_URL}${p.path}`, { waitUntil: 'networkidle', timeout: 15000 });
    } catch {
      await page.goto(`${BASE_URL}${p.path}`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    }

    await page.waitForTimeout(1500);

    // Check if redirected (auth guard kicked in unexpectedly)
    const currentUrl = page.url();
    if (p.auth && !currentUrl.includes(p.path.split('/')[1])) {
      pageBugs.push(`[redirect] Expected ${p.path} but got ${new URL(currentUrl).pathname}`);
    }

    // Screenshot always
    const screenshotPath = path.join(screenshotDir, `audit-${p.name}-${ts()}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`  📸 ${screenshotPath}`);

    if (pageBugs.length) {
      console.log(`  🐛 BUGS:`);
      pageBugs.forEach(b => console.log(`     ${b}`));
      bugs.push({ page: p.name, path: p.path, issues: pageBugs });

      // Extra screenshot labelled "bug"
      const bugPath = path.join(screenshotDir, `BUG-${p.name}-${ts()}.png`);
      await page.screenshot({ path: bugPath, fullPage: true });
      console.log(`  🔴 Bug screenshot: ${bugPath}`);
    } else {
      console.log(`  ✅ No bugs`);
    }
  }

  // Summary
  console.log('\n══════════════ AUDIT SUMMARY ══════════════');
  if (bugs.length === 0) {
    console.log('✅ All pages passed — no bugs detected!');
  } else {
    bugs.forEach(b => {
      console.log(`\n🔴 ${b.page} (${b.path})`);
      b.issues.forEach(i => console.log(`   • ${i}`));
    });
  }

  // Write report
  const reportPath = path.join(screenshotDir, `audit-report-${ts()}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(bugs, null, 2));
  console.log(`\n📄 Report saved: ${reportPath}`);

  await browser.close();
})();
