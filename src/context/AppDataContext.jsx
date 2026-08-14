import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';

const AppDataContext = createContext();

export const useAppData = () => useContext(AppDataContext);

// serverId เลือกว่าจะอ่าน/เขียนข้อมูลของเซิฟไหนใน Firestore
// เอกสารแต่ละเซิฟจะแยกกันเด็ดขาดที่ collection "data" โดยใช้ serverId เป็น document id
// เช่น data/mooncraft, data/hogwarts
export const AppDataProvider = ({ serverId, children }) => {
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

  // ref เหล่านี้ไม่ทำให้ re-render (ต่างจาก state) เลยใช้เป็น "flag" คุมจังหวะได้แม่นกว่า
  // hasLoadedRef -> โหลดข้อมูลของเซิฟปัจจุบันเสร็จหรือยัง (กันการเขียนทับก่อนโหลดเสร็จ)
  // skip*SaveRef -> การเปลี่ยนแปลง state ครั้งนี้มาจาก Firestore เอง (โหลดครั้งแรก/realtime update)
  //                 ไม่ใช่จากผู้ใช้แก้ไข จึงไม่ต้องเขียนกลับไปอีกรอบ (กัน loop และกันเขียนทับข้อมูลคนอื่น)
  const hasLoadedRef = useRef(false);
  const skipIngredientsSaveRef = useRef(false);
  const skipPotionsSaveRef = useRef(false);
  const skipCategoriesSaveRef = useRef(false);

  // โหลดข้อมูล + subscribe realtime ของเซิฟที่เลือกอยู่
  useEffect(() => {
    if (!serverId) return;

    const dataRef = doc(db, 'data', serverId);

    const applyRemoteData = (data) => {
      skipIngredientsSaveRef.current = true;
      skipPotionsSaveRef.current = true;
      skipCategoriesSaveRef.current = true;
      setIngredients(data.ingredients || defaultIngredients);
      setPotions(data.potions || defaultPotions);
      setCategories(data.categories || ['ขั้นสูง']);
      setCategoryOrder(data.categoryOrder || ['ขั้นสูง']);
    };

    const init = async () => {
      try {
        const dataSnap = await getDoc(dataRef);

        if (!dataSnap.exists()) {
          // เซิฟนี้ยังไม่เคยมีข้อมูล -> สร้างค่าเริ่มต้นให้
          const initialData = {
            ingredients: defaultIngredients,
            potions: defaultPotions,
            categories: ['ขั้นสูง'],
            categoryOrder: ['ขั้นสูง']
          };
          await setDoc(dataRef, initialData);
          applyRemoteData(initialData);
        } else {
          applyRemoteData(dataSnap.data());
        }
      } catch (error) {
        console.error('Error initializing Firestore:', error);
      } finally {
        hasLoadedRef.current = true;
        setIsLoading(false);
      }
    };

    init();

    // ฟังข้อมูล realtime (รวมถึงการเปลี่ยนแปลงจากเครื่อง/คนอื่น) ของเซิฟนี้
    const unsubscribe = onSnapshot(dataRef, (snap) => {
      if (snap.exists()) {
        applyRemoteData(snap.data());
      }
    }, (error) => {
      console.error('Error listening to Firestore:', error);
    });

    return () => unsubscribe();
  }, [serverId]);

  // บันทึก ingredients กลับ Firestore -- แก้เฉพาะ field "ingredients" เท่านั้น
  // ไม่แตะ potions/categories ของเซิฟนี้เลย ป้องกันการเขียนทับข้อมูลของคนอื่นที่เพิ่งบันทึกไป
  useEffect(() => {
    if (!serverId || !hasLoadedRef.current) return;
    if (skipIngredientsSaveRef.current) {
      skipIngredientsSaveRef.current = false;
      return;
    }
    updateDoc(doc(db, 'data', serverId), { ingredients }).catch((error) => {
      console.error('Error updating ingredients in Firestore:', error);
    });
  }, [ingredients, serverId]);

  // บันทึก potions กลับ Firestore -- แก้เฉพาะ field "potions" เท่านั้น
  useEffect(() => {
    if (!serverId || !hasLoadedRef.current) return;
    if (skipPotionsSaveRef.current) {
      skipPotionsSaveRef.current = false;
      return;
    }
    updateDoc(doc(db, 'data', serverId), { potions }).catch((error) => {
      console.error('Error updating potions in Firestore:', error);
    });
  }, [potions, serverId]);

  // บันทึก categories/categoryOrder กลับ Firestore -- แก้เฉพาะสอง field นี้เท่านั้น
  useEffect(() => {
    if (!serverId || !hasLoadedRef.current) return;
    if (skipCategoriesSaveRef.current) {
      skipCategoriesSaveRef.current = false;
      return;
    }
    updateDoc(doc(db, 'data', serverId), { categories, categoryOrder }).catch((error) => {
      console.error('Error updating categories in Firestore:', error);
    });
  }, [categories, categoryOrder, serverId]);

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
      serverId,
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
