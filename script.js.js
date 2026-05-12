const SHEET_URL = 'TU_URL_DE_CSV_AQUI';

async function fetchLeaderboard() {
    try {
        const response = await fetch(SHEET_URL);
        const data = await response.text();
        const rows = data.split('\n').slice(1); 

        const teams = rows.map(row => {
            const cols = row.split(',');
            return {
                name: cols[0],   // Columna A: Nombre
                score: parseInt(cols[1]) || 0, // Columna B: Score
                svgId: cols[2]?.trim() // Columna C: E01, E02...
            };
        }).sort((a, b) => b.score - a.score);

        render(teams);
    } catch (e) {
        console.error("Error cargando boxes:", e);
    }
}

function render(teams) {
    const container = document.getElementById('leaderboard');
    container.innerHTML = teams.map((team, index) => {
        const isPodium = index < 3;
        const podiumClass = isPodium ? `podium-${index}` : '';
        
        return `
            <div class="escuderia-card ${podiumClass} flex items-center justify-between p-4 rounded-r-lg">
                <div class="flex items-center gap-4">
                    <span class="font-orbitron italic font-black text-2xl w-8 ${index === 0 ? 'text-[#be579b]' : 'text-zinc-600'}">
                        ${index + 1}
                    </span>
                    <img src="assets/${team.svgId}.svg" class="escuderia-svg w-14 h-14" onerror="this.src='https://via.placeholder.com/50?text=F1'">
                    <h2 class="font-orbitron font-bold text-lg tracking-tight uppercase">${team.name}</h2>
                </div>
                <div class="text-right">
                    <span class="block text-2xl font-black font-orbitron text-[#0e4596]">${team.score}</span>
                    <span class="block text-[10px] font-bold text-[#be579b] tracking-widest mt-[-5px]">PUNTOS</span>
                </div>
            </div>
        `;
    }).join('');
}

fetchLeaderboard();
setInterval(fetchLeaderboard, 60000); // Refresca cada minuto