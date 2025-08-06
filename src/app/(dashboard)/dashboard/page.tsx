'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/ui/Toast';
import { apiClient } from '@/utils/api';
import Layout from '@/components/layout/Layout';
import SessionCard from '@/components/SessionCard';
import Button from '@/components/ui/Button';
import { Session } from '@/types';
import { FaEdit, FaCircle } from 'react-icons/fa';

export default function DashboardPage() {
  const [sessions, setSessions] = useState<(Session & { author?: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const fetchSessions = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getSessions();

      if (response.success) {
        setSessions((response.data as (Session & { author?: string })[]) || []);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch sessions';
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      fetchSessions();
    }
  }, [user, authLoading, router, fetchSessions]);



  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="text-center relative mb-12">
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
            Sessions Dashboard
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-6">
            Discover and explore published sessions from our community of creators
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200">
              <FaCircle className="w-2 h-2 text-green-500 animate-pulse" />
              {sessions.length} Sessions Available
            </span>
            <Button
              onClick={() => router.push('/my-sessions')}
              className="px-6 py-2 flex items-center gap-2"
            >
              <FaEdit className="w-4 h-4" />
              My Sessions
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No sessions yet</h3>
            <p className="mt-2 text-gray-600">
              No published wellness sessions available. Be the first to create one!
            </p>
            <div className="mt-6">
              <Button onClick={() => router.push('/my-sessions/new')}>
                Create First Session
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sessions.map((session) => (
              <SessionCard
                key={session._id}
                session={session}
                showActions={false}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
