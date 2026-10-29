/**
 * 5minSummary — Master SEO Head Updater, Sitemap, Robots.txt & 404 Generator
 * Run command: node seo-and-sitemap.js
 */

const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://5minssummary.com';
const ROOT_DIR = __dirname;
const TODAY = new Date().toISOString().split('T')[0];

// ============================================================================
// 1. PAGE-SPECIFIC SEO CONFIGURATION FOR MAIN & ABOUT PAGES
// ============================================================================
const pagesSeoConfig = [
    {
        file: 'index.html',
        urlPath: '',
        title: '5minSummary — A little time. A wider world.',
        desc: 'Read 5-minute book summaries in English & Hindi, simple history and science explainers, weekly current affairs, and free interactive tools.',
        keywords: '5minSummary, book summaries in Hindi, book summaries in English, 5 minute reads, history explainers, science explainers, online calculators',
        isRoot: true
    },
    {
        file: 'Books.html',
        urlPath: 'Books.html',
        title: 'Book Summaries in English & Hindi — 5minSummary',
        desc: 'Explore 57+ bestselling non-fiction and self-help book summaries in English and Hindi. Read key takeaways in just 5 minutes.',
        keywords: 'book summaries, Hindi book summary, English book summary, Atomic Habits summary, Psychology of Money summary, 5minSummary books',
        isRoot: true
    },
    {
        file: 'History.html',
        urlPath: 'History.html',
        title: 'History Explainers in 5 Minutes — 5minSummary',
        desc: 'Across time and beyond the ordinary: read 5-minute explainers on ancient civilizations, empires, trade routes, and world history.',
        keywords: 'history explainers, world history in 5 minutes, ancient civilizations, Roman empire, Indus valley, Silk road, 5minSummary history',
        isRoot: true
    },
    {
        file: 'Science.html',
        urlPath: 'Science.html',
        title: 'Science & Cosmos Explainers in 5 Minutes — 5minSummary',
        desc: 'Science made wonderfully simple. Clear 5-minute guides on quantum physics, astrophysics, biology, nature, and the human brain.',
        keywords: 'science explainers, quantum physics explained, astrophysics, biology, brain science, 5minSummary science',
        isRoot: true
    },
    {
        file: 'Article.html',
        urlPath: 'Article.html',
        title: 'The Short Read: Articles & Ideas — 5minSummary',
        desc: 'Fresh thoughts for your everyday curiosity. Short 5-minute articles on psychology, mindful living, clarity, and human behavior.',
        keywords: 'short reads, mindful living articles, psychology articles, better thinking, daily habits, 5minSummary articles',
        isRoot: true
    },
    {
        file: 'Tools.html',
        urlPath: 'Tools.html',
        title: 'Free Online Calculators, Editor Tools & Brain Games — 5minSummary',
        desc: 'Explore 27+ free interactive tools including EMI & SIP calculators, unit converters, CSS generators, image compressors, and classic brain games.',
        keywords: 'online calculators, EMI calculator, SIP calculator, GST calculator, unit converter, brain games, 5minSummary tools',
        isRoot: true
    },
    {
        file: 'about/our-story.html',
        urlPath: 'about/our-story.html',
        title: 'Our Story — 5minSummary',
        desc: 'Learn why we built 5minSummary: an independent editorial space for 5-minute book summaries, history, science, and mindful daily tools.',
        keywords: 'about 5minSummary, our story, 5minSummary mission',
        isRoot: false
    },
    {
        file: 'about/editorial-approach.html',
        urlPath: 'about/editorial-approach.html',
        title: 'Editorial Approach — 5minSummary',
        desc: 'How 5minSummary distills complex books, historical events, and scientific ideas into clear, accurate 5-minute briefings.',
        keywords: 'editorial approach, 5minSummary standards, how we summarize books',
        isRoot: false
    },
    {
        file: 'about/contact.html',
        urlPath: 'about/contact.html',
        title: 'Contact Us — 5minSummary',
        desc: 'Get in touch with the 5minSummary editorial team for book suggestions, tool feedback, or partnership inquiries.',
        keywords: 'contact 5minSummary, suggest a book, feedback',
        isRoot: false
    },
    {
        file: 'about/privacy.html',
        urlPath: 'about/privacy.html',
        title: 'Privacy Policy — 5minSummary',
        desc: 'Read the Privacy Policy of 5minSummary covering cookies, local browser storage, analytics, and data protection.',
        keywords: 'privacy policy, 5minSummary privacy, terms and cookies',
        isRoot: false
    }
];

