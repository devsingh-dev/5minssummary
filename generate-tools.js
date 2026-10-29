/**
 * 5minSummary — Auto Tool Pages Generator with Full SEO Head (generate-tools.js)
 * Run command: node generate-tools.js
 */

const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://5minssummary.com';
const TOOLS_DIR = path.join(__dirname, 'tools');

if (!fs.existsSync(TOOLS_DIR)) {
    fs.mkdirSync(TOOLS_DIR, { recursive: true });
}

const allToolsList = [
    // --- SMART CALCULATORS (9) ---
    { file: "basic-scientific-calculator.html", category: "MATHS", title: "Basic & Scientific Calculator", desc: "Perform standard arithmetic, trigonometry, logarithms, and factorials with a live history tape." },
    { file: "sip-calculator.html", category: "FINANCE", title: "SIP Calculator", desc: "Estimate mutual fund SIP returns, step-up growth, and yearly wealth accumulation." },
    { file: "emi-calculator.html", category: "LOANS", title: "EMI Calculator", desc: "Calculate monthly loan EMIs, simulate extra prepayments, and inspect yearly amortization." },
    { file: "gst-calculator.html", category: "BUSINESS", title: "GST Calculator", desc: "Add or remove GST across official slabs with instant CGST, SGST, and IGST breakdowns." },
    { file: "exact-age-calculator.html", category: "UTILITY", title: "Exact Age Calculator", desc: "Calculate your exact chronological age in years, months, days, and live seconds." },
    { file: "unit-converter.html", category: "MATHS", title: "Unit Converter", desc: "Convert Length, Weight, Temperature, Volume, Speed, Data, Pressure, and Energy units." },
    { file: "currency-converter.html", category: "FINANCE", title: "Currency Converter", desc: "Convert between 20+ world currencies using live mid-market exchange rates." },
    { file: "land-area-converter.html", category: "REAL ESTATE", title: "Land Area Converter", desc: "Convert Acre, Hectare, Dismil, Bigha, Katha, Gaj, and Square Feet accurately." },
    { file: "bmi-calculator.html", category: "HEALTH", title: "BMI Calculator", desc: "Check your Body Mass Index (BMI), ideal weight range, and daily calorie needs." },

    // --- EDITOR TOOLS (9) ---
    { file: "css-gradient-generator.html", category: "DESIGN", title: "CSS Gradient Generator", desc: "Create custom multi-stop linear, radial, and conic CSS gradients visually." },
    { file: "box-shadow-generator.html", category: "WEB DEV", title: "Box Shadow Generator", desc: "Design custom 3D card elevation and neumorphic shadows with CSS & Tailwind code." },
    { file: "color-picker-tool.html", category: "CREATIVE", title: "Color Picker Tool", desc: "Convert HEX, RGB, HSL, and CMYK colors, build palettes, and check WCAG contrast." },
    { file: "modern-ui-generators.html", category: "INTERFACE", title: "Modern UI Generators", desc: "Generate Glassmorphism cards, Neumorphic boxes, CTA buttons, and status badges." },
    { file: "live-weather-tracker.html", category: "UTILITY", title: "Live Weather Tracker", desc: "Track real-time temperature, wind, humidity, UV index, and 7-day forecasts worldwide." },
    { file: "image-compressor.html", category: "MEDIA", title: "Image Compressor", desc: "Compress and convert JPG, PNG, and WebP images locally without losing quality." },
    { file: "online-pdf-editor.html", category: "DOCUMENTS", title: "Online PDF Editor", desc: "Merge, split, rotate, watermark, and convert images to PDF privately in your browser." },
    { file: "video-editor-tool.html", category: "MEDIA", title: "Video Editor Tool", desc: "Trim video clips, apply visual filters, capture HD PNG frames, and export WebM clips." },
    { file: "audio-editor-tool.html", category: "MEDIA", title: "Audio Editor Tool", desc: "Visualize waveforms, trim audio tracks, adjust gain/fades, and export WAV files." },

    // --- GAME HUB / FUN ZONE (9) ---
    { file: "tic-tac-toe.html", category: "CASUAL", title: "Tic Tac Toe", desc: "Play against our unbeatable Minimax AI or a friend on 3×3 and 4×4 grids." },
    { file: "tower-stacker.html", category: "ARCADE", title: "Tower Stacker", desc: "Test your timing and precision by stacking sliding blocks as high as possible." },
    { file: "chess.html", category: "STRATEGY", title: "Chess", desc: "Play classic chess against our smart positional AI bot or in 2-player pass & play mode." },
    { file: "snake-game.html", category: "CLASSIC", title: "Snake Game", desc: "Guide the growing snake across the grid to collect apples and beat your high score." },
    { file: "2048.html", category: "PUZZLE", title: "2048", desc: "Slide and merge matching number tiles on the 4×4 board to reach the 2048 tile." },
    { file: "minesweeper.html", category: "LOGIC", title: "Minesweeper", desc: "Use numerical clues to flag hidden mines and clear the logic grid safely." },
    { file: "tetris.html", category: "PUZZLE", title: "Tetris", desc: "Rotate and stack falling Tetromino blocks with a ghost guide and hold slot." },
    { file: "flappy-bird.html", category: "ARCADE", title: "Flappy Bird", desc: "Fly through pipe gaps, toggle Day/Night skies, and unlock arcade medals." },
    { file: "sudoku.html", category: "PUZZLE", title: "Sudoku", desc: "Solve classic 9×9 number puzzles across Easy, Medium, and Hard difficulty levels." }
];

