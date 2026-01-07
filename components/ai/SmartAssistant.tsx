'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, X, Check } from 'lucide-react';
import { aiService } from '@/lib/ai-service';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AISuggestion {
  id: string;
  text: string;
  type: 'completion' | 'formatting' | 'title' | 'summary';
  confidence: number;
}

interface SmartAssistantProps {
  content: string;
  cursorPosition: number;
  onSuggestionApply: (suggestion: string, type: string) => void;
  className?: string;
}

export function SmartAssistant({ content, cursorPosition, onSuggestionApply, className }: SmartAssistantProps) {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'completion' | 'formatting' | 'title' | 'summary'>('completion');
  const [isMinimized, setIsMinimized] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (content.length > 10 && !isMinimized) {
        generateSuggestions();
      }
    }, 1000);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [content, cursorPosition, activeTab, isMinimized]);

  const generateSuggestions = async () => {
    setIsLoading(true);
    try {
      let newSuggestions: AISuggestion[] = [];

      switch (activeTab) {
        case 'completion':
          const completions = await aiService.generateSuggestions(content, cursorPosition);
          newSuggestions = completions.map((text, index) => ({
            id: `completion-${index}`,
            text,
            type: 'completion' as const,
            confidence: 0.8 + Math.random() * 0.2
          }));
          break;

        case 'formatting':
          const formattingResult = await aiService.improveFormatting(content);
          newSuggestions = formattingResult.suggestions.map((text, index) => ({
            id: `formatting-${index}`,
            text,
            type: 'formatting' as const,
            confidence: 0.7 + Math.random() * 0.3
          }));
          break;

        case 'title':
          const titles = await aiService.generateTitleSuggestions(content);
          newSuggestions = titles.map((text, index) => ({
            id: `title-${index}`,
            text,
            type: 'title' as const,
            confidence: 0.6 + Math.random() * 0.4
          }));
          break;

        case 'summary':
          const summary = await aiService.summarizeDocument(content);
          newSuggestions = [{
            id: 'summary-0',
            text: summary,
            type: 'summary' as const,
            confidence: 0.8
          }];
          break;
      }

      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: AISuggestion) => {
    onSuggestionApply(suggestion.text, suggestion.type);
  };

  const tabs = [
    { id: 'completion', label: 'Complete', icon: '✍️' },
    { id: 'formatting', label: 'Format', icon: '🎨' },
    { id: 'title', label: 'Title', icon: '📝' },
    { id: 'summary', label: 'Summary', icon: '📋' }
  ] as const;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={cn(
          "fixed right-4 bottom-4 w-80 bg-background border rounded-lg shadow-lg z-50",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">AI Assistant</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-6 w-6 p-0"
            >
              {isMinimized ? '🔼' : '🔽'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSuggestions([])}
              className="h-6 w-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Tabs */}
            <div className="flex border-b">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex-1 px-2 py-2 text-xs font-medium transition-colors",
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  <span className="mr-1">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="max-h-64 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : suggestions.length > 0 ? (
                <div className="p-2 space-y-2">
                  {suggestions.map((suggestion) => (
                    <motion.div
                      key={suggestion.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card 
                        className="p-3 cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-sm leading-relaxed">
                              {suggestion.text}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full" />
                                <span className="text-xs text-muted-foreground">
                                  {Math.round(suggestion.confidence * 100)}% confidence
                                </span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {suggestion.type}
                              </span>
                            </div>
                          </div>
                          <Check className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  {content.length > 10 
                    ? "Start typing to see suggestions..."
                    : "Type more content to get AI suggestions..."
                  }
                </div>
              )}
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
