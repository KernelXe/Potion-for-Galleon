import React from 'react';
import { cn } from '@/lib/utils';

const CategoryTabs = ({ categories, selectedCategory, onSelectCategory }) => {
  if (!categories || categories.length === 0) {
    return <p className="text-sm text-muted-foreground">ไม่มีหมวดหมู่</p>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {categories.map((category) => {
        const isActive = selectedCategory === category;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelectCategory(category)}
            className={cn(
              'group relative rounded-full border px-4 py-1.5 transition-all duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
              isActive
                ? 'border-gold/50 bg-gold/[0.06] text-gold shadow-[inset_0_0_0_1px_oklch(0.76_0.12_85/0.18)]'
                : 'border-border/40 text-muted-foreground hover:border-border hover:text-foreground'
            )}
          >
            <span className="font-heading text-xs font-medium tracking-wider sm:text-[13px]">
              {category}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryTabs;
