import React, { useState, useEffect } from 'react';
import { 
  Search, SlidersHorizontal, ChevronRight, Home, User, 
  Activity, Heart, Copy, HelpCircle, FileText, MessageSquare,
  Loader2, RefreshCw, Wallet, PieChart, Settings, LogOut, Trash2
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip, XAxis } from 'recharts';

export default function InvestneetFullApp() {
  const [activeMenu, setActiveMenu] = useState('home'); 
  const [momentumScore, setMomentumScore] = useState(20);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [isLoading, setIsLoading] = useState(true);
  
  const [stockList, setStockList] = useState([]); 
  const [selectedStock, setSelectedStock] = useState(null); 
  const [favorites, setFavorites] = useState([]); 

  // 🔑 API Key ของคุณ
  const API_KEY = 'd8npv6pr01qvvn99tpr0d8npv6pr01qvvn99tprg'; 
  
  // 📊 ลิสต์ 60 หุ้นชั้นนำ (เต็มโควต้า API ฟรีพอดี)
  const symbolsToScan = [
    // Tech & AI
    'AAPL', 'TSLA', 'MSFT', 'META', 'GOOGL', 'AMZN', 'NVDA', 'NFLX', 'AMD', 'INTC', 
    'CRM', 'ADBE', 'CSCO', 'ORCL', 'IBM', 'QCOM', 'TXN', 'AVGO', 'MU', 'NOW',
    // Finance & Payment
    'JPM', 'BAC', 'WFC', 'C', 'GS', 'MS', 'V', 'MA', 'PYPL', 'AXP',
    // Consumer & Retail
    'WMT', 'TGT', 'COST', 'HD', 'LOW', 'SBUX', 'MCD', 'NKE', 'KO', 'PEP',
    // Healthcare & Bio
    'JNJ', 'UNH', 'PFE', 'ABBV', 'TMO', 'MRK', 'DHR', 'LLY', 'AMGN', 'MDT',
    // Industrial, Energy & Telecom
    'BA', 'CAT', 'LMT', 'MMM', 'GE', 'CVX', 'XOM', 'DIS', 'VZ', 'T'
  ];

  // ฟังก์ชันเสกสมองกลกราฟ
  const getDynamicChartData = (stock) => {
    if (!stock) return [];
    const basePrice = parseFloat(stock.price);
    if (isNaN(basePrice) || basePrice === 0) return [];
    const isUp = stock.change.includes('+');
    
    return [
      { time: '14 พ.ค.', price: +(basePrice * (isUp ? 0.93 : 1.06)).toFixed(2) },
      { time: '15 พ.ค.', price: +(basePrice * (isUp ? 0.96 : 1.03)).toFixed(2) },
      { time: '16 พ.ค.', price: +(basePrice * (isUp ? 0.94 : 1.05)).toFixed(2) },
      { time: '17 พ.ค.', price: +(basePrice * (isUp ? 0.98 : 1.02)).toFixed(2) },
      { time: '18 พ.ค.', price: +(basePrice * (isUp ? 0.97 : 1.04)).toFixed(2) },
      { time: '19 พ.ค.', price: +(basePrice * (isUp ? 0.99 : 1.01)).toFixed(2) },
      { time: '20 พ.ค.', price: basePrice }
    ];
  };

  // โหลดข้อมูล Watchlist จากเครื่อง
  useEffect(() => {
    const savedFavs = localStorage.getItem('myWatchlist');
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
  }, []);

  // กดหัวใจ
  const toggleFavorite = (symbol) => {
    let newFavs = favorites.includes(symbol) ? favorites.filter(fav => fav !== symbol) : [...favorites, symbol];
    setFavorites(newFavs);
    localStorage.setItem('myWatchlist', JSON.stringify(newFavs));
  };

  // ดึงข้อมูล API ทีเดียว 60 ตัว!
  const fetchLiveMarketData = async () => {
    setIsLoading(true);
    try {
      const promises = symbolsToScan.map(async (symbol) => {
        const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`);
        const data = await response.json();

        if (data.error || typeof data.c === 'undefined' || data.c === 0) {
           return { id: symbol, symbol: symbol, name: `${symbol} Inc.`, price: '0.00', change: 'API Error', score: 0, marketCap: '-' };
        }

        return {
          id: symbol, symbol: symbol, name: `${symbol} Inc.`, 
          price: data.c.toFixed(2),
          change: data.dp ? (data.dp > 0 ? `+${data.dp.toFixed(2)}%` : `${data.dp.toFixed(2)}%`) : '0.00%',
          score: Math.floor(Math.random() * 40) + 60, marketCap: 'Large Cap' 
        };
      });

      const realStocksData = await Promise.all(promises);
      setStockList(realStocksData);
      
      if (realStocksData.length > 0 && !selectedStock) {
         setSelectedStock(realStocksData[0]);
      }

    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchLiveMarketData();
  }, []);

  // RENDER: แผงกราฟด้านขวา
  const renderDetailPanel = () => (
    <div className="w-[350px] bg-[#FAF6EE] rounded-2xl p-5 border border-[#EBE5D8] flex flex-col gap-4 flex-shrink-0 shadow-sm relative">
      {selectedStock ? (
        <>
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase">{selectedStock.name} • US MARKET</p>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-black text-[#3E3A35]">{selectedStock.symbol}</h1>
              <button 
                onClick={() => toggleFavorite(selectedStock.symbol)}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors shadow-sm ${
                  favorites.includes(selectedStock.symbol) ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-gray-300 text-gray-400 hover:text-red-400'
                }`}
              >
                <Heart className={`w-5 h-5 ${favorites.includes(selectedStock.symbol) ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          <div className="flex gap-1 bg-[#EBE5D8] p-1 rounded-lg">
            <button className="flex-1 bg-[#2B303A] text-white text-xs font-bold py-1.5 rounded-md">Price Trend</button>
            <button className="flex-1 text-[#3E3A35] text-xs font-bold py-1.5 rounded-md hover:bg-white/50">Details</button>
          </div>

          <div className="h-[200px] w-full bg-white border border-[#EBE5D8] rounded-xl pt-4 pr-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getDynamicChartData(selectedStock)}>
                <XAxis dataKey="time" hide />
                <YAxis domain={['auto', 'auto']} orientation="left" tick={{fontSize: 10, fill: '#9CA3AF'}} axisLine={false} tickLine={false} width={45} />
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Line type="monotone" dataKey="price" stroke="#8FA872" strokeWidth={2} dot={{r: 3, fill: '#8FA872'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div>
            <div className="flex items-end gap-2 mb-4">
              <h2 className="text-3xl font-black text-[#2B303A]">${selectedStock.price} <span className="text-sm font-bold text-gray-400">USD</span></h2>
              <span className={`font-bold text-sm mb-1 ${selectedStock.change.includes('+') ? 'text-[#8FA872]' : 'text-red-500'}`}>{selectedStock.change}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-y-3 text-xs mb-4">
              <div className="flex justify-between pr-4"><span className="text-gray-500 font-bold">MARKET CAP</span><span className="font-black">Large</span></div>
              <div className="flex justify-between"><span className="text-gray-500 font-bold">AI SCAN SCORE</span><span className="font-black">{selectedStock.score}</span></div>
            </div>

            <div className="flex gap-3 mt-auto">
              <button className="flex-1 bg-[#8FA872] text-white font-bold py-3 rounded-xl shadow-sm hover:bg-[#7D9661]">Buy</button>
              <button className="flex-1 bg-white border border-gray-300 text-gray-700 font-bold py-3 rounded-xl shadow-sm hover:bg-gray-50">Sell</button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 opacity-50">
          <Activity className="w-12 h-12 mb-2" />
          <p className="text-sm font-bold">กำลังโหลดข้อมูลกราฟ...</p>
        </div>
      )}
    </div>
  );

  // RENDER: หน้า HOME
  const renderHomeView = () => {
    const filteredStocks = stockList.filter(stock => stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
      <>
        <div className="w-[300px] flex flex-col gap-5 flex-shrink-0 animate-in fade-in duration-300">
          <div>
            <p className="text-[11px] font-bold text-[#8FA872] mb-1">ค้นหาหุ้น</p>
            <input 
              type="text" placeholder="ค้นหาจาก 60 หุ้นชั้นนำ..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#EBE5D8] rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#8FA872] transition-colors shadow-sm" 
            />
          </div>
          <button onClick={fetchLiveMarketData} disabled={isLoading} className="w-full bg-[#8FA872] hover:bg-[#7D9661] disabled:bg-[#A7C08A] text-white py-3 rounded-xl font-bold shadow-sm flex items-center justify-center gap-2 text-sm tracking-widest uppercase">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : '▶ REAL-TIME SCAN'}
          </button>
          <div className="bg-[#FAF6EE] rounded-xl p-4 border border-[#EBE5D8]">
            <div className="flex justify-between text-center text-xs text-gray-500 mb-2"><div>ตลาด<br/><span className="text-sm font-bold text-[#3E3A35]">US Global</span></div><div>สแกนพบ<br/><span className="text-sm font-bold text-[#3E3A35]"> {filteredStocks.length} หุ้น</span></div></div>
            <div className="w-full h-2 rounded-full bg-gradient-to-r from-blue-600 via-green-500 to-[#8FA872] mb-2"></div><p className="text-[10px] text-gray-500 text-center">ดึงข้อมูลจริงจาก Finnhub API (Max 60)</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4 animate-in fade-in duration-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold tracking-widest text-[#8FA872] uppercase mb-1">LIVE DATA STREAMING</p>
              <h2 className="text-xl font-black text-[#3E3A35] flex items-center gap-2"><span className="w-6 h-6 bg-[#EBE5D8] rounded-full flex items-center justify-center text-sm">🌐</span>ราคาหุ้นอเมริกาแบบเรียลไทม์</h2>
            </div>
          </div>
          <div className="bg-[#FAF6EE] rounded-xl border border-[#EBE5D8] overflow-hidden relative min-h-[300px]">
            {isLoading && (<div className="absolute inset-0 bg-[#FAF6EE]/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center"><Loader2 className="w-8 h-8 text-[#8FA872] animate-spin mb-2" /><span className="text-sm font-bold text-[#8FA872] mt-2">กำลังดึงราคาหุ้น 60 ตัว... (อาจใช้เวลาสักครู่)</span></div>)}
            <div className="max-h-[600px] overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-[#FAF6EE] z-20 shadow-sm"><tr className="text-[10px] font-bold text-gray-400 uppercase border-b border-[#EBE5D8]"><th className="py-3 px-4">หุ้น (Symbol)</th><th className="py-3 px-2 text-right">ราคา</th><th className="py-3 px-2 text-right">เปลี่ยนแปลง</th><th className="py-3 px-4 text-right">AI SCORE</th></tr></thead>
                <tbody className="divide-y divide-[#EBE5D8]">
                  {filteredStocks.map((stock, idx) => (
                    <tr key={idx} onClick={() => setSelectedStock(stock)} className={`transition-colors cursor-pointer ${selectedStock?.symbol === stock.symbol ? 'bg-white shadow-sm ring-1 ring-[#8FA872]' : 'hover:bg-white'}`}>
                      <td className="py-3 px-4"><div className="font-black text-sm text-[#3E3A35]">{stock.symbol}</div><div className="text-[10px] text-gray-500">{stock.name}</div></td>
                      <td className="py-3 px-2 text-right font-black text-sm text-[#2B303A]">${stock.price}</td>
                      <td className="py-3 px-2 text-right"><span className={`font-bold text-sm px-2 py-1 rounded-md ${stock.change.includes('+') ? 'bg-green-100 text-green-700' : (stock.change === 'API Error' ? 'bg-gray-100 text-gray-500' : 'bg-red-100 text-red-700')}`}>{stock.change}</span></td>
                      <td className="py-3 px-4 text-right font-black text-[#3E3A35]">{stock.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredStocks.length === 0 && !isLoading && <div className="p-8 text-center text-gray-400 font-bold">ไม่พบหุ้นที่ค้นหา หรือ API ขัดข้อง</div>}
          </div>
        </div>

        {renderDetailPanel()}
      </>
    );
  };

  // RENDER: หน้า WATCHLIST
  const renderWatchlistView = () => {
    const favoriteStocks = stockList.filter(stock => favorites.includes(stock.symbol));
    return (
      <>
        <div className="flex-1 flex flex-col gap-4 animate-in slide-in-from-bottom-4 duration-300">
          <header className="mb-4">
            <p className="text-[10px] font-bold tracking-widest text-[#8FA872] uppercase mb-1">PERSONAL PORTFOLIO</p>
            <h1 className="text-3xl font-black text-[#3E3A35] flex items-center gap-3"><Heart className="w-8 h-8 text-red-500 fill-current" /> My Watchlist</h1>
            <p className="text-sm text-gray-500 mt-2">หุ้นที่คุณติดตามไว้ทั้งหมด {favorites.length} รายการ (บันทึกในเครื่อง)</p>
          </header>

          <div className="bg-[#FAF6EE] rounded-xl border border-[#EBE5D8] overflow-hidden relative min-h-[300px]">
            {favoriteStocks.length > 0 ? (
              <div className="max-h-[600px] overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-[#FAF6EE] z-20 shadow-sm"><tr className="text-[10px] font-bold text-gray-400 uppercase border-b border-[#EBE5D8]"><th className="py-3 px-4">หุ้น (Symbol)</th><th className="py-3 px-2 text-right">ราคา</th><th className="py-3 px-2 text-right">เปลี่ยนแปลง</th><th className="py-3 px-4 text-center">ลบ</th></tr></thead>
                  <tbody className="divide-y divide-[#EBE5D8]">
                    {favoriteStocks.map((stock, idx) => (
                      <tr key={idx} onClick={() => setSelectedStock(stock)} className={`transition-colors cursor-pointer ${selectedStock?.symbol === stock.symbol ? 'bg-white shadow-sm ring-1 ring-[#8FA872]' : 'hover:bg-white'}`}>
                        <td className="py-3 px-4"><div className="font-black text-sm text-[#3E3A35]">{stock.symbol}</div></td>
                        <td className="py-3 px-2 text-right font-black text-sm text-[#2B303A]">${stock.price}</td>
                        <td className="py-3 px-2 text-right"><span className={`font-bold text-sm px-2 py-1 rounded-md ${stock.change.includes('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{stock.change}</span></td>
                        <td className="py-3 px-4 text-center">
                          <button onClick={(e) => { e.stopPropagation(); toggleFavorite(stock.symbol); }} className="text-gray-300 hover:text-red-500 transition-colors p-1"><Trash2 className="w-4 h-4 mx-auto" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-gray-400"><Heart className="w-12 h-12 mb-3 opacity-20" /><p className="font-bold">ยังไม่มีหุ้นใน Watchlist</p><button onClick={() => setActiveMenu('home')} className="mt-4 px-4 py-2 bg-[#8FA872] text-white rounded-lg text-sm font-bold shadow-sm">ไปหาหุ้นกันเลย</button></div>
            )}
          </div>
        </div>
        {renderDetailPanel()}
      </>
    );
  };

  // RENDER: หน้า PROFILE
  const renderProfileView = () => (
    <div className="flex-1 w-full max-w-4xl mx-auto flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-300">
      <header className="bg-[#FAF6EE] rounded-3xl p-8 border border-[#EBE5D8] flex items-center gap-6 shadow-sm">
        <div className="w-24 h-24 bg-[#EBE5D8] rounded-full flex items-center justify-center border-4 border-white shadow-sm"><User className="w-12 h-12 text-gray-400" /></div>
        <div>
          <h1 className="text-3xl font-black text-[#3E3A35]">Guest Investor</h1>
          <p className="text-sm text-gray-500 mt-1">Free Plan • สมัครเมื่อ 14 มิ.ย. 2026</p>
          <div className="flex gap-2 mt-3"><span className="bg-[#8FA872] text-white text-xs font-bold px-3 py-1 rounded-full">API Connected</span></div>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-[#EBE5D8] shadow-sm">
          <div className="flex items-center gap-3 mb-4"><Wallet className="w-6 h-6 text-[#8FA872]" /><h2 className="text-lg font-bold">Paper Trading Balance</h2></div>
          <p className="text-4xl font-black text-[#2B303A]">$100,000.00</p>
          <p className="text-sm text-gray-500 mt-1">เงินจำลองสำหรับฝึกเทรด</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-[#EBE5D8] shadow-sm">
          <div className="flex items-center gap-3 mb-4"><PieChart className="w-6 h-6 text-blue-500" /><h2 className="text-lg font-bold">Portfolio Stats</h2></div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm"><span className="text-gray-500">หุ้นที่ติดตาม (Watchlist)</span><span className="font-bold">{favorites.length} ตัว</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">ความแม่นยำ AI</span><span className="font-bold text-[#8FA872]">84%</span></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#EBE5D8] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#EBE5D8] hover:bg-gray-50 cursor-pointer flex justify-between items-center"><div className="flex items-center gap-3"><Settings className="w-5 h-5 text-gray-400"/><span className="font-bold">ตั้งค่าบัญชีและ API</span></div><ChevronRight className="w-4 h-4 text-gray-300"/></div>
        <div className="p-4 border-b border-[#EBE5D8] hover:bg-gray-50 cursor-pointer flex justify-between items-center"><div className="flex items-center gap-3"><HelpCircle className="w-5 h-5 text-gray-400"/><span className="font-bold">ช่วยเหลือและศูนย์สนับสนุน</span></div><ChevronRight className="w-4 h-4 text-gray-300"/></div>
        <div className="p-4 hover:bg-red-50 cursor-pointer flex justify-between items-center text-red-500"><div className="flex items-center gap-3"><LogOut className="w-5 h-5"/><span className="font-bold">ออกจากระบบ</span></div></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#3E3A35] font-sans flex relative selection:bg-[#8FA872] selection:text-white">
      
      {/* SIDEBAR */}
      <nav className="w-16 bg-[#2B303A] text-[#8FA872] flex flex-col items-center py-6 fixed h-full z-50 transition-all">
        <div className="bg-blue-600 w-full h-12 mb-6 flex items-center justify-center shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"><Activity className="w-6 h-6 text-white" /></div>
        <div className="flex flex-col gap-8 flex-1 w-full items-center mt-4">
          <button onClick={() => setActiveMenu('home')} className={`transition-colors relative ${activeMenu === 'home' ? 'text-white' : 'text-gray-400 hover:text-[#A7C08A]'}`}><Home className="w-6 h-6" />{activeMenu === 'home' && <span className="absolute -left-5 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#8FA872] rounded-r-md"></span>}</button>
          <button onClick={() => setActiveMenu('watchlist')} className={`transition-colors relative ${activeMenu === 'watchlist' ? 'text-white' : 'text-gray-400 hover:text-[#A7C08A]'}`}><Heart className="w-6 h-6" /><span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">{favorites.length}</span>{activeMenu === 'watchlist' && <span className="absolute -left-5 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#8FA872] rounded-r-md"></span>}</button>
          <button onClick={() => setActiveMenu('profile')} className={`transition-colors relative ${activeMenu === 'profile' ? 'text-white' : 'text-gray-400 hover:text-[#A7C08A]'}`}><User className="w-6 h-6" />{activeMenu === 'profile' && <span className="absolute -left-5 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#8FA872] rounded-r-md"></span>}</button>
          <div className="w-8 h-px bg-gray-600 my-2"></div>
          <button className="text-gray-500 hover:text-white transition-colors"><Search className="w-5 h-5" /></button>
          <button className="text-gray-500 hover:text-white transition-colors"><MessageSquare className="w-5 h-5" /></button>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <div className="ml-16 flex w-full max-w-7xl mx-auto p-6 gap-6 h-screen overflow-y-auto pb-10">
        {activeMenu === 'home' && renderHomeView()}
        {activeMenu === 'watchlist' && renderWatchlistView()}
        {activeMenu === 'profile' && renderProfileView()}
      </div>

    </div>
  );
}