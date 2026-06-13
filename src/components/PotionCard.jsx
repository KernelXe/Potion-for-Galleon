import React from 'react';
import CurrencyDisplay from './CurrencyDisplay';
import { useAppData } from '../context/AppDataContext';
import RecipeViewer from './RecipeViewer';

const PotionCard = ({ potion }) => {
  const { calculatePotionCost, ingredients } = useAppData();
  const cost = calculatePotionCost(potion);

  return (
    <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
        {potion.image ? (
          <img src={potion.image} alt={potion.name} style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '12px', border: '1px solid var(--color-accent-primary)' }} />
        ) : (
          <div style={{ width: '120px', height: '120px', borderRadius: '12px', border: '1px solid var(--color-accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)' }}>
            <i className='bxf bx-flask-round' style={{ fontSize: '48px', color: 'var(--color-accent-primary)' }}></i>
          </div>
        )}
        
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="text-gradient" style={{ fontSize: '24px', margin: 0 }}>{potion.name}</h2>
            <span style={{ padding: '4px 8px', background: 'rgba(108, 92, 231, 0.2)', color: 'var(--color-accent-primary)', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{potion.category}</span>
          </div>
          
          <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>ราคาต่อขวด:</span>
            <CurrencyDisplay price={cost} />
          </div>

          <div style={{ marginTop: '15px' }}>
            <h4 style={{ color: 'var(--color-accent-gold)', marginBottom: '8px' }}>ส่วนผสม:</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {potion.ingredients.map(item => {
                const ing = ingredients.find(i => i.id === item.id);
                return ing ? (
                  <span key={item.id} style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                    {ing.name} x{item.quantity}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ marginTop: '20px', borderTop: '1px solid var(--color-border)', paddingTop: '15px' }}>
        <h4 style={{ color: 'var(--color-accent-primary)' }}>Brewing Steps</h4>
        <RecipeViewer steps={potion.steps} />
      </div>
    </div>
  );
};

export default PotionCard;
