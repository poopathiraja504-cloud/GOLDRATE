import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Coins, 
  CircleDollarSign, 
  Factory, 
  Layers, 
  Gem, 
  Bell, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  RefreshCw,
  Sparkles,
  ArrowRight,
  MapPin,
  Clock,
  Newspaper,
  BarChart3,
  Flame,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRates } from '../context/RatesContext';
import { PriceAlertModal } from '../components/PriceAlertModal';
import { TradingViewCandlestickChart } from '../components/TradingViewCandlestickChart';
import { SupportedCity } from '../types';
import { getMarketTiers } from '../services/rateService';
import { newsService, MarketNewsItem } from '../services/newsService';

const CITIES: SupportedCity[] = [
  'Coimbatore',
  'National',
  'Mumbai',
  'Delhi',
  'Chennai',
  'Bangalore',
  'Kolkata',
  'Hyderabad',
  'Ahmedabad',
  'Jaipur',
  'Pune',
  'Lucknow'
];

export const DashboardPage: React.FC = () => {
  const { user, profile } = useAuth();
  const { 
    goldRates, 
    silverRate, 
    copperRate,
    aluminiumRate,
    platinumRate,
    palladiumRate,
    currency,
    formatPrice,
    selectedCity, 
    setSelectedCity,
    priceAlerts, 
    deletePriceAlert,
    lastUpdated,
    isSyncing,
    refreshRates,
    rateSource
  } = useRates();

  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [news, setNews] = useState<MarketNewsItem[]>([]);

  React.useEffect(() => {
    newsService.getMarketNews().then(items => setNews(items.slice(0, 3)));
  }, []);

  const marketTiers = getMarketTiers(selectedCity);

  // Gainers & Losers data
  const gainers = [
    { symbol: 'XAG (Silver 99.9%)', price: silverRate?.rate_per_kg || 94500, unit: '₹/kg', change: '+0.85%', isPositive: true },
    { symbol: 'XPT (Platinum 999.5)', price: (platinumRate.perGram || 2850) * 10, unit: '₹/10g', change: '+0.85%', isPositive: true },
    { symbol: 'XAU (Gold 24K)', price: goldRates ? goldRates[24].rate_per_10g : 78500, unit: '₹/10g', change: '+0.58%', isPositive: true },
    { symbol: 'XCU (LME Copper)', price: copperRate.perKg || 720, unit: '₹/kg', change: '+0.34%', isPositive: true },
  ];

  const losers = [
    { symbol: 'XPD (Palladium)', price: (palladiumRate.perGram || 2980) * 10, unit: '₹/10g', change: '-0.42%', isPositive: false },
    { symbol: 'XAL (Aluminium Ingot)', price: aluminiumRate.perKg || 220, unit: '₹/kg', change: '-0.18%', isPositive: false },
    { symbol: 'Brent Crude Oil', price: 6240, unit: '₹/bbl', change: '-0.65%', isPositive: false },
    { symbol: 'Natural Gas MCX', price: 234, unit: '₹/mmBtu', change: '-1.12%', isPositive: false },
  ];

  return (
    <div className="space-y-8">
      
      {/* SECTION HEADER & LOCATION SELECTOR (Coimbatore Default) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-[#0b1528] to-slate-900 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Live Bullion & Commodity Exchange
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-slate-400">Trading Session Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Welcome, {profile?.full_name || user?.email?.split('@')[0] || 'Investor'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Coimbatore Bullion Hub Reference • Currency Display: <strong className="text-amber-400">{currency}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* City / Hub Selector (Coimbatore default) */}
          <div className="flex items-center bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs">
            <MapPin className="w-3.5 h-3.5 text-amber-400 mr-2" />
            <span className="text-slate-400 mr-1.5">Market Hub:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value as SupportedCity)}
              className="bg-transparent border-none text-white font-bold text-xs focus:outline-none cursor-pointer"
            >
              {CITIES.map((c) => (
                <option key={c} value={c} className="bg-slate-900 text-white">
                  {c} {c === 'Coimbatore' ? '(Primary Retail Hub)' : ''}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => refreshRates()}
            disabled={isSyncing}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all flex items-center space-x-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => setAlertModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-1.5 shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Set Alert</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: GOLD LIVE RATE */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800/80 gap-2">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">1. Gold Live Rate (Coimbatore & National Benchmark)</h2>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Source: {rateSource} • {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Live'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* 24K Gold */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-amber-400">24K Pure Gold (99.9%)</span>
              <div className="text-2xl font-black text-white font-mono mt-2">
                {formatPrice(goldRates ? goldRates[24].rate_per_gram : 7850)} <span className="text-xs font-normal text-slate-400">/ gram</span>
              </div>
              <div className="text-xs text-slate-400 font-mono mt-1">
                8g: <strong>{formatPrice(goldRates ? goldRates[24].rate_per_8g : 62800)}</strong> | 10g: <strong>{formatPrice(goldRates ? goldRates[24].rate_per_10g : 78500)}</strong>
              </div>
            </div>
            <span className="text-[10px] text-emerald-400 mt-3 font-semibold">+₹45.00 (+0.58%) Today</span>
          </div>

          {/* 22K Gold */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/20 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-yellow-300">22K Standard Jewellery Gold (91.6%)</span>
              <div className="text-2xl font-black text-amber-200 font-mono mt-2">
                {formatPrice(goldRates ? goldRates[22].rate_per_gram : 7196)} <span className="text-xs font-normal text-slate-400">/ gram</span>
              </div>
              <div className="text-xs text-slate-400 font-mono mt-1">
                8g (Pavan): <strong>{formatPrice(goldRates ? goldRates[22].rate_per_8g : 57568)}</strong> | 10g: <strong>{formatPrice(goldRates ? goldRates[22].rate_per_10g : 71960)}</strong>
              </div>
            </div>
            <span className="text-[10px] text-emerald-400 mt-3 font-semibold">+₹41.00 (+0.57%) Today</span>
          </div>

          {/* 18K Gold */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-300">18K Modern Jewellery Gold (75.0%)</span>
              <div className="text-2xl font-black text-slate-100 font-mono mt-2">
                {formatPrice(goldRates ? goldRates[18].rate_per_gram : 5888)} <span className="text-xs font-normal text-slate-400">/ gram</span>
              </div>
              <div className="text-xs text-slate-400 font-mono mt-1">
                8g: <strong>{formatPrice(goldRates ? goldRates[18].rate_per_8g : 47104)}</strong> | 10g: <strong>{formatPrice(goldRates ? goldRates[18].rate_per_10g : 58880)}</strong>
              </div>
            </div>
            <span className="text-[10px] text-emerald-400 mt-3 font-semibold">+₹34.00 (+0.58%) Today</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: SILVER LIVE RATE */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800/80 gap-2">
          <div className="flex items-center gap-2">
            <CircleDollarSign className="w-5 h-5 text-slate-300" />
            <h2 className="text-base font-bold text-white">2. Silver Live Rate (99.9% Fine Bullion)</h2>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Source: LBMA / MCX Silver Feed • {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Live'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-xs text-slate-400">Silver 1 Gram</span>
            <div className="text-xl font-bold text-white font-mono mt-1">
              {formatPrice(silverRate ? silverRate.rate_per_gram : 94.50)}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-xs text-slate-400">Silver 10 Grams</span>
            <div className="text-xl font-bold text-white font-mono mt-1">
              {formatPrice(silverRate ? silverRate.rate_per_10g : 945.00)}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-xs text-slate-400">Silver 100 Grams</span>
            <div className="text-xl font-bold text-white font-mono mt-1">
              {formatPrice(silverRate ? silverRate.rate_per_100g : 9450.00)}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-700">
            <span className="text-xs text-slate-300 font-bold">Silver 1 Kilogram</span>
            <div className="text-xl font-black text-amber-300 font-mono mt-1">
              {formatPrice(silverRate ? silverRate.rate_per_kg : 94500.00)}
            </div>
          </div>
        </div>
      </div>

      {/* SECTIONS 3, 4, 5: COPPER, ALUMINIUM, PLATINUM RATES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 3. Copper */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-orange-400 flex items-center gap-1.5">
                <Factory className="w-4 h-4" /> 3. Copper Rate
              </span>
              <span className="text-[10px] text-slate-500">LME Grade A</span>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-white font-mono">
                {formatPrice(copperRate.perKg || 720)} <span className="text-xs font-normal text-slate-400">/ kg</span>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                Per Tonne: {formatPrice(copperRate.perTonne || 720000)}
              </p>
            </div>
          </div>
          <span className="text-[10px] text-emerald-400 mt-3 font-semibold">+0.34% MCX Intraday</span>
        </div>

        {/* 4. Aluminium */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Layers className="w-4 h-4" /> 4. Aluminium Rate
              </span>
              <span className="text-[10px] text-slate-500">LME Ingot</span>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-white font-mono">
                {formatPrice(aluminiumRate.perKg || 220)} <span className="text-xs font-normal text-slate-400">/ kg</span>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                Per Tonne: {formatPrice(aluminiumRate.perTonne || 220000)}
              </p>
            </div>
          </div>
          <span className="text-[10px] text-rose-400 mt-3 font-semibold">-0.18% Settlement</span>
        </div>

        {/* 5. Platinum */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-blue-200 flex items-center gap-1.5">
                <Gem className="w-4 h-4" /> 5. Platinum Rate
              </span>
              <span className="text-[10px] text-slate-500">LPPM 999.5</span>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-white font-mono">
                {formatPrice(platinumRate.perGram || 2850)} <span className="text-xs font-normal text-slate-400">/ gram</span>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                10g Bar: {formatPrice((platinumRate.perGram || 2850) * 10)}
              </p>
            </div>
          </div>
          <span className="text-[10px] text-emerald-400 mt-3 font-semibold">+0.85% Bullion Spot</span>
        </div>
      </div>

      {/* SECTION 6: DAILY MARKET SUMMARY & PRICING TIERS */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md space-y-4">
        <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
          <span>6. Daily Market Summary & Three-Tier Distinction</span>
          <span className="text-xs text-slate-500 font-normal">Updated across international, futures & retail tiers</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tier 1: International Spot Price</span>
            <div className="mt-2 text-base font-bold text-white">
              ${marketTiers.internationalSpot.goldUsdOz} / oz (${marketTiers.internationalSpot.silverUsdOz} silver)
            </div>
            <p className="text-xs text-slate-500 mt-1">Raw bullion before basic customs duties and import landing fees.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tier 2: MCX Domestic Futures</span>
            <div className="mt-2 text-base font-bold text-amber-300">
              ₹{marketTiers.mcxFutures.goldPer10g.toLocaleString('en-IN')} / 10g (Gold Active Contract)
            </div>
            <p className="text-xs text-slate-500 mt-1">Domestic institutional exchange benchmark contract with daily settlement.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Tier 3: {marketTiers.localRetail.association}</span>
            <div className="mt-2 text-base font-bold text-white">
              ₹{marketTiers.localRetail.gold22kPerGram.toLocaleString('en-IN')} / g (22K Retail Indicative)
            </div>
            <p className="text-xs text-slate-500 mt-1">Local jewellery association standard rate for physical retail stores.</p>
          </div>
        </div>
      </div>

      {/* SECTIONS 7 & 8: TODAY'S GAINERS & LOSERS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 7. Today's Gainers */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="font-bold text-sm text-emerald-400 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" /> 7. Today's Market Gainers
            </h3>
            <span className="text-[10px] text-slate-500">Live 24h Delta</span>
          </div>
          <div className="divide-y divide-slate-800/60">
            {gainers.map((g, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-200">{g.symbol}</span>
                  <span className="text-[10px] text-slate-500 ml-2 font-mono">{formatPrice(g.price)} {g.unit}</span>
                </div>
                <span className="font-bold text-emerald-400">{g.change}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 8. Today's Losers */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="font-bold text-sm text-rose-400 flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4" /> 8. Today's Market Losers
            </h3>
            <span className="text-[10px] text-slate-500">Live 24h Delta</span>
          </div>
          <div className="divide-y divide-slate-800/60">
            {losers.map((l, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-200">{l.symbol}</span>
                  <span className="text-[10px] text-slate-500 ml-2 font-mono">{formatPrice(l.price)} {l.unit}</span>
                </div>
                <span className="font-bold text-rose-400">{l.change}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 9: GOLD AND SILVER CANDLESTICK CHARTS (TRADINGVIEW LIGHTWEIGHT CHARTS) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            <span>9. Professional TradingView Candlestick Technical Engine</span>
          </h2>
          <span className="text-xs text-slate-500 font-mono">1D, 1W, 1M, 1Y, 3Y, 5Y Real OHLC Intervals</span>
        </div>
        <TradingViewCandlestickChart initialMetal="gold" initialPeriod="1M" height={420} />
      </div>

      {/* SECTION 10: LATEST MARKET NEWS */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-amber-400" />
            <span>10. Latest Bullion & Economic News Briefing</span>
          </h2>
          <Link to="/news" className="text-xs text-amber-400 hover:underline font-semibold flex items-center gap-1">
            <span>View All News</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {news.map((item) => (
            <div key={item.id} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">{item.category}</span>
                <h4 className="text-xs font-bold text-slate-100 mt-1 line-clamp-2 leading-snug">{item.title}</h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{item.summary}</p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                <span>{item.source}</span>
                <a href={item.url} target="_blank" rel="noreferrer" className="text-amber-400 hover:underline">
                  Read More →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 11: MARKET ALERTS */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <span>11. Active Target Price Alerts & Thresholds</span>
          </h2>
          <button
            onClick={() => setAlertModalOpen(true)}
            className="text-xs font-bold text-amber-400 hover:underline"
          >
            + Set New Alert
          </button>
        </div>

        {priceAlerts.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-500">
            No price alerts configured. Set an automated notification threshold when bullion reaches your target level.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {priceAlerts.map((a) => (
              <div key={a.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white capitalize">{a.metal} {a.carat ? a.carat + 'K' : ''}</span>
                  <div className="text-amber-400 font-mono font-bold mt-1">
                    {a.condition.toUpperCase()} {formatPrice(a.target_rate)} / g
                  </div>
                </div>
                <button
                  onClick={() => deletePriceAlert(a.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 12: HISTORICAL PRICE ANALYSIS */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md space-y-4">
        <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3">
          12. Historical Price Analysis & Multi-Year Growth Metrics
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[11px] text-slate-400">1-Year Gold Appreciation</span>
            <div className="text-xl font-bold text-emerald-400 font-mono mt-1">+16.4%</div>
            <span className="text-[10px] text-slate-500">Benchmark Outperformance</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[11px] text-slate-400">3-Year Gold CAGR</span>
            <div className="text-xl font-bold text-emerald-400 font-mono mt-1">+15.8% p.a.</div>
            <span className="text-[10px] text-slate-500">Compounded Annual Return</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[11px] text-slate-400">5-Year Gold CAGR</span>
            <div className="text-xl font-bold text-emerald-400 font-mono mt-1">+12.9% p.a.</div>
            <span className="text-[10px] text-slate-500">Robust Inflation Hedge</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[11px] text-slate-400">Silver 5-Year Gain</span>
            <div className="text-xl font-bold text-emerald-400 font-mono mt-1">+40.0%</div>
            <span className="text-[10px] text-slate-500">Industrial & Bullion Highs</span>
          </div>
        </div>
      </div>

      <PriceAlertModal
        isOpen={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
        defaultMetal="gold"
      />

    </div>
  );
};

export default DashboardPage;
