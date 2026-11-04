import {
  TextTemplate,
  TemplateSubcategory,
  TemplateCategory,
  TemplateParameter,
  TemplateConfig
} from '../../types/template';

export type { TemplateParameter, TemplateConfig };

export interface BuilderTemplate extends TextTemplate {
  id: string;
  name: string;
  description?: string;
  content: string;
  group?: string;
  tags?: string[];
  parameters?: TemplateParameter[];
}

export interface BuilderSubcategory extends TemplateSubcategory {
  id: string;
  label: string;
  description?: string;
  templates: BuilderTemplate[];
}

export type UnionBasedCategoryType = TemplateCategory;
