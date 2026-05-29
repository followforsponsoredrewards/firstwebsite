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

    const handleAdminAuthentication = async (e) => {
        e.preventDefault();

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
        }
    };

    // ----------------------------------------------------
    // WORKSPACE CORE SYSTEM STATES
    // ----------------------------------------------------
    const [drops, setDrops] = useState(initialDrops);
    const [sponsors, setSponsors] = useState(sponsorsList);

    // MODULE 1 STATE: SPONSOR DATA
    const [sponsorForm, setSponsorForm] = useState({ name: '', logo_url: '', website_url: '' });

    const handleCreateSponsor = (e) => {
        e.preventDefault();
        if (!sponsorForm.name) return;

        const newSponsor = {
            id: Date.now(),
            name: sponsorForm.name.toUpperCase(),
            logo_url: sponsorForm.logo_url || '#',
            website_url: sponsorForm.website_url || '#'
        };

        setSponsors(prev => [...prev, newSponsor].sort((a, b) => a.name.localeCompare(b.name)));
        setSponsorForm({ name: '', logo_url: '', website_url: '' });
    };

    // MODULE 2 STATE: DROP INGESTION DATA
    const computedNextDropNumber = useMemo(() => {
        if (!drops || drops.length === 0) return 1;
        const maxDrop = Math.max(...drops.map(d => d.drop_number || 0));
        return maxDrop + 1;
    }, [drops]);

    const [dropForm, setDropForm] = useState({ title: '', keyword: '', instagram_url: '', custom_drop_number: '' });
    const [selectedSponsor, setSelectedSponsor] = useState(null);

    const handleCreateDrop = (e) => {
        e.preventDefault();
        if (!dropForm.title || !dropForm.keyword) return;

        const assignedDropNum = Number(dropForm.custom_drop_number) || computedNextDropNumber;

        const createdDrop = {
            id: Date.now(),
            drop_number: assignedDropNum,
            title: dropForm.title.toUpperCase(),
            keyword: dropForm.keyword.toUpperCase(),
            instagram_url: dropForm.instagram_url || '#',
            created_at: new Date().toISOString(),
            sponsors: selectedSponsor,
            winners: []
        };

        setDrops(prev => [createdDrop, ...prev]);
        setDropForm({ title: '', keyword: '', instagram_url: '', custom_drop_number: '' });
        setSelectedSponsor(null);
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

    const handleAddWinner = (e) => {
        e.preventDefault();
        if (!activeSelectedTarget || !winnerForm.username || !winnerForm.amount) return;

        const newWinner = {
            id: Date.now(),
            username: winnerForm.username.replace('@', '').trim(),
            amount: Number(winnerForm.amount),
            payment_proof_url: winnerForm.payment_proof_url || '#'
        };

        setDrops(prev => prev.map(d => {
            if (d.id === activeSelectedTarget.id) {
                return { ...d, winners: [...(d.winners || []), newWinner] };
            }
            return d;
        }));

        setWinnerForm({ username: '', amount: '', payment_proof_url: '' });
    };

    // ----------------------------------------------------
    // SECURITY GATE WALL RENDER LAYER
    // ----------------------------------------------------
    if (!isAuthenticated) {
        return (
            <div className="h-screen w-screen bg-[#EFF1F5] font-mono text-xs flex items-center justify-center p-4 relative select-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#DBDEE5_1px,transparent_1px),linear-gradient(to_bottom,#DBDEE5_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40 z-0" />

                <div className="w-full max-w-[400px] bg-[#E4E7EB]/90 backdrop-blur-md border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(45,49,57,1)] relative z-10">
                    <div className="flex items-center gap-2 border-b-2 border-black pb-3 mb-4">
                        <div className="w-2 h-4 bg-[#DC2626] animate-pulse" />
                        <h1 className="font-black tracking-widest text-[#2D3139] uppercase text-[11px]">
                            RESTRICTED ENTRY CORE BARRIER
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
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                placeholder="••••••••••••••"
                                className="w-full text-black bg-[#EFF1F5] border-2 border-black p-3 text-[11px] font-bold focus:outline-none focus:bg-white tracking-widest rounded-none"
                            />
                        </div>

                        {authError && (
                            <div className="bg-[#FEE2E2] border border-[#EF4444] p-2 text-[8px] text-[#B91C1C] font-black tracking-widest uppercase">
                // SYSTEM REJECT: INCORRECT CORE ACCESS KEYPHRASE SECURE TOKEN
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-black hover:bg-[#2D3139] text-white font-black text-[10px] tracking-widest uppercase py-3 transition-all shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] active:translate-x-0.5 active:translate-y-0.5 rounded-none"
                        >
                            VALIDATE SECURITY CLEARED IDENT
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
                        <div className="w-2 h-4 bg-[#059669]" />
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
                            // 1. Lock the gate barrier interface layer
                            setIsAuthenticated(false);

                            // 2. Wipe authorization memory logs completely
                            setPasswordInput('');
                            setAuthError(false);

                            // 3. Clear transient dropdown reference overlays
                            setSelectedSponsor(null);
                            setTargetedDropSelection(null);

                            // 4. Reset transaction data forms to empty structures
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
            {/* Optimized: "lg:overflow-y-visible" to let dropdowns hang out without form viewport clipping */}
            <main className="flex-1 max-w-[1600px] w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 md:p-8 min-h-0 relative z-10 overflow-y-auto lg:overflow-y-visible">

                {/* PART 1: BRAND SPONSOR ARCHIVE STORAGE CONTAINER */}
                <section className="bg-[#E4E7EB]/70 backdrop-blur-md border-2 border-[#2D3139] p-4 shadow-[3px_3px_0px_0px_rgba(45,49,57,1)] flex flex-col justify-between shrink-0 lg:h-full">
                    <div className="w-full">
                        <div className="flex items-center gap-2 border-b border-[#C8CCD4] pb-2 mb-4">
                            <span className="w-1.5 h-1.5 bg-black" />
                            <h2 className="text-[10px] font-black text-[#2D3139] tracking-widest uppercase">[01 // SPONSOR INGESTION]</h2>
                        </div>

                        <form onSubmit={handleCreateSponsor} className="space-y-4">
                            <div>
                                <label className="text-[8px] font-black text-[#626A7A] uppercase tracking-widest block mb-1">PARTNER BRAND NAME</label>
                                <input
                                    type="text" required value={sponsorForm.name}
                                    onChange={(e) => setSponsorForm({ ...sponsorForm, name: e.target.value })}
                                    placeholder="EX: ACME CORP INDUSTRIAL"
                                    className="w-full bg-[#EFF1F5] border-2 border-[#2D3139] p-2 text-[10px] font-bold focus:outline-none focus:bg-white uppercase rounded-none shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                                />
                            </div>

                            <div>
                                <label className="text-[8px] font-black text-[#626A7A] uppercase tracking-widest block mb-1">LOGO IMAGE LINK</label>
                                <input
                                    type="url" value={sponsorForm.logo_url}
                                    onChange={(e) => setSponsorForm({ ...sponsorForm, logo_url: e.target.value })}
                                    placeholder="https://cdn.platform.com/logo.png"
                                    className="w-full bg-[#EFF1F5] border-2 border-[#2D3139] p-2 text-[10px] font-bold focus:outline-none focus:bg-white rounded-none shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                                />
                            </div>

                            <div>
                                <label className="text-[8px] font-black text-[#626A7A] uppercase tracking-widest block mb-1">REDIRECT TARGET URL</label>
                                <input
                                    type="url" value={sponsorForm.website_url}
                                    onChange={(e) => setSponsorForm({ ...sponsorForm, website_url: e.target.value })}
                                    placeholder="https://acme-industrial.zone"
                                    className="w-full bg-[#EFF1F5] border-2 border-[#2D3139] p-2 text-[10px] font-bold focus:outline-none focus:bg-white rounded-none shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#2D3139] hover:bg-black text-white font-black text-[9px] tracking-widest uppercase py-2.5 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-none"
                            >
                                COMMIT SPONSOR ENTRY
                            </button>
                        </form>
                    </div>
                </section>

                {/* PART 2: DROP CAMPAIGN INGESTION CONTROLLER ENGINE */}
                <section className="bg-[#E4E7EB]/70 backdrop-blur-md border-2 border-[#2D3139] p-4 shadow-[3px_3px_0px_0px_rgba(45,49,57,1)] flex flex-col justify-between shrink-0 lg:h-full relative">
                    <form onSubmit={handleCreateDrop} className="space-y-4 h-full flex flex-col justify-between">
                        <div className="space-y-4 w-full">
                            <div className="flex items-center gap-2 border-b border-[#C8CCD4] pb-2 mb-4">
                                <span className="w-1.5 h-1.5 bg-black" />
                                <h2 className="text-[10px] font-black text-[#2D3139] tracking-widest uppercase">[02 // REWARD DROP GENERATOR]</h2>
                            </div>

                            <div>
                                <label className="text-[8px] font-black text-[#626A7A] uppercase tracking-widest block mb-1">DROP SYSTEM NUMBER</label>
                                <input
                                    type="number" value={dropForm.custom_drop_number}
                                    onChange={(e) => setDropForm({ ...dropForm, custom_drop_number: e.target.value })}
                                    placeholder={`AUTO INCREMENT: #${String(computedNextDropNumber).padStart(3, '0')}`}
                                    className="w-full bg-[#EFF1F5] border-2 border-[#2D3139] p-2 text-[10px] font-black tracking-widest focus:outline-none placeholder-[#2D3139]/50 rounded-none shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                                />
                            </div>

                            <div>
                                <label className="text-[8px] font-black text-[#626A7A] uppercase tracking-widest block mb-1">DROP CAMPAIGN TITLE</label>
                                <input
                                    type="text" required value={dropForm.title}
                                    onChange={(e) => setDropForm({ ...dropForm, title: e.target.value })}
                                    placeholder="EX: CYBERPUNK CLOTHING SWEEPSTAKES"
                                    className="w-full bg-[#EFF1F5] border-2 border-[#2D3139] p-2 text-[10px] font-bold focus:outline-none focus:bg-white uppercase rounded-none shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                                />
                            </div>

                            <div>
                                <label className="text-[8px] font-black text-[#626A7A] uppercase tracking-widest block mb-1">INSTAGRAM REEL LINK</label>
                                <input
                                    type="url" value={dropForm.instagram_url}
                                    onChange={(e) => setDropForm({ ...dropForm, instagram_url: e.target.value })}
                                    placeholder="https://instagram.com/reel/..."
                                    className="w-full bg-[#EFF1F5] border-2 border-[#2D3139] p-2 text-[10px] font-bold focus:outline-none focus:bg-white rounded-none shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                                />
                            </div>

                            <div>
                                <label className="text-[8px] font-black text-[#626A7A] uppercase tracking-widest block mb-1">TARGET TRACER KEYWORD</label>
                                <input
                                    type="text" required value={dropForm.keyword}
                                    onChange={(e) => setDropForm({ ...dropForm, keyword: e.target.value })}
                                    placeholder="EX: TECHNOCORE"
                                    className="w-full bg-[#EFF1F5] border-2 border-[#2D3139] p-2 text-[10px] font-bold focus:outline-none focus:bg-white uppercase rounded-none shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                                />
                            </div>

                            <div>
                                <label className="text-[8px] font-black text-[#626A7A] uppercase tracking-widest block mb-1">ASSIGN SPONSOR AFFILIATION PROFILE</label>
                                <SearchableSelect
                                    options={sponsors}
                                    selected={selectedSponsor}
                                    onChange={setSelectedSponsor}
                                    placeholder="ATTACH BRAND PARTNER..."
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#2D3139] hover:bg-black text-white font-black text-[9px] tracking-widest uppercase py-2.5 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mt-4 rounded-none shrink-0"
                        >
                            INITIALIZE REWARD ENGINE SEGMENT
                        </button>
                    </form>
                </section>

                {/* PART 3: WINNER ALLOCATION DISBURSER LEDGER MODULE */}
                <section className="bg-[#E4E7EB]/70 backdrop-blur-md border-2 border-[#2D3139] p-4 shadow-[3px_3px_0px_0px_rgba(45,49,57,1)] flex flex-col justify-between shrink-0 lg:h-full relative">
                    <form onSubmit={handleAddWinner} className="space-y-4 h-full flex flex-col justify-between">
                        <div className="space-y-4 w-full">
                            <div className="flex items-center gap-2 border-b border-[#C8CCD4] pb-2 mb-4">
                                <span className="w-1.5 h-1.5 bg-black" />
                                <h2 className="text-[10px] font-black text-[#2D3139] tracking-widest uppercase">[03 // WINNER TRANSACTION DISBURSER]</h2>
                            </div>

                            <div>
                                <label className="text-[8px] font-black text-[#626A7A] uppercase tracking-widest block mb-1">TARGETED DISTRIBUTION DESTINATION DROP</label>
                                <SearchableSelect
                                    options={dropSelectionOptions}
                                    selected={activeSelectedTarget}
                                    onChange={setTargetedDropSelection}
                                    placeholder="SELECT ALLOCATED DROP REGISTRY..."
                                />
                            </div>

                            <div>
                                <label className="text-[8px] font-black text-[#626A7A] uppercase tracking-widest block mb-1">RECIPIENT ACCOUNT ALIAS</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-[#8A94A6] text-[10px]">@</span>
                                    <input
                                        type="text" required value={winnerForm.username}
                                        onChange={(e) => setWinnerForm({ ...winnerForm, username: e.target.value })}
                                        placeholder="ALPHA_RECIPIENT"
                                        className="w-full bg-[#EFF1F5] border-2 border-[#2D3139] pl-6 pr-2 py-2 text-[10px] font-bold focus:outline-none focus:bg-white rounded-none shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[8px] font-black text-[#626A7A] uppercase tracking-widest block mb-1">DISBURSEMENT QUANTITY (INR)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-[#8A94A6] text-[10px]">₹</span>
                                    <input
                                        type="number" required value={winnerForm.amount}
                                        onChange={(e) => setWinnerForm({ ...winnerForm, amount: e.target.value })}
                                        placeholder="5,000"
                                        className="w-full bg-[#EFF1F5] border-2 border-[#2D3139] pl-6 pr-2 py-2 text-[10px] font-black tracking-wider focus:outline-none focus:bg-white rounded-none shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[8px] font-black text-[#626A7A] uppercase tracking-widest block mb-1">TRANSACTION CLEARANCE PROOF LINK</label>
                                <input
                                    type="url" value={winnerForm.payment_proof_url}
                                    onChange={(e) => setWinnerForm({ ...winnerForm, payment_proof_url: e.target.value })}
                                    placeholder="https://imgur.com/receipt-proof-hash"
                                    className="w-full bg-[#EFF1F5] border-2 border-[#2D3139] p-2 text-[10px] font-bold focus:outline-none focus:bg-white rounded-none shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={!activeSelectedTarget}
                            className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-[#8A94A6] text-white font-black text-[9px] tracking-widest uppercase py-2.5 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mt-4 rounded-none shrink-0"
                        >
                            EXECUTE SECURE ACCOUNT ENTRY CLEARANCE
                        </button>
                    </form>
                </section>

            </main>
        </div>
    );
}