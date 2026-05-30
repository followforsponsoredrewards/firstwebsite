'use client';

import { useState, useMemo } from 'react';
import SearchableSelect from './SearchableSelect';

export default function AdminDashboard({ initialDrops = [], sponsorsList = [] }) {
    // ----------------------------------------------------
    // ADMINISTRATIVE SECURITY PROTECTION SHIELD
    // ----------------------------------------------------
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [authError, setAuthError] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    const handleAdminAuthentication = async (e) => {
        e.preventDefault();
        if (isAuthenticating) return;

        setIsAuthenticating(true);
        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: passwordInput }),
            });

            const data = await response.json();

            if (response.ok && data.authenticated) {
                setIsAuthenticated(true);
                setAuthError(false);
            } else {
                setAuthError(true);
                setPasswordInput('');
            }
        } catch (err) {
            setAuthError(true);
        } finally {
            setIsAuthenticating(false);
        }
    };

    // ----------------------------------------------------
    // WORKSPACE CORE SYSTEM STATES & THREAD LOCKS
    // ----------------------------------------------------
    const [drops, setDrops] = useState(initialDrops || []);
    const [sponsors, setSponsors] = useState(sponsorsList || []);

    // ASYNC TRANSACTION LOCKS
    const [isSponsorCommitting, setIsSponsorCommitting] = useState(false);
    const [isDropInitializing, setIsDropInitializing] = useState(false);
    const [isWinnerProcessing, setIsWinnerProcessing] = useState(false);

    // MODULE 1 STATE: SPONSOR DATA
    const [sponsorForm, setSponsorForm] = useState({ name: '', logo_url: '', website_url: '' });

    const handleCreateSponsor = async (e) => {
        e.preventDefault();
        if (!sponsorForm.name || isSponsorCommitting) return;

        setIsSponsorCommitting(true);
        try {
            const response = await fetch('/api/admin/sponsors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: passwordInput, sponsorData: sponsorForm })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            const brandObject = Array.isArray(data.data) ? data.data[0] : data.data;
            if (!brandObject || !brandObject.name) throw new Error("Mangled record signature received");

            setSponsors(prev => [...prev, brandObject].sort((a, b) => a.name.localeCompare(b.name)));
            setSponsorForm({ name: '', logo_url: '', website_url: '' });
        } catch (err) {
            console.error('Sponsor commit failed:', err);
        } finally {
            setIsSponsorCommitting(false);
        }
    };

    // MODULE 2 STATE: DROP INGESTION DATA
    const computedNextDropNumber = useMemo(() => {
        if (!drops || drops.length === 0) return 1;
        const numbers = drops.map(d => Number(d.drop_number)).filter(n => !isNaN(n));
        if (numbers.length === 0) return 1;
        return Math.max(...numbers) + 1;
    }, [drops]);

    const [dropForm, setDropForm] = useState({ title: '', keyword: '', instagram_url: '', custom_drop_number: '' });
    const [selectedSponsor, setSelectedSponsor] = useState(null);

    const handleCreateDrop = async (e) => {
        e.preventDefault();
        if (!dropForm.title || !dropForm.keyword || isDropInitializing) return;

        setIsDropInitializing(true);
        const assignedDropNum = Number(dropForm.custom_drop_number) || computedNextDropNumber;

        const dropPayload = {
            drop_number: assignedDropNum,
            title: dropForm.title.toUpperCase(),
            keyword: dropForm.keyword.toUpperCase(),
            instagram_url: dropForm.instagram_url || '#',
            sponsor_id: selectedSponsor ? selectedSponsor.id : null
        };

        try {
            const response = await fetch('/api/admin/drops', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: passwordInput, dropData: dropPayload })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            const dropObject = Array.isArray(data.data) ? data.data[0] : data.data;

            const createdDrop = {
                ...dropObject,
                sponsors: selectedSponsor,
                winners: []
            };

            setDrops(prev => [createdDrop, ...prev]);
            setDropForm({ title: '', keyword: '', instagram_url: '', custom_drop_number: '' });
            setSelectedSponsor(null);
        } catch (err) {
            console.error('Drop engine initialization failed:', err);
        } finally {
            setIsDropInitializing(false);
        }
    };

    // MODULE 3 STATE: TRANSACTION DISTRIBUTOR
    const dropSelectionOptions = useMemo(() => {
        return [...drops]
            .sort((a, b) => b.drop_number - a.drop_number)
            .map(d => ({
                id: d.id,
                name: `DROP #${String(d.drop_number).padStart(3, '0')} - ${d.title}`
            }));
    }, [drops]);

    const [targetedDropSelection, setTargetedDropSelection] = useState(null);
    const activeSelectedTarget = targetedDropSelection || dropSelectionOptions[0] || null;

    const [winnerForm, setWinnerForm] = useState({ username: '', amount: '', payment_proof_url: '' });

    const handleAddWinner = async (e) => {
        e.preventDefault();
        if (!activeSelectedTarget || !winnerForm.username || !winnerForm.amount || isWinnerProcessing) return;

        setIsWinnerProcessing(true);
        const winnerPayload = {
            drop_id: activeSelectedTarget.id,
            username: winnerForm.username.replace('@', '').trim(),
            amount: Number(winnerForm.amount),
            payment_proof_url: winnerForm.payment_proof_url || '#'
        };

        try {
            const response = await fetch('/api/admin/winners', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: passwordInput, winnerData: winnerPayload })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            const winnerObject = Array.isArray(data.data) ? data.data[0] : data.data;

            setDrops(prev => prev.map(d => {
                if (d.id === activeSelectedTarget.id) {
                    return { ...d, winners: [...(d.winners || []), winnerObject] };
                }
                return d;
            }));

            setWinnerForm({ username: '', amount: '', payment_proof_url: '' });
        } catch (err) {
            console.error('Winner transaction disburser failed:', err);
        } finally {
            setIsWinnerProcessing(false);
        }
    };

    // ----------------------------------------------------
    // SECURITY GATE WALL RENDER LAYER
    // ----------------------------------------------------
    if (!isAuthenticated) {
        return (
            <div className="h-screen w-screen bg-[#EFF1F5] font-mono text-xs flex items-center justify-center p-4 relative select-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#DBDEE5_1px,transparent_1px),linear-gradient(to_bottom,#DBDEE5_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40 z-0" />

                <div className="w-full max-w-[400px] bg-[#E4E7EB]/90 backdrop-blur-md border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(45,49,57,1)] relative z-10 overflow-hidden">
                    {/* INDUSTRIAL SCANNING ANIMATION ROW */}
                    {isAuthenticating && (
                        <div className="absolute inset-x-0 h-1 bg-[#DC2626] opacity-70 shadow-[0_0_8px_#DC2626] animate-[bounce_2s_infinite] left-0 top-0" />
                    )}

                    <div className="flex items-center gap-2 border-b-2 border-black pb-3 mb-4">
                        <div className={`w-2 h-4 ${isAuthenticating ? 'bg-amber-500 animate-pulse' : 'bg-[#DC2626]'}`} />
                        <h1 className="font-black tracking-widest text-[#2D3139] uppercase text-[11px]">
                            {isAuthenticating ? 'DECRYPTING UTILITY MATRIX...' : 'RESTRICTED ENTRY CORE BARRIER'}
                        </h1>
                    </div>

                    <p className="text-[9px] text-[#626A7A] uppercase font-bold tracking-wider mb-4 leading-relaxed">
                        CRITICAL ACCESS DETECTED. AUTHORIZED DATA MAINTENANCE ENGINEERS ONLY. INPUT CORE ACCESS KEYPHRASE TO DECRYPT FORM TERMINALS.
                    </p>

                    <form onSubmit={handleAdminAuthentication} className="space-y-4">
                        <div>
                            <label className="text-[8px] font-black text-[#2D3139] uppercase tracking-widest block mb-1">
                                SYSTEM DECRYPTION PASSWORD
                            </label>
                            <input
                                type="password"
                                required
                                disabled={isAuthenticating}
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                placeholder="••••••••••••••"
                                className="w-full text-black bg-[#EFF1F5] border-2 border-black p-3 text-[11px] font-bold focus:outline-none focus:bg-white tracking-widest rounded-none disabled:opacity-50"
                            />
                        </div>

                        {authError && (
                            <div className="bg-[#FEE2E2] border border-[#EF4444] p-2 text-[8px] text-[#B91C1C] font-black tracking-widest uppercase">
                                // SYSTEM REJECT: INCORRECT CORE ACCESS KEYPHRASE SECURE TOKEN
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isAuthenticating}
                            className="w-full bg-black hover:bg-[#2D3139] text-white font-black text-[10px] tracking-widest uppercase py-3 transition-all shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] active:translate-x-0.5 active:translate-y-0.5 rounded-none disabled:bg-[#626A7A] disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 cursor-pointer disabled:cursor-not-allowed"
                        >
                            {isAuthenticating ? 'PARSING IDENT tokens...' : 'VALIDATE SECURITY CLEARED IDENT'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // ----------------------------------------------------
    // SECURE MASTER ADMINISTRATIVE INTERFACE
    // ----------------------------------------------------
    return (
        <div className="h-screen bg-[#EFF1F5] text-[#3A4454] font-mono text-xs flex flex-col overflow-hidden relative">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#DBDEE5_1px,transparent_1px),linear-gradient(to_bottom,#DBDEE5_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40 z-0" />

            {/* FIXED TOP UTILITY TERMINAL BLOCK */}
            <header className="w-full bg-[#EFF1F5]/80 backdrop-blur-md border-b-2 border-[#2D3139] p-4 md:px-8 py-4 z-20 shrink-0 relative">
                <div className="max-w-[1600px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-4 ${(isSponsorCommitting || isDropInitializing || isWinnerProcessing) ? 'bg-amber-500 animate-spin' : 'bg-[#059669]'}`} />
                        <div>
                            <h1 className="text-xs md:text-sm font-black tracking-widest text-[#2D3139] uppercase">
                                CONSCIENTIA SYSTEM DATA MATRIX CONTROL TERMINAL
                            </h1>
                            <p className="text-[8px] md:text-[9px] text-[#626A7A] uppercase mt-0.5 tracking-widest font-bold">
                                Direct Database Write Isolation Frame // Status: SECURE AUTHORIZED ACCESS UNLOCKED
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setIsAuthenticated(false);
                            setPasswordInput('');
                            setAuthError(false);
                            setSelectedSponsor(null);
                            setTargetedDropSelection(null);
                            setSponsorForm({ name: '', logo_url: '', website_url: '' });
                            setDropForm({ title: '', keyword: '', instagram_url: '', custom_drop_number: '' });
                            setWinnerForm({ username: '', amount: '', payment_proof_url: '' });
                        }}
                        className="border-2 border-black bg-[#E4E7EB] hover:bg-black hover:text-white text-[8px] font-black tracking-widest px-2.5 py-1 transition-colors uppercase rounded-none"
                    >
                        LOCK TERM [X]
                    </button>
                </div>
            </header>

            {/* THREE-COLUMN TRANSACTION FRAMEWORK WORKSPACE */}
            <main className="flex-1 max-w-[1600px] w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 md:p-8 min-h-0 relative z-10 overflow-y-auto lg:overflow-y-visible">

                {/* PART 1: BRAND SPONSOR ARCHIVE STORAGE CONTAINER */}
                <section className="bg-[#E4E7EB]/70 backdrop-blur-md border-2 border-[#2D3139] p-4 shadow-[3px_3px_0px_0px_rgba(45,49,57,1)] flex flex-col justify-between shrink-0 lg:h-full relative overflow-hidden">
                    {isSponsorCommitting && (
                        <div className="absolute inset-x-0 h-0.5 bg-black opacity-40 animate-[bounce_1.5s_infinite] top-0 left-0" />
                    )}
                    <div className="w-full">
                        <div className="flex items-center gap-2 border-b border-[#C8CCD4] pb-2 mb-4">
                            <span className={`w-1.5 h-1.5 ${isSponsorCommitting ? 'bg-amber-500 animate-ping' : 'bg-black'}`} />
                            <h2 className="text-[10px] font-black text-[#2D3139] tracking-widest uppercase">
                                {isSponsorCommitting ? '[01 // COMMITTING REPLICAS...]' : '[01 // SPONSOR INGESTION]'}
                            </h2>
                        </div>

                        <form onSubmit={handleCreateSponsor} className="space-y-4">
                            <div>
                                <label className="text-[8px] font-black text-[#626A7A] uppercase tracking-widest block mb-1">PARTNER BRAND NAME</label>
                                <input
                                    type="text" required disabled={isSponsorCommitting} value={sponsorForm.name}
                                    onChange={(e) => setSponsorForm({ ...sponsorForm, name: e.target.value })}
                                    placeholder="EX: ACME CORP INDUSTRIAL"
                                    className="w-full bg-[#EFF1F5] border-2 border-[#2D3139] p-2 text-[10px] font-bold focus:outline-none focus:bg-white uppercase rounded-none shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
                                />
                            </div>

                            <div>
                                <label className="text-[8px] font-black text-[#626A7A] uppercase tracking-widest block mb-1">LOGO IMAGE LINK</label>
                                <input
                                    type="url" disabled={isSponsorCommitting} value={sponsorForm.logo_url}
                                    onChange={(e) => setSponsorForm({ ...sponsorForm, logo_url: e.target.value })}
                                    placeholder="https://cdn.platform.com/logo.png"
                                    className="w-full bg-[#EFF1F5] border-2 border-[#2D3139] p-2 text-[10px] font-bold focus:outline-none focus:bg-white rounded-none shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
                                />
                            </div>

                            <div>
                                <label className="text-[8px] font-black text-[#626A7A] uppercase tracking-widest block mb-1">REDIRECT TARGET URL</label>
                                <input
                                    type="url" disabled={isSponsorCommitting} value={sponsorForm.website_url}
                                    onChange={(e) => setSponsorForm({ ...sponsorForm, website_url: e.target.value })}
                                    placeholder="https://acme-industrial.zone"
                                    className="w-full bg-[#EFF1F5] border-2 border-[#2D3139] p-2 text-[10px] font-bold focus:outline-none focus:bg-white rounded-none shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSponsorCommitting}
                                className="w-full bg-[#2D3139] hover:bg-black disabled:bg-[#626A7A] text-white font-black text-[9px] tracking-widest uppercase py-2.5 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:shadow-none rounded-none cursor-pointer disabled:cursor-not-allowed"
                            >
                                {isSponsorCommitting ? 'EXECUTING PIPELINE WRITE...' : 'COMMIT SPONSOR ENTRY'}
                            </button>
                        </form>
                    </div>
                </section>

                {/* PART 2: DROP CAMPAIGN INGESTION CONTROLLER ENGINE */}
                <section className="bg-[#E4E7EB]/70 backdrop-blur-md border-2 border-[#2D3139] p-4 shadow-[3px_3px_0px_0px_rgba(45,49,57,1)] flex flex-col justify-between shrink-0 lg:h-full relative overflow-hidden">
                    {isDropInitializing && (
                        <div className="absolute inset-x-0 h-0.5 bg-black opacity-40 animate-[bounce_1.5s_infinite] top-0 left-0" />
                    )}
                    <form onSubmit={handleCreateDrop} className="space-y-4 h-full flex flex-col justify-between">
                        <div className="space-y-4 w-full">
                            <div className="flex items-center gap-2 border-b border-[#C8CCD4] pb-2 mb-4">
                                <span className={`w-1.5 h-1.5 ${isDropInitializing ? 'bg-amber-500 animate-ping' : 'bg-black'}`} />
                                <h2 className="text-[10px] font-black text-[#2D3139] tracking-widest uppercase">
                                    {isDropInitializing ? '[02 // COMPILING DATA NODES...]' : '[02 // REWARD DROP GENERATOR]'}
                                </h2>
                            </div>

                            <div>
                                <label className="text-[8px] font-black text-[#626A7A] uppercase tracking-widest block mb-1">DROP SYSTEM NUMBER</label>
                                <input
                                    type="number" disabled={isDropInitializing} value={dropForm.custom_drop_number}
                                    onChange={(e) => setDropForm({ ...dropForm, custom_drop_number: e.target.value })}
                                    placeholder={`AUTO INCREMENT: #${String(computedNextDropNumber).padStart(3, '0')}`}
                                    className="w-full bg-[#EFF1F5] border-2 border-[#2D3139] p-2 text-[10px] font-black tracking-widest focus:outline-none placeholder-[#2D3139]/50 rounded-none shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
                                />
                            </div>

                            <div>
                                <label className="text-[8px] font-black text-[#626A7A] uppercase tracking-widest block mb-1">DROP CAMPAIGN TITLE</label>
                                <input
                                    type="text" required disabled={isDropInitializing} value={dropForm.title}
                                    onChange={(e) => setDropForm({ ...dropForm, title: e.target.value })}
                                    placeholder="EX: CYBERPUNK CLOTHING SWEEPSTAKES"
                                    className="w-full bg-[#EFF1F5] border-2 border-[#2D3139] p-2 text-[10px] font-bold focus:outline-none focus:bg-white uppercase rounded-none shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
                                />
                            </div>

                            <div>
                                <label className="text-[8px] font-black text-[#626A7A] uppercase tracking-widest block mb-1">INSTAGRAM REEL LINK</label>
                                <input
                                    type="url" disabled={isDropInitializing} value={dropForm.instagram_url}
                                    onChange={(e) => setDropForm({ ...dropForm, instagram_url: e.target.value })}
                                    placeholder="https://instagram.com/reel/..."
                                    className="w-full bg-[#EFF1F5] border-2 border-[#2D3139] p-2 text-[10px] font-bold focus:outline-none focus:bg-white rounded-none shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
                                />
                            </div>

                            <div>
                                <label className="text-[8px] font-black text-[#626A7A] uppercase tracking-widest block mb-1">TARGET TRACER KEYWORD</label>
                                <input
                                    type="text" required disabled={isDropInitializing} value={dropForm.keyword}
                                    onChange={(e) => setDropForm({ ...dropForm, keyword: e.target.value })}
                                    placeholder="EX: TECHNOCORE"
                                    className="w-full bg-[#EFF1F5] border-2 border-[#2D3139] p-2 text-[10px] font-bold focus:outline-none focus:bg-white uppercase rounded-none shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
                                />
                            </div>

                            <div>
                                <label className="text-[8px] font-black text-[#626A7A] uppercase tracking-widest block mb-1">ASSIGN SPONSOR AFFILIATION PROFILE</label>
                                <SearchableSelect
                                    options={sponsors}
                                    selected={selectedSponsor}
                                    onChange={setSelectedSponsor}
                                    placeholder="ATTACH BRAND PARTNER..."
                                    disabled={isDropInitializing}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isDropInitializing}
                            className="w-full bg-[#2D3139] hover:bg-black disabled:bg-[#626A7A] text-white font-black text-[9px] tracking-widest uppercase py-2.5 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:shadow-none mt-4 rounded-none shrink-0 cursor-pointer disabled:cursor-not-allowed"
                        >
                            {isDropInitializing ? 'SYNCING MATRIX BLOCK...' : 'INITIALIZE REWARD ENGINE SEGMENT'}
                        </button>
                    </form>
                </section>

                {/* PART 3: WINNER ALLOCATION DISBURSER LEDGER MODULE */}
                <section className="bg-[#E4E7EB]/70 backdrop-blur-md border-2 border-[#2D3139] p-4 shadow-[3px_3px_0px_0px_rgba(45,49,57,1)] flex flex-col justify-between shrink-0 lg:h-full relative overflow-hidden">
                    {isWinnerProcessing && (
                        <div className="absolute inset-x-0 h-0.5 bg-black opacity-40 animate-[bounce_1.5s_infinite] top-0 left-0" />
                    )}
                    <form onSubmit={handleAddWinner} className="space-y-4 h-full flex flex-col justify-between">
                        <div className="space-y-4 w-full">
                            <div className="flex items-center gap-2 border-b border-[#C8CCD4] pb-2 mb-4">
                                <span className={`w-1.5 h-1.5 ${isWinnerProcessing ? 'bg-amber-500 animate-ping' : 'bg-black'}`} />
                                <h2 className="text-[10px] font-black text-[#2D3139] tracking-widest uppercase">
                                    {isWinnerProcessing ? '[03 // REALLOCATING FUNDS...]' : '[03 // WINNER TRANSACTION DISBURSER]'}
                                </h2>
                            </div>

                            <div>
                                <label className="text-[8px] font-black text-[#626A7A] uppercase tracking-widest block mb-1">TARGETED DISTRIBUTION DESTINATION DROP</label>
                                <SearchableSelect
                                    options={dropSelectionOptions}
                                    selected={activeSelectedTarget}
                                    onChange={setTargetedDropSelection}
                                    placeholder="SELECT ALLOCATED DROP REGISTRY..."
                                    disabled={isWinnerProcessing}
                                />
                            </div>

                            <div>
                                <label className="text-[8px] font-black text-[#626A7A] uppercase tracking-widest block mb-1">RECIPIENT ACCOUNT ALIAS</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-[#8A94A6] text-[10px]">@</span>
                                    <input
                                        type="text" required disabled={isWinnerProcessing} value={winnerForm.username}
                                        onChange={(e) => setWinnerForm({ ...winnerForm, username: e.target.value })}
                                        placeholder="ALPHA_RECIPIENT"
                                        className="w-full bg-[#EFF1F5] border-2 border-[#2D3139] pl-6 pr-2 py-2 text-[10px] font-bold focus:outline-none focus:bg-white rounded-none shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[8px] font-black text-[#626A7A] uppercase tracking-widest block mb-1">DISBURSEMENT QUANTITY (INR)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-[#8A94A6] text-[10px]">₹</span>
                                    <input
                                        type="number" required disabled={isWinnerProcessing} value={winnerForm.amount}
                                        onChange={(e) => setWinnerForm({ ...winnerForm, amount: e.target.value })}
                                        placeholder="5,000"
                                        className="w-full bg-[#EFF1F5] border-2 border-[#2D3139] pl-6 pr-2 py-2 text-[10px] font-black tracking-wider focus:outline-none focus:bg-white rounded-none shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[8px] font-black text-[#626A7A] uppercase tracking-widest block mb-1">TRANSACTION CLEARANCE PROOF LINK</label>
                                <input
                                    type="url" disabled={isWinnerProcessing} value={winnerForm.payment_proof_url}
                                    onChange={(e) => setWinnerForm({ ...winnerForm, payment_proof_url: e.target.value })}
                                    placeholder="https://imgur.com/receipt-proof-hash"
                                    className="w-full bg-[#EFF1F5] border-2 border-[#2D3139] p-2 text-[10px] font-bold focus:outline-none focus:bg-white rounded-none shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={!activeSelectedTarget || isWinnerProcessing}
                            className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-[#8A94A6] text-white font-black text-[9px] tracking-widest uppercase py-2.5 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:shadow-none mt-4 rounded-none shrink-0 cursor-pointer disabled:cursor-not-allowed"
                        >
                            {isWinnerProcessing ? 'DISPATCHING TRANSACTION...' : 'EXECUTE SECURE ACCOUNT ENTRY CLEARANCE'}
                        </button>
                    </form>
                </section>

            </main>
        </div>
    );
}