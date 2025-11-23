'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, 
  X,
  Loader2,
  Calendar
} from 'lucide-react';
import { DocumentTemplate, TemplateVariable, processTemplateVariables } from '@/lib/templates';

interface TemplateVariablesFormProps {
  template: DocumentTemplate;
  onSubmit: (processedContent: string, title: string) => void;
  onClose: () => void;
}

export const TemplateVariablesForm = ({ template, onSubmit, onClose }: TemplateVariablesFormProps) => {
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Initialize variables with empty values or defaults
    const initialVariables: Record<string, string> = {};
    template.variables?.forEach(variable => {
      initialVariables[variable.name] = '';
    });
    setVariables(initialVariables);
  }, [template]);

  const handleVariableChange = (name: string, value: string) => {
    setVariables(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    template.variables?.forEach(variable => {
      if (variable.required && !variables[variable.name]?.trim()) {
        newErrors[variable.name] = `${variable.placeholder} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const processedContent = processTemplateVariables(template, variables);
      const title = variables[template.variables?.[0]?.name || 'title'] || template.name;
      onSubmit(processedContent, title);
    } catch (error) {
      console.error('Error processing template:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderVariableInput = (variable: TemplateVariable) => {
    const value = variables[variable.name] || '';
    const error = errors[variable.name];

    switch (variable.type) {
      case 'text':
      case 'number':
        return (
          <div key={variable.name} className="space-y-2">
            <Label htmlFor={variable.name} className="text-sm font-medium">
              {variable.placeholder}
              {variable.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {variable.name.toLowerCase().includes('bio') || 
             variable.name.toLowerCase().includes('summary') ||
             variable.name.toLowerCase().includes('description') ? (
              <Textarea
                id={variable.name}
                value={value}
                onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                placeholder={variable.placeholder}
                className={error ? 'border-red-500' : ''}
                rows={3}
              />
            ) : (
              <Input
                id={variable.name}
                type={variable.type}
                value={value}
                onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                placeholder={variable.placeholder}
                className={error ? 'border-red-500' : ''}
              />
            )}
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case 'date':
        return (
          <div key={variable.name} className="space-y-2">
            <Label htmlFor={variable.name} className="text-sm font-medium">
              {variable.placeholder}
              {variable.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id={variable.name}
                type="date"
                value={value}
                onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                className={`pl-10 ${error ? 'border-red-500' : ''}`}
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case 'select':
        return (
          <div key={variable.name} className="space-y-2">
            <Label htmlFor={variable.name} className="text-sm font-medium">
              {variable.placeholder}
              {variable.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              value={value}
              onValueChange={(newValue) => handleVariableChange(variable.name, newValue)}
            >
              <SelectTrigger className={error ? 'border-red-500' : ''}>
                <SelectValue placeholder={variable.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {variable.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center">
              <FileText className="w-6 h-6 mr-2" />
              Customize Template: {template.name}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-600">
            {template.description}
          </p>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Template Information</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{template.icon}</span>
                  <div>
                    <h4 className="font-medium">{template.name}</h4>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {template.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {template.variables && template.variables.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-4">
                  Fill in the Details
                  <span className="text-sm text-gray-500 ml-2">
                    ({template.variables.filter(v => v.required).length} required)
                  </span>
                </h3>
                <div className="space-y-4">
                  {template.variables.map(renderVariableInput)}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-medium mb-4">Preview</h3>
              <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                  {processTemplateVariables(template, variables).substring(0, 1000)}
                  {processTemplateVariables(template, variables).length > 1000 && '...'}
                </pre>
              </div>
            </div>
          </div>
        </CardContent>

        <div className="border-t p-4">
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Document...
                </>
              ) : (
                'Create Document'
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
