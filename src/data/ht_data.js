// Heat treatment protocol data for major knife steels.
// Separate from steels.js so it can be updated independently without re-seeding.
// Fields:
//   normalize:    [temp_C, time] | null   — for forged/annealed stock; null = not required
//   austenitize:  temp_C                  — hardening temperature
//   soak:         string                  — time at temperature
//   quench:       string                  — quench medium / method
//   cryo:         boolean                 — is cryogenic treatment recommended?
//   cryo_temp:    temp_C | null           — e.g. -76 (dry ice) or -196 (liquid nitrogen)
//   temper:       [[minC, maxC], ...]     — one array per temper cycle
//   hardness:     [min, max]              — expected HRC after protocol
//   notes:        string | null

export const HT_DATA = {

    // ─── CRUCIBLE / CPM ──────────────────────────────────────────────────────

    'crucible-1': {
        normalize: null,
        austenitize: 1120,
        soak: '10–15 min',
        quench: 'Plate quench (preferred) or fast oil',
        cryo: true,
        cryo_temp: -73,
        temper: [[150, 175], [150, 175]],
        hardness: [62, 64],
        notes: 'Cryo after quench, before first temper. Significantly improves wear resistance and dimensional stability. One of the most cryo-responsive modern PM steels.'
    },

    'crucible-3': {
        normalize: null,
        austenitize: 1052,
        soak: '20–30 min',
        quench: 'Plate quench or fast oil',
        cryo: false,
        cryo_temp: null,
        temper: [[177, 205], [177, 205]],
        hardness: [59, 61],
        notes: null
    },

    'crucible-5': {
        normalize: null,
        austenitize: 1065,
        soak: '20–30 min',
        quench: 'Plate quench',
        cryo: true,
        cryo_temp: -73,
        temper: [[150, 190], [150, 190]],
        hardness: [60, 62],
        notes: 'Same composition as M390 and CTS-204P — protocols are interchangeable.'
    },

    'crucible-6': {
        normalize: null,
        austenitize: 1024,
        soak: '30–45 min',
        quench: 'Air cool or plate quench',
        cryo: true,
        cryo_temp: -73,
        temper: [[190, 230], [190, 230]],
        hardness: [58, 62],
        notes: 'Lower temper temperature (190°C) maximizes toughness for choppers. Higher (230°C) sacrifices some toughness for edge retention. One of the toughest PM steels available.'
    },

    'crucible-7': {
        normalize: null,
        austenitize: 1024,
        soak: '30–45 min',
        quench: 'Air cool or plate quench',
        cryo: true,
        cryo_temp: -73,
        temper: [[190, 220], [190, 220]],
        hardness: [59, 63],
        notes: null
    },

    'crucible-8': {
        normalize: null,
        austenitize: 1038,
        soak: '30–45 min',
        quench: 'Air cool or plate quench',
        cryo: true,
        cryo_temp: -73,
        temper: [[190, 220], [190, 220]],
        hardness: [59, 63],
        notes: null
    },

    'crucible-9': {
        normalize: null,
        austenitize: 1191,
        soak: '5–10 min',
        quench: 'Air, plate quench, or fast oil',
        cryo: true,
        cryo_temp: -73,
        temper: [[175, 205], [175, 205]],
        hardness: [62, 65],
        notes: 'Use the low-temperature temper protocol for knives — avoid secondary hardening (550°C) which increases brittleness. Preheat to 650°C and 870°C before austenitizing.'
    },

    'crucible-10': {
        normalize: null,
        austenitize: 1210,
        soak: '3–5 min',
        quench: 'Air cool or plate quench',
        cryo: false,
        cryo_temp: null,
        temper: [[175, 205], [175, 205]],
        hardness: [64, 66],
        notes: 'Knife-maker protocol uses low-temperature temper. Secondary hardening (3× at 550°C) reaches 65–67 HRC with superior hot hardness but is more brittle. Preheat in stages: 430°C → 750°C → austenitize.'
    },

    'crucible-14': {
        normalize: null,
        austenitize: 1079,
        soak: '15–20 min',
        quench: 'Plate quench or fast oil',
        cryo: false,
        cryo_temp: null,
        temper: [[177, 205], [177, 205]],
        hardness: [59, 61],
        notes: null
    },

    'crucible-15': {
        normalize: null,
        austenitize: 1079,
        soak: '15–20 min',
        quench: 'Plate quench or fast oil',
        cryo: false,
        cryo_temp: null,
        temper: [[177, 205], [177, 205]],
        hardness: [59, 61],
        notes: null
    },

    'crucible-16': {
        normalize: null,
        austenitize: 1093,
        soak: '10–20 min',
        quench: 'Plate quench',
        cryo: true,
        cryo_temp: -73,
        temper: [[163, 191], [163, 191]],
        hardness: [61, 63],
        notes: 'Noticeable improvement from cryo compared to earlier S-series steels.'
    },

    'crucible-18': {
        normalize: null,
        austenitize: 1065,
        soak: '20–30 min',
        quench: 'Plate quench',
        cryo: true,
        cryo_temp: -73,
        temper: [[175, 190], [175, 190]],
        hardness: [59, 61],
        notes: 'Very high vanadium carbide volume makes this highly wear-resistant even at lower hardness numbers. Cryo reduces retained austenite meaningfully.'
    },

    'crucible-20': {
        normalize: null,
        austenitize: 997,
        soak: '30–45 min',
        quench: 'Air cool or plate quench',
        cryo: true,
        cryo_temp: -73,
        temper: [[190, 220], [190, 220]],
        hardness: [57, 61],
        notes: 'Softer than CPM 3V at equivalent temper temperature, but significantly tougher. Optimized for maximum impact resistance.'
    },

    // ─── BÖHLER ──────────────────────────────────────────────────────────────

    'bohler-1': {
        normalize: null,
        austenitize: 1065,
        soak: '20–30 min',
        quench: 'Gas quench (vacuum furnace) or plate quench',
        cryo: true,
        cryo_temp: -80,
        temper: [[150, 200], [150, 200]],
        hardness: [60, 62],
        notes: 'Böhler recommends vacuum furnace for cleanest results. Plate quench works well for most bladesmiths. Identical to CPM 20CV and Carpenter CTS-204P.'
    },

    'bohler-2': {
        normalize: null,
        austenitize: 1070,
        soak: '20–30 min',
        quench: 'Gas quench or plate quench',
        cryo: true,
        cryo_temp: -80,
        temper: [[150, 200], [150, 200]],
        hardness: [62, 64],
        notes: 'Highest-performing cold-work tool steel for knife applications. Vacuum or protective atmosphere strongly recommended to prevent decarburization.'
    },

    'bohler-3': {
        normalize: null,
        austenitize: 1065,
        soak: '15–20 min',
        quench: 'Oil or gas quench',
        cryo: false,
        cryo_temp: null,
        temper: [[150, 200], [150, 200]],
        hardness: [58, 60],
        notes: null
    },

    // ─── UDDEHOLM ────────────────────────────────────────────────────────────

    'uddeholm-1': {
        normalize: null,
        austenitize: 1065,
        soak: '20–30 min',
        quench: 'Gas quench or plate quench',
        cryo: true,
        cryo_temp: -70,
        temper: [[150, 200], [150, 200]],
        hardness: [59, 62],
        notes: null
    },

    'uddeholm-5': {
        normalize: null,
        austenitize: 1050,
        soak: '5–10 min',
        quench: 'Plate quench or fast oil',
        cryo: true,
        cryo_temp: -76,
        temper: [[150, 165], [150, 165]],
        hardness: [62, 64],
        notes: 'AEB-L is among the most cryo-responsive steels available. Without cryo, retained austenite remains high (~25%) and hardness drops significantly. With -76°C dry ice treatment, RA converts to martensite. Dry ice + acetone soak for 30+ min is the standard bladesmith protocol.'
    },

    'uddeholm-2': {
        normalize: null,
        austenitize: 1050,
        soak: '30–45 min',
        quench: 'Air cool or plate quench',
        cryo: true,
        cryo_temp: -73,
        temper: [[190, 220], [190, 220]],
        hardness: [59, 62],
        notes: 'Extremely high toughness for a PM steel — approaches conventional tool steels in impact resistance. Good alternative to CPM 3V in European markets.'
    },

    'uddeholm-4': {
        normalize: null,
        austenitize: 1020,
        soak: '25–35 min',
        quench: 'Air cool or oil',
        cryo: false,
        cryo_temp: null,
        temper: [[175, 200], [175, 200]],
        hardness: [58, 62],
        notes: null
    },

    'uddeholm-6': {
        normalize: null,
        austenitize: 1080,
        soak: '20–30 min',
        quench: 'Gas quench or plate quench',
        cryo: true,
        cryo_temp: -73,
        temper: [[175, 200], [175, 200]],
        hardness: [59, 61],
        notes: 'Nitrogen-alloyed powder steel. The nitrogen provides solid-solution strengthening and corrosion resistance. Vacuum or atmosphere hardening recommended to preserve nitrogen content near the surface.'
    },

    // ─── CARPENTER ───────────────────────────────────────────────────────────

    'carpenter-1': {
        normalize: null,
        austenitize: 1065,
        soak: '20–30 min',
        quench: 'Plate quench or fast oil',
        cryo: true,
        cryo_temp: -73,
        temper: [[150, 190], [150, 190]],
        hardness: [61, 63],
        notes: null
    },

    'carpenter-2': {
        normalize: null,
        austenitize: 1200,
        soak: '5–8 min',
        quench: 'Air cool or plate quench',
        cryo: true,
        cryo_temp: -184,
        temper: [[180, 200], [180, 200]],
        hardness: [63, 66],
        notes: 'Liquid nitrogen cryo (-196°C) strongly recommended — converts retained austenite and contributes to the exceptional hardness Maxamet is known for. Preheat in stages. Secondary hardening (3× at 550°C) reaches 67–68 HRC but increases brittleness significantly.'
    },

    // ─── HITACHI / PROTERIAL ─────────────────────────────────────────────────

    'hitachi-1': {
        normalize: null,
        austenitize: 1010,
        soak: '10–15 min',
        quench: 'Oil or air quench',
        cryo: true,
        cryo_temp: -73,
        temper: [[150, 175], [150, 175]],
        hardness: [64, 67],
        notes: 'At 3% carbon, ZDP-189 has very high retained austenite after quench. Cryo is essentially mandatory to achieve its rated hardness. Designed and typically heat treated by Hitachi for OEMs — DIY HT is challenging.'
    },

    'hitachi-2': {
        normalize: null,
        austenitize: 940,
        soak: '5–10 min',
        quench: 'Fast oil (Parks 50) or water',
        cryo: false,
        cryo_temp: null,
        temper: [[150, 180], [150, 180]],
        hardness: [62, 65],
        notes: 'Higher austenitizing temperature than Shirogami due to tungsten and cobalt alloying. Tungsten and cobalt extend the temperature range for complete carbide dissolution. Traditional Japanese blacksmiths judge temperature by color (bright orange-yellow).'
    },

    'hitachi-5': {
        normalize: null,
        austenitize: 860,
        soak: '5–8 min',
        quench: 'Fast oil or water',
        cryo: false,
        cryo_temp: null,
        temper: [[150, 175], [150, 175]],
        hardness: [62, 64],
        notes: null
    },

    'hitachi-6': {
        normalize: null,
        austenitize: 880,
        soak: '5–8 min',
        quench: 'Water, brine, or very fast oil',
        cryo: false,
        cryo_temp: null,
        temper: [[150, 175], [150, 175]],
        hardness: [62, 65],
        notes: 'Tungsten carbides in Blue 1 require slightly higher temperature than Blue 2 for complete dissolution. Japanese kitchen knife makers traditionally use interrupted water quench for hamons.'
    },

    'hitachi-3': {
        normalize: null,
        austenitize: 780,
        soak: '3–5 min',
        quench: 'Water or brine (mandatory)',
        cryo: false,
        cryo_temp: null,
        temper: [[150, 170], [150, 170]],
        hardness: [63, 65],
        notes: 'The purest carbon steel in the Hitachi lineup. Extremely low hardenability demands a fast water or brine quench — oil will not fully harden Shirogami. Very short soak prevents grain growth. Traditional Japanese "mizuyaki" (water hardening). Challenging for beginners but produces extraordinary edge quality.'
    },

    'hitachi-4': {
        normalize: null,
        austenitize: 770,
        soak: '3–5 min',
        quench: 'Water or brine',
        cryo: false,
        cryo_temp: null,
        temper: [[150, 165], [150, 165]],
        hardness: [62, 64],
        notes: 'Slightly lower carbon than White 1 — marginally more forgiving to heat treat while maintaining exceptional sharpness.'
    },

    'hitachi-12': {
        normalize: null,
        austenitize: 1020,
        soak: '10–15 min',
        quench: 'Oil or plate quench',
        cryo: false,
        cryo_temp: null,
        temper: [[150, 175], [150, 175]],
        hardness: [59, 61],
        notes: 'Semi-stainless behavior at 13.5% Cr. Much more forgiving than pure carbon Hitachi steels. Popular in Japanese kitchen knife production for its combination of ease of sharpening and mild corrosion resistance.'
    },

    // ─── TAKEFU ──────────────────────────────────────────────────────────────

    'takefu-1': {
        normalize: null,
        austenitize: 1055,
        soak: '20–30 min',
        quench: 'Air cool or plate quench',
        cryo: false,
        cryo_temp: null,
        temper: [[150, 175], [150, 175]],
        hardness: [62, 64],
        notes: null
    },

    'takefu-2': {
        normalize: null,
        austenitize: 1040,
        soak: '15–20 min',
        quench: 'Air cool or oil',
        cryo: false,
        cryo_temp: null,
        temper: [[150, 175], [150, 175]],
        hardness: [60, 62],
        notes: null
    },

    // ─── TRADITIONAL TOOL STEELS ─────────────────────────────────────────────

    'classic-2': {
        normalize: null,
        austenitize: 800,
        soak: '10–15 min',
        quench: 'Oil — Parks 50, Parks 110, or vegetable oil',
        cryo: false,
        cryo_temp: null,
        temper: [[175, 205], [175, 205]],
        hardness: [62, 65],
        notes: 'One of the most forgiving steels for bladesmiths — simple, predictable, and well-characterized. No exotic equipment required. Oil at ~50°C (120°F) gives the best results.'
    },

    'classic-3': {
        normalize: [870, '30 min'],
        austenitize: 1025,
        soak: '30–45 min',
        quench: 'Air cool (air-hardening)',
        cryo: false,
        cryo_temp: null,
        temper: [[175, 215], [175, 215]],
        hardness: [60, 62],
        notes: 'D2 air-hardens — slow cooling in still air from austenitizing temperature is sufficient. The long soak ensures complete carbide dissolution in this high-chromium alloy. Normalize before hardening to homogenize large carbides from prior processing.'
    },

    'others-6': {
        normalize: null,
        austenitize: 960,
        soak: '20–30 min',
        quench: 'Air cool',
        cryo: false,
        cryo_temp: null,
        temper: [[177, 215], [177, 215]],
        hardness: [58, 62],
        notes: 'Air-hardening tool steel — very dimensionally stable during hardening. Low distortion makes it suitable for longer blades.'
    },

    'toolsteel-5': {
        normalize: null,
        austenitize: 800,
        soak: '5–10 min',
        quench: 'Water or warm brine (mandatory)',
        cryo: false,
        cryo_temp: null,
        temper: [[150, 190], [150, 190]],
        hardness: [62, 66],
        notes: 'Water or brine quench is essential — W2\'s low hardenability means oil will leave soft spots. The fast quench is also what creates the stunning hamon in differential heat treatment. Interrupted quench (pull from water early and let heat soak back) is the traditional hamon technique.'
    },

    'toolsteel-7': {
        normalize: null,
        austenitize: 800,
        soak: '5–10 min',
        quench: 'Water or brine',
        cryo: false,
        cryo_temp: null,
        temper: [[150, 190], [150, 190]],
        hardness: [62, 65],
        notes: 'The foundational water-hardening steel of American bladesmithing. Water quench required. Beautiful hamons possible via clay coating and differential hardening.'
    },

    'toolsteel-1': {
        normalize: null,
        austenitize: 1210,
        soak: '5–8 min',
        quench: 'Air, salt bath, or fast oil',
        cryo: false,
        cryo_temp: null,
        temper: [[175, 205], [175, 205]],
        hardness: [62, 65],
        notes: 'Knife-maker protocol: low-temperature temper for maximum toughness. Secondary hardening protocol (3× at 540–560°C) reaches 63–65 HRC with better hot hardness but more brittleness — not recommended for knives. Preheat in stages: 450°C then 850°C before austenitizing.'
    },

    // ─── CLASSIC CARBON ──────────────────────────────────────────────────────

    'classic-1': {
        normalize: null,
        austenitize: 800,
        soak: '5–10 min',
        quench: 'Fast oil (Parks 50) or water',
        cryo: false,
        cryo_temp: null,
        temper: [[175, 205], [175, 205]],
        hardness: [58, 62],
        notes: 'The quintessential production knife carbon steel. Parks 50 at 50–65°C recommended for thinner stock. Water quench for thicker sections or spring-steel results.'
    },

    'carbon-1': {
        normalize: [870, '30 min'],
        austenitize: 838,
        soak: '10–15 min',
        quench: 'Fast oil (Parks 50 or Houghton 1)',
        cryo: true,
        cryo_temp: -73,
        temper: [[150, 175], [150, 175]],
        hardness: [60, 64],
        notes: 'Normalize first — this is important for 52100 to break up the dense carbide network from mill processing. Cryo is strongly recommended: 52100 has significant retained austenite (~25%) which converts to martensite at cryo temperatures, boosting hardness and wear resistance substantially. A bladesmith favorite for razors and kitchen knives.'
    },

    'carbon-2': {
        normalize: null,
        austenitize: 810,
        soak: '5–10 min',
        quench: 'Oil or water',
        cryo: false,
        cryo_temp: null,
        temper: [[150, 200], [150, 200]],
        hardness: [56, 60],
        notes: 'Medium-high carbon — classic sword and large blade steel. Lower carbon than 1075 gives slightly less edge retention but excellent shock resistance. Often used at lower hardness (54–56 HRC) for maximum flexibility.'
    },

    'carbon-3': {
        normalize: null,
        austenitize: 815,
        soak: '5–10 min',
        quench: 'Fast oil or water',
        cryo: false,
        cryo_temp: null,
        temper: [[175, 205], [175, 205]],
        hardness: [57, 61],
        notes: null
    },

    'carbon-4': {
        normalize: null,
        austenitize: 820,
        soak: '5–10 min',
        quench: 'Oil or water',
        cryo: false,
        cryo_temp: null,
        temper: [[150, 200], [150, 200]],
        hardness: [57, 61],
        notes: 'Classic sword steel. The 0.75% carbon is enough for a functional edge with exceptional toughness and flexibility.'
    },

    'carbon-5': {
        normalize: null,
        austenitize: 800,
        soak: '5–8 min',
        quench: 'Fast oil (Parks 50)',
        cryo: false,
        cryo_temp: null,
        temper: [[175, 200], [175, 200]],
        hardness: [59, 63],
        notes: 'Popular in Japanese factory knife production. Good balance of edge and toughness for the simplicity of its chemistry.'
    },

    'carbon-6': {
        normalize: null,
        austenitize: 830,
        soak: '5–10 min',
        quench: 'Fast oil (Parks 50) at 50–65°C',
        cryo: false,
        cryo_temp: null,
        temper: [[175, 205], [175, 205]],
        hardness: [58, 62],
        notes: 'The bladesmith community\'s favorite beginner steel. Extremely forgiving in a basic forge — wide austenitizing window, simple oil quench, minimal warping. Parks 50 in a warm (50°C) bath is the standard recommendation.'
    },

    'classic-7': {
        normalize: null,
        austenitize: 855,
        soak: '10–15 min',
        quench: 'Oil',
        cryo: false,
        cryo_temp: null,
        temper: [[200, 260], [200, 260]],
        hardness: [54, 58],
        notes: 'Spring steel — intentionally tempered softer than most blade steels for maximum flexibility and shock resistance. Choppers and swords typically target 54–56 HRC for spring-like toughness. Higher temper temperature (260°C) gives the most flexibility.'
    },

    // ─── CLASSIC STAINLESS ────────────────────────────────────────────────────

    'classic-4': {
        normalize: null,
        austenitize: 1038,
        soak: '15–25 min',
        quench: 'Oil or air cool',
        cryo: false,
        cryo_temp: null,
        temper: [[150, 190], [150, 190]],
        hardness: [57, 60],
        notes: null
    },

    // ─── ALLEIMA / SANDVIK ────────────────────────────────────────────────────

    'alleima-3': {
        normalize: null,
        austenitize: 1040,
        soak: '5–10 min',
        quench: 'Plate quench or fast oil',
        cryo: true,
        cryo_temp: -76,
        temper: [[150, 165], [150, 165]],
        hardness: [62, 64],
        notes: 'Closely related to AEB-L. Responds excellently to cryo — the dry ice + acetone protocol (-76°C for 30 min) is standard in Japanese kitchen knife production using this steel.'
    },

    'alleima-1': {
        normalize: null,
        austenitize: 1045,
        soak: '5–10 min',
        quench: 'Plate quench or fast oil',
        cryo: true,
        cryo_temp: -76,
        temper: [[150, 175], [150, 175]],
        hardness: [61, 64],
        notes: 'Nitrogen addition reduces retained austenite. Cryo recommended but less critical than AEB-L. Popular in Scandinavian knife production.'
    },

    // ─── ERASTEEL / ASP ──────────────────────────────────────────────────────

    'erasteel-1': {
        normalize: null,
        austenitize: 1160,
        soak: '3–5 min',
        quench: 'Plate quench or gas quench',
        cryo: true,
        cryo_temp: -73,
        temper: [[175, 205], [175, 205]],
        hardness: [63, 66],
        notes: 'High-speed steel — preheat in stages (450°C, 850°C) before austenitizing. Knife-maker protocol uses low-temperature temper. Triple temper at 540°C reaches secondary hardening peak (~67 HRC) but adds brittleness.'
    },

    'erasteel-2': {
        normalize: null,
        austenitize: 1190,
        soak: '3–5 min',
        quench: 'Air or gas quench',
        cryo: false,
        cryo_temp: null,
        temper: [[540, 560], [540, 560], [540, 560]],
        hardness: [64, 66],
        notes: 'Triple temper at secondary hardening peak (540–560°C) is the standard HSS protocol. For knife applications, 2× at 175–200°C gives slightly lower hardness (~63–64 HRC) with better toughness.'
    },

    // ─── NJSB ────────────────────────────────────────────────────────────────

    'budget-1': {
        normalize: null,
        austenitize: 1055,
        soak: '5–10 min',
        quench: 'Plate quench',
        cryo: true,
        cryo_temp: -76,
        temper: [[150, 165], [150, 165]],
        hardness: [62, 64],
        notes: 'Cryo is essential for Nitro-V — the nitrogen content increases retained austenite after quench. Dry ice (–76°C) for 30 min converts it to martensite and boosts hardness and corrosion resistance significantly. One of the best value steels for cryo-equipped makers.'
    },
};
