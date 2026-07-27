import React from 'react';

export function App(): React.JSX.Element {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="glass-card p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-ink dark:text-white mb-2">Sholat UP</h1>
        <p className="text-sm text-ink-muted dark:text-slate-400">Jadwal Sholat Presisi</p>
      </div>
    </div>
  );
}

export default App;