// ============================================================================
// 2. COMPLETE SEO <HEAD> BUILDER
// ============================================================================
function buildCompleteHead(cfg) {
    const canonicalUrl = cfg.urlPath ? `${SITE_URL}/${cfg.urlPath}` : `${SITE_URL}/`;
    const ogImage = `${SITE_URL}/image/og-cover.jpg`;

    const schemaBlock = cfg.file === 'index.html' ? `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "5minSummary",
      "url": "${SITE_URL}/",
      "description": "${cfg.desc}"
    }
    </script>` : '';

    return `<head>
    <!-- PAGE-SPECIFIC SEO META TAGS -->
    <title>${cfg.title}</title>
    <meta name="description" content="${cfg.desc}">
    <meta name="keywords" content="${cfg.keywords}">
    <link rel="canonical" href="${canonicalUrl}">

    <!-- Open Graph / WhatsApp / Facebook Preview -->
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="5minSummary">
    <meta property="og:title" content="${cfg.title}">
    <meta property="og:description" content="${cfg.desc}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:image" content="${ogImage}">

    <!-- Twitter / X Card Preview -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${cfg.title}">
    <meta name="twitter:description" content="${cfg.desc}">
    <meta name="twitter:image" content="${ogImage}">

    <!-- UNIVERSAL META & INLINE '5' FAVICON -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="index, follow">
    <meta name="author" content="5minSummary">
    <meta name="theme-color" content="#134E3A">
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 36 36'><rect width='36' height='36' rx='6' fill='%23134E3A'/><text x='50%25' y='54%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-family='Georgia, serif' font-size='22'>5</text></svg>">

    <!-- Tailwind CSS CDN & Google Fonts -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        bgMain: '#FBFBF8',
                        bgCard: '#EFECE4',
                        bgInput: '#EFECE4',
                        brandGreen: '#134E3A',
                        brandGreenHover: '#0E3B2C',
                        textDark: '#191918',
                        textMuted: '#6E6D68',
                        borderLight: '#E5E2D9',
                        goldNum: '#C69249'
                    },
                    fontFamily: {
                        serif: ['Newsreader', 'Georgia', 'serif'],
                        sans: ['Inter', 'sans-serif']
                    }
                }
            }
        }
    </script>

    <style>
        body {
            background-color: #FBFBF8;
            color: #191918;
            font-family: 'Inter', sans-serif;
        }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #FBFBF8; }
        ::-webkit-scrollbar-thumb { background: #D5D1C5; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #134E3A; }
        .book-shadow {
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 4px 10px -3px rgba(0, 0, 0, 0.06);
        }
        input[type="range"] { accent-color: #134E3A; }
    </style>${schemaBlock}
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-R997595DVT"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-R997595DVT');
</script>
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4676323756696849"
     crossorigin="anonymous"></script></head>`;
}

// ============================================================================
// 3. UPDATE <HEAD> & FOOTER LINKS IN ALL CONFIGURED PAGES
// ============================================================================
function updatePagesSeoAndFooters() {
    pagesSeoConfig.forEach(cfg => {
        const fullPath = path.join(ROOT_DIR, cfg.file);
        if (!fs.existsSync(fullPath)) {
            console.warn(`⚠️ Skipped ${cfg.file} (File not found)`);
            return;
        }

        let html = fs.readFileSync(fullPath, 'utf8');

        // 1. Replace <head>...<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-R997595DVT"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-R997595DVT');
</script>
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4676323756696849"
     crossorigin="anonymous"></script></head>
        html = html.replace(/<head>[\s\S]*?<\/head>/i, buildCompleteHead(cfg));

        // 2. Fix '#' Footer links on Root pages automatically
        if (cfg.isRoot) {
            html = html
                .replace(/<a href="#"([^>]*)>Our story<\/a>/gi, '<a href="about/our-story.html"$1>Our story</a>')
                .replace(/<a href="#"([^>]*)>Editorial approach<\/a>/gi, '<a href="about/editorial-approach.html"$1>Editorial approach</a>')
                .replace(/<a href="#"([^>]*)>Contact<\/a>/gi, '<a href="about/contact.html"$1>Contact</a>')
                .replace(/<a href="#"([^>]*)>Privacy<\/a>/gi, '<a href="about/privacy.html"$1>Privacy</a>');
        }

        fs.writeFileSync(fullPath, html, 'utf8');
        console.log(`✅ Updated SEO <head> & Footer links in: ${cfg.file}`);
    });
}

