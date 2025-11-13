'use client';

import { useState } from 'react';
import { CalendarIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssistantWorkspace } from '@/components/AssistantWorkspaceContext';
import type { AssistantResponse } from '@/lib/assistant';

interface PlannerState {
  subject: string;
  goal: string;
  examDate: string;
  minutes: number;
  days: number;
}

const defaultState: PlannerState = {
  subject: 'Biology',
  goal: 'Master cellular respiration pathways and practice FRQ responses',
  examDate: '',
  minutes: 90,
  days: 6
};

export default function StudyPlanner() {
  const [form, setForm] = useState<PlannerState>(defaultState);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<{
    summary: string;
    blocks: { day: string; focus: string[]; deepWork: string; review: string }[];
    examCountdown?: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { updateSnapshot, snapshot } = useAssistantWorkspace();

  const handleChange = (key: keyof PlannerState, value: string | number) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Create a study plan for ${form.subject} with goal ${form.goal}.`,
          context: {
            subject: form.subject,
            goal: form.goal,
            examDate: form.examDate,
            timePerDay: form.minutes,
            daysAvailable: form.days
          },
          mode: 'plan',
          history: []
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate plan');
      }

      const data: AssistantResponse = await response.json();
      setPlan(data.studyPlan ?? null);
      if (data.studyPlan) {
        updateSnapshot({
          summary: data.summary ?? data.studyPlan.summary,
          studyPlan: data.studyPlan,
          actionItems: data.actionItems,
          resources: data.resources ?? snapshot?.resources ?? []
        });
      }
    } catch (err) {
      setError('Unable to build plan right now. Try again soon.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-3xl border border-slate-800/70 bg-slate-900/70 p-6">
      <header className="flex items-center gap-3 text-sm text-slate-300">
        <ClipboardDocumentCheckIcon className="h-6 w-6 text-brand-300" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-200">Blueprint</p>
          <h2 className="text-lg font-semibold text-white">Sprint planner</h2>
        </div>
      </header>
      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-slate-400">Subject</label>
          <input
            className="mt-2 w-full rounded-2xl border border-slate-800/70 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-brand-400 focus:outline-none"
            value={form.subject}
            onChange={event => handleChange('subject', event.target.value)}
            placeholder="e.g. Organic Chemistry"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-slate-400">Outcome goal</label>
          <textarea
            rows={3}
            className="mt-2 w-full resize-none rounded-2xl border border-slate-800/70 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-brand-400 focus:outline-none"
            value={form.goal}
            onChange={event => handleChange('goal', event.target.value)}
            placeholder="Describe what success looks like."
          />
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="col-span-2">
            <label className="text-xs uppercase tracking-[0.2em] text-slate-400">Exam date (optional)</label>
            <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-800/70 bg-slate-950/60 px-4 py-3 text-white">
              <CalendarIcon className="h-5 w-5 text-slate-500" />
              <input
                type="date"
                value={form.examDate}
                onChange={event => handleChange('examDate', event.target.value)}
                className="w-full bg-transparent text-sm focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-slate-400">Focus (min)</label>
            <input
              type="number"
              min={30}
              max={240}
              step={15}
              value={form.minutes}
              onChange={event => handleChange('minutes', Number(event.target.value))}
              className="mt-2 w-full rounded-2xl border border-slate-800/70 bg-slate-950/60 px-4 py-3 text-sm text-white focus:border-brand-400 focus:outline-none"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[4, 6, 8, 10].map(option => (
            <button
              key={option}
              type="button"
              onClick={() => handleChange('days', option)}
              className={`rounded-2xl border px-3 py-2 text-sm font-medium transition ${
                form.days === option
                  ? 'border-brand-400 bg-brand-500/20 text-white'
                  : 'border-slate-800/70 bg-slate-950/60 text-slate-300 hover:border-brand-400/50 hover:text-white'
              }`}
            >
              {option}-day plan
            </button>
          ))}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-brand-500 px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-brand-500/40 transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Building plan…' : 'Generate sprint'}
        </button>
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="text-sm text-rose-300"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </form>
      <AnimatePresence>
        {plan && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            className="mt-5 space-y-4 rounded-2xl border border-brand-400/30 bg-brand-500/10 p-4 text-sm text-slate-100"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-200">Preview</h3>
              {plan.examCountdown !== undefined && (
                <span className="rounded-full border border-brand-400/50 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-brand-100">
                  {plan.examCountdown} days out
                </span>
              )}
            </div>
            <p className="text-slate-200">{plan.summary}</p>
            <ul className="space-y-3">
              {plan.blocks.slice(0, 3).map(block => (
                <li key={block.day} className="rounded-xl bg-slate-950/70 p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-brand-200">{block.day}</p>
                  <p className="mt-2 font-semibold text-white">{block.focus[0]}</p>
                  <p className="mt-2 text-[13px] text-slate-300">Deep work: {block.deepWork}</p>
                  <p className="mt-1 text-[13px] text-slate-300">Review: {block.review}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
