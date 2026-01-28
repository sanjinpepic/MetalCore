import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';

const ImportModal = ({ onClose, onManualImport, onFileUpload }) => {
    const [mode, setMode] = useState('UPLOAD'); // 'UPLOAD' or 'MANUAL'
    const [dragActive, setDragActive] = useState(false);

    // Manual Entry State
    const [formData, setFormData] = useState({
        name: "",
        producer: "",
        desc: "",
        C: 0,
        Cr: 0,
        V: 0,
        Mo: 0,
        W: 0,
        Co: 0,
        edge: 5,
        toughness: 5,
        corrosion: 5,
        sharpen: 5
    });

    const fileInputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file) => {
        // Create an event-like object to match the expected signature in page.jsx or handle directly
        // page.jsx expects an event with target.files[0]
        const mockEvent = { target: { files: [file] } };
        onFileUpload(mockEvent);
        onClose();
    };

    const handleManualChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: ['name', 'producer', 'desc'].includes(name) ? value : parseFloat(value) || 0
        }));
    };

    const submitManual = (e) => {
        e.preventDefault();
        onManualImport({
            id: 'manual-' + Date.now(),
            ...formData,
            knives: [] // Default empty
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 bg-black/80 backdrop-blur-md" onClick={onClose}>
            <div className="glass-panel w-full h-full md:h-auto md:max-w-2xl p-6 md:p-10 md:rounded-[2.5rem] border-white/10 shadow-2xl relative overflow-y-auto custom-scrollbar" onClick={e => e.stopPropagation()}>
                {/* Close Button */}
                <div className="absolute top-4 right-4 md:top-6 md:right-6 z-[110]">
                    <button onClick={onClose} className="p-2.5 bg-black/40 hover:bg-white/10 rounded-full text-slate-400 transition-all border border-white/10 backdrop-blur-3xl group">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:rotate-90 transition-transform">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl font-display font-black text-white mb-2 italic uppercase tracking-tighter">Import Dataset</h2>
                    <p className="text-slate-400 text-sm">Add custom steel grades or knife data to your local session.</p>
                </div>

                {/* Tabs */}
                <div className="flex p-1 bg-white/5 rounded-xl border border-white/10 mb-8">
                    <button
                        onClick={() => setMode('UPLOAD')}
                        className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${mode === 'UPLOAD' ? 'bg-accent text-black shadow-lg shadow-accent/20' : 'text-slate-500 hover:text-white'}`}
                    >
                        Upload File
                    </button>
                    <button
                        onClick={() => setMode('MANUAL')}
                        className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${mode === 'MANUAL' ? 'bg-accent text-black shadow-lg shadow-accent/20' : 'text-slate-500 hover:text-white'}`}
                    >
                        Manual Entry
                    </button>
                </div>

                {mode === 'UPLOAD' ? (
                    <div
                        className={`border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center gap-4 transition-all ${dragActive ? 'border-accent bg-accent/5' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-slate-500 mb-2">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                <polyline points="14 2 14 8 20 8" />
                                <path d="M12 18v-6" />
                                <path d="m9 15 3-3 3 3" />
                            </svg>
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-bold text-white mb-1">Drag & Drop Excel File</h3>
                            <p className="text-xs text-slate-500 mb-6">Supports .xlsx or .csv files</p>
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="px-6 py-3 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-colors"
                            >
                                Browse Files
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".xlsx,.csv"
                                className="hidden"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/5 w-full">
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Required Columns</div>
                            <div className="flex flex-wrap gap-2">
                                {['Name', 'Producer', 'C', 'Cr', 'V', 'Mo', 'W', 'Co', 'Edge', 'Toughness', 'Corrosion', 'Sharpen'].map(col => (
                                    <span key={col} className="text-[10px] px-2 py-1 rounded bg-black/40 text-slate-400 border border-white/5">{col}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={submitManual} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Grade Name</label>
                                <input required name="name" value={formData.name} onChange={handleManualChange} placeholder="e.g. MagnaCut" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-accent outline-none transition-colors" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Producer</label>
                                <input required name="producer" value={formData.producer} onChange={handleManualChange} placeholder="e.g. Crucible" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-accent outline-none transition-colors" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Description</label>
                            <textarea name="desc" value={formData.desc} onChange={handleManualChange} placeholder="Brief description of the steel..." rows="2" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-accent outline-none transition-colors resize-none" />
                        </div>

                        <div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Composition (%)</div>
                            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                                {['C', 'Cr', 'V', 'Mo', 'W', 'Co'].map(el => (
                                    <div key={el} className="space-y-1.5">
                                        <label className="text-[9px] font-bold text-slate-600 text-center block">{el}</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            name={el}
                                            value={formData[el]}
                                            onChange={handleManualChange}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-2 text-xs text-center text-white focus:border-accent outline-none"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Performance Ratings (0-10)</div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {['Edge Retention', 'Toughness', 'Corrosion', 'Sharpening'].map(metric => {
                                    const key = metric.split(' ')[0].toLowerCase();
                                    const formKey = key === 'edge' ? 'edge' : key === 'sharpening' ? 'sharpen' : key;

                                    return (
                                        <div key={metric} className="space-y-1.5">
                                            <label className="text-[9px] font-bold text-slate-600 truncate block">{metric}</label>
                                            <input
                                                type="number"
                                                min="0" max="10" step="0.5"
                                                name={formKey}
                                                value={formData[formKey]}
                                                onChange={handleManualChange}
                                                className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-2 text-xs text-center text-white focus:border-accent outline-none"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <button type="submit" className="w-full py-4 bg-accent text-black font-black uppercase tracking-widest rounded-xl hover:bg-white transition-colors shadow-lg shadow-accent/10 mt-4">
                            Add Grade
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ImportModal;
