import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import CurrencyDisplay from './CurrencyDisplay';
import NumberSliderInput, { parseNumber } from './NumberSliderInput';

const InventoryCalculator = ({ selectedPotionId }) => {
  const { potions, ingredients, toTotalKnuts, toCurrencyObj } = useAppData();
  const [targetQuantity, setTargetQuantity] = useState('');
  const [userInventory, setUserInventory] = useState({});

  const selectedPotion = potions.find(p => p.id === selectedPotionId);
  const targetQty = parseNumber(targetQuantity, 0);

  const handleInventoryChange = (ingId, value) => {
    if (value === '') {
      setUserInventory(prev => {
        const next = { ...prev };
        delete next[ingId];
        return next;
      });
      return;
    }
    const num = Number(value);
    if (!Number.isNaN(num) && num >= 0) {
      setUserInventory(prev => ({ ...prev, [ingId]: value }));
    }
  };

  const calculateShortage = () => {
    if (!selectedPotionId || !selectedPotion || targetQty <= 0) return null;

    const shortage = {};
    let totalMissingKnuts = 0;

    selectedPotion.ingredients.forEach(reqIng => {
      const neededQuantity = reqIng.quantity * targetQty;
      const ownedQuantity = parseNumber(userInventory[reqIng.id], 0);
      const missingQuantity = Math.max(0, neededQuantity - ownedQuantity);

      if (missingQuantity > 0) {
        shortage[reqIng.id] = missingQuantity;
        const ingDetails = ingredients.find(i => i.id === reqIng.id);
        if (ingDetails) {
          totalMissingKnuts += toTotalKnuts(ingDetails.price) * missingQuantity;
        }
      }
    });

    return { shortage, totalCost: toCurrencyObj(totalMissingKnuts) };
  };

  const result = calculateShortage();

  return (
    <div className="glass-panel home-panel">
      <div className="section-header">
        <h3 className="text-gradient"><i className="bx bx-calculator"></i> Material Shortage Calculator</h3>
      </div>
      <p className="home-panel-desc">
        กรอกจำนวนวัตถุดิบที่คุณมีอยู่ แล้วระบุจำนวนขวดที่ต้องการปรุง — เราจะคำนวณวัตถุดิบและค่าใช้จ่ายเพิ่มเติมให้
      </p>

      <div className="inventory-grid">
        <div className="inventory-grid__col">
          <h4 className="subsection-title">วัตถุดิบที่คุณมี</h4>
          <div className="inventory-list">
            {ingredients.map(ing => (
              <div key={ing.id} className="inventory-row">
                <span className="inventory-row__name">{ing.name}</span>
                <NumberSliderInput
                  value={userInventory[ing.id] ?? ''}
                  onChange={(val) => handleInventoryChange(ing.id, val)}
                  min={0}
                  placeholder="0"
                  narrow
                />
              </div>
            ))}
          </div>
        </div>

        <div className="inventory-grid__col">
          <h4 className="subsection-title">เป้าหมายการปรุง</h4>

          {!selectedPotion ? (
            <p className="home-panel-hint">เลือกสูตรยาด้านบนก่อน</p>
          ) : (
            <>
              <div className="selected-potion-badge" style={{ marginBottom: '16px' }}>
                <i className="bxf bx-flask-round"></i>
                <span>{selectedPotion.name}</span>
              </div>

              <div className="form-field">
                <label className="form-field__label">จำนวนขวดที่ต้องการปรุง</label>
                <NumberSliderInput
                  value={targetQuantity}
                  onChange={setTargetQuantity}
                  min={0}
                  placeholder="กรอกจำนวน"
                />
              </div>

              {result && (
                <div className="result-box">
                  <h4 className="subsection-title">วัตถุดิบที่ขาด</h4>
                  {Object.keys(result.shortage).length === 0 ? (
                    <p className="result-box__success">คุณมีวัตถุดิบครบถ้วนแล้ว!</p>
                  ) : (
                    <>
                      <ul className="item-list">
                        {Object.keys(result.shortage).map(ingId => {
                          const ing = ingredients.find(i => i.id === ingId);
                          return (
                            <li key={ingId} className="item-list__row item-list__row--shortage">
                              <span>{ing?.name}</span>
                              <span className="item-list__value item-list__value--danger">
                                ต้องการเพิ่ม {result.shortage[ingId]}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                      <div className="summary-box">
                        <span>ค่าใช้จ่ายเพิ่มเติม:</span>
                        <CurrencyDisplay price={result.totalCost} />
                      </div>
                    </>
                  )}
                </div>
              )}

              {selectedPotion && targetQty <= 0 && (
                <p className="home-panel-hint">กรอกจำนวนขวดที่ต้องการปรุงเพื่อคำนวณ</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryCalculator;
