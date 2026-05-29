'use client';

import { useState } from 'react';
import WinnerCard from './WinnerCard';

export default function DropCard({ initialDrop, isAdminContext = false }) {
  const [drop, setDrop] = useState(initialDrop);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Administrative Winner Entry State Variables
  const [winnerForm, setWinnerForm] = useState({ username: '', amount: '', proof: '' });

  const handleAddWinner = (e) => {
    e.preventDefault();
    if (!winnerForm.username || !winnerForm.amount) return;

    const newWinner = {
      id: Date.now(),
      username: winnerForm.username.replace('@', '').trim(),
      amount: Number(winnerForm.amount),
      payment_proof_url: winnerForm.proof || '#'
    };

    setDrop(prev => ({
      ...prev,
      winners: [...(prev.winners || []), newWinner]
    }));
    setWinnerForm({ username: '', amount: '', proof: '' });
  };

  const totalWinnersCount = drop.winners?.length || 0;

  return (
    <div 
      onClick={() => setIsExpanded(!isExpanded)}
      className="bg-[#E4E7EB]/70 backdrop-blur-md border-2 border-[#2D3139] rounded-none overflow-hidden grid grid-cols-1 md:grid-cols-12 shadow-[3px_3px_0px_0px_rgba(45,49,57,1)] hover:shadow-[4px_4px_0px_0px_rgba(45,49,57,1)] cursor-pointer select-none transition-all duration-200"
    >
      {/* CARD CONTENT BODY AREA */}
      <div className="md:col-span-8 p-4 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#C8CCD4] pb-1.5">
            <div className="flex items-center gap-2">
              <span className="bg-[#2D3139] text-white text-[8px] font-black px-1.5 py-0.2 tracking-widest">
                DROP #{String(drop.drop_number).padStart(3, '0')}
              </span>
              <h3 className="text-xs font-black text-[#2D3139] tracking-wide uppercase truncate max-w-[220px]">
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
            <div>KEYWORD TRACE: <span className="text-[#2D3139] font-black">{drop.keyword}</span></div>
            {drop.instagram_url && drop.instagram_url !== '#' && (
              <a 
                href={drop.instagram_url} target="_blank" rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-[#2D3139] hover:text-black font-black border-b border-[#2D3139] pb-0.5 tracking-widest"
              >
                REEL VECTOR ↗
              </a>
            )}
          </div>
        </div>

        {/* WINNER DATA SUB-MATRIX BLOCK AREA */}
        <div className="space-y-1.5" onClick={(e) => e.stopPropagation()}>
          {totalWinnersCount > 0 ? (
            isExpanded ? (
              <div className="space-y-1 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#B8BCC6]">
                {drop.winners.map((winner) => (
                  <WinnerCard key={winner.id} winner={winner} />
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                <WinnerCard winner={drop.winners[0]} />
                {totalWinnersCount > 1 && (
                  <div className="flex justify-end pt-0.5">
                    <span className="bg-[#2D3139] text-white px-1.5 py-0.2 text-[7px] font-bold tracking-widest">
                      +{totalWinnersCount - 1} SECURE NODES ALLOCATED
                    </span>
                  </div>
                )}
              </div>
            )
          ) : (
            <div className="text-left text-[#8A94A6] tracking-widest text-[8px] font-bold">// NO RECIPROCATOR LEDGER DISBURSEMENT REGISTERED</div>
          )}
        </div>

        {/* ADMINISTRATIVE WRITE DATA INTERFACE SUB-PANEL */}
        {isAdminContext && isExpanded && (
          <div className="border-t-2 border-dashed border-[#2D3139] pt-3 mt-2" onClick={(e) => e.stopPropagation()}>
            <div className="text-[8px] font-black text-red-600 tracking-widest uppercase mb-2">// DIRECT WINNER SEED INJECTOR</div>
            <form onSubmit={handleAddWinner} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input 
                type="text" required placeholder="USERNAME (E.G. JOHN_DOE)"
                value={winnerForm.username} onChange={(e) => setWinnerForm({...winnerForm, username: e.target.value})}
                className="bg-[#EFF1F5] border border-[#2D3139] p-1.5 text-[9px] font-bold rounded-none placeholder-[#8A94A6]"
              />
              <input 
                type="number" required placeholder="REWARD VAL (INR)"
                value={winnerForm.amount} onChange={(e) => setWinnerForm({...winnerForm, amount: e.target.value})}
                className="bg-[#EFF1F5] border border-[#2D3139] p-1.5 text-[9px] font-bold rounded-none placeholder-[#8A94A6]"
              />
              <button 
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-black text-[8px] tracking-widest uppercase rounded-none transition-colors"
              >
                PUSH ENTRY
              </button>
            </form>
          </div>
        )}
      </div>

      {/* SPONSOR SYSTEM COMPONENT INSIGNIA SHIELD */}
      <div className="md:col-span-4 bg-[#DCE0E6]/50 border-t md:border-t-0 md:border-l border-[#2D3139] p-4 flex flex-col items-center justify-center text-center self-stretch min-h-[120px]">
        {drop.sponsors ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            {drop.sponsors.logo_url && drop.sponsors.logo_url !== '#' ? (
              <div className="w-full h-16 flex items-center justify-center">
                <img src={drop.sponsors.logo_url} alt={drop.sponsors.name} className="w-full h-full object-contain max-h-full" />
              </div>
            ) : (
              <div className="w-7 h-7 bg-[#2D3139] text-white flex items-center justify-center font-black text-[10px] uppercase">{drop.sponsors.name.charAt(0)}</div>
            )}
            <div>
              <div className="text-[7px] text-[#626A7A] tracking-widest font-black uppercase">PARTNER IDENTITY</div>
              <div className="text-[9px] font-black text-[#2D3139] uppercase truncate max-w-[140px] mt-0.5">{drop.sponsors.name}</div>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-[7px] text-[#8A94A6] tracking-widest font-black uppercase">LEDGER ACCESS STATUS</div>
            <div className="text-[9px] text-[#626A7A] tracking-widest mt-0.5 font-black uppercase">NATIVE PLATFORM SELF-SUPPORTED</div>
          </div>
        )}
      </div>
    </div>
  );
}