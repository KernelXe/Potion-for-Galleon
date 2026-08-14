import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

// ครอบหน้าที่ต้อง login ก่อนถึงจะเข้าได้ (เช่น /admin)
// ระหว่างที่ยังเช็คสถานะ login อยู่ (authLoading) จะโชว์ skeleton กันหน้ากระพริบ
// ถ้าเช็คเสร็จแล้วพบว่ายังไม่ login -> เด้งไปหน้า /login พร้อมจำหน้าที่ตั้งใจจะเข้าไว้
const RequireAuth = ({ children }) => {
  const { currentUser, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="space-y-4 py-10">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-40 w-full max-w-md" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
