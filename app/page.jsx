'use client'

// Import data
import { PREMIUM_STEELS } from '../src/data/steels.js';
import { POPULAR_KNIVES } from '../src/data/knives.js';

// Import components
import Sidebar from '../src/components/Sidebar.jsx';
import SearchView from '../src/components/SearchView.jsx';
import PerformanceMatrix from '../src/components/PerformanceMatrix.jsx';
import KnifeLibrary from '../src/components/KnifeLibrary.jsx';
import CompareView from '../src/components/CompareView.jsx';
import SteelDetailModal from '../src/components/SteelDetailModal.jsx';
import KnifeDetailModal from '../src/components/KnifeDetailModal.jsx';
import HomeView from '../src/components/HomeView.jsx';
import AIAnalystPanel from '../src/components/AIAnalystPanel.jsx';
import SettingsModal from '../src/components/SettingsModal.jsx';

import { useState, useMemo, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default function SteelLedger() {
    const [steels, setSteels] = useState(PREMIUM_STEELS);
    const [view, setView] = useState('HOME');
    const [search, setSearch] = useState("");
    const [knifeSearch, setKnifeSearch] = useState("");
    const [compareList, setCompareList] = useState([]);
    const [filters, setFilters] = useState({ minC: 0, minCr: 0, minV: 0 });
    const [activeProducer, setActiveProducer] = useState("ALL");
    const [detailSteel, setDetailSteel] = useState(null);
    const [detailKnife, setDetailKnife] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // AI State
    const [apiKey, setApiKey] = useState("");
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiOpen, setAiOpen] = useState(false);
    const [aiQuery, setAiQuery] = useState("");
    const [aiChat, setAiChat] = useState([]);
    const [aiModel, setAiModel] = useState("gemini-1.5-flash");
    const [showSettings, setShowSettings] = useState(false);

    const fileInputRef = useRef(null);

    const producers = ["ALL", ...new Set(steels.map(s => s.producer))];

    // Initialize localStorage values on mount (client-side only)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setApiKey(localStorage.getItem('metalcore_gemini_key') || "");
            setAiModel(localStorage.getItem('metalcore_gemini_model') || "gemini-1.5-flash");
        }
    }, []);

    const handleImportClick = () => fileInputRef.current.click();

    const openSteelModal = (steelName) => {
        // Fuzzy match steel name
        const found = steels.find(s =>
            s.name.toLowerCase() === steelName.toLowerCase() ||
            s.name.toLowerCase().includes(steelName.toLowerCase()) ||
            steelName.toLowerCase().includes(s.name.toLowerCase())
        );
        if (found) {
            setDetailKnife(null); // Close knife modal if open
            setDetailSteel(found);
        } else {
            console.warn("Steel not found:", steelName);
        }
    };

    const openKnifeModal = (knifeName) => {
        // Find knife by name (exact or partial)
        const found = POPULAR_KNIVES.find(k =>
            k.name.toLowerCase() === knifeName.toLowerCase() ||
            knifeName.toLowerCase().includes(k.name.toLowerCase())
        );
        if (found) {
            setDetailSteel(null); // Close steel modal if open
            setDetailKnife(found);
        }
    };

    const askAi = async (query = aiQuery) => {
        if (!apiKey) {
            setShowSettings(true);
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
Knives: ${POPULAR_KNIVES.map(k => `${k.name} by ${k.maker}: Steels: ${k.steels.join(', ')}`).join(' | ')}
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
                            setView('COMPARE');
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
        if (!apiKey) { setShowSettings(true); return; }
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
        return steels.filter(s =>
            s.name.toLowerCase().includes(search.toLowerCase()) &&
            s.C >= filters.minC && s.Cr >= filters.minCr && s.V >= filters.minV &&
            (activeProducer === "ALL" || s.producer === activeProducer)
        );
    }, [steels, search, filters, activeProducer]);

    const toggleCompare = (steel, e) => {
        if (e) e.stopPropagation();
        if (compareList.find(i => i.id === steel.id)) {
            setCompareList(compareList.filter(i => i.id !== steel.id));
        } else if (compareList.length < 4) {
            setCompareList([...compareList, steel]);
        }
    };

    const clearCompare = () => setCompareList([]);

    // Filter knives based on search query across all fields (name, maker, category, steels, etc.)
    const filteredKnives = useMemo(() => {
        if (!knifeSearch) {
            return POPULAR_KNIVES;
        }

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

        return POPULAR_KNIVES.filter(k => {
            // Search in name
            if (k.name.toLowerCase().includes(searchLower)) return true;
            // Search in maker/producer
            if (k.maker.toLowerCase().includes(searchLower)) return true;
            // Search in category
            if (k.category.toLowerCase().includes(searchLower)) return true;
            // Search in description
            if (k.description.toLowerCase().includes(searchLower)) return true;
            // Search in whySpecial
            if (k.whySpecial.toLowerCase().includes(searchLower)) return true;
            // Search in steel grades
            const matchesSteel = k.steels.some(steelName => {
                const normalizedSteel = normalize(steelName);
                const normalizedSearch = normalize(searchLower);
                return steelName.toLowerCase().includes(searchLower) || 
                       normalizedSteel.includes(normalizedSearch) ||
                       normalizedSearch.includes(normalizedSteel);
            });
            if (matchesSteel) return true;

            return false;
        });
    }, [knifeSearch]);

    return (
        <div className="flex h-screen overflow-hidden font-sans bg-black relative">
            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Detail Modal */}
            {detailSteel && (
                <SteelDetailModal
                    steel={detailSteel}
                    onClose={() => setDetailSteel(null)}
                    onOpenKnife={openKnifeModal}
                />
            )}

            {detailKnife && (
                <KnifeDetailModal
                    knife={detailKnife}
                    onClose={() => setDetailKnife(null)}
                    onOpenSteel={openSteelModal}
                />
            )}

            {/* Mobile Menu Button */}
            <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="fixed top-4 left-4 z-50 md:hidden p-3 bg-accent rounded-xl shadow-lg shadow-accent/20 text-black"
            >
                {mobileMenuOpen ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                )}
            </button>

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
            />

            {/* Main Content */}
            {view === 'HOME' && (
                <HomeView
                    setView={setView}
                    steels={steels}
                    setDetailSteel={setDetailSteel}
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
                />
            )}

            {view === 'MATRIX' && (
                <PerformanceMatrix
                    steels={filteredSteels}
                    setDetailSteel={setDetailSteel}
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

            {/* Settings Modal */}
            {showSettings && (
                <SettingsModal
                    apiKey={apiKey}
                    setApiKey={setApiKey}
                    aiModel={aiModel}
                    setAiModel={setAiModel}
                    onClose={() => setShowSettings(false)}
                />
            )}
        </div>
    );
}
