const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSh1R3viWQTZFYJa0pbYUVdT0eZfPcdXexgFXBWsEHOC-GtJSf3U6k5bF-n1WBkx7afG14cswrGsWb-/pub?output=csv';

async function updateData() {
    try {
        const response = await fetch(`${CSV_URL}&nocache=${Math.random()}`, { cache: 'no-store' });
        const data = await response.text();
        const rows = data.split('\n').filter(r => r.trim() !== '').slice(1);
        
        const teams = rows.map(row => {
            const cols = row.split(',');
            return { name: cols[0], score: parseInt(cols[1]) || 0, svgId: cols[2]?.trim() };
        }).sort((a, b) => b.score - a.score);

        renderLeaderboard(teams);
        renderPodium(teams);
    } catch (e) { console.error("Error:", e); }
}

function renderLeaderboard(teams) {
    const container = document.getElementById('leaderboard');
    container.innerHTML = teams.map((t, i) => `
        <div class="card-escuderia ${i === 0 ? 'top-1' : ''} flex items-center justify-between p-4 rounded-r-xl animate-row">
            <div class="flex items-center gap-4">
                <span class="text-2xl font-black italic ${i === 0 ? 'text-[#be579b]' : 'text-zinc-600'} w-8">${i+1}</span>
                <img src="assets/${t.svgId}.svg" class="w-16 h-16 object-contain" onerror="this.src='assets/E01.svg'">
                <h2 class="text-2xl font-black uppercase italic tracking-tighter">${t.name}</h2>
            </div>
            <div class="text-right">
                <div class="text-3xl font-black ${i === 0 ? 'text-[#be579b]' : 'text-white'}">${t.score}</div>
                <div class="text-[10px] text-zinc-500 font-bold uppercase">Puntos</div>
            </div>
        </div>
    `).join('');
}

function renderPodium(teams) {
    const container = document.getElementById('podium-container');
    const p1 = teams[0] || { name: '' };
    const p2 = teams[1] || { name: '' };
    const p3 = teams[2] || { name: '' };

    // Estructura: Plata - Oro - Bronce para coincidir con la foto
    container.innerHTML = `
        <div class="podium-label mb-48 text-xl">${p2.name}</div> <div class="podium-label mb-64 text-3xl text-[#be579b]">${p1.name}</div> <div class="podium-label mb-40 text-lg">${p3.name}</div> `;
}

updateData();
setInterval(updateData, 20000);
