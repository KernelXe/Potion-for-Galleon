import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// แปล error code จาก Firebase Auth เป็นข้อความไทยที่อ่านเข้าใจง่าย
const getErrorMessage = (code) => {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
    case 'auth/invalid-email':
      return 'รูปแบบอีเมลไม่ถูกต้อง';
    case 'auth/too-many-requests':
      return 'พยายาม login ผิดหลายครั้งเกินไป กรุณารอสักครู่แล้วลองใหม่';
    case 'auth/network-request-failed':
      return 'เชื่อมต่อเครือข่ายไม่ได้ กรุณาลองใหม่';
    default:
      return 'เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง';
  }
};

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ถ้ามาจากหน้า /admin ที่โดนกันไว้ ให้พาไปหน้านั้นต่อหลัง login สำเร็จ
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('กรุณากรอกอีเมลและรหัสผ่าน');
      return;
    }
    setIsSubmitting(true);
    try {
      await login(email, password);
      toast.success('เข้าสู่ระบบสำเร็จ');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error.code));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-10">
      <Card className="card-arcane w-full max-w-sm">
        <CardHeader>
          <div className="mb-2 flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full border border-gold/40 bg-gradient-to-br from-card via-card/80 to-background">
              <i className="bx bx-lock-alt text-lg text-gold" />
            </span>
            <div>
              <CardTitle className="font-heading text-xl text-arcane-glow">เข้าสู่ระบบผู้ดูแล</CardTitle>
              <CardDescription>สำหรับจัดการวัตถุดิบและสูตรยาเท่านั้น</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">อีเมล</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">รหัสผ่าน</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
              {isSubmitting ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
