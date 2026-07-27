import React from 'react';

export function AccuracyNote({ text }: { text: string }): React.JSX.Element {
  return (
    <footer className="text-center text-xs font-medium text-ink-muted dark:text-slate-500 py-4 border-t border-slate-200 dark:border-slate-800">
      <p>{text} &middot; Dipersembahkan dengan standar presisi dama.id</p>
    </footer>
  );
}
