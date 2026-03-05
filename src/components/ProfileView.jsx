'use client'

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useUser } from '../context/UserContext';
import PerformanceRadar from './PerformanceRadar';
import Footer from './Footer';
import ViewHeader from './Common/ViewHeader';
import CustomSelect from './Common/CustomSelect';

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
        <div className="flex flex-col flex-1 min-w-0 md:h-full md:overflow-y-auto custom-scrollbar bg-transparent relative pb-40 md:pb-0">
            {/* Desktop gradient overlay — matches sidebar and HomeView gradient spread */}
            <div className="hidden md:block absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-violet-500/10 to-transparent pointer-events-none" />

            <ViewHeader
                subtitle="Operator Identity"
                title="User"
                highlight="Profile"
                color="violet"
            >
                <div className="flex flex-col md:flex-row items-start md:items-end gap-8 mt-8" ref={editRef}>
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-black/50 border-4 border-white/5 shadow-2xl flex items-center justify-center overflow-hidden shrink-0 backdrop-blur-md">
                        {user.avatar ? (
                            <Image src={user.avatar} alt="Avatar" width={128} height={128} className="w-full h-full object-cover" unoptimized />
                        ) : (
                            <div className="text-4xl md:text-5xl font-display font-black text-violet-500 italic uppercase">
                                {user.name.charAt(0)}
                            </div>
                        )}
                    </div>

                    <div className="flex-1 w-full text-left">
                        {isEditing ? (
                            <div className="space-y-4 max-w-lg">
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                    className="bg-white/5 border border-violet-500/30 rounded-xl px-4 py-3 text-white font-display font-black text-3xl md:text-4xl w-full focus:outline-none focus:border-violet-500 italic uppercase"
                                />
                                <textarea
                                    value={editForm.bio}
                                    onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-300 text-sm w-full h-24 focus:outline-none focus:border-violet-500 resize-none font-medium"
                                />
                                <div className="flex gap-3">
                                    <button onClick={handleSaveProfile} className="px-6 py-2 bg-violet-600 text-white font-bold rounded-xl text-sm transition-all hover:bg-violet-500 shadow-lg shadow-violet-600/20">Save Profile</button>
                                    <button onClick={() => setIsEditing(false)} className="px-6 py-2 bg-white/5 text-slate-400 font-bold rounded-xl text-sm border border-white/5 hover:bg-white/10 hover:text-white">Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="flex items-center gap-4">
                                    <h1 className="text-3xl md:text-6xl font-display font-black text-white italic uppercase tracking-tighter leading-none">
                                        {user.name}
                                    </h1>
                                    <button onClick={() => setIsEditing(true)} className="p-2 bg-white/5 border border-white/10 rounded-xl text-slate-500 hover:text-violet-400 hover:border-violet-500/30 transition-all">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                                    </button>
                                </div>
                                <p className="text-slate-500 text-xs md:text-lg max-w-xl italic font-medium leading-relaxed hidden md:block">"{user.bio}"</p>
                            </div>
                        )}
                    </div>

                    {!isEditing && (
                        <div className="shrink-0 mb-1">
                            <button className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2.5 text-xs font-black uppercase tracking-widest text-slate-300 hover:bg-white/10 hover:text-white transition-all group hover:border-violet-500/30">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-violet-500 group-hover:scale-110 transition-transform"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
                                Share Identity
                            </button>
                        </div>
                    )}
                </div>
            </ViewHeader>

            <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
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
                                    <div key={steel.id} onClick={() => setDetailSteel(steel)} className="group bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between hover:bg-white/10 transition-all cursor-pointer hover:border-violet-500/30">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center text-sm font-black text-white italic group-hover:text-violet-400 transition-colors">
                                                {steel.name.slice(0, 2)}
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">{steel.producer}</div>
                                                <div className="text-white font-black group-hover:text-white transition-colors uppercase italic">{steel.name}</div>
                                            </div>
                                        </div>
                                        <button onClick={(e) => { e.stopPropagation(); toggleFavorite(steel.id); }} className="text-violet-500 hover:text-slate-500 transition-colors">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 rounded-3xl border border-dashed border-white/10 text-center space-y-4">
                                <p className="text-slate-500 text-sm italic font-medium">No favorites pinned to your profile yet.</p>
                                <button onClick={() => setView('SEARCH')} className="text-[10px] font-black text-accent uppercase tracking-widest hover:text-white transition-colors">Explore Library</button>
                            </div>
                        )}
                    </section>
                </div>

                <div className="lg:col-span-2 space-y-10">
                    <section>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                                <span className="w-1.5 h-6 bg-violet-500 rounded-full"></span>
                                My Knife Collection
                            </h2>
                            <button
                                onClick={() => setShowAddKnife(true)}
                                className="px-4 py-2 bg-violet-600/10 border border-violet-500/20 text-violet-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-violet-600 hover:text-white transition-all shadow-lg shadow-violet-600/5"
                            >
                                + Add Knife
                            </button>
                        </div>

                        {showAddKnife && (
                            <div className="mb-10 p-8 rounded-3xl border border-violet-500/30 bg-violet-500/5 animate-in fade-in slide-in-from-top-4 duration-300">
                                <h3 className="text-white font-display font-black italic uppercase text-xl mb-6 tracking-tight">Add New Piece</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Model Name</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Prototype-01"
                                            value={newKnife.name}
                                            onChange={e => setNewKnife({ ...newKnife, name: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-violet-500 transition-colors font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Select Steel</label>
                                        <CustomSelect
                                            options={steels.map(s => ({ value: s.id, label: s.name }))}
                                            value={newKnife.steelId}
                                            onChange={val => setNewKnife({ ...newKnife, steelId: val })}
                                            placeholder="Search alloys..."
                                            color="violet"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2 mb-8">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Notes / Heat Treat</label>
                                    <textarea
                                        placeholder="Specific HRC or maker details..."
                                        value={newKnife.notes}
                                        onChange={e => setNewKnife({ ...newKnife, notes: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white h-24 focus:outline-none focus:border-violet-500 transition-colors resize-none font-medium"
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={handleAddKnife} className="px-8 py-3 bg-violet-600 text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-violet-500 transition-all shadow-xl shadow-violet-600/20">Register Piece</button>
                                    <button onClick={() => setShowAddKnife(false)} className="px-8 py-3 bg-white/5 text-slate-400 font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-white/10 transition-all">Discard</button>
                                </div>
                            </div>
                        )}

                        {myKnives.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {myKnives.map((knife) => {
                                    const steel = steels.find(s => s.id === knife.steelId);
                                    return (
                                        <div key={knife.id} className="glass-panel p-8 rounded-[2.5rem] border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent relative group">
                                            <div className="flex justify-between items-start mb-6">
                                                <div>
                                                    <h3 className="text-2xl font-display font-black text-white italic uppercase tracking-tighter transition-colors group-hover:text-violet-400">{knife.name}</h3>
                                                    {steel && <span className="text-[10px] font-black text-violet-500 uppercase tracking-widest">{steel.name} // {steel.producer}</span>}
                                                </div>
                                                <button onClick={() => removeKnife(knife.id)} className="p-2 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                                </button>
                                            </div>

                                            {steel && (
                                                <div className="grid grid-cols-2 gap-4 mb-6">
                                                    <div className="space-y-1">
                                                        <div className="text-[8px] font-black text-slate-600 uppercase tracking-tighter">Edge Retention</div>
                                                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                            <div className="h-full bg-accent" style={{ width: `${steel.edge * 10}%` }} />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="text-[8px] font-black text-slate-600 uppercase tracking-tighter">Toughness</div>
                                                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                            <div className="h-full bg-violet-400" style={{ width: `${steel.toughness * 10}%` }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <p className="text-slate-400 text-xs italic font-medium leading-relaxed mb-6 border-l-2 border-violet-500/20 pl-4">"{knife.notes || 'No registration notes provided.'}"</p>

                                            <div className="flex items-center gap-3">
                                                <button onClick={() => { if (steel) setDetailSteel(steel); }} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:bg-violet-500 hover:text-white hover:border-violet-400 transition-all">Specs</button>
                                                <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/10 hover:text-white transition-all">Update</button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="p-20 rounded-[3rem] border border-dashed border-white/5 bg-white/[0.01] text-center">
                                <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-slate-700 mx-auto mb-6 border border-white/5">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 3.5c1.4-1.4 3.7-1.4 5.1 0 1.4 1.4 1.4 3.7 0 5.1L17 11l-3.5-3.5 2.5-2.5z" /><path d="m8.5 9.5 7 7" /><path d="M18.4 16.6 20 20l-3.4-1.6L12 21l-1.5-5.5L5 14l5.5-1.5L12 7l4.4 4.6-4.6 4.4z" /></svg>
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
            <Footer />
        </div>
    );
};

export default ProfileView;
