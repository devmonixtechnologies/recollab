'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  GitCompare, 
  X, 
  ArrowLeft, 
  ArrowRight,
  Plus,
  Minus,
  Loader2
} from 'lucide-react';
import { IDocumentVersion } from '@/lib/models/DocumentVersion';

interface VersionComparisonProps {
  roomId: string;
  version1: number;
  version2: number;
  onClose: () => void;
}

interface ComparisonResult {
  version1: IDocumentVersion;
  version2: IDocumentVersion;
  diff: string;
}

export const VersionComparison = ({ roomId, version1, version2, onClose }: VersionComparisonProps) => {
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadComparison();
  }, [roomId, version1, version2]);

  const loadComparison = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/versions/${roomId}/compare?v1=${version1}&v2=${version2}`);
      const data = await response.json();
      setComparison(data);
    } catch (error) {
      console.error('Error loading comparison:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderDiff = (diff: string) => {
    const lines = diff.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('- ')) {
        return (
          <div key={index} className="flex items-start gap-2 text-red-700 bg-red-50 p-1 rounded">
            <Minus className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span className="text-sm">{line.substring(2)}</span>
          </div>
        );
      } else if (line.startsWith('+ ')) {
        return (
          <div key={index} className="flex items-start gap-2 text-green-700 bg-green-50 p-1 rounded">
            <Plus className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span className="text-sm">{line.substring(2)}</span>
          </div>
        );
      } else if (line.startsWith('Line ')) {
        return (
          <div key={index} className="font-medium text-sm text-gray-600 mt-2 mb-1">
            {line}
          </div>
        );
      } else if (line.trim()) {
        return (
          <div key={index} className="text-sm text-gray-700 p-1">
            {line}
          </div>
        );
      }
      return null;
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-full max-w-4xl max-h-[80vh]">
          <CardContent className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-2 text-lg">Comparing versions...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!comparison) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-full max-w-4xl max-h-[80vh]">
          <CardContent className="flex items-center justify-center py-16">
            <p className="text-red-600">Failed to load comparison</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[80vh] flex flex-col">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-lg">
              <GitCompare className="w-5 h-5 mr-2" />
              Version Comparison
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline">v{version1}</Badge>
              <span className="text-sm text-gray-600">
                {comparison.version1.authorName || comparison.version1.author}
              </span>
            </div>
            
            <div className="flex items-center gap-1 text-gray-400">
              <ArrowRight className="w-4 h-4" />
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline">v{version2}</Badge>
              <span className="text-sm text-gray-600">
                {comparison.version2.authorName || comparison.version2.author}
              </span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Version {version1}</h4>
                <div className="bg-gray-50 rounded p-3">
                  <p className="font-medium text-sm mb-1">{comparison.version1.title}</p>
                  <p className="text-xs text-gray-600 mb-2">
                    {comparison.version1.changeDescription}
                  </p>
                  <div className="bg-white rounded p-2 max-h-32 overflow-y-auto">
                    <p className="text-xs whitespace-pre-wrap">
                      {comparison.version1.content.substring(0, 300)}
                      {comparison.version1.content.length > 300 && '...'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-2">Version {version2}</h4>
                <div className="bg-gray-50 rounded p-3">
                  <p className="font-medium text-sm mb-1">{comparison.version2.title}</p>
                  <p className="text-xs text-gray-600 mb-2">
                    {comparison.version2.changeDescription}
                  </p>
                  <div className="bg-white rounded p-2 max-h-32 overflow-y-auto">
                    <p className="text-xs whitespace-pre-wrap">
                      {comparison.version2.content.substring(0, 300)}
                      {comparison.version2.content.length > 300 && '...'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-sm mb-2">Differences</h4>
              <div className="bg-gray-50 rounded p-4 max-h-64 overflow-y-auto">
                {comparison.diff === 'No differences found' ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No differences found between these versions
                  </p>
                ) : (
                  <div className="space-y-1">
                    {renderDiff(comparison.diff)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
