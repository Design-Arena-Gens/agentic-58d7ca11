'use client';

import { useCallback, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import QuickPrompts from '@/components/QuickPrompts';
import { useAssistantWorkspace } from '@/components/AssistantWorkspaceContext';

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AssistantPayload {
  message: string;
  history: ConversationMessage[];
  context: {
    subject?: string;
    goal?: string;
    examDate?: string;
  };
  mode?: 'chat' | 'plan' | 'check-in';
}

interface AssistantResponse {
  reply: string;
  summary: string;
  actionItems: string[];
  resources: { title: string; url: string; description: string }[];
  studyPlan?: {
    summary: string;
    examCountdown?: number;
    blocks: {
      day: string;
      focus: string[];
      deepWork: string;
      review: string;
      checkpoints: string[];
    }[];
  };
  motivation?: string;
  reflection?: string;
}

function MessageBubble({ message }: { message: ConversationMessage }) {
  const isUser = message.role === 'user';
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed md:text-base ${
        isUser
          ? 'ml-auto bg-brand-500/90 text-white shadow-lg shadow-brand-500/30'
          : 'bg-slate-900/80 text-slate-100 ring-1 ring-slate-800/70'
      }`}
    >
      {message.content.split('\n').map((line, idx) => (
        <p key={`${idx}-${line.slice(0, 10)}`}>{line}</p>
      ))}
    </motion.div>
  );
}

function ActionBoard({ summary, actions, motivation, reflection }: {
  summary: string;
  actions: string[];
  motivation?: string;
  reflection?: string;
}) {
  return (
    <motion.aside
      layout
      className="rounded-2xl border border-slate-800/70 bg-slate-900/80 p-4 text-sm text-slate-300"
    >
      <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-200">Session Focus</h3>
      <p className="mt-2 text-slate-200">{summary}</p>
      <div className="mt-4">
        <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Action items</h4>
        <ul className="mt-2 space-y-2">
          {actions.map(item => (
            <li key={item} className="flex items-start gap-2 text-slate-300">
              <span className="mt-1 block h-2 w-2 rounded-full bg-brand-400" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      {motivation && (
        <div className="mt-4 rounded-xl bg-slate-950/60 p-3">
          <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">Energy Reset</h4>
          <p className="mt-2 text-slate-200">{motivation}</p>
        </div>
      )}
      {reflection && (
        <div className="mt-4 rounded-xl bg-slate-950/60 p-3">
          <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-200">Reflect</h4>
          <p className="mt-2 text-slate-200">{reflection}</p>
        </div>
      )}
    </motion.aside>
  );
}

function PlanPreview({ plan }: { plan: NonNullable<AssistantResponse['studyPlan']> }) {
  return (
    <motion.div
      layout
      className="mt-6 space-y-4 rounded-2xl border border-brand-400/30 bg-brand-500/10 p-4 text-sm text-slate-100"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-100">Study Plan</h3>
        {typeof plan.examCountdown === 'number' && (
          <span className="rounded-full border border-brand-400/40 px-3 py-1 text-xs text-brand-200">
            {plan.examCountdown} days to go
          </span>
        )}
      </div>
      <p className="text-slate-200">{plan.summary}</p>
      <div className="space-y-3">
        {plan.blocks.slice(0, 4).map(block => (
          <div key={block.day} className="rounded-xl bg-slate-950/70 p-3">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-200">{block.day}</p>
            <p className="mt-1 font-semibold text-slate-100">{block.focus[0]}</p>
            <p className="mt-1 text-xs text-slate-300">Deep work: {block.deepWork}</p>
            <p className="mt-1 text-xs text-slate-300">Review: {block.review}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function AssistantChat() {
  const [messages, setMessages] = useState<ConversationMessage[]>([
    {
      role: 'assistant',
      content:
        'Hi! I am your study partner. Tell me what you are working on today and we will co-design a focused plan.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { snapshot, updateSnapshot } = useAssistantWorkspace();

  const context = useMemo(() => ({
    subject: snapshot?.studyPlan ? snapshot.studyPlan.summary : undefined,
    goal: snapshot?.summary,
    examDate: snapshot?.studyPlan?.examCountdown ? `${snapshot.studyPlan.examCountdown} days` : undefined
  }), [snapshot]);

  const submitMessage = useCallback(
    async (payload: Partial<AssistantPayload>) => {
      const messageContent = payload.message;
      if (!messageContent) return;
      setLoading(true);
      const nextMessages: ConversationMessage[] = [...messages, { role: 'user', content: messageContent }];
      setMessages(nextMessages);

      try {
        const response = await fetch('/api/assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: messageContent,
            history: nextMessages,
            context: payload.context ?? context,
            mode: payload.mode ?? 'chat'
          })
        });

        if (!response.ok) {
          throw new Error('Request failed');
        }

        const data: AssistantResponse = await response.json();
        updateSnapshot({
          summary: data.summary,
          actionItems: data.actionItems,
          studyPlan: data.studyPlan,
          motivation: data.motivation,
          reflection: data.reflection,
          resources: data.resources
        });
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } catch (error) {
        console.error(error);
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: 'I ran into a hiccup processing that. Could you rephrase or try another request?'
          }
        ]);
      } finally {
        setLoading(false);
      }
    },
    [context, messages]
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!input.trim()) return;
      submitMessage({ message: input.trim() });
      setInput('');
    },
    [input, submitMessage]
  );

  return (
    <section className="flex h-[720px] flex-col overflow-hidden rounded-3xl border border-slate-800/60 bg-slate-900/60">
      <div className="flex items-baseline justify-between border-b border-slate-800/70 px-6 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-200">Conversation</p>
          <h2 className="text-xl font-semibold text-white">Assistant workspace</h2>
        </div>
        <QuickPrompts onSelect={prompt => submitMessage({ message: prompt })} />
      </div>
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-6 scrollbar-thin">
        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <MessageBubble key={`${message.role}-${index}`} message={message} />
          ))}
        </AnimatePresence>
      </div>
      <div className="border-t border-slate-800/70 bg-slate-950/60 p-4">
        {snapshot && (
          <ActionBoard
            summary={snapshot.summary}
            actions={snapshot.actionItems}
            motivation={snapshot.motivation}
            reflection={snapshot.reflection}
          />
        )}
        {snapshot?.studyPlan && <PlanPreview plan={snapshot.studyPlan} />}
        <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-3">
          <input
            className="flex-1 rounded-full border border-slate-800/70 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-brand-400 focus:outline-none"
            placeholder="Ask for a study plan, concept breakdown, or motivation check-in..."
            value={input}
            onChange={event => setInput(event.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/40 transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <PaperAirplaneIcon className="h-4 w-4" />
            Send
          </button>
        </form>
      </div>
    </section>
  );
}
