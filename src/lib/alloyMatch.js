// Reverse composition lookup — score steels against a user-entered target alloy.
// Distance is a weighted quadratic RMS over normalized per-element deltas,
// so a 0.4% Cr miss hurts far less than a 4% miss, and C/Cr (the structural
// backbone of a blade) dominate the score.

export const ELEMENT_SPECS = [
    { el: 'C', name: 'Carbon', max: 3.5, step: 0.05, weight: 1.0 },
    { el: 'Cr', name: 'Chromium', max: 30, step: 0.5, weight: 0.9 },
    { el: 'V', name: 'Vanadium', max: 15, step: 0.5, weight: 0.9 },
    { el: 'Mo', name: 'Molybdenum', max: 10, step: 0.1, weight: 0.8 },
    { el: 'W', name: 'Tungsten', max: 18, step: 0.5, weight: 0.7 },
    { el: 'Co', name: 'Cobalt', max: 50, step: 0.5, weight: 0.6 },
    { el: 'N', name: 'Nitrogen', max: 2, step: 0.05, weight: 0.5 },
    { el: 'Nb', name: 'Niobium', max: 3, step: 0.05, weight: 0.5 },
];

export const EMPTY_MATCH_TARGET = { C: 0, Cr: 0, V: 0, Mo: 0, W: 0, Co: 0, N: 0, Nb: 0 };

export function hasActiveTarget(target) {
    if (!target) return false;
    return ELEMENT_SPECS.some(spec => (target[spec.el] || 0) > 0);
}

export function activeTargetElements(target) {
    if (!target) return [];
    return ELEMENT_SPECS.filter(spec => (target[spec.el] || 0) > 0);
}

// Returns { score (0-100), deltas: [{ el, actual, target, delta }], activeEls }
// or null when no target elements are set.
export function scoreAlloyMatch(steel, target) {
    const active = activeTargetElements(target);
    if (active.length === 0) return null;

    const weightSum = active.reduce((sum, spec) => sum + spec.weight, 0);
    let dist = 0;
    const deltas = [];

    for (const spec of active) {
        const actual = steel[spec.el] || 0;
        const delta = +(actual - target[spec.el]).toFixed(2);
        const normalized = Math.abs(delta) / spec.max;
        dist += spec.weight * normalized * normalized;
        deltas.push({ el: spec.el, actual, target: target[spec.el], delta });
    }

    const score = Math.max(0, Math.round((1 - Math.sqrt(dist / weightSum)) * 100));
    return { score, deltas, activeEls: active.map(spec => spec.el) };
}

// Attaches _match to every steel and sorts best-match-first.
export function rankByMatch(steels, target) {
    return steels
        .map(steel => ({ ...steel, _match: scoreAlloyMatch(steel, target) }))
        .sort((a, b) => (b._match?.score ?? -1) - (a._match?.score ?? -1));
}

// Parse shorthand composition strings like "C 1.45, Cr 10.5 V:4 Co=1.5".
// Unknown tokens are ignored; returns a full target object.
export function parseCompositionString(input) {
    const target = { ...EMPTY_MATCH_TARGET };
    if (!input) return { target, matched: [] };
    const re = /\b(Nb|Mo|Cr|Co|C|V|W|N)\s*[:=\-]?\s*(\d+(?:\.\d+)?)/gi;
    const matched = [];
    let m;
    while ((m = re.exec(input)) !== null) {
        const el = m[1].charAt(0).toUpperCase() + m[1].slice(1).toLowerCase();
        if (!(el in target)) continue;
        const value = Math.min(parseFloat(m[2]), ELEMENT_SPECS.find(s => s.el === el).max);
        target[el] = value;
        matched.push(el);
    }
    return { target, matched };
}

export function formatTargetSummary(target) {
    return activeTargetElements(target)
        .map(spec => {
            const step = spec.step < 0.1 ? 2 : spec.step < 1 ? 2 : 0;
            return `${spec.el}${(target[spec.el]).toFixed(step)}`;
        })
        .join(' · ');
}
