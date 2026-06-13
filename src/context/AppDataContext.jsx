import React, { createContext, useState, useContext, useEffect } from 'react';

const AppDataContext = createContext();

export const useAppData = () => useContext(AppDataContext);

export const AppDataProvider = ({ children }) => {
  // Default mock data
  const defaultIngredients = [
    { id: 'i1', name: 'คราบงูบูมสแลง', price: { galleon: 0, sickle: 2, knut: 10 }, image: '' },
    { id: 'i2', name: 'เขาไบคอร์น', price: { galleon: 1, sickle: 0, knut: 0 }, image: '' },
    { id: 'i3', name: 'แมลงวันลูกไม้', price: { galleon: 0, sickle: 0, knut: 15 }, image: '' },
    { id: 'i4', name: 'ปลิง', price: { galleon: 0, sickle: 1, knut: 0 }, image: '' },
  ];

  const defaultPotions = [
    {
      id: 'p1',
      name: 'น้ำยาสรรพรส (Polyjuice Potion)',
      category: 'ขั้นสูง',
      image: '/assets/potion.png',
      steps: [
        'เติมหญ้าน้ำประสาน 3 ส่วนลงในหม้อ',
        'เติมหญ้าปม 2 มัดลงในหม้อ',
        'คน 3 ครั้ง ตามเข็มนาฬิกา',
        'โบกไม้กายสิทธิ์แล้วปล่อยให้ยาต้ม 80 นาที',
        'เพิ่มปลิง 4 ตัวลงในหม้อ',
        'เพิ่มแมลงวันลูกไม้ 2 ช้อนลงในโกร่งบดยา แล้วบดให้ละเอียด',
        'ใส่แมลงวันลูกไม้บด 2 ส่วนลงในหม้อ',
        'ตั้งไฟอ่อน 30 วินาที'
      ],
      ingredients: [
        { id: 'i3', quantity: 2 },
        { id: 'i4', quantity: 4 },
        { id: 'i1', quantity: 1 },
        { id: 'i2', quantity: 1 }
      ]
    }
  ];

  const [ingredients, setIngredients] = useState(() => {
    const saved = localStorage.getItem('potions_ingredients');
    return saved ? JSON.parse(saved) : defaultIngredients;
  });

  const [potions, setPotions] = useState(() => {
    const saved = localStorage.getItem('potions_potions');
    return saved ? JSON.parse(saved) : defaultPotions;
  });

  // Save to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('potions_ingredients', JSON.stringify(ingredients));
  }, [ingredients]);

  useEffect(() => {
    localStorage.setItem('potions_potions', JSON.stringify(potions));
  }, [potions]);

  // Currency Utils
  // 1 Galleon = 17 Sickles
  // 1 Sickle = 29 Knuts
  // Total Knuts = (Galleon * 17 * 29) + (Sickle * 29) + Knut
  
  const toTotalKnuts = (price) => {
    const g = Number(price.galleon) || 0;
    const s = Number(price.sickle) || 0;
    const k = Number(price.knut) || 0;
    return (g * 17 * 29) + (s * 29) + k;
  };

  const toCurrencyObj = (totalKnuts) => {
    const galleon = Math.floor(totalKnuts / (17 * 29));
    let remainder = totalKnuts % (17 * 29);
    const sickle = Math.floor(remainder / 29);
    const knut = remainder % 29;
    return { galleon, sickle, knut };
  };

  const calculatePotionCost = (potion) => {
    let totalKnuts = 0;
    potion.ingredients.forEach(item => {
      const ing = ingredients.find(i => i.id === item.id);
      if (ing) {
        totalKnuts += toTotalKnuts(ing.price) * item.quantity;
      }
    });
    return toCurrencyObj(totalKnuts);
  };

  return (
    <AppDataContext.Provider value={{
      ingredients, setIngredients,
      potions, setPotions,
      toTotalKnuts, toCurrencyObj,
      calculatePotionCost
    }}>
      {children}
    </AppDataContext.Provider>
  );
};
