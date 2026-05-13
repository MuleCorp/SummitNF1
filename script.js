const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSh1R3viWQTZFYJa0pbYUVdT0eZfPcdXexgFXBWsEHOC-GtJSf3U6k5bF-n1WBkx7afG14cswrGsWb-/pub?output=csv';

async function updateLeaderboard() {
    try {
        // Agregamos un número aleatorio único para romper el cache del navegador y de Google
        const cacheBuster = `&nocache=${Math.random()}`;
        
        const response = await fetch(CSV_URL + cacheBuster, {
            method: 'GET',
            cache: 'no-store', // <--- ESTO ES CLAVE
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });

        if (!response.ok) throw new Error('Error de conexión');
        
        const data = await response.text();
        
        // Procesar Filas
        const rows = data.split('\n').filter(row => row.trim() !== '');
        const teams = rows.slice(1).map(row => {
            const columns = row.split(',');
            return {
                name: columns[0]?.trim() || "Escudería",
                score: parseInt(columns[1]) || 0,
                svgId: columns[2]?.trim() || "E01"
            };
        });

        // Ordenar
        teams.sort((a, b) => b.score - a.score);

        // Renderizar
        render(teams);

        // Actualizar sello de tiempo para confirmación visual
        const now = new Date();
        const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0') + ':' + now.getSeconds().toString().padStart(2, '0');
        
        // Creamos o actualizamos un pequeño indicador de status
        let status = document.getElementById('sync-status');
        if (!status) {
            status = document.createElement('div');
            status.id = 'sync-status';
            status.className = 'text-[10px] text-zinc-700 text-center mt-10 font-mono uppercase tracking-[0.3em]';
            document.body.appendChild(status);
        }
        status.innerText = `Telemetría Sincronizada: ${timeStr}`;

    } catch (error) {
        console.error("Fallo en Pits:", error);
    }
}

function render(teams) {
    const container = document.getElementById('leaderboard');
    container.innerHTML = teams.map((team, index) => {
        const isTop3 = index < 3;
        const podiumClass = isTop3 ? `top-${index + 1}` : '';
        const rankColor = index === 0 ? 'text-[#be579b]' : index === 1 ? 'text-zinc-300' : index === 2 ? 'text-[#92400e]' : 'text-zinc-600';

        return `
            <div class="card-escuderia ${podiumClass} flex items-center justify-between p-5 rounded-r-2xl animate-row">
                <div class="flex items-center gap-6">
                    <span class="font-black italic text-3xl w-12 ${rankColor}">${index + 1}</span>
                    <div class="relative w-20 h-20">
                        <img src="assets/${team.svgId}.svg" class="escuderia-svg w-full h-full object-contain" onerror="this.src='https://api.dicebear.com/7.x/bottts/svg?seed=${index}'">
                    </div>
                    <h2 class="font-black text-2xl md:text-3xl uppercase tracking-tighter italic">${team.name}</h2>
                </div>
                <div class="text-right">
                    <div class="text-4xl font-black leading-none" style="color: ${index === 0 ? 'var(--f1-pink)' : 'white'}">${team.score}</div>
                    <div class="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">Puntos</div>
                </div>
            </div>
        `;
    }).join('');
}

// Ejecución inicial y bucle
updateLeaderboard();
setInterval(updateLeaderboard, 15000); // Bajamos a 15 segundos para más rapidez