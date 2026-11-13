import React from 'react';
import { AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

export const TermsConditionsPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Terms & Conditions and Financial Disclaimer
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Effective Date: November 2026 • Legal parameters governing bullion price monitoring.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-4 text-xs text-slate-300 leading-relaxed shadow-xl">
        <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
          <AlertTriangle className="w-5 h-5" />
          <span>Statutory Bullion Market Disclaimer</span>
        </div>

        <p>
          Please review these Terms and Conditions thoroughly prior to utilizing the Gold and Silver Rate website or Android application. By accessing our services, you signify your unreserved concurrence with these terms.
        </p>

        <h3 className="font-bold text-white text-sm pt-2">1. Indicative Rates vs Retail Jewellery Invoices</h3>
        <p>
          The gold and silver rates presented across our dashboards are indicative market reference quotes computed from international spot prices, currency exchange rates, import tariffs, and verified bullion association benchmarks. They are intended for informational, tracking, and educational purposes.
        </p>
        <p>
          Actual retail jewellery invoice prices will differ depending on retailer making charges, artisan craftsmanship, gemstone weights, GST (3%), hallmarking fees, and localized retail house policies. Always confirm the final binding rate with your authorized jeweller before finalizing financial transactions.
        </p>

        <h3 className="font-bold text-white text-sm pt-2">2. No Investment or Financial Advice</h3>
        <p>
          The content, technical charts, historical averages, and price alerts provided by this platform do not constitute investment advice, financial solicitation, or commodity brokerage recommendations. Bullion commodities are subject to market volatility. Users assume complete personal responsibility for any precious metals purchases or sales.
        </p>

        <h3 className="font-bold text-white text-sm pt-2">3. Android APK and PWA Usage</h3>
        <p>
          The Android APK provided on this platform is signed for distribution and adheres to Android security sandboxing. Users agree not to tamper with or decompile application binaries.
        </p>
      </div>

    </div>
  );
};

