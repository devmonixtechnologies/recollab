'use client';

import { createDocument } from '@/lib/actions/room.actions';
import { Button } from './ui/button'
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { TemplateSelector } from './templates/TemplateSelector';
import { TemplateVariablesForm } from './templates/TemplateVariablesForm';
import { DocumentTemplate } from '@/lib/templates';

const AddDocumentBtn = ({ userId, email }: AddDocumentBtnProps) => {
  const router = useRouter();
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showVariablesForm, setShowVariablesForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);

  const addDocumentHandler = async () => {
    try {
      const room = await createDocument({ userId, email });

      if(room) router.push(`/documents/${room.id}`);
    } catch (error) {
      console.log(error)
    }
  };

  const handleTemplateSelect = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    setShowTemplateSelector(false);
    setShowVariablesForm(true);
  };

  const handleCreateFromTemplate = async (content: string, title: string) => {
    try {
      const room = await createDocument({ userId, email });
      
      if (room) {
        // Navigate to the document and pass the template content
        router.push(`/documents/${room.id}?template=${encodeURIComponent(btoa(content))}&title=${encodeURIComponent(title)}`);
      }
    } catch (error) {
      console.error('Error creating document from template:', error);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <Button type="submit" onClick={addDocumentHandler} className="gradient-blue flex gap-1 shadow-md">
          <Image 
            src="/assets/icons/add.svg" alt="add" width={24} height={24}
          />
          <p className="hidden sm:block">Start a blank document</p>
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => setShowTemplateSelector(true)}
          className="flex gap-1 shadow-md"
        >
          <Image 
            src="/assets/icons/template.svg" alt="template" width={24} height={24}
          />
          <p className="hidden sm:block">Use template</p>
        </Button>
      </div>

      {showTemplateSelector && (
        <TemplateSelector
          onSelectTemplate={handleTemplateSelect}
          onClose={() => setShowTemplateSelector(false)}
        />
      )}

      {showVariablesForm && selectedTemplate && (
        <TemplateVariablesForm
          template={selectedTemplate}
          onSubmit={handleCreateFromTemplate}
          onClose={() => {
            setShowVariablesForm(false);
            setSelectedTemplate(null);
          }}
        />
      )}
    </>
  )
}

export default AddDocumentBtn;