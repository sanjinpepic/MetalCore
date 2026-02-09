// Weight tables per use case (base distribution across 4 metrics)
const useCaseWeights = {
    edc:       { edge: 0.35, toughness: 0.20, corrosion: 0.30, sharpen: 0.15 },
    kitchen:   { edge: 0.40, toughness: 0.10, corrosion: 0.35, sharpen: 0.15 },
    outdoor:   { edge: 0.25, toughness: 0.30, corrosion: 0.30, sharpen: 0.15 },
    'hard-use':{ edge: 0.20, toughness: 0.50, corrosion: 0.15, sharpen: 0.15 },
};

const priorityMultipliers = {
    edge:      { edge: 1.5,  toughness: 0.8, corrosion: 1.0, sharpen: 0.9 },
    toughness: { edge: 0.8,  toughness: 1.5, corrosion: 1.0, sharpen: 1.0 },
    balanced:  { edge: 1.0,  toughness: 1.0, corrosion: 1.0, sharpen: 1.0 },
};

const maintenanceMultipliers = {
    low:         { edge: 1.0, toughness: 1.0, corrosion: 1.4, sharpen: 1.1 },
    'dont-mind': { edge: 1.0, toughness: 1.0, corrosion: 0.9, sharpen: 0.9 },
};

const sharpenMultipliers = {
    easy:          { edge: 0.85, toughness: 1.0, corrosion: 1.0, sharpen: 1.5 },
    'maximum-edge':{ edge: 1.3,  toughness: 1.0, corrosion: 1.0, sharpen: 0.7 },
};

const METRICS = ['edge', 'toughness', 'corrosion', 'sharpen'];

export const metricLabels = {
    edge: 'Edge Retention',
    toughness: 'Toughness',
    corrosion: 'Corrosion Resistance',
    sharpen: 'Ease of Sharpening',
};

export function calculateRecommendations(steels, answers) {
    // 1. Base weights from use case
    const weights = { ...(useCaseWeights[answers.useCase] || useCaseWeights.edc) };

    // 2. Apply priority multiplier
    const pMult = priorityMultipliers[answers.priority] || priorityMultipliers.balanced;
    for (const m of METRICS) weights[m] *= pMult[m];

    // 3. Apply maintenance multiplier
    const mMult = maintenanceMultipliers[answers.maintenance] || maintenanceMultipliers.low;
    for (const m of METRICS) weights[m] *= mMult[m];

    // 4. Apply sharpenability multiplier
    const sMult = sharpenMultipliers[answers.sharpenability] || sharpenMultipliers.easy;
    for (const m of METRICS) weights[m] *= sMult[m];

    // 5. Normalize so weights sum to 1.0
    const total = METRICS.reduce((sum, m) => sum + weights[m], 0);
    for (const m of METRICS) weights[m] /= total;

    // 6. Score each steel
    const scored = steels.map(steel => {
        const rawScore = METRICS.reduce((sum, m) => sum + weights[m] * steel[m], 0);
        const matchScore = Math.round((rawScore / 10) * 100);

        // Find top 2 contributing metrics
        const contributions = METRICS
            .map(m => ({ metric: m, value: steel[m], weight: weights[m], contribution: weights[m] * steel[m] }))
            .sort((a, b) => b.contribution - a.contribution)
            .slice(0, 2)
            .filter(c => c.value >= 5);

        return { ...steel, matchScore, topMetrics: contributions };
    });

    // 7. Sort descending, return top 5
    return scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, 5);
}
