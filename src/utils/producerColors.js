// Ink-on-ink: a single accent carries the whole system.
// Chart dots encode manufacturing route, not producer taxonomy —
// powder-route (PM) steels burn ember, conventional steels stay bone.
// Producer identity lives in mono text labels, tooltips and filters.
export const DOT_PM = '#FF5A1F';
export const DOT_REST = 'rgba(237,233,226,0.5)';

export function getSteelDot(steel) {
    return steel && steel.pm ? DOT_PM : DOT_REST;
}
