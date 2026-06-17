import React, { useEffect, useMemo, useState } from 'react';
import CategoryTabs from './CategoryTabs';
import { useAppData } from '../context/AppDataContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const PotionSelector = ({ potions, value, onChange, className }) => {
  const { categoryOrder } = useAppData();
  const [selectedCategory, setSelectedCategory] = useState(categoryOrder[0] || '');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!selectedCategory && categoryOrder[0]) {
      setSelectedCategory(categoryOrder[0]);
    }
  }, [categoryOrder, selectedCategory]);

  const isSearching = search.trim().length > 0;

  const filteredPotions = useMemo(() => {
    if (isSearching) {
      const q = search.trim().toLowerCase();
      return potions.filter((p) => p.name.toLowerCase().includes(q));
    }
    if (!selectedCategory) return potions;
    return potions.filter((p) => p.category === selectedCategory);
  }, [potions, selectedCategory, search, isSearching]);

  return (
    <div className={cn('space-y-4', className)}>
      <div className="relative">
        <i className="bx bx-search absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-muted-foreground/70" />
        <Input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ค้นหาสูตรยา…"
          className="h-10 pl-10 pr-10"
        />
        {search && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setSearch('')}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <i className="bx bx-x" />
          </Button>
        )}
      </div>

      {!isSearching && (
        <CategoryTabs
          categories={categoryOrder}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      )}

      {filteredPotions.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border/50 bg-muted/10 px-4 py-6 text-center text-sm text-muted-foreground">
          {isSearching ? (
            <>ไม่พบสูตรยาที่ตรงกับ &quot;{search}&quot;</>
          ) : selectedCategory ? (
            <>ไม่มีสูตรยาในหมวดหมู่ &quot;{selectedCategory}&quot;</>
          ) : (
            <>ยังไม่มีสูตรยา</>
          )}
        </div>
      ) : (
        <ul className="grid max-h-[280px] gap-1.5 overflow-y-auto pr-1 sm:grid-cols-2">
          {filteredPotions.map((p) => {
            const isActive = value === p.id;
            return (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => onChange(p.id)}
                  className={cn(
                    'group flex w-full items-center gap-3 rounded-lg border px-3.5 py-2.5 text-left transition-all duration-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
                    isActive
                      ? 'border-gold/50 bg-gold/[0.06] text-gold'
                      : 'border-border/40 bg-card/30 text-foreground hover:border-border hover:bg-card/60'
                  )}
                >
                  <i
                    className={cn(
                      'bxf bx-flask-round text-xl transition-colors',
                      isActive ? 'text-gold' : 'text-primary/70 group-hover:text-primary'
                    )}
                  />
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-medium">{p.name}</span>
                    {isSearching && (
                      <span className="truncate text-[11px] text-muted-foreground">
                        {p.category}
                      </span>
                    )}
                  </span>
                  {isActive && <i className="bx bx-check text-base" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default PotionSelector;