// ============================================================================
// 4. GENERATE SITEMAP.XML & ROBOTS.TXT FOR GOOGLE SEARCH CONSOLE
// ============================================================================
function generateSitemapAndRobots() {
    const urls = [];

    // Add Root Pages
    ['', 'Books.html', 'History.html', 'Science.html', 'Article.html', 'Tools.html'].forEach(p => {
        urls.push({
            loc: p ? `${SITE_URL}/${p}` : `${SITE_URL}/`,
            priority: p === '' ? '1.0' : '0.9',
            changefreq: 'weekly'
        });
    });

    // Scan Subfolders: posts/, tools/, about/
    const subFolders = [
        { dir: 'posts', priority: '0.8', changefreq: 'monthly' },
        { dir: 'tools', priority: '0.8', changefreq: 'monthly' },
        { dir: 'about', priority: '0.6', changefreq: 'yearly' }
    ];

    subFolders.forEach(({ dir, priority, changefreq }) => {
        const dirPath = path.join(ROOT_DIR, dir);
        if (fs.existsSync(dirPath)) {
            const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.html'));
            files.forEach(file => {
                urls.push({
                    loc: `${SITE_URL}/${dir}/${file}`,
                    priority,
                    changefreq
                });
            });
        }
    });

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    fs.writeFileSync(path.join(ROOT_DIR, 'sitemap.xml'), sitemapXml, 'utf8');
    console.log(`✅ Generated sitemap.xml with ${urls.length} total URLs!`);

    const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
    fs.writeFileSync(path.join(ROOT_DIR, 'robots.txt'), robotsTxt, 'utf8');
    console.log(`✅ Generated robots.txt`);
}

// ============================================================================
// 5. GENERATE CUSTOM 404.HTML PAGE (For GitHub Pages & Broken URLs)
// ============================================================================
function generate404Page() {
    const html404 = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Not Found (404) — 5minSummary</title>
    <meta name="robots" content="noindex, follow">
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 36 36'><rect width='36' height='36' rx='6' fill='%23134E3A'/><text x='50%25' y='54%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-family='Georgia, serif' font-size='22'>5</text></svg>">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-R997595DVT"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-R997595DVT');
</script>
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4676323756696849"
     crossorigin="anonymous"></script></head>
<body class="bg-[#FBFBF8] text-[#191918] font-['Inter',sans-serif] min-h-screen flex flex-col justify-between">
    <header class="border-b border-[#E5E2D9] px-6 h-20 flex items-center max-w-[1360px] w-full mx-auto">
        <a href="/index.html" class="flex items-center gap-2.5">
            <div class="w-8 h-9 bg-[#134E3A] rounded-[5px] flex items-center justify-center text-white font-['Newsreader',serif] text-xl">5</div>
            <span class="font-['Newsreader',serif] text-2xl">5minSummary</span>
        </a>
    </header>

    <main class="max-w-xl mx-auto px-6 py-20 text-center">
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[#134E3A] mb-3">ERROR 404</p>
        <h1 class="font-['Newsreader',serif] text-5xl sm:text-6xl mb-4">This page wandered off.</h1>
        <p class="text-[#6E6D68] text-base mb-8">
            The summary, article, or tool you are looking for might have been moved or renamed. Let's get you back to exploring ideas.
        </p>
        <div class="flex flex-wrap justify-center gap-3">
            <a href="/index.html" class="bg-[#134E3A] text-white text-sm font-medium px-6 py-3 rounded-lg hover:bg-[#0E3B2C] transition">
                ← Back to Home
            </a>
            <a href="/Books.html" class="bg-[#EFECE4] text-[#191918] text-sm font-medium px-6 py-3 rounded-lg hover:bg-[#E5E2D9] transition">
                Browse Books
            </a>
        </div>
    </main>

    <footer class="border-t border-[#E5E2D9] py-6 text-center text-xs text-[#6E6D68]">
        © 2026 5minSummary. Made for curious minds.
    </footer>
</body>
</html>`;

    fs.writeFileSync(path.join(ROOT_DIR, '404.html'), html404, 'utf8');
    console.log(`✅ Generated 404.html`);
}

// Run all tasks
console.log('\n🚀 Upgrading SEO <head>, Footers, Sitemap & 404 page...');
updatePagesSeoAndFooters();
generateSitemapAndRobots();
generate404Page();
console.log('\n🎉 All Done! Your site is 100% SEO & Deployment ready.\n');