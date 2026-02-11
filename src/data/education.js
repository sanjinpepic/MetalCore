export const GLOSSARY = [
    // --- FUNDAMENTALS ---
    {
        term: "HRC (Rockwell Hardness)",
        def: "A scale used to measure the hardness of a material. Most knife steels range from 54 to 65 HRC. Higher hardness generally yields better edge retention but may decrease toughness.",
        category: "Fundamentals",
        level: "Beginner"
    },
    {
        term: "Toughness",
        def: "The ability of a steel to resist chipping or breaking under impact or stress. Often a trade-off with edge retention.",
        category: "Fundamentals",
        level: "Beginner"
    },
    {
        term: "Edge Retention",
        def: "The ability of a knife blade to hold its sharpness during use. Influenced by hardness and carbide volume/type.",
        category: "Fundamentals",
        level: "Beginner"
    },
    {
        term: "Corrosion Resistance",
        def: "The ability of a steel to resist rust and oxidation, primarily achieved through the addition of Chromium (typically >12% for stainless).",
        category: "Fundamentals",
        level: "Beginner"
    },
    {
        term: "Wear Resistance",
        def: "A steel's ability to resist abrasive material removal during cutting. Driven primarily by carbide volume and hardness. High wear resistance directly translates to longer edge life.",
        category: "Fundamentals",
        level: "Beginner"
    },
    {
        term: "Stainless vs Carbon Steel",
        def: "Stainless steels contain 10.5%+ Chromium, giving them corrosion resistance but often at the cost of toughness. Carbon steels (e.g. 1095, SK-5) are tougher and easier to sharpen but rust without maintenance.",
        category: "Fundamentals",
        level: "Beginner"
    },

    // --- ALLOYING ELEMENTS ---
    {
        term: "Chromium (Cr)",
        def: "The key element that grants corrosion resistance. Above ~10.5% Cr, steel is classified as 'stainless'. Cr also forms hard chromium carbides that contribute to wear resistance.",
        category: "Alloying Elements",
        level: "Intermediate"
    },
    {
        term: "Vanadium",
        def: "An alloying element that forms extremely hard 'Vanadium Carbides', which are primary drivers of wear resistance (edge retention).",
        category: "Alloying Elements",
        level: "Intermediate"
    },
    {
        term: "Molybdenum (Mo)",
        def: "Increases hardenability, wear resistance, and corrosion resistance. Common in tool steels and high-performance stainless grades like M390 and CTS-XHP.",
        category: "Alloying Elements",
        level: "Intermediate"
    },
    {
        term: "Cobalt (Co)",
        def: "Raises the hardening temperature and increases the amount of martensite formed, leading to higher achievable hardness. Found in super steels like Maxamet and Rex 45.",
        category: "Alloying Elements",
        level: "Intermediate"
    },
    {
        term: "Tungsten (W)",
        def: "Forms extremely hard tungsten carbides, boosting wear resistance significantly. A defining element in steels like Maxamet, CPM M4, and the ASP series.",
        category: "Alloying Elements",
        level: "Intermediate"
    },
    {
        term: "Nitrogen (N)",
        def: "Added to some modern steels (e.g. 14C28N, LC200N) to form nitrides that improve hardness and corrosion resistance without the downsides of heavy carbide formation.",
        category: "Alloying Elements",
        level: "Advanced"
    },

    // --- MICROSTRUCTURE ---
    {
        term: "Carbides",
        def: "Hard particles formed when carbon bonds with alloying elements (Vanadium, Tungsten, Chromium). They provide wear resistance but can affect toughness.",
        category: "Microstructure",
        level: "Intermediate"
    },
    {
        term: "Grain Structure",
        def: "The microscopic crystalline pattern within a steel. Finer grain = stronger and tougher steel. Powder metallurgy and proper heat treatment both refine grain structure.",
        category: "Microstructure",
        level: "Intermediate"
    },
    {
        term: "Austenite/Martensite",
        def: "Different crystalline structures of steel achieved through heat treatment. Martensite is the hard, desirable structure for knife blades.",
        category: "Microstructure",
        level: "Advanced"
    },
    {
        term: "Retained Austenite",
        def: "Austenite that fails to transform to martensite during quenching. It reduces hardness and edge stability. Cryogenic treatment is the primary method to eliminate it.",
        category: "Microstructure",
        level: "Advanced"
    },

    // --- HEAT TREATMENT ---
    {
        term: "Heat Treatment (HT)",
        def: "A controlled process of heating and cooling steel to change its molecular structure, bringing out its best performance properties.",
        category: "Heat Treatment",
        level: "Beginner"
    },
    {
        term: "Tempering",
        def: "A secondary heating process after hardening to reduce brittleness and increase toughness by making the steel less 'stressed'.",
        category: "Heat Treatment",
        level: "Intermediate"
    },
    {
        term: "Quenching",
        def: "Rapidly cooling steel from its hardening temperature (usually 1050\u20131100\u00b0C) to lock in the hard martensitic structure. The quenching medium (oil, water, air) affects the final result.",
        category: "Heat Treatment",
        level: "Intermediate"
    },
    {
        term: "Cryogenic Treatment",
        def: "A process where steel is cooled to sub-zero temperatures (-185\u00b0C) during heat treatment to complete the transformation of austenite to martensite, improving hardness and stability.",
        category: "Heat Treatment",
        level: "Advanced"
    },
    {
        term: "Secondary Hardening",
        def: "A phenomenon where certain alloy carbides (Mo, V, W) precipitate during tempering, actually increasing hardness at higher temper temperatures. Key to optimizing steels like CPM M4.",
        category: "Heat Treatment",
        level: "Advanced"
    },

    // --- MANUFACTURING ---
    {
        term: "Powder Metallurgy (PM)",
        def: "A manufacturing process that creates a very fine, uniform distribution of carbides, leading to superior toughness and wear resistance compared to conventional ingot steels.",
        category: "Manufacturing",
        level: "Beginner"
    },
    {
        term: "CPM (Crucible Particle Metallurgy)",
        def: "Crucible's proprietary powder metallurgy process. Molten steel is atomized into fine powder, then compacted and forged. The result is an extremely uniform carbide distribution, producing steels with exceptional toughness for their hardness.",
        category: "Manufacturing",
        level: "Intermediate"
    }
];

