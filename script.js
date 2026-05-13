const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwwraDukAcjF87JOC550ef9BPkvodXFl3Nufj_SyzY7accOW78XB-fuo8ResMAHpnTF/exec';

async function updateData() {
    try {
        // Al usar Apps Script, no hay cache. El dato es 100% real.
        const response = await fetch(WEB_APP_URL);
        const teamsRaw = await response.json();
        
        // MAPEADO DINÁMICO: 
        // Buscamos las columnas sin importar si se llaman "Nombre" o "Escudería"
        const teams = teamsRaw.map(t => {
            // Buscamos los valores por su posición o por nombre aproximado
            const keys = Object.keys(t);
            return {
                name: t[keys[0]],  // Columna A (Nombre)
                score: parseInt(t[keys[1]]) || 0, // Columna B (Puntos)
                svgId: t[keys[2]]?.toString().trim() || "E01" // Columna C (ID del SVG)
            };
        }).sort((a, b) => b.score - a.score);

        renderLeaderboard(teams);
        renderPodium(teams);
    } catch (e) {
        console.error("Error en la conexión de telemetría:", e);
    }
}

function renderLeaderboard(teams) {
    const container = document.getElementById('leaderboard');
    if (!container) return;

    container.innerHTML = teams.map((t, i) => `
        <div class="card-escuderia ${i === 0 ? 'top-1' : ''} flex items-center justify-between p-4 rounded-r-xl animate-row">
            <div class="flex items-center gap-4">
                <span class="text-2xl font-black italic ${i === 0 ? 'text-[#be579b]' : 'text-zinc-600'} w-8">${i+1}</span>
                <img src="assets/${t.svgId}.svg" class="w-16 h-16 object-contain escuderia-svg" onerror="this.src='assets/E01.svg'">
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
    if (!container) return;

    // Obtenemos los 3 primeros (o valores vacíos si no hay suficientes)
    const p1 = teams[0] || { name: '' };
    const p2 = teams[1] || { name: '' };
    const p3 = teams[2] || { name: '' };

    // Estructura para la foto podio_estatuillas.jpg: PLATA - ORO - BRONCE
    container.innerHTML = `
        <div class="podium-label mb-48 text-xl">${p2.name}</div>
        <div class="podium-label mb-64 text-3xl text-[#be579b]">${p1.name}</div>
        <div class="podium-label mb-40 text-lg">${p3.name}</div>
    `;
}

// Iniciar proceso
updateData();

// Actualización cada 10 segundos (Suficiente para que se sienta instantáneo)
setInterval(updateData, 10000);