// IMPORTANT: Keep this false so your 27 completed tool files are never overwritten!


function createToolPageHtml(tool) {
    const pageTitle = `${tool.title} — Free Online ${tool.category} Tool | 5minSummary`;
    const pageDesc = `${tool.title}: ${tool.desc} Use this free interactive ${tool.category.toLowerCase()} utility online on 5minSummary.`;
    const canonicalUrl = `${SITE_URL}/tools/${tool.file}`;

    const schemaJson = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": tool.title,
        "url": canonicalUrl,
        "description": pageDesc,
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "All",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "INR"
        }
    });

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <!-- AUTOMATIC SEO META TAGS FOR TOOL -->
    <title>${pageTitle}</title>
    <meta name="description" content="${pageDesc}">
    <link rel="canonical" href="${canonicalUrl}">

    <!-- Open Graph / Social Preview -->
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="5minSummary">
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${pageDesc}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:image" content="${SITE_URL}/image/og-cover.jpg">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${pageTitle}">
    <meta name="twitter:description" content="${pageDesc}">

    <!-- Universal Meta & Inline Favicon -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="index, follow">
    <meta name="author" content="5minSummary">
    <meta name="theme-color" content="#134E3A">
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 36 36'><rect width='36' height='36' rx='6' fill='%23134E3A'/><text x='50%25' y='54%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-family='Georgia, serif' font-size='22'>5</text></svg>">

    <!-- Tailwind CSS & Fonts -->
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
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #FBFBF8; }
        ::-webkit-scrollbar-thumb { background: #D5D1C5; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #134E3A; }
    </style>

    <!-- Structured Data (WebApplication Schema) -->
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

    <!-- 1. TOP LIVE DATE & TIME BAR -->
    <div class="bg-brandGreen text-white text-xs border-b border-white/10">
        <div class="max-w-[1360px] mx-auto px-4 sm:px-8 py-2 flex flex-wrap justify-between items-center gap-2">
            <div class="flex items-center gap-2 font-medium tracking-wide">
                <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span id="live-datetime">Loading date & time...</span>
            </div>
            <div class="flex items-center gap-4 text-[11px] text-emerald-100/90">
                <span>${tool.category} • ${tool.title}</span>
                <span class="hidden sm:inline">•</span>
                <span class="hidden sm:inline">5minSummary Utilities</span>
            </div>
        </div>
    </div>

    <!-- 2. UNIVERSAL NAVBAR -->
    <header class="sticky top-0 z-40 bg-bgMain/95 backdrop-blur-md border-b border-borderLight">
        <div class="max-w-[1360px] mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-4">
            <a href="../index.html" class="flex items-center gap-2.5 shrink-0 group">
                <div class="w-8 h-9 bg-brandGreen rounded-[5px] flex items-center justify-center text-white font-serif text-xl font-medium group-hover:bg-brandGreenHover transition">5</div>
                <span class="font-serif text-2xl sm:text-[26px] tracking-tight text-textDark font-normal">5minSummary</span>
            </a>

            <div class="hidden lg:flex items-center gap-8 text-[14px] font-medium text-textDark">
                <a href="../Books.html" class="hover:text-brandGreen transition">Books</a>
                <a href="../History.html" class="hover:text-brandGreen transition">History</a>
                <a href="../Science.html" class="hover:text-brandGreen transition">Science</a>
                <a href="../Article.html" class="hover:text-brandGreen transition">Articles</a>
                <a href="../Tools.html" class="text-brandGreen font-semibold">Tools</a>
                <div class="h-5 w-[1px] bg-borderLight"></div>
                <div class="w-9 h-9 rounded-full bg-[#E3EFEA] text-brandGreen flex items-center justify-center text-xs font-semibold">AK</div>
            </div>

            <button id="mobile-menu-btn" class="lg:hidden p-2 rounded-lg text-textDark hover:bg-bgCard">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
        </div>

        <div id="mobile-menu" class="hidden lg:hidden border-t border-borderLight bg-bgMain px-4 pt-3 pb-5 space-y-2 text-sm font-medium">
            <a href="../Books.html" class="block py-2 px-3 rounded-md hover:bg-bgCard">Books</a>
            <a href="../History.html" class="block py-2 px-3 rounded-md hover:bg-bgCard">History</a>
            <a href="../Science.html" class="block py-2 px-3 rounded-md hover:bg-bgCard">Science</a>
            <a href="../Article.html" class="block py-2 px-3 rounded-md hover:bg-bgCard">Articles</a>
            <a href="../Tools.html" class="block py-2 px-3 rounded-md bg-brandGreen/10 text-brandGreen font-semibold">Tools</a>
        </div>
    </header>

    <!-- 3. MAIN TOOL BODY -->
    <main class="flex-grow max-w-[1360px] w-full mx-auto px-4 sm:px-8 pt-8 pb-20">
        <div class="mb-8 pb-6 border-b border-borderLight">
            <a href="../Tools.html" class="inline-flex items-center gap-1.5 text-xs font-semibold text-brandGreen hover:underline mb-3">
                <span>← Back to All Tools & Games</span>
            </a>
            <div class="flex items-center gap-2.5 mb-1.5">
                <span class="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded bg-[#FF6B00]/10 text-[#FF6B00]">
                    ${tool.category}
                </span>
            </div>
            <h1 class="font-serif text-3xl sm:text-5xl text-textDark tracking-tight leading-tight">${tool.title}</h1>
            <p class="text-textMuted text-sm sm:text-base mt-1.5">${tool.desc}</p>
        </div>

        <!-- PASTE YOUR TOOL CODE BELOW THIS LINE -->
        <section id="tool-workspace" class="bg-white border border-borderLight rounded-2xl p-6 sm:p-10 shadow-sm min-h-[420px]">
            <div class="text-center py-16 text-textMuted">
                <p class="font-serif text-2xl text-textDark mb-2">${tool.title} Workspace</p>
                <p class="text-sm">Yahan apna <strong>${tool.file}</strong> ka code paste karein.</p>
            </div>
        </section>
        <!-- PASTE YOUR TOOL CODE ABOVE THIS LINE -->
    </main>

    <!-- 4. UNIVERSAL FOOTER -->
    <footer class="border-t border-borderLight bg-[#F6F5F0] mt-auto">
        <div class="max-w-[1360px] mx-auto px-4 sm:px-8 py-14">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-10 border-b border-borderLight">
                <div>
                    <a href="../index.html" class="font-serif text-3xl text-brandGreen tracking-tight block mb-2">5minSummary</a>
                    <p class="text-textMuted text-sm">Less scrolling. More understanding.</p>
                </div>
                <div class="flex flex-wrap gap-6 sm:gap-8 text-sm text-textMuted font-medium">
                    <a href="../about/our-story.html" class="hover:text-brandGreen transition">Our story</a>
                    <a href="../about/editorial-approach.html" class="hover:text-brandGreen transition">Editorial approach</a>
                    <a href="../about/contact.html" class="hover:text-brandGreen transition">Contact</a>
                    <a href="../about/privacy.html" class="hover:text-brandGreen transition">Privacy</a>
                </div>
            </div>
            <div class="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-textMuted">
                <p>© 2026 5minSummary. Made for curious minds.</p>
                <p>An independent space for ideas, context and discovery.</p>
            </div>
        </div>
    </footer>

    <script>
        function updateLiveDateTime() {
            const now = new Date();
            const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });
            const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
            document.getElementById('live-datetime').textContent = \`\${dateStr}  |  \${timeStr}\`;
        }
        setInterval(updateLiveDateTime, 1000);
        updateLiveDateTime();

        document.getElementById('mobile-menu-btn').addEventListener('click', () => {
            document.getElementById('mobile-menu').classList.toggle('hidden');
        });
    </script>
</body>
</html>`;
}

// Note: Agar aap purani generated 27 files me bhi naya SEO head update karna chahte hain,
// toh ek baar OVERWRITE_EXISTING = true karke run kar lein (agar abhi unme tool code nahi dala hai).
const OVERWRITE_EXISTING = false;

allToolsList.forEach(tool => {
    const filePath = path.join(TOOLS_DIR, tool.file);
    if (fs.existsSync(filePath) && !OVERWRITE_EXISTING) {
        console.log(`⏭️ Skipped: tools/${tool.file}`);
    } else {
        fs.writeFileSync(filePath, createToolPageHtml(tool), 'utf8');
        console.log(`✅ Created with SEO: tools/${tool.file}`);
    }
});