const fs = require('fs');
const path = require('path');

// Aapke 'data' folder ka path
const dataFolder = path.join(__dirname, 'data');

async function fixMultipleJSONLinks() {
    console.log("Starting to fix Amazon & Flipkart links in all 52 JSON files...");
    const files = fs.readdirSync(dataFolder);

    for (const file of files) {
        if (file.endsWith('.json')) {
            const filePath = path.join(dataFolder, file);
            const rawData = fs.readFileSync(filePath, 'utf8');
            
            try {
                let bookData = JSON.parse(rawData);
                let amznLink = bookData.links?.amazon;
                let fkrtLink = bookData.links?.flipkart;
                let needsUpdate = false;

                // 1. Amazon Link Fix
                if (amznLink && amznLink.includes("amzn.in")) {
                    console.log(`Expanding Amazon link for: ${file}...`);
                    const response = await fetch(amznLink);
                    // Extra query parameters hata kar clean URL nikalna
                    bookData.links.amazon = response.url.split('?')[0]; 
                    needsUpdate = true;
                }

                // 2. Flipkart Link Fix
                if (fkrtLink && fkrtLink.includes("dl.flipkart.com")) {
                    console.log(`Expanding Flipkart link for: ${file}...`);
                    const response = await fetch(fkrtLink);
                    // Flipkart ke URLs mein bhi extra tracking tags hote hain, unhe clean karna
                    bookData.links.flipkart = response.url.split('?')[0];
                    needsUpdate = true;
                }

                // Agar file mein koi update hua hai, toh hi save karein
                if (needsUpdate) {
                    fs.writeFileSync(filePath, JSON.stringify(bookData, null, 4));
                    console.log(`✅ Updated links in: ${file}`);
                }
            } catch (error) {
                console.error(`Error processing file ${file}:`, error);
            }
        }
    }
    console.log("🎉 Saari 52 files mein Amazon aur Flipkart ke links successfully update ho gaye!");
}

fixMultipleJSONLinks();