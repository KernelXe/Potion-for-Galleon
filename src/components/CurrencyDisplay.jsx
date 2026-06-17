import React from 'react';
import { cn } from '@/lib/utils';

const CurrencyDisplay = ({ price, className }) => {
  if (!price) return <span>ฟรี</span>;

  const { galleon, sickle, knut } = price;

  return (
    <div className={cn('inline-flex items-center gap-2 text-sm font-bold', className)}>
      {galleon > 0 && (
        <span className="flex items-center">
          <span className="currency-icon icon-galleon">G</span>
          <span className="text-gold">{galleon}</span>
        </span>
      )}
      {sickle > 0 && (
        <span className="flex items-center">
          <span className="currency-icon icon-sickle">S</span>
          <span className="text-[#e9ecef]">{sickle}</span>
        </span>
      )}
      {knut > 0 && (
        <span className="flex items-center">
          <span className="currency-icon icon-knut">K</span>
          <span className="text-[#d98a5f]">{knut}</span>
        </span>
      )}
      {galleon === 0 && sickle === 0 && knut === 0 && <span>0</span>}
    </div>
  );
};

export default CurrencyDisplay;
