'use client';

import { useState } from 'react';

export default function ClientDashboard({ initialDrops, stats }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDrops, setExpandedDrops] = useState({});
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);

  const toggleDropExpand = (id) => {
    setExpandedDrops(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredDrops = initialDrops.filter(drop => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    const matchesDrop = 
      drop.title.toLowerCase().includes(query) ||
      drop.keyword.toLowerCase().includes(query) ||
      `drop #${drop.drop_number}`.includes(query);

    const matchesSponsor = drop.sponsors?.name?.toLowerCase().includes(query);
    const matchesWinner = drop.winners?.some(winner => 
      winner.username.toLowerCase().includes(query)
    );

    return matchesDrop || matchesSponsor || matchesWinner;
  });

  // Pull all winners across all drops, sorted in decreasing order (highest drop numbers first)
  const allWinnersDecreasing = [...initialDrops]
    .sort((a, b) => b.drop_number - a.drop_number)
    .flatMap(drop => 
      (drop.winners || []).map(w => ({ 
        ...w, 
        dropNumber: drop.drop_number
      }))
    );

  return (
    <div className="h-screen bg-[#EFF1F5] text-[#3A4454] font-mono text-xs selection:bg-black/10 flex flex-col overflow-hidden relative">
      
      {/* GROUND BLUEPRINT GRID MATRIX PATTERN */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#DBDEE5_1px,transparent_1px),linear-gradient(to_bottom,#DBDEE5_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40 z-0" />

      {/* SYSTEM NAVIGATION HEADER BAR */}
      <header className="w-full bg-[#EFF1F5]/80 backdrop-blur-md border-b-2 border-[#2D3139] p-4 md:px-8 py-4 z-20 shrink-0 relative">
        <div className="max-w-[1600px] mx-auto flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-4 bg-[#2D3139]" />
              <h1 className="text-xs md:text-sm font-black tracking-widest text-[#2D3139] uppercase">
                FOLLOW FOR SPONSORED REWARDS
              </h1>
            </div>
            <p className="text-[8px] md:text-[9px] text-[#626A7A] uppercase mt-0.5 tracking-widest font-bold">
              JUST FOLLOW TO STAY UPDATED..!
            </p>
          </div>

          {/* DYNAMIC HIGH-CONTRAST RESPONSE SEARCH SYSTEM */}
          <div className="w-full lg:w-[540px] relative group">
            <div className="absolute -top-1 -left-1 w-1.5 h-1.5 border-t border-l border-[#2D3139] group-focus-within:border-black transition-colors z-30" />
            <div className="absolute -bottom-1 -right-1 w-1.5 h-1.5 border-b border-r border-[#2D3139] group-focus-within:border-black transition-colors z-30" />
            
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none select-none z-20">
              <span className="text-[9px] font-black tracking-wider text-[#626A7A] group-focus-within:text-[#2D3139] transition-colors">
                SEARCH:
              </span>
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="WINNER, DROP, KEYWORD, DATE, OR SPONSOR..."
              className="w-full bg-[#E4E7EB]/90 backdrop-blur-sm border-2 border-[#2D3139] rounded-none pl-16 pr-14 py-2 text-[10px] text-[#2D3139] font-black tracking-wider placeholder-[#8A94A6] focus:outline-none focus:bg-white focus:border-black focus:shadow-[3px_3px_0px_0px_rgba(45,49,57,1)] transition-all uppercase shadow-[2px_2px_0px_0px_rgba(45,49,57,1)]"
            />

            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center z-20">
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')} 
                  className="bg-[#2D3139] text-[#EFF1F5] hover:bg-black px-2 py-0.5 text-[8px] font-black tracking-wider transition-colors uppercase border border-transparent"
                >
                  CLEAR
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* CORE FRAMEWORK CONTROLLER WORKSPACE CONTAINER */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-8 min-h-0 relative z-10 overflow-y-auto lg:overflow-hidden">
        
        {/* METRICS AND LIVE FEED STREAM SIDEBAR TRACK (4 COLS WIDTH) */}
        <div className="lg:col-span-4 flex flex-col gap-5 min-h-0 shrink-0 lg:h-full">
          
          {/* HIGH IMPACT ROW STATS BLOCK */}
          <div className="bg-[#E4E7EB]/70 backdrop-blur-md border-2 border-[#2D3139] p-4 shadow-[3px_3px_0px_0px_rgba(45,49,57,1)] flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4 divide-x divide-[#C8CCD4]">
              <div className="flex flex-col justify-center pl-1">
                <span className="text-[20px] md:text-2xl font-black text-[#059669] tracking-tight leading-none">
                  ₹{stats.total_distributed?.toLocaleString('en-IN') || 0}
                </span>
                <span className="text-[8px] text-[#626A7A] uppercase tracking-widest font-black mt-1">
                  TOTAL REWARDS
                </span>
              </div>

              <div className="flex flex-col justify-center pl-4">
                <span className="text-[20px] md:text-2xl font-black text-[#2D3139] tracking-widest leading-none">
                  {String(stats.total_drops || 0).padStart(2, '0')}
                </span>
                <span className="text-[8px] text-[#626A7A] uppercase tracking-widest font-black mt-1">
                  TOTAL DROPS
                </span>
              </div>
            </div>

            {/* TOGGLE BUTTON: Rendered EXCLUSIVELY on mobile displays via hidden lg:block rules */}
            <button 
              onClick={() => setIsMobilePanelOpen(true)}
              className="lg:hidden w-full bg-[#2D3139] hover:bg-black text-white font-black text-[9px] tracking-widest uppercase py-2.5 transition-all active:translate-y-0.5 border border-transparent"
            >
              LATEST WINNERS LIST ({allWinnersDecreasing.length})
            </button>
          </div>

          {/* DESKTOP PERSISTENT TRANSACTION FEED LAYER - Renders natively on PC, hidden on Mobile */}
          <div className="hidden lg:flex bg-[#E4E7EB]/70 backdrop-blur-md border-2 border-[#2D3139] p-4 shadow-[3px_3px_0px_0px_rgba(45,49,57,1)] flex-col flex-1 min-h-0">
            <div className="flex items-center justify-between border-b border-[#C8CCD4] pb-2 mb-2 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#2D3139] rounded-none animate-pulse" />
                <h2 className="text-[10px] font-black text-[#2D3139] tracking-widest uppercase">LATEST WINNERS LIST</h2>
              </div>
              <span className="text-[8px] font-bold text-[#8A94A6]">LIVE_FEED</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-[#B8BCC6]">
              {allWinnersDecreasing.length > 0 ? (
                allWinnersDecreasing.map((winner, idx) => (
                  <div 
                    key={`desktop-feed-${winner.id}-${idx}`} 
                    className="bg-[#DCE0E6]/80 border border-[#C8CCD4] px-3 py-1.5 flex items-center justify-between hover:bg-[#D2D6DC] transition-colors shrink-0"
                  >
                    <div className="min-w-0">
                      <div className="text-[10px] text-[#2D3139] font-black truncate">@{winner.username}</div>
                      <div className="text-[7px] text-[#626A7A] tracking-widest uppercase mt-0.5 font-bold">DROP #{String(winner.dropNumber).padStart(2, '0')}</div>
                    </div>
                    <span className="text-[#059669] font-black text-[11px] shrink-0 pl-2">
                      +₹{winner.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center text-[#8A94A6] py-8 text-[9px] tracking-widest font-bold">
                  // NO TRANSACTION RECORDS LOGGED
                </div>
              )}
            </div>
          </div>
          {/* FLOATING INSTAGRAM ANCHOR LINK LINK (MOBILE ORIENTED - BOTTOM LEFT PORT) */}
          <a
            href="https://www.instagram.com/followforsponsoredrewards"
            target="_blank"
            rel="noopener noreferrer"
            className=" justify-center bg-[#2D3139] text-[1.5vh] hover:bg-black text-white font-mono font-black lg:text-sm  tracking-widest uppercase py-2.5 px-3 border-2 border-black flex items-center gap-2 shadow-[3px_3px_0px_0px_rgba(250,0,150,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all select-none touch-manipulation"
          >
            {/* BRUTALIST GLITCH-STYLE INSTA ICON */}
            <svg
              className="w-4.5 h-4.5 fill-current shrink-0"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>

            <span className="font-black tracking-widest pt-0.5">FOLLOW FOR SPONSORED REWARDS</span>

          </a>

        </div>

        {/* DATA CENTRAL LOG DISPLAY SYSTEM AREA (8 COLS WIDTH) */}
        {/* Takes remaining space cleanly on phone layouts, matching screen z-index naturally */}
        <div className="lg:col-span-8 overflow-y-auto lg:h-full pr-1 space-y-4 scrollbar-thin scrollbar-thumb-[#B8BCC6] min-h-0">
          {filteredDrops.length > 0 ? (
            filteredDrops.map((drop) => {
              const isExpanded = !!expandedDrops[drop.id];
              const totalWinnersCount = drop.winners?.length || 0;
              const remainingCount = totalWinnersCount - 1;

              return (
                <div 
                  key={drop.id} 
                  onClick={() => toggleDropExpand(drop.id)}
                  className="bg-[#E4E7EB]/70 backdrop-blur-md border-2 border-[#2D3139] rounded-none overflow-hidden grid grid-cols-1 md:grid-cols-12 shadow-[3px_3px_0px_0px_rgba(45,49,57,1)] hover:shadow-[4px_4px_0px_0px_rgba(45,49,57,1)] cursor-pointer select-none transition-all duration-200"
                >
                  
                  {/* CENTRAL ATTRIBUTE META STORAGE SUBBLOCK CONTAINER */}
                  <div className="md:col-span-8 p-4 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#C8CCD4] pb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="bg-[#2D3139] text-white text-[8px] font-black px-1.5 py-0.2 rounded-none tracking-widest">
                            DROP #{String(drop.drop_number).padStart(3, '0')}
                          </span>
                          <h3 className="text-xs font-black text-[#2D3139] tracking-wide uppercase truncate max-w-[160px] md:max-w-[220px]">
                            {drop.title}
                          </h3>
                        </div>
                        
                        {drop.created_at && (
                          <div className="text-[8px] text-[#626A7A] font-black tracking-widest">
                            [{new Date(drop.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}]
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between text-[8px] text-[#626A7A] tracking-widest mt-1.5 font-bold">
                        <div>KEYWORD: <span className="text-[#2D3139] font-black">{drop.keyword}</span></div>
                        
                        {drop.instagram_url && drop.instagram_url !== '#' && (
                          <a 
                            href={drop.instagram_url} 
                            target="_blank" 
                            rel="noreferrer" 
                            onClick={(e) => e.stopPropagation()}
                            className="text-[#2D3139] hover:text-black font-black border-b border-[#2D3139] pb-0.5 transition-all text-[8px] tracking-widest"
                          >
                            REEL LINK ↗
                          </a>
                        )}
                      </div>
                    </div>

                    {/* EXPANDABLE RECIPIENT BLOCK WORK DESK AREA */}
                    <div className="space-y-1 transition-all duration-300">
                      {drop.winners && totalWinnersCount > 0 ? (
                        <>
                          {isExpanded ? (
                            <div className="space-y-1 max-h-[140px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#B8BCC6]">
                              {drop.winners.map((winner) => (
                                <div 
                                  key={winner.id} 
                                  className="flex items-center justify-between bg-[#DCE0E6]/80 border border-[#C8CCD4] p-2 hover:bg-[#D2D6DC] transition-colors"
                                >
                                  <span className="text-[10px] text-[#3A4454] font-bold">@{winner.username}</span>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-[#059669] font-black">₹{winner.amount.toLocaleString('en-IN')}</span>
                                    {winner.payment_proof_url && winner.payment_proof_url !== '#' ? (
                                      <a 
                                        href={winner.payment_proof_url} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        onClick={(e) => e.stopPropagation()}
                                        className="bg-[#2D3139] text-white hover:bg-black px-1.5 py-0.2 text-[8px] font-black tracking-widest transition-colors uppercase"
                                      >
                                        PROOF
                                      </a>
                                    ) : (
                                      <span className="text-[7px] text-[#8A94A6] bg-[#D2D6DC] px-1.5 py-0.2 border border-[#C8CCD4] select-none font-bold">PENDING</span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-1 relative">
                              <div className="flex items-center justify-between bg-[#DCE0E6]/80 border border-[#C8CCD4] p-2">
                                <span className="text-[10px] text-[#3A4454] font-bold">@{drop.winners[0].username}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-[#059669] font-black">₹{drop.winners[0].amount.toLocaleString('en-IN')}</span>
                                  <span className="text-[7px] text-[#2D3139] font-bold tracking-widest border border-[#2D3139] px-1 py-0.2">01</span>
                                </div>
                              </div>

                              {drop.winners[1] && (
                                <div className="flex items-center justify-between bg-[#DCE0E6]/30 border border-[#C8CCD4]/40 p-1.5 opacity-40 mix-blend-multiply select-none">
                                  <span className="text-[9px] text-[#3A4454] font-medium">@{drop.winners[1].username}</span>
                                  <span className="text-[#059669]/70 font-bold">₹{drop.winners[1].amount.toLocaleString('en-IN')}</span>
                                </div>
                              )}

                              {remainingCount > 0 && (
                                <div className="flex justify-end pt-0.5">
                                  <span className="bg-[#2D3139] text-white px-1.5 py-0.2 text-[7px] font-bold tracking-widest">
                                    +{remainingCount} MORE
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-left text-[#8A94A6] py-1 tracking-widest text-[8px] font-bold">
                          // WINNER ALLOCATION INDEX EMPTY
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SPONSOR BOX BOUNDS AREA ASSIGNMENT SHIELD */}
                  <div className="md:col-span-4 bg-[#DCE0E6]/50 border-t md:border-t-0 md:border-l border-[#2D3139] p-4 flex flex-col items-center justify-center text-center relative self-stretch min-h-[120px]">
                    {drop.sponsors ? (
                      <a 
                        href={drop.sponsors.website_url || '#'} 
                        target="_blank" 
                        rel="noreferrer" 
                        onClick={(e) => e.stopPropagation()}
                        className="w-full h-full flex flex-col items-center justify-center gap-2 group/sponsor relative z-10"
                      >
                        {drop.sponsors.logo_url && drop.sponsors.logo_url !== '#' ? (
                          <div className="w-full h-20 flex items-center justify-center transition-transform group-hover/sponsor:scale-[1.02] duration-200">
                            <img 
                              src={drop.sponsors.logo_url} 
                              alt={drop.sponsors.name} 
                              className="w-full h-full object-contain max-h-full"
                              onError={(e) => e.target.parentNode.style.display = 'none'}
                            />
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-[#2D3139] text-white flex items-center justify-center font-black text-xs uppercase">
                            {drop.sponsors.name.charAt(0)}
                          </div>
                        )}
                        
                        <div className="max-w-full px-1">
                          <div className="text-[7px] text-[#626A7A] tracking-widest font-black uppercase">SPONSORED BY</div>
                          <div className="text-[10px] font-black text-[#2D3139] group-hover/sponsor:text-black transition-colors tracking-wide truncate max-w-[150px] uppercase mt-0.5">
                            {drop.sponsors.name}
                          </div>
                        </div>
                      </a>
                    ) : (
                      <div className="relative z-10">
                        <div className="text-[7px] text-[#8A94A6] tracking-widest font-black uppercase">LEDGER STATUS</div>
                        <div className="text-[9px] text-[#626A7A] tracking-widest mt-0.5 font-black uppercase">DIRECT ACCESS</div>
                      </div>
                    )}
                  </div>

                </div>
              );
            })
          ) : (
            <div className="bg-[#E4E7EB]/70 backdrop-blur-md border-2 border-[#2D3139] border-dashed p-12 text-center text-[#8A94A6] tracking-widest font-bold">
              // NO SYSTEM registries FOUND MATCHING FILTER RULES
            </div>
          )}
        </div>
      </main>

      {/* INDUSTRIAL SLIDING POPUP MODAL ARCHITECTURE SHEET - MOBILE ONLY */}
      {isMobilePanelOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex flex-col justify-end">
          <div className="absolute inset-0" onClick={() => setIsMobilePanelOpen(false)} />
          
          <div className="bg-[#EFF1F5] border-t-4 border-[#2D3139] w-full max-h-[75vh] flex flex-col relative z-10 p-5 shadow-[0_-8px_24px_rgba(0,0,0,0.15)]">
            <div className="flex items-center justify-between border-b-2 border-[#2D3139] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-black animate-pulse" />
                <h3 className="text-xs font-black text-[#2D3139] tracking-widest uppercase">LATEST WINNERS REGISTER</h3>
              </div>
              <button 
                onClick={() => setIsMobilePanelOpen(false)}
                className="bg-[#2D3139] text-white px-2 py-0.5 text-[9px] font-black uppercase hover:bg-black"
              >
                CLOSE [X]
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 pb-4 scrollbar-thin">
              {allWinnersDecreasing.length > 0 ? (
                allWinnersDecreasing.map((winner, idx) => (
                  <div 
                    key={`mobile-modal-winner-${winner.id}-${idx}`} 
                    className="bg-[#E4E7EB] border border-[#C8CCD4] p-3 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-[11px] text-[#2D3139] font-black">@{winner.username}</div>
                      <div className="text-[8px] text-[#626A7A] tracking-widest uppercase mt-0.5 font-bold">DROP #{String(winner.dropNumber).padStart(2, '0')}</div>
                    </div>
                    <span className="text-[#059669] font-black text-xs">
                      +₹{winner.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center text-[#8A94A6] py-12 text-[10px] tracking-widest font-bold">
                  // NO RECORDS FOUND WITHIN THE TRANSACTION REGISTER
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
