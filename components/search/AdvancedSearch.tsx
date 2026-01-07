'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Grid, List, FileText, Calendar, User, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: string;
  authorName?: string;
  tags: string[];
  collaborators: number;
  isPublic: boolean;
}

interface AdvancedSearchProps {
  documents: Document[];
  onDocumentSelect: (document: Document) => void;
  className?: string;
}

export function AdvancedSearch({ documents, onDocumentSelect, className }: AdvancedSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [sortBy, setSortBy] = useState<'title' | 'date' | 'collaborators'>('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filteredDocs, setFilteredDocs] = useState<Document[]>(documents);

  // Extract all unique tags from documents
  const allTags = Array.from(new Set(documents.flatMap(doc => doc.tags)));

  // Filter and sort documents
  useEffect(() => {
    let filtered = documents;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Tags filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(doc =>
        selectedTags.some(tag => doc.tags.includes(tag))
      );
    }

    // Date range filter
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    switch (dateRange) {
      case 'today':
        filtered = filtered.filter(doc => doc.updatedAt >= today);
        break;
      case 'week':
        filtered = filtered.filter(doc => doc.updatedAt >= weekAgo);
        break;
      case 'month':
        filtered = filtered.filter(doc => doc.updatedAt >= monthAgo);
        break;
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'date':
          return b.updatedAt.getTime() - a.updatedAt.getTime();
        case 'collaborators':
          return b.collaborators - a.collaborators;
        default:
          return 0;
      }
    });

    setFilteredDocs(filtered);
  }, [documents, searchQuery, selectedTags, dateRange, sortBy]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const DocumentCard = ({ document }: { document: Document }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className="cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => onDocumentSelect(document)}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-sm font-medium line-clamp-2">
              {document.title}
            </CardTitle>
            <div className="flex items-center gap-1">
              {document.isPublic && <Badge variant="secondary" className="text-xs">Public</Badge>}
              <Badge variant="outline" className="text-xs">
                {document.collaborators} 👥
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-xs text-muted-foreground line-clamp-3 mb-3">
            {document.content.substring(0, 150)}...
          </p>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {document.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {document.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{document.tags.length - 3}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{document.authorName || 'Anonymous'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(document.updatedAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        {/* Date Range Filter */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="all">All time</option>
            <option value="today">Today</option>
            <option value="week">This week</option>
            <option value="month">This month</option>
          </select>
        </div>

        {/* Sort Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="date">Last modified</option>
            <option value="title">Title</option>
            <option value="collaborators">Collaborators</option>
          </select>
        </div>
      </div>

      {/* Tags Filter */}
      {allTags.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Tags</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {allTags.map(tag => (
              <Button
                key={tag}
                variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleTag(tag)}
                className="text-xs"
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {filteredDocs.length} {filteredDocs.length === 1 ? 'document' : 'documents'} found
        </span>
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchQuery('')}
            className="text-xs"
          >
            Clear search
          </Button>
        )}
      </div>

      {/* Documents Grid/List */}
      <AnimatePresence>
        <div className={cn(
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            : "space-y-2"
        )}>
          {filteredDocs.map(document => (
            <motion.div
              key={document.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <DocumentCard document={document} />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {filteredDocs.length === 0 && (
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No documents found</p>
          <p className="text-sm text-muted-foreground mt-2">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
}
