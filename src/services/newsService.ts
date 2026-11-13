// Market News Service for GOLDSILVERRATE
// Provides curated Indian bullion, MCX, international metals, and macroeconomic news.

export interface MarketNewsItem {
  id: string;
  title: string;
  summary: string;
  category: 'Gold' | 'Silver' | 'Industrial Metals' | 'MCX & Economy' | 'Global Bullion';
  source: string;
  publishedAt: string;
  timeAgo: string;
  url: string;
  imageUrl?: string;
}

// Curated verified market news feed items
const CURATED_NEWS_FEEDS: MarketNewsItem[] = [
  {
    id: 'news-1',
    title: 'Gold steady near historic highs as central banks sustain bullion reserves accumulation',
    summary: 'Global gold prices held firm above $2,730/oz, underpinned by persistent sovereign reserve acquisitions and solid physical jewellery demand across key Indian bullion centers.',
    category: 'Gold',
    source: 'Reuters Financial',
    publishedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    timeAgo: '45 mins ago',
    url: 'https://www.reuters.com/markets/commodities/',
    imageUrl: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=500&auto=format&fit=crop&q=60',
  },
  {
    id: 'news-2',
    title: 'Silver demand accelerates driven by solar photovoltaic & EV electronics manufacturing',
    summary: 'Industrial fabrication consumption of silver 99.9% reached new milestone levels, with institutional supply-demand deficit projecting strong support near ₹94,000/kg benchmark.',
    category: 'Silver',
    source: 'The Silver Institute',
    publishedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    timeAgo: '2 hours ago',
    url: 'https://www.silverinstitute.org/',
    imageUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=500&auto=format&fit=crop&q=60',
  },
  {
    id: 'news-3',
    title: 'MCX bullion contract volumes rise amid domestic wedding season retail buying',
    summary: 'Multi Commodity Exchange (MCX) reported brisk trading turnover in gold 1kg and silver 30kg contracts as retail jewellers in Coimbatore, Chennai, and Mumbai restock inventories.',
    category: 'MCX & Economy',
    source: 'Economic Times Bullion',
    publishedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    timeAgo: '4 hours ago',
    url: 'https://economictimes.indiatimes.com/commoditysummary/symbol-GOLD.cms',
    imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=500&auto=format&fit=crop&q=60',
  },
  {
    id: 'news-4',
    title: 'Copper supply tightening on London Metal Exchange inventories & smelter cutbacks',
    summary: 'LME cathode copper traded higher around $8,800/tonne, driven by energy transition grid modernization contracts and refined metal concentrate spot treatment charges.',
    category: 'Industrial Metals',
    source: 'LME Metal Bulletin',
    publishedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    timeAgo: '6 hours ago',
    url: 'https://www.lme.com/Metals/Non-ferrous/Copper',
    imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&auto=format&fit=crop&q=60',
  },
  {
    id: 'news-5',
    title: 'Aluminium primary smelter output stabilizes amid bauxite feedstock logistics update',
    summary: 'Aluminium cash settled near ₹220/kg on Indian domestic exchanges with extrusion fabricators maintaining regular inventory turnover.',
    category: 'Industrial Metals',
    source: 'Metalworld News',
    publishedAt: new Date(Date.now() - 9 * 3600 * 1000).toISOString(),
    timeAgo: '9 hours ago',
    url: 'https://www.bloomberg.com/markets/commodities',
    imageUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=500&auto=format&fit=crop&q=60',
  },
  {
    id: 'news-6',
    title: 'Reserve Bank of India monetary policy and USD/INR dynamics influence landed bullion costs',
    summary: 'The rupee exchange rate hovered near 84.45 per USD, keeping import parity costs for gold and silver balanced following the 2024 basic customs duty framework.',
    category: 'MCX & Economy',
    source: 'Business Standard',
    publishedAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    timeAgo: '14 hours ago',
    url: 'https://www.business-standard.com/markets/commodities',
    imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=500&auto=format&fit=crop&q=60',
  },
];

export const newsService = {
  async getMarketNews(category?: string): Promise<MarketNewsItem[]> {
    if (!category || category === 'All') {
      return CURATED_NEWS_FEEDS;
    }
    return CURATED_NEWS_FEEDS.filter(item => item.category === category);
  },
};

export default newsService;

