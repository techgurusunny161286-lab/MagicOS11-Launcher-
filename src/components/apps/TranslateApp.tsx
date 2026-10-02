import React, { useState } from 'react';
import { X, ArrowRightLeft, Volume2, Copy, Check, Languages, Sparkles } from 'lucide-react';
import { playTapSound } from '../../utils/sound';
import { triggerHaptic } from '../../utils/haptics';

interface TranslateAppProps {
  onClose: () => void;
}

const LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Japanese',
  'Chinese (Simplified)',
  'Hindi',
  'Portuguese'
];

const TRANSLATION_DICTIONARY: Record<string, Record<string, string>> = {
  'hello': {
    'Spanish': 'Hola',
    'French': 'Bonjour',
    'German': 'Hallo',
    'Japanese': 'こんにちは (Konnichiwa)',
    'Chinese (Simplified)': '你好 (Nǐ hǎo)',
    'Hindi': 'नमस्ते (Namaste)',
    'Portuguese': 'Olá'
  },
  'thank you': {
    'Spanish': 'Gracias',
    'French': 'Merci',
    'German': 'Danke',
    'Japanese': 'ありがとう (Arigatō)',
    'Chinese (Simplified)': '谢谢 (Xièxiè)',
    'Hindi': 'धन्यवाद (Dhanyavaad)',
    'Portuguese': 'Obrigado'
  },
  'welcome to magicos': {
    'Spanish': 'Bienvenido a MagicOS',
    'French': 'Bienvenue sur MagicOS',
    'German': 'Willkommen bei MagicOS',
    'Japanese': 'MagicOSへようこそ',
    'Chinese (Simplified)': '欢迎来到 MagicOS',
    'Hindi': 'MagicOS में आपका स्वागत है',
    'Portuguese': 'Bem-vindo ao MagicOS'
  }
};

export const TranslateApp: React.FC<TranslateAppProps> = ({ onClose }) => {
  const [sourceLang, setSourceLang] = useState('English');
  const [targetLang, setTargetLang] = useState('Spanish');
  const [sourceText, setSourceText] = useState('Hello, welcome to MagicOS');
  const [isCopied, setIsCopied] = useState(false);

  const handleSwap = () => {
    triggerHaptic('doubleTick');
    playTapSound(600);
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
  };

  const getTranslation = (text: string, target: string) => {
    const lower = text.trim().toLowerCase();
    for (const [key, map] of Object.entries(TRANSLATION_DICTIONARY)) {
      if (lower.includes(key) && map[target]) {
        return map[target];
      }
    }
    // Fallback realistic AI translation string
    return `${text} [Translated into ${target}]`;
  };

  const translatedResult = getTranslation(sourceText, targetLang);

  const handleCopy = () => {
    triggerHaptic('tick');
    playTapSound(500);
    navigator.clipboard?.writeText?.(translatedResult);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 text-white flex flex-col justify-between animate-in fade-in zoom-in-95 duration-200">
      {/* Top Header */}
      <div className="p-3.5 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Languages size={18} className="text-cyan-400" />
          <h2 className="font-bold text-base text-white">Google Translate</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      {/* Language Selector Bar */}
      <div className="p-3 bg-neutral-900/60 border-b border-neutral-800 flex items-center justify-between px-4">
        <select
          value={sourceLang}
          onChange={(e) => setSourceLang(e.target.value)}
          className="bg-transparent text-xs font-bold text-cyan-400 focus:outline-none cursor-pointer"
        >
          {LANGUAGES.map(l => <option key={l} value={l} className="bg-neutral-900 text-white">{l}</option>)}
        </select>

        <button
          type="button"
          onClick={handleSwap}
          className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white active:scale-90 transition-all"
        >
          <ArrowRightLeft size={16} />
        </button>

        <select
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value)}
          className="bg-transparent text-xs font-bold text-cyan-400 focus:outline-none cursor-pointer"
        >
          {LANGUAGES.map(l => <option key={l} value={l} className="bg-neutral-900 text-white">{l}</option>)}
        </select>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Source Box */}
        <div className="p-4 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-lg space-y-2">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{sourceLang}</span>
          <textarea
            rows={3}
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Type text to translate..."
            className="w-full bg-transparent text-sm text-white focus:outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Translated Output Box */}
        <div className="p-4 rounded-3xl bg-cyan-950/40 border border-cyan-500/30 shadow-xl space-y-2 relative">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">{targetLang}</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleCopy}
                className="p-1.5 rounded-full hover:bg-white/10 text-cyan-300"
                title="Copy Translation"
              >
                {isCopied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>
          </div>
          <p className="text-base font-bold text-white leading-relaxed pr-6">
            {translatedResult}
          </p>
        </div>

        {/* Quick Phrases */}
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider px-1">Common Phrases</h4>
          <div className="flex flex-wrap gap-2">
            {['Hello', 'Thank you', 'Welcome to MagicOS'].map((phrase) => (
              <button
                key={phrase}
                type="button"
                onClick={() => {
                  triggerHaptic('tick');
                  setSourceText(phrase);
                }}
                className="px-3.5 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-xs font-medium text-neutral-300 border border-neutral-800 active:scale-95 transition-all"
              >
                {phrase}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
