'use client';

import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Sparkles, 
  FileText, 
  Lightbulb, 
  Wand2,
  Loader2,
  X
} from 'lucide-react';
import { aiService } from '@/lib/ai-service';
import { useEditor } from '@lexical/react/useEditor';

interface AIAssistantProps {
  content: string;
  onApplySuggestion: (suggestion: string) => void;
  onImproveFormatting: (improvedContent: string) => void;
  onUpdateTitle: (title: string) => void;
}

export const AIAssistant = ({ 
  content, 
  onApplySuggestion, 
  onImproveFormatting,
  onUpdateTitle 
}: AIAssistantProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'summarize' | 'suggest' | 'format' | 'titles'>('summarize');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [formatSuggestions, setFormatSuggestions] = useState<string[]>([]);
  const [titleSuggestions, setTitleSuggestions] = useState<string[]>([]);

  const handleSummarize = useCallback(async () => {
    if (!content.trim()) return;
    
    setLoading(true);
    try {
      const result = await aiService.summarizeDocument(content);
      setSummary(result);
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setLoading(false);
    }
  }, [content]);

  const handleGenerateSuggestions = useCallback(async () => {
    if (!content.trim()) return;
    
    setLoading(true);
    try {
      const result = await aiService.generateSuggestions(content, content.length);
      setSuggestions(result);
    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setLoading(false);
    }
  }, [content]);

  const handleImproveFormatting = useCallback(async () => {
    if (!content.trim()) return;
    
    setLoading(true);
    try {
      const result = await aiService.improveFormatting(content);
      setFormatSuggestions(result.suggestions);
      if (result.improvedContent !== content) {
        onImproveFormatting(result.improvedContent);
      }
    } catch (error) {
      console.error('Error improving formatting:', error);
    } finally {
      setLoading(false);
    }
  }, [content, onImproveFormatting]);

  const handleGenerateTitles = useCallback(async () => {
    if (!content.trim()) return;
    
    setLoading(true);
    try {
      const result = await aiService.generateTitleSuggestions(content);
      setTitleSuggestions(result);
    } catch (error) {
      console.error('Error generating titles:', error);
    } finally {
      setLoading(false);
    }
  }, [content]);

  const tabs = [
    { id: 'summarize' as const, label: 'Summarize', icon: FileText },
    { id: 'suggest' as const, label: 'Suggest', icon: Lightbulb },
    { id: 'format' as const, label: 'Format', icon: Wand2 },
    { id: 'titles' as const, label: 'Titles', icon: Sparkles },
  ];

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        size="sm"
        variant="outline"
        className="fixed bottom-4 right-4 z-50 bg-blue-50 hover:bg-blue-100 border-blue-200"
      >
        <Bot className="w-4 h-4 mr-2" />
        AI Assistant
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-96 max-h-[500px] shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Bot className="w-5 h-5 mr-2 text-blue-600" />
            AI Assistant
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className="text-xs"
              >
                <Icon className="w-3 h-3 mr-1" />
                {tab.label}
              </Button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 overflow-y-auto max-h-[350px]">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="ml-2 text-sm text-gray-600">AI thinking...</span>
          </div>
        )}

        {!loading && activeTab === 'summarize' && (
          <div className="space-y-3">
            <Button 
              onClick={handleSummarize}
              disabled={!content.trim()}
              size="sm"
              className="w-full"
            >
              <FileText className="w-4 h-4 mr-2" />
              Generate Summary
            </Button>
            {summary && (
              <div className="p-3 bg-gray-50 rounded-lg text-sm">
                <p className="font-medium mb-2">Document Summary:</p>
                <p className="text-gray-700">{summary}</p>
              </div>
            )}
          </div>
        )}

        {!loading && activeTab === 'suggest' && (
          <div className="space-y-3">
            <Button 
              onClick={handleGenerateSuggestions}
              disabled={!content.trim()}
              size="sm"
              className="w-full"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              Get Suggestions
            </Button>
            {suggestions.length > 0 && (
              <div className="space-y-2">
                <p className="font-medium text-sm">Suggestions:</p>
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="p-2 bg-blue-50 rounded cursor-pointer hover:bg-blue-100 text-sm"
                    onClick={() => onApplySuggestion(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!loading && activeTab === 'format' && (
          <div className="space-y-3">
            <Button 
              onClick={handleImproveFormatting}
              disabled={!content.trim()}
              size="sm"
              className="w-full"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Improve Formatting
            </Button>
            {formatSuggestions.length > 0 && (
              <div className="space-y-2">
                <p className="font-medium text-sm">Formatting improvements applied:</p>
                {formatSuggestions.map((suggestion, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {suggestion}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

        {!loading && activeTab === 'titles' && (
          <div className="space-y-3">
            <Button 
              onClick={handleGenerateTitles}
              disabled={!content.trim()}
              size="sm"
              className="w-full"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Titles
            </Button>
            {titleSuggestions.length > 0 && (
              <div className="space-y-2">
                <p className="font-medium text-sm">Title suggestions:</p>
                {titleSuggestions.map((title, index) => (
                  <div
                    key={index}
                    className="p-2 bg-green-50 rounded cursor-pointer hover:bg-green-100 text-sm"
                    onClick={() => onUpdateTitle(title)}
                  >
                    {title}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
