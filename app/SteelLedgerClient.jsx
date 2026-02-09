'use client'

// Import removed
// Import removed

// Import components
import Sidebar from '../src/components/Sidebar.jsx';
import SearchView from '../src/components/SearchView.jsx';
import PerformanceMatrix from '../src/components/PerformanceMatrix.jsx';
import KnifeLibrary from '../src/components/KnifeLibrary.jsx';
import CompareView from '../src/components/CompareView.jsx';
import SteelDetailModal from '../src/components/SteelDetailModal.jsx';
import KnifeDetailModal from '../src/components/KnifeDetailModal.jsx';
import HomeView from '../src/components/HomeView.jsx';
import ProfileView from '../src/components/ProfileView.jsx';
import EducationView from '../src/components/EducationView.jsx';
import ProLabView from '../src/components/ProLabView.jsx';
import AIAnalystPanel from '../src/components/AIAnalystPanel.jsx';
import SettingsModal from '../src/components/SettingsModal.jsx';
import ImportModal from '../src/components/ImportModal.jsx';
import SteelRecommender from '../src/components/SteelRecommender.jsx';
import { UserProvider } from '../src/context/UserContext.jsx';
import { NavigationProvider, useNavigation } from '../src/context/NavigationContext.jsx';
import MobileBottomNav from '../src/components/MobileBottomNav.jsx';
import CommandPalette from '../src/components/CommandPalette.jsx';
import { hapticFeedback } from '../src/hooks/useMobile';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default function SteelLedgerClient({ initialSteels, initialKnives, initialGlossary, initialFaq, initialProducers, dbError }) {
    return (
        <UserProvider>
            <NavigationProvider>
                <AppContent
                    initialSteels={initialSteels}
                    initialKnives={initialKnives}
                    initialGlossary={initialGlossary}
                    initialFaq={initialFaq}
                    initialProducers={initialProducers}
                    dbError={dbError}
                />
            </NavigationProvider>
        </UserProvider>
    );
}

