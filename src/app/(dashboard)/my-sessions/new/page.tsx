'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Layout from '@/components/layout/Layout';
import SessionEditor from '@/components/forms/SessionEditor';
import Button from '@/components/ui/Button';

export default function NewSessionPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <div className="relative">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
            <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full border-4 border-indigo-300 opacity-20 mx-auto"></div>
          </div>
          <p className="mt-4 text-sm font-medium text-slate-600">Loading session editor...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <Layout>
      <div className="space-y-6 md:space-y-8">
        {/* Header Section - Fully Responsive */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Create New Session
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
              Create a new session with auto-save functionality
            </p>
          </div>
          <div className="flex-shrink-0">
            <Button
              variant="outline"
              onClick={() => router.push('/my-sessions')}
              className="w-full sm:w-auto px-4 py-2 text-sm"
            >
              <span className="hidden sm:inline">← Back to My Sessions</span>
              <span className="sm:hidden">← Back</span>
            </Button>
          </div>
        </div>

        {/* Session Editor - Responsive Container */}
        <div className="w-full">
          <SessionEditor />
        </div>
      </div>
    </Layout>
  );
}
