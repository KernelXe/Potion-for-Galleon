// event bus เล็กๆ ไว้ยิงสัญญาณ "แสดงเอฟเฟกต์ประกาย" จากที่ไหนก็ได้ในแอป
// โดยไม่ต้องส่ง prop ลึกๆ ผ่านหลายชั้น component
const listeners = new Set();

export const onSparkle = (callback) => {
  listeners.add(callback);
  return () => listeners.delete(callback);
};

export const fireSparkle = () => {
  listeners.forEach((callback) => callback());
};
