import React, { useEffect, useRef, useState } from 'react';
import { 
  createChart, 
  ColorType, 
  CandlestickSeries, 
  HistogramSeries, 
  IChartApi, 
  ISeriesApi 
} from 'lightweight-charts';
import { 
  CandleMetal, 
  CandlePeriod, 
  getCandlestickData, 
  CandleDataPoint 
} from '../services/ohlcService';
import { 
  TrendingUp, 
  TrendingDown, 
  Maximize2, 
  BarChart2, 
  Info,
  Calendar
} from 'lucide-react';
import { useRates } from '../context/RatesContext';

interface TradingViewCandlestickChartProps {
  initialMetal?: CandleMetal;
  initialPeriod?: CandlePeriod;
  height?: number;
  showSelector?: boolean;
}

export const TradingViewCandlestickChart: React.FC<TradingViewCandlestickChartProps> = ({
  initialMetal = 'gold',
  initialPeriod = '1M',
  height = 420,
  showSelector = true,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);

  const { formatPrice, currency } = useRates();

  const [metal, setMetal] = useState<CandleMetal>(initialMetal);
  const [period, setPeriod] = useState<CandlePeriod>(initialPeriod);
  const [hoveredCandle, setHoveredCandle] = useState<CandleDataPoint | null>(null);

  const metalsConfig: { id: CandleMetal; label: string; unit: string; color: string }[] = [
    { id: 'gold', label: 'Gold (24K)', unit: '₹/g', color: '#d4af37' },
    { id: 'silver', label: 'Silver 99.9%', unit: '₹/g', color: '#c0c0c0' },
    { id: 'copper', label: 'Copper Cathode', unit: '₹/kg', color: '#b87333' },
    { id: 'aluminium', label: 'Aluminium Ingot', unit: '₹/kg', color: '#aaaaaa' },
  ];

  const periods: CandlePeriod[] = ['1D', '1W', '1M', '1Y', '3Y', '5Y'];

  const ohlcData = getCandlestickData(metal, period);

  // Initialize and update TradingView lightweight-chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Clean up previous instance
    if (chartInstanceRef.current) {
      chartInstanceRef.current.remove();
      chartInstanceRef.current = null;
    }

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: height,
      layout: {
        background: { type: ColorType.Solid, color: '#070d19' },
        textColor: '#94a3b8',
        fontSize: 11,
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.04)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.04)' },
      },
      crosshair: {
        vertLine: {
          color: '#d4af3788',
          width: 1,
          style: 3,
          labelBackgroundColor: '#1e293b',
        },
        horzLine: {
          color: '#d4af3788',
          width: 1,
          style: 3,
          labelBackgroundColor: '#1e293b',
        },
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        scaleMargins: {
          top: 0.1,
          bottom: 0.25,
        },
      },
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartInstanceRef.current = chart;

    // Add Candlestick Series (TradingView Standard Green/Red)
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });
    candlestickSeriesRef.current = candleSeries;

    // Add Volume Histogram Series
    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: 'volume',
    });
    volumeSeriesRef.current = volumeSeries;

    chart.priceScale('volume').applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    // Populate series data
    candleSeries.setData(ohlcData.candles as any);
    volumeSeries.setData(ohlcData.volume as any);

    // Crosshair move listener for tooltip
    chart.subscribeCrosshairMove((param) => {
      if (
        param.point === undefined ||
        !param.time ||
        param.point.x < 0 ||
        param.point.x > chartContainerRef.current!.clientWidth ||
        param.point.y < 0 ||
        param.point.y > height
      ) {
        setHoveredCandle(null);
      } else {
        const candle = param.seriesData.get(candleSeries) as any;
        if (candle) {
          setHoveredCandle({
            time: String(param.time),
            open: candle.open,
            high: candle.high,
            low: candle.low,
            close: candle.close,
            volume: 0,
          });
        }
      }
    });

    chart.timeScale().fitContent();

    // Resize observer
    const handleResize = () => {
      if (chartContainerRef.current && chartInstanceRef.current) {
        chartInstanceRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartInstanceRef.current) {
        chartInstanceRef.current.remove();
        chartInstanceRef.current = null;
      }
    };
  }, [metal, period, height]);

  const activeMetalConfig = metalsConfig.find(m => m.id === metal) || metalsConfig[0];
  const isPositive = ohlcData.periodChange >= 0;

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#070d19] p-4 sm:p-6 shadow-2xl flex flex-col justify-between backdrop-blur-md">
      
      {/* Chart Top Navigation / Controls */}
      {showSelector && (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80 mb-4">
          
          {/* Metal Asset Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {metalsConfig.map((m) => {
              const selected = metal === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setMetal(m.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    selected
                      ? 'bg-slate-800 text-white border-amber-400 shadow-md'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* Timeframe Period Tabs (1D, 1W, 1M, 1Y, 3Y, 5Y) */}
          <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-0.5 text-xs self-start lg:self-auto">
            {periods.map((p) => {
              const active = period === p;
              return (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                    active
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>

        </div>
      )}

      {/* Metrics Banner & Crosshair Tooltip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black text-white font-mono">
              {formatPrice(ohlcData.currentPrice)}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {activeMetalConfig.unit}
            </span>
            <span className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${
              isPositive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
            }`}>
              {isPositive ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
              {isPositive ? '+' : ''}{ohlcData.periodChangePercent}% ({period})
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
            <span>High: <strong className="text-slate-200 font-mono">{formatPrice(ohlcData.periodHigh)}</strong></span>
            <span>Low: <strong className="text-slate-200 font-mono">{formatPrice(ohlcData.periodLow)}</strong></span>
            <span className="hidden md:inline text-slate-500">TradingView Lightweight Engine</span>
          </div>
        </div>

        {/* Dynamic Crosshair OHLC Inspector */}
        {hoveredCandle ? (
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-1.5 text-[11px] font-mono text-slate-300 flex items-center gap-3 shadow-lg">
            <span className="text-amber-400">{hoveredCandle.time}</span>
            <span>O: <strong className="text-white">{formatPrice(hoveredCandle.open)}</strong></span>
            <span>H: <strong className="text-emerald-400">{formatPrice(hoveredCandle.high)}</strong></span>
            <span>L: <strong className="text-rose-400">{formatPrice(hoveredCandle.low)}</strong></span>
            <span>C: <strong className="text-white">{formatPrice(hoveredCandle.close)}</strong></span>
          </div>
        ) : (
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <BarChart2 className="w-3.5 h-3.5 text-amber-400/80" />
            <span>Hover / touch candles to inspect OHLC levels</span>
          </div>
        )}
      </div>

      {/* Chart Canvas Container */}
      <div 
        ref={chartContainerRef} 
        className="w-full rounded-xl overflow-hidden" 
        style={{ height }} 
      />

      {/* Footer Notice */}
      <div className="pt-3 border-t border-slate-800/80 mt-3 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 gap-2">
        <span className="flex items-center gap-1.5">
          <Info className="w-3 h-3 text-slate-400" />
          Verified spot & commodity futures benchmark • {period} Candlestick interval
        </span>
        <span className="text-[10px] text-slate-600">
          Green = Bullish Close ≥ Open • Red = Bearish Close &lt; Open
        </span>
      </div>

    </div>
  );
};

export default TradingViewCandlestickChart;

