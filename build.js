/**
 * 5minSummary — Clean Static Site Generator with Auto-SEO (build.js)
 * Run command: node build.js
 */

const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://5minssummary.com';
const ROOT_DIR = __dirname;
const CONTENT_DIR = path.join(ROOT_DIR, 'content');
const POSTS_DIR = path.join(ROOT_DIR, 'posts');

if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
}

// ============================================================================
// 1. JSON READER HELPER
// ============================================================================
function readJsonFile(fileName) {
    const filePath = path.join(CONTENT_DIR, fileName);
    if (!fs.existsSync(filePath)) {
        console.error(`❌ File missing: content/${fileName} nahi mili!`);
        return [];
    }
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (err) {
        console.error(`❌ Error parsing content/${fileName}:`, err.message);
        return [];
    }
}

// ============================================================================
// 2. CONTENT ARRAY TO HTML PARSER
// ============================================================================
function formatContentToHtml(contentInput) {
    if (typeof contentInput === 'string') return contentInput;
    if (!Array.isArray(contentInput)) return '';

    let html = '';
    let listItems = [];

    const flushList = () => {
        if (listItems.length > 0) {
            html += `<ul>\n${listItems.map(li => `    <li>${li}</li>`).join('\n')}\n</ul>\n`;
            listItems = [];
        }
    };

    contentInput.forEach(block => {
        const line = String(block).trim();
        if (!line) return;

        if (line.startsWith('- ')) {
            const formattedItem = line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            listItems.push(formattedItem);
            return;
        } else {
            flushList();
        }

        if (line.startsWith('## ')) {
            html += `<h2>${line.slice(3)}</h2>\n`;
        } else if (line.startsWith('### ')) {
            html += `<h2 class="text-xl">${line.slice(4)}</h2>\n`;
        } else if (line.startsWith('> ')) {
            html += `<blockquote>${line.slice(2)}</blockquote>\n`;
        } else if (line.startsWith('<')) {
            html += `${line}\n`;
        } else {
            const parsedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            html += `<p>${parsedLine}</p>\n`;
        }
    });

    flushList();
    return html;
}

// ============================================================================
// 3. HTML MARKER REPLACER
// ============================================================================
function replaceBetweenMarkers(filePath, startMarker, endMarker, newHtml) {
    if (!fs.existsSync(filePath)) {
        console.warn(`⚠️ Skipped ${path.basename(filePath)} (File not found)`);
        return;
    }
    const html = fs.readFileSync(filePath, 'utf8');
    const startIdx = html.indexOf(startMarker);
    const endIdx = html.indexOf(endMarker);

    if (startIdx === -1 || endIdx === -1) {
        console.warn(`⚠️ Markers ${startMarker} not found in ${path.basename(filePath)}`);
        return;
    }

    const updated =
        html.substring(0, startIdx + startMarker.length) +
        '\n' + newHtml + '\n' +
        html.substring(endIdx);

    fs.writeFileSync(filePath, updated, 'utf8');
}

