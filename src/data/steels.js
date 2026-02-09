// METALCORE - PREMIUM STEEL DATASET
// This file contains the core metallurgy data for the application.

export const PREMIUM_STEELS = [
    // --- AICHI ---
    {
        id: 'aichi-1', name: "AUS-8", producer: "Aichi",
        C: 0.75, Cr: 14.5, V: 0.2, Mo: 0.5, W: 0, Co: 0,
        edge: 4.5, toughness: 6, corrosion: 7, sharpen: 8,
        ht_curve: "150:58,200:57,300:55",
        desc: "One of the most widely used Japanese stainless steels. A balanced budget steel that defined the mid-range knife market for decades alongside 8Cr13MoV.",
        knives: ["Cold Steel (older models)", "SOG (various)", "Ontario Rat 1 (AUS-8)"],
        pros: ["Easy to sharpen", "Good corrosion resistance", "Affordable"],
        cons: ["Low edge retention", "Outperformed by modern budget steels like 14C28N"],
        use_case: "Budget production knives and utility cutlery."
    },
    {
        id: 'others-3', name: "AUS10A", producer: "Aichi", C: 1.05, Cr: 14.0, V: 0.2, Mo: 0.3, W: 0, Co: 0, edge: 6, toughness: 5, corrosion: 8, sharpen: 7,
        ht_curve: "150:60,200:59,300:57",
        desc: "A high-carbon Japanese stainless steel that is a direct competitor to 440C and VG-10.",
        knives: ["Cold Steel AD15", "Cold Steel Recon 1 (Older)", "Demko AD20.5 (AUS10)"],
        pros: ["Very easy to sharpen", "Good corrosion resistance", "Inexpensive"],
        cons: ["Lacks the edge life of PM steels"],
        use_case: "Budget to mid-range hard-use knives."
    },

    // --- ALLEIMA ---
    {
        id: 'alleima-2', name: "12C27", producer: "Alleima", C: 0.6, Cr: 13.5, V: 0, Mo: 0, W: 0, Co: 0, edge: 3, toughness: 8, corrosion: 8, sharpen: 9,
        ht_curve: "150:56,200:55,250:54",
        desc: "The classic Swedish stainless steel. Pure and consistent, it has been used for decades in millions of knives.",
        knives: ["Morakniv Companion", "Opinel No. 8 (Stainless)", "Victorinox (similar)"],
        pros: ["Very easy to sharpen", "High toughness", "Extremely consistent quality"],
        cons: ["Low edge retention", "Needs frequent stropping"],
        use_case: "Standard utility knives, kitchen tools, and outdoor beaters."
    },
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
        id: 'alleima-4', name: "19C27", producer: "Alleima",
        C: 0.95, Cr: 13.5, V: 0, Mo: 0, W: 0, Co: 0,
        edge: 5, toughness: 7, corrosion: 7.5, sharpen: 8,
        ht_curve: "150:59,200:58,250:57",
        desc: "A razor-blade stainless steel from Alleima (formerly Sandvik). Higher carbon than 12C27 for better wear resistance while maintaining ease of sharpening.",
        knives: ["High-end razors", "Custom thin-grind kitchen knives", "Mora Garberg (stainless)"],
        pros: ["Fine grain structure", "Easy to sharpen", "Good stainlessness"],
        cons: ["Moderate edge retention", "Not a super-steel"],
        use_case: "Thin-grind kitchen knives and premium razor blades."
    },
    {
        id: 'alleima-3', name: "SPY27", producer: "Alleima", C: 0.22, Cr: 27, V: 0, Mo: 1.5, W: 0, Co: 0, edge: 5, toughness: 7, corrosion: 10, sharpen: 8,
        ht_curve: "150:58,200:57,250:56",
        desc: "Spyderco's proprietary super-stainless with 27% chromium. Built for absolute corrosion immunity in any environment.",
        knives: ["Spyderco Salt", "Spyderco Salt 2", "Spyderco Yojana"],
        pros: ["Virtually rust-proof in any conditions", "Very tough", "Easy to maintain"],
        cons: ["Modest edge retention", "Not a performance steel for cutting"],
        use_case: "Marine, food-service, and sweat-heavy environments where corrosion is non-negotiable."
    },

    // --- BÖHLER ---
    {
        id: 'bohler-8', name: "K110", producer: "Böhler",
        C: 1.55, Cr: 11.3, V: 0.75, Mo: 0.75, W: 0, Co: 0,
        edge: 7, toughness: 5, corrosion: 3, sharpen: 5,
        ht_curve: "200:60,500:62,600:59",
        desc: "Böhler's equivalent to D2 tool steel. Extremely popular with European knifemakers for its availability, consistency, and proven performance.",
        knives: ["European production knives", "Custom fixed blades", "Budget tool-steel folders"],
        pros: ["Consistent quality from Böhler", "Good edge retention", "Well-understood heat treatment"],
        cons: ["Semi-stainless at best", "Moderate toughness"],
        use_case: "Production and custom knives where reliable D2-class performance is needed."
    },
    {
        id: 'bohler-7', name: "K340 Isodur", producer: "Böhler",
        C: 1.1, Cr: 8.3, V: 2.5, Mo: 2.1, W: 0, Co: 0,
        edge: 7.5, toughness: 8, corrosion: 3, sharpen: 5,
        ht_curve: "200:60,500:62,600:59",
        desc: "A PM cold-work tool steel with an excellent combination of toughness and wear resistance. Marketed as a superior alternative to D2 with PM consistency.",
        knives: ["European custom knives", "Heavy-duty production fixed blades", "LionSteel (various)"],
        pros: ["Excellent toughness for a high-wear steel", "Better than D2 in almost every way", "Good edge stability"],
        cons: ["Not stainless", "Requires coating for outdoor use"],
        use_case: "Hard-use fixed blades where D2-class performance with better toughness is desired."
    },
    {
        id: 'bohler-2', name: "K390", producer: "Böhler", C: 2.47, Cr: 4.2, V: 9.0, Mo: 3.8, W: 1.0, Co: 2.0, edge: 10, toughness: 6, corrosion: 2, sharpen: 2,
        ht_curve: "500:62,540:64,600:61",
        desc: "High-alloy cold work tool steel with extreme wear resistance and high compressive strength.",
        knives: ["Spyderco Police 4 Lightweight", "Spyderco Endela K390", "Spyderco Delica 4"],
        pros: ["Workhorse edge retention", "Surprising toughness for wear resistance", "Aggressive cutting performance"],
        cons: ["Low corrosion resistance (patinas)", "Difficult to sharpen"],
        use_case: "Hard-use daily carries and workspace knives that trade stainlessness for raw performance."
    },
    {
        id: 'bohler-6', name: "M340", producer: "Böhler", C: 1.05, Cr: 15.0, V: 0.6, Mo: 1.0, W: 0, Co: 0, edge: 7, toughness: 5, corrosion: 8, sharpen: 6,
        ht_curve: "200:60,400:58,500:59",
        desc: "A popular mid-range powder stainless from Böhler. Balances edge retention and corrosion resistance well for production knives.",
        knives: ["Spyderco (older models)", "European production folders"],
        pros: ["Good balance of performance and workability", "Decent corrosion resistance", "Takes a good edge"],
        cons: ["Outperformed by super-steels", "Not exceptional in any single area"],
        use_case: "Mid-range production folders and everyday carry."
    },
    {
        id: 'bohler-1', name: "M390", producer: "Böhler", C: 1.9, Cr: 20.0, V: 4.0, Mo: 1.0, W: 0.6, Co: 0, edge: 9.5, toughness: 4, corrosion: 9.5, sharpen: 3,
        ht_curve: "200:60,400:58,500:59,600:56",
        desc: "Third-generation powder metallurgy stainless steel. Widely considered the gold standard for high-end folders.",
        knives: ["Benchmade Bugout (Limited)", "Microtech Ultratech", "GiantMouse ACE Riv"],
        pros: ["Exceptional corrosion resistance", "Elite edge retention", "High finishability"],
        cons: ["Relatively difficult to sharpen", "Moderate toughness"],
        use_case: "Premium EDC folders and gentleman's knives where edge retention is prioritized."
    },
    {
        id: 'bohler-4', name: "M398", producer: "Böhler", C: 2.7, Cr: 20.0, V: 7.2, Mo: 1.0, W: 0.7, Co: 0, edge: 10, toughness: 3, corrosion: 9, sharpen: 1,
        ht_curve: "200:61,400:59,500:60",
        desc: "An evolution of M390 with significantly higher carbon and vanadium for extreme edge retention.",
        knives: ["Shirogorov F3NS (M398)", "Custom configurations"],
        pros: ["Unmatched industrial edge retention", "Good corrosion resistance"],
        cons: ["Extreme sharpening difficulty", "Fragile at low angles"],
        use_case: "Luxury 'safe queen' folders or high-performance enthusiasts who enjoy technical sharpening."
    },
    {
        id: 'bohler-9', name: "N680", producer: "Böhler",
        C: 0.54, Cr: 17.3, V: 0.1, Mo: 1.1, W: 0, Co: 0,
        edge: 4, toughness: 7, corrosion: 9, sharpen: 8,
        ht_curve: "150:57,200:56,250:55",
        desc: "A nitrogen-alloyed stainless designed for marine and diving applications. Lower carbon than N690 but with superior corrosion resistance.",
        knives: ["Extrema Ratio (dive models)", "European diving knives"],
        pros: ["Outstanding rust resistance", "Good toughness", "Easy to maintain"],
        cons: ["Low edge retention", "Soft by enthusiast standards"],
        use_case: "Diving knives, marine environments, and food-service where rust immunity is critical."
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
        id: 'bohler-5', name: "N95", producer: "Böhler", C: 0.8, Cr: 14.5, V: 0.2, Mo: 1.4, W: 0, Co: 0, edge: 5, toughness: 6, corrosion: 8, sharpen: 7,
        ht_curve: "150:58,200:57,250:56",
        desc: "A mid-tier nitrogen-alloyed stainless from Böhler. A step up from budget steels with solid corrosion resistance and easy maintenance.",
        knives: ["Budget European folders", "Entry-level production knives"],
        pros: ["Good corrosion resistance for the price", "Easy to sharpen", "Consistent quality"],
        cons: ["Not a performance steel", "Average edge retention"],
        use_case: "Entry to mid-range production knives where reliability matters more than peak performance."
    },
    {
        id: 'bohler-11', name: "S390 Microclean", producer: "Böhler",
        C: 1.64, Cr: 4.8, V: 5.0, Mo: 2.0, W: 10.5, Co: 8.0,
        edge: 10, toughness: 5, corrosion: 1, sharpen: 2,
        ht_curve: "500:66,540:68,580:64",
        desc: "Böhler's flagship PM high-speed steel. Increasingly popular with custom knifemakers for its combination of extreme edge retention and surprisingly usable toughness.",
        knives: ["Custom high-performance folders", "European custom fixed blades", "Shirogorov (select models)"],
        pros: ["Outstanding edge retention", "Better toughness than expected for its alloy", "Microclean PM consistency"],
        cons: ["Non-stainless", "Difficult to sharpen", "Expensive"],
        use_case: "Premium custom knives and high-performance cutting tools."
    },
    {
        id: 'bohler-10', name: "W360", producer: "Böhler",
        C: 0.50, Cr: 4.5, V: 0.55, Mo: 3.0, W: 0, Co: 0,
        edge: 4, toughness: 10, corrosion: 2, sharpen: 7,
        ht_curve: "200:54,400:52,500:56",
        desc: "A hot-work tool steel with exceptional toughness and thermal stability. Used by custom makers for the toughest possible large blades and choppers.",
        knives: ["Custom choppers", "Large camp knives", "Custom swords"],
        pros: ["Nearly unbreakable", "Excellent thermal stability", "Great for large blades"],
        cons: ["Low edge retention", "Non-stainless", "Not a performance steel for small knives"],
        use_case: "Large choppers, camp swords, and extreme-toughness applications."
    },

    // --- CARPENTER ---
    {
        id: 'others-10', name: "420HC", producer: "Carpenter", C: 0.42, Cr: 13.5, V: 0.02, Mo: 0.3, W: 0, Co: 0, edge: 4, toughness: 7, corrosion: 8, sharpen: 9,
        ht_curve: "150:56,200:55,250:54",
        desc: "Buck Knives signature steel — a high-carbon 420 stainless with proprietary heat treatment. The workhorse of American production knives for decades.",
        knives: ["Buck 119", "Buck 110", "Buck Bantam", "Buck Lites"],
        pros: ["Very tough and forgiving", "Great corrosion resistance", "Trivially easy to sharpen"],
        cons: ["Low edge retention", "Soft by enthusiast standards"],
        use_case: "Reliable everyday production knives and rugged outdoor tools."
    },
    {
        id: 'carpenter-5', name: "BD1N", producer: "Carpenter",
        C: 0.68, Cr: 15.0, V: 0.0, Mo: 0.30, W: 0, Co: 0,
        edge: 5, toughness: 7, corrosion: 9, sharpen: 8,
        ht_curve: "150:59,200:58,250:57",
        desc: "A nitrogen-enhanced budget stainless steel. Used by Spyderco as a significant step up from traditional budget steels with excellent corrosion resistance.",
        knives: ["Spyderco Tenacious (newer)", "Spyderco Persistence", "Budget Spyderco models"],
        pros: ["Good corrosion resistance", "Easy to sharpen", "Consistent quality"],
        cons: ["Average edge retention", "Not a performance steel"],
        use_case: "Budget to mid-range production knives."
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

    // --- CRUCIBLE ---
    {
        id: 'crucible-14', name: "CPM 10V", producer: "Crucible",
        C: 2.45, Cr: 5.25, V: 9.75, Mo: 1.30, W: 0, Co: 0,
        edge: 10, toughness: 4, corrosion: 2, sharpen: 1,
        ht_curve: "200:61,500:63,600:60",
        desc: "An extreme wear-resistance PM tool steel with massive vanadium content. The non-stainless counterpart to S110V in sheer edge longevity.",
        knives: ["Spyderco Mule Team", "Custom extreme-use blades", "Bark River (special runs)"],
        pros: ["Extraordinary edge retention", "Massive carbide volume for abrasion resistance"],
        cons: ["Very low corrosion resistance", "Extremely difficult to sharpen", "Low toughness"],
        use_case: "Abrasive cutting tasks like cardboard, rope, and industrial materials."
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
    {
        id: 'crucible-12', name: "CPM 15V", producer: "Crucible", C: 1.45, Cr: 5.0, V: 15.0, Mo: 4.0, W: 0, Co: 0, edge: 9, toughness: 4, corrosion: 4, sharpen: 3,
        ht_curve: "200:65,400:60,600:62",
        desc: "An extremely wear-resistant high-vanadium powder steel designed for maximum edge retention. Popular for heavy-duty and slicer blades where long lasting sharpness matters.",
        knives: ["Chris Reeve Sebenza (special runs)", "Busse Combat Razel", "Custom Hard-Use Folders"],
        pros: ["Outstanding edge retention", "Great for demanding cutting tasks", "Excellent wear resistance"],
        cons: ["Difficult to sharpen", "More challenging to polish than lower-V steels", "Lower corrosion resistance"],
        use_case: "Heavy-duty fixed blades and folders where extreme edge durability is the priority; less ideal if polish and ease of sharpening are key."
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
        id: 'crucible-3', name: "CPM 3V", producer: "Crucible", C: 0.8, Cr: 7.5, V: 2.75, Mo: 1.3, W: 0, Co: 0, edge: 4, toughness: 10, corrosion: 3, sharpen: 6,
        ht_curve: "200:58,400:60,500:62",
        desc: "The gold standard for extreme-toughness outdoor knives. Virtually unbreakable with reasonable wear resistance.",
        knives: ["Bark River Bravo 1", "Cold Steel SRK (3V)", "Demko AD20.5 (3V Variant)"],
        pros: ["World-class impact resistance", "Excellent edge stability", "Decent wear resistance for tough steel"],
        cons: ["Low corrosion resistance", "Requires coating for hard use"],
        use_case: "Bushcraft knives, choppers, and hard-use survival tools."
    },
    {
        id: 'crucible-13', name: "CPM 4V", producer: "Crucible",
        C: 1.35, Cr: 5.25, V: 3.75, Mo: 2.75, W: 0, Co: 0,
        edge: 6, toughness: 9.5, corrosion: 2, sharpen: 5,
        ht_curve: "200:58,400:60,500:62",
        desc: "A PM tool steel designed for extreme toughness with better wear resistance than 3V. Rapidly becoming the preferred tough-steel for hard-use fixed blades.",
        knives: ["Bark River (various)", "Bradford Guardian 4V", "Spyderco Shaman (4V sprint)"],
        pros: ["Outstanding toughness", "Better wear resistance than 3V", "Excellent edge stability under impact"],
        cons: ["Not stainless", "Requires maintenance or coating"],
        use_case: "Hard-use bushcraft, camp knives, and heavy choppers."
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
        id: 'crucible-6', name: "CPM M4", producer: "Crucible", C: 1.42, Cr: 4.0, V: 4.0, Mo: 5.25, W: 5.5, Co: 0, edge: 8.5, toughness: 7, corrosion: 1, sharpen: 4,
        ht_curve: "500:62,540:64,600:61",
        desc: "A legendary high-speed steel known for winning cutting competitions due to its incredible edge stability.",
        knives: ["Benchmade Bailout", "Spyderco Gayle Bradley 2", "Benchmade Freek"],
        pros: ["Elite edge retention for a non-stainless steel", "Very high toughness", "Incredible edge stability"],
        cons: ["Extremely prone to rust", "Requires constant oiling or coating"],
        use_case: "Performance-first cutting tools and heavy-duty folders."
    },
    {
        id: 'crucible-16', name: "CPM Rex 121", producer: "Crucible",
        C: 3.40, Cr: 4.0, V: 9.5, Mo: 5.0, W: 10.0, Co: 9.0,
        edge: 10, toughness: 2, corrosion: 1, sharpen: 1,
        ht_curve: "500:69,540:71,580:67",
        desc: "The absolute king of wear resistance in the CPM Rex lineup. With 3.4% carbon and massive carbide formers, this steel has almost unfathomable edge-holding ability.",
        knives: ["Spyderco Mule Team Rex 121", "Custom specialists"],
        pros: ["Unmatched edge retention among all steels", "Can reach 71+ HRC", "Extreme abrasion resistance"],
        cons: ["Incredibly brittle", "Cannot be sharpened without diamond", "Rusts immediately"],
        use_case: "The ultimate steel for edge retention enthusiasts who want the most extreme alloy available."
    },
    {
        id: 'crucible-15', name: "CPM Rex 76", producer: "Crucible",
        C: 1.50, Cr: 3.75, V: 3.1, Mo: 5.25, W: 10.0, Co: 9.0,
        edge: 9.5, toughness: 5, corrosion: 1, sharpen: 2,
        ht_curve: "500:66,540:68,580:64",
        desc: "A super high-speed steel with extreme cobalt and tungsten. Designed for the most demanding cutting applications at elevated temperatures.",
        knives: ["Custom extreme-performance knives", "Industrial tooling"],
        pros: ["Extreme hot-hardness", "Very high wear resistance", "Excellent red hardness"],
        cons: ["Non-stainless", "Extremely hard to sharpen", "Brittle at thin geometries"],
        use_case: "Industrial cutting and custom performance knives where hot-hardness matters."
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
        id: 'crucible-10', name: "CPM S35VN", producer: "Crucible", C: 1.45, Cr: 14.0, V: 3.0, Mo: 2.0, W: 0, Co: 0, edge: 7.5, toughness: 6, corrosion: 8, sharpen: 5,
        ht_curve: "200:59,400:58,500:56",
        desc: "The industry standard for premium knives. An upgrade to S30V with added Niobium for better toughness.",
        knives: ["Chris Reeve Sebenza (S35VN)", "ESEE 6 S35VN", "White River Firecraft 4"],
        pros: ["Excellent all-around balance", "Very tough for a stainless steel", "Easier to sharpen than S90V"],
        cons: ["Increasingly seen as 'entry-level' premium"],
        use_case: "The gold standard for high-end folders and fixed blades."
    },
    {
        id: 'crucible-5', name: "CPM S45VN", producer: "Crucible", C: 1.48, Cr: 16.0, V: 3.0, Mo: 2.0, W: 0, Co: 0, edge: 7.5, toughness: 6, corrosion: 8, sharpen: 5,
        ht_curve: "200:60,400:58,500:59",
        desc: "An improvement over S35VN, adding more Chromium and Niobium for better corrosion resistance and toughness.",
        knives: ["Chris Reeve Inkosi", "Spyderco Para 3", "Benchmade 940 (Modern)"],
        pros: ["Great all-around balance", "Solid corrosion resistance", "Well-understood heat treatment"],
        cons: ["Outclassed in specific areas by specialized steels", "Moderate sharpening effort"],
        use_case: "High-end production folders and daily carry knives."
    },
    {
        id: 'crucible-17', name: "CPM S60V", producer: "Crucible",
        C: 2.15, Cr: 17.0, V: 5.75, Mo: 0.40, W: 0.40, Co: 0,
        edge: 9, toughness: 3, corrosion: 8, sharpen: 2,
        ht_curve: "200:59,400:57,500:56",
        desc: "The predecessor to S90V, originally sold as CPM 440V. A high-vanadium stainless that paved the way for today's super-steels. Still offers excellent wear resistance.",
        knives: ["Spyderco (vintage sprint runs)", "Benchmade (older models)", "Custom folders"],
        pros: ["Very high edge retention", "Good corrosion resistance", "Historical significance"],
        cons: ["Low toughness", "Very difficult to sharpen", "Largely superseded by S90V"],
        use_case: "Collectors and enthusiasts who appreciate the lineage of modern super-steels."
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
        id: 'crucible-1', name: "MagnaCut", producer: "Crucible", C: 1.15, Cr: 10.7, V: 4.0, Mo: 2.0, W: 0, Co: 0, edge: 8, toughness: 7, corrosion: 9.5, sharpen: 6,
        ht_curve: "175:61,225:62,300:60,400:58",
        desc: "Revolutionary stainless steel designed specifically for knives. Offers unrivaled balance of toughness and corrosion resistance.",
        knives: ["Chris Reeve Sebenza 31", "Tactile Rockwall", "Hogue Deka"],
        pros: ["Stainless perfection", "High toughness (replaces 4V/3V)", "Great edge retention"],
        cons: ["Still relatively new (premium price)", "Requires precise salt-bath HT"],
        use_case: "The ultimate choice for salt-water folders, high-end EDC, and kitchen knives."
    },

    // --- DAMASTEEL ---
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
        id: 'others-1', name: "RWL34", producer: "Damasteel", C: 1.05, Cr: 14.0, V: 0.2, Mo: 4.0, W: 0, Co: 0, edge: 6, toughness: 5, corrosion: 8, sharpen: 7,
        ht_curve: "200:59,400:57,510:59",
        desc: "Representing 'Rickard W. Le收ff', this is the powder metallurgy version of ATS-34. Famous for its purity and finishability.",
        knives: ["Grimsmo Norseman", "Custom European Folders"],
        pros: ["Exceptional polish capability", "Very consistent", "Easy to sharpen"],
        cons: ["Outdated edge retention vs modern super-steels"],
        use_case: "High-end custom and art knives."
    },

    // --- ERASTEEL ---
    {
        id: 'erasteel-3', name: "ASP 2003", producer: "Erasteel", C: 1.28, Cr: 4.0, V: 3.1, Mo: 5.0, W: 6.4, Co: 0, edge: 8.5, toughness: 8, corrosion: 1, sharpen: 3,
        ht_curve: "500:64,540:66,580:63",
        desc: "A high-performance powder metallurgy high-speed steel optimized for extreme toughness and wear resistance.",
        knives: ["Custom Industrial Knives", "High-Performance Work Tools"],
        pros: ["Incredible toughness for a HSS", "Very high wear resistance"],
        cons: ["Non-stainless", "Difficult to source"],
        use_case: "Heavy-duty work tools where impact resistance and edge life are critical."
    },
    {
        id: 'erasteel-5', name: "ASP 2015", producer: "Erasteel",
        C: 1.55, Cr: 4.2, V: 3.1, Mo: 5.0, W: 6.4, Co: 5.0,
        edge: 9, toughness: 7, corrosion: 1, sharpen: 3,
        ht_curve: "500:65,540:67,580:63",
        desc: "A mid-cobalt PM high-speed steel bridging the gap between ASP 2003 and ASP 2030. Better hot-hardness than cobalt-free variants while maintaining reasonable toughness.",
        knives: ["Custom high-performance knives", "Precision cutting tools"],
        pros: ["Good toughness-to-wear balance", "Better hot-hardness than ASP 2003", "Fine PM carbide structure"],
        cons: ["Non-stainless", "Limited knife-world availability"],
        use_case: "High-performance tools and custom knives where balanced HSS performance is desired."
    },
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
        id: 'erasteel-6', name: "ASP 2052", producer: "Erasteel",
        C: 1.60, Cr: 4.8, V: 5.0, Mo: 2.0, W: 0, Co: 8.0,
        edge: 9.5, toughness: 5, corrosion: 1, sharpen: 2,
        ht_curve: "500:66,540:68,580:64",
        desc: "A unique tungsten-free ASP grade relying on vanadium, molybdenum, and cobalt for performance. Interesting alternative in the ASP lineup for specific wear applications.",
        knives: ["Industrial applications", "Specialty custom tools"],
        pros: ["High wear resistance", "Good hot-hardness", "Tungsten-free PM composition"],
        cons: ["Non-stainless", "Rare in knife applications"],
        use_case: "Specialty industrial cutting tools and custom knives."
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
        id: 'erasteel-4', name: "ASP 2080", producer: "Erasteel",
        C: 2.30, Cr: 4.0, V: 6.5, Mo: 7.0, W: 6.5, Co: 10.5,
        edge: 10, toughness: 4, corrosion: 1, sharpen: 1,
        ht_curve: "500:68,540:70,580:66",
        desc: "One of the most heavily alloyed ASP grades. Ultra-high carbon with massive cobalt for extreme hot-hardness. A favorite among cutting competition enthusiasts and industrial toolmakers.",
        knives: ["Custom competition cutters", "Industrial cutting specialists"],
        pros: ["Can reach 70 HRC", "Extreme hot-hardness retention", "Unmatched wear resistance in the ASP range"],
        cons: ["Virtually no corrosion resistance", "Nearly impossible to hand-sharpen", "Very brittle at thin edges"],
        use_case: "Industrial cutting, competition knives, and abrasive-material specialists."
    },

    // --- HITACHI ---
    {
        id: 'hitachi-6', name: "Aogami #1 (Blue 1)", producer: "Hitachi", C: 1.2, Cr: 0.5, V: 0.25, Mo: 0, W: 2, Co: 0, edge: 9, toughness: 5.5, corrosion: 0, sharpen: 8.5,
        ht_curve: "150:65,200:63,250:62",
        desc: "The hardest and most wear-resistant of Hitachi's traditional carbon steels. Higher carbon and tungsten than Blue 2 make it the performance king of Japanese carbons.",
        knives: ["Tanaka", "Misono UX10", "Premium Japanese Gyuto"],
        pros: ["Outstanding edge retention for a carbon steel", "Razor-sharp capability", "Excellent in thin grinds"],
        cons: ["Very reactive (instant rust)", "Fragile at thin edges", "Demands skilled heat treatment"],
        use_case: "High-end Japanese chef knives where edge retention and sharpness are the priority."
    },
    {
        id: 'hitachi-5', name: "Aogami #2 (Blue 2)", producer: "Hitachi",
        C: 1.1, Cr: 0.5, V: 0.25, Mo: 0, W: 1.5, Co: 0,
        edge: 7, toughness: 6.5, corrosion: 0,
        sharpen: 9,
        ht_curve: "150:64,200:62,250:61",
        desc: "A more wear-resistant version of White steel using tungsten.",
        knives: ["Masakage", "Anryu", "Kurosaki"],
        pros: ["Better edge retention than White", "Still easy to sharpen"],
        cons: ["Reactive", "Requires patina management"],
        use_case: "High-end Japanese chef knives."
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
        id: 'hitachi-11', name: "ATS-34", producer: "Hitachi",
        C: 1.05, Cr: 14.0, V: 0, Mo: 4.0, W: 0, Co: 0,
        edge: 6, toughness: 5, corrosion: 7, sharpen: 7,
        ht_curve: "200:60,400:58,500:59",
        desc: "The steel that defined premium knives in the 1990s. A high-molybdenum stainless that set the benchmark before powder metallurgy steels took over. Still respected today.",
        knives: ["Benchmade (vintage)", "Spyderco (vintage)", "Custom knives (1990s era)"],
        pros: ["Takes a fine edge", "Good corrosion resistance", "Well-understood heat treatment"],
        cons: ["Outperformed by modern PM steels", "Can develop micro-pitting"],
        use_case: "Legacy knife applications. Still solid for custom makers on a budget."
    },
    {
        id: 'hitachi-8', name: "HAP40", producer: "Hitachi",
        C: 1.27, Cr: 4.2, V: 3.0, Mo: 5.0, W: 6.1, Co: 8.0,
        edge: 9, toughness: 6, corrosion: 1, sharpen: 3,
        ht_curve: "500:65,540:67,580:63",
        desc: "Hitachi's PM high-speed steel. Used by select Japanese kitchen knife makers for exceptional edge retention and refined grain structure at high hardness.",
        knives: ["Takamura R2/HAP40", "Some premium Japanese gyutos"],
        pros: ["Excellent edge retention", "Fine grain structure", "Good toughness for a HSS"],
        cons: ["Non-stainless", "Requires careful maintenance", "Difficult to sharpen"],
        use_case: "Premium Japanese kitchen knives where HSS-level edge life is desired."
    },
    {
        id: 'hitachi-9', name: "HAP72", producer: "Hitachi",
        C: 1.85, Cr: 4.2, V: 5.0, Mo: 6.0, W: 9.0, Co: 10.0,
        edge: 10, toughness: 4, corrosion: 1, sharpen: 1,
        ht_curve: "500:68,540:70,580:66",
        desc: "Hitachi's most extreme PM high-speed steel. Massive alloy content with 10% cobalt for the ultimate in hot-hardness and wear resistance.",
        knives: ["Ultra-premium Japanese custom knives", "Industrial cutting"],
        pros: ["Can reach 70 HRC", "Extreme wear resistance", "Incredible hot-hardness"],
        cons: ["Very brittle", "Nearly impossible to sharpen without diamonds", "Rusts instantly"],
        use_case: "Industrial applications and extreme-performance custom knives."
    },
    {
        id: 'hitachi-3', name: "Shirogami #1 (White 1)", producer: "Hitachi",
        C: 1.35, Cr: 0.0, V: 0.0, Mo: 0.0, W: 0.0, Co: 0,
        edge: 6, toughness: 5, corrosion: 0, sharpen: 10,
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
        edge: 5, toughness: 6, corrosion: 0, sharpen: 10,
        ht_curve: "150:63,200:61,250:60",
        desc: "More forgiving than White #1 with slightly better toughness.",
        knives: ["Tojiro White Steel", "Yoshihiro"],
        pros: ["Very sharp", "Forgiving heat treatment"],
        cons: ["Reactive", "Needs frequent care"],
        use_case: "Entry to high-end Japanese carbon knives."
    },
    {
        id: 'hitachi-7', name: "Shirogami #3 (White 3)", producer: "Hitachi", C: 0.85, Cr: 0, V: 0, Mo: 0, W: 0, Co: 0, edge: 5, toughness: 7, corrosion: 0, sharpen: 10,
        ht_curve: "150:62,200:60,250:58",
        desc: "The softest and most forgiving of Hitachi's white steels. Easiest to heat treat and sharpen, making it the ideal entry point into Japanese carbon.",
        knives: ["Budget Japanese carbon knives", "Tojiro Carbon", "Entry-level santoku"],
        pros: ["Extremely forgiving heat treatment", "Effortless sharpening", "Great for learning whetstone technique"],
        cons: ["Lowest edge retention of the white steels", "Very reactive"],
        use_case: "Entry-level Japanese carbon knives and budget kitchen blades."
    },
    {
        id: 'hitachi-10', name: "SLD", producer: "Hitachi",
        C: 1.50, Cr: 12.0, V: 0.35, Mo: 1.0, W: 0.3, Co: 0,
        edge: 7, toughness: 5, corrosion: 3, sharpen: 5,
        ht_curve: "200:60,500:62,600:59",
        desc: "Hitachi's D2 equivalent with tighter Japanese tolerances. Widely used in Japanese industrial applications and by some production knifemakers.",
        knives: ["Japanese industrial knives", "Some production fixed blades"],
        pros: ["Consistent Japanese quality", "Good edge retention", "Well-proven in industry"],
        cons: ["Semi-stainless", "Moderate toughness"],
        use_case: "Japanese production knives and industrial cutting where D2-class performance is needed."
    },
    {
        id: 'others-7', name: "YXR7", producer: "Hitachi", C: 0.8, Cr: 5.0, V: 1.0, Mo: 3.0, W: 0, Co: 0, edge: 9, toughness: 8, corrosion: 1, sharpen: 2,
        ht_curve: "500:65,540:67,600:63",
        desc: "A high-performance Matrix High Speed Steel used by Rockstead for its extreme hardness and toughness.",
        knives: ["Rockstead Higo II", "Rockstead Shin"],
        pros: ["Extreme hardness (65+ HRC)", "Incredible toughness for its hardness", "Mirror-finishable"],
        cons: ["Carbon steel (will rust)", "Brutal to sharpen manually"],
        use_case: "Luxury high-performance folders."
    },
    {
        id: 'hitachi-1', name: "ZDP-189", producer: "Hitachi", C: 3.0, Cr: 20.0, V: 0.1, Mo: 1.4, W: 0.6, Co: 0, edge: 10, toughness: 3, corrosion: 6, sharpen: 2,
        ht_curve: "150:66,200:65,300:64",
        desc: "A legendary Japanese super-steel with 3% carbon. It achieved fame for holding a terrifyingly sharp edge longer than almost anything else.",
        knives: ["Spyderco Delica (ZDP-189)", "Rockstead Knives", "Spyderco Endura 4"],
        pros: ["Legendary edge retention", "Can reach extreme hardness (67 HRC)", "Very fine microstructure"],
        cons: ["Low toughness", "Requires diamond stones for sharpening"],
        use_case: "High-performance slicing folders and high-end Japanese cutlery."
    },

    // --- LOHMANN ---
    {
        id: 'lohmann-1', name: "Niolox", producer: "Lohmann",
        C: 0.80, Cr: 12.7, V: 0.1, Mo: 1.1, W: 0, Co: 0,
        edge: 6, toughness: 7, corrosion: 7, sharpen: 7,
        ht_curve: "150:60,200:59,300:58",
        desc: "A German niobium-alloyed stainless steel (1.4153). The niobium forms very fine, evenly distributed carbides for excellent toughness and edge stability. Popular with European makers.",
        knives: ["LionSteel (various)", "Böker Plus", "European production folders"],
        pros: ["Excellent toughness", "Fine carbide structure from niobium", "Good corrosion resistance"],
        cons: ["Moderate edge retention", "Not widely available outside Europe"],
        use_case: "European production folders and fixed blades with a focus on toughness."
    },

    // --- NEW JERSEY STEEL BARON ---
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

    // --- TAKEFU ---
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
        id: 'takefu-1', name: "SG2 / R2", producer: "Takefu", C: 1.35, Cr: 15.0, V: 2.0, Mo: 2.8, W: 0, Co: 0, edge: 9, toughness: 5, corrosion: 7, sharpen: 4,
        ht_curve: "150:62,200:61,300:59",
        desc: "A high-performance powder metallurgy stainless steel favored by Japanese kitchen knife makers for its edge holding.",
        knives: ["Shun Premier", "Miyabi Birchwood", "Kramer by Zwilling"],
        pros: ["Excellent edge retention", "Very stainless for its performance", "Clean, consistent grain structure"],
        cons: ["Moderately difficult to sharpen", "Can be chippy if treated too hard"],
        use_case: "Premium kitchen cutlery and high-end production Japanese knives."
    },
    {
        id: 'takefu-4', name: "SRS13", producer: "Takefu",
        C: 1.30, Cr: 13.0, V: 1.2, Mo: 1.1, W: 1.3, Co: 0,
        edge: 8, toughness: 5, corrosion: 6, sharpen: 5,
        ht_curve: "150:63,200:62,300:60",
        desc: "A high-carbon stainless PM steel from Takefu. Known for reaching extreme hardness while maintaining stainless properties. Growing in popularity with Japanese kitchen knife makers.",
        knives: ["Sukenari", "Some premium Japanese kitchen knives"],
        pros: ["Very high hardness", "Stainless properties", "Good edge retention"],
        cons: ["Can be chippy", "Moderate toughness"],
        use_case: "High-end Japanese kitchen knives where hardness and stainlessness are both important."
    },
    {
        id: 'takefu-5', name: "SRS15", producer: "Takefu",
        C: 1.50, Cr: 14.0, V: 2.0, Mo: 2.6, W: 1.2, Co: 0,
        edge: 9, toughness: 4, corrosion: 6, sharpen: 4,
        ht_curve: "150:64,200:63,300:61",
        desc: "The higher-alloy sibling of SRS13. More vanadium and molybdenum push edge retention further while maintaining reasonable corrosion resistance.",
        knives: ["Premium Japanese kitchen knives", "Custom Japanese folders"],
        pros: ["Excellent edge retention", "Can reach very high hardness", "Reasonable stainlessness"],
        cons: ["Chippy in thin grinds", "Difficult to sharpen"],
        use_case: "Ultra-premium Japanese kitchen knives for professional chefs."
    },
    {
        id: 'takefu-2', name: "VG-10", producer: "Takefu", C: 1.0, Cr: 15.0, V: 0.2, Mo: 1.0, W: 0, Co: 1.5, edge: 6, toughness: 5, corrosion: 8, sharpen: 7,
        ht_curve: "150:60,200:59,300:57",
        desc: "The workforce of Japanese stainless steel. Cobalt-enriched to maintain hardness and offer a good balance of properties.",
        knives: ["Spyderco Delica 4 (Standard)", "Tojiro DP", "Shun Classic"],
        pros: ["Very stainless", "Easy to sharpen", "Good performance for the price"],
        cons: ["Tends to be chippy in thin grinds", "Lower edge retention than PM steels"],
        use_case: "Entry to mid-range premium kitchen and folding knives."
    },
    {
        id: 'takefu-3', name: "VG-MAX", producer: "Takefu", C: 1.1, Cr: 16.0, V: 0.3, Mo: 1.5, W: 0.5, Co: 1.5, edge: 8, toughness: 5, corrosion: 8, sharpen: 6,
        ht_curve: "150:61,200:60,300:58",
        desc: "An upgraded version of VG-10 developed exclusively for Shun Knives. Increased Chromium and Vanadium for better performance.",
        knives: ["Shun Classic Series", "Shun Premier Series"],
        pros: ["Excellent edge retention", "Very stainless", "Aggressive cutting performance"],
        cons: ["Can be chippy", "Exclusive to Shun"],
        use_case: "Premium Japanese kitchen cutlery."
    },

    // --- UDDEHOLM ---
    {
        id: 'uddeholm-5', name: "AEB-L", producer: "Uddeholm",
        C: 0.67, Cr: 13.0, V: 0.0, Mo: 0.0, W: 0.0, Co: 0,
        edge: 5, toughness: 9, corrosion: 8.5, sharpen: 9,
        ht_curve: "150:60,200:59,250:58",
        desc: "Originally a razor blade steel. Famous for fine grain and toughness.",
        knives: ["Custom Kitchen Knives", "Outdoor Fixed Blades"],
        pros: ["Extremely fine edge", "High toughness", "Easy sharpening"],
        cons: ["Moderate edge retention"],
        use_case: "Thin-ground chef knives and slicers."
    },
    {
        id: 'uddeholm-8', name: "Caldie", producer: "Uddeholm",
        C: 0.70, Cr: 5.0, V: 0.5, Mo: 2.3, W: 0, Co: 0,
        edge: 5, toughness: 9.5, corrosion: 2, sharpen: 7,
        ht_curve: "200:56,400:54,500:58",
        desc: "A toughness-optimized PM tool steel. Designed as a modern replacement for S7 and similar shock-resistant grades with better dimensional stability.",
        knives: ["Custom heavy-duty fixed blades", "Impact-resistant tools"],
        pros: ["Exceptional toughness", "Good dimensional stability", "Better than S7 for knives"],
        cons: ["Low edge retention", "Non-stainless"],
        use_case: "Extreme-toughness fixed blades, pry bars, and impact tools."
    },
    {
        id: 'uddeholm-1', name: "Elmax", producer: "Uddeholm", C: 1.7, Cr: 18.0, V: 3.0, Mo: 1.0, W: 0, Co: 0, edge: 8, toughness: 5, corrosion: 8, sharpen: 5,
        ht_curve: "200:60,400:58,500:59",
        desc: "A versatile powder stainless steel balancing high wear resistance with ease of maintenance.",
        knives: ["Zero Tolerance 0562", "Microtech Socom Elite", "TRC Knives South Pole"],
        pros: ["Great all-around balance", "Good toughness for a stainless steel", "High wear resistance"],
        cons: ["Sensitive to heat treatment errors", "Moderate sharpening effort"],
        use_case: "High-end outdoor fixed blades and rugged folding knives."
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
        id: 'uddeholm-9', name: "Sverker 21", producer: "Uddeholm",
        C: 1.55, Cr: 11.8, V: 0.8, Mo: 0.8, W: 0, Co: 0,
        edge: 7, toughness: 5, corrosion: 3, sharpen: 5,
        ht_curve: "200:60,500:62,600:59",
        desc: "Uddeholm's premium D2 equivalent. Consistent Scandinavian quality with well-controlled carbide structure. A favorite with Nordic knifemakers.",
        knives: ["Scandinavian production knives", "Nordic custom fixed blades"],
        pros: ["Consistent quality", "Good edge retention", "Proven heat treatment protocols"],
        cons: ["Semi-stainless", "Moderate toughness"],
        use_case: "Nordic and Scandinavian knives where D2-class performance is desired."
    },
    {
        id: 'uddeholm-10', name: "Unimax", producer: "Uddeholm",
        C: 0.50, Cr: 5.0, V: 0.5, Mo: 2.3, W: 0, Co: 0,
        edge: 4, toughness: 10, corrosion: 2, sharpen: 7,
        ht_curve: "200:54,400:56,500:58",
        desc: "An extreme-toughness hot-work tool steel. Offers the highest toughness in Uddeholm's lineup while maintaining usable hardness for knife applications.",
        knives: ["Custom impact knives", "Heavy-duty choppers", "Pry-bar knives"],
        pros: ["Among the toughest steels available", "Good thermal resistance", "Stable at high impact"],
        cons: ["Low edge retention", "Non-stainless"],
        use_case: "Extreme-toughness applications, large choppers, and tools that must survive severe abuse."
    },
    {
        id: 'uddeholm-7', name: "Vanadis 10", producer: "Uddeholm",
        C: 2.9, Cr: 8.0, V: 9.8, Mo: 1.5, W: 0, Co: 0,
        edge: 10, toughness: 3, corrosion: 2, sharpen: 1,
        ht_curve: "200:62,500:64,600:60",
        desc: "Uddeholm's extreme wear-resistance PM tool steel. With nearly 10% vanadium and 2.9% carbon, it rivals CPM 10V for sheer edge longevity.",
        knives: ["Custom extreme-wear blades", "Industrial cutting applications"],
        pros: ["Extreme edge retention", "Very high compressive strength", "Fine PM structure"],
        cons: ["Very brittle", "Extremely difficult to sharpen", "Low corrosion resistance"],
        use_case: "Industrial cutting and custom knives optimized purely for edge retention."
    },
    {
        id: 'uddeholm-2', name: "Vanadis 4E", producer: "Uddeholm", C: 1.4, Cr: 4.7, V: 3.7, Mo: 3.5, W: 0, Co: 0, edge: 8, toughness: 9, corrosion: 1, sharpen: 4,
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
        id: 'uddeholm-6', name: "Vanax", producer: "Uddeholm", C: 0.36, Cr: 15.5, V: 3.5, Mo: 1.1, W: 0, Co: 0, edge: 8, toughness: 7, corrosion: 10, sharpen: 6,
        ht_curve: "150:60,200:59,250:57",
        desc: "A nitrogen-alloyed stainless steel with exceptional corrosion resistance and good wear resistance.",
        knives: ["Quiet Carry Waypoint", "Quiet Carry Drift", "Custom Saltwater Knives"],
        pros: ["Total rust immunity", "Superior edge retention to LC200N", "Very tough"],
        cons: ["Expensive", "Requires specialized heat treat"],
        use_case: "Marine environments and hard-use EDC where corrosion is a major factor."
    },

    // --- VARIOUS ---
    {
        id: 'carbon-4', name: "1075", producer: "Various", C: 0.75, Cr: 0.1, V: 0, Mo: 0, W: 0, Co: 0, edge: 4, toughness: 9.5, corrosion: 1, sharpen: 9.5,
        ht_curve: "150:57,200:56,250:55",
        desc: "The softest and toughest of the common 10XX carbon steels. Nearly impossible to break and the easiest steel to sharpen.",
        knives: ["Budget machetes", "Condor knives", "Entry-level fixed blades"],
        pros: ["Incredible impact resistance", "Easiest to sharpen", "Very inexpensive"],
        cons: ["Poor edge retention", "Rusts fast", "Soft edge dulls quickly"],
        use_case: "Choppers, machetes, and tools where surviving abuse matters more than holding an edge."
    },
    {
        id: 'carbon-3', name: "1080", producer: "Various", C: 0.8, Cr: 0.1, V: 0, Mo: 0, W: 0, Co: 0, edge: 5, toughness: 9, corrosion: 1, sharpen: 9,
        ht_curve: "150:58,200:57,250:56",
        desc: "The workhorse of bushcraft and survival knives. Exceptional toughness and trivially easy to sharpen with any abrasive.",
        knives: ["Mora 2000", "Condor Hamador", "Many custom bushcraft knives"],
        pros: ["Outstanding toughness", "Dead simple to sharpen", "Cheap and widely available"],
        cons: ["Low corrosion resistance", "Modest edge retention"],
        use_case: "Bushcraft, batoning, and hard-use outdoor blades where toughness is king."
    },
    {
        id: 'carbon-2', name: "1095", producer: "Various", C: 0.95, Cr: 0.03, V: 0, Mo: 0, W: 0, Co: 0, edge: 6, toughness: 8, corrosion: 1, sharpen: 8,
        ht_curve: "150:60,200:59,250:58",
        desc: "The most common high-carbon survival steel. Simple composition, predictable heat treatment, and trivially easy to field-sharpen.",
        knives: ["Ka-Bar", "ESEE 4", "Gerber Bear Grylls", "Morakniv Carbon"],
        pros: ["Extremely easy to sharpen", "Good toughness", "Forgiving heat treatment"],
        cons: ["Rusts quickly without maintenance", "Moderate edge retention"],
        use_case: "Survival knives, camp knives, and anything where field sharpening is part of the routine."
    },
    {
        id: 'others-9', name: "440C", producer: "Various", C: 1, Cr: 16.75, V: 0.07, Mo: 0.75, W: 0, Co: 0, edge: 6, toughness: 4, corrosion: 7, sharpen: 7,
        ht_curve: "200:58,400:56,500:58",
        desc: "A classic high-chromium stainless that dominated the production knife market for decades before super-steels arrived.",
        knives: ["Buck Classic (vintage)", "Gerber (vintage)", "Budget hunting knives"],
        pros: ["Good corrosion resistance", "Decent hardness at 58-60 HRC", "Historically widely available"],
        cons: ["Outperformed by every modern super-steel", "Soft by current standards"],
        use_case: "Legacy knives, vintage collections, and budget production models."
    },
    {
        id: 'carbon-1', name: "52100", producer: "Various",
        C: 1.0, Cr: 1.5, V: 0.0, Mo: 0.0, W: 0.0, Co: 0,
        edge: 6, toughness: 8, corrosion: 1, sharpen: 9,
        ht_curve: "150:62,200:61,250:60",
        desc: "A legendary ball-bearing steel with outstanding toughness and edge stability.",
        knives: ["Custom Hunters", "Kitchen Customs"],
        pros: ["Excellent toughness", "Very fine grain"],
        cons: ["Rust-prone"],
        use_case: "Custom chef knives and outdoor blades."
    },
    {
        id: 'others-12', name: "8Cr13MoV", producer: "Various", C: 0.8, Cr: 13, V: 0.2, Mo: 1, W: 0, Co: 0, edge: 5, toughness: 5, corrosion: 7, sharpen: 7,
        ht_curve: "150:58,200:57,300:56",
        desc: "China's most common knife steel. A direct competitor to AUS-8 that has become the foundation of the budget knife market. Performance varies by the manufacturer's heat treatment.",
        knives: ["CIVIVI (budget lines)", "Ganzo", "Budget kitchen knives"],
        pros: ["Decent performance at the price", "Good corrosion resistance", "Widely available"],
        cons: ["Inconsistent heat treatment across brands", "Not a performance steel"],
        use_case: "Budget EDC knives and affordable kitchen cutlery."
    },
    {
        id: 'others-15', name: "9Cr18MoV", producer: "Various",
        C: 0.95, Cr: 18.0, V: 0.12, Mo: 1.2, W: 0, Co: 0,
        edge: 6, toughness: 4, corrosion: 8, sharpen: 6,
        ht_curve: "150:59,200:58,300:56",
        desc: "China's equivalent to 440C with tighter tolerances. Used in mid-range Chinese production knives and increasingly well heat-treated by top manufacturers.",
        knives: ["WE Knife (older models)", "Kizer (budget lines)", "Chinese production knives"],
        pros: ["Good corrosion resistance", "Decent hardness", "Improving quality with better HT"],
        cons: ["Quality varies by manufacturer", "Outclassed by PM steels"],
        use_case: "Mid-range Chinese production knives."
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
        id: 'others-8', name: "D2", producer: "Various", C: 1.55, Cr: 11.38, V: 0.9, Mo: 0.78, W: 0.27, Co: 0, edge: 7, toughness: 5, corrosion: 3, sharpen: 5,
        ht_curve: "200:60,500:62,600:59",
        desc: "One of the most iconic tool steels in the knife world. Semi-stainless with excellent hardness and strong edge retention. The steel that defined a generation of production knives.",
        knives: ["Buck 119 (D2)", "Benchmade Anthem", "Spyderco Smock", "Zero Tolerance 0747"],
        pros: ["Excellent edge retention", "High hardness capability (60-62 HRC)", "Massive knife selection"],
        cons: ["Not truly stainless — will spot rust", "Can chip at high hardness"],
        use_case: "Hard-use EDC, hunting, and any knife where edge retention outweighs corrosion immunity."
    },
    {
        id: 'toolsteel-6', name: "H13", producer: "Various",
        C: 0.40, Cr: 5.25, V: 1.0, Mo: 1.35, W: 0, Co: 0,
        edge: 3, toughness: 10, corrosion: 3, sharpen: 8,
        ht_curve: "200:48,400:50,600:52",
        desc: "A hot-work die steel originally designed for aluminum extrusion dies. Extraordinary toughness makes it interesting for the most abuse-resistant large blades.",
        knives: ["Custom choppers", "Large camp blades", "Experimental designs"],
        pros: ["Incredible toughness", "Excellent thermal resistance", "Nearly unbreakable"],
        cons: ["Very low hardness for a knife steel", "Poor edge retention", "Not a traditional knife steel"],
        use_case: "Extreme-abuse large blades and experimental knife designs."
    },
    {
        id: 'toolsteel-1', name: "M2", producer: "Various",
        C: 0.85, Cr: 4.15, V: 1.85, Mo: 5.0, W: 6.35, Co: 0,
        edge: 8, toughness: 6, corrosion: 1, sharpen: 3,
        ht_curve: "500:63,540:65,580:62",
        desc: "The classic high-speed steel that defined the HSS category. Still widely used in industrial tooling and increasingly popular with knife enthusiasts for its balanced performance.",
        knives: ["Custom fixed blades", "Industrial knives", "Vintage tool knives"],
        pros: ["Proven track record spanning decades", "Good balance of hardness and toughness", "Widely available and affordable"],
        cons: ["Non-stainless", "Needs maintenance", "Moderate sharpening difficulty"],
        use_case: "General-purpose high-speed cutting tools and custom knives."
    },
    {
        id: 'toolsteel-2', name: "M42", producer: "Various",
        C: 1.10, Cr: 3.75, V: 1.15, Mo: 9.5, W: 1.5, Co: 8.0,
        edge: 9, toughness: 5, corrosion: 1, sharpen: 2,
        ht_curve: "500:67,540:69,580:65",
        desc: "A super high-speed cobalt steel with extreme hardness capability. Can reach 69 HRC while maintaining useful toughness. A step up from M2 in every performance metric.",
        knives: ["Custom performance knives", "Industrial cutting"],
        pros: ["Extreme hardness", "Excellent hot-hardness", "Superior to M2 in wear resistance"],
        cons: ["Very brittle at max hardness", "Rusts easily", "Diamond stones required"],
        use_case: "High-performance cutting where extreme hardness is beneficial."
    },
    {
        id: 'others-11', name: "O1", producer: "Various", C: 0.9, Cr: 0.5, V: 0.1, Mo: 0, W: 1.25, Co: 0, edge: 6, toughness: 7, corrosion: 1, sharpen: 7,
        ht_curve: "200:60,400:62,500:59",
        desc: "A classic oil-hardening tool steel with a long history in cutlery. Prized for fine grain, a keen edge, and predictable heat treatment.",
        knives: ["Ontario Rat 1 (O1)", "Queen knives", "Custom bushcraft knives"],
        pros: ["Takes an extremely keen edge", "Good toughness", "Relatively easy to sharpen"],
        cons: ["Rusts quickly without care", "Moderate edge retention"],
        use_case: "Outdoor fixed blades and custom knives prioritizing sharpness and character over corrosion immunity."
    },
    {
        id: 'toolsteel-3', name: "S7", producer: "Various",
        C: 0.50, Cr: 3.25, V: 0.25, Mo: 1.4, W: 0, Co: 0,
        edge: 3, toughness: 10, corrosion: 2, sharpen: 8,
        ht_curve: "200:54,400:52,500:56",
        desc: "The quintessential shock-resistant tool steel. Designed to withstand repeated heavy impact without chipping or breaking. The gold standard for impact resistance.",
        knives: ["Busse Combat (various)", "Custom impact knives", "Pry tools"],
        pros: ["Nearly unbreakable", "Can withstand extreme impact", "Easy to sharpen"],
        cons: ["Very low edge retention", "Non-stainless", "Soft by knife standards"],
        use_case: "Impact tools, large choppers, pry-bar knives, and breaching tools."
    },
    {
        id: 'carbon-5', name: "SK-5", producer: "Various",
        C: 0.86, Cr: 0.3, V: 0.1, Mo: 0.05, W: 0, Co: 0,
        edge: 6, toughness: 8, corrosion: 1, sharpen: 8,
        ht_curve: "150:58,200:57,250:56",
        desc: "A Japanese industrial carbon steel commonly used in fixed blades and machetes. Similar to 1075 but with slightly higher carbon and tighter tolerances.",
        knives: ["Buck SRK", "Cold Steel fixed blades"],
        pros: ["Very tough", "Easy to sharpen", "Good edge for the hardness"],
        cons: ["Rusts quickly", "Needs maintenance", "Moderate edge retention"],
        use_case: "Fixed blades, survival knives, and outdoor cutting tasks."
    },
    {
        id: 'toolsteel-4', name: "T15", producer: "Various",
        C: 1.55, Cr: 4.75, V: 5.0, Mo: 0.5, W: 12.5, Co: 5.0,
        edge: 9.5, toughness: 4, corrosion: 1, sharpen: 1,
        ht_curve: "500:66,540:68,580:64",
        desc: "A tungsten-based high-speed steel with massive 12.5% tungsten. Known for extreme hot-hardness and abrasion resistance in the most demanding industrial applications.",
        knives: ["Custom extreme-performance knives", "Industrial tooling"],
        pros: ["Extreme hot-hardness", "Incredible abrasion resistance", "Very high hardness potential"],
        cons: ["Very brittle", "Extremely difficult to work", "Rusts rapidly"],
        use_case: "Industrial cutting and custom knives where tungsten HSS properties are desired."
    },
    {
        id: 'toolsteel-5', name: "W2", producer: "Various",
        C: 1.10, Cr: 0.15, V: 0.25, Mo: 0, W: 0, Co: 0,
        edge: 6, toughness: 7, corrosion: 0, sharpen: 9,
        ht_curve: "150:64,200:62,250:60",
        desc: "A classic water-hardening tool steel prized for beautiful hamon lines. The vanadium addition provides finer grain than W1, making it popular with traditional bladesmiths.",
        knives: ["Custom Japanese-style knives", "Traditional American cutlery", "Art knives with hamon"],
        pros: ["Beautiful hamon capability", "Very sharp", "Easy to sharpen", "Fine grain structure"],
        cons: ["Extremely reactive", "Lower edge retention", "Demanding heat treatment (water quench)"],
        use_case: "Traditional bladesmithing and art knives where aesthetics and tradition matter."
    },
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
    {
        id: 'others-14', name: "Z-Tuff PM", producer: "Various",
        C: 0.55, Cr: 8.0, V: 1.0, Mo: 2.0, W: 0, Co: 0,
        edge: 4, toughness: 10, corrosion: 3, sharpen: 7,
        ht_curve: "200:56,500:58,600:55",
        desc: "A PM tool steel designed for maximum toughness. A cleaner, tougher version of S7 with better wear resistance due to powder metallurgy processing.",
        knives: ["Custom choppers", "Extreme-use fixed blades"],
        pros: ["Extreme toughness", "Better than S7 in nearly every metric", "PM consistency"],
        cons: ["Low edge retention", "Non-stainless"],
        use_case: "The toughest fixed blades and impact tools."
    },
    {
        id: 'others-13', name: "Z-Wear PM", producer: "Various",
        C: 1.10, Cr: 7.5, V: 5.0, Mo: 1.6, W: 1.15, Co: 0,
        edge: 8, toughness: 7.5, corrosion: 3, sharpen: 4,
        ht_curve: "200:61,500:63,600:60",
        desc: "A PM tool steel developed for knife applications. Combines the toughness profile of Cru-Wear with additional vanadium for significantly better edge retention.",
        knives: ["Custom high-performance fixed blades", "Spyderco sprint runs"],
        pros: ["Excellent balance of toughness and wear resistance", "Better edge retention than Cru-Wear"],
        cons: ["Non-stainless", "Limited availability"],
        use_case: "Hard-use EDC and fixed blades where both toughness and edge life matter."
    },

    // --- YOSHIKIN ---
    {
        id: 'others-4', name: "CROMOVA 18", producer: "Yoshikin", C: 0.8, Cr: 18.0, V: 0.1, Mo: 0.6, W: 0, Co: 0, edge: 4.5, toughness: 6, corrosion: 9, sharpen: 8.5,
        ht_curve: "150:58,200:57,300:55",
        desc: "Proprietary steel used by Global Knives. Balanced for professional kitchen use.",
        knives: ["Global G-2 Chef Knife"],
        pros: ["Extreme rust resistance", "Very easy to hone", "Durable handle integration"],
        cons: ["Relatively soft edge"],
        use_case: "High-volume professional kitchens."
    },

    // --- ZAPP ---
    {
        id: 'zapp-1', name: "LC200N / Cronidur 30", producer: "Zapp", C: 0.3, Cr: 15.0, V: 0, Mo: 0.95, W: 0, Co: 0, edge: 5, toughness: 9, corrosion: 10, sharpen: 7,
        ht_curve: "150:58,200:57,250:56",
        desc: "A nitrogen-based alloy that is virtually rust-proof. Used by NASA for ball bearings and by Spyderco for sea knives.",
        knives: ["Spyderco SpydieChef", "Spyderco Salt 2 (LC200N)", "Quiet Carry Waypoint"],
        pros: ["Total rust immunity", "Incredible toughness", "Takes a very fine edge"],
        cons: ["Average edge retention", "Not as hard as high-carbon alloys"],
        use_case: "Salt-water environments, food prep, and sweat-heavy carry."
    }
];
