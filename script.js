document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. SEARCH BAR LOGIC ---
    const searchInput = document.getElementById('realtime-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.book-card');
            
            cards.forEach(card => {
                // Card ke andar se title aur author nikalna
                const title = card.getAttribute('data-title') || '';
                const author = card.getAttribute('data-author') || '';
                
                // Agar search term match ho, toh card dikhao, warna chupao (hide)
                if (title.includes(searchTerm) || author.includes(searchTerm)) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    }

    // --- 2. URL PARAMETERS LOGIC (Footer links ke liye) ---
    // Yeh check karega ki agar link me ?type=genre hai, toh dropdown automatically set ho jaye
    const params = new URLSearchParams(window.location.search);
    const typeParam = params.get('type');
    const categoryParam = params.get('category');

    if (typeParam) {
        setTimeout(() => {
            setFilterType(typeParam);
            if (categoryParam) {
                const selectEl = document.getElementById('dynamic-select');
                const options = Array.from(selectEl.options);
                
                // URL ke word ko HTML ke option se match karna
                const match = options.find(opt => opt.value.toLowerCase().includes(categoryParam.toLowerCase().replace('-', ' ')));
                
                if (match) {
                    selectEl.value = match.value;
                    applyDropdownFilter(match.value);
                }
            }
        }, 100);
    }
});


// --- 3. FILTER TABS & DROPDOWN LOGIC ---
function setFilterType(type) {
    const cards = Array.from(document.querySelectorAll('.book-card'));
    
    // Tabs ke design/color ko active karna
    const allTabs = document.querySelectorAll('#filter-tabs button');
    allTabs.forEach(btn => {
        btn.classList.remove('bg-white', 'text-slate-900', 'shadow-sm');
        btn.classList.add('text-slate-600');
    });
    
    const activeTab = document.getElementById(`tab-${type}`);
    if (activeTab) {
        activeTab.classList.remove('text-slate-600');
        activeTab.classList.add('bg-white', 'text-slate-900', 'shadow-sm');
    }

    const selectContainer = document.getElementById('dynamic-select-container');
    const selectElement = document.getElementById('dynamic-select');

    if (type === 'all') {
        // 'All' click karne par dropdown chupao aur saari books dikhao
        selectContainer.classList.add('hidden');
        cards.forEach(card => card.classList.remove('hidden'));
    } else {
        // Dropdown dikhao aur usme naye options daalo
        selectContainer.classList.remove('hidden');
        selectElement.innerHTML = '<option value="all">Select an option...</option>';
        
        // Saare HTML cards se unique Genre/Author/Title nikalna (Bina JSON ke!)
        let uniqueValues = [...new Set(cards.map(card => card.getAttribute(`data-${type}`)))].filter(Boolean).sort();
        
        uniqueValues.forEach(val => {
            // Pehla letter capital karna display ke liye
            const displayVal = val.charAt(0).toUpperCase() + val.slice(1);
            selectElement.innerHTML += `<option value="${val}">${displayVal}</option>`;
        });
        
        selectElement.dataset.filterType = type;
    }
}

// --- 4. APPLYING DROPDOWN SELECTION ---
function applyDropdownFilter(value) {
    const type = document.getElementById('dynamic-select').dataset.filterType;
    const cards = document.querySelectorAll('.book-card');
    
    if (value === 'all') {
        cards.forEach(card => card.classList.remove('hidden'));
        return;
    }

    cards.forEach(card => {
        if (card.getAttribute(`data-${type}`) === value) {
            card.classList.remove('hidden'); // Dikhana
        } else {
            card.classList.add('hidden'); // Chupana
        }
    });
}

// Global functions taaki HTML se onclick kaam kare
window.setFilterType = setFilterType;
window.applyDropdownFilter = applyDropdownFilter;