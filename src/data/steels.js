// METALCORE - PREMIUM STEEL DATASET
// This file contains the core metallurgy data for the application.

export const PREMIUM_STEELS = [
    // --- BÖHLER ---
    {
        id: 'bohler-1', name: "M390 Microclean", producer: "Böhler", C: 1.9, Cr: 20.0, V: 4.0, Mo: 1.0, W: 0.6, Co: 0, edge: 9.5, toughness: 4, corrosion: 9.5, sharpen: 3,
        ht_curve: "200:60,400:58,500:59,600:56",
        desc: "Third-generation powder metallurgy stainless steel. Widely considered the gold standard for high-end folders.",
        knives: ["Benchmade Bugout (Limited)", "Microtech Ultratech", "GiantMouse ACE Riv"],
        pros: ["Exceptional corrosion resistance", "Elite edge retention", "High finishability"],
        cons: ["Relatively difficult to sharpen", "Moderate toughness"],
        use_case: "Premium EDC folders and gentleman's knives where edge retention is prioritized."
    },
    {
        id: 'bohler-2', name: "K390 Microclean", producer: "Böhler", C: 2.47, Cr: 4.2, V: 9.0, Mo: 3.8, W: 1.0, Co: 2.0, edge: 10, toughness: 6, corrosion: 2, sharpen: 2,
        ht_curve: "500:62,540:64,600:61",
        desc: "High-alloy cold work tool steel with extreme wear resistance and high compressive strength.",
        knives: ["Spyderco Police 4 Lightweight", "Spyderco Endela K390", "Spyderco Delica 4"],
        pros: ["Workhorse edge retention", "Surprising toughness for wear resistance", "Aggressive cutting performance"],
        cons: ["Low corrosion resistance (patinas)", "Difficult to sharpen"],
        use_case: "Hard-use daily carries and workspace knives that trade stainlessness for raw performance."
    },
    {
        id: 'bohler-3', name: "N690", producer: "Böhler", C: 1.08, Cr: 17.3, V: 0.1, Mo: 1.1, W: 0, Co: 1.5, edge: 5, toughness: 5, corrosion: 8, sharpen: 7,
        ht_curve: "200:58,400:56,500:57",
        desc: "Cobalt-enriched stainless steel. Famous for being easy to sharpen while maintaining good corrosion resistance.",
        knives: ["Extrema Ratio Fulcrum", "Boker Plus Kwaiken", "Viper Dan 2"],
        pros: ["Extremely easy to sharpen", "Consistent performance", "Excellent corrosion resistance"],
        cons: ["Lower edge retention than PM steels", "Average toughness"],
        use_case: "Tactical folders, diving knives, and kitchen cutlery where maintenance is key."
    },
    {
        id: 'bohler-4', name: "M398 Microclean", producer: "Böhler", C: 2.7, Cr: 20.0, V: 7.2, Mo: 1.0, W: 0.7, Co: 0, edge: 10, toughness: 3, corrosion: 9, sharpen: 1,
        ht_curve: "200:61,400:59,500:60",
        desc: "An evolution of M390 with significantly higher carbon and vanadium for extreme edge retention.",
        knives: ["Shirogorov F3NS (M398)", "Custom configurations"],
        pros: ["Unmatched industrial edge retention", "Good corrosion resistance"],
        cons: ["Extreme sharpening difficulty", "Fragile at low angles"],
        use_case: "Luxury 'safe queen' folders or high-performance enthusiasts who enjoy technical sharpening."
    },

    // --- UDDEHOLM ---
    {
        id: 'uddeholm-1', name: "Elmax SuperClean", producer: "Uddeholm", C: 1.7, Cr: 18.0, V: 3.0, Mo: 1.0, W: 0, Co: 0, edge: 8, toughness: 5, corrosion: 8, sharpen: 5,
        ht_curve: "200:60,400:58,500:59",
        desc: "A versatile powder stainless steel balancing high wear resistance with ease of maintenance.",
        knives: ["Zero Tolerance 0562", "Microtech Socom Elite", "TRC Knives South Pole"],
        pros: ["Great all-around balance", "Good toughness for a stainless steel", "High wear resistance"],
        cons: ["Sensitive to heat treatment errors", "Moderate sharpening effort"],
        use_case: "High-end outdoor fixed blades and rugged folding knives."
    },
    {
        id: 'uddeholm-2', name: "Vanadis 4 Extra", producer: "Uddeholm", C: 1.4, Cr: 4.7, V: 3.7, Mo: 3.5, W: 0, Co: 0, edge: 8, toughness: 9, corrosion: 1, sharpen: 4,
        ht_curve: "500:60,540:62,600:58",
        desc: "A chromium-molybdenum-vanadium alloyed steel characterized by high wear resistance and very good toughness.",
        knives: ["Custom Bushcraft Knives", "Heavy Duty Choppers"],
        pros: ["Legendary toughness", "High wear resistance for a tool steel"],
        cons: ["Non-stainless (will rust)", "Challenging to sharpen"],
        use_case: "Hardcore bushcraft, camp knives, and competition choppers."
    },
    {
        id: 'uddeholm-3', name: "Vanadis 8", producer: "Uddeholm", C: 2.3, Cr: 4.8, V: 8.0, Mo: 3.6, W: 0, Co: 0, edge: 10, toughness: 4, corrosion: 1, sharpen: 2,
        ht_curve: "500:62,540:64,600:60",
        desc: "Extremely high wear resistance tool steel. Used for industrial applications and performance-first heavy-duty knives.",
        knives: ["Custom Fixed Blades", "Performance Choppers"],
        pros: ["Extreme wear resistance", "High compressive strength"],
        cons: ["Requires coating or heavy oiling", "Brutal to sharpen"],
        use_case: "Industrial cutting applications and extreme performance fixed blades."
    },
    {
        id: 'uddeholm-6', name: "Vanax SuperClean", producer: "Uddeholm", C: 0.36, Cr: 15.5, V: 3.5, Mo: 1.1, W: 0, Co: 0, edge: 8, toughness: 7, corrosion: 10, sharpen: 6,
        ht_curve: "150:60,200:59,250:57",
        desc: "A nitrogen-alloyed stainless steel with exceptional corrosion resistance and good wear resistance.",
        knives: ["Quiet Carry Waypoint", "Quiet Carry Drift", "Custom Saltwater Knives"],
        pros: ["Total rust immunity", "Superior edge retention to LC200N", "Very tough"],
        cons: ["Expensive", "Requires specialized heat treat"],
        use_case: "Marine environments and hard-use EDC where corrosion is a major factor."
    },
    {
        id: 'uddeholm-4', name: "Sleipner", producer: "Uddeholm", C: 0.9, Cr: 7.8, V: 0.5, Mo: 2.5, W: 0, Co: 0, edge: 5, toughness: 7, corrosion: 4, sharpen: 6,
        ht_curve: "200:58,400:56,500:59",
        desc: "A multi-purpose tool steel with a high degree of versatility and better toughness than D2.",
        knives: ["Lionsteel M4", "GiantMouse ACE GMF1", "Custom Hunters"],
        pros: ["Easier to maintain than D2", "High toughness", "Great edge stability"],
        cons: ["Not fully stainless", "Average edge retention"],
        use_case: "Hunting knives and compact fixed blades for camping."
    },
    {
        id: 'uddeholm-5', name: "AEB-L", producer: "Uddeholm",
        C: 0.67, Cr: 13.0, V: 0.0, Mo: 0.0, W: 0.0, Co: 0,
        edge: 6, toughness: 9, corrosion: 8.5, sharpen: 9,
        ht_curve: "150:60,200:59,250:58",
        desc: "Originally a razor blade steel. Famous for fine grain and toughness.",
        knives: ["Custom Kitchen Knives", "Outdoor Fixed Blades"],
        pros: ["Extremely fine edge", "High toughness", "Easy sharpening"],
        cons: ["Moderate edge retention"],
        use_case: "Thin-ground chef knives and slicers."
    },

    // --- CRUCIBLE ---
    {
        id: 'crucible-1', name: "MagnaCut", producer: "Crucible", C: 1.15, Cr: 10.7, V: 4.0, Mo: 2.0, W: 0, Co: 0, edge: 8, toughness: 7, corrosion: 9.5, sharpen: 6,
        ht_curve: "175:61,225:62,300:60,400:58",
        desc: "Revolutionary stainless steel designed specifically for knives. Offers unrivaled balance of toughness and corrosion resistance.",
        knives: ["Chris Reeve Sebenza 31", "Tactile Rockwall", "Hogue Deka"],
        pros: ["Stainless perfection", "High toughness (replaces 4V/3V)", "Great edge retention"],
        cons: ["Still relatively new (premium price)", "Requires precise salt-bath HT"],
        use_case: "The ultimate choice for salt-water folders, high-end EDC, and kitchen knives."
    },
    {
        id: 'crucible-2', name: "CPM S90V", producer: "Crucible", C: 2.3, Cr: 14.0, V: 9.0, Mo: 1.0, W: 0, Co: 0, edge: 10, toughness: 3, corrosion: 7, sharpen: 2,
        ht_curve: "200:59,400:57,500:56",
        desc: "High-carbon, high-vanadium stainless steel. A leader in edge retention for premium production folders.",
        knives: ["Benchmade 940-1", "Spyderco Drunken", "Zero Tolerance 0452CF"],
        pros: ["Extreme edge longevity", "Low maintenance stainlessness"],
        cons: ["Low toughness (will chip)", "Very abrasive to sharpen"],
        use_case: "Light-duty slicing folders where you never want to sharpen."
    },
    {
        id: 'crucible-3', name: "CPM 3V", producer: "Crucible", C: 0.8, Cr: 7.5, V: 2.75, Mo: 1.3, W: 0, Co: 0, edge: 4, toughness: 10, corrosion: 3, sharpen: 6,
        ht_curve: "200:58,400:60,500:62",
        desc: "The gold standard for extreme-toughness outdoor knives. Virtually unbreakable with reasonable wear resistance.",
        knives: ["Bark River Bravo 1", "Cold Steel SRK (3V)", "Demko AD20.5 (3V Variant)"],
        pros: ["World-class impact resistance", "Excellent edge stability", "Decent wear resistance for tough steel"],
        cons: ["Low corrosion resistance", "Requires coating for hard use"],
        use_case: "Bushcraft knives, choppers, and hard-use survival tools."
    },
    {
        id: 'crucible-4', name: "CPM Cru-Wear", producer: "Crucible", C: 1.1, Cr: 7.5, V: 2.4, Mo: 1.6, W: 1.15, Co: 0, edge: 7, toughness: 8.5, corrosion: 3, sharpen: 5,
        ht_curve: "200:61,500:63,600:60",
        desc: "An upgrade to classic D2, Cru-Wear is a high-alloy tool steel that balances extreme toughness with great edge retention.",
        knives: ["Spyderco Military 2", "Benchmade Adamas (CruWear)", "Spyderco Manix 2"],
        pros: ["Exceptional toughness", "Aggressive cutting edge", "Easier to sharpen than S90V"],
        cons: ["Not stainless", "Vulnerable to pitting in humid environments"],
        use_case: "Hard-use EDC and tactical folders that need to survive prying or impact."
    },
    {
        id: 'crucible-5', name: "CPM S45VN", producer: "Crucible", C: 1.48, Cr: 16.0, V: 3.0, Mo: 2.0, W: 0, Co: 0, edge: 7.5, toughness: 5, corrosion: 8, sharpen: 5,
        ht_curve: "200:60,400:58,500:59",
        desc: "An improvement over S35VN, adding more Chromium and Niobium for better corrosion resistance and toughness.",
        knives: ["Chris Reeve Inkosi", "Spyderco Para 3", "Benchmade 940 (Modern)"],
        pros: ["Great all-around balance", "Solid corrosion resistance", "Well-understood heat treatment"],
        cons: ["Outclassed in specific areas by specialized steels", "Moderate sharpening effort"],
        use_case: "High-end production folders and daily carry knives."
    },
    {
        id: 'crucible-6', name: "CPM M4", producer: "Crucible", C: 1.42, Cr: 4.0, V: 4.0, Mo: 5.25, W: 5.5, Co: 0, edge: 8.5, toughness: 7, corrosion: 1, sharpen: 4,
        ht_curve: "500:62,540:64,600:61",
        desc: "A legendary high-speed steel known for winning cutting competitions due to its incredible edge stability.",
        knives: ["Benchmade Bailout", "Spyderco Gayle Bradley 2", "Benchmade Freek"],
        pros: ["Elite edge retention for a non-stainless steel", "Very high toughness", "Incredible edge stability"],
        cons: ["Extremely prone to rust", "Requires constant oiling or coating"],
        use_case: "Performance-first cutting tools and heavy-duty folders."
    },
    {
        id: 'crucible-7', name: "CPM S30V", producer: "Crucible",
        C: 1.45, Cr: 14.0, V: 4.0, Mo: 2.0, W: 0, Co: 0,
        edge: 7, toughness: 6, corrosion: 7.5, sharpen: 6,
        ht_curve: "200:59,400:58,500:56",
        desc: "The first steel designed specifically for knives. Set the modern benchmark for premium production folders.",
        knives: ["Spyderco Paramilitary 2", "Benchmade Griptilian", "Chris Reeve Sebenza (older)"],
        pros: ["Balanced performance", "Good corrosion resistance", "Predictable heat treatment"],
        cons: ["Outperformed by newer steels", "Not exceptional in any one area"],
        use_case: "Reliable premium EDC and outdoor knives."
    },
    {
        id: 'crucible-8', name: "CPM S110V", producer: "Crucible",
        C: 2.8, Cr: 15.25, V: 9.0, Mo: 2.25, W: 0, Co: 0,
        edge: 10, toughness: 3, corrosion: 8, sharpen: 1,
        ht_curve: "200:61,400:59,500:58",
        desc: "A hyper wear-resistant stainless steel built for extreme edge retention.",
        knives: ["Spyderco Manix 2 LW", "Spyderco PM2 (S110V)"],
        pros: ["Near-Maxamet edge life", "Very stainless"],
        cons: ["Low toughness", "Extremely difficult to sharpen"],
        use_case: "Light-duty slicing where sharpening frequency must be minimal."
    },
    {
        id: 'crucible-9', name: "CPM 20CV", producer: "Crucible", C: 1.9, Cr: 20.0, V: 4.0, Mo: 1.0, W: 0.6, Co: 0, edge: 9.5, toughness: 4, corrosion: 9.5, sharpen: 3,
        ht_curve: "200:60,400:58,500:59",
        desc: "Crucible's version of M390. Highly popular in premium American production folders.",
        knives: ["Benchmade Bugout (20CV)", "Hinderer XM-18", "McNees PM Mac 2"],
        pros: ["Elite corrosion resistance", "Top-tier edge retention", "High finishability"],
        cons: ["Hard to sharpen", "Moderate toughness"],
        use_case: "Premium folding knives and high-end EDC."
    },
    {
        id: 'crucible-10', name: "CPM S35VN", producer: "Crucible", C: 1.45, Cr: 14.0, V: 3.0, Mo: 2.0, W: 0, Co: 0, edge: 7.5, toughness: 5.5, corrosion: 8, sharpen: 5,
        ht_curve: "200:59,400:58,500:56",
        desc: "The industry standard for premium knives. An upgrade to S30V with added Niobium for better toughness.",
        knives: ["Chris Reeve Sebenza (S35VN)", "ESEE 6 S35VN", "White River Firecraft 4"],
        pros: ["Excellent all-around balance", "Very tough for a stainless steel", "Easier to sharpen than S90V"],
        cons: ["Increasingly seen as 'entry-level' premium"],
        use_case: "The gold standard for high-end folders and fixed blades."
    },
    {
        id: 'crucible-11', name: "CPM 154", producer: "Crucible", C: 1.05, Cr: 14.0, V: 0, Mo: 4.0, W: 0, Co: 0, edge: 6, toughness: 5, corrosion: 8, sharpen: 7,
        ht_curve: "200:59,400:57,500:58",
        desc: "A powder metallurgy version of 154CM. Favored by custom makers for its mirror-polish ability.",
        knives: ["Grimsmo Norseman (Older)", "Custom Traditional Folders"],
        pros: ["Takes an incredible finish", "Very easy to sharpen", "Consistent performance"],
        cons: ["Lower edge retention than modern super-steels"],
        use_case: "Custom knives and premium production folders where aesthetics matter."
    },

    // --- CARPENTER ---
    {
        id: 'carpenter-1', name: "CTS-XHP", producer: "Carpenter", C: 1.6, Cr: 16.0, V: 0.45, Mo: 0.8, W: 0, Co: 0, edge: 7.5, toughness: 5, corrosion: 8, sharpen: 6,
        ht_curve: "200:60,400:58,500:60",
        desc: "Often described as a stainless version of D2. Carpenter created a high-hardness stainless with a very fine edge.",
        knives: ["Cold Steel Recon 1", "Spyderco Techno 2", "McNees PM Mac 2"],
        pros: ["Takes a very keen edge", "Good corrosion resistance", "Easy to sharpen for its performance"],
        cons: ["Edge retention is slightly below M390", "Limited availability"],
        use_case: "Premium EDC folders where a fine edge and easy maintenance are desired."
    },
    {
        id: 'carpenter-2', name: "Maxamet", producer: "Carpenter", C: 2.15, Cr: 4.75, V: 6.0, Mo: 0, W: 13.0, Co: 10.0, edge: 10, toughness: 2, corrosion: 1, sharpen: 1,
        ht_curve: "500:68,540:70,600:65",
        desc: "An ultra-hard powder metallurgy tool steel designed for extreme wear resistance, capable of reaching 70 HRC.",
        knives: ["Spyderco Paramilitary 2 (Maxamet)", "Spyderco Manix 2 (Maxamet)", "Spyderco Sage 5"],
        pros: ["Unrivaled edge retention", "Extreme hardness", "Industrial cutting power"],
        cons: ["Extremely brittle (will snap if flexed)", "Very prone to rust", "Nearly impossible to sharpen without diamonds"],
        use_case: "Abrasive cutting specialists and enthusiasts who want the absolute peak of edge holding."
    },
    {
        id: 'carpenter-3', name: "Rex 45", producer: "Carpenter", C: 1.3, Cr: 4.0, V: 3.05, Mo: 5.0, W: 6.25, Co: 8.0, edge: 9, toughness: 6, corrosion: 1, sharpen: 2,
        ht_curve: "500:64,540:66,600:62",
        desc: "A high-cobalt version of M4. Rex 45 maintains higher hardness at higher temperatures and offers slightly better wear resistance.",
        knives: ["Spyderco Shaman (Rex 45)", "Spyderco Native 5 (Rex 45)", "Custom Sprints"],
        pros: ["Superior edge retention to M4", "Stable at high hardness", "Good toughness for its alloy"],
        cons: ["Rusts very easily", "Difficult to sharpen"],
        use_case: "Hard-use cutting tasks where edge longevity is paramount."
    },
    {
        id: 'carpenter-4', name: "CTS-204P", producer: "Carpenter", C: 1.9, Cr: 20.0, V: 4.0, Mo: 1.0, W: 0.6, Co: 0, edge: 9.5, toughness: 4, corrosion: 9.5, sharpen: 3,
        ht_curve: "200:60,400:58,500:59",
        desc: "Carpenter's equivalent to M390 and 20CV. Used in many high-end production knives.",
        knives: ["Microtech Ultratech (204P)", "Zero Tolerance 0562CF"],
        pros: ["Exceptional corrosion resistance", "Elite edge holding"],
        cons: ["Difficult to sharpen"],
        use_case: "Premium EDC and gentleman's folders."
    },

    // --- HITACHI & TAKEFU (JAPAN) ---
    {
        id: 'hitachi-1', name: "ZDP-189", producer: "Hitachi", C: 3.0, Cr: 20.0, V: 0.1, Mo: 1.4, W: 0.6, Co: 0, edge: 10, toughness: 3, corrosion: 6, sharpen: 2,
        ht_curve: "150:66,200:65,300:64",
        desc: "A legendary Japanese super-steel with 3% carbon. It achieved fame for holding a terrifyingly sharp edge longer than almost anything else.",
        knives: ["Spyderco Delica (ZDP-189)", "Rockstead Knives", "Spyderco Endura 4"],
        pros: ["Legendary edge retention", "Can reach extreme hardness (67 HRC)", "Very fine microstructure"],
        cons: ["Low toughness", "Requires diamond stones for sharpening"],
        use_case: "High-performance slicing folders and high-end Japanese cutlery."
    },
    {
        id: 'hitachi-2', name: "Aogami Super", producer: "Hitachi", C: 1.45, Cr: 0.4, V: 0.4, Mo: 0, W: 2.25, Co: 0, edge: 8, toughness: 6, corrosion: 0, sharpen: 9,
        ht_curve: "150:64,200:62,250:61",
        desc: "The pinnacle of traditional Japanese high-carbon steels. Cobalt-free but tungsten-enriched for incredible sharpness.",
        knives: ["Takeda Hamono", "Moritaka Hamono", "Custom Kitchen Knives"],
        pros: ["Sharpens to a laser edge", "Incredible 'bite' in cutting", "Very easy to sharpen"],
        cons: ["Rusts instantly if wet", "Requires careful patina management"],
        use_case: "World-class kitchen knives and traditional Japanese blades."
    },
    {
        id: 'takefu-1', name: "SG2 / R2", producer: "Takefu", C: 1.35, Cr: 15.0, V: 2.0, Mo: 2.8, W: 0, Co: 0, edge: 9, toughness: 5, corrosion: 7, sharpen: 4,
        ht_curve: "150:62,200:61,300:59",
        desc: "A high-performance powder metallurgy stainless steel favored by Japanese kitchen knife makers for its edge holding.",
        knives: ["Shun Premier", "Miyabi Birchwood", "Kramer by Zwilling"],
        pros: ["Excellent edge retention", "Very stainless for its performance", "Clean, consistent grain structure"],
        cons: ["Moderately difficult to sharpen", "Can be chippy if treated too hard"],
        use_case: "Premium kitchen cutlery and high-end production Japanese knives."
    },
    {
        id: 'takefu-2', name: "VG-10", producer: "Takefu", C: 1.0, Cr: 15.0, V: 0.2, Mo: 1.0, W: 0, Co: 1.5, edge: 6, toughness: 4, corrosion: 8, sharpen: 7,
        ht_curve: "150:60,200:59,300:57",
        desc: "The workforce of Japanese stainless steel. Cobalt-enriched to maintain hardness and offer a good balance of properties.",
        knives: ["Spyderco Delica 4 (Standard)", "Tojiro DP", "Shun Classic"],
        pros: ["Very stainless", "Easy to sharpen", "Good performance for the price"],
        cons: ["Tends to be chippy in thin grinds", "Lower edge retention than PM steels"],
        use_case: "Entry to mid-range premium kitchen and folding knives."
    },
    {
        id: 'takefu-3', name: "VG-MAX", producer: "Takefu", C: 1.1, Cr: 16.0, V: 0.3, Mo: 1.5, W: 0.5, Co: 1.5, edge: 8, toughness: 4, corrosion: 8, sharpen: 6,
        ht_curve: "150:61,200:60,300:58",
        desc: "An upgraded version of VG-10 developed exclusively for Shun Knives. Increased Chromium and Vanadium for better performance.",
        knives: ["Shun Classic Series", "Shun Premier Series"],
        pros: ["Excellent edge retention", "Very stainless", "Aggressive cutting performance"],
        cons: ["Can be chippy", "Exclusive to Shun"],
        use_case: "Premium Japanese kitchen cutlery."
    },

    // --- ALLEIMA ---
    {
        id: 'alleima-1', name: "14C28N", producer: "Alleima", C: 0.62, Cr: 14.0, V: 0, Mo: 0, W: 0, Co: 0, edge: 4.5, toughness: 8.5, corrosion: 9, sharpen: 8.5,
        ht_curve: "150:58,200:57,250:56",
        desc: "Developed specifically for professional knife applications. Alleima used Nitrogen to boost corrosion resistance.",
        knives: ["Kershaw Leek", "CIVIVI Elementum", "Ruike P801"],
        pros: ["Incredible toughness for a stainless steel", "Extremely corrosion resistant", "Easy to maintain"],
        cons: ["Average edge retention", "Not a 'super-steel' in terms of wear resistance"],
        use_case: "Budget-friendly production folders and tactical knives."
    },
    {
        id: 'alleima-2', name: "12C27", producer: "Alleima", C: 0.6, Cr: 13.5, V: 0, Mo: 0, W: 0, Co: 0, edge: 3, toughness: 8, corrosion: 8, sharpen: 9,
        ht_curve: "150:56,200:55,250:54",
        desc: "The classic Swedish stainless steel. Pure and consistent, it has been used for decades in millions of knives.",
        knives: ["Morakniv Companion", "Opinel No. 8 (Stainless)", "Victorinox (similar)"],
        pros: ["Very easy to sharpen", "High toughness", "Extremely consistent quality"],
        cons: ["Low edge retention", "Needs frequent stropping"],
        use_case: "Standard utility knives, kitchen tools, and outdoor beaters."
    },

    // --- ERATEEL ---
    {
        id: 'erasteel-1', name: "ASP 2030", producer: "Erasteel", C: 1.28, Cr: 4.2, V: 3.1, Mo: 5.0, W: 6.4, Co: 8.5, edge: 8.5, toughness: 7.5, corrosion: 1, sharpen: 3,
        ht_curve: "500:64,540:66,580:63",
        desc: "A cobalt-grade powder metallurgy high-speed steel. Offers a unique combination of toughness and wear resistance.",
        knives: ["Custom Tool Knives", "Industrial Cutting Specialists"],
        pros: ["High hot-hardness", "Excellent wear resistance", "Better toughness than most HSS"],
        cons: ["Non-stainless", "Expensive and hard to source for knives"],
        use_case: "Heavy-duty industrial cutting and specialized heavy-use tools."
    },
    {
        id: 'erasteel-2', name: "ASP 2060", producer: "Erasteel", C: 2.3, Cr: 4.2, V: 6.5, Mo: 7.0, W: 6.5, Co: 10.5, edge: 10, toughness: 5, corrosion: 1, sharpen: 1,
        ht_curve: "500:67,540:69,580:65",
        desc: "One of the highest-alloyed powder steels in existence. Designed for ultimate hot hardness and wear resistance.",
        knives: ["Extreme High-Performance Customs"],
        pros: ["Can reach 69+ HRC", "Incredible wear resistance", "High cobalt content for stability"],
        cons: ["Virtually no corrosion resistance", "Brutal to grind and sharpen"],
        use_case: "The ultimate abrasive cutting tool."
    },
    {
        id: 'erasteel-3', name: "ASP 2003", producer: "Erasteel", C: 1.28, Cr: 4.0, V: 3.1, Mo: 5.0, W: 6.4, Co: 0, edge: 8.5, toughness: 8, corrosion: 1, sharpen: 3,
        ht_curve: "500:64,540:66,580:63",
        desc: "A high-performance powder metallurgy high-speed steel optimized for extreme toughness and wear resistance.",
        knives: ["Custom Industrial Knives", "High-Performance Work Tools"],
        pros: ["Incredible toughness for a HSS", "Very high wear resistance"],
        cons: ["Non-stainless", "Difficult to source"],
        use_case: "Heavy-duty work tools where impact resistance and edge life are critical."
    },

    // --- OTHERS ---
    {
        id: 'zapp-1', name: "LC200N / Cronidur 30", producer: "Zapp", C: 0.3, Cr: 15.0, V: 0, Mo: 0.95, W: 0, Co: 0, edge: 5, toughness: 9, corrosion: 10, sharpen: 7,
        ht_curve: "150:58,200:57,250:56",
        desc: "A nitrogen-based alloy that is virtually rust-proof. Used by NASA for ball bearings and by Spyderco for sea knives.",
        knives: ["Spyderco SpydieChef", "Spyderco Salt 2 (LC200N)", "Quiet Carry Waypoint"],
        pros: ["Total rust immunity", "Incredible toughness", "Takes a very fine edge"],
        cons: ["Average edge retention", "Not as hard as high-carbon alloys"],
        use_case: "Salt-water environments, food prep, and sweat-heavy carry."
    },

    // --- GERMAN / EUROPEAN KITCHEN STEELS ---
    {
        id: 'german-1', name: "X50CrMoV15", producer: "Various",
        C: 0.5, Cr: 15.0, V: 0.1, Mo: 0.8, W: 0, Co: 0,
        edge: 3.5, toughness: 9, corrosion: 9, sharpen: 10,
        ht_curve: "150:56,200:55,250:54",
        desc: "The classic German kitchen steel. Extremely tough, forgiving, and easy to sharpen.",
        knives: ["Wüsthof Classic", "Zwilling Pro", "Victorinox Fibrox"],
        pros: ["Extremely tough", "Rust-resistant", "Beginner friendly"],
        cons: ["Poor edge retention", "Soft by enthusiast standards"],
        use_case: "Professional kitchens, high-impact food prep, Western chef knives."
    },
    {
        id: 'german-2', name: "X55CrMoV14", producer: "Various",
        C: 0.55, Cr: 14.5, V: 0.1, Mo: 0.7, W: 0, Co: 0,
        edge: 4, toughness: 8.5, corrosion: 8.5, sharpen: 9,
        ht_curve: "150:57,200:56,250:55",
        desc: "A slightly harder evolution of X50CrMoV15 used in mid-range European chef knives.",
        knives: ["Mercer Culinary", "F. Dick", "Burgvogel"],
        pros: ["Good toughness", "Easy maintenance"],
        cons: ["Still soft vs Japanese steels"],
        use_case: "Commercial kitchen chef knives."
    },

    // --- Hitachi ---
    {
        id: 'hitachi-3', name: "Shirogami #1 (White 1)", producer: "Hitachi",
        C: 1.35, Cr: 0.0, V: 0.0, Mo: 0.0, W: 0.0, Co: 0,
        edge: 9, toughness: 5, corrosion: 0, sharpen: 10,
        ht_curve: "150:65,200:64,250:62",
        desc: "Ultra-pure carbon steel with no alloying elements. The sharpest-feeling steel available.",
        knives: ["Sakai Takayuki", "Masamoto", "Custom Japanese Gyuto"],
        pros: ["Unmatched sharpness", "Extremely easy to sharpen"],
        cons: ["Instant rusting", "Low edge retention"],
        use_case: "Traditional Japanese chef knives and sushi blades."
    },
    {
        id: 'hitachi-4', name: "Shirogami #2 (White 2)", producer: "Hitachi",
        C: 1.05, Cr: 0.0, V: 0.0, Mo: 0.0, W: 0.0, Co: 0,
        edge: 8, toughness: 6, corrosion: 0, sharpen: 10,
        ht_curve: "150:63,200:61,250:60",
        desc: "More forgiving than White #1 with slightly better toughness.",
        knives: ["Tojiro White Steel", "Yoshihiro"],
        pros: ["Very sharp", "Forgiving heat treatment"],
        cons: ["Reactive", "Needs frequent care"],
        use_case: "Entry to high-end Japanese carbon knives."
    },
    {
        id: 'hitachi-5', name: "Aogami #2 (Blue 2)", producer: "Hitachi",
        C: 1.1, Cr: 0.5, V: 0.25, Mo: 0, W: 1.5, Co: 0,
        edge: 8.5, toughness: 6.5, corrosion: 0,
        sharpen: 9,
        ht_curve: "150:64,200:62,250:61",
        desc: "A more wear-resistant version of White steel using tungsten.",
        knives: ["Masakage", "Anryu", "Kurosaki"],
        pros: ["Better edge retention than White", "Still easy to sharpen"],
        cons: ["Reactive", "Requires patina management"],
        use_case: "High-end Japanese chef knives."
    },
    // --- AMERICAN CARBON ---
    {
        id: 'carbon-1', name: "52100", producer: "Various",
        C: 1.0, Cr: 1.5, V: 0.0, Mo: 0.0, W: 0.0, Co: 0,
        edge: 7.5, toughness: 8, corrosion: 1, sharpen: 9,
        ht_curve: "150:62,200:61,250:60",
        desc: "A legendary ball-bearing steel with outstanding toughness and edge stability.",
        knives: ["Custom Hunters", "Kitchen Customs"],
        pros: ["Excellent toughness", "Very fine grain"],
        cons: ["Rust-prone"],
        use_case: "Custom chef knives and outdoor blades."
    },

    // --- BUDGET / MODERN STAINLESS ---
    {
        id: 'budget-1', name: "Nitro-V", producer: "New Jersey Steel Baron",
        C: 0.68, Cr: 13.0, V: 0.1, Mo: 0.1, W: 0, Co: 0,
        edge: 5, toughness: 8, corrosion: 9, sharpen: 8,
        ht_curve: "150:60,200:59,250:58",
        desc: "An evolution of AEB-L with nitrogen for improved corrosion resistance.",
        knives: ["CIVIVI", "Custom Budget Knives"],
        pros: ["Tough", "Rust resistant", "Easy to sharpen"],
        cons: ["Not a wear monster"],
        use_case: "Value-focused EDC and kitchen knives."
    },
    {
        id: 'others-1', name: "RWL34", producer: "Damasteel", C: 1.05, Cr: 14.0, V: 0.2, Mo: 4.0, W: 0, Co: 0, edge: 6, toughness: 5, corrosion: 8, sharpen: 7,
        ht_curve: "200:59,400:57,510:59",
        desc: "Representing 'Rickard W. Le收ff', this is the powder metallurgy version of ATS-34. Famous for its purity and finishability.",
        knives: ["Grimsmo Norseman", "Custom European Folders"],
        pros: ["Exceptional polish capability", "Very consistent", "Easy to sharpen"],
        cons: ["Outdated edge retention vs modern super-steels"],
        use_case: "High-end custom and art knives."
    },
    {
        id: 'others-2', name: "DS93X", producer: "Damasteel", C: 1.05, Cr: 14.0, V: 0.2, Mo: 4.0, W: 0, Co: 0, edge: 7, toughness: 5, corrosion: 8, sharpen: 6,
        ht_curve: "200:59,400:57,510:59",
        desc: "A combination of RWL34 and PMC27, this is the premier stainless Damascus steel in the world.",
        knives: ["Grimsmo Norseman (Damascus)", "Custom Grail Knives"],
        pros: ["Stunning visual patterns", "High performance for a Damascus steel", "Fully stainless"],
        cons: ["Extremely expensive", "Difficult to etch correctly"],
        use_case: "High-end luxury and gallery-grade knives."
    },
    {
        id: 'others-3', name: "AUS10A", producer: "Aichi", C: 1.05, Cr: 14.0, V: 0.2, Mo: 0.3, W: 0, Co: 0, edge: 6, toughness: 4, corrosion: 8, sharpen: 7,
        ht_curve: "150:60,200:59,300:57",
        desc: "A high-carbon Japanese stainless steel that is a direct competitor to 440C and VG-10.",
        knives: ["Cold Steel AD15", "Cold Steel Recon 1 (Older)", "Demko AD20.5 (AUS10)"],
        pros: ["Very easy to sharpen", "Good corrosion resistance", "Inexpensive"],
        cons: ["Lacks the edge life of PM steels"],
        use_case: "Budget to mid-range hard-use knives."
    },
    {
        id: 'others-4', name: "CROMOVA 18", producer: "Yoshikin", C: 0.8, Cr: 18.0, V: 0.1, Mo: 0.6, W: 0, Co: 0, edge: 4.5, toughness: 6, corrosion: 9, sharpen: 8.5,
        ht_curve: "150:58,200:57,300:55",
        desc: "Proprietary steel used by Global Knives. Balanced for professional kitchen use.",
        knives: ["Global G-2 Chef Knife"],
        pros: ["Extreme rust resistance", "Very easy to hone", "Durable handle integration"],
        cons: ["Relatively soft edge"],
        use_case: "High-volume professional kitchens."
    },
    {
        id: 'others-5', name: "Lam. CoS", producer: "Takefu", C: 1.1, Cr: 16.0, V: 0.3, Mo: 1.5, W: 0, Co: 2.5, edge: 8, toughness: 6, corrosion: 8, sharpen: 5,
        ht_curve: "150:60,200:59,300:57",
        desc: "Laminated Cobalt Steel. Used primarily by Fallkniven for their high-end survival knives.",
        knives: ["Fallkniven F1 Pro", "Fallkniven A1 Pro"],
        pros: ["Extremely strong due to lamination", "Excellent edge retention", "Very tough"],
        cons: ["Difficult to sharpen due to hardness core"],
        use_case: "Premium survival and hunting knives."
    },
    {
        id: 'others-6', name: "A2", producer: "Various", C: 1.0, Cr: 5.0, V: 0.5, Mo: 1.1, W: 0, Co: 0, edge: 5, toughness: 8, corrosion: 2, sharpen: 8,
        ht_curve: "200:58,400:56,500:60",
        desc: "A classic air-hardening tool steel known for its incredible toughness and ease of sharpening.",
        knives: ["Bark River Bravo 1 (A2)", "Chris Reeve (Vintage)"],
        pros: ["Very high impact resistance", "Easy to field-sharpen", "Stable edge"],
        cons: ["Low corrosion resistance"],
        use_case: "Outdoor knives and heavy-duty survival tools."
    },
    {
        id: 'others-7', name: "YXR7", producer: "Hitachi", C: 0.8, Cr: 5.0, V: 1.0, Mo: 3.0, W: 0, Co: 0, edge: 9, toughness: 8, corrosion: 1, sharpen: 2,
        ht_curve: "500:65,540:67,600:63",
        desc: "A high-performance Matrix High Speed Steel used by Rockstead for its extreme hardness and toughness.",
        knives: ["Rockstead Higo II", "Rockstead Shin"],
        pros: ["Extreme hardness (65+ HRC)", "Incredible toughness for its hardness", "Mirror-finishable"],
        cons: ["Carbon steel (will rust)", "Brutal to sharpen manually"],
        use_case: "Luxury high-performance folders."
    }
];
