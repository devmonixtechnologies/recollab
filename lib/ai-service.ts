import { createClient } from '@supabase/supabase-js';

// AI Service for document enhancement features
export class AIService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || '';
    this.baseUrl = 'https://api.openai.com/v1';
  }

  // Summarize document content
  async summarizeDocument(content: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that summarizes documents concisely and accurately.'
            },
            {
              role: 'user',
              content: `Please summarize the following document:\n\n${content}`
            }
          ],
          max_tokens: 150,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      return data.choices[0]?.message?.content || 'Unable to generate summary';
    } catch (error) {
      console.error('Error summarizing document:', error);
      return 'Failed to generate summary';
    }
  }

  // Generate content suggestions based on context
  async generateSuggestions(content: string, cursorPosition: number): Promise<string[]> {
    try {
      const context = this.getContextAroundCursor(content, cursorPosition);
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a writing assistant that provides 3-4 brief, relevant text completions based on the given context.'
            },
            {
              role: 'user',
              content: `Complete this text with relevant suggestions:\n\n${context}`
            }
          ],
          max_tokens: 100,
          temperature: 0.8,
        }),
      });

      const data = await response.json();
      const suggestions = data.choices[0]?.message?.content?.split('\n').filter(s => s.trim()) || [];
      return suggestions.slice(0, 4);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      return [];
    }
  }

  // Smart formatting and improvement suggestions
  async improveFormatting(content: string): Promise<{
    improvedContent: string;
    suggestions: string[];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a formatting assistant that improves document structure and readability. Return the improved content and a list of formatting suggestions made.'
            },
            {
              role: 'user',
              content: `Improve the formatting of this document:\n\n${content}`
            }
          ],
          max_tokens: 1000,
          temperature: 0.3,
        }),
      });

      const data = await response.json();
      const result = data.choices[0]?.message?.content || '';
      
      // Parse the response to extract improved content and suggestions
      const lines = result.split('\n');
      const improvedContent = lines.filter(line => !line.startsWith('Suggestion:')).join('\n');
      const suggestions = lines.filter(line => line.startsWith('Suggestion:')).map(s => s.replace('Suggestion:', '').trim());

      return {
        improvedContent,
        suggestions
      };
    } catch (error) {
      console.error('Error improving formatting:', error);
      return {
        improvedContent: content,
        suggestions: []
      };
    }
  }

  // Extract context around cursor position
  private getContextAroundCursor(content: string, position: number): string {
    const start = Math.max(0, position - 200);
    const end = Math.min(content.length, position + 200);
    return content.substring(start, end);
  }

  // Generate title suggestions based on content
  async generateTitleSuggestions(content: string): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a title generator. Provide 3-5 concise and relevant title suggestions based on the document content.'
            },
            {
              role: 'user',
              content: `Generate titles for this content:\n\n${content.substring(0, 500)}`
            }
          ],
          max_tokens: 100,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      const titles = data.choices[0]?.message?.content?.split('\n').filter(t => t.trim()) || [];
      return titles.slice(0, 5);
    } catch (error) {
      console.error('Error generating title suggestions:', error);
      return [];
    }
  }
}

export const aiService = new AIService();
