import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import CurrencyDisplay from './CurrencyDisplay';
import NumberSliderInput, { parseNumber } from './NumberSliderInput';

const CartPlanner = ({ selectedPotionId }) => {
  const { potions, ingredients, toTotalKnuts, toCurrencyObj } = useAppData();
  const [quantity, setQuantity] = useState('');

  const selectedPotion = potions.find(p => p.id === selectedPotionId);
  const qty = parseNumber(quantity, 0);

  let totalKnuts = 0;
  if (selectedPotion && qty > 0) {
    selectedPotion.ingredients.forEach(ingItem => {
      const ing = ingredients.find(i => i.id === ingItem.id);
      if (ing) {
        totalKnuts += toTotalKnuts(ing.price) * (ingItem.quantity * qty);
      }
    });
  }
  const totalCost = toCurrencyObj(totalKnuts);

  return (
    <div className="glass-panel home-panel">
      <div className="section-header">
        <h3 className="text-gradient"><i className="bx bx-cart-alt"></i> Craft Planner</h3>
      </div>

      {!selectedPotion ? (
        <p className="home-panel-hint">เลือกสูตรยาด้านบนเพื่อเริ่มวางแผนคราฟ</p>
      ) : (
        <>
          <div className="selected-potion-badge">
            <i className="bxf bx-flask-round"></i>
            <span>{selectedPotion.name}</span>
          </div>

          <div className="form-field">
            <label className="form-field__label">จำนวนขวดที่ต้องการคราฟ</label>
            <NumberSliderInput
              value={quantity}
              onChange={setQuantity}
              min={0}
              placeholder="กรอกจำนวน"
            />
          </div>

          {qty > 0 ? (
            <div>
              <h4 className="subsection-title">วัตถุดิบทั้งหมดที่ต้องใช้</h4>
              <ul className="item-list">
                {selectedPotion.ingredients.map(ingItem => {
                  const ing = ingredients.find(i => i.id === ingItem.id);
                  const totalRequired = ingItem.quantity * qty;
                  return (
                    <li key={ingItem.id} className="item-list__row">
                      <span>{ing?.name}</span>
                      <span className="item-list__value">x{totalRequired}</span>
                    </li>
                  );
                })}
              </ul>
              <div className="summary-box">
                <span>ราคารวม:</span>
                <CurrencyDisplay price={totalCost} />
              </div>
            </div>
          ) : (
            <p className="home-panel-hint">กรอกจำนวนขวดเพื่อดูวัตถุดิบ</p>
          )}
        </>
      )}
    </div>
  );
};

export default CartPlanner;
