(() => {
    const supabaseRestUrl = 'https://iakneqgnrsacfzrplmjf.supabase.co/rest/v1/';
    const supabaseTable = 'search&Filter';
    const supabaseKey = 'sb_publishable_vtnoOpx6sTS5ICMj30uGnw_jXzbcZOa';

    const bucketName = 'F1Images';
    const storageBaseUrl = `https://iakneqgnrsacfzrplmjf.supabase.co/storage/v1/object/public/${bucketName}/`;

    const panel = document.querySelector('#collapseThree');
    const container = panel ? panel.closest('.accordion-item') : document.querySelector('.accordion-item');
    const outputElement = panel ? panel.querySelector('.raw-data') : container?.querySelector('.raw-data');
    const searchForm = panel ? panel.querySelector('.search-form') : container?.querySelector('.search-form');
    const searchBar = panel ? panel.querySelector('.search-bar') : container?.querySelector('.search-bar');
    const teamFilter = panel ? panel.querySelector('.filter-team') : container?.querySelector('.filter-team');
    const yearFilter = panel ? panel.querySelector('.filter-year') : container?.querySelector('.filter-year');
    const engineFilter = panel ? panel.querySelector('.filter-engine') : container?.querySelector('.filter-engine');
    const sortBy = panel ? panel.querySelector('.sort-by') : container?.querySelector('.sort-by');
    const favoritesFilter = panel ? panel.querySelector('.filter-favorites') : container?.querySelector('.filter-favorites');
    const paginationElement = panel ? panel.querySelector('.pagination') : container?.querySelector('.pagination');

    if (!panel || !outputElement || !searchForm || !searchBar || !teamFilter || !yearFilter || !engineFilter || !sortBy || !favoritesFilter) {
        throw new Error('Search and Filter panel elements not found.');
    }

    let allRecords = [];

    // ---- Pagination state ----
    const perPage = 10;           // NEW
    let currentPage = 1;          // NEW
    let currentFiltered = [];     // NEW - holds the last filtered/sorted set

    const FAVORITES_KEY = 'f1-favorites-search-filter';
    const CUSTOM_FAVORITE_ID = 'rexy-review-card';
    let favoriteIds = new Set();

    function syncFavorites() {
        favoriteIds = new Set((JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]')).map(value => String(value)));
    }

    function saveFavorites() {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favoriteIds]));
        window.dispatchEvent(new CustomEvent('favoritesUpdated'));
    }

    function getCustomFavoriteRecord() {
        if (!favoriteIds.has(CUSTOM_FAVORITE_ID)) return null;

        return {
            id: CUSTOM_FAVORITE_ID,
            Image: 'images/AddReview/Rexy.jpg',
            'Active Year': '2026',
            Team: 'AO Racing',
            Name: "AO Racing's Porsche 911 GT3 (Rexy)",
            'Engine Layout': 'Flat-six',
            isCustom: true
        };
    }

    function toggleFavorite(id) {
        const key = String(id);
        if (favoriteIds.has(key)) {
            favoriteIds.delete(key);
        } else {
            favoriteIds.add(key);
        }
        saveFavorites();
        applyFilters(true); // keep current page when just favoriting
    }

    async function fetchDataRaw() {
        const url = new URL(supabaseTable, supabaseRestUrl);
        url.searchParams.set('select', 'id,Image,Active Year,Team,Name,Engine Layout');
        url.searchParams.set('order', 'id.asc');

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                apikey: supabaseKey,
                Authorization: `Bearer ${supabaseKey}`,
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        return Array.isArray(data) ? data : [];
    }

    function renderRecords(records) {
        outputElement.innerHTML = '';

        if (!records.length) {
            outputElement.innerHTML = '<h2 class="center" style="margin-top: 50px; margin-left: 100px">No favorites selected.</h2>';
            if (paginationElement) paginationElement.innerHTML = '';
            return;
        }

        // --- NEW: slice to current page ---
        const start = (currentPage - 1) * perPage;
        const pageRecords = records.slice(start, start + perPage);

        pageRecords.forEach(record => {
            const recordElement = document.createElement('div');
            recordElement.className = 'border rounded col-12 col-md-6 col-lg-2';
            recordElement.style.backgroundColor = '#f0f0f0';
            recordElement.style.blockSize = 'auto';
            recordElement.style.width = '400px';

            const imageUrl = record.Image ? (record.isCustom ? record.Image : `${storageBaseUrl}${record.Image}`) : null;
            const isFav = favoriteIds.has(String(record.id));

            recordElement.innerHTML = `
                ${imageUrl ? `<img src="${imageUrl}" alt="${record.Name ?? ''}" style="max-width:100%; display: block; margin: 0 auto; margin-top: 10px">` : ''}<br>
                <p class="mb-1"><strong>Active year:</strong> ${record['Active Year'] ?? 'N/A'}</p>
                <p class="mb-1"><strong>Team:</strong> ${record.Team ?? 'N/A'}</p>
                <p class="mb-1"><strong>Name:</strong> ${record.Name ?? 'N/A'}</p>
                <p class="mb-1"><strong>Engine layout:</strong> ${record['Engine Layout'] ?? 'N/A'}</p>
                <button type="button"
                        class="btn btn-sm ${isFav ? 'btn-info' : 'btn-outline-warning'} favorite-btn mb-2"
                        data-id="${record.id}">
                    ${isFav ? '★ Favorited' : '☆ Add to Favorites'}
                </button>
            `;
            outputElement.appendChild(recordElement);
        });

        renderPagination(records.length); // NEW
    }

    // --- NEW: build Bootstrap pagination nav ---
    function renderPagination(totalItems) {
        if (!paginationElement) return;
        paginationElement.innerHTML = '';

        const totalPages = Math.ceil(totalItems / perPage);
        if (totalPages <= 1) return;

        const makePageItem = (label, page, disabled = false, active = false) => {
            const li = document.createElement('li');
            li.className = `page-item ${disabled ? 'disabled' : ''} ${active ? 'active' : ''}`;
            li.innerHTML = `<a class="page-link" href="#" data-page="${page}">${label}</a>`;
            return li;
        };

        paginationElement.appendChild(makePageItem('Prev', currentPage - 1, currentPage === 1));

        for (let i = 1; i <= totalPages; i++) {
            paginationElement.appendChild(makePageItem(i, i, false, i === currentPage));
        }

        paginationElement.appendChild(makePageItem('Next', currentPage + 1, currentPage === totalPages));

        paginationElement.querySelectorAll('.page-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = parseInt(e.currentTarget.dataset.page);
                if (!page || page < 1 || page > totalPages || page === currentPage) return;
                currentPage = page;
                renderRecords(currentFiltered);
                outputElement.scrollIntoView({ behavior: 'smooth', block: 'start' }); // optional nicety
            });
        });
    }

    function populateDropdown(selectEl, values) {
        const unique = [...new Set(values.filter(v => v !== null && v !== undefined && v !== ''))]
            .sort((a, b) => a.toString().localeCompare(b.toString(), undefined, { numeric: true }));
        unique.forEach(value => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            selectEl.appendChild(option);
        });
    }

    function populateAllDropdowns(records) {
        populateDropdown(teamFilter, records.map(r => r.Team));
        populateDropdown(yearFilter, records.map(r => r['Active Year']));
        populateDropdown(engineFilter, records.map(r => r['Engine Layout']));
    }

    // --- UPDATED: resets to page 1 unless keepPage is true ---
    function applyFilters(keepPage = false) {
        const q = searchBar.value.trim().toLowerCase();
        const teamVal = teamFilter.value;
        const yearVal = yearFilter.value;
        const engineVal = engineFilter.value;
        const favOnly = favoritesFilter.checked;

        const customRecord = favOnly ? getCustomFavoriteRecord() : null;
        const filtered = allRecords.filter(record => {
            const matchesSearch = !q || [
                record.Image,
                record['Active Year'],
                record.Team,
                record.Name,
                record['Engine Layout']
            ].some(value => value && value.toString().toLowerCase().includes(q));

            const matchesTeam = !teamVal || record.Team === teamVal;
            const matchesYear = !yearVal || record['Active Year']?.toString() === yearVal;
            const matchesEngine = !engineVal || record['Engine Layout'] === engineVal;
            const matchesFavorites = !favOnly || favoriteIds.has(String(record.id));

            return matchesSearch && matchesTeam && matchesYear && matchesEngine && matchesFavorites;
        });

        const customMatches = !!customRecord && (!q || [
            customRecord['Active Year'],
            customRecord.Team,
            customRecord.Name,
            customRecord['Engine Layout']
        ].some(value => value && value.toString().toLowerCase().includes(q))) &&
            (!teamVal || customRecord.Team === teamVal) &&
            (!yearVal || customRecord['Active Year']?.toString() === yearVal) &&
            (!engineVal || customRecord['Engine Layout'] === engineVal);

        const recordsToRender = customMatches ? [customRecord, ...filtered] : filtered;

        currentFiltered = sortRecords(recordsToRender, sortBy.value);
        if (!keepPage) currentPage = 1;

        renderRecords(currentFiltered);
    }

    function sortRecords(records, sortValue) {
        if (!sortValue) return records;

        const [field, direction] = sortValue.split('-');
        const dir = direction === 'desc' ? -1 : 1;

        const fieldMap = {
            year: 'Active Year',
            team: 'Team',
            name: 'Name'
        };
        const key = fieldMap[field];

        return [...records].sort((a, b) => {
            const valA = a[key];
            const valB = b[key];

            if (valA == null) return 1;
            if (valB == null) return -1;

            if (typeof valA === 'number' && typeof valB === 'number') {
                return (valA - valB) * dir;
            }
            return valA.toString().localeCompare(valB.toString(), undefined, { numeric: true }) * dir;
        });
    }

    syncFavorites();

    fetchDataRaw()
        .then(data => {
            allRecords = data;
            populateAllDropdowns(allRecords);
            currentFiltered = allRecords;      // NEW
            renderRecords(currentFiltered);
        })
        .catch(error => {
            outputElement.innerHTML = `<p class="text-danger">Error fetching data: ${error.message}</p>`;
        });

    window.addEventListener('favoritesUpdated', () => {
        syncFavorites();
        applyFilters(true);
    });

    window.addEventListener('storage', (event) => {
        if (event.key === FAVORITES_KEY) {
            syncFavorites();
            applyFilters(true);
        }
    });

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        applyFilters();
    });

    let debounceTimer;
    searchBar.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => applyFilters(), 250);
    });

    teamFilter.addEventListener('change', () => applyFilters());
    yearFilter.addEventListener('change', () => applyFilters());
    engineFilter.addEventListener('change', () => applyFilters());
    sortBy.addEventListener('change', () => applyFilters());
    favoritesFilter.addEventListener('change', () => applyFilters());

    outputElement.addEventListener('click', (e) => {
        const btn = e.target.closest('.favorite-btn');
        if (!btn) return;
        const id = btn.dataset.id;
        if (id === CUSTOM_FAVORITE_ID) {
            toggleFavorite(id);
            return;
        }
        toggleFavorite(Number(id));
    });
})();