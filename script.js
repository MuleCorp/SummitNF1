const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSh1R3viWQTZFYJa0pbYUVdT0eZfPcdXexgFXBWsEHOC-GtJSf3U6k5bF-n1WBkx7afG14cswrGsWb-/pub?output=csv';

async function updateLeaderboard() {
    try {
        // El 'nocache' obliga a Google y al navegador a darnos el dato real
        const response = await fetch(`${CSV_URL}&nocache=${Math.random()}`, {
            cache: 'no-store'
        });
        
        const data = await response.text();
        const rows = data.split('\n').filter(row => row.trim() !== '');
        
        const teams = rows.slice(1).map(row => {
            const columns = row.split(',');
            return {
                name: columns[0]?.trim(),
                score: parseInt(columns[1]) || 0,
                svgId: columns[2]?.trim() || "E01"
            };
        });

        teams.sort((a, b) => b.score - a.score);
        render(teams);

    } catch (error) {
        console.error("Error de conexión:", error);
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

// Iniciar y repetir cada 20 segundos
updateLeaderboard();
setInterval(updateLeaderboard, 20000);

// ... (mismo CSV_URL y updateLeaderboard que antes) ...

function render(teams) {
    // 1. Renderizar el Leaderboard Normal (Tu código anterior)
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

    // 2. NUEVA LÓGICA: Renderizar el Podio Visual (Plata - Oro - Bronce)
    const podiumContainer = document.getElementById('podium-display');
    const top1 = teams[0] || { name: '-', svgId: 'E01' };
    const top2 = teams[1] || { name: '-', svgId: 'E01' };
    const top3 = teams[2] || { name: '-', svgId: 'E01' };

    podiumContainer.innerHTML = `
        <div class="podium-step step-silver">
            <img src="assets/${top2.svgId}.svg" class="w-16 mb-2">
            <div class="podium-name">${top2.name}</div>
            <div class="text-xl font-black italic">2</div>
        </div>

        <div class="podium-step step-gold">
            <img src="assets/${top1.svgId}.svg" class="w-24 mb-2">
            <div class="podium-name text-white">${top1.name}</div>
            <div class="text-3xl font-black italic">1</div>
        </div>

        <div class="podium-step step-bronze">
            <img src="assets/${top3.svgId}.svg" class="w-14 mb-2">
            <div class="podium-name">${top3.name}</div>
            <div class="text-lg font-black italic">3</div>
        </div>
    `;
}

// ... (mismo setInterval que antes) ...