// ============================================================================
// 4. DEDICATED ARTICLE PAGE GENERATOR WITH AUTOMATIC SEO HEAD
// ============================================================================
function createDedicatedPostHtml(post, backPage = '../index.html') {
    const bodyHtml = formatContentToHtml(post.content);
    const authorName = post.author || 'Dev Singh Sidar';
    const authorInitials = authorName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    
    const pageTitle = `${post.title} — 5minSummary`;
    const pageDesc = (post.subtitle || post.title).replace(/"/g, '&quot;');
    const canonicalUrl = `${SITE_URL}/posts/${post.slug}.html`;
    const ogImage = post.image && post.image.startsWith('http') ? post.image : `${SITE_URL}/${post.image || 'image/og-cover.jpg'}`;

    const schemaJson = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": post.subtitle || post.title,
        "image": ogImage,
        "author": {
            "@type": "Person",
            "name": authorName
        },
        "publisher": {
            "@type": "Organization",
            "name": "5minSummary",
            "url": SITE_URL
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": canonicalUrl
        }
    });

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <!-- AUTOMATIC SEO META TAGS -->
    <title>${pageTitle}</title>
    <meta name="description" content="${pageDesc}">
    <link rel="canonical" href="${canonicalUrl}">

    <!-- Open Graph / WhatsApp / Social Preview -->
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="5minSummary">
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${pageDesc}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:image" content="${ogImage}">

    <!-- Twitter / X Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${pageTitle}">
    <meta name="twitter:description" content="${pageDesc}">
    <meta name="twitter:image" content="${ogImage}">

    <!-- Universal Meta & Inline Favicon -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="index, follow">
    <meta name="author" content="${authorName}">
    <meta name="theme-color" content="#134E3A">
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 36 36'><rect width='36' height='36' rx='6' fill='%23134E3A'/><text x='50%25' y='54%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-family='Georgia, serif' font-size='22'>5</text></svg>">

    <!-- Tailwind CSS & Google Fonts -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        bgMain: '#FBFBF8',
                        bgCard: '#EFECE4',
                        brandGreen: '#134E3A',
                        textDark: '#191918',
                        textMuted: '#6E6D68',
                        borderLight: '#E5E2D9'
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
        body { background-color: #FBFBF8; color: #191918; font-family: 'Inter', sans-serif; }
        .article-body p { margin-bottom: 1.5rem; line-height: 1.85; font-size: 1.125rem; color: #262625; }
        .article-body h2 { font-family: 'Newsreader', Georgia, serif; font-size: 1.8rem; font-weight: 500; color: #191918; margin-top: 2.5rem; margin-bottom: 1rem; line-height: 1.3; }
        .article-body blockquote { border-left: 3px solid #134E3A; padding-left: 1.25rem; font-family: 'Newsreader', Georgia, serif; font-style: italic; font-size: 1.35rem; color: #134E3A; margin: 2rem 0; }
        .article-body ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.5rem; }
        .article-body li { margin-bottom: 0.6rem; line-height: 1.75; font-size: 1.08rem; }
    </style>

    <!-- Structured Data (Article Schema) -->
    <script type="application/ld+json">${schemaJson}</script>
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
<body class="antialiased min-h-screen flex flex-col selection:bg-brandGreen selection:text-white">

    <!-- Top Reading Progress Bar -->
    <div class="fixed top-0 left-0 w-full h-1 bg-borderLight z-50">
        <div id="reading-progress" class="h-full bg-brandGreen w-0 transition-all duration-150"></div>
    </div>

    <!-- Minimal Back Navigation + Live Date/Time -->
    <div class="sticky top-0 z-40 bg-bgMain/95 backdrop-blur-md border-b border-borderLight">
        <div class="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            <button onclick="goBackPage()" class="group inline-flex items-center gap-2.5 text-sm font-medium text-textDark hover:text-brandGreen transition py-1.5 px-3 -ml-3 rounded-lg hover:bg-bgCard/80">
                <svg class="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                <span>Back</span>
                <kbd class="hidden sm:inline-block ml-1 text-[10px] font-sans text-textMuted bg-bgCard px-1.5 py-0.5 rounded border border-borderLight">Backspace</kbd>
            </button>

            <div class="flex items-center gap-4 text-xs text-textMuted">
                <span id="live-datetime" class="hidden md:inline"></span>
                <span>⏱ ${post.readTime || '5 min read'}</span>
                <button onclick="toggleFontSize()" title="Adjust Font Size" class="font-serif font-semibold text-textDark px-2.5 py-1 rounded border border-borderLight hover:bg-bgCard transition">Aa</button>
            </div>
        </div>
    </div>

    <!-- Pure Article Body -->
    <main class="flex-grow max-w-3xl w-full mx-auto px-4 sm:px-6 pt-10 pb-24">
        <article>
            <div class="flex items-center gap-3 mb-4">
                <span class="text-xs font-semibold uppercase tracking-[0.14em] text-brandGreen bg-brandGreen/10 px-2.5 py-1 rounded">
                    ${post.category || '5MINSUMMARY'}
                </span>
                <span class="text-textMuted text-xs">•</span>
                <span class="text-xs text-textMuted">${post.date || 'Oct 2026'}</span>
            </div>

            <h1 class="font-serif text-3xl sm:text-5xl text-textDark leading-[1.14] tracking-tight mb-4">
                ${post.title}
            </h1>

            <p class="text-lg sm:text-xl text-textMuted font-normal leading-relaxed mb-6">
                ${post.subtitle || ''}
            </p>

            <div class="flex items-center gap-3 pb-8 mb-8 border-b border-borderLight">
                <div class="w-10 h-10 rounded-full bg-[#E3EFEA] text-brandGreen flex items-center justify-center font-bold text-xs">
                    ${authorInitials}
                </div>
                <div>
                    <p class="text-sm font-medium text-textDark">${authorName}</p>
                    <p class="text-xs text-textMuted">5minSummary Editorial</p>
                </div>
            </div>

            <div class="w-full h-64 sm:h-[400px] rounded-lg overflow-hidden mb-10 bg-bgCard">
                <img src="${post.image}" alt="${post.title}" class="w-full h-full object-cover">
            </div>

            <div id="art-content" class="article-body">
                ${bodyHtml}
            </div>

            <div class="mt-16 pt-8 border-t border-borderLight flex justify-between items-center">
                <button onclick="goBackPage()" class="inline-flex items-center gap-2 bg-brandGreen text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:opacity-95 transition">
                    ← Back
                </button>
                <button onclick="window.scrollTo({top: 0, behavior: 'smooth'})" class="text-xs font-medium text-textMuted hover:text-textDark">
                    Back to top ↑
                </button>
            </div>
        </article>
    </main>

    <script>
        function updateLiveDateTime() {
            const now = new Date();
            const el = document.getElementById('live-datetime');
            if (el) {
                el.textContent = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) + ' • ' +
                    now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
            }
        }
        setInterval(updateLiveDateTime, 1000);
        updateLiveDateTime();

        function goBackPage() {
            if (document.referrer && document.referrer !== window.location.href) {
                window.history.back();
            } else {
                window.location.href = '${backPage}';
            }
        }

        window.addEventListener('keydown', function(e) {
            const tag = document.activeElement.tagName.toLowerCase();
            if (tag !== 'input' && tag !== 'textarea') {
                if (e.key === 'Backspace' || e.key === 'Escape') {
                    e.preventDefault();
                    goBackPage();
                }
            }
        });

        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            document.getElementById('reading-progress').style.width = pct + '%';
        });

        let largeText = false;
        function toggleFontSize() {
            largeText = !largeText;
            document.querySelectorAll('#art-content p').forEach(p => {
                p.style.fontSize = largeText ? '1.26rem' : '1.125rem';
            });
        }
    </script>
