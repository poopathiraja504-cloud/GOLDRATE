import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export const ContactUsPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      
      <div className="text-center space-y-3 pb-6 border-b border-slate-800">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Contact Support & Dealer Inquiries
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Have queries about API feeds, city rate data partnerships, or app support? Reach out to our team.
        </p>
      </div>

      {submitted ? (
        <div className="p-8 text-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          <h3 className="text-base font-bold text-white">Message Dispatched!</h3>
          <p className="text-xs text-slate-300">
            Thank you for reaching out. Our bullion data desk will get back to you within 24 hours.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 shadow-xl space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              placeholder="e.g. Anand Jewellers"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              placeholder="dealer@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Inquiry or Feedback</label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              placeholder="Describe your question or partnership proposal..."
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Send Message</span>
          </button>
        </form>
      )}

      {/* Direct Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 flex items-center space-x-3">
          <Mail className="w-5 h-5 text-amber-400" />
          <div>
            <span className="text-slate-400 block text-[10px]">Email Support</span>
            <span className="text-white font-medium">support@goldsilverrate.app</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 flex items-center space-x-3">
          <MapPin className="w-5 h-5 text-amber-400" />
          <div>
            <span className="text-slate-400 block text-[10px]">Headquarters</span>
            <span className="text-white font-medium">Zaveri Bazaar, Mumbai 400002, India</span>
          </div>
        </div>
      </div>

    </div>
  );
};
