'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/ui/Toast';
import { apiClient } from '@/utils/api';
import Layout from '@/components/layout/Layout';
import SessionEditor from '@/components/forms/SessionEditor';
import Button from '@/components/ui/Button';
import { Session } from '@/types';

export default function EditSessionPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;

  const fetchSession = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getMySession(sessionId);

      if (response.success) {
        setSession(response.data as Session);
      } else {
        showToast('Session not found', 'error');
        router.push('/my-sessions');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch session';
      showToast(errorMessage, 'error');
      router.push('/my-sessions');
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, showToast, router]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user && sessionId) {
      fetchSession();
    }
  }, [user, authLoading, sessionId, router, fetchSession]);



  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !session) {
    return null; // Will redirect
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Session</h1>
            <p className="mt-2 text-gray-600">
              Edit your wellness session with auto-save functionality
            </p>
          </div>
          <Button variant="outline" onClick={() => router.push('/my-sessions')}>
            Back to My Sessions
          </Button>
        </div>

        <SessionEditor
          sessionId={sessionId}
          initialData={{
            title: session.title,
            tags: session.tags,
            json_file_url: session.json_file_url,
            status: session.status
          }}
        />
      </div>
    </Layout>
  );
}
