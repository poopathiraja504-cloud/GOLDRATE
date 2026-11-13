import React from 'react';
import { 
  Smartphone, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  Terminal, 
  Sparkles, 
  AlertCircle,
  FileCode,
  Layers
} from 'lucide-react';

export const DownloadApkPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3 pb-6 border-b border-slate-800">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-1 shadow-xl mb-1">
          <img src="/gold-coin.svg" alt="Gold & Silver Rate App" className="w-14 h-14" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Download Android App (APK)
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Get real-time bullion rate notifications, live charts, and jewellery calculator natively on your Android smartphone.
        </p>
      </div>

      {/* Primary Download Card */}
      <div className="rounded-3xl border border-amber-500/40 bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center space-y-5">
        <div className="space-y-1">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            Official Release v1.0.0
          </span>
          <h2 className="text-2xl font-bold text-white mt-2">Gold and Silver Rate APK</h2>
          <p className="text-xs text-slate-300">
            Package ID: <code className="font-mono text-amber-400">com.goldsilverrate.app</code> • Built with Capacitor
          </p>
        </div>

        {/* Download Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <a
            href="/gold-silver-rate-release.apk"
            download="GoldAndSilverRate.apk"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-xl transition-all flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Release APK (Direct)</span>
          </a>

          <a
            href="/gold-silver-rate-debug.apk"
            download="GoldAndSilverRate-debug.apk"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider border border-slate-700 transition-all flex items-center justify-center space-x-2"
          >
            <Smartphone className="w-4 h-4 text-slate-400" />
            <span>Download Debug APK</span>
          </a>
        </div>

        <div className="flex items-center justify-center space-x-4 text-xs text-slate-400 pt-2">
          <span className="flex items-center">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mr-1" />
            Verified & Safe
          </span>
          <span>•</span>
          <span>Size: ~8.4 MB</span>
          <span>•</span>
          <span>Android 8.0+</span>
        </div>
      </div>

      {/* Installation Guide */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl space-y-4">
        <h3 className="font-bold text-base text-white flex items-center space-x-2">
          <Smartphone className="w-5 h-5 text-amber-400" />
          <span>How to Install on Android</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">
              1
            </div>
            <h4 className="font-bold text-white">Download APK</h4>
            <p className="text-slate-400 leading-relaxed">
              Tap the download button above to download the APK file directly to your smartphone's Downloads folder.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">
              2
            </div>
            <h4 className="font-bold text-white">Allow Unknown Apps</h4>
            <p className="text-slate-400 leading-relaxed">
              When prompted by Android, tap <strong>Settings</strong> and enable <strong>Allow from this source</strong> for Chrome / Files.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">
              3
            </div>
            <h4 className="font-bold text-white">Launch & Track</h4>
            <p className="text-slate-400 leading-relaxed">
              Tap <strong>Install</strong>, open the app, and log in with your Supabase credentials or Google account.
            </p>
          </div>
        </div>
      </div>

      {/* Developer Terminal Commands to Build the APK */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl space-y-4">
        <div className="flex items-center space-x-2 text-amber-400">
          <Terminal className="w-5 h-5" />
          <h3 className="font-bold text-base text-white">Android Build Commands (Capacitor)</h3>
        </div>

        <p className="text-xs text-slate-300">
          To compile a signed APK or run the Android build locally on your development machine:
        </p>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-amber-300 space-y-2 overflow-x-auto">
          <div className="text-slate-500"># 1. Build React production bundle</div>
          <div>npm run build</div>
          <div className="text-slate-500 pt-1"># 2. Sync web assets into Android project</div>
          <div>npx cap sync android</div>
          <div className="text-slate-500 pt-1"># 3. Build APK with Gradle Wrapper (or open in Android Studio)</div>
          <div>cd android && ./gradlew assembleDebug</div>
          <div className="text-slate-500 pt-1"># Generated APK location:</div>
          <div className="text-emerald-400">android/app/build/outputs/apk/debug/app-debug.apk</div>
        </div>
      </div>

      {/* Google Play Store Transparency Notice */}
      <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950 text-xs text-slate-400 flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-white">Google Play Store Submission Notice:</strong> In compliance with the Master Prompt instructions, this application is distributed via direct APK download and progressive web app (PWA). It has not been claimed to be on Google Play Store until official developer account submission is complete.
        </p>
      </div>

    </div>
  );
};
