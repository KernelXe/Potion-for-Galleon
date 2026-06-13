import React, { useMemo, useState } from 'react';

const PotionSelector = ({ potions, value, onChange, style }) => {
  const [search, setSearch] = useState('');

  const filteredPotions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return potions;

    return potions.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.category?.toLowerCase().includes(query)
    );
  }, [potions, search]);

  const displayPotions = useMemo(() => {
    if (!value) return filteredPotions;
    const selected = potions.find(p => p.id === value);
    if (!selected || filteredPotions.some(p => p.id === value)) return filteredPotions;
    return [selected, ...filteredPotions];
  }, [potions, filteredPotions, value]);

  return (
    <div style={style}>
      <input
        type="text"
        className="input-field"
        placeholder="ค้นหาสูตรยา..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: '100%', marginBottom: '10px' }}
      />
      <select
        className="input-field"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: '100%' }}
      >
        <option value="">-- เลือกสูตรยา --</option>
        {displayPotions.map(p => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
      {search && displayPotions.length === 0 && (
        <p style={{ marginTop: '8px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
          ไม่พบสูตรยาที่ตรงกับ "{search}"
        </p>
      )}
    </div>
  );
};

export default PotionSelector;
