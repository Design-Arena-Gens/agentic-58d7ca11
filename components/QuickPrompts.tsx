'use client';

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

const prompts = [
  'Build a 5-day calculus review sprint focused on integrals and substitution.',
  'Explain the difference between mitosis and meiosis with exam tips.',
  'I feel stuck—help me restart with a small action and motivation.',
  'Create a spaced repetition plan for Spanish vocabulary this week.'
];

export default function QuickPrompts({ onSelect }: { onSelect: (prompt: string) => void }) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 px-3 py-2 text-xs font-medium uppercase tracking-[0.2em] text-slate-300 transition hover:border-brand-400/60 hover:text-white">
        <SparklesIcon className="h-4 w-4" />
        Ideas
        <ChevronDownIcon className="h-4 w-4" />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-80 origin-top-right divide-y divide-slate-800 overflow-hidden rounded-2xl border border-slate-800/70 bg-slate-950/90 text-sm text-slate-200 shadow-xl">
          <div className="p-2">
            {prompts.map(prompt => (
              <Menu.Item key={prompt}>
                {({ active }) => (
                  <button
                    type="button"
                    onClick={() => onSelect(prompt)}
                    className={cn(
                      'w-full rounded-xl px-4 py-3 text-left transition',
                      active ? 'bg-brand-500/20 text-white' : 'hover:bg-slate-900/80'
                    )}
                  >
                    {prompt}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
