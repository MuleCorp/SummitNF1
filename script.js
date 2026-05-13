const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwwraDukAcjF87JOC550ef9BPkvodXFl3Nufj_SyzY7accOW78XB-fuo8ResMAHpnTF/exec';

async function updateData() {
    try {
        const response = await fetch(`${WEB_APP_URL}?t=${new Date().getTime()}`);
        const teamsRaw = await response.json();
        
        // Mapeo automático de columnas: A=Nombre, B=Puntos, C=SVG
        const teams = teamsRaw.map(t => {
            const keys = Object.keys(t);
            return {
                name: t[keys[0]], 
                score: parseInt(t[keys[1]]) || 0,
                svgId: t[keys[2]]?.toString().trim() || "E01"
            };
        }).sort((a, b) => b.score - a.score);

        renderLeaderboard(teams);
        renderPodium(teams);
    } catch (e) {
        console.error("Error de telemetría:", e);
    }
}

function renderLeaderboard(teams) {
    const container = document.getElementById('leaderboard');
    if (!container) return;
    container.innerHTML = teams.map((t, i) => `
        <div class="card-escuderia ${i === 0 ? 'top-1' : ''} flex items-center justify-between p-5 rounded-r-xl animate-row" style="animation-delay: ${i*0.05}s">
            <div class="flex items-center gap-4">
                <span class="text-2xl font-black italic ${i === 0 ? 'text-[#be579b]' : 'text-zinc-600'} w-10">${i+1}</span>
                <img src="assets/${t.svgId}.svg" class="w-16 h-16 object-contain" onerror="this.src='assets/E01.svg'">
                <h2 class="text-2xl font-black uppercase italic tracking-tighter">${t.name}</h2>
            </div>
            <div class="text-right">
                <div class="text-3xl font-black ${i === 0 ? 'text-[#be579b]' : 'text-white'}">${t.score}</div>
                <div class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Puntos</div>
            </div>
        </div>
    `).join('');
}

function renderPodium(teams) {
    const container = document.getElementById('podium-container');
    if (!container) return;

    const p1 = teams[0] || { name: '' };
    const p2 = teams[1] || { name: '' };
    const p3 = teams[2] || { name: '' };

    // Estructura: PLATA (Izq) - ORO (Centro) - BRONCE (Der)
    // Los mb- (margin bottom) ajustan la altura del nombre sobre la estatuilla
    container.innerHTML = `
        <div class="podium-label mb-32 text-xl md:text-3xl">${p2.name}</div>
        <div class="podium-label mb-56 text-3xl md:text-5xl text-[#be579b]">${p1.name}</div>
        <div class="podium-label mb-24 text-lg md:text-2xl">${p3.name}</div>
    `;
}

updateData();
setInterval(updateData, 10000); // Actualiza cada 10 segundos
