// Todos los participantes, puntos de encuentro y límites de esta demo son ficticios.
export function demoData() {
    const today = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Santiago', year: 'numeric', month: '2-digit', day: '2-digit'
    }).format(new Date());
    return Array.from({ length: 10 }, (_, i) => {
        const date = new Date(today + 'T12:00:00Z');
        date.setUTCDate(date.getUTCDate() + Math.floor(i / 2));
        return {
            id: `demo-${i + 1}`,
            territory: `Territorio ${['1A', '2A', '3A'][i % 3]}`,
            sector: `Sector de ejemplo ${i % 3 + 1}`,
            captain: `Responsable de ejemplo ${i % 3 + 1}`,
            group: i % 2 === 0 ? 'Grupos 1-2' : 'Todos los grupos',
            meeting: `Punto de encuentro ficticio ${i % 3 + 1}`,
            date: date.toISOString().slice(0, 10),
            time: i % 2 === 0 ? '10:00' : '17:00',
            lat: null,
            lng: null,
            map: '',
            notes: 'Registro de demostración; no corresponde a una actividad real.',
            directions: ''
        };
    });
}
