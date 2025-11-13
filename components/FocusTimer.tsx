'use client';

import { useEffect, useMemo, useState } from 'react';
import { PauseIcon, PlayIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

const presets = [25, 45, 60];

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export default function FocusTimer() {
  const [duration, setDuration] = useState(presets[0] * 60);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [active, setActive] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (active && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => Math.max(prev - 1, 0));
      }, 1000);
    }
    if (timeLeft === 0) {
      setActive(false);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [active, timeLeft]);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  const progress = useMemo(() => 100 - Math.floor((timeLeft / duration) * 100), [timeLeft, duration]);

  return (
    <section className="rounded-3xl border border-slate-800/70 bg-slate-900/70 p-6">
      <header className="flex items-center justify-between text-sm text-slate-300">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-200">Focus loop</p>
          <h2 className="text-lg font-semibold text-white">Pomodoro timer</h2>
        </div>
        <button
          type="button"
          onClick={() => {
            setActive(false);
            setTimeLeft(duration);
          }}
          className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-slate-300 transition hover:border-brand-400/50 hover:text-white"
        >
          <ArrowPathIcon className="h-4 w-4" /> Reset
        </button>
      </header>
      <div className="mt-6 flex flex-col items-center gap-6">
        <div className="relative flex h-40 w-40 items-center justify-center">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
            <circle
              className="text-slate-800"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
            />
            <circle
              className="text-brand-400"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
              strokeDasharray={`${Math.PI * 2 * 45}`}
              strokeDashoffset={`${((100 - progress) / 100) * Math.PI * 2 * 45}`}
            />
          </svg>
          <span className="absolute text-3xl font-semibold text-white">{formatTime(timeLeft)}</span>
        </div>
        <div className="flex gap-2">
          {presets.map(minutes => (
            <button
              key={minutes}
              type="button"
              onClick={() => {
                setActive(false);
                setDuration(minutes * 60);
              }}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                duration === minutes * 60
                  ? 'bg-brand-500 text-white shadow-brand-500/30'
                  : 'bg-slate-950/60 text-slate-300 hover:text-white'
              }`}
            >
              {minutes} min
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setActive(prev => !prev)}
          className="flex items-center gap-2 rounded-full bg-brand-500 px-6 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-brand-500/40 transition hover:bg-brand-400"
        >
          {active ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
          {active ? 'Pause' : 'Start'} focus
        </button>
      </div>
    </section>
  );
}
