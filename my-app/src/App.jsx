import React, { useState, useEffect } from 'react';
// ✅ นำเข้า Loader2 และไอคอนทั้งหมดครบถ้วนแล้ว!
import { 
  Search, SlidersHorizontal, ChevronRight, Home, User, 
  Activity, Heart, Copy, HelpCircle, FileText, MessageSquare,
  Loader2, RefreshCw, Wallet, PieChart, Settings, LogOut, Trash2,
  TrendingUp, Zap, Skull
} from 'lucide-react';

export default function InvestneetFullApp() {
  const [activeMenu, setActiveMenu] = useState('home'); 
  const [searchQuery, setSearchQuery] = useState(''); 
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all'); // เรดาร์กรองหุ้น
  
  const [stockList, setStockList] = useState([]); 
  const [selectedStock, setSelectedStock] = useState(null); 
  const [favorites, setFavorites] = useState([]); 

  // 🔑 API Key ของคุณ
  const API_KEY = 'd8npv6pr01qvvn99tpr0d8npv6pr01qvvn99tprg'; 
  
  // 📊 ลิสต์ 30 หุ้นชั้นนำ
  const symbolsToScan = [
    'AAPL', 'TSLA', 'MSFT', 'META', 'GOOGL', 'AMZN', 'NVDA', 'NFLX', 'AMD', 'INTC', 
    'CRM', 'ADBE', 'CSCO', 'ORCL', 'IBM', 'QCOM', 'TXN', 'AVGO', 'MU', 'NOW',
    'JPM', 'BAC', 'WFC', 'C', 'GS', 'V', 'MA', 'PYPL', 'WMT', 'JNJ'
  ];

  // โหลด Watchlist
  useEffect(() => {
    const savedFavs = localStorage.getItem('myWatchlist');
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
  }, []);

  // ระบบกดหัวใจ
  const toggleFavorite = (symbol) => {
    let newFavs = favorites.includes(symbol) ? favorites.filter(fav => fav !== symbol) : [...favorites, symbol];
    setFavorites(newFavs);
    localStorage.setItem('myWatchlist', JSON.stringify(newFavs));
  };

  // ดึงข้อมูล API และสร้างสมองกลจำลอง (RSI, Volume)
  const fetchLiveMarketData = async () => {
    setIsLoading(true);
    try {
      const promises = symbolsToScan.map(async (symbol) => {
        const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`);
        const data = await response.json();

        if (data.error || typeof data.c === 'undefined' || data.c === 0) {
           return { id: symbol, symbol, name: `${symbol} Inc.`, price: '0.00', change: '0.00%', rawChange: 0, score: 0, rsi: 50, volSurge: 1.0, marketCap: '-' };
        }

        const isPositive = data.dp > 0;
        const mockRSI = isPositive ? Math.floor(Math.random() * 30) + 55 : Math.floor(Math.random() * 30) + 20;
        const mockVolSurge = (Math.random() * 5 + 0.5).toFixed(1);

        return {
          id: symbol, 
          symbol: symbol, 
          name: `${symbol} Inc.`, 
          price: data.c.toFixed(2),
          change: data.dp ? (data.dp > 0 ? `+${data.dp.toFixed(2)}%` : `${data.dp.toFixed(2)}%`) : '0.00%',
          rawChange: data.dp || 0,
          score: Math.floor(Math.random() * 40) + 60, 
          rsi: mockRSI,
          volSurge: parseFloat(mockVolSurge),
          marketCap: ['Small', 'Mid', 'Large', 'Mega'][Math.floor(Math.random() * 4)] + ' Cap'
        };
      });

      const realStocksData = await Promise.all(promises);
      setStockList(realStocksData);
      
      if (realStocksData.length > 0 && !selectedStock) setSelectedStock(realStocksData[0]);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchLiveMarketData();
  }, []);

  // 🎯 ระบบคัดกรองหุ้นตาม Radar
  const getFilteredStocks = () => {
    let filtered = stockList.filter(stock => stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeFilter === 'strong') {
      filtered = filtered.filter(s => s.rawChange > 0 && s.rsi > 60).sort((a, b) => b.rawChange - a.rawChange);
    } else if (activeFilter === 'darkhorse') {
      filtered = filtered.filter(s => s.volSurge > 2.5).sort((a, b) => b.volSurge - a.volSurge);
    } else if (activeFilter === 'revive') {
      filtered = filtered.filter(s => s.rsi < 45 && s.rawChange > 0).sort((a, b) => a.rsi - b.rsi);
    }
    return filtered;
  };

  const displayStocks = getFilteredStocks();

  // RENDER: แผงกราฟ TradingView ด้านขวา
  const renderDetailPanel = () => (
    <div className="w-[350px] bg-[#FAF6EE] rounded-2xl p-5 border border-[#EBE5D8] flex flex-col gap-4 flex-shrink-0 shadow-sm relative">
      {selectedStock ? (
        <>
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase">{selectedStock.name} • US MARKET</p>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-black text-[#3E3A35]">{selectedStock.symbol}</h1>
              <button onClick={() => toggleFavorite(selectedStock.symbol)} className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors shadow-sm ${favorites.includes(selectedStock.symbol) ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-gray-300 text-gray-400 hover:text-red-400'}`}>
                <Heart className={`w-5 h-5 ${favorites.includes(selectedStock.symbol) ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          <div className="flex gap-1 bg-[#EBE5D8] p-1 rounded-lg">
            <button className="flex-1 bg-[#2B303A] text-white text-xs font-bold py-1.5 rounded-md">Live Chart</button>
            <button className="flex-1 text-[#3E3A35] text-xs font-bold py-1.5 rounded-md hover:bg-white/50">Details</button>
          </div>

          <div className="h-[260px] w-full bg-white border border-[#EBE5D8] rounded-xl overflow-hidden shadow-inner">
            <iframe id={`tv-widget-${selectedStock.symbol}`} src={`https://s.tradingview.com/widgetembed/?frameElementId=tv-widget-${selectedStock.symbol}&symbol=${selectedStock.symbol}&interval=D&hidesidetoolbar=1&hidetoptoolbar=1&symboledit=0&saveimage=0&toolbarbg=fff&studies=[]&hideideas=1&theme=light&style=1&timezone=Asia%2FBangkok&locale=th`} style={{ width: '100%', height: '100%', border: 'none' }} title="TradingView" />
          </div>

          <div>
            <div className="flex items-end gap-2 mb-4">
              <h2 className="text-3xl font-black text-[#2B303A]">${selectedStock.price} <span className="text-sm font-bold text-gray-400">USD</span></h2>
              <span className={`font-bold text-sm mb-1 ${selectedStock.rawChange > 0 ? 'text-[#8FA872]' : 'text-red-500'}`}>{selectedStock.change}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-y-3 text-xs mb-4 bg-white p-3 rounded-lg border border-[#EBE5D8]">
              <div className="flex justify-between pr-4"><span className="text-gray-500 font-bold">MARKET CAP</span><span className="font-black">{selectedStock.marketCap}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 font-bold">RSI (14)</span><span className={`font-black ${selectedStock.rsi > 70 ? 'text-red-500' : selectedStock.rsi < 30 ? 'text-[#8FA872]' : ''}`}>{selectedStock.rsi}</span></div>
              <div className="flex justify-between pr-4"><span className="text-gray-500 font-bold">VOL SURGE</span><span className="font-black">{selectedStock.volSurge}x</span></div>
              <div className="flex justify-between"><span className="text-gray-500 font-bold">SCORE</span><span className="font-black">{selectedStock.score}</span></div>
            </div>

            <div className="flex gap-3 mt-auto">
              <button className="flex-1 bg-[#8FA872] text-white font-bold py-3 rounded-xl shadow-sm hover:bg-[#7D9661]">Buy</button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 opacity-50"><Activity className="w-12 h-12 mb-2" /><p className="text-sm font-bold">กำลังโหลด...</p></div>
      )}
    </div>
  );

  // VIEW 1: หน้า HOME (เรดาร์)
  const renderHomeView = () => (
    <>
      <div className="w-[280px] flex flex-col gap-5 flex-shrink-0 animate-in fade-in duration-300">
        <div>
          <p className="text-[11px] font-bold text-[#8FA872] mb-1">ค้นหาหุ้น</p>
          <input type="text" placeholder="ค้นหาหุ้น..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white border border-[#EBE5D8] rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#8FA872] shadow-sm" />
        </div>
        <button onClick={fetchLiveMarketData} disabled={isLoading} className="w-full bg-[#8FA872] text-white py-3 rounded-xl font-bold shadow-sm uppercase text-sm">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : '▶ Refresh Data'}
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-4 animate-in fade-in duration-300">
        <div className="bg-[#FAF6EE] p-4 rounded-xl border border-[#EBE5D8]">
          <p className="text-[11px] font-bold text-gray-500 mb-3 uppercase tracking-widest">Radar Ranking</p>
          <div className="grid grid-cols-4 gap-2">
            <button onClick={() => setActiveFilter('all')} className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${activeFilter === 'all' ? 'bg-[#8FA872] text-white border-[#8FA872]' : 'bg-white text-gray-600 border-[#EBE5D8] hover:border-[#8FA872]'}`}><Activity className="w-5 h-5 mb-1" /><span className="text-xs font-bold">TOP 30</span></button>
            <button onClick={() => setActiveFilter('darkhorse')} className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${activeFilter === 'darkhorse' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-[#EBE5D8] hover:border-purple-600'}`}><Zap className="w-5 h-5 mb-1" /><span className="text-xs font-bold">ม้ามืด</span></button>
            <button onClick={() => setActiveFilter('revive')} className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${activeFilter === 'revive' ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 border-[#EBE5D8] hover:border-orange-500'}`}><Skull className="w-5 h-5 mb-1" /><span className="text-xs font-bold">คืนชีพ</span></button>
            <button onClick={() => setActiveFilter('strong')} className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${activeFilter === 'strong' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-[#EBE5D8] hover:border-blue-600'}`}><TrendingUp className="w-5 h-5 mb-1" /><span className="text-xs font-bold">หุ้นแกร่ง</span></button>
          </div>
        </div>

        <div className="bg-[#FAF6EE] rounded-xl border border-[#EBE5D8] overflow-hidden relative flex-1 min-h-[300px]">
          {isLoading && (<div className="absolute inset-0 bg-[#FAF6EE]/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center"><Loader2 className="w-8 h-8 text-[#8FA872] animate-spin" /></div>)}
          <div className="max-h-[500px] overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-[#FAF6EE] z-20 shadow-sm"><tr className="text-[9px] font-bold text-gray-400 uppercase border-b border-[#EBE5D8]"><th className="py-3 px-4">หุ้น</th><th className="py-3 px-2 text-right">ราคา</th><th className="py-3 px-2 text-right">MARKET CAP</th><th className="py-3 px-2 text-right">1D (เปลี่ยน)</th><th className="py-3 px-4 text-right">RSI</th></tr></thead>
              <tbody className="divide-y divide-[#EBE5D8]">
                {displayStocks.map((stock, idx) => (
                  <tr key={idx} onClick={() => setSelectedStock(stock)} className={`transition-colors cursor-pointer ${selectedStock?.symbol === stock.symbol ? 'bg-white shadow-sm ring-1 ring-[#8FA872]' : 'hover:bg-white'}`}>
                    <td className="py-3 px-4"><div className="font-black text-sm text-[#3E3A35]">{stock.symbol}</div><div className="text-[10px] text-gray-500 truncate w-24">{stock.name}</div></td>
                    <td className="py-3 px-2 text-right font-black text-sm text-[#2B303A]">${stock.price}</td>
                    <td className="py-3 px-2 text-right text-xs text-gray-500 font-bold">{stock.marketCap}</td>
                    <td className="py-3 px-2 text-right"><span className={`font-bold text-[11px] px-2 py-1 rounded-md ${stock.rawChange > 0 ? 'text-green-600' : 'text-red-500'}`}>{stock.change}</span></td>
                    <td className="py-3 px-4 text-right font-black text-[#3E3A35]">{stock.rsi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {displayStocks.length === 0 && !isLoading && <div className="p-8 text-center text-gray-400 font-bold">ไม่พบหุ้นในหมวดหมู่นี้</div>}
        </div>
      </div>

      {renderDetailPanel()}
    </>
  );

  // VIEW 2: หน้า Watchlist
  const renderWatchlistView = () => {
    const favoriteStocks = stockList.filter(stock => favorites.includes(stock.symbol));
    return (
      <>
        <div className="flex-1 flex flex-col gap-4 animate-in slide-in-from-bottom-4 duration-300">
          <header className="mb-4">
            <p className="text-[10px] font-bold tracking-widest text-[#8FA872] uppercase mb-1">PERSONAL PORTFOLIO</p>
            <h1 className="text-3xl font-black text-[#3E3A35] flex items-center gap-3"><Heart className="w-8 h-8 text-red-500 fill-current" /> My Watchlist</h1>
          </header>
          <div className="bg-[#FAF6EE] rounded-xl border border-[#EBE5D8] overflow-hidden relative min-h-[300px]">
            {favoriteStocks.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-[#FAF6EE] z-20 shadow-sm"><tr className="text-[10px] font-bold text-gray-400 uppercase border-b border-[#EBE5D8]"><th className="py-3 px-4">หุ้น (Symbol)</th><th className="py-3 px-2 text-right">ราคา</th><th className="py-3 px-2 text-right">เปลี่ยนแปลง</th><th className="py-3 px-4 text-center">ลบ</th></tr></thead>
                <tbody className="divide-y divide-[#EBE5D8]">
                  {favoriteStocks.map((stock, idx) => (
                    <tr key={idx} onClick={() => setSelectedStock(stock)} className={`transition-colors cursor-pointer hover:bg-white`}>
                      <td className="py-3 px-4"><div className="font-black text-sm text-[#3E3A35]">{stock.symbol}</div></td>
                      <td className="py-3 px-2 text-right font-black text-sm text-[#2B303A]">${stock.price}</td>
                      <td className="py-3 px-2 text-right"><span className={`font-bold text-sm px-2 py-1 rounded-md ${stock.rawChange > 0 ? 'text-green-600' : 'text-red-500'}`}>{stock.change}</span></td>
                      <td className="py-3 px-4 text-center"><button onClick={(e) => { e.stopPropagation(); toggleFavorite(stock.symbol); }} className="text-gray-300 hover:text-red-500"><Trash2 className="w-4 h-4 mx-auto" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-gray-400"><Heart className="w-12 h-12 mb-3 opacity-20" /><p className="font-bold">ยังไม่มีหุ้นใน Watchlist</p></div>
            )}
          </div>
        </div>
        {renderDetailPanel()}
      </>
    );
  };

  // VIEW 3: หน้า Profile
  const renderProfileView = () => (
    <div className="flex-1 w-full max-w-4xl mx-auto flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-300">
      <header className="bg-[#FAF6EE] rounded-3xl p-8 border border-[#EBE5D8] flex items-center gap-6 shadow-sm">
        <div className="w-24 h-24 bg-[#EBE5D8] rounded-full flex items-center justify-center border-4 border-white shadow-sm"><User className="w-12 h-12 text-gray-400" /></div>
        <div>
          <h1 className="text-3xl font-black text-[#3E3A35]">Guest Investor</h1>
          <p className="text-sm text-gray-500 mt-1">Free Sandbox Plan</p>
          <div className="flex gap-2 mt-3"><span className="bg-[#8FA872] text-white text-xs font-bold px-3 py-1 rounded-full">Finnhub API Connected</span></div>
        </div>
      </header>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#3E3A35] font-sans flex relative selection:bg-[#8FA872] selection:text-white">
      
      {/* SIDEBAR NAVIGATION */}
      <nav className="w-16 bg-[#2B303A] text-[#8FA872] flex flex-col items-center py-6 fixed h-full z-50 transition-all">
        <div className="bg-blue-600 w-full h-12 mb-6 flex items-center justify-center shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"><Activity className="w-6 h-6 text-white" /></div>
        <div className="flex flex-col gap-8 flex-1 w-full items-center mt-4">
          <button onClick={() => setActiveMenu('home')} className={`transition-colors relative ${activeMenu === 'home' ? 'text-white' : 'text-gray-400 hover:text-[#A7C08A]'}`}><Home className="w-6 h-6" />{activeMenu === 'home' && <span className="absolute -left-5 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#8FA872] rounded-r-md"></span>}</button>
          <button onClick={() => setActiveMenu('watchlist')} className={`transition-colors relative ${activeMenu === 'watchlist' ? 'text-white' : 'text-gray-400 hover:text-[#A7C08A]'}`}><Heart className="w-6 h-6" /><span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">{favorites.length}</span>{activeMenu === 'watchlist' && <span className="absolute -left-5 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#8FA872] rounded-r-md"></span>}</button>
          <button onClick={() => setActiveMenu('profile')} className={`transition-colors relative ${activeMenu === 'profile' ? 'text-white' : 'text-gray-400 hover:text-[#A7C08A]'}`}><User className="w-6 h-6" />{activeMenu === 'profile' && <span className="absolute -left-5 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#8FA872] rounded-r-md"></span>}</button>
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