export const FAQ = [
    // --- GETTING STARTED ---
    {
        q: "What is the best knife steel?",
        a: "There is no single 'best' steel. The right choice depends on your needs. For daily carry, M390 offers an elite balance. For pure toughness, CPM 3V is legendary. For ultimate edge retention, CPM S125V or Maxamet.",
        category: "Getting Started"
    },
    {
        q: "What is the difference between stainless and carbon steel?",
        a: "Carbon steels (1075, 1095, SK-5) are tougher, easier to sharpen, and hold a keen edge well, but they rust without regular maintenance. Stainless steels (M390, S30V, VG-10) resist corrosion thanks to Chromium but are generally harder to sharpen. Neither is objectively 'better'\u2014it depends on your use case and how much maintenance you want.",
        category: "Getting Started"
    },
    {
        q: "Is a harder knife always better?",
        a: "Not necessarily. While higher HRC (62+) means the edge stays sharp longer, it also makes the blade more 'brittle', meaning it might chip if you drop it or hit a bone. Balanced steels are often preferred for general use.",
        category: "Getting Started"
    },

    // --- MAINTENANCE ---
    {
        q: "Why does my stainless steel knife have rust spots?",
        a: "No steel is truly 'rust-proof' (except maybe LC200N or Vanax). Even stainless steels can corrode if exposed to salt, acids, or moisture for long periods. Proper cleaning and drying are essential.",
        category: "Maintenance"
    },
    {
        q: "How do I maintain and clean my knife?",
        a: "Wipe the blade dry after each use, especially after cutting acidic foods (citrus, tomatoes). A light coat of mineral oil or camellia oil on the blade protects against moisture. For carbon steels, a patina (dark oxide layer) actually provides a layer of corrosion protection and is considered desirable by many collectors.",
        category: "Maintenance"
    },
    {
        q: "How often should I sharpen my knife?",
        a: "It depends on the steel and usage. Steels with high edge retention (like S90V) stay sharp longer but are harder to sharpen. Frequent stropping can maintain an edge and delay the need for a full sharpening session.",
        category: "Maintenance"
    },
    {
        q: "What sharpening angle should I use?",
        a: "Most factory knives are sharpened at 15\u201320\u00b0 per side. Higher-hardness steels (60+ HRC) like Japanese knives often use 10\u201315\u00b0 per side for a finer edge. Softer steels or knives used for heavy tasks do better at 20\u201325\u00b0 per side for durability. When in doubt, match the factory angle.",
        category: "Maintenance"
    },

    // --- TECHNOLOGY ---
    {
        q: "What is the difference between Powder Steel (PM) and conventional steel?",
        a: "PM (Powder Metallurgy) steels have a finer, more consistent grain structure than conventionally melted steels, allowing for higher alloy content without sacrificing as much toughness.",
        category: "Technology"
    },
    {
        q: "What is MagnaCut and why is everyone talking about it?",
        a: "MagnaCut is a revolutionary 'super steel' designed specifically for knives. It offers high toughness, high edge retention, AND incredible corrosion resistance\u2014a trio of properties previously thought impossible to achieve at such high levels simultaneously.",
        category: "Technology"
    },
    {
        q: "Are CPM or powder metallurgy steels worth the extra cost?",
        a: "Generally yes, if you value performance. PM steels achieve a better balance of toughness and edge retention than conventional steels at similar hardness levels. The uniform carbide structure means fewer weak spots and more consistent sharpening. For a premium EDC folder, the difference is noticeable. For a budget beater knife, conventional steel is perfectly fine.",
        category: "Technology"
    },
    {
        q: "What does 'SuperClean' or 'Microclean' mean on steels like M390 or Elmax?",
        a: "These are trademarked names for extra-pure versions of the steel. The base alloy is the same, but impurities (sulfur, phosphorus) are reduced to near-zero levels. This results in better corrosion resistance, more consistent heat treatment response, and finer grain structure. M390 Microclean and Elmax SuperClean are the versions typically used in knives.",
        category: "Technology"
    },
    {
        q: "What is cladding and why does it matter?",
        a: "Cladding wraps a hard, high-performance core steel (like White 2 or SG2) in softer, tougher layers of stainless or carbon steel. The core provides the edge, while the cladding protects it and resists chipping. It's common in Japanese kitchen knives and gives them both excellent cutting ability and durability.",
        category: "Technology"
    }
];

