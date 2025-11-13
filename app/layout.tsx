import type { Metadata } from 'next';
import { Inter, Source_Serif_4 } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const sourceSerif = Source_Serif_4({ subsets: ['latin'], variable: '--font-source-serif' });

export const metadata: Metadata = {
  title: 'Student AI Companion',
  description: 'An AI assistant that helps students plan, learn, and stay focused.',
  icons: {
    icon: '/favicon.ico'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(inter.variable, sourceSerif.variable)}>
      <body className="bg-slate-950">
        {children}
      </body>
    </html>
  );
}
