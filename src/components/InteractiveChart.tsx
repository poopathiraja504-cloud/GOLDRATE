import React, { useState, useMemo } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { Coins, CircleDot, Calendar, Maximize2, Sparkles } from 'lucide-react';
import { MetalType, Carat } from '../types';
import { getChartData, formatINR } from '../services/rateService';
import { useRates } from '../context/RatesContext';

type Timeframe = 'today' | '7d' | '30d' | '6m' | '1y';

interface InteractiveChartProps {
  initialMetal?: MetalType;
  initialTimeframe?: Timeframe;
  compact?: boolean;
}

export const InteractiveChart: React.FC<InteractiveChartProps> = ({
  initialMetal = 'gold',
  initialTimeframe = '7d',
  compact = false,
}) => {
  const { goldRates, silverRate } = useRates();
  const [metal, setMetal] = useState<MetalType>(initialMetal);
  const [carat, setCarat] = useState<Carat>(24);
  const [timeframe, setTimeframe] = useState<Timeframe>(initialTimeframe);

  const baseRate = useMemo(() => {
    if (metal === 'gold' && goldRates) {
      return goldRates[carat]?.rate_per_gram || 7850;
    } else if (silverRate) {
      return silverRate.rate_per_gram || 94.5;
    }
    return metal === 'gold' ? 7850 : 94.5;
  }, [metal, carat, goldRates, silverRate]);

  const data = useMemo(() => {
    return getChartData(metal, timeframe, baseRate);
  }, [metal, timeframe, baseRate]);

  // Determine min and max for clean Y-axis padding
  const { minVal, maxVal } = useMemo(() => {
    if (!data.length) return { minVal: 0, maxVal: 10000 };
    const rates = data.map((d) => d.rate_per_gram);
    const min = Math.min(...rates);
    const max = Math.max(...rates);
    const padding = (max - min) * 0.15 || 5;
    return {
      minVal: Math.floor(min - padding),
      maxVal: Math.ceil(max + padding),
    };
  }, [data]);

  const isGold = metal === 'gold';
  const strokeColor = isGold ? '#eab308' : '#cbd5e1';
  const fillColor = isGold ? '#eab308' : '#cbd5e1';

  return (
    <div className={`rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-4 sm:p-6 shadow-xl ${compact ? '' : 'w-full'}`}>
      
      {/* Chart Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        
        {/* Metal and Carat Selector */}
        <div className="flex items-center space-x-2">
          {/* Metal Switch */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setMetal('gold')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isGold 
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Gold</span>
            </button>

            <button
              onClick={() => setMetal('silver')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                !isGold 
                  ? 'bg-slate-200 text-slate-950 shadow-md font-bold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CircleDot className="w-3.5 h-3.5" />
              <span>Silver</span>
            </button>
          </div>

          {/* Carat Selector (Gold Only) */}
          {isGold && (
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              {([24, 22, 18] as Carat[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setCarat(c)}
                  className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                    carat === c 
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {c}K
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Timeframe Buttons */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {(['today', '7d', '30d', '6m', '1y'] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium uppercase transition-all ${
                timeframe === tf
                  ? 'bg-slate-800 text-amber-400 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tf === 'today' ? '1D' : tf}
            </button>
          ))}
        </div>

      </div>

      {/* Chart Title and Current Metric */}
      <div className="flex items-baseline justify-between mt-4">
        <div>
          <div className="text-xs text-slate-400 font-medium">
            {isGold ? `${carat}K Pure Gold Rate Trend` : 'Fine 99.9% Silver Rate Trend'}
          </div>
          <div className="text-2xl font-extrabold text-white font-mono mt-0.5">
            {formatINR(baseRate)}
            <span className="text-xs font-normal text-slate-400 ml-1">/ gram</span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-slate-400 block">Time Period</span>
          <span className="text-xs font-semibold text-amber-400 capitalize">
            {timeframe === 'today' ? 'Intraday Hourly' : timeframe}
          </span>
        </div>
      </div>

      {/* Recharts Area Container */}
      <div className="h-64 sm:h-72 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="metalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={fillColor} stopOpacity={0.35} />
                <stop offset="95%" stopColor={fillColor} stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />

            <XAxis 
              dataKey="formatted_time" 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />

            <YAxis 
              domain={[minVal, maxVal]} 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              tickFormatter={(v) => `₹${v}`}
              width={55}
            />

            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const rateVal = payload[0].value as number;
                  return (
                    <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-3 shadow-2xl backdrop-blur-md">
                      <p className="text-[11px] text-slate-400 mb-1">{label}</p>
                      <p className="text-sm font-bold text-white font-mono">
                        {formatINR(rateVal)} <span className="text-xs font-normal text-slate-400">/ g</span>
                      </p>
                      <p className="text-[10px] text-amber-400 font-medium mt-1">
                        10g: {formatINR(rateVal * 10)}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Area 
              type="monotone" 
              dataKey="rate_per_gram" 
              stroke={strokeColor} 
              strokeWidth={2.5}
              fillOpacity={1} 
              fill="url(#metalGradient)" 
              dot={false}
              activeDot={{ r: 5, stroke: '#070d19', strokeWidth: 2, fill: strokeColor }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Note */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-800/80 mt-2">
        <span>Historical quotes calibrated against MCX spot and Bullion associations.</span>
        <span className="hidden sm:inline">Currency: INR (₹)</span>
      </div>

    </div>
  );
};

