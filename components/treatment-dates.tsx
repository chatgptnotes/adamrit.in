interface TreatmentDatesProps {
  conservativeStart: string;
  conservativeEnd: string;
  surgicalStart: string;
  surgicalEnd: string;
  conservativeStart2: string;
  conservativeEnd2: string;
  onDateChange: (field: string, value: string) => void;
}

export function TreatmentDates({
  conservativeStart,
  conservativeEnd,
  surgicalStart,
  surgicalEnd,
  conservativeStart2,
  conservativeEnd2,
  onDateChange
}: TreatmentDatesProps) {
  return (
    <div className="flex flex-col md:flex-row gap-2 mb-3 p-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100/50">
      <div className="flex-1">
        <label className="block text-[10px] font-medium mb-0.5 text-gray-700 tracking-wide">Pre-Surgical Conservative Start</label>
        <input 
          type="date" 
          value={conservativeStart} 
          onChange={e => onDateChange('conservativeStart', e.target.value)} 
          className="border border-blue-200/60 rounded-lg px-2 py-1.5 bg-white/90 focus:border-blue-400 focus:ring-1 focus:ring-blue-200/50 transition-all duration-300 text-[10px] font-medium w-full" 
        />
      </div>
      <div className="flex-1">
        <label className="block text-[10px] font-medium mb-0.5 text-gray-700 tracking-wide">Pre-Surgical Conservative End</label>
        <input 
          type="date" 
          value={conservativeEnd} 
          onChange={e => onDateChange('conservativeEnd', e.target.value)} 
          className="border border-blue-200/60 rounded-lg px-2 py-1.5 bg-white/90 focus:border-blue-400 focus:ring-1 focus:ring-blue-200/50 transition-all duration-300 text-[10px] font-medium w-full" 
        />
      </div>
      <div className="flex-1">
        <label className="block text-[10px] font-medium mb-0.5 text-gray-700 tracking-wide">Surgical Start</label>
        <input 
          type="date" 
          value={surgicalStart} 
          onChange={e => onDateChange('surgicalStart', e.target.value)} 
          className="border border-blue-200/60 rounded-lg px-2 py-1.5 bg-white/90 focus:border-blue-400 focus:ring-1 focus:ring-blue-200/50 transition-all duration-300 text-[10px] font-medium w-full" 
        />
      </div>
      <div className="flex-1">
        <label className="block text-[10px] font-medium mb-0.5 text-gray-700 tracking-wide">Surgical End</label>
        <input 
          type="date" 
          value={surgicalEnd} 
          onChange={e => onDateChange('surgicalEnd', e.target.value)} 
          className="border border-blue-200/60 rounded-lg px-2 py-1.5 bg-white/90 focus:border-blue-400 focus:ring-1 focus:ring-blue-200/50 transition-all duration-300 text-[10px] font-medium w-full" 
        />
      </div>
      <div className="flex-1">
        <label className="block text-[10px] font-medium mb-0.5 text-gray-700 tracking-wide">Post-Surgical Conservative Start</label>
        <input 
          type="date" 
          value={conservativeStart2} 
          onChange={e => onDateChange('conservativeStart2', e.target.value)} 
          className="border border-blue-200/60 rounded-lg px-2 py-1.5 bg-white/90 focus:border-blue-400 focus:ring-1 focus:ring-blue-200/50 transition-all duration-300 text-[10px] font-medium w-full" 
        />
      </div>
      <div className="flex-1">
        <label className="block text-[10px] font-medium mb-0.5 text-gray-700 tracking-wide">Post-Surgical Conservative End</label>
        <input 
          type="date" 
          value={conservativeEnd2} 
          onChange={e => onDateChange('conservativeEnd2', e.target.value)} 
          className="border border-blue-200/60 rounded-lg px-2 py-1.5 bg-white/90 focus:border-blue-400 focus:ring-1 focus:ring-blue-200/50 transition-all duration-300 text-[10px] font-medium w-full" 
        />
      </div>
    </div>
  );
} 