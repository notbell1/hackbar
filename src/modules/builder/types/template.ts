export interface TemplateParameter {
  id: string;
  label: string;
  defaultValue: string;
  inputType: 'text';
}

export interface TemplateConfig {
  id: string;
  name: string;
  description?: string;
  content: string;
  group?: string;
  tags?: string[];
  parameters?: TemplateParameter[];
}

export interface TextTemplate extends TemplateConfig {
  id: string;
  name: string;
  description?: string;
  content: string;
  group?: string;
  tags?: string[];
  parameters?: TemplateParameter[];
}

export interface TemplateSubcategory {
  id: string;
  label: string;
  description?: string;
  templates: TextTemplate[];
}

export interface TemplateCategory {
  id: string;
  label: string;
  description?: string;
  iconName?: string;
  subcategories: TemplateSubcategory[];
}

export interface EditorSelectionRange {
  start: number;
  end: number;
}

export interface EditorTargetAdapter {
  id: string;
  name: string;
  getValue: () => string;
  setValue: (value: string) => void;
  getSelection: () => EditorSelectionRange;
  setSelection: (start: number, end: number) => void;
  focus: () => void;
}

