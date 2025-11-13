import Link from 'next/link';
import AssistantChat from '@/components/AssistantChat';
import StudyPlanner from '@/components/StudyPlanner';
import FocusTimer from '@/components/FocusTimer';
import ResourceBoard from '@/components/ResourceBoard';
import SessionRecap from '@/components/SessionRecap';
import { AssistantWorkspaceProvider } from '@/components/AssistantWorkspaceContext';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <AssistantWorkspaceProvider>
        <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-16 pt-10 lg:px-10">
        <header className="flex flex-col justify-between gap-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/80 to-slate-950 p-8 ring-1 ring-slate-800/60 md:flex-row md:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-brand-300/80">Student AI Companion</p>
            <h1 className="mt-3 text-4xl font-semibold text-white md:text-5xl">
              Plan smarter. Learn deeper. Stay kind to future you.
            </h1>
            <p className="mt-4 max-w-xl text-slate-300">
              An assistant that blends study planning, concept breakdowns, and accountability rituals so
              you can focus on the work that moves you forward.
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-900/60 px-4 py-2 font-medium text-brand-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Live session
            </span>
            <Link
              href="https://github.com/"
              className="rounded-full border border-slate-700/80 px-4 py-2 text-slate-300 transition hover:border-brand-400/70 hover:text-white"
            >
              View guide
            </Link>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[380px_1fr_320px]">
          <div className="flex flex-col gap-6">
            <StudyPlanner />
            <FocusTimer />
          </div>

          <AssistantChat />

          <div className="flex flex-col gap-6">
            <ResourceBoard />
            <SessionRecap />
          </div>
        </div>
        </section>
      </AssistantWorkspaceProvider>
    </main>
  );
}
