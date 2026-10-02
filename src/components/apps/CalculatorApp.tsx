import React, { useState } from 'react';
import { X, Delete } from 'lucide-react';
import { playTapSound } from '../../utils/sound';

interface CalculatorAppProps {
  onClose: () => void;
}

export const CalculatorApp: React.FC<CalculatorAppProps> = ({ onClose }) => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [hasEvaluated, setHasEvaluated] = useState(false);

  const handleNum = (num: string) => {
    playTapSound(700, 0.02);
    if (hasEvaluated || display === '0') {
      setDisplay(num);
      setHasEvaluated(false);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperator = (op: string) => {
    playTapSound(600, 0.03);
    setEquation(`${display} ${op} `);
    setDisplay('0');
    setHasEvaluated(false);
  };

  const handleEquals = () => {
    playTapSound(800, 0.04);
    if (!equation) return;
    try {
      const fullExpr = (equation + display).replace(/×/g, '*').replace(/÷/g, '/');
      // eslint-disable-next-line no-eval
      const result = Function(`'use strict'; return (${fullExpr})`)();
      setDisplay(String(Number(result.toFixed(8))));
      setEquation('');
      setHasEvaluated(true);
    } catch {
      setDisplay('Error');
      setHasEvaluated(true);
    }
  };

  const handleClear = () => {
    playTapSound(500, 0.03);
    setDisplay('0');
    setEquation('');
    setHasEvaluated(false);
  };

  const handleBackspace = () => {
    playTapSound(500, 0.02);
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handlePercent = () => {
    playTapSound(600, 0.02);
    const val = parseFloat(display);
    setDisplay(String(val / 100));
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 text-white flex flex-col select-none overflow-hidden animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md">
        <h2 className="text-lg font-bold tracking-tight text-white">SUNNY Calculator</h2>
        <button
          type="button"
          onClick={() => {
            playTapSound(500);
            onClose();
          }}
          className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-neutral-300 hover:text-white"
          aria-label="Close Calculator"
        >
          <X size={18} />
        </button>
      </div>

      {/* Screen Display */}
      <div className="flex-1 flex flex-col justify-end p-6 text-right">
        <div className="text-sm font-mono text-neutral-400 min-h-6">{equation}</div>
        <div className="text-5xl font-mono font-bold tracking-tight text-white truncate my-2">
          {display}
        </div>
      </div>

      {/* Keypad Grid (MagicOS Styling) */}
      <div className="p-4 grid grid-cols-4 gap-3 max-w-sm mx-auto w-full pb-8">
        {/* Row 1 */}
        <button
          type="button"
          onClick={handleClear}
          className="h-16 rounded-full bg-neutral-800 text-amber-400 text-lg font-bold active:scale-95 transition-transform"
        >
          C
        </button>
        <button
          type="button"
          onClick={handleBackspace}
          className="h-16 rounded-full bg-neutral-800 text-neutral-200 flex items-center justify-center active:scale-95 transition-transform"
        >
          <Delete size={20} />
        </button>
        <button
          type="button"
          onClick={handlePercent}
          className="h-16 rounded-full bg-neutral-800 text-neutral-200 text-lg font-semibold active:scale-95 transition-transform"
        >
          %
        </button>
        <button
          type="button"
          onClick={() => handleOperator('÷')}
          className="h-16 rounded-full bg-amber-600 text-white text-2xl font-bold active:scale-95 transition-transform"
        >
          ÷
        </button>

        {/* Row 2 */}
        {['7', '8', '9'].map((n) => (
          <button
            type="button"
            key={n}
            onClick={() => handleNum(n)}
            className="h-16 rounded-full bg-neutral-900 text-white text-2xl font-semibold active:scale-95 transition-transform border border-neutral-800"
          >
            {n}
          </button>
        ))}
        <button
          type="button"
          onClick={() => handleOperator('×')}
          className="h-16 rounded-full bg-amber-600 text-white text-2xl font-bold active:scale-95 transition-transform"
        >
          ×
        </button>

        {/* Row 3 */}
        {['4', '5', '6'].map((n) => (
          <button
            type="button"
            key={n}
            onClick={() => handleNum(n)}
            className="h-16 rounded-full bg-neutral-900 text-white text-2xl font-semibold active:scale-95 transition-transform border border-neutral-800"
          >
            {n}
          </button>
        ))}
        <button
          type="button"
          onClick={() => handleOperator('-')}
          className="h-16 rounded-full bg-amber-600 text-white text-2xl font-bold active:scale-95 transition-transform"
        >
          −
        </button>

        {/* Row 4 */}
        {['1', '2', '3'].map((n) => (
          <button
            type="button"
            key={n}
            onClick={() => handleNum(n)}
            className="h-16 rounded-full bg-neutral-900 text-white text-2xl font-semibold active:scale-95 transition-transform border border-neutral-800"
          >
            {n}
          </button>
        ))}
        <button
          type="button"
          onClick={() => handleOperator('+')}
          className="h-16 rounded-full bg-amber-600 text-white text-2xl font-bold active:scale-95 transition-transform"
        >
          +
        </button>

        {/* Row 5 */}
        <button
          type="button"
          onClick={() => handleNum('00')}
          className="h-16 rounded-full bg-neutral-900 text-white text-xl font-semibold active:scale-95 transition-transform border border-neutral-800"
        >
          00
        </button>
        <button
          type="button"
          onClick={() => handleNum('0')}
          className="h-16 rounded-full bg-neutral-900 text-white text-2xl font-semibold active:scale-95 transition-transform border border-neutral-800"
        >
          0
        </button>
        <button
          type="button"
          onClick={() => handleNum('.')}
          className="h-16 rounded-full bg-neutral-900 text-white text-2xl font-bold active:scale-95 transition-transform border border-neutral-800"
        >
          .
        </button>
        <button
          type="button"
          onClick={handleEquals}
          className="h-16 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-neutral-950 text-2xl font-bold active:scale-95 transition-transform shadow-lg shadow-amber-500/20"
        >
          =
        </button>
      </div>
    </div>
  );
};
