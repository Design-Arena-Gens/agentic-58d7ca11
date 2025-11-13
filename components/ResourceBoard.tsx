'use client';

import Link from 'next/link';
import { BeakerIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import { useAssistantWorkspace } from '@/components/AssistantWorkspaceContext';
import { studyResources } from '@/data/resources';
import type { StudyResource } from '@/data/resources';
import type { AssistantSnapshot } from '@/components/AssistantWorkspaceContext';

export default function ResourceBoard() {
  const { snapshot } = useAssistantWorkspace();
  interface DisplayResource {
    title: string;
    url: string;
    description: string;
    type?: string;
  }

  type AssistantResource = AssistantSnapshot['resources'][number];

  const isStudyResource = (resource: AssistantResource | StudyResource): resource is StudyResource =>
    (resource as StudyResource).type !== undefined;

  const baseResources: Array<AssistantResource | StudyResource> = snapshot?.resources?.length
    ? snapshot.resources
    : studyResources.slice(0, 3);

  const resources: DisplayResource[] = baseResources.map(resource => ({
    title: resource.title,
    url: resource.url,
    description: resource.description,
    type: isStudyResource(resource) ? resource.type : undefined
  }));

  return (
    <section className="rounded-3xl border border-slate-800/70 bg-slate-900/70 p-6">
      <header className="flex items-center gap-3">
        <BeakerIcon className="h-6 w-6 text-brand-300" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-200">Support kit</p>
          <h2 className="text-lg font-semibold text-white">Resources</h2>
        </div>
      </header>
      <ul className="mt-5 space-y-3 text-sm text-slate-300">
        {resources.map(resource => (
          <li key={resource.title} className="rounded-2xl border border-slate-800/70 bg-slate-950/60 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">{resource.title}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">
                  {resource.type ?? 'Recommended'}
                </p>
              </div>
              <BookOpenIcon className="h-5 w-5 text-brand-200" />
            </div>
            <p className="mt-3 text-slate-300">{resource.description}</p>
            <Link
              href={resource.url}
              className="mt-3 inline-flex items-center text-xs font-semibold uppercase tracking-[0.2em] text-brand-200 hover:text-brand-100"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open resource ↗
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
