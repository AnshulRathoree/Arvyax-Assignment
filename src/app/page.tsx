'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { FaLock, FaSave, FaCog } from 'react-icons/fa';

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
          <p className="mt-4 text-sm text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect
  }

  return (
    <Layout>
      <div className="text-center relative">
        {/* Hero Section */}
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-slate-900">
              Session Management
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-600 max-w-xl mx-auto">
              A simple platform for creating and managing sessions with auto-save functionality.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                onClick={() => router.push('/register')}
                className="px-6 py-3 font-medium"
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/login')}
                className="px-6 py-3 font-medium"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mx-auto mt-20 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Key Features
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Essential tools for session management with security and reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="group hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center mb-3">
                  <FaLock className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-lg font-semibold text-slate-800">
                  Secure Authentication
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm leading-relaxed">
                  JWT authentication with password hashing and route protection.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center mb-3">
                  <FaSave className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-lg font-semibold text-slate-800">
                  Auto-Save Drafts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Automatic draft saving after 5 seconds of inactivity.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-3">
                  <FaCog className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-lg font-semibold text-slate-800">
                  Session Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Create, edit, and publish sessions with tagging support.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
