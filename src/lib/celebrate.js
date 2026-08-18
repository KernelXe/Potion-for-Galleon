import { toast } from 'sonner';
import { fireSparkle } from './sparkleBus';

// ใช้แทน toast.success() ตรงๆ สำหรับ action ที่อยากให้มีเอฟเฟกต์ประกายทองฟุ้งขึ้นด้วย
// เช่น บันทึก/เพิ่ม/ลบข้อมูลสำเร็จ (ไม่ใช้กับ action ธรรมดาอย่าง logout)
export const celebrate = (message) => {
  toast.success(message);
  fireSparkle();
};
