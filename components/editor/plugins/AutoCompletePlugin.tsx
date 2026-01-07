'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, $isTextNode, TextNode } from 'lexical';
import { COMMAND_PRIORITY_LOW, KEY_ENTER_COMMAND, KEY_TAB_COMMAND } from 'lexical';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';
import { aiService } from '@/lib/ai-service';
import { cn } from '@/lib/utils';

interface CompletionItem {
  text: string;
  confidence: number;
  type: 'word' | 'phrase' | 'sentence';
}

export function AutoCompletePlugin() {
  const [editor] = useLexicalComposerContext();
  const [completions, setCompletions] = useState<CompletionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showCompletions, setShowCompletions] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const debounceRef = useRef<NodeJS.Timeout>();
  const completionRef = useRef<HTMLDivElement>(null);

  const generateCompletions = useCallback(async (content: string, position: number) => {
    setIsLoading(true);
    try {
      const suggestions = await aiService.generateSuggestions(content, position);
      const completionItems: CompletionItem[] = suggestions.slice(0, 5).map(text => ({
        text,
        confidence: 0.7 + Math.random() * 0.3,
        type: text.length > 20 ? 'sentence' : text.length > 5 ? 'phrase' : 'word' as const
      }));
      
      setCompletions(completionItems);
      setShowCompletions(completionItems.length > 0);
      setSelectedIndex(0);
    } catch (error) {
      console.error('Error generating completions:', error);
      setShowCompletions(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateCursorPosition = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const domSelection = window.getSelection();
      if (domSelection && domSelection.rangeCount > 0) {
        const range = domSelection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setCursorPosition({
          x: rect.left,
          y: rect.bottom + window.scrollY
        });
      }
    }
  }, []);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection) && !selection.isCollapsed()) {
          setShowCompletions(false);
          return;
        }

        const textContent = editorState.toJSON().root.children
          .map((child: any) => child.children?.map((c: any) => c.text).join('') || '')
          .join(' ');

        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
          if (textContent.length > 10) {
            generateCompletions(textContent, selection.anchor.offset);
            updateCursorPosition();
          }
        }, 500);
      });
    });
  }, [editor, generateCompletions, updateCursorPosition]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!showCompletions) return;

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex(prev => (prev + 1) % completions.length);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex(prev => (prev - 1 + completions.length) % completions.length);
      } else if (event.key === 'Enter' || event.key === 'Tab') {
        event.preventDefault();
        if (completions[selectedIndex]) {
          applyCompletion(completions[selectedIndex].text);
        }
      } else if (event.key === 'Escape') {
        setShowCompletions(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showCompletions, completions, selectedIndex]);

  const applyCompletion = (text: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const currentNode = selection.anchor.getNode();
        if ($isTextNode(currentNode)) {
          const currentText = currentNode.getText();
          const cursorOffset = selection.anchor.offset;
          
          // Find the last word boundary
          const beforeCursor = currentText.substring(0, cursorOffset);
          const lastSpaceIndex = beforeCursor.lastIndexOf(' ');
          const wordStartIndex = lastSpaceIndex === -1 ? 0 : lastSpaceIndex + 1;
          
          // Replace the partial word with completion
          const newText = currentText.substring(0, wordStartIndex) + text + currentText.substring(cursorOffset);
          currentNode.setText(newText);
          
          // Move cursor to end of completion
          const newOffset = wordStartIndex + text.length;
          selection.setAnchor(currentNode, newOffset);
          selection.setFocus(currentNode, newOffset);
        }
      }
    });
    
    setShowCompletions(false);
  };

  if (!showCompletions) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={completionRef}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="fixed z-50 bg-background border rounded-lg shadow-lg overflow-hidden"
        style={{
          left: cursorPosition.x,
          top: cursorPosition.y,
          minWidth: '200px',
          maxWidth: '400px'
        }}
      >
        {isLoading ? (
          <div className="flex items-center gap-2 p-3">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Generating suggestions...</span>
          </div>
        ) : (
          <div className="py-1">
            {completions.map((completion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "px-3 py-2 cursor-pointer transition-colors",
                  "hover:bg-accent",
                  index === selectedIndex && "bg-accent"
                )}
                onClick={() => applyCompletion(completion.text)}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm">{completion.text}</span>
                  <div className="flex items-center gap-1">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      completion.confidence > 0.8 ? "bg-green-500" :
                      completion.confidence > 0.6 ? "bg-yellow-500" : "bg-red-500"
                    )} />
                    <span className="text-xs text-muted-foreground capitalize">
                      {completion.type}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
