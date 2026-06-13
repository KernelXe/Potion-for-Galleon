import React, { createContext, useState, useContext, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

const AppDataContext = createContext();

export const useAppData = () => useContext(AppDataContext);

export const AppDataProvider = ({ children }) => {
  // Default mock data
  const defaultIngredients = [
    { id: 'i1', name: 'คราบงูบูมสแลง', price: { galleon: 0, sickle: 2, knut: 10 } },
    { id: 'i2', name: 'เขาไบคอร์น', price: { galleon: 1, sickle: 0, knut: 0 } },
    { id: 'i3', name: 'แมลงวันลูกไม้', price: { galleon: 0, sickle: 0, knut: 15 } },
    { id: 'i4', name: 'ปลิง', price: { galleon: 0, sickle: 1, knut: 0 } },
    { id: 'i5', name: 'เลือดซาลาแมนเดอร์', price: { galleon: 0, sickle: 0, knut: 0 } },
    { id: 'i6', name: 'ผงกระดูกสันหลังปลาสิงโต', price: { galleon: 0, sickle: 0, knut: 0 } },
    { id: 'i7', name: 'เมือกหนอนฟลอบเบอร์', price: { galleon: 0, sickle: 0, knut: 0 } },
    { id: 'i8', name: 'น้ำผึ้ง', price: { galleon: 0, sickle: 0, knut: 0 } },
    { id: 'i9', name: 'น้ำบูมเบอร์รี่', price: { galleon: 0, sickle: 0, knut: 0 } },
  ];

  const mergeDefaultIngredients = (saved) => {
    if (!saved) return defaultIngredients;
    const parsed = JSON.parse(saved);
    const existingIds = new Set(parsed.map(i => i.id));
    const existingNames = new Set(parsed.map(i => i.name));
    const missing = defaultIngredients.filter(
      d => !existingIds.has(d.id) && !existingNames.has(d.name)
    );
    return missing.length ? [...parsed, ...missing] : parsed;
  };

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

  const [ingredients, setIngredients] = useState([]);
  const [potions, setPotions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [categoryOrder, setCategoryOrder] = useState([]);

  // Initialize Firestore data on mount
  useEffect(() => {
    const initFirestore = async () => {
      try {
        const dataRef = doc(db, 'data', 'appData');
        const dataSnap = await getDoc(dataRef);

        if (!dataSnap.exists()) {
          // First time - create initial data
          const initialData = {
            ingredients: defaultIngredients,
            potions: defaultPotions,
            categories: ['ขั้นสูง'],
            categoryOrder: ['ขั้นสูง']
          };
          await setDoc(dataRef, initialData);
          setIngredients(defaultIngredients);
          setPotions(defaultPotions);
          setCategories(['ขั้นสูง']);
          setCategoryOrder(['ขั้นสูง']);
        } else {
          // Load existing data
          setIngredients(dataSnap.data().ingredients || defaultIngredients);
          setPotions(dataSnap.data().potions || defaultPotions);
          setCategories(dataSnap.data().categories || ['ขั้นสูง']);
          setCategoryOrder(dataSnap.data().categoryOrder || ['ขั้นสูง']);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing Firestore:', error);
        setIsLoading(false);
      }
    };

    initFirestore();

    // Listen for real-time changes
    const unsubscribe = onSnapshot(doc(db, 'data', 'appData'), (doc) => {
      if (doc.exists()) {
        setIngredients(doc.data().ingredients || defaultIngredients);
        setPotions(doc.data().potions || defaultPotions);
        setCategories(doc.data().categories || ['ขั้นสูง']);
        setCategoryOrder(doc.data().categoryOrder || ['ขั้นสูง']);
      }
    }, (error) => {
      console.error('Error listening to Firestore:', error);
    });

    return unsubscribe;
  }, []);

  // Save ingredients to Firestore whenever they change
  useEffect(() => {
    if (ingredients.length === 0 && isLoading) return;
    
    const updateData = async () => {
      try {
        const dataRef = doc(db, 'data', 'appData');
        await setDoc(dataRef, { ingredients, potions }, { merge: true });
      } catch (error) {
        console.error('Error updating ingredients in Firestore:', error);
      }
    };

    updateData();
  }, [ingredients]);

  // Save potions to Firestore whenever they change
  useEffect(() => {
    if (potions.length === 0 && isLoading) return;
    
    const updateData = async () => {
      try {
        const dataRef = doc(db, 'data', 'appData');
        await setDoc(dataRef, { ingredients, potions }, { merge: true });
      } catch (error) {
        console.error('Error updating potions in Firestore:', error);
      }
    };

    updateData();
  }, [potions]);

  // Save categories to Firestore whenever they change
  useEffect(() => {
    if (categoryOrder.length === 0 && isLoading) return;
    
    const updateData = async () => {
      try {
        const dataRef = doc(db, 'data', 'appData');
        await setDoc(dataRef, { categories, categoryOrder }, { merge: true });
      } catch (error) {
        console.error('Error updating categories in Firestore:', error);
      }
    };

    updateData();
  }, [categories, categoryOrder]);

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
      calculatePotionCost,
      isLoading,
      categories, setCategories,
      categoryOrder, setCategoryOrder
    }}>
      {children}
    </AppDataContext.Provider>
  );
};
