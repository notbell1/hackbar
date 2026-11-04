import React from 'react';
import { BuilderSubcategory } from '../types';
import { CustomSubcategoryDropdown } from '../../../components/CustomSubcategoryDropdown';

interface UnionBasedSubcategoryMenuProps {
  subcategories: BuilderSubcategory[];
  selectedSubcategoryId: string;
  onSelectSubcategory: (sub: BuilderSubcategory) => void;
}

export const UnionBasedSubcategoryMenu: React.FC<UnionBasedSubcategoryMenuProps> = ({
  subcategories,
  selectedSubcategoryId,
  onSelectSubcategory
}) => {
  return (
    <div className="space-y-1.5">
      <CustomSubcategoryDropdown
        categoryId="union-based"
        subcategories={subcategories}
        selectedSubcategoryId={selectedSubcategoryId}
        onSelectSubcategory={(subId) => {
          const found = subcategories.find((s) => s.id === subId);
          if (found) onSelectSubcategory(found);
        }}
      />
    </div>
  );
};

