'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/components/ui/Toast';
import { apiClient } from '@/utils/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { SessionResponse } from '@/types';
import { FaSave, FaRocket } from 'react-icons/fa';

const sessionSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters'),
  tags: z.string(),
  json_file_url: z.string().url('Please enter a valid URL')
});

type SessionFormData = z.infer<typeof sessionSchema>;

interface SessionEditorProps {
  sessionId?: string;
  initialData?: {
    title: string;
    tags: string[];
    json_file_url: string;
    status: 'draft' | 'published';
  };
}

export default function SessionEditor({ sessionId: initialSessionId, initialData }: SessionEditorProps) {
  const [sessionId, setSessionId] = useState<string | undefined>(initialSessionId);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { showToast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty }
  } = useForm<SessionFormData>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      title: initialData?.title || '',
      tags: initialData?.tags?.join(', ') || '',
      json_file_url: initialData?.json_file_url || ''
    }
  });

  // Watch form values for auto-save
  const watchedValues = watch();

  /**
   * Auto-save functionality that triggers after 5 seconds of inactivity
   * Only saves if form is dirty and has required fields (title and JSON URL)
   * Provides user feedback through toast notifications
   */
  const autoSave = useCallback(async () => {
    // Don't auto-save if form is not dirty or missing required fields
    if (!isDirty || !watchedValues.title || !watchedValues.json_file_url) return;

    setIsSaving(true);
    try {
      // Parse tags from comma-separated string
      const tagsArray = watchedValues.tags
        ? watchedValues.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        : [];

      const sessionData = {
        _id: sessionId,
        title: watchedValues.title,
        tags: tagsArray,
        json_file_url: watchedValues.json_file_url
      };

      const response = await apiClient.saveDraft(sessionData);

      // Update sessionId if this was a new session
      if (!sessionId && response.data && typeof response.data === 'object' && '_id' in response.data) {
        const sessionData = response.data as { _id: string };
        setSessionId(sessionData._id);
      }

      setLastSaved(new Date());
      showToast('Draft saved automatically', 'info', 2000);
    } catch (error) {
      console.error('Auto-save failed:', error);
      // Don't show error toast for auto-save failures to avoid annoying users
    } finally {
      setIsSaving(false);
    }
  }, [watchedValues, isDirty, sessionId, showToast]);

  /**
   * Set up auto-save timer that triggers after 5 seconds of inactivity
   * Timer resets whenever form values change (debounce behavior)
   * This ensures we only save after user stops typing/editing
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isDirty) {
        autoSave();
      }
    }, 5000); // 5 seconds as specified in assignment

    // Cleanup timer on component unmount or when dependencies change
    return () => clearTimeout(timer);
  }, [watchedValues, autoSave, isDirty]);

  const onSaveDraft = async (data: SessionFormData) => {
    setIsLoading(true);
    try {
      const tagsArray = data.tags
        ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        : [];

      const sessionData = {
        _id: sessionId,
        title: data.title,
        tags: tagsArray,
        json_file_url: data.json_file_url
      };

      const response = await apiClient.saveDraft(sessionData);
      
      if (response.success) {
        showToast('Draft saved successfully!', 'success');
        setLastSaved(new Date());
        if (!sessionId && response.data) {
          const sessionData = response.data as SessionResponse;
          router.push(`/my-sessions/edit/${sessionData._id}`);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save draft';
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const onPublish = async (data: SessionFormData) => {
    setIsLoading(true);
    try {
      const tagsArray = data.tags
        ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        : [];

      const sessionData = {
        _id: sessionId,
        title: data.title,
        tags: tagsArray,
        json_file_url: data.json_file_url
      };

      const response = await apiClient.publishSession(sessionData);

      if (response.success) {
        showToast('Session published successfully!', 'success');
        // Update sessionId if this was a new session
        if (!sessionId && response.data && typeof response.data === 'object' && '_id' in response.data) {
          const sessionData = response.data as { _id: string };
          setSessionId(sessionData._id);
        }
        router.push('/my-sessions');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to publish session';
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <CardTitle className="text-xl sm:text-2xl font-bold text-slate-800">
            {sessionId ? 'Edit Session' : 'Create New Session'}
          </CardTitle>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-slate-500">
            {isSaving && (
              <span className="flex items-center">
                <svg className="mr-2 h-3 w-3 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="font-medium">Saving...</span>
              </span>
            )}
            {lastSaved && !isSaving && (
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                <span className="hidden sm:inline">Last saved: </span>
                <span className="font-medium">{lastSaved.toLocaleTimeString()}</span>
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 lg:p-8">
        <form className="space-y-6 lg:space-y-8">
          {/* Title Input - Full Width */}
          <div className="w-full">
            <Input
              label="Session Title"
              placeholder="Enter a descriptive title for your session"
              error={errors.title?.message}
              {...register('title')}
            />
          </div>

          {/* Tags Input - Full Width */}
          <div className="w-full">
            <Input
              label="Tags"
              placeholder="yoga, meditation, relaxation, mindfulness"
              helperText="Separate multiple tags with commas to help others discover your session"
              {...register('tags')}
            />
          </div>

          {/* JSON URL Input - Full Width */}
          <div className="w-full">
            <Input
              label="JSON File URL"
              placeholder="https://example.com/session-data.json"
              error={errors.json_file_url?.message}
              helperText="Provide a valid URL to the JSON file containing your session configuration"
              {...register('json_file_url')}
            />
          </div>

          {/* Action Buttons - Responsive Layout */}
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:flex-1 py-3 text-sm font-semibold"
              onClick={handleSubmit(onSaveDraft)}
              isLoading={isLoading}
            >
              <FaSave className="w-4 h-4" />
              <span className="hidden sm:inline">Save as Draft</span>
              <span className="sm:hidden">Save Draft</span>
            </Button>
            <Button
              type="button"
              className="w-full sm:flex-1 py-3 text-sm font-semibold"
              onClick={handleSubmit(onPublish)}
              isLoading={isLoading}
            >
              <FaRocket className="w-4 h-4" />
              <span className="hidden sm:inline">Publish Session</span>
              <span className="sm:hidden">Publish</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
