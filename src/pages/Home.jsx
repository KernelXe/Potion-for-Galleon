import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import PotionCard from '../components/PotionCard';
import CartPlanner from '../components/CartPlanner';
import InventoryCalculator from '../components/InventoryCalculator';
import PotionSelector from '../components/PotionSelector';

const Home = () => {
  const { potions } = useAppData();
  const [selectedPotionId, setSelectedPotionId] = useState('');
  const selectedPotion = potions.find(p => p.id === selectedPotionId);

  return (
    <div className="home-page">
      <section className="glass-panel home-selector-panel">
        <div className="home-selector-panel__header">
          <i className="bx bx-search-alt"></i>
          <div>
            <h3 className="text-gradient" style={{ marginBottom: '4px' }}>Select Potion Recipe</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', margin: 0 }}>
              ค้นหาและเลือกสูตรยา — ใช้ร่วมกันทั้งตารางคราฟ สูตรยา และระบบคำนวณวัตถุดิบ
            </p>
          </div>
        </div>
        <PotionSelector
          potions={potions}
          value={selectedPotionId}
          onChange={setSelectedPotionId}
        />
      </section>

      <div className="home-grid">
        <CartPlanner
          selectedPotionId={selectedPotionId}
          onPotionChange={setSelectedPotionId}
        />

        <section className="home-recipe-panel">
          <div className="section-header">
            <h3 className="text-gradient"><i className="bx bx-book-bookmark"></i> All Potion Recipes</h3>
          </div>
          {selectedPotion ? (
            <PotionCard potion={selectedPotion} />
          ) : (
            <div className="glass-panel home-empty-state">
              <i className="bxf bx-flask-round"></i>
              <p>กรุณาเลือกสูตรยาเพื่อดูรายละเอียด</p>
            </div>
          )}
        </section>
      </div>

      <InventoryCalculator selectedPotionId={selectedPotionId} />
    </div>
  );
};

export default Home;
