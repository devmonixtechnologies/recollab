export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: 'business' | 'personal' | 'academic' | 'technical' | 'creative';
  icon: string;
  content: string;
  tags: string[];
  variables?: TemplateVariable[];
}

export interface TemplateVariable {
  name: string;
  placeholder: string;
  type: 'text' | 'date' | 'number' | 'select';
  options?: string[];
  required?: boolean;
}

export const documentTemplates: DocumentTemplate[] = [
  {
    id: 'meeting-notes',
    name: 'Meeting Notes',
    description: 'Structured template for taking meeting notes with action items',
    category: 'business',
    icon: '📝',
    content: `# Meeting Notes

**Date:** {{date}}
**Meeting Type:** {{meetingType}}
**Attendees:** {{attendees}}
**Facilitator:** {{facilitator}}

---

## Agenda Items
1. 
2. 
3. 

---

## Discussion Points & Decisions

### Topic 1: 
**Decision:** 

### Topic 2: 
**Decision:** 

---

## Action Items

| Task | Owner | Due Date | Status |
|------|-------|----------|--------|
|      |       |          | Open    |
|      |       |          | Open    |
|      |       |          | Open    |

---

## Next Meeting
**Date:** 
**Time:** 
**Location:** 

---

## Notes & Additional Information


---

*Meeting notes recorded on {{date}}*`,
    tags: ['meeting', 'notes', 'business', 'action items'],
    variables: [
      { name: 'date', placeholder: 'Meeting date', type: 'date', required: true },
      { name: 'meetingType', placeholder: 'Type of meeting', type: 'text', required: true },
      { name: 'attendees', placeholder: 'List of attendees', type: 'text', required: true },
      { name: 'facilitator', placeholder: 'Meeting facilitator', type: 'text', required: true }
    ]
  },
  {
    id: 'project-spec',
    name: 'Project Specification',
    description: 'Comprehensive project specification document template',
    category: 'technical',
    icon: '📋',
    content: `# Project Specification: {{projectName}}

**Version:** 1.0  
**Date:** {{date}}  
**Author:** {{author}}  
**Status:** {{status}}

---

## Executive Summary

{{executiveSummary}}

---

## Project Overview

### Objectives
- 
- 
- 

### Scope
**In Scope:**
- 
- 
- 

**Out of Scope:**
- 
- 
- 

### Success Metrics
1. 
2. 
3. 

---

## Technical Requirements

### Functional Requirements
- 
- 
- 

### Non-Functional Requirements
- **Performance:** 
- **Security:** 
- **Scalability:** 
- **Reliability:** 

### Technology Stack
- **Frontend:** 
- **Backend:** 
- **Database:** 
- **Infrastructure:** 

---

## Timeline & Milestones

| Phase | Start Date | End Date | Deliverables |
|-------|------------|----------|--------------|
| Planning | {{planningStart}} | {{planningEnd}} | Project plan, resource allocation |
| Development | {{devStart}} | {{devEnd}} | MVP, testing, documentation |
| Deployment | {{deployStart}} | {{deployEnd}} | Production release, monitoring |

---

## Resources & Budget

### Team Members
- **Project Manager:** 
- **Lead Developer:** 
- **Designer:** 
- **QA Engineer:** 

### Budget Allocation
- **Development:** 
- **Infrastructure:** 
- **Marketing:** 
- **Contingency:** 

---

## Risks & Mitigation

| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|--------|-------------------|
|      | High/Medium/Low | High/Medium/Low |                    |
|      | High/Medium/Low | High/Medium/Low |                    |

---

## Approval

**Project Sponsor:** ____________________  
**Date:** ____________________

**Technical Lead:** ____________________  
**Date:** ____________________`,
    tags: ['project', 'specification', 'technical', 'planning'],
    variables: [
      { name: 'projectName', placeholder: 'Project name', type: 'text', required: true },
      { name: 'date', placeholder: 'Current date', type: 'date', required: true },
      { name: 'author', placeholder: 'Document author', type: 'text', required: true },
      { name: 'status', placeholder: 'Project status', type: 'select', options: ['Planning', 'In Progress', 'On Hold', 'Completed'], required: true },
      { name: 'executiveSummary', placeholder: 'Brief project overview', type: 'text', required: true },
      { name: 'planningStart', placeholder: 'Planning start date', type: 'date', required: false },
      { name: 'planningEnd', placeholder: 'Planning end date', type: 'date', required: false },
      { name: 'devStart', placeholder: 'Development start date', type: 'date', required: false },
      { name: 'devEnd', placeholder: 'Development end date', type: 'date', required: false },
      { name: 'deployStart', placeholder: 'Deployment start date', type: 'date', required: false },
      { name: 'deployEnd', placeholder: 'Deployment end date', type: 'date', required: false }
    ]
  },
  {
    id: 'swot-analysis',
    name: 'SWOT Analysis',
    description: 'Strategic planning template for SWOT analysis',
    category: 'business',
    icon: '📊',
    content: `# SWOT Analysis: {{analysisSubject}}

**Date:** {{date}}  
**Prepared by:** {{author}}  
**Department:** {{department}}

---

## Overview

This SWOT analysis examines the internal Strengths and Weaknesses, as well as external Opportunities and Threats facing {{analysisSubject}}.

---

## Strengths (Internal)

1. **{{strength1}}**
   - *Supporting details:*
   - *Impact:*

2. **{{strength2}}**
   - *Supporting details:*
   - *Impact:*

3. **{{strength3}}**
   - *Supporting details:*
   - *Impact:*

---

## Weaknesses (Internal)

1. **{{weakness1}}**
   - *Supporting details:*
   - *Impact:*

2. **{{weakness2}}**
   - *Supporting details:*
   - *Impact:*

3. **{{weakness3}}**
   - *Supporting details:*
   - *Impact:*

---

## Opportunities (External)

1. **{{opportunity1}}**
   - *Supporting details:*
   - *Potential impact:*

2. **{{opportunity2}}**
   - *Supporting details:*
   - *Potential impact:*

3. **{{opportunity3}}**
   - *Supporting details:*
   - *Potential impact:*

---

## Threats (External)

1. **{{threat1}}**
   - *Supporting details:*
   - *Risk level:*

2. **{{threat2}}**
   - *Supporting details:*
   - *Risk level:*

3. **{{threat3}}**
   - *Supporting details:*
   - *Risk level:*

---

## Strategic Recommendations

### SO Strategies (Strengths + Opportunities)
- 
- 

### ST Strategies (Strengths + Threats)
- 
- 

### WO Strategies (Weaknesses + Opportunities)
- 
- 

### WT Strategies (Weaknesses + Threats)
- 
- 

---

## Action Plan

| Priority | Action | Owner | Timeline | Success Metric |
|----------|--------|-------|----------|----------------|
| High | | | | |
| Medium | | | | |
| Low | | | | |

---

## Next Review Date
{{nextReviewDate}}`,
    tags: ['swot', 'analysis', 'strategy', 'planning', 'business'],
    variables: [
      { name: 'analysisSubject', placeholder: 'Subject of analysis', type: 'text', required: true },
      { name: 'date', placeholder: 'Analysis date', type: 'date', required: true },
      { name: 'author', placeholder: 'Analysis author', type: 'text', required: true },
      { name: 'department', placeholder: 'Department or team', type: 'text', required: false },
      { name: 'strength1', placeholder: 'First strength', type: 'text', required: true },
      { name: 'strength2', placeholder: 'Second strength', type: 'text', required: false },
      { name: 'strength3', placeholder: 'Third strength', type: 'text', required: false },
      { name: 'weakness1', placeholder: 'First weakness', type: 'text', required: true },
      { name: 'weakness2', placeholder: 'Second weakness', type: 'text', required: false },
      { name: 'weakness3', placeholder: 'Third weakness', type: 'text', required: false },
      { name: 'opportunity1', placeholder: 'First opportunity', type: 'text', required: true },
      { name: 'opportunity2', placeholder: 'Second opportunity', type: 'text', required: false },
      { name: 'opportunity3', placeholder: 'Third opportunity', type: 'text', required: false },
      { name: 'threat1', placeholder: 'First threat', type: 'text', required: true },
      { name: 'threat2', placeholder: 'Second threat', type: 'text', required: false },
      { name: 'threat3', placeholder: 'Third threat', type: 'text', required: false },
      { name: 'nextReviewDate', placeholder: 'Next review date', type: 'date', required: false }
    ]
  },
  {
    id: 'research-paper',
    name: 'Research Paper',
    description: 'Academic research paper template with proper structure',
    category: 'academic',
    icon: '🎓',
    content: `# {{paperTitle}}

**Author:** {{author}}  
**Affiliation:** {{affiliation}}  
**Date:** {{date}}  
**Keywords:** {{keywords}}

---

## Abstract

{{abstract}}

---

## 1. Introduction

### 1.1 Background
{{background}}

### 1.2 Problem Statement
{{problemStatement}}

### 1.3 Research Questions
1. {{researchQuestion1}}
2. {{researchQuestion2}}
3. {{researchQuestion3}}

### 1.4 Objectives
- {{objective1}}
- {{objective2}}
- {{objective3}}

---

## 2. Literature Review

### 2.1 Theoretical Framework
{{theoreticalFramework}}

### 2.2 Previous Studies
{{previousStudies}}

### 2.3 Research Gap
{{researchGap}}

---

## 3. Methodology

### 3.1 Research Design
{{researchDesign}}

### 3.2 Data Collection
{{dataCollection}}

### 3.3 Data Analysis
{{dataAnalysis}}

### 3.4 Limitations
{{limitations}}

---

## 4. Results

### 4.1 Findings
{{findings}}

### 4.2 Statistical Analysis
{{statisticalAnalysis}}

### 4.3 Visualizations
{{visualizations}}

---

## 5. Discussion

### 5.1 Interpretation of Results
{{interpretation}}

### 5.2 Comparison with Literature
{{comparison}}

### 5.3 Implications
{{implications}}

---

## 6. Conclusion

### 6.1 Summary of Findings
{{summary}}

### 6.2 Contributions
{{contributions}}

### 6.3 Future Research
{{futureResearch}}

---

## References

{{references}}

---

## Appendices

### Appendix A: {{appendixA}}
### Appendix B: {{appendixB}}`,
    tags: ['research', 'academic', 'paper', 'study'],
    variables: [
      { name: 'paperTitle', placeholder: 'Research paper title', type: 'text', required: true },
      { name: 'author', placeholder: 'Author name', type: 'text', required: true },
      { name: 'affiliation', placeholder: 'Institutional affiliation', type: 'text', required: true },
      { name: 'date', placeholder: 'Publication date', type: 'date', required: true },
      { name: 'keywords', placeholder: 'Research keywords', type: 'text', required: true },
      { name: 'abstract', placeholder: 'Paper abstract', type: 'text', required: true },
      { name: 'background', placeholder: 'Research background', type: 'text', required: true },
      { name: 'problemStatement', placeholder: 'Problem statement', type: 'text', required: true },
      { name: 'researchQuestion1', placeholder: 'First research question', type: 'text', required: true },
      { name: 'researchQuestion2', placeholder: 'Second research question', type: 'text', required: false },
      { name: 'researchQuestion3', placeholder: 'Third research question', type: 'text', required: false },
      { name: 'objective1', placeholder: 'First objective', type: 'text', required: true },
      { name: 'objective2', placeholder: 'Second objective', type: 'text', required: false },
      { name: 'objective3', placeholder: 'Third objective', type: 'text', required: false }
    ]
  },
  {
    id: 'blog-post',
    name: 'Blog Post',
    description: 'Engaging blog post template with SEO optimization',
    category: 'creative',
    icon: '✍️',
    content: `# {{blogTitle}}

*By {{author}} | Published on {{publishDate}} | Reading time: {{readingTime}} min*

---

## Introduction

{{introduction}}

---

## Main Content

### {{section1Title}}

{{section1Content}}

### {{section2Title}}

{{section2Content}}

### {{section3Title}}

{{section3Content}}

---

## Key Takeaways

- {{takeaway1}}
- {{takeaway2}}
- {{takeaway3}}

---

## Conclusion

{{conclusion}}

---

## Call to Action

{{callToAction}}

---

## Author Bio

{{authorBio}}

---

## Tags

{{tags}}

---

*This post was originally published on {{website}}. All rights reserved.*`,
    tags: ['blog', 'content', 'seo', 'writing'],
    variables: [
      { name: 'blogTitle', placeholder: 'Blog post title', type: 'text', required: true },
      { name: 'author', placeholder: 'Author name', type: 'text', required: true },
      { name: 'publishDate', placeholder: 'Publication date', type: 'date', required: true },
      { name: 'readingTime', placeholder: 'Estimated reading time', type: 'number', required: false },
      { name: 'introduction', placeholder: 'Blog introduction', type: 'text', required: true },
      { name: 'section1Title', placeholder: 'First section title', type: 'text', required: true },
      { name: 'section1Content', placeholder: 'First section content', type: 'text', required: true },
      { name: 'section2Title', placeholder: 'Second section title', type: 'text', required: false },
      { name: 'section2Content', placeholder: 'Second section content', type: 'text', required: false },
      { name: 'section3Title', placeholder: 'Third section title', type: 'text', required: false },
      { name: 'section3Content', placeholder: 'Third section content', type: 'text', required: false },
      { name: 'takeaway1', placeholder: 'First key takeaway', type: 'text', required: true },
      { name: 'takeaway2', placeholder: 'Second key takeaway', type: 'text', required: false },
      { name: 'takeaway3', placeholder: 'Third key takeaway', type: 'text', required: false },
      { name: 'conclusion', placeholder: 'Blog conclusion', type: 'text', required: true },
      { name: 'callToAction', placeholder: 'Call to action', type: 'text', required: false },
      { name: 'authorBio', placeholder: 'Author biography', type: 'text', required: false },
      { name: 'tags', placeholder: 'Blog tags (comma-separated)', type: 'text', required: false },
      { name: 'website', placeholder: 'Website name', type: 'text', required: false }
    ]
  }
];

export const getTemplateById = (id: string): DocumentTemplate | undefined => {
  return documentTemplates.find(template => template.id === id);
};

export const getTemplatesByCategory = (category: DocumentTemplate['category']): DocumentTemplate[] => {
  return documentTemplates.filter(template => template.category === category);
};

export const searchTemplates = (query: string): DocumentTemplate[] => {
  const lowercaseQuery = query.toLowerCase();
  return documentTemplates.filter(template => 
    template.name.toLowerCase().includes(lowercaseQuery) ||
    template.description.toLowerCase().includes(lowercaseQuery) ||
    template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const processTemplateVariables = (template: DocumentTemplate, variables: Record<string, string>): string => {
  let content = template.content;
  
  template.variables?.forEach(variable => {
    const value = variables[variable.name] || `{{${variable.name}}}`;
    content = content.replace(new RegExp(`{{${variable.name}}}`, 'g'), value);
  });
  
  return content;
};
