import { jest } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SmartAssistant } from '@/components/ai/SmartAssistant';

// Mock AI service
jest.mock('@/lib/ai-service', () => ({
  aiService: {
    generateSuggestions: jest.fn(),
    improveFormatting: jest.fn(),
    generateTitleSuggestions: jest.fn(),
    summarizeDocument: jest.fn(),
  },
}));

describe('SmartAssistant', () => {
  const mockOnSuggestionApply = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <SmartAssistant
        content="Test content"
        cursorPosition={5}
        onSuggestionApply={mockOnSuggestionApply}
      />
    );
    
    expect(screen.getByText('AI Assistant')).toBeInTheDocument();
  });

  it('generates suggestions when content changes', async () => {
    const { aiService } = require('@/lib/ai-service');
    aiService.generateSuggestions.mockResolvedValue(['Suggestion 1', 'Suggestion 2']);

    render(
      <SmartAssistant
        content="This is a longer test content that should trigger suggestions"
        cursorPosition={10}
        onSuggestionApply={mockOnSuggestionApply}
      />
    );

    await waitFor(() => {
      expect(aiService.generateSuggestions).toHaveBeenCalled();
    });
  });

  it('applies suggestion when clicked', async () => {
    const { aiService } = require('@/lib/ai-service');
    aiService.generateSuggestions.mockResolvedValue(['Test suggestion']);

    render(
      <SmartAssistant
        content="Test content"
        cursorPosition={5}
        onSuggestionApply={mockOnSuggestionApply}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Test suggestion')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Test suggestion'));
    expect(mockOnSuggestionApply).toHaveBeenCalledWith('Test suggestion', 'completion');
  });

  it('switches between tabs correctly', async () => {
    render(
      <SmartAssistant
        content="Test content"
        cursorPosition={5}
        onSuggestionApply={mockOnSuggestionApply}
      />
    );

    // Click on formatting tab
    fireEvent.click(screen.getByText('🎨 Format'));
    expect(screen.getByText('🎨 Format')).toHaveClass('bg-primary');

    // Click on title tab
    fireEvent.click(screen.getByText('📝 Title'));
    expect(screen.getByText('📝 Title')).toHaveClass('bg-primary');
  });

  it('can be minimized and maximized', () => {
    render(
      <SmartAssistant
        content="Test content"
        cursorPosition={5}
        onSuggestionApply={mockOnSuggestionApply}
      />
    );

    // Minimize
    fireEvent.click(screen.getByText('🔽'));
    expect(screen.queryByText('Complete')).not.toBeInTheDocument();

    // Maximize
    fireEvent.click(screen.getByText('🔼'));
    expect(screen.getByText('Complete')).toBeInTheDocument();
  });
});
