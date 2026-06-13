import React from 'react';

const CurrencyDisplay = ({ price }) => {
  if (!price) return <span>ฟรี</span>;
  
  const { galleon, sickle, knut } = price;
  
  return (
    <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center', fontSize: '14px', fontWeight: 'bold' }}>
      {galleon > 0 && (
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <span className="currency-icon icon-galleon">G</span>
          <span className="text-gold">{galleon}</span>
        </span>
      )}
      {sickle > 0 && (
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <span className="currency-icon icon-sickle">S</span>
          <span style={{ color: '#e9ecef' }}>{sickle}</span>
        </span>
      )}
      {knut > 0 && (
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <span className="currency-icon icon-knut">K</span>
          <span style={{ color: '#d98a5f' }}>{knut}</span>
        </span>
      )}
      {galleon === 0 && sickle === 0 && knut === 0 && <span>0</span>}
    </div>
  );
};

export default CurrencyDisplay;
