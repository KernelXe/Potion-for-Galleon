import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import NumberSliderInput, { parseNumber } from '../components/NumberSliderInput';

const Admin = () => {
  const { ingredients, setIngredients, potions, setPotions } = useAppData();

  const [ingName, setIngName] = useState('');
  const [ingGalleon, setIngGalleon] = useState('');
  const [ingSickle, setIngSickle] = useState('');
  const [ingKnut, setIngKnut] = useState('');
  const [editingIngredientId, setEditingIngredientId] = useState(null);

  const [potName, setPotName] = useState('');
  const [potCategory, setPotCategory] = useState('');
  const [potImage, setPotImage] = useState('/assets/potion.png');
  const [potSteps, setPotSteps] = useState('');
  const [potSelectedIngs, setPotSelectedIngs] = useState([]);
  const [tempIngId, setTempIngId] = useState('');
  const [tempIngQty, setTempIngQty] = useState('');
  const [editingPotionId, setEditingPotionId] = useState(null);

  const resetIngredientForm = () => {
    setEditingIngredientId(null);
    setIngName('');
    setIngGalleon('');
    setIngSickle('');
    setIngKnut('');
  };

  const handleEditIngredient = (ing) => {
    setEditingIngredientId(ing.id);
    setIngName(ing.name);
    setIngGalleon(String(ing.price.galleon));
    setIngSickle(String(ing.price.sickle));
    setIngKnut(String(ing.price.knut));
  };

  const saveIngredient = (e) => {
    e.preventDefault();
    if (!ingName) return;

    const price = {
      galleon: parseNumber(ingGalleon, 0),
      sickle: parseNumber(ingSickle, 0),
      knut: parseNumber(ingKnut, 0),
    };

    if (editingIngredientId) {
      setIngredients(ingredients.map(i => i.id === editingIngredientId ? { ...i, name: ingName, price } : i));
    } else {
      setIngredients([...ingredients, { id: `i${Date.now()}`, name: ingName, price }]);
    }

    resetIngredientForm();
  };

  const removeIngredient = (id) => {
    setIngredients(ingredients.filter(i => i.id !== id));
    if (editingIngredientId === id) resetIngredientForm();
  };

  const addPotionIng = () => {
    const qty = parseNumber(tempIngQty, 0);
    if (!tempIngId || qty < 1) return;
    setPotSelectedIngs([...potSelectedIngs, { id: tempIngId, quantity: qty }]);
    setTempIngQty('');
  };

  const removePotionIng = (idxToRemove) => {
    setPotSelectedIngs(potSelectedIngs.filter((_, idx) => idx !== idxToRemove));
  };

  const handleEditPotion = (pot) => {
    setEditingPotionId(pot.id);
    setPotName(pot.name);
    setPotCategory(pot.category);
    setPotImage(pot.image || '');
    setPotSteps(pot.steps.join('\n'));
    setPotSelectedIngs(pot.ingredients);
  };

  const cancelEditPotion = () => {
    setEditingPotionId(null);
    setPotName(''); setPotCategory(''); setPotSteps(''); setPotSelectedIngs([]); setPotImage('/assets/potion.png');
  };

  const addPotion = (e) => {
    e.preventDefault();
    if (!potName || !potCategory) return;
    const stepsArray = potSteps.split('\n').filter(s => s.trim() !== '');
    
    if (editingPotionId) {
      setPotions(potions.map(p => p.id === editingPotionId ? {
        ...p,
        name: potName,
        category: potCategory,
        image: potImage,
        steps: stepsArray,
        ingredients: potSelectedIngs
      } : p));
      cancelEditPotion();
    } else {
      const newPotion = {
        id: `p${Date.now()}`,
        name: potName,
        category: potCategory,
        image: potImage,
        steps: stepsArray,
        ingredients: potSelectedIngs
      };
      setPotions([...potions, newPotion]);
      cancelEditPotion();
    }
  };

  const removePotion = (id) => {
    setPotions(potions.filter(p => p.id !== id));
  };

  return (
    <div style={{ paddingTop: '20px', paddingBottom: '40px' }}>
      <h2 className="text-gradient" style={{ marginBottom: '30px' }}>Admin Dashboard</h2>
      
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* Ingredients Management */}
        <div style={{ flex: '1 1 400px' }}>
          <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
            <h3 style={{ color: 'var(--color-accent-secondary)', marginBottom: '15px' }}>
              {editingIngredientId ? 'Edit Ingredient' : 'Add Ingredient'}
            </h3>
            <form onSubmit={saveIngredient}>
              <div style={{ marginBottom: '10px' }}>
                <input type="text" className="input-field" placeholder="ชื่อส่วนผสม" value={ingName} onChange={(e) => setIngName(e.target.value)} required />
              </div>
              <div className="price-inputs">
                <div className="form-field">
                  <label className="form-field__label">Galleon</label>
                  <NumberSliderInput value={ingGalleon} onChange={setIngGalleon} min={0} placeholder="0" />
                </div>
                <div className="form-field">
                  <label className="form-field__label">Sickle</label>
                  <NumberSliderInput value={ingSickle} onChange={setIngSickle} min={0} placeholder="0" />
                </div>
                <div className="form-field">
                  <label className="form-field__label">Knut</label>
                  <NumberSliderInput value={ingKnut} onChange={setIngKnut} min={0} placeholder="0" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  {editingIngredientId ? 'บันทึกการแก้ไข' : 'เพิ่มส่วนผสม'}
                </button>
                {editingIngredientId && (
                  <button type="button" className="btn btn-outline" onClick={resetIngredientForm}>ยกเลิก</button>
                )}
              </div>
            </form>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ color: 'var(--color-accent-secondary)', marginBottom: '15px' }}>All Ingredients</h3>
            <ul style={{ listStyle: 'none', padding: 0, maxHeight: '300px', overflowY: 'auto' }}>
              {ingredients.map(ing => (
                <li key={ing.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'rgba(255,255,255,0.05)', marginBottom: '5px', borderRadius: '4px' }}>
                  <span>{ing.name} <small style={{color:'var(--color-text-secondary)'}}>({ing.price.galleon}G {ing.price.sickle}S {ing.price.knut}K)</small></span>
                  <div>
                    <button onClick={() => handleEditIngredient(ing)} className="btn" style={{ color: 'var(--color-accent-gold)', padding: '4px' }}><i className='bx bx-edit'></i></button>
                    <button onClick={() => removeIngredient(ing.id)} className="btn" style={{ color: '#ff4d4d', padding: '4px' }}><i className='bx bx-trash'></i></button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Potions Management */}
        <div style={{ flex: '1 1 500px' }}>
          <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
            <h3 style={{ color: 'var(--color-accent-primary)', marginBottom: '15px' }}>{editingPotionId ? 'Edit Potion Recipe' : 'Add Potion Recipe'}</h3>
            <form onSubmit={addPotion}>
              <div style={{ marginBottom: '10px' }}>
                <input type="text" className="input-field" placeholder="ชื่อยา" value={potName} onChange={(e) => setPotName(e.target.value)} required />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <input type="text" className="input-field" placeholder="หมวดหมู่ (เช่น ขั้นสูง)" value={potCategory} onChange={(e) => setPotCategory(e.target.value)} required />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <input type="text" className="input-field" placeholder="รูปภาพ URL (เว้นว่างได้)" value={potImage} onChange={(e) => setPotImage(e.target.value)} />
              </div>
              
              <div style={{ marginBottom: '15px', padding: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                <h4 style={{ marginBottom: '10px', color: 'var(--color-accent-blue)', fontSize: '14px' }}>ส่วนผสมที่ใช้</h4>
                <div className="potion-ing-add">
                  <select className="input-field" value={tempIngId} onChange={(e) => setTempIngId(e.target.value)}>
                    <option value="">-- เลือก --</option>
                    {ingredients.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                  </select>
                  <NumberSliderInput
                    value={tempIngQty}
                    onChange={setTempIngQty}
                    min={0}
                    placeholder="จำนวน"
                    narrow
                  />
                  <button type="button" className="btn btn-outline" onClick={addPotionIng}>เพิ่ม</button>
                </div>
                {potSelectedIngs.length > 0 && (
                  <ul style={{ fontSize: '14px', listStyle: 'none', padding: 0 }}>
                    {potSelectedIngs.map((pi, idx) => {
                      const ing = ingredients.find(i => i.id === pi.id);
                      return (
                        <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span>- {ing?.name} x{pi.quantity}</span>
                          <button type="button" onClick={() => removePotionIng(idx)} style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer' }}><i className='bx bx-x'></i></button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <div style={{ marginBottom: '15px' }}>
                <textarea 
                  className="input-field" 
                  placeholder="ขั้นตอนการปรุง (บรรทัดละ 1 ขั้นตอน)" 
                  rows="5" 
                  value={potSteps} 
                  onChange={(e) => setPotSteps(e.target.value)}
                  required
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{editingPotionId ? 'บันทึกการแก้ไข' : 'สร้างสูตรยา'}</button>
                {editingPotionId && <button type="button" className="btn btn-outline" onClick={cancelEditPotion}>ยกเลิก</button>}
              </div>
            </form>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ color: 'var(--color-accent-primary)', marginBottom: '15px' }}>All Potion Recipes</h3>
            <ul style={{ listStyle: 'none', padding: 0, maxHeight: '300px', overflowY: 'auto' }}>
              {potions.map(pot => (
                <li key={pot.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'rgba(255,255,255,0.05)', marginBottom: '5px', borderRadius: '4px' }}>
                  <span>{pot.name}</span>
                  <div>
                    <button onClick={() => handleEditPotion(pot)} className="btn" style={{ color: 'var(--color-accent-gold)', padding: '4px' }}><i className='bx bx-edit'></i></button>
                    <button onClick={() => removePotion(pot.id)} className="btn" style={{ color: '#ff4d4d', padding: '4px' }}><i className='bx bx-trash'></i></button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
