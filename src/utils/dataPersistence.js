export async function persistSongs(songs) {
    const env = import.meta.env;
    if (!env?.DEV) {
        return;
    }
    try {
        await fetch('/__bingo-data/save-songs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ songs }),
        });
    }
    catch {
        // Ignore persistence errors in the browser
    }
}
export async function persistCards(cards) {
    const env = import.meta.env;
    if (!env?.DEV) {
        return;
    }
    try {
        await fetch('/__bingo-data/save-cards', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cards }),
        });
    }
    catch {
        // Ignore persistence errors in the browser
    }
}
