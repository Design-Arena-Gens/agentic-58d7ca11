'use client';

import { createContext, useContext, useMemo, useState } from 'react';

export interface AssistantSnapshot {
  summary: string;
  actionItems: string[];
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
  resources: {
    title: string;
    url: string;
    description: string;
  }[];
}

interface AssistantWorkspaceValue {
  snapshot: AssistantSnapshot | null;
  updateSnapshot: (update: Partial<AssistantSnapshot>) => void;
}

const AssistantWorkspaceContext = createContext<AssistantWorkspaceValue | null>(null);

export function AssistantWorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [snapshot, setSnapshot] = useState<AssistantSnapshot | null>(null);
  const value = useMemo(
    () => ({
      snapshot,
      updateSnapshot: (update: Partial<AssistantSnapshot>) =>
        setSnapshot(prev => ({
          summary: update.summary ?? prev?.summary ?? 'Session Initialized',
          actionItems: update.actionItems ?? prev?.actionItems ?? [],
          studyPlan: update.studyPlan ?? prev?.studyPlan,
          motivation: update.motivation ?? prev?.motivation,
          reflection: update.reflection ?? prev?.reflection,
          resources: update.resources ?? prev?.resources ?? []
        }))
    }),
    [snapshot]
  );

  return <AssistantWorkspaceContext.Provider value={value}>{children}</AssistantWorkspaceContext.Provider>;
}

export function useAssistantWorkspace() {
  const context = useContext(AssistantWorkspaceContext);
  if (!context) {
    throw new Error('useAssistantWorkspace must be used inside AssistantWorkspaceProvider');
  }
  return context;
}
