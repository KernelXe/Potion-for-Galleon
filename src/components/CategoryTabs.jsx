import React from 'react';

const CategoryTabs = ({ categories, selectedCategory, onSelectCategory }) => {
  if (!categories || categories.length === 0) {
    return <p style={{ color: 'var(--color-text-secondary)' }}>ไม่มีหมวดหมู่</p>;
  }

  return (
    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
      {categories.map(category => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: selectedCategory === category 
              ? '2px solid var(--color-accent-primary)' 
              : '1px solid var(--color-border)',
            background: selectedCategory === category 
              ? 'rgba(108, 92, 231, 0.2)' 
              : 'transparent',
            color: selectedCategory === category
              ? 'var(--color-accent-primary)'
              : 'var(--color-text-secondary)',
            cursor: 'pointer',
            fontWeight: selectedCategory === category ? '600' : '500',
            transition: 'all 0.2s',
            fontSize: '14px'
          }}
          onMouseEnter={(e) => {
            if (selectedCategory !== category) {
              e.currentTarget.style.background = 'rgba(108, 92, 231, 0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (selectedCategory !== category) {
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;
