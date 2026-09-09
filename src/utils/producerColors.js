// Single source of truth for producer accent colors across all views.
// Matching uses substring inclusion, so "Latrobe" also matches "Latrobe / Timken".
export const PRODUCER_COLORS = {
    Crucible: '#FF5733',
    'B\u00F6hler': '#33FF57',
    Uddeholm: '#3357FF',
    Carpenter: '#F333FF',
    Hitachi: '#FF33A1',
    Takefu: '#33FFF5',
    Alleima: '#FFF533',
    Erasteel: '#FF8633',
    Zapp: '#A133FF',
    Latrobe: '#E91E63',
    Niagara: '#00BCD4',
    Lohmann: '#8BC34A',
    Damasteel: '#795548',
    Daido: '#FFC107',
    Aichi: '#4DB6AC',
    Myodo: '#00E5FF',
    Victorinox: '#EF5350',
    Yoshikin: '#FFB74D',
    Maserin: '#9575CD',
    Busse: '#E57373',
    'Swamp Rat': '#FF8A65',
    'Terrain 365': '#26C6DA',
    'Summit Materials': '#81C784',
    'Artisan Cutlery': '#BA68C8',
    'Aubert & Duval': '#64B5F6',
    'Larrin Thomas': '#F06292',
    Various: '#94a3b8',
    Other: '#ffffff',
};

export const PRODUCER_COLOR_KEYS = Object.keys(PRODUCER_COLORS);

export function getProducerColor(producer) {
    if (!producer) return PRODUCER_COLORS.Other;
    const found = PRODUCER_COLOR_KEYS.find((k) => producer.includes(k));
    if (found) return PRODUCER_COLORS[found];

    // Dynamic color generation for any other producer to ensure uniqueness
    let hash = 0;
    for (let i = 0; i < producer.length; i++) {
        hash = producer.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 65%, 60%)`;
}

export function getProducerKey(producer) {
    if (!producer) return 'Other';
    return PRODUCER_COLOR_KEYS.find((k) => producer.includes(k)) || 'Other';
}
