import { TemplateCategory, TemplateSubcategory, TextTemplate } from '../types/template';
import { categoryRegistry } from './category-registry';

export interface TemplateSearchResult {
  category: TemplateCategory;
  subcategory: TemplateSubcategory;
  template: TextTemplate;
}

export function getTemplates(categoryId: string, subcategoryId: string): TextTemplate[] {
  const cat = categoryRegistry.getCategoryById(categoryId);
  if (!cat) return [];

  const sub = cat.subcategories.find((s) => s.id === subcategoryId);
  return sub ? sub.templates : [];
}

export function getTemplateById(
  categoryId: string,
  subcategoryId: string,
  templateId: string
): TextTemplate | undefined {
  const templates = getTemplates(categoryId, subcategoryId);
  return templates.find((t) => t.id === templateId);
}

export function searchTemplates(query: string): TemplateSearchResult[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];

  const results: TemplateSearchResult[] = [];
  const categories = categoryRegistry.getAllCategories();

  for (const cat of categories) {
    for (const sub of cat.subcategories) {
      for (const t of sub.templates) {
        const matchName = t.name.toLowerCase().includes(trimmed);
        const matchDesc = t.description?.toLowerCase().includes(trimmed) || false;
        const matchContent = t.content.toLowerCase().includes(trimmed);
        const matchCategory = cat.label.toLowerCase().includes(trimmed);
        const matchSub = sub.label.toLowerCase().includes(trimmed);

        if (matchName || matchDesc || matchContent || matchCategory || matchSub) {
          results.push({
            category: cat,
            subcategory: sub,
            template: t
          });
        }
      }
    }
  }

  return results;
}

