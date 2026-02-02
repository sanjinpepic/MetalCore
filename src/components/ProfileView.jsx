'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../context/UserContext';
import PerformanceRadar from './PerformanceRadar';

const ProfileView = ({ steels, setDetailSteel, setView }) => {
    const { user, updateProfile, favoriteSteels, toggleFavorite, myKnives, addKnife, removeKnife, updateKnife } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ ...user });
    const [showAddKnife, setShowAddKnife] = useState(false);
    const [newKnife, setNewKnife] = useState({ name: '', steelId: '', notes: '' });
    const editRef = useRef(null);

    useEffect(() => {
        if (isEditing && editRef.current) {
            editRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [isEditing]);

    const handleSaveProfile = () => {
        updateProfile(editForm);
        setIsEditing(false);
    };

    const handleAddKnife = () => {
        if (!newKnife.name) return;
        addKnife(newKnife);
        setNewKnife({ name: '', steelId: '', notes: '' });
        setShowAddKnife(false);
    };

    const favoriteSteelsData = steels.filter(s => favoriteSteels.includes(s.id));

    return (
        <div className="flex-1 overflow-y-auto bg-black custom-scrollbar">
            {/* Header / Banner Area */}
            <div className="relative min-h-[14rem] md:h-64 bg-gradient-to-r from-accent/20 via-indigo-500/10 to-transparent border-b border-white/5 flex flex-col justify-end">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
                <div className="p-6 md:p-10 flex flex-col md:flex-row items-center md:items-end gap-6 relative z-10 w-full" ref={editRef}>
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-black border-4 border-accent shadow-2xl flex items-center justify-center overflow-hidden group">
                        {user.avatar ? (
                            <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-4xl md:text-5xl font-display font-black text-accent italic uppercase">
                                {user.name.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className="flex-1 mb-2 w-full text-center md:text-left">
                        {isEditing ? (
                            <div className="space-y-3 max-w-md">
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                    className="bg-black/60 border border-accent/30 rounded-xl px-4 py-2 text-white font-display font-black text-2xl w-full focus:outline-none focus:border-accent"
                                />
                                <textarea
                                    value={editForm.bio}
                                    onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                                    className="bg-black/60 border border-white/10 rounded-xl px-4 py-2 text-slate-400 text-sm w-full h-20 focus:outline-none focus:border-accent resize-none"
                                />
                                <div className="flex gap-2 justify-center md:justify-start">
                                    <button onClick={handleSaveProfile} className="px-4 py-2 bg-accent text-black font-bold rounded-lg text-sm transition-all hover:scale-105">Save</button>
                                    <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-white/5 text-slate-400 font-bold rounded-lg text-sm border border-white/10 hover:bg-white/10">Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-center md:justify-start gap-4">
                                    <h1 className="text-3xl md:text-5xl font-display font-black text-white italic uppercase tracking-tighter leading-none">
                                        {user.name}
                                    </h1>
                                    <button onClick={() => setIsEditing(true)} className="p-2 bg-white/5 border border-white/10 rounded-lg text-slate-500 hover:text-accent transition-colors">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                                    </button>
                                </div>
                                <p className="text-slate-400 mt-2 max-w-lg italic font-medium mx-auto md:mx-0">"{user.bio}"</p>
                            </>
                        )}
                    </div>
                    <div className="flex gap-3 mb-2 shrink-0">
                        <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-2 text-sm font-bold text-white hover:bg-white/10 transition-all group whitespace-nowrap">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-accent group-hover:scale-110 transition-transform"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
                            <span className="hidden sm:inline">Share Profile</span>
                            <span className="sm:hidden">Share</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Column 1: Favorites & Community */}
                <div className="space-y-10">
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                                <span className="w-1.5 h-6 bg-accent rounded-full"></span>
                                My Favorite Grades
                            </h2>
                            <span className="text-accent font-mono font-bold text-sm bg-accent/10 px-3 py-1 rounded-full">{favoriteSteels.length}</span>
                        </div>

                        {favoriteSteelsData.length > 0 ? (
                            <div className="grid grid-cols-1 gap-3">
                                {favoriteSteelsData.map(steel => (
                                    <div
                                        key={steel.id}
                                        onClick={() => setDetailSteel(steel)}
                                        className="group p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-accent/30 transition-all cursor-pointer flex items-center justify-between"
                                    >
                                        <div>
                                            <div className="text-[10px] font-black text-slate-500 uppercase mb-1">{steel.producer}</div>
                                            <div className="text-sm font-display font-black text-white italic group-hover:text-accent transition-colors">{steel.name}</div>
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); toggleFavorite(steel.id); }}
                                            className="p-2 text-accent bg-accent/10 rounded-xl"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="m12 17.75-6.172 3.245 1.179-6.873-4.993-4.867 6.9-1.002L12 2l3.086 6.253 6.9 1.002-4.993 4.867 1.179 6.873z" /></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 border border-dashed border-white/10 rounded-2xl text-center">
                                <p className="text-slate-500 text-sm italic mb-4">You haven't favorited any steels yet.</p>
                                <button onClick={() => setView('SEARCH')} className="px-5 py-2.5 bg-accent/10 text-accent text-xs font-bold rounded-xl hover:bg-accent/20 transition-all">Explore Library</button>
                            </div>
                        )}
                    </section>
                </div>

                {/* Column 2: Knife Collection */}
                <div className="lg:col-span-2 space-y-10">
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                                <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
                                My Knife Collection
                            </h2>
                            <button
                                onClick={() => setShowAddKnife(true)}
                                className="px-4 py-2 bg-accent text-black text-xs font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-accent/20"
                            >
                                + Add Knife
                            </button>
                        </div>

                        {showAddKnife && (
                            <div className="mb-8 p-6 bg-white/5 border border-accent/20 rounded-3xl space-y-4 animate-in fade-in slide-in-from-top-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Knife Model</label>
                                        <input
                                            placeholder="e.g. Paramilitary 2"
                                            value={newKnife.name}
                                            onChange={e => setNewKnife({ ...newKnife, name: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Steel Grade</label>
                                        <select
                                            value={newKnife.steelId}
                                            onChange={e => setNewKnife({ ...newKnife, steelId: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent appearance-none"
                                        >
                                            <option value="">Select Steel...</option>
                                            {steels.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Notes / HRC / Edge Angle</label>
                                    <input
                                        placeholder="e.g. 62HRC, 17 dps, Micarta scales"
                                        value={newKnife.notes}
                                        onChange={e => setNewKnife({ ...newKnife, notes: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent"
                                    />
                                </div>
                                <div className="flex gap-2 justify-end">
                                    <button onClick={() => setShowAddKnife(false)} className="px-4 py-2 text-slate-400 text-sm font-bold hover:text-white transition-colors">Cancel</button>
                                    <button onClick={handleAddKnife} className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20">Add to Collection</button>
                                </div>
                            </div>
                        )}

                        {myKnives.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {myKnives.map(knife => {
                                    const steel = steels.find(s => s.id === knife.steelId);
                                    return (
                                        <div key={knife.id} className="glass-panel p-6 rounded-3xl border-white/5 hover:border-white/10 bg-black/40 transition-all flex flex-col group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-lg font-display font-black text-white italic uppercase">{knife.name}</h3>
                                                    {steel && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setDetailSteel(steel); }}
                                                            className="text-accent text-[11px] font-bold uppercase tracking-widest hover:underline mt-1"
                                                        >
                                                            {steel.name}
                                                        </button>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => removeKnife(knife.id)}
                                                    className="p-2 opacity-0 group-hover:opacity-100 transition-opacity text-rose-500 hover:bg-rose-500/10 rounded-xl"
                                                >
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                                </button>
                                            </div>
                                            <p className="text-slate-400 text-sm italic line-clamp-2 flex-1">{knife.notes || "No notes added."}</p>
                                            <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap gap-4 overflow-x-auto no-scrollbar">
                                                {steel && (
                                                    <>
                                                        <div className="flex flex-col min-w-[3.5rem]">
                                                            <span className="text-[8px] font-black text-slate-600 uppercase">Edge</span>
                                                            <div className="flex gap-0.5 mt-0.5">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <div key={i} className={`w-2 h-1 rounded-full ${i < Math.round(steel.edge / 2) ? 'bg-emerald-500' : 'bg-white/5'}`}></div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col min-w-[3.5rem]">
                                                            <span className="text-[8px] font-black text-slate-600 uppercase">Tough</span>
                                                            <div className="flex gap-0.5 mt-0.5">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <div key={i} className={`w-2 h-1 rounded-full ${i < Math.round(steel.toughness / 2) ? 'bg-rose-500' : 'bg-white/5'}`}></div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col min-w-[3.5rem]">
                                                            <span className="text-[8px] font-black text-slate-600 uppercase">Stain</span>
                                                            <div className="flex gap-0.5 mt-0.5">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <div key={i} className={`w-2 h-1 rounded-full ${i < Math.round(steel.corrosion / 2) ? 'bg-sky-500' : 'bg-white/5'}`}></div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col min-w-[3.5rem]">
                                                            <span className="text-[8px] font-black text-slate-600 uppercase">Sharp</span>
                                                            <div className="flex gap-0.5 mt-0.5">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <div key={i} className={`w-2 h-1 rounded-full ${i < Math.round(steel.sharpen / 2) ? 'bg-amber-500' : 'bg-white/5'}`}></div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="p-16 border border-dashed border-white/10 rounded-[3rem] text-center bg-white/5">
                                <div className="w-16 h-16 bg-white/5 rounded-3xl mx-auto flex items-center justify-center mb-6 text-slate-600">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" /><line x1="13" y1="19" x2="19" y2="13" /><line x1="16" y1="16" x2="20" y2="20" /><line x1="19" y1="21" x2="21" y2="19" /></svg>
                                </div>
                                <h3 className="text-white font-display font-black italic uppercase text-xl mb-2">Build Your Collection</h3>
                                <p className="text-slate-500 text-sm max-w-sm mx-auto mb-8 font-medium italic">Track your favorite tools, their steel grades, and custom heat treatments in one place.</p>
                                <button
                                    onClick={() => setShowAddKnife(true)}
                                    className="px-8 py-4 bg-accent text-black font-black uppercase text-sm rounded-2xl hover:scale-105 transition-all shadow-xl shadow-accent/20"
                                >
                                    Start Now
                                </button>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ProfileView;
