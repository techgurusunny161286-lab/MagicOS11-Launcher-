import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('MagicOS Launcher ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-neutral-950 text-white flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="w-16 h-16 rounded-3xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mb-4 text-2xl font-bold">
            ⚡
          </div>
          <h1 className="text-xl font-bold text-white mb-2">MagicOS 11 Launcher</h1>
          <p className="text-xs text-neutral-400 max-w-sm mb-6">
            A minor system state glitch occurred. Tap below to refresh MagicOS.
          </p>
          <button
            type="button"
            onClick={() => {
              try {
                localStorage.removeItem('ios27_control_center_toggles');
              } catch {}
              window.location.reload();
            }}
            className="px-6 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-sm shadow-lg shadow-cyan-500/25 active:scale-95 transition-all"
          >
            Restart MagicOS Launcher
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
