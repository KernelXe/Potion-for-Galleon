import { useParams, Navigate } from 'react-router-dom';
import { getServerById } from '@/lib/servers';
import { AppDataProvider } from '@/context/AppDataContext';

// ครอบทุกหน้าที่อยู่ใต้ /s/:serverId
// - เช็คว่า serverId ใน URL มีอยู่จริงในรายชื่อเซิฟหรือไม่ ถ้าไม่มี -> เด้งกลับหน้าเลือกเซิฟ
// - ส่ง serverId เข้า AppDataProvider เพื่อให้ไปอ่าน/เขียนข้อมูลที่ document ของเซิฟนั้นโดยเฉพาะ
const ServerScope = ({ children }) => {
  const { serverId } = useParams();
  const server = getServerById(serverId);

  if (!server || server.comingSoon) {
    return <Navigate to="/" replace />;
  }

  // key={serverId} -> ทำให้ AppDataProvider ถูก mount ใหม่ทั้งก้อนทุกครั้งที่สลับเซิฟ
  // (แทนที่จะ reuse instance เดิม) เพื่อให้ state เริ่มต้นใหม่สะอาดๆ ไม่มีข้อมูลเซิฟเก่าค้าง
  return (
    <AppDataProvider key={serverId} serverId={serverId}>
      {children}
    </AppDataProvider>
  );
};

export default ServerScope;
