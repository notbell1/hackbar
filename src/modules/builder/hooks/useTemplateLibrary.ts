import { useState, useMemo, useCallback } from 'react';
import { TemplateSubcategory, TextTemplate } from '../types/template';
import { getAllCategories, getCategoryById } from '../registry/category-registry';
import { searchTemplates } from '../registry/template-registry';
import { insertContentIntoEditor } from '../editor/editor-adapter';

export function useTemplateLibrary() {
  const categories = useMemo(() => getAllCategories(), []);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    categories[0]?.id || 'sql-basic'
  );
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>(
    categories[0]?.subcategories[0]?.id || ''
  );
  const [selectedTemplate, setSelectedTemplate] = useState<TextTemplate | null>(
    categories[0]?.subcategories[0]?.templates[0] || null
  );
  const [searchQuery, setSearchQuery] = useState<string>('');

  const currentCategory = useMemo(() => {
    return getCategoryById(selectedCategoryId) || categories[0];
  }, [selectedCategoryId, categories]);

  const currentSubcategories = useMemo(() => {
    return currentCategory?.subcategories || [];
  }, [currentCategory]);

  const currentSubcategory = useMemo(() => {
    return (
      currentSubcategories.find((s) => s.id === selectedSubcategoryId) ||
      currentSubcategories[0] ||
      null
    );
  }, [currentSubcategories, selectedSubcategoryId]);

  const currentTemplates = useMemo(() => {
    return currentSubcategory?.templates || [];
  }, [currentSubcategory]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchTemplates(searchQuery);
  }, [searchQuery]);

  const selectCategory = useCallback(
    (categoryId: string) => {
      setSelectedCategoryId(categoryId);
      const cat = getCategoryById(categoryId);
      if (cat && cat.subcategories.length > 0) {
        setSelectedSubcategoryId(cat.subcategories[0].id);
        if (cat.subcategories[0].templates.length > 0) {
          setSelectedTemplate(cat.subcategories[0].templates[0]);
        } else {
          setSelectedTemplate(null);
        }
      } else {
        setSelectedSubcategoryId('');
        setSelectedTemplate(null);
      }
    },
    []
  );

  const selectSubcategory = useCallback((subcategory: TemplateSubcategory) => {
    setSelectedSubcategoryId(subcategory.id);
    if (subcategory.templates.length > 0) {
      setSelectedTemplate(subcategory.templates[0]);
    } else {
      setSelectedTemplate(null);
    }
  }, []);

  const selectTemplate = useCallback((template: TextTemplate) => {
    setSelectedTemplate(template);
  }, []);

  const insertTemplate = useCallback(
    (template?: TextTemplate): boolean => {
      const targetTemplate = template || selectedTemplate;
      if (!targetTemplate) return false;
      return insertContentIntoEditor(targetTemplate.content);
    },
    [selectedTemplate]
  );

  return {
    categories,
    currentCategory,
    currentSubcategories,
    currentSubcategory,
    currentTemplates,
    selectedCategoryId,
    selectedSubcategoryId,
    selectedTemplate,
    searchQuery,
    searchResults,
    setSearchQuery,
    selectCategory,
    selectSubcategory,
    selectTemplate,
    insertTemplate
  };
}
