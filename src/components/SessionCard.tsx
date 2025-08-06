'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Session } from '@/types';
import {
  FaCheckCircle,
  FaEdit,
  FaTrash,
  FaExternalLinkAlt,
  FaCircle,
  FaHashtag
} from 'react-icons/fa';
import { MdDrafts } from 'react-icons/md';

interface SessionCardProps {
  session: Session & { author?: string };
  showActions?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function SessionCard({ 
  session, 
  showActions = false, 
  onEdit, 
  onDelete 
}: SessionCardProps) {
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm whitespace-nowrap flex-shrink-0';

    if (status === 'published') {
      return `${baseClasses} bg-gradient-to-r from-emerald-500 to-green-500 text-white`;
    } else {
      return `${baseClasses} bg-gradient-to-r from-amber-400 to-orange-400 text-white`;
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'published') {
      return <FaCheckCircle className="w-3 h-3" />;
    } else {
      return <MdDrafts className="w-3 h-3" />;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-start sm:justify-between sm:space-y-0 gap-3">
          <CardTitle className="text-lg sm:text-xl font-bold text-slate-800 line-clamp-2 group-hover:text-indigo-600 transition-colors flex-1 min-w-0 pr-2">
            {session.title}
          </CardTitle>
          <span className={getStatusBadge(session.status)}>
            {getStatusIcon(session.status)}
            <span>
              {session.status === 'published' ? 'Published' : 'Draft'}
            </span>
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {session.tags && session.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {session.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 sm:px-3 rounded-full text-xs font-semibold bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border border-indigo-200/50"
                >
                  <FaHashtag className="w-2.5 h-2.5" />
                  <span className="truncate max-w-20 sm:max-w-none">{tag}</span>
                </span>
              ))}
              {session.tags.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                  +{session.tags.length - 3}
                </span>
              )}
            </div>
          )}

          <div className="bg-slate-50 rounded-xl p-3 sm:p-4 border border-slate-200/60">
            <div className="flex items-center gap-2 mb-2">
              <FaCircle className="w-2 h-2 text-green-500 animate-pulse" />
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                <span className="hidden sm:inline">JSON Resource</span>
                <span className="sm:hidden">Resource</span>
              </span>
            </div>
            <a
              href={session.json_file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-800 font-medium break-all hover:underline transition-colors flex items-center gap-1 group"
            >
              <span className="truncate">{session.json_file_url}</span>
              <FaExternalLinkAlt className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </a>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-500 bg-slate-50/50 rounded-lg p-3 border border-slate-200/40">
            <div className="space-y-1 min-w-0 flex-1">
              {session.author && (
                <p className="flex items-center gap-1">
                  <FaCircle className="w-1.5 h-1.5 text-indigo-400 flex-shrink-0" />
                  <span className="font-medium">Author:</span>
                  <span className="truncate">{session.author}</span>
                </p>
              )}
              <p className="flex items-center gap-1">
                <FaCircle className="w-1.5 h-1.5 text-green-400 flex-shrink-0" />
                <span className="font-medium">Created:</span>
                <span>{formatDate(session.created_at)}</span>
              </p>
            </div>
            <div className="text-left sm:text-right flex-shrink-0">
              <p className="text-slate-400 text-xs">Last updated</p>
              <p className="font-medium">{formatDate(session.updated_at)}</p>
            </div>
          </div>

          {showActions && (
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit?.(session._id)}
                className="flex-1 border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300 flex items-center justify-center gap-2"
              >
                <FaEdit className="w-3 h-3" />
                <span>Edit</span>
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete?.(session._id)}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <FaTrash className="w-3 h-3" />
                <span>Delete</span>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