function AppContent({ initialSteels, initialKnives, initialGlossary, initialFaq, initialProducers, dbError }) {
    const { currentState, navigate } = useNavigation();
    const [steels, setSteels] = useState(initialSteels);
    const [showDbBanner, setShowDbBanner] = useState(dbError);
    const [search, setSearch] = useState("");
    const [knifeSearch, setKnifeSearch] = useState("");
    const [compareList, setCompareList] = useState([]);
    const [filters, setFilters] = useState({ minC: 0, minCr: 0, minV: 0 });
    const [activeProducer, setActiveProducer] = useState("ALL");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Get current navigation state
    const view = currentState.view || 'HOME';
    const detailSteelId = currentState.detailSteel;
    const detailKnifeId = currentState.detailKnife;

    // Resolve the actual steel and knife objects from IDs
    const detailSteel = detailSteelId ? steels.find(s => s.id === detailSteelId || s.name === detailSteelId) : null;
    const detailKnife = detailKnifeId ? initialKnives.find(k => k.id === detailKnifeId || k.name === detailKnifeId) : null;

    // AI State
    const [apiKey, setApiKey] = useState("");
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiOpen, setAiOpen] = useState(false);
    const [aiQuery, setAiQuery] = useState("");
    const [aiChat, setAiChat] = useState([]);
    const [aiModel, setAiModel] = useState("gemini-1.5-flash");
    const [showSettings, setShowSettings] = useState(false);
    const [showAiComingSoon, setShowAiComingSoon] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [showRecommender, setShowRecommender] = useState(false);
    const [trendingScores, setTrendingScores] = useState({});

    const fileInputRef = useRef(null);

    const producers = ["ALL", ...new Set(steels.map(s => s.producer))];

    // Trending Logic
    const incrementTrending = (steelId) => {
        if (!steelId) return;
        const newScores = { ...trendingScores, [steelId]: (trendingScores[steelId] || 0) + 1 };
        setTrendingScores(newScores);
        localStorage.setItem('metalcore_trending_scores', JSON.stringify(newScores));
    };

    const trendingList = useMemo(() => {
        // Return top 4 steels by score
        return steels
            .map(s => ({ ...s, score: trendingScores[s.id] || 0 }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 4)
            .filter(s => s.score > 0);
    }, [steels, trendingScores]);

    // Initialize localStorage values on mount (client-side only)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setApiKey(localStorage.getItem('metalcore_gemini_key') || "");
            setAiModel(localStorage.getItem('metalcore_gemini_model') || "gemini-1.5-flash");

            const savedScores = localStorage.getItem('metalcore_trending_scores');
            if (savedScores) {
                try {
                    setTrendingScores(JSON.parse(savedScores));
                } catch (e) {
                    console.error("Failed to parse trending scores");
                }
            }
        }
    }, []);

    // Hydrate compareList from URL steels param (shareable links)
    useEffect(() => {
        if (!currentState.compareSteels || compareList.length > 0) return;
        const steelNames = currentState.compareSteels
            .split(',')
            .map(name => decodeURIComponent(name.trim()))
            .filter(Boolean)
            .slice(0, 4);
        const resolved = [];
        for (const name of steelNames) {
            const found = steels.find(s =>
                s.name.toLowerCase() === name.toLowerCase() || s.id === name
            );
            if (found && !resolved.find(r => r.id === found.id)) {
                resolved.push(found);
            }
        }
        if (resolved.length > 0) setCompareList(resolved);
    }, [currentState.compareSteels, steels]);

    // Keep URL in sync when on compare view
    useEffect(() => {
        if (view !== 'COMPARE' || compareList.length === 0) return;
        const steelNames = compareList.map(s => encodeURIComponent(s.name)).join(',');
        if (currentState.compareSteels !== steelNames) {
            navigate({ compareSteels: steelNames }, true);
        }
    }, [view, compareList]);

    // Scroll to top when switching views on mobile (body is the scroll container)
    useEffect(() => {
        if (typeof window !== 'undefined' && window.innerWidth < 769) {
            window.scrollTo(0, 0);
        }
    }, [view]);

    const handleImportClick = () => setShowImportModal(true);

    const handleManualImport = (data) => {
        setSteels(prev => [...prev, data]);
    };

    const openSteelModal = (steelName) => {
        // Fuzzy match steel name
        const found = steels.find(s =>
            s.name.toLowerCase() === steelName.toLowerCase() ||
            s.name.toLowerCase().includes(steelName.toLowerCase()) ||
            steelName.toLowerCase().includes(s.name.toLowerCase())
        );
        if (found) {
            navigate({ detailSteel: found.id || found.name, detailKnife: null });
            incrementTrending(found.id);
        } else {
            console.warn("Steel not found:", steelName);
        }
    };

    const openKnifeModal = (knifeName) => {
        // Find knife by name (exact or partial)
        const found = initialKnives.find(k =>
            k.name.toLowerCase() === knifeName.toLowerCase() ||
            knifeName.toLowerCase().includes(k.name.toLowerCase())
        );
        if (found) {
            navigate({ detailKnife: found.id || found.name, detailSteel: null });
        }
    };

    const setView = (newView) => {
        navigate({ view: newView, detailSteel: null, detailKnife: null });
    };

    const setDetailSteel = (steel) => {
        if (steel) {
            navigate({ detailSteel: steel.id || steel.name });
        } else {
            navigate({ detailSteel: null });
        }
    };

    const setDetailKnife = (knife) => {
        if (knife) {
            navigate({ detailKnife: knife.id || knife.name });
        } else {
            navigate({ detailKnife: null });
        }
    };

    const askAi = async (query = aiQuery) => {
        if (!apiKey) {
            setShowAiComingSoon(true);
            return;
        }
        if (!query.trim()) return;

        setIsAiLoading(true);
        const userMsg = { role: 'user', content: query };
        setAiChat(prev => [...prev, userMsg]);
        setAiQuery("");

        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: aiModel });

            const systemPrompt = `You are the MetalCore AI Analyst. Expert in metallurgy and iconic knives. Your name is Ferry.
Database: ${steels.map(s => `${s.name} (${s.producer}): C:${s.C}, Cr:${s.Cr}, V:${s.V}, Edge:${s.edge}, Toughness:${s.toughness}`).join(' | ')}
Knives: ${initialKnives.map(k => `${k.name} by ${k.maker}: Steels: ${k.steels.join(', ')}`).join(' | ')}
If recommending steels, trigger comparison with this exact JSON on a new line:
COMMAND: {"action": "compare", "steels": ["ExactName1", "ExactName2"]}
Be concise and premium.`;

            const result = await model.generateContent([systemPrompt, ...aiChat.map(m => m.content), query]);
            const responseText = result.response.text();

            // Parse commands
            const commandMatch = responseText.match(/COMMAND: ({.*})/);
            if (commandMatch) {
                try {
                    const cmd = JSON.parse(commandMatch[1]);
                    if (cmd.action === 'compare' && cmd.steels) {
                        const toCompare = steels.filter(s => cmd.steels.includes(s.name));
                        if (toCompare.length > 0) {
                            setCompareList(toCompare);
                            navigate({ view: 'COMPARE' });
                        }
                    }
                } catch (e) { console.error("AI Command Parse Error", e); }
            }

            setAiChat(prev => [...prev, { role: 'assistant', content: responseText.replace(/COMMAND: {.*}/, "") }]);
        } catch (err) {
            setAiChat(prev => [...prev, { role: 'assistant', content: "Error: " + err.message }]);
        } finally {
            setIsAiLoading(false);
        }
    };

    const generateReport = async () => {
        if (!apiKey) { setShowAiComingSoon(true); return; }
        if (compareList.length === 0) return;

        setIsAiLoading(true);
        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: aiModel });

            const list = compareList.map(s => JSON.stringify(s)).join('\n');
            const prompt = `Act as a senior metallurgist. Generate a professional "Comparative Performance Report" for these steels:\n${list}\nDetailed trade-offs, carbide structure analysis (based on alloy), and recommended deployment. Use clean Markdown.`;

            const result = await model.generateContent(prompt);
            setAiChat(prev => [...prev, { role: 'assistant', content: result.response.text(), isReport: true }]);
            setAiOpen(true);
        } catch (err) {
            alert("Report Error: " + err.message);
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const ws = wb.Sheets[wb.SheetNames[0]];
                const data = XLSX.utils.sheet_to_json(ws);
                const formatted = data.map((row, idx) => {
                    const getVal = (key) => {
                        const k = Object.keys(row).find(k => k.toLowerCase() === key.toLowerCase());
                        return k ? row[k] : undefined;
                    };
                    return {
                        id: 'imported-' + Date.now() + idx,
                        name: getVal('Grade') || getVal('Name') || `Unknown ${idx + 1}`,
                        producer: getVal('Producer') || "Unknown",
                        C: parseFloat(getVal('C') || 0),
                        Cr: parseFloat(getVal('Cr') || 0),
                        V: parseFloat(getVal('V') || 0),
                        Mo: parseFloat(getVal('Mo') || 0),
                        W: parseFloat(getVal('W') || 0),
                        Co: parseFloat(getVal('Co') || 0),
                        edge: parseFloat(getVal('Edge') || 5),
                        toughness: parseFloat(getVal('Toughness') || 5),
                        corrosion: parseFloat(getVal('Corrosion') || 5),
                        sharpen: parseFloat(getVal('Sharpen') || 5),
                        ht_curve: getVal('ht_curve') || "",
                        desc: "Custom imported grade.",
                        knives: []
                    };
                });
                setSteels(prev => [...prev, ...formatted]);
            } catch (err) { console.error(err); }
        };
        reader.readAsBinaryString(file);
    };

    const filteredSteels = useMemo(() => {
        const normalize = (str) => str.toLowerCase().replace(/[\s-]/g, '');
        const normalizedSearch = search ? normalize(search) : '';

        return steels.filter(s => {
            const matchesSearch = !search ||
                normalize(s.name).includes(normalizedSearch) ||
                normalize(s.producer).includes(normalizedSearch);
            const matchesFilters = s.C >= filters.minC && s.Cr >= filters.minCr && s.V >= filters.minV;
            const matchesProducer = activeProducer === "ALL" || s.producer === activeProducer;
            return matchesSearch && matchesFilters && matchesProducer;
        });
    }, [steels, search, filters, activeProducer]);

    const toggleCompare = (steel, e) => {
        if (e) e.stopPropagation();
        let newList;
        if (compareList.find(i => i.id === steel.id)) {
            newList = compareList.filter(i => i.id !== steel.id);
        } else if (compareList.length < 4) {
            newList = [...compareList, steel];
        } else {
            return;
        }
        setCompareList(newList);
    };

    const clearCompare = () => {
        setCompareList([]);
        if (view === 'COMPARE') {
            navigate({ compareSteels: null }, true);
        }
    };

    // Filter knives based on search query AND grade library filters (producer, alloy content)
    const filteredKnives = useMemo(() => {
        const normalize = (val) => {
            if (!val) return "";
            return val.toLowerCase()
                .replace(/cpm[- ]?/, "")
                .replace(/böhler |bohler /, "")
                .replace(/sandvik |alleima |alleima-/, "")
                .replace(/[ \-]/g, "")
                .trim();
        };

        const searchLower = knifeSearch.toLowerCase().trim();

        return initialKnives.filter(k => {
            // First apply search filter
            let matchesSearch = !knifeSearch;
            if (knifeSearch) {
                if (k.name.toLowerCase().includes(searchLower)) matchesSearch = true;
                else if (k.maker.toLowerCase().includes(searchLower)) matchesSearch = true;
                else if (k.category.toLowerCase().includes(searchLower)) matchesSearch = true;
                else if (k.description.toLowerCase().includes(searchLower)) matchesSearch = true;
                else if (k.whySpecial.toLowerCase().includes(searchLower)) matchesSearch = true;
                else if (k.steels.some(steelName => {
                    const normalizedSteel = normalize(steelName);
                    const normalizedSearch = normalize(searchLower);
                    return steelName.toLowerCase().includes(searchLower) ||
                        normalizedSteel.includes(normalizedSearch) ||
                        normalizedSearch.includes(normalizedSteel);
                })) matchesSearch = true;
            }

            if (!matchesSearch) return false;

            // Now apply grade library filters (producer and alloy content)
            // A knife passes if ANY of its steel variants match the filters
            const hasMatchingSteel = k.steels.some(steelName => {
                const steel = steels.find(s =>
                    normalize(s.name) === normalize(steelName) ||
                    s.name.toLowerCase() === steelName.toLowerCase()
                );

                if (!steel) return false; // Steel not found in database

                // Check producer filter
                const matchesProducer = activeProducer === "ALL" || steel.producer === activeProducer;

                // Check alloy content filters
                const matchesFilters = steel.C >= filters.minC &&
                    steel.Cr >= filters.minCr &&
                    steel.V >= filters.minV;

                return matchesProducer && matchesFilters;
            });

            return hasMatchingSteel;
        });
    }, [knifeSearch, steels, activeProducer, filters]);

    const resetFilters = () => {
        setFilters({ minC: 0, minCr: 0, minV: 0 });
        setActiveProducer("ALL");
    };

    // Command Palette state
    const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

    // Cmd+K / Ctrl+K keyboard shortcut for Command Palette
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setCommandPaletteOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleCommandNavigate = useCallback((viewId) => {
        hapticFeedback('medium');
        setView(viewId);
    }, []);

    const handleCommandOpenSteel = useCallback((steel) => {
        navigate({ detailSteel: steel.id || steel.name, detailKnife: null });
        incrementTrending(steel.id);
    }, [navigate, incrementTrending]);

    const handleCommandOpenKnife = useCallback((knife) => {
        navigate({ detailKnife: knife.id || knife.name, detailSteel: null });
    }, [navigate]);

    const handleCommandAction = useCallback((actionId) => {
        if (actionId === 'ai') setAiOpen(true);
        else if (actionId === 'settings') setShowAiComingSoon(true);
    }, []);

    return (
        <div className="flex app-shell font-sans bg-black relative">
            {/* Database Unavailable Banner */}
            {showDbBanner && (
                <div className="fixed top-safe-0 left-0 right-0 z-50 flex items-center justify-between gap-3 bg-amber-950 border-b border-amber-700 px-4 py-2.5">
                    <div className="flex items-center gap-2.5 text-amber-400 text-sm">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                            <path d="M12 9v4m0 4h.01" />
                            <circle cx="12" cy="12" r="10" />
                        </svg>
                        <span>Database is currently unavailable — data will appear once the connection is restored.</span>
                    </div>
                    <button
                        onClick={() => setShowDbBanner(false)}
                        className="text-amber-500 hover:text-amber-300 shrink-0"
                        aria-label="Dismiss"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Command Palette */}
            <CommandPalette
                isOpen={commandPaletteOpen}
                onClose={() => setCommandPaletteOpen(false)}
                steels={steels}
                knives={initialKnives}
                onNavigate={handleCommandNavigate}
                onOpenSteel={handleCommandOpenSteel}
                onOpenKnife={handleCommandOpenKnife}
                onAction={handleCommandAction}
            />

            {/* Detail Modal */}
            {detailSteel && (
                <SteelDetailModal
                    steel={detailSteel}
                    onClose={() => navigate({ detailSteel: null })}
                    onOpenKnife={openKnifeModal}
                />
            )}

            {detailKnife && (
                <KnifeDetailModal
                    knife={detailKnife}
                    onClose={() => navigate({ detailKnife: null })}
                    onOpenSteel={openSteelModal}
                />
            )}

            {/* Mobile Filters Button - Only show on views with filters */}
            {(view === 'SEARCH' || view === 'KNIVES' || view === 'MATRIX') && (
                <button
                    onClick={() => { hapticFeedback('medium'); setMobileMenuOpen(!mobileMenuOpen); }}
                    className="fixed top-safe-4 right-4 z-50 md:hidden p-3 bg-accent rounded-xl shadow-lg shadow-accent/20 text-black"
                    aria-label={mobileMenuOpen ? "Close filters" : "Open filters"}
                >
                    {mobileMenuOpen ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                        </svg>
                    )}
                </button>
            )}

            {/* Sidebar */}
            <Sidebar
                activeProducer={activeProducer}
                setActiveProducer={setActiveProducer}
                filters={filters}
                setFilters={setFilters}
                steels={steels}
                view={view}
                setView={setView}
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
                producers={producers}
                handleImportClick={handleImportClick}
                fileInputRef={fileInputRef}
                handleFileUpload={handleFileUpload}
                setShowSettings={setShowSettings}
                aiOpen={aiOpen}
                setAiOpen={setAiOpen}
                setSearch={setSearch}
                trending={trendingList}
                resetFilters={resetFilters}
            />

            {/* Main Content with View Transitions */}
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={view}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                        duration: 0.15,
                        ease: [0.22, 1, 0.36, 1]
                    }}
                    className="flex-1 md:overflow-hidden"
                >
                    {view === 'HOME' && (
                        <HomeView
                            setView={setView}
                            steels={steels}
                            setDetailSteel={setDetailSteel}
                            search={search}
                            setSearch={setSearch}
                            compareList={compareList}
                            toggleCompare={toggleCompare}
                            producers={producers}
                            incrementTrending={incrementTrending}
                            resetFilters={resetFilters}
                            setShowRecommender={setShowRecommender}
                        />
                    )}

                    {view === 'SEARCH' && (
                        <SearchView
                            search={search}
                            setSearch={setSearch}
                            filteredSteels={filteredSteels}
                            compareList={compareList}
                            toggleCompare={toggleCompare}
                            clearCompare={clearCompare}
                            setDetailSteel={setDetailSteel}
                            setView={setView}
                            resetFilters={resetFilters}
                        />
                    )}

                    {view === 'MATRIX' && (
                        <PerformanceMatrix
                            steels={filteredSteels}
                            setDetailSteel={setDetailSteel}
                            activeProducer={activeProducer}
                            setActiveProducer={setActiveProducer}
                            producers={producers}
                        />
                    )}

                    {view === 'KNIVES' && (
                        <KnifeLibrary
                            knives={filteredKnives}
                            steels={steels}
                            setDetailSteel={setDetailSteel}
                            setDetailKnife={setDetailKnife}
                            knifeSearch={knifeSearch}
                            setKnifeSearch={setKnifeSearch}
                        />
                    )}

                    {view === 'COMPARE' && (
                        <CompareView
                            items={compareList}
                            setView={setView}
                            toggleCompare={toggleCompare}
                            clearCompare={clearCompare}
                            generateReport={generateReport}
                            isAiLoading={isAiLoading}
                        />
                    )}

                    {view === 'PROFILE' && (
                        <ProfileView
                            steels={steels}
                            setDetailSteel={setDetailSteel}
                            setView={setView}
                        />
                    )}

                    {view === 'EDUCATION' && (
                        <EducationView
                            glossary={initialGlossary}
                            faq={initialFaq}
                            producers={initialProducers}
                        />
                    )}

                    {view === 'PRO_LAB' && (
                        <ProLabView steels={steels} />
                    )}
                </motion.div>
            </AnimatePresence>

            {/* AI Analyst Panel */}
            <AIAnalystPanel
                aiOpen={aiOpen}
                setAiOpen={setAiOpen}
                aiChat={aiChat}
                isAiLoading={isAiLoading}
                aiQuery={aiQuery}
                setAiQuery={setAiQuery}
                askAi={askAi}
            />

            {/* AI Coming Soon Modal */}
            {showAiComingSoon && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl transition-all" onClick={() => setShowAiComingSoon(false)}>
                    <div className="glass-panel w-full md:max-w-lg p-8 rounded-[2rem] border border-white/10 shadow-2xl relative" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-2.5">
                                <div className="p-1.5 bg-white/5 rounded-lg">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                </div>
                                <h3 className="font-display font-black text-white uppercase tracking-tighter italic text-sm md:text-base">AI Assistant</h3>
                            </div>
                            <button onClick={() => setShowAiComingSoon(false)} className="p-2 hover:bg-white/5 rounded-full text-slate-500 transition-all">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex flex-col items-center text-center py-4 space-y-4">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent">
                                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <h4 className="font-display font-black text-white uppercase tracking-tighter italic text-base md:text-lg">AI Model Still Being Forged</h4>
                            <p className="text-[10px] md:text-xs text-slate-400 leading-relaxed font-medium max-w-xs">Our AI assistant is currently in the furnace. This feature will be available soon.</p>
                        </div>

                        <button onClick={() => setShowAiComingSoon(false)} className="w-full py-4 mt-4 bg-white text-black font-black uppercase tracking-[0.2em] rounded-xl text-xs md:text-sm hover:bg-accent transition-all shadow-xl active:scale-[0.98]">Got It</button>
                    </div>
                </div>
            )}

            {/* Steel Recommender Wizard */}
            {showRecommender && (
                <SteelRecommender
                    steels={steels}
                    onClose={() => setShowRecommender(false)}
                    onSelectSteel={(steel) => {
                        setShowRecommender(false);
                        setDetailSteel(steel);
                        incrementTrending(steel.id);
                    }}
                />
            )}

            {/* Import Modal */}
            {showImportModal && (
                <ImportModal
                    onClose={() => setShowImportModal(false)}
                    onManualImport={handleManualImport}
                    onFileUpload={handleFileUpload}
                />
            )}

            {/* Mobile Bottom Navigation */}
            <MobileBottomNav view={view} setView={setView} setAiOpen={setAiOpen} />
        </div>
    );
}