</body>
</html>`;
}

// ============================================================================
// 5. CARD HTML GENERATORS FOR INDEX & CATEGORY PAGES
// ============================================================================
function renderWeeklyHeroHtml(w) {
    return `                    <article class="group">
                        <a href="posts/${w.slug}.html" class="block relative overflow-hidden rounded-sm mb-5 bg-bgCard aspect-[16/9] sm:aspect-[16/8.6]">
                            <img src="${w.image}" alt="${w.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-700">
                            <span class="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-brandGreen text-[10px] font-semibold uppercase tracking-[0.14em] px-3 py-1.5 rounded-sm shadow-sm">
                                ${w.badge || 'THE WEEK IN PERSPECTIVE'}
                            </span>
                        </a>
                        <div class="flex items-center justify-between text-xs mb-2">
                            <span class="font-semibold uppercase tracking-[0.12em] text-brandGreen">${w.category || 'CURRENT AFFAIRS'}</span>
                            <span class="text-textMuted flex items-center gap-1">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                ${w.readTime || '5 min read'}
                            </span>
                        </div>
                        <h2 class="font-serif text-3xl sm:text-4xl text-textDark group-hover:text-brandGreen transition mb-3 leading-tight">
                            <a href="posts/${w.slug}.html">${w.title}</a>
                        </h2>
                        <p class="text-textMuted text-base leading-relaxed mb-7 max-w-3xl">
                            ${w.subtitle}
                        </p>
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-2">
                            <a href="posts/${w.slug}.html" class="inline-flex items-center justify-center gap-2.5 bg-brandGreen hover:bg-brandGreenHover text-white text-sm font-medium px-6 py-3 rounded-md transition w-fit">
                                <span>Read the roundup</span>
                                <span>→</span>
                            </a>
                            <div class="w-full sm:w-72">
                                <div class="flex justify-between text-[10px] uppercase tracking-wider font-semibold text-textMuted mb-1.5">
                                    <span>YOUR 5-MINUTE BRIEFING</span>
                                    <span class="text-brandGreen">0 — 5 min</span>
                                </div>
                                <div class="grid grid-cols-5 gap-1.5">
                                    <div class="h-1 bg-brandGreen rounded-full"></div>
                                    <div class="h-1 bg-borderLight rounded-full"></div>
                                    <div class="h-1 bg-borderLight rounded-full"></div>
                                    <div class="h-1 bg-borderLight rounded-full"></div>
                                    <div class="h-1 bg-borderLight rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </article>`;
}