export const PRODUCERS = [
    {
        name: "Crucible Industries  𓉸",
        location: "Syracuse, NY, USA",
        coords: [43.0481, -76.1474],
        region: "North America",
        desc: "Pioneers of the CPM (Crucible Particle Metallurgy) process. Known for legendary grades like MagnaCut, S30V, and 3V. Acquired by Erasteel during 2025."
    },
    {
        name: "B\u00f6hler-Uddeholm",
        location: "Kapfenberg, Austria",
        coords: [47.4436, 15.2901],
        region: "Europe",
        desc: "A global leader in high-performance tool steels. Famous for M390, Elmax, and Vanax SuperClean."
    },
    {
        name: "Alleima",
        location: "Sandviken, Sweden",
        coords: [60.6208, 16.7735],
        region: "Europe",
        desc: "Specialists in high-purity stainless steels. Their 14C28N is considered one of the best budget stainless steels in the world."
    },
    {
        name: "Takefu Special Steel",
        location: "Echizen, Japan",
        coords: [35.9038, 136.1685],
        region: "Asia",
        desc: "Famous for 'Clad' steels and VG10, the gold standard for many Japanese kitchen and pocket knives."
    },
    {
        name: "Hitachi Metals",
        location: "Tokyo, Japan",
        coords: [35.6895, 139.6917],
        region: "Asia",
        desc: "Producers of ZDP-189 and Blue/White paper steels, highly prized by traditional blacksmiths and enthusiasts. Acquired by Proterial during 2023."
    },
    {
        name: "Carpenter Technology",
        location: "Reading, PA, USA",
        coords: [40.3356, -75.9269],
        region: "North America",
        desc: "Producers of extremely hard steels like Maxamet and CTS-XHP."
    },
    {
        name: "Damasteel",
        location: "Tampere, Finland",
        coords: [61.4987, 23.7867],
        region: "Europe",
        desc: "Specialists in Damascus pattern steels and high-end stainless grades. Known for RWL34 and DS93X, both favorites in the knife-making community."
    },
    {
        name: "Zapp",
        location: "Krefeld, Germany",
        coords: [51.2277, 6.7735],
        region: "Europe",
        desc: "German tool steel distributor behind LC200N (Cronidur 30), one of the most corrosion-resistant steels available. Popular in bearing and surgical applications."
    },
    {
        name: "Erasteel",
        location: "Stockholm, Sweden",
        coords: [59.3293, 18.0686],
        region: "Europe",
        desc: "Swedish powder metallurgy specialist producing the ASP series (ASP 2030, 2060, 2003). These high-alloy tool steels push the limits of edge retention and wear resistance. Acquired Crucible Industries & the CPM brand in 2025, expanding their presence in the knife steel market."
    },
    {
        name: "Aichi Steel",
        location: "Nagoya, Japan",
        coords: [35.1815, 136.9066],
        region: "Asia",
        desc: "Japanese manufacturer behind AUS-10A and AUS-8, two of the most widely used budget stainless steels in the knife industry. Reliable and well-rounded performers."
    },
    {
        name: "Yoshikin",
        location: "Saki, Japan",
        coords: [37.7519, 138.8284],
        region: "Asia",
        desc: "Known for CROMOVA 18, a high-chromium stainless steel used in premium Japanese kitchen knives. The parent company behind the Global knife brand."
    },
    {
        name: "New Jersey Steel Baron",
        location: "Morris Plains, NJ, USA",
        coords: [40.8029, -74.4510],
        region: "North America",
        desc: "A boutique American steel supplier specializing in Nitro-V, a nitrogen-alloyed stainless steel that punches well above its price class. A favorite among budget-conscious knife enthusiasts."
    }
];
