'use client';

import { useState, useRef, useEffect, useLayoutEffect } from 'react';

export default function SearchableSelect({ options = [], selected, onChange, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState('down'); // 'down' or 'up'
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Dynamically calculate whether to open up or down based on screen real estate
  useLayoutEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const dropdownHeight = 172; // Height allocated for 5 items + search box

    // If space below is limited and there is more space above, open upwards
    if (spaceBelow < dropdownHeight && rect.top > spaceBelow) {
      setDropdownPosition('up');
    } else {
      setDropdownPosition('down');
    }
  }, [isOpen]);

  const filteredOptions = options.filter(opt => 
    opt.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={containerRef} className="relative w-full">
      {/* SELECTION TRIGGER BAR */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#EFF1F5] border-2 border-[#2D3139] p-2 text-[10px] font-black cursor-pointer flex justify-between items-center text-[#2D3139] hover:bg-white transition-colors select-none touch-manipulation shadow-[1px_1px_0px_0px_rgba(45,49,57,1)]"
      >
        <span className="uppercase tracking-widest truncate max-w-[90%]">
          {selected ? selected.name : placeholder}
        </span>
        <span className="text-[7px] font-black shrink-0 pl-1">{isOpen ? '▲' : '▼'}</span>
      </div>

      {/* DESKTOP FLOATING SMART VIEWPORT DETECTOR DROPDOWN */}
      {isOpen && (
        <div 
          ref={dropdownRef}
          className={`hidden sm:flex absolute left-0 right-0 bg-[#EFF1F5] border-2 border-black z-50 flex-col h-[172px] ${
            dropdownPosition === 'up' 
              ? 'bottom-full mb-1 shadow-[4px_-4px_0px_0px_rgba(0,0,0,1)]' 
              : 'top-full mt-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
          }`}
        >
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="FILTER ENTRIES SYSTEM LOG..."
            className="p-2 text-[9px] bg-white border-b-2 border-black font-black tracking-widest text-[#2D3139] focus:outline-none uppercase shrink-0"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="flex-1 overflow-y-auto divide-y divide-[#C8CCD4] bg-[#EFF1F5] scrollbar-thin scrollbar-thumb-black">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className="p-2 h-[28px] text-[9px] font-black uppercase hover:bg-[#2D3139] hover:text-white transition-colors cursor-pointer flex items-center gap-2 truncate"
                >
                  {opt.logo_url && opt.logo_url !== '#' && (
                    <img src={opt.logo_url} alt="" className="w-3.5 h-3.5 object-contain shrink-0 bg-white p-0.5 border border-[#2D3139]" />
                  )}
                  <span className="tracking-wider truncate">{opt.name}</span>
                </div>
              ))
            ) : (
              <div className="p-3 text-[8px] text-[#8A94A6] font-black uppercase tracking-widest text-center">// NO RECORD MATCH</div>
            )}
          </div>
        </div>
      )}

      {/* MOBILE FULL IMMERSIVE SHEET LAYOUT PANEL (Guarantees zero cutoffs on mobile viewports) */}
      {isOpen && (
        <div className="sm:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex flex-col justify-end" onClick={() => setIsOpen(false)}>
          <div 
            className="bg-[#EFF1F5] border-t-4 border-black w-full max-h-[60vh] flex flex-col p-4 shadow-[0_-8px_24px_rgba(0,0,0,0.3)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3 shrink-0">
              <span className="text-[9px] font-black text-[#2D3139] tracking-widest uppercase">// SELECT TARGET CONFIGURATION</span>
              <button 
                onClick={() => setIsOpen(false)}
                className="bg-black text-white px-2 py-0.5 text-[8px] font-black uppercase"
              >
                DONE [X]
              </button>
            </div>

            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="TYPE TO SEARCH REGISTER..."
              className="w-full p-2.5 text-[10px] bg-white border-2 border-black font-black tracking-widest text-[#2D3139] focus:outline-none uppercase shrink-0 mb-2 rounded-none"
            />

            <div className="flex-1 overflow-y-auto divide-y divide-[#C8CCD4] bg-[#E4E7EB] border border-[#C8CCD4]">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => {
                      onChange(opt);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className="p-3 text-[10px] font-black uppercase active:bg-[#2D3139] active:text-white flex items-center gap-3 truncate touch-manipulation"
                  >
                    {opt.logo_url && opt.logo_url !== '#' && (
                      <img src={opt.logo_url} alt="" className="w-4 h-4 object-contain shrink-0 bg-white p-0.5 border border-[#2D3139]" />
                    )}
                    <span className="tracking-wider truncate">{opt.name}</span>
                  </div>
                ))
              ) : (
                <div className="p-6 text-[9px] text-[#8A94A6] font-black uppercase tracking-widest text-center">// NO RECORDS STORED MATCHING MATRIX</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}