function renderTrendingHtml(trendingItems) {
    const rows = trendingItems.slice(0, 4).map((item, idx) => {
        const num = String(idx + 1).padStart(2, '0');
        return `                            <a href="posts/${item.slug}.html" class="group py-4 flex gap-4 items-start block">
                                <span class="font-serif text-2xl text-goldNum font-normal leading-none pt-0.5">${num}</span>
                                <div>
                                    <p class="text-[10px] font-semibold uppercase tracking-[0.14em] text-brandGreen mb-1">${item.category}</p>
                                    <h3 class="font-serif text-lg text-textDark group-hover:text-brandGreen transition leading-snug mb-1.5">
                                        ${item.trendingTitle || item.title}
                                    </h3>
                                    <span class="text-[11px] text-textMuted flex items-center gap-1">
                                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        ${item.readTime || '5 min read'}
                                    </span>
                                </div>
                            </a>`;
    }).join('\n');

    return `                        <div class="divide-y divide-borderLight">\n${rows}\n                        </div>`;
}

function renderGridCardHtml(item, cardClass, labelOverride) {
    const searchStr = `${item.title} ${item.subtitle} ${item.category} ${item.tag || ''}`.toLowerCase().replace(/"/g, '');
    return `            <a href="posts/${item.slug}.html" class="${cardClass} group block" data-tag="${item.tag || 'all'}" data-search="${searchStr}">
                <div class="w-full aspect-[16/10] bg-bgCard rounded-sm overflow-hidden mb-3.5">
                    <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                </div>
                <div class="flex items-center justify-between text-[11px] mb-1.5">
                    <span class="font-semibold uppercase tracking-[0.12em] text-brandGreen">${labelOverride || item.category}</span>
                    <span class="text-textMuted flex items-center gap-1">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        ${item.readTime || '5 min read'}
                    </span>
                </div>
                <h2 class="font-serif text-2xl text-textDark group-hover:text-brandGreen transition leading-snug mb-1.5">
                    ${item.title}
                </h2>
                <p class="text-xs text-textMuted leading-relaxed">
                    ${item.subtitle}
                </p>
            </a>`;
}

function renderShortReadRowHtml(art) {
    const searchStr = `${art.title} ${art.subtitle} ${art.author} ${art.category} ${art.tag || ''}`.toLowerCase().replace(/"/g, '');
    return `                    <article class="article-card py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group" data-slug="${art.slug}" data-tag="${art.tag || 'all'}" data-search="${searchStr}">
                        <a href="posts/${art.slug}.html" class="flex items-start sm:items-center gap-5 flex-1">
                            <img src="${art.image}" alt="${art.title}" class="w-24 h-20 sm:w-28 sm:h-20 object-cover rounded-sm shrink-0 bg-bgCard">
                            <div>
                                <p class="text-[10px] font-semibold uppercase tracking-[0.14em] text-brandGreen mb-1">${art.category}</p>
                                <h2 class="font-serif text-xl sm:text-2xl text-textDark group-hover:text-brandGreen transition leading-snug mb-1">
                                    ${art.title}
                                </h2>
                                <p class="text-xs text-textMuted">By ${art.author || 'Dev Singh'} · The short read</p>
                            </div>
                        </a>
                        <div class="flex items-center gap-3 self-end sm:self-center shrink-0">
                            <span class="text-xs bg-[#E8EFEA] text-brandGreen px-3 py-1 rounded-full font-medium">${art.readTime || '4 min read'}</span>
                            <button onclick="if(typeof toggleBookmark === 'function') toggleBookmark('${art.slug}', this)" class="bookmark-btn text-textMuted hover:text-brandGreen p-1.5 rounded-full hover:bg-bgCard transition" title="Save Article">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
                            </button>
                        </div>
                    </article>`;
}

// ============================================================================
// 6. MAIN BUILD RUNNER
// ============================================================================
function buildAll() {
    console.log('\n🚀 Reading JSON files from ./content/ ...');

    const weeklyData = readJsonFile('weekly.json');
    const historyData = readJsonFile('history.json');
    const scienceData = readJsonFile('science.json');
    const articlesData = readJsonFile('articles.json');

    let totalGenerated = 0;

    weeklyData.forEach(item => {
        fs.writeFileSync(path.join(POSTS_DIR, `${item.slug}.html`), createDedicatedPostHtml(item, '../index.html'), 'utf8');
        totalGenerated++;
    });
    historyData.forEach(item => {
        fs.writeFileSync(path.join(POSTS_DIR, `${item.slug}.html`), createDedicatedPostHtml(item, '../History.html'), 'utf8');
        totalGenerated++;
    });
    scienceData.forEach(item => {
        fs.writeFileSync(path.join(POSTS_DIR, `${item.slug}.html`), createDedicatedPostHtml(item, '../Science.html'), 'utf8');
        totalGenerated++;
    });
    articlesData.forEach(item => {
        fs.writeFileSync(path.join(POSTS_DIR, `${item.slug}.html`), createDedicatedPostHtml(item, '../Article.html'), 'utf8');
        totalGenerated++;
    });

    console.log(`✅ Generated ${totalGenerated} SEO-optimized article pages in ./posts/`);

    if (historyData.length > 0) {
        const historyHtml = historyData.map(item => renderGridCardHtml(item, 'history-card')).join('\n\n');
        replaceBetweenMarkers(path.join(ROOT_DIR, 'History.html'), '<!-- NODE_HISTORY_START -->', '<!-- NODE_HISTORY_END -->', historyHtml);
    }

    if (scienceData.length > 0) {
        const scienceHtml = scienceData.map(item => renderGridCardHtml(item, 'science-card')).join('\n\n');
        replaceBetweenMarkers(path.join(ROOT_DIR, 'Science.html'), '<!-- NODE_SCIENCE_START -->', '<!-- NODE_SCIENCE_END -->', scienceHtml);
    }

    if (articlesData.length > 0) {
        const articlesHtml = articlesData.map(item => renderShortReadRowHtml(item)).join('\n\n');
        replaceBetweenMarkers(path.join(ROOT_DIR, 'Article.html'), '<!-- NODE_ARTICLES_START -->', '<!-- NODE_ARTICLES_END -->', articlesHtml);
    }

    const indexPath = path.join(ROOT_DIR, 'index.html');
    if (weeklyData.length > 0) {
        replaceBetweenMarkers(indexPath, '<!-- NODE_WEEKLY_START -->', '<!-- NODE_WEEKLY_END -->', renderWeeklyHeroHtml(weeklyData[0]));
    }

    const allCombined = [...articlesData, ...scienceData, ...historyData];
    if (allCombined.length > 0) {
        let trendingList = allCombined.filter(p => p.trending);
        if (trendingList.length < 4) {
            trendingList = [...trendingList, ...allCombined.filter(p => !p.trending)].slice(0, 4);
        }
        replaceBetweenMarkers(indexPath, '<!-- NODE_TRENDING_START -->', '<!-- NODE_TRENDING_END -->', renderTrendingHtml(trendingList));
    }

    const homeHistSciMix = [
        historyData[0] ? { ...historyData[0], homeLabel: 'HISTORY' } : null,
        scienceData[0] ? { ...scienceData[0], homeLabel: 'SCIENCE' } : null,
        historyData[1] ? { ...historyData[1], homeLabel: 'HISTORY' } : null,
        scienceData[1] ? { ...scienceData[1], homeLabel: 'SCIENCE' } : null
    ].filter(Boolean);

    if (homeHistSciMix.length > 0) {
        const homeHistSciHtml = `            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">\n` +
            homeHistSciMix.map(item => renderGridCardHtml(item, 'home-hs-card', item.homeLabel)).join('\n\n') +
            `\n            </div>`;
        replaceBetweenMarkers(indexPath, '<!-- NODE_HIST_SCI_START -->', '<!-- NODE_HIST_SCI_END -->', homeHistSciHtml);
    }

    if (articlesData.length > 0) {
        const homeShortReadHtml = `                    <div class="divide-y divide-borderLight border-b border-borderLight">\n` +
            articlesData.slice(0, 3).map(item => renderShortReadRowHtml(item)).join('\n\n') +
            `\n                    </div>`;
        replaceBetweenMarkers(indexPath, '<!-- NODE_SHORT_READ_START -->', '<!-- NODE_SHORT_READ_END -->', homeShortReadHtml);
    }

    console.log('\n🎉 Build Complete! All pages & SEO tags updated.\n');
}

buildAll();