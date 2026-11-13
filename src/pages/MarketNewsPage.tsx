import React, { useState } from 'react';
import { Newspaper, ExternalLink, Clock, Filter, Sparkles, TrendingUp } from 'lucide-react';
import { newsService, MarketNewsItem } from '../services/newsService';

export const MarketNewsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [news, setNews] = useState<MarketNewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const categories = ['All', 'Gold', 'Silver', 'Industrial Metals', 'MCX & Economy'];

  React.useEffect(() => {
    setLoading(true);
    newsService.getMarketNews(activeCategory).then(data => {
      setNews(data);
      setLoading(false);
    });
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-[#070d19] text-white p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Newspaper className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Commodity Market News & Bullion Briefing
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Verified updates from Indian bullion hubs, MCX futures, LME base metals, and central bank reserves.
            </p>
          </div>
        </div>

        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 self-start md:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Live News Feed
        </span>
      </div>

      {/* Categories Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              activeCategory === cat
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* News Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/70 hover:border-slate-700 overflow-hidden flex flex-col justify-between transition-all shadow-xl group"
          >
            {item.imageUrl && (
              <div className="h-44 w-full overflow-hidden bg-slate-950 relative">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-950/80 text-amber-300 border border-amber-400/30 backdrop-blur-md">
                  {item.category}
                </span>
              </div>
            )}

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
                  <span className="font-semibold text-slate-400">{item.source}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400/80" />
                    {item.timeAgo}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-100 group-hover:text-amber-300 transition-colors leading-snug">
                  {item.title}
                </h3>

                <p className="mt-2 text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {item.summary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-500">Verified Wire Source</span>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <span>Read Full Article</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketNewsPage;

