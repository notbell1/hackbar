import { TemplateCategory, TemplateSubcategory } from '../types/template';

// Import category definitions
import { sqlBasicCategory } from '../categories/sql-basic';
import { unionBasedCategory } from '../categories/union-based';
import { wafBasedCategory } from '../categories/waf-based';
import { wafBypassCategory } from '../categories/waf-bypass';
import { outFileCategory } from '../categories/out-file';
import { customBasedCategory } from '../categories/custom-based';
import { errorDoubleCategory } from '../categories/error-double';
import { ldapFuzzCategory } from '../categories/ldap-fuzz';
import { xssCategory } from '../categories/xss';
import { lfiCategory } from '../categories/lfi';
import { encryptionCategory } from '../categories/encryption';
import { linksCategory } from '../categories/links';
import { htmlCategory } from '../categories/html';
import { otherCategory } from '../categories/other';

class CategoryRegistry {
  private categories: Map<string, TemplateCategory> = new Map();

  constructor() {
    this.registerDefaults();
  }

  private registerDefaults() {
    const defaultCategories: TemplateCategory[] = [
      sqlBasicCategory,
      unionBasedCategory,
      wafBasedCategory,
      wafBypassCategory,
      outFileCategory,
      customBasedCategory,
      errorDoubleCategory,
      ldapFuzzCategory,
      xssCategory,
      lfiCategory,
      encryptionCategory,
      linksCategory,
      htmlCategory,
      otherCategory
    ];

    defaultCategories.forEach((cat) => {
      this.categories.set(cat.id, cat);
    });
  }

  registerCategory(category: TemplateCategory): void {
    this.categories.set(category.id, category);
  }

  getAllCategories(): TemplateCategory[] {
    return Array.from(this.categories.values());
  }

  getCategoryById(id: string): TemplateCategory | undefined {
    return this.categories.get(id);
  }

  getSubcategories(categoryId: string): TemplateSubcategory[] {
    const cat = this.getCategoryById(categoryId);
    return cat ? cat.subcategories : [];
  }
}

export const categoryRegistry = new CategoryRegistry();

export function getAllCategories(): TemplateCategory[] {
  return categoryRegistry.getAllCategories();
}

export function getCategoryById(id: string): TemplateCategory | undefined {
  return categoryRegistry.getCategoryById(id);
}

export function getSubcategories(categoryId: string): TemplateSubcategory[] {
  return categoryRegistry.getSubcategories(categoryId);
}

