// JavaScript Logic: Quiniela Mundial 2026

// Global State
let quinielaData = { matches: [], leaderboard: [] };
let activeGroup = 'A';
let currentTab = 'tab-standings';
let matchesViewMode = 'group'; // 'group' or 'date'
let activeDate = 'all'; // 'all' or '2026-06-11' etc.
let selectedPlayer = null;

// Team flag codes (flagcdn.com)
const TEAM_FLAGS = {
    'Alemania': 'de',
    'Arabia Saudita': 'sa',
    'Argelia': 'dz',
    'Argentina': 'ar',
    'Australia': 'au',
    'Austria': 'at',
    'Bosnia': 'ba',
    'Brasil': 'br',
    'Bélgica': 'be',
    'Cabo Verde': 'cv',
    'Canadá': 'ca',
    'Catar': 'qa',
    'Colombia': 'co',
    'Corea del Sur': 'kr',
    'Costa de Marfil': 'ci',
    'Croacia': 'hr',
    'Curazao': 'cw',
    'Ecuador': 'ec',
    'Egipto': 'eg',
    'Escocia': 'gb-sct',
    'España': 'es',
    'Estados Unidos': 'us',
    'Francia': 'fr',
    'Ghana': 'gh',
    'Haití': 'ht',
    'Inglaterra': 'gb-eng',
    'Irak': 'iq',
    'Irán': 'ir',
    'Japón': 'jp',
    'Jordania': 'jo',
    'Marruecos': 'ma',
    'México': 'mx',
    'Noruega': 'no',
    'Nueva Zelanda': 'nz',
    'Panamá': 'pa',
    'Paraguay': 'py',
    'Países Bajos': 'nl',
    'Holanda': 'nl',
    'Portugal': 'pt',
    'RD del Congo': 'cd',
    'República Checa': 'cz',
    'Senegal': 'sn',
    'Sudáfrica': 'za',
    'Suecia': 'se',
    'Suiza': 'ch',
    'Turquía': 'tr',
    'Túnez': 'tn',
    'Uruguay': 'uy',
    'Uzbekistán': 'uz'
};

// Player Avatars Themes and Styles
const PLAYER_CONFIG = {
    'Deivid': { bg: '#2563eb', hair: '#1e3a8a', skin: '#fbcfe8', hairStyle: 'spiky' },
    'Cesar': { bg: '#ea580c', hair: '#7c2d12', skin: '#fed7aa', hairStyle: 'glasses' },
    'Ferney': { bg: '#16a34a', hair: '#14532d', skin: '#fef08a', hairStyle: 'beard' },
    'Edisabet': { bg: '#db2777', hair: '#50072b', skin: '#ffedd5', hairStyle: 'long' },
    'Jhair': { bg: '#0d9488', hair: '#115e59', skin: '#e0f2fe', hairStyle: 'cap' },
    'Duvan': { bg: '#9333ea', hair: '#581c87', skin: '#ffedd5', hairStyle: 'curly' }
};

// Date translation map
const DATE_TRANSLATIONS = {
    '2026-06-11': 'Jueves 11 de Junio',
    '2026-06-12': 'Viernes 12 de Junio',
    '2026-06-13': 'Sábado 13 de Junio',
    '2026-06-14': 'Domingo 14 de Junio',
    '2026-06-15': 'Lunes 15 de Junio',
    '2026-06-16': 'Martes 16 de Junio',
    '2026-06-17': 'Miércoles 17 de Junio',
    '2026-06-18': 'Jueves 18 de Junio',
    '2026-06-19': 'Viernes 19 de Junio',
    '2026-06-20': 'Sábado 20 de Junio',
    '2026-06-21': 'Domingo 21 de Junio',
    '2026-06-22': 'Lunes 22 de Junio',
    '2026-06-23': 'Martes 23 de Junio',
    '2026-06-24': 'Miércoles 24 de Junio',
    '2026-06-25': 'Jueves 25 de Junio',
    '2026-06-26': 'Viernes 26 de Junio',
    '2026-06-27': 'Sábado 27 de Junio',
    '2026-06-28': 'Domingo 28 de Junio'
};

function formatDateSpanish(dateStr) {
    return DATE_TRANSLATIONS[dateStr] || dateStr;
}

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

