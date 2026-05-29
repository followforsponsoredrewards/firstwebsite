export default function WinnerCard({ winner }) {
  if (!winner) return null;

  return (
    <div className="flex items-center justify-between bg-[#DCE0E6]/80 border border-[#C8CCD4] p-2 hover:bg-[#D2D6DC] transition-colors shrink-0">
      <div className="flex items-center gap-1.5 min-w-0">
        <div className="w-1 h-1 bg-[#059669] shrink-0" />
        <span className="text-[10px] text-[#3A4454] font-bold truncate">
          @{winner.username}
        </span>
      </div>
      
      <div className="flex items-center gap-2 shrink-0 pl-2">
        <span className="text-[#059669] font-black tracking-tight text-[10px]">
          +₹{winner.amount?.toLocaleString('en-IN')}
        </span>
        
        {winner.payment_proof_url && winner.payment_proof_url !== '#' ? (
          <a 
            href={winner.payment_proof_url} 
            target="_blank" 
            rel="noreferrer" 
            className="bg-[#2D3139] hover:bg-black text-white text-[7px] font-black px-1.5 py-0.5 tracking-widest transition-colors uppercase border border-transparent"
          >
            PROOF ↗
          </a>
        ) : (
          <span className="text-[6px] text-[#8A94A6] bg-[#D2D6DC] px-1.5 py-0.5 border border-[#C8CCD4] select-none font-black tracking-widest">
            PENDING_CLEARANCE
          </span>
        )}
      </div>
    </div>
  );
}