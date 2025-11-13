'use client';

import { useAssistantWorkspace } from '@/components/AssistantWorkspaceContext';
import { ClockIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function SessionRecap() {
  const { snapshot } = useAssistantWorkspace();

  return (
    <section className="rounded-3xl border border-slate-800/70 bg-slate-900/70 p-6">
      <header className="flex items-center gap-3">
        <SparklesIcon className="h-6 w-6 text-brand-300" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-200">Debrief</p>
          <h2 className="text-lg font-semibold text-white">Session recap</h2>
        </div>
      </header>
      {snapshot ? (
        <div className="mt-5 space-y-4 text-sm text-slate-300">
          <p className="text-slate-200">{snapshot.summary}</p>
          <ul className="space-y-3">
            {snapshot.actionItems.map(item => (
              <li key={item} className="flex items-start gap-3 rounded-xl bg-slate-950/60 p-3">
                <span className="mt-1 block h-2 w-2 rounded-full bg-brand-300" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          {snapshot.motivation && (
            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-emerald-100">
              <p className="text-xs font-semibold uppercase tracking-[0.2em]">Energy reminder</p>
              <p className="mt-2">{snapshot.motivation}</p>
            </div>
          )}
          {snapshot.reflection && (
            <div className="rounded-2xl border border-brand-400/30 bg-brand-500/10 p-4 text-brand-100">
              <p className="text-xs font-semibold uppercase tracking-[0.2em]">Reflect tonight</p>
              <p className="mt-2">{snapshot.reflection}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-800/70 bg-slate-950/50 p-6 text-center text-sm text-slate-400">
          <ClockIcon className="h-7 w-7 text-slate-600" />
          <p>No recap yet. Chat with the assistant to generate one.</p>
        </div>
      )}
    </section>
  );
}
