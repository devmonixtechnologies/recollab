'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Search, 
  Filter,
  X,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { DocumentTemplate, getTemplatesByCategory, searchTemplates } from '@/lib/templates';

interface TemplateSelectorProps {
  onSelectTemplate: (template: DocumentTemplate) => void;
  onClose: () => void;
}

export const TemplateSelector = ({ onSelectTemplate, onClose }: TemplateSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DocumentTemplate['category'] | 'all'>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 'all' as const, label: 'All Templates', icon: FileText },
    { id: 'business' as const, label: 'Business', icon: FileText },
    { id: 'personal' as const, label: 'Personal', icon: FileText },
    { id: 'academic' as const, label: 'Academic', icon: FileText },
    { id: 'technical' as const, label: 'Technical', icon: FileText },
    { id: 'creative' as const, label: 'Creative', icon: FileText },
  ];

  const filteredTemplates = searchQuery
    ? searchTemplates(searchQuery)
    : selectedCategory === 'all'
    ? []
    : getTemplatesByCategory(selectedCategory);

  const allTemplates = searchQuery
    ? filteredTemplates
    : selectedCategory === 'all'
    ? []
    : filteredTemplates;

  // If no category is selected and no search, show all templates
  const displayTemplates = searchQuery || selectedCategory !== 'all'
    ? allTemplates
    : [];

  const handleSelectTemplate = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      setLoading(true);
      onSelectTemplate(selectedTemplate);
    }
  };

  const getVersionTypeColor = (changeDescription?: string) => {
    if (!changeDescription) return 'secondary';
    if (changeDescription.includes('Major')) return 'destructive';
    if (changeDescription.includes('Minor')) return 'outline';
    return 'default';
  };

  const getCategoryColor = (category: DocumentTemplate['category']) => {
    const colors = {
      business: 'bg-blue-100 text-blue-800',
      personal: 'bg-green-100 text-green-800',
      academic: 'bg-purple-100 text-purple-800',
      technical: 'bg-orange-100 text-orange-800',
      creative: 'bg-pink-100 text-pink-800',
    };
    return colors[category];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center">
              <FileText className="w-6 h-6 mr-2" />
              Choose a Template
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex gap-4 mt-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="text-xs"
                  >
                    <Icon className="w-3 h-3 mr-1" />
                    {category.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto">
          {displayTemplates.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery || selectedCategory !== 'all' ? 'No templates found' : 'Select a category to get started'}
              </h3>
              <p className="text-gray-500">
                {searchQuery || selectedCategory !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Choose from business, personal, academic, technical, or creative templates'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayTemplates.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedTemplate?.id === template.id
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleSelectTemplate(template)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{template.icon}</span>
                        <div>
                          <h4 className="font-medium text-sm">{template.name}</h4>
                          <Badge className={`text-xs ${getCategoryColor(template.category)}`}>
                            {template.category}
                          </Badge>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-gray-600 mb-3">{template.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {template.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {template.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>

        {selectedTemplate && (
          <div className="border-t p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{selectedTemplate.name}</h4>
                <p className="text-sm text-gray-600">{selectedTemplate.description}</p>
              </div>
              <Button onClick={handleUseTemplate} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Use Template'
                )}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
