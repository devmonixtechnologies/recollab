'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  History, 
  Clock, 
  User, 
  RotateCcw, 
  GitCompare,
  Loader2,
  X,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { IDocumentVersion } from '@/lib/models/DocumentVersion';
import { formatDistanceToNow } from 'date-fns';

interface VersionHistoryProps {
  roomId: string;
  onRestoreVersion: (version: number) => void;
  onCompareVersions: (version1: number, version2: number) => void;
}

export const VersionHistory = ({ roomId, onRestoreVersion, onCompareVersions }: VersionHistoryProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [versions, setVersions] = useState<IDocumentVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedVersions, setExpandedVersions] = useState<Set<number>>(new Set());
  const [selectedVersions, setSelectedVersions] = useState<number[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadVersions();
    }
  }, [isOpen, roomId]);

  const loadVersions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/versions/${roomId}`);
      const data = await response.json();
      setVersions(data.versions || []);
    } catch (error) {
      console.error('Error loading versions:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleVersionExpansion = (version: number) => {
    const newExpanded = new Set(expandedVersions);
    if (newExpanded.has(version)) {
      newExpanded.delete(version);
    } else {
      newExpanded.add(version);
    }
    setExpandedVersions(newExpanded);
  };

  const toggleVersionSelection = (version: number) => {
    if (selectedVersions.includes(version)) {
      setSelectedVersions(selectedVersions.filter(v => v !== version));
    } else {
      const newSelection = [...selectedVersions, version].slice(-2); // Keep only last 2 selections
      setSelectedVersions(newSelection);
    }
  };

  const handleCompare = () => {
    if (selectedVersions.length === 2) {
      onCompareVersions(selectedVersions[0], selectedVersions[1]);
    }
  };

  const getVersionTypeColor = (changeDescription?: string) => {
    if (!changeDescription) return 'secondary';
    if (changeDescription.includes('Major')) return 'destructive';
    if (changeDescription.includes('Minor')) return 'outline';
    return 'default';
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        size="sm"
        variant="outline"
        className="fixed bottom-4 left-4 z-50 bg-green-50 hover:bg-green-100 border-green-200"
      >
        <History className="w-4 h-4 mr-2" />
        Version History
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 left-4 z-50 w-96 max-h-[500px] shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <History className="w-5 h-5 mr-2 text-green-600" />
            Version History
          </CardTitle>
          <div className="flex gap-2">
            {selectedVersions.length === 2 && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleCompare}
                className="text-xs"
              >
                <GitCompare className="w-3 h-3 mr-1" />
                Compare
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="overflow-y-auto max-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="ml-2 text-sm text-gray-600">Loading versions...</span>
          </div>
        ) : versions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <History className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No version history available</p>
          </div>
        ) : (
          <div className="space-y-2">
            {versions.map((version) => (
              <div
                key={version.version}
                className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                  selectedVersions.includes(version.version)
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => toggleVersionSelection(version.version)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleVersionExpansion(version.version);
                      }}
                      className="p-0 h-auto"
                    >
                      {expandedVersions.has(version.version) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </Button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">v{version.version}</span>
                        <Badge variant={getVersionTypeColor(version.changeDescription)} className="text-xs">
                          {version.changeDescription || 'Updated'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(version.createdAt), { addSuffix: true })}
                        <User className="w-3 h-3 ml-2" />
                        {version.authorName || version.author}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRestoreVersion(version.version);
                    }}
                    className="text-green-600 hover:text-green-700"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
                
                {expandedVersions.has(version.version) && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="text-sm">
                      <p className="font-medium mb-1">Title: {version.title}</p>
                      <div className="bg-gray-50 rounded p-2 max-h-32 overflow-y-auto">
                        <p className="text-xs text-gray-600 whitespace-pre-wrap">
                          {version.content.substring(0, 200)}
                          {version.content.length > 200 && '...'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
