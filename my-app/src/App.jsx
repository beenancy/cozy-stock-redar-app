import React, { useState } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  Leaf, 
  TrendingUp, 
  BarChart2, 
  ChevronRight, 
  Home, 
  Bookmark, 
  User,
  Activity,
  Box,
  Sparkles
} from 'lucide-react';

export default function StockRedarBrightMinimal() {
  const [activeTab, setActiveTab] = useState('1D');
  const [momentumScore, setMomentumScore] = useState(40);

  // ข้อมูลจำลองหุ้น
  const stockList = [
    { id: 1, symbol: 'SDOT', name: 'Sadot Group', price: '20.11', change: '+105.2%', score: 81, tag: 'High Vol' },
    { id: 2, symbol: 'STAK', name: 'STAK Inc.', price: '7.50', change: '+24.2%', score: 98, tag: 'Breakout' },
    { id: 3, symbol: 'PETZ', name: 'TDH Holdings', price: '1.61', change: '+32.8%', score: 83, tag: 'Micro Cap' },
    { id: 4, symbol: 'EXPI', name: 'eXp World', price: '5.74', change: '+30.6%', score: 62, tag: 'Value' },
  ];

  return (
    <div className="min-h-screen bg-[#F6F9FC] text-[#1E293B] font-sans pb-28 max-w-md mx-auto shadow-2xl relative selection:bg-[#3B82F6] selection:text-white">
      
      {/* --- HEADER --- */}
      <header className="px-6 pt-8 pb-4 flex justify-between items-center bg-[#F6F9FC]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold tracking-widest text-[#94A3B8] uppercase mb-1">Portfolio Scanner</span>
          <h1 className="text-xl font-black tracking-tight text-[#0F172A] flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#3B82F6] stroke-[2.5]" />
            Stock Redar
          </h1>
        </div>
        <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-[#E2E8F0] text-[#3B82F6] hover:bg-[#EFF6FF] transition-colors">
          <SlidersHorizontal className="w-4 h-4 stroke-[2.5]" />
        </button>
      </header>

      {/* --- SEARCH (Clean White) --- */}
      <div className="px-6 mb-6">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] group-focus-within:text-[#3B82F6] transition-colors" />
          <input 
            type="text" 
            placeholder="ค้นหาหุ้น หรือคีย์เวิร์ด..." 
            className="w-full bg-white border border-[#E2E8F0] rounded-full py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-4 focus:ring-[#DBEAFE] transition-all shadow-sm placeholder:text-[#CBD5E1] font-medium"
          />
        </div>
      </div>

      {/* --- BENTO MENU (Pastel Pop Grid) --- */}
      <div className="px-6 mb-8">
        <div className="flex justify-between items-end mb-3">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#94A3B8]">Market Catalogs</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {/* Bento Box 1: Bright Blue */}
          <div className="col-span-2 bg-[#3B82F6] text-white p-4 rounded-2xl shadow-md shadow-blue-500/20 cursor-pointer hover:bg-[#2563EB] transition-all flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                <Box className="w-5 h-5 text-white stroke-[2]" />
              </div>
              <div>
                <p className="text-sm font-bold">S&P 500 Core</p>
                <p className="text-[10px] text-blue-100 font-medium">ดัชนีหุ้นขนาดใหญ่ 500 ตัว</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-blue-200" />
          </div>

          {/* Bento Box 2: Pastel Yellow */}
          <div className="bg-[#FEF9C3] p-4 rounded-2xl shadow-sm cursor-pointer hover:bg-[#FEF08A] transition-colors flex flex-col justify-between aspect-[4/3] border border-[#FDE047]/30">
            <TrendingUp className="w-6 h-6 text-[#D97706] mb-2 stroke-[2]" />
            <div>
              <p className="text-sm font-bold text-[#92400E]">Nasdaq</p>
              <p className="text-[10px] font-medium text-[#B45309]">สายเทคโนโลยี</p>
            </div>
          </div>

          {/* Bento Box 3: Pastel Green */}
          <div className="bg-[#D1FAE5] p-4 rounded-2xl shadow-sm cursor-pointer hover:bg-[#A7F3D0] transition-colors flex flex-col justify-between aspect-[4/3] border border-[#6EE7B7]/30">
            <User className="w-6 h-6 text-[#059669] mb-2 stroke-[2]" />
            <div>
              <p className="text-sm font-bold text-[#065F46]">Alpha Pro</p>
              <p className="text-[10px] font-medium text-[#047857]">ผู้บริหารระดับสูง</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- SMART BANNER --- */}
      <div className="px-6 mb-8">
        <div className="bg-white rounded-2xl p-4 flex items-center justify-between cursor-pointer border border-[#E2E8F0] shadow-sm hover:border-[#3B82F6]/30 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#EFF6FF] rounded-full flex items-center justify-center text-[#3B82F6]">
              <Sparkles className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#1E293B]">ปรัชญาการจัดพอร์ต</p>
              <p className="text-[10px] font-medium text-[#64748B]">เคล็ดลับการลงทุนแบบเซน</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#CBD5E1]" />
        </div>
      </div>

      {/* --- FILTER & TIMEFRAME --- */}
      <div className="px-6 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#94A3B8]">Redar Settings</h2>
        </div>
        <div className="bg-white p-1.5 rounded-xl border border-[#E2E8F0] flex shadow-sm mb-4">
          {['1D', '1W', '1M', '3M', 'YTD'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === tab 
                  ? 'bg-[#3B82F6] text-white shadow-sm' 
                  : 'text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Minimal Slider */}
        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-medium text-[#64748B]">ระดับความเข้มข้น (Momentum)</span>
            <span className="text-xs font-black text-[#3B82F6] bg-[#DBEAFE] px-2 py-0.5 rounded-md">{momentumScore}</span>
          </div>
          <input 
            type="range"
            min="0"
            max="100"
            value={momentumScore}
            onChange={(e) => setMomentumScore(Number(e.target.value))}
            className="w-full accent-[#3B82F6] bg-[#E2E8F0] h-1.5 rounded-full appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* --- STOCK REDAR LIST --- */}
      <div className="px-6 mb-4">
        <h3 className="text-sm font-bold text-[#1E293B] mb-3">ผลการสแกนล่าสุด</h3>
        
        <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-sm">
          {stockList.map((item, index) => (
            <div 
              key={item.id}
              className={`p-4 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors cursor-pointer ${
                index !== stockList.length - 1 ? 'border-b border-[#F1F5F9]' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-8 text-center text-xs font-black text-[#CBD5E1]">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-sm text-[#0F172A]">{item.symbol}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-[#FEF9C3] text-[#D97706] font-bold">
                      {item.tag}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-[#64748B]">{item.name}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm font-black text-[#10B981] block mb-0.5">{item.change}</span>
                <span className="text-[11px] font-medium text-[#64748B]">${item.price} • M-Score: <span className="font-bold text-[#1E293B]">{item.score}</span></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- FLOATING BOTTOM NAV (Bright White Style) --- */}
      <div className="fixed bottom-6 left-0 right-0 max-w-sm mx-auto px-6 z-50">
        <div className="bg-white/90 backdrop-blur-md text-[#94A3B8] px-6 py-3 rounded-full flex justify-between items-center shadow-xl shadow-slate-200/50 border border-[#E2E8F0]">
          <button className="p-2 text-[#3B82F6] flex flex-col items-center">
            <Home className="w-5 h-5 stroke-[2.5]" />
          </button>
          <button className="p-2 hover:text-[#3B82F6] transition-colors flex flex-col items-center">
            <BarChart2 className="w-5 h-5 stroke-[2]" />
          </button>
          
          {/* Main Action (Scan) */}
          <button className="w-14 h-14 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center transition-transform active:scale-95 -mt-8 border-4 border-[#F6F9FC]">
            <Search className="w-6 h-6 stroke-[2.5]" />
          </button>

          <button className="p-2 hover:text-[#3B82F6] transition-colors flex flex-col items-center">
            <Bookmark className="w-5 h-5 stroke-[2]" />
          </button>
          <button className="p-2 hover:text-[#3B82F6] transition-colors flex flex-col items-center">
            <User className="w-5 h-5 stroke-[2]" />
          </button>
        </div>
      </div>

    </div>
  );
}