// App Initialization
function initApp() {
    // Tab Navigation setup
    const navButtons = document.querySelectorAll('.app-nav .nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });

    // Close Modal Event
    document.getElementById('btn-close-modal').addEventListener('click', closeModal);
    // Modal Overlay click to close
    document.getElementById('player-modal').addEventListener('click', (e) => {
        if (e.target.id === 'player-modal') closeModal();
    });

    // Modal Filters Event Listeners
    document.getElementById('modal-group-filter').addEventListener('change', updatePlayerModalPredictions);
    document.getElementById('modal-status-filter').addEventListener('change', updatePlayerModalPredictions);

    // Matches View Mode Selector setup (By Group vs By Date)
    const viewByGroupBtn = document.getElementById('view-by-group-btn');
    const viewByDateBtn = document.getElementById('view-by-date-btn');
    
    if (viewByGroupBtn && viewByDateBtn) {
        viewByGroupBtn.addEventListener('click', () => {
            viewByGroupBtn.classList.add('active');
            viewByDateBtn.classList.remove('active');
            matchesViewMode = 'group';
            renderMatches();
        });
        
        viewByDateBtn.addEventListener('click', () => {
            viewByDateBtn.classList.add('active');
            viewByGroupBtn.classList.remove('active');
            matchesViewMode = 'date';
            renderMatches();
        });
    }

    // Admin Auth Events
    document.getElementById('btn-admin-login').addEventListener('click', handleAdminLogin);
    document.getElementById('admin-password').addEventListener('keyup', (e) => {
        if (e.key === 'Enter') handleAdminLogin();
    });
    document.getElementById('btn-admin-logout').addEventListener('click', handleAdminLogout);

    // Admin search & filter events
    document.getElementById('admin-search-team').addEventListener('input', renderAdminMatches);
    document.getElementById('admin-filter-status').addEventListener('change', renderAdminMatches);

    // Load Session Auth state
    checkAdminAuthState();

    // Fetch initial Data
    fetchData();
}

// Switch Active Tabs
function switchTab(tabId) {
    currentTab = tabId;
    
    // Update active nav button
    const navButtons = document.querySelectorAll('.app-nav .nav-btn');
    navButtons.forEach(btn => {
        if (btn.getAttribute('data-tab') === tabId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update active tab panel
    const panels = document.querySelectorAll('.tab-panel');
    panels.forEach(panel => {
        if (panel.id === tabId) {
            panel.classList.add('active');
        } else {
            panel.classList.remove('active');
        }
    });

    // Specific tab loads
    if (tabId === 'tab-matches') {
        renderGroupTabs();
        renderMatches();
    } else if (tabId === 'tab-admin') {
        checkAdminAuthState();
    } else if (tabId === 'tab-standings') {
        renderStandings();
    }
}

// Fetch Quiniela Data from Flask API
async function fetchData() {
    try {
        const response = await fetch('/api/data');
        if (!response.ok) {
            throw new Error('Error al obtener datos del servidor');
        }
        quinielaData = await response.json();
        
        // Refresh whatever is currently active
        renderStandings();
        if (currentTab === 'tab-matches') {
            renderMatches();
        } else if (currentTab === 'tab-admin') {
            renderAdminMatches();
        }
        
        // Update total statistics in the header (e.g. Played matches)
        const playedCount = quinielaData.matches.filter(m => m.outcome).length;
        document.getElementById('header-stats').innerHTML = `Partidos Jugados: ${playedCount}/72`;
        
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// Renders the Standings List (Tab 1)
function renderStandings() {
    const listContainer = document.getElementById('leaderboard-list');
    listContainer.innerHTML = '';
    
    if (quinielaData.leaderboard.length === 0) {
        listContainer.innerHTML = '<div class="loading-spinner">No hay datos en el ranking.</div>';
        return;
    }

    quinielaData.leaderboard.forEach((player, index) => {
        const rank = index + 1;
        let rankBadgeClass = '';
        let rankContent = '';

        if (rank === 1) {
            rankBadgeClass = 'rank-badge rank-1';
            rankContent = '<i class="fa-solid fa-crown"></i>';
        } else if (rank === 2) {
            rankBadgeClass = 'rank-badge rank-2';
            rankContent = '2';
        } else if (rank === 3) {
            rankBadgeClass = 'rank-badge rank-3';
            rankContent = '3';
        } else {
            rankBadgeClass = 'rank-text';
            rankContent = rank;
        }

        const card = document.createElement('div');
        card.className = `player-card glass-card ${player.is_leader ? 'leader-glow' : ''}`;
        
        const avatarHtml = getAvatarSVG(player.name, player.is_leader);

        card.innerHTML = `
            <div class="rank-container">
                <span class="${rankBadgeClass}">${rankContent}</span>
            </div>
            <div class="player-info">
                ${avatarHtml}
                <div>
                    <span class="player-name">${player.name}</span>
                    <div class="player-stats-summary">
                        Acertados: <b class="text-success">${player.correct}</b> | 
                        Fallados: <b class="text-danger">${player.incorrect}</b>
                    </div>
                </div>
            </div>
            <div class="player-score-container">
                <span class="player-pts">${player.points}</span>
                <span class="player-pts-label">Puntos</span>
            </div>
            <i class="fa-solid fa-chevron-right arrow-indicator"></i>
        `;

        card.addEventListener('click', () => openPlayerModal(player));
        listContainer.appendChild(card);
    });
}

// Renders horizontal Group Selector Tabs (A to L)
function renderGroupTabs() {
    const container = document.getElementById('group-tabs-list');
    if (container.innerHTML !== '') return; // Already rendered once

    const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
    groups.forEach(g => {
        const btn = document.createElement('button');
        btn.className = `group-tab-btn ${g === activeGroup ? 'active' : ''}`;
        btn.textContent = `Grupo ${g}`;
        btn.addEventListener('click', () => {
            document.querySelectorAll('.group-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeGroup = g;
            renderMatches();
        });
        container.appendChild(btn);
    });
}

// Renders horizontal Date Selector Tabs (11 Jun to 28 Jun)
function renderDateTabs() {
    const container = document.getElementById('date-tabs-list');
    container.innerHTML = '';
    
    // Extract unique dates from matches
    const dates = [...new Set(quinielaData.matches.map(m => m.date))].sort();
    
    // Add "Todos" pill
    const allBtn = document.createElement('button');
    allBtn.className = `group-tab-btn ${activeDate === 'all' ? 'active' : ''}`;
    allBtn.textContent = 'Todos';
    allBtn.addEventListener('click', () => {
        document.querySelectorAll('#date-tabs-list .group-tab-btn').forEach(b => b.classList.remove('active'));
        allBtn.classList.add('active');
        activeDate = 'all';
        renderMatches();
    });
    container.appendChild(allBtn);
    
    // Add pill for each date
    dates.forEach(d => {
        const btn = document.createElement('button');
        btn.className = `group-tab-btn ${d === activeDate ? 'active' : ''}`;
        
        // format date string (e.g., '2026-06-11' -> '11 Jun')
        const parts = d.split('-');
        const day = parseInt(parts[2]);
        btn.textContent = `${day} Jun`;
        
        btn.addEventListener('click', () => {
            document.querySelectorAll('#date-tabs-list .group-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeDate = d;
            renderMatches();
        });
        container.appendChild(btn);
    });
}

// Reusable helper: Builds a match fixture card DOM element
function createMatchCard(match, showFullDateInHeader = true) {
    const card = document.createElement('div');
    card.className = 'match-card glass-card';

    const isPlayed = match.outcome !== null;
    const statusText = isPlayed ? 'Finalizado' : 'Pendiente';
    const statusClass = isPlayed ? 'played' : 'pending';

    const localFlag = getFlagImg(match.local);
    const visitorFlag = getFlagImg(match.visitante);

    const goalsLocal = match.goles_local !== null ? match.goles_local : '';
    const goalsVisitor = match.goles_visitante !== null ? match.goles_visitante : '';

    let scoreHtml = '';
    if (isPlayed) {
        scoreHtml = `
            <div class="score-nums">
                <span>${goalsLocal}</span>
                <span class="score-dash">-</span>
                <span>${goalsVisitor}</span>
            </div>
        `;
    } else {
        scoreHtml = `<span class="score-vs">VS</span>`;
    }

    // Predictions list
    let predictionsHtml = '';
    Object.entries(match.predictions).forEach(([player, pInfo]) => {
        const playerConfig = PLAYER_CONFIG[player] || { bg: '#9ca3af' };
        const statusClass = pInfo.status;
        
        let statusIcon = '';
        if (pInfo.status === 'correct') {
            statusIcon = '<i class="fa-solid fa-circle-check pred-indicator correct-icon"></i>';
        } else if (pInfo.status === 'incorrect') {
            statusIcon = '<i class="fa-solid fa-circle-xmark pred-indicator incorrect-icon"></i>';
        } else {
            statusIcon = '<i class="fa-regular fa-circle pred-indicator"></i>';
        }

        // Resolve flag
        let predFlag = '';
        if (pInfo.prediction_display === match.local) {
            predFlag = `<span class="pred-flag">${getFlagImg(match.local)}</span>`;
        } else if (pInfo.prediction_display === match.visitante) {
            predFlag = `<span class="pred-flag">${getFlagImg(match.visitante)}</span>`;
        } else if (pInfo.prediction_display === 'Empate') {
            predFlag = '<i class="fa-solid fa-handshake" style="font-size: 0.85rem; opacity: 0.6; margin-right: 2px;"></i>';
        }

        predictionsHtml += `
            <div class="prediction-item ${statusClass}">
                <div class="pred-user-avatar" style="background-color: ${playerConfig.bg}; overflow:hidden;">
                    ${getMiniAvatarSVG(player, player.is_leader)}
                </div>
                <div class="pred-details">
                    <span class="pred-user-name">${player}</span>
                    <span class="pred-choice">
                        ${predFlag}
                        <span>${pInfo.prediction_display}</span>
                    </span>
                </div>
                ${statusIcon}
            </div>
        `;
    });

    // Determine subtitle based on view mode (show date and time or only time)
    const dateHourStr = showFullDateInHeader 
        ? `${formatDateSpanish(match.date)} • ${match.time || '12:00'} hs` 
        : `${match.time || '12:00'} hs`;

    card.innerHTML = `
        <div class="match-header">
            <span class="match-group-lbl">Grupo ${match.group} • Fila ${match.row} • ${dateHourStr}</span>
            <span class="match-status-lbl ${statusClass}">${statusText}</span>
        </div>
        <div class="match-core">
            <div class="match-team">
                <div class="flag-container">${localFlag}</div>
                <span class="team-name">${match.local}</span>
            </div>
            <div class="match-score-display">
                ${scoreHtml}
            </div>
            <div class="match-team">
                <div class="flag-container">${visitorFlag}</div>
                <span class="team-name">${match.visitante}</span>
            </div>
        </div>
        
        <button class="match-predictions-toggle" data-match-row="${match.row}">
            <span>Ver Pronósticos</span> <i class="fa-solid fa-chevron-down"></i>
        </button>
        <div class="match-predictions-drawer" id="drawer-${match.row}">
            <div class="predictions-grid">
                ${predictionsHtml}
            </div>
        </div>
    `;

    // Toggle drawer event
    const toggleBtn = card.querySelector('.match-predictions-toggle');
    const drawer = card.querySelector('.match-predictions-drawer');
    toggleBtn.addEventListener('click', () => {
        const isOpen = drawer.style.display === 'block';
        drawer.style.display = isOpen ? 'none' : 'block';
        toggleBtn.classList.toggle('open', !isOpen);
        toggleBtn.querySelector('span').textContent = isOpen ? 'Ver Pronósticos' : 'Ocultar Pronósticos';
    });

    return card;
}

// Renders the list of Matches for the active tab (Tab 2)
function renderMatches() {
    const listContainer = document.getElementById('matches-list');
    listContainer.innerHTML = '';
    
    const groupTabsNav = document.getElementById('group-tabs-nav-container');
    const dateTabsNav = document.getElementById('date-tabs-nav-container');

    if (matchesViewMode === 'group') {
        // Show group navbar, hide date navbar
        if (groupTabsNav) groupTabsNav.classList.remove('hidden');
        if (dateTabsNav) dateTabsNav.classList.add('hidden');

        const groupMatches = quinielaData.matches.filter(m => m.group === activeGroup);

        if (groupMatches.length === 0) {
            listContainer.innerHTML = '<div class="loading-spinner">No hay encuentros para este grupo.</div>';
            return;
        }

        groupMatches.forEach(match => {
            // Show full date in group view matches
            listContainer.appendChild(createMatchCard(match, true));
        });
    } else {
        // Hide group navbar, show date navbar
        if (groupTabsNav) groupTabsNav.classList.add('hidden');
        if (dateTabsNav) dateTabsNav.classList.remove('hidden');

        // Dynamically build date selector pills
        renderDateTabs();

        if (activeDate === 'all') {
            // Group matches by Date
            const matchesByDate = {};
            quinielaData.matches.forEach(match => {
                const date = match.date || '2026-06-11';
                if (!matchesByDate[date]) {
                    matchesByDate[date] = [];
                }
                matchesByDate[date].push(match);
            });

            // Sort dates chronologically
            const sortedDates = Object.keys(matchesByDate).sort();

            if (sortedDates.length === 0) {
                listContainer.innerHTML = '<div class="loading-spinner">No hay encuentros.</div>';
                return;
            }

            sortedDates.forEach(dateStr => {
                // Add date section header
                const dateHeader = document.createElement('div');
                dateHeader.className = 'date-section-header';
                dateHeader.innerHTML = `<i class="fa-regular fa-calendar-check" style="margin-right: 4px;"></i> ${formatDateSpanish(dateStr)}`;
                listContainer.appendChild(dateHeader);

                // Add all match cards for this date (no need for date in card header since it is in dateHeader)
                matchesByDate[dateStr].forEach(match => {
                    listContainer.appendChild(createMatchCard(match, false));
                });
            });
        } else {
            // Render only matches for activeDate
            const dateMatches = quinielaData.matches.filter(m => m.date === activeDate);
            
            if (dateMatches.length === 0) {
                listContainer.innerHTML = '<div class="loading-spinner">No hay encuentros para este día.</div>';
                return;
            }

            // Add single date header
            const dateHeader = document.createElement('div');
            dateHeader.className = 'date-section-header';
            dateHeader.innerHTML = `<i class="fa-regular fa-calendar-check" style="margin-right: 4px;"></i> ${formatDateSpanish(activeDate)}`;
            listContainer.appendChild(dateHeader);

            // Add match cards (hide date in card header)
            dateMatches.forEach(match => {
                listContainer.appendChild(createMatchCard(match, false));
            });
        }
    }
}

// Open Player Predictions Details Modal
function openPlayerModal(player) {
    selectedPlayer = player;
    
    document.getElementById('modal-player-name').textContent = player.name;
    document.getElementById('modal-player-points').textContent = `${player.points} PUNTOS`;
    document.getElementById('modal-stat-correct').textContent = player.correct;
    document.getElementById('modal-stat-incorrect').textContent = player.incorrect;
    document.getElementById('modal-stat-pending').textContent = player.pending;
    
    // Render Avatar inside modal
    document.getElementById('modal-player-avatar').innerHTML = getAvatarSVG(player.name, player.is_leader);

    // Populate Group Filter options
    const grpSelect = document.getElementById('modal-group-filter');
    grpSelect.innerHTML = '<option value="all">Todos los grupos</option>';
    const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
    groups.forEach(g => {
        const opt = document.createElement('option');
        opt.value = g;
        opt.textContent = `Grupo ${g}`;
        grpSelect.appendChild(opt);
    });

    // Reset filters
    document.getElementById('modal-group-filter').value = 'all';
    document.getElementById('modal-status-filter').value = 'all';

    // Renders predictions
    updatePlayerModalPredictions();

    // Show modal overlay
    const overlay = document.getElementById('player-modal');
    overlay.classList.remove('hidden');
}

function closeModal() {
    document.getElementById('player-modal').classList.add('hidden');
    selectedPlayer = null;
}

// Update modal predictions list based on active filters
function updatePlayerModalPredictions() {
    if (!selectedPlayer) return;

    const groupFilter = document.getElementById('modal-group-filter').value;
    const statusFilter = document.getElementById('modal-status-filter').value;
    const listContainer = document.getElementById('modal-predictions-list');
    listContainer.innerHTML = '';

    // Filter matches
    let filteredMatches = quinielaData.matches.filter(match => {
        // Group Filter
        if (groupFilter !== 'all' && match.group !== groupFilter) return false;
        
        const pInfo = match.predictions[selectedPlayer.name];
        if (!pInfo) return false;

        // Status Filter
        if (statusFilter !== 'all') {
            if (statusFilter === 'correct' && pInfo.status !== 'correct') return false;
            if (statusFilter === 'incorrect' && pInfo.status !== 'incorrect') return false;
            if (statusFilter === 'pending' && pInfo.status !== 'pending') return false;
        }

        return true;
    });

    if (filteredMatches.length === 0) {
        listContainer.innerHTML = '<div class="loading-spinner" style="font-size:0.8rem; padding: 15px;">No hay pronósticos que coincidan con los filtros.</div>';
        return;
    }

    // Sort modal predictions by date chronologically
    filteredMatches.sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

    filteredMatches.forEach(match => {
        const pInfo = match.predictions[selectedPlayer.name];
        const card = document.createElement('div');
        
        let statusClass = pInfo.status;
        card.className = `modal-prediction-card ${statusClass}`;

        const isPlayed = match.outcome !== null;
        let actualScoreStr = '';
        if (isPlayed) {
            actualScoreStr = `Resultado: ${match.goles_local} - ${match.goles_visitante}`;
        } else {
            actualScoreStr = `Fecha: ${formatDateSpanish(match.date)} • ${match.time || '12:00'} hs`;
        }

        let predIcon = '⚪';
        if (pInfo.status === 'correct') predIcon = '🟢';
        else if (pInfo.status === 'incorrect') predIcon = '🔴';

        card.innerHTML = `
            <span class="modal-pred-grp">G-${match.group}</span>
            <div class="modal-pred-teams">
                <div>${match.local} vs ${match.visitante}</div>
                <div class="modal-pred-actual">${actualScoreStr}</div>
            </div>
            <div class="modal-pred-choice-wrap">
                <span class="modal-pred-choice">${predIcon} ${pInfo.prediction_display}</span>
            </div>
        `;
        listContainer.appendChild(card);
    });
}

// Check if admin password is saved in sessionStorage
function checkAdminAuthState() {
    const savedPass = sessionStorage.getItem('quiniela_admin_pass');
    const loginCard = document.getElementById('admin-login-card');
    const dashboard = document.getElementById('admin-dashboard');

    if (savedPass) {
        loginCard.classList.add('hidden');
        dashboard.classList.remove('hidden');
        renderAdminMatches();
    } else {
        loginCard.classList.remove('hidden');
        dashboard.classList.add('hidden');
    }
}

// Log in as administrator
function handleAdminLogin() {
    const passInput = document.getElementById('admin-password');
    const pass = passInput.value.trim();

    if (!pass) {
        showToast('Ingresa una contraseña', 'error');
        return;
    }

    // Direct check since password is local
    if (pass === 'mundial2026') {
        sessionStorage.setItem('quiniela_admin_pass', pass);
        passInput.value = '';
        checkAdminAuthState();
        showToast('Sesión de administrador iniciada', 'success');
    } else {
        showToast('Clave incorrecta', 'error');
    }
}

function handleAdminLogout() {
    sessionStorage.removeItem('quiniela_admin_pass');
    checkAdminAuthState();
    showToast('Sesión cerrada', 'success');
}

// Renders the list of editable matches in the Admin Panel
function renderAdminMatches() {
    const listContainer = document.getElementById('admin-matches-list');
    listContainer.innerHTML = '';

    const searchTerm = document.getElementById('admin-search-team').value.toLowerCase();
    const statusFilter = document.getElementById('admin-filter-status').value;

    let filtered = quinielaData.matches.filter(match => {
        // Status filter
        const isPlayed = match.outcome !== null;
        if (statusFilter === 'played' && !isPlayed) return false;
        if (statusFilter === 'pending' && isPlayed) return false;

        // Search term
        if (searchTerm) {
            const matchesLocal = match.local.toLowerCase().includes(searchTerm);
            const matchesVisitante = match.visitante.toLowerCase().includes(searchTerm);
            if (!matchesLocal && !matchesVisitante) return false;
        }

        return true;
    });

    if (filtered.length === 0) {
        listContainer.innerHTML = '<div class="loading-spinner">Ningún partido coincide con los filtros.</div>';
        return;
    }

    // Sort admin matches chronologically
    filtered.sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time) || a.row - b.row);

    filtered.forEach(match => {
        const card = document.createElement('div');
        card.className = 'match-card glass-card';

        const localFlag = getFlagImg(match.local);
        const visitorFlag = getFlagImg(match.visitante);
        const goalsLocal = match.goles_local !== null ? match.goles_local : '';
        const goalsVisitor = match.goles_visitante !== null ? match.goles_visitante : '';

        card.innerHTML = `
            <div class="match-header">
                <span class="match-group-lbl">Grupo ${match.group} • Fila ${match.row} • ${formatDateSpanish(match.date)} • ${match.time || '12:00'} hs</span>
                <span class="match-status-lbl ${match.outcome ? 'played' : 'pending'}">
                    ${match.outcome ? 'Finalizado' : 'Pendiente'}
                </span>
            </div>
            <div class="match-core admin-match-edit">
                <div style="display:flex; align-items:center; justify-content:space-around; width:100%;">
                    <!-- Local team -->
                    <div class="match-team" style="flex:1;">
                        <div class="flag-container">${localFlag}</div>
                        <span class="team-name">${match.local}</span>
                    </div>

                    <!-- Scores input -->
                    <div class="admin-score-inputs">
                        <input type="number" class="score-input" id="admin-local-${match.row}" value="${goalsLocal}" min="0" placeholder="-">
                        <span style="font-weight:700; color:var(--text-inactive)">:</span>
                        <input type="number" class="score-input" id="admin-visit-${match.row}" value="${goalsVisitor}" min="0" placeholder="-">
                    </div>

                    <!-- Visitor team -->
                    <div class="match-team" style="flex:1;">
                        <div class="flag-container">${visitorFlag}</div>
                        <span class="team-name">${match.visitante}</span>
                    </div>
                </div>
            </div>
            
            <div class="admin-edit-actions">
                <button class="btn btn-sm btn-primary btn-save-score" data-row="${match.row}">
                    <i class="fa-solid fa-save"></i> Guardar
                </button>
                <button class="btn btn-sm btn-danger btn-clear-score" data-row="${match.row}" style="background-color:transparent; border:1px solid rgba(239,68,68,0.4); color:var(--danger)">
                    Limpiar
                </button>
            </div>
        `;

        // Save action
        card.querySelector('.btn-save-score').addEventListener('click', () => {
            const r = match.row;
            const lScore = document.getElementById(`admin-local-${r}`).value;
            const vScore = document.getElementById(`admin-visit-${r}`).value;
            
            if (lScore === '' || vScore === '') {
                showToast('Ingresa ambos marcadores para guardar el resultado', 'error');
                return;
            }
            submitMatchScore(r, parseInt(lScore), parseInt(vScore));
        });

        // Clear action
        card.querySelector('.btn-clear-score').addEventListener('click', () => {
            if (confirm(`¿Estás seguro de limpiar el marcador de ${match.local} vs ${match.visitante}?`)) {
                submitMatchScore(match.row, null, null);
            }
        });

        listContainer.appendChild(card);
    });
}

// POST Match score to API
async function submitMatchScore(row, golesLocal, golesVisitante) {
    const password = sessionStorage.getItem('quiniela_admin_pass');
    
    try {
        const response = await fetch('/api/update_match', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                password: password,
                row: row,
                goles_local: golesLocal,
                goles_visitante: golesVisitante
            })
        });

        const resData = await response.json();
        if (!response.ok || !resData.success) {
            throw new Error(resData.error || 'Error al guardar marcador');
        }

        showToast('Marcador actualizado correctamente', 'success');
        
        // Reload data to recalculate scores
        await fetchData();

    } catch (error) {
        showToast(error.message, 'error');
    }
}

// Show Toast Notification
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
    toast.innerHTML = `
        <i class="fa-solid ${icon}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);
    
    // Auto-remove toast
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-10px)';
        toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Helper: Generates country flag image element
function getFlagImg(teamName) {
    const cleanName = teamName ? teamName.trim() : '';
    const code = TEAM_FLAGS[cleanName] || 'un';
    return `<img src="https://flagcdn.com/w80/${code}.png" alt="${teamName} Flag" class="flag-img" onerror="this.style.display='none'">`;
}

// Generates the customized SVG profile avatar for each player
function getAvatarSVG(name, isWinning) {
    const theme = PLAYER_CONFIG[name] || { bg: '#4b5563', hair: '#1f2937', skin: '#f3f4f6', hairStyle: 'normal' };
    
    let svg = `<svg viewBox="0 0 100 100" class="player-avatar-svg" xmlns="http://www.w3.org/2000/svg">`;
    
    // Background Circle
    svg += `<circle cx="50" cy="50" r="46" fill="${theme.bg}" opacity="0.8"/>`;
    svg += `<circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>`;
    
    // Face Skin
    svg += `<circle cx="50" cy="53" r="28" fill="${theme.skin}"/>`;
    
    // Hair Styles
    if (theme.hairStyle === 'spiky') {
        svg += `<path d="M 25 35 L 30 18 L 38 27 L 50 14 L 62 27 L 70 18 L 75 35 Z" fill="${theme.hair}"/>`;
    } else if (theme.hairStyle === 'glasses') {
        svg += `<path d="M 22 45 C 22 25, 78 25, 78 45 C 78 45, 74 30, 50 30 C 26 30, 22 45, 22 45 Z" fill="${theme.hair}"/>`;
        // Glasses frames
        svg += `<circle cx="38" cy="50" r="7" fill="none" stroke="#111827" stroke-width="2.5"/>`;
        svg += `<circle cx="62" cy="50" r="7" fill="none" stroke="#111827" stroke-width="2.5"/>`;
        svg += `<line x1="45" y1="50" x2="55" y2="50" stroke="#111827" stroke-width="2.5"/>`;
        svg += `<line x1="22" y1="50" x2="31" y2="50" stroke="#111827" stroke-width="2"/>`;
        svg += `<line x1="69" y1="50" x2="78" y2="50" stroke="#111827" stroke-width="2"/>`;
    } else if (theme.hairStyle === 'beard') {
        svg += `<path d="M 22 45 C 22 25, 78 25, 78 45 Z" fill="${theme.hair}"/>`;
        // Beard
        svg += `<path d="M 24 55 C 24 74, 76 74, 76 55 L 70 55 C 70 66, 30 66, 30 55 Z" fill="${theme.hair}"/>`;
    } else if (theme.hairStyle === 'long') {
        svg += `<path d="M 22 43 C 22 18, 78 18, 78 43 C 78 63, 72 75, 72 75 L 67 75 C 67 55, 33 55, 33 75 L 28 75 C 28 75, 22 63, 22 43 Z" fill="${theme.hair}"/>`;
    } else if (theme.hairStyle === 'cap') {
        svg += `<path d="M 24 45 C 24 35, 76 35, 76 45 Z" fill="${theme.hair}"/>`;
        // Cap
        svg += `<path d="M 22 42 C 22 23, 78 23, 78 42 Z" fill="#ef4444"/>`;
        svg += `<path d="M 15 42 L 85 42 C 85 42, 80 37, 50 37 C 20 37, 15 42, 15 42 Z" fill="#dc2626"/>`;
    } else if (theme.hairStyle === 'curly') {
        svg += `<circle cx="30" cy="35" r="10" fill="${theme.hair}"/>`;
        svg += `<circle cx="42" cy="27" r="10" fill="${theme.hair}"/>`;
        svg += `<circle cx="58" cy="27" r="10" fill="${theme.hair}"/>`;
        svg += `<circle cx="70" cy="35" r="10" fill="${theme.hair}"/>`;
        svg += `<circle cx="34" cy="46" r="9" fill="${theme.hair}"/>`;
        svg += `<circle cx="66" cy="46" r="9" fill="${theme.hair}"/>`;
        svg += `<path d="M 25 45 C 25 30, 75 30, 75 45 Z" fill="${theme.hair}"/>`;
    }
    
    // Expressions
    if (isWinning) {
        if (theme.hairStyle !== 'glasses') {
            svg += `<path d="M 33 49 Q 38 43 43 49" stroke="#111827" stroke-width="3" fill="none" stroke-linecap="round"/>`;
            svg += `<path d="M 57 49 Q 62 43 67 49" stroke="#111827" stroke-width="3" fill="none" stroke-linecap="round"/>`;
        } else {
            svg += `<path d="M 34 50 Q 38 46 42 50" stroke="#111827" stroke-width="2" fill="none" stroke-linecap="round"/>`;
            svg += `<path d="M 58 50 Q 62 46 66 50" stroke="#111827" stroke-width="2" fill="none" stroke-linecap="round"/>`;
        }
        // Rosy cheeks
        svg += `<circle cx="28" cy="56" r="4" fill="#f43f5e" opacity="0.3"/>`;
        svg += `<circle cx="72" cy="56" r="4" fill="#f43f5e" opacity="0.3"/>`;
        // Smile
        svg += `<path d="M 38 58 Q 50 72 62 58 Z" fill="#111827"/>`;
        svg += `<path d="M 41 59 Q 50 63 59 59 Z" fill="#ffffff"/>`;
    } else {
        if (theme.hairStyle !== 'glasses') {
            svg += `<circle cx="37" cy="48" r="3" fill="#111827"/>`;
            svg += `<circle cx="63" cy="48" r="3" fill="#111827"/>`;
            svg += `<path d="M 31 43 L 41 45" stroke="#111827" stroke-width="2" stroke-linecap="round"/>`;
            svg += `<path d="M 69 43 L 59 45" stroke="#111827" stroke-width="2" stroke-linecap="round"/>`;
        } else {
            svg += `<circle cx="38" cy="50" r="2.2" fill="#111827"/>`;
            svg += `<circle cx="62" cy="50" r="2.2" fill="#111827"/>`;
            svg += `<path d="M 33 44 L 41 46" stroke="#111827" stroke-width="1.5"/>`;
            svg += `<path d="M 67 44 L 59 46" stroke="#111827" stroke-width="1.5"/>`;
        }
        // Frown
        svg += `<path d="M 42 63 Q 50 56 58 63" stroke="#111827" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
        // Teardrop
        svg += `<path d="M 63 54 C 63 56.2 61.8 57 61 57 C 60.2 57 59 56.2 59 54 C 59 52 61 50 61 50 C 61 50 63 52 63 54 Z" fill="#60a5fa"/>`;
    }
    
    svg += `</svg>`;
    
    if (isWinning) {
        return `
            <div class="avatar-wrapper">
                <svg class="avatar-crown" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 17L5 7L10 12L12 5L14 12L19 7L22 17H2Z" fill="url(#crownGold)" stroke="#d97706" stroke-width="1"/>
                    <rect x="2" y="17" width="20" height="2" rx="0.5" fill="#d97706"/>
                    <circle cx="2" cy="17" r="1" fill="#fff"/>
                    <circle cx="22" cy="17" r="1" fill="#fff"/>
                    <circle cx="12" cy="4" r="1.5" fill="#fff"/>
                    <circle cx="5" cy="6" r="1" fill="#fff"/>
                    <circle cx="19" cy="6" r="1" fill="#fff"/>
                    <defs>
                        <linearGradient id="crownGold" x1="12" y1="4" x2="12" y2="19" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#fbbf24"/>
                            <stop offset="1" stop-color="#d97706"/>
                        </linearGradient>
                    </defs>
                </svg>
                ${svg}
            </div>`;
    } else {
        return `<div class="avatar-wrapper">${svg}</div>`;
    }
}

// Helper: Generates a very small SVG avatar (used in predictions list)
function getMiniAvatarSVG(name, isWinning) {
    const theme = PLAYER_CONFIG[name] || { bg: '#4b5563', hair: '#1f2937', skin: '#f3f4f6', hairStyle: 'normal' };
    
    let svg = `<svg viewBox="0 0 100 100" class="player-avatar-svg" xmlns="http://www.w3.org/2000/svg">`;
    svg += `<circle cx="50" cy="50" r="48" fill="${theme.bg}"/>`;
    svg += `<circle cx="50" cy="55" r="28" fill="${theme.skin}"/>`;
    
    // Draw hair simplified
    svg += `<path d="M 22 48 C 22 25, 78 25, 78 48 Z" fill="${theme.hair}"/>`;
    
    // Draw simple smile or frown
    if (isWinning) {
        svg += `<circle cx="36" cy="48" r="4" fill="#111827"/>`;
        svg += `<circle cx="64" cy="48" r="4" fill="#111827"/>`;
        svg += `<path d="M 40 60 Q 50 70 60 60" stroke="#111827" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    } else {
        svg += `<circle cx="36" cy="48" r="3.5" fill="#111827"/>`;
        svg += `<circle cx="64" cy="48" r="3.5" fill="#111827"/>`;
        svg += `<path d="M 42 64 Q 50 58 58 64" stroke="#111827" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    }
    svg += `</svg>`;
    return svg;
}
