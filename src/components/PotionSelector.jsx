import React, { useMemo, useState } from 'react';
import CategoryTabs from './CategoryTabs';
import { useAppData } from '../context/AppDataContext';

const PotionSelector = ({ potions, value, onChange, style }) => {
  const { categoryOrder } = useAppData();
  const [selectedCategory, setSelectedCategory] = useState(categoryOrder[0] || '');

  const filteredPotions = useMemo(() => {
    if (!selectedCategory) return potions;
    return potions.filter(p => p.category === selectedCategory);
  }, [potions, selectedCategory]);

  return (
    <div style={style}>
      <CategoryTabs
        categories={categoryOrder}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      
      <select
        className="input-field"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: '100%' }}
      >
        <option value="">-- เลือกสูตรยา --</option>
        {filteredPotions.map(p => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>

      {filteredPotions.length === 0 && selectedCategory && (
        <p style={{ marginTop: '8px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
          ไม่มีสูตรยาในหมวดหมู่ "{selectedCategory}"
        </p>
      )}
    </div>
  );
};

export default PotionSelector;
