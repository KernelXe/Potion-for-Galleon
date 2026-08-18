import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const NotFound = () => (
  <div className="flex min-h-[65vh] items-center justify-center py-10">
    <Card className="card-arcane flex max-w-md flex-col items-center gap-4 px-8 py-12 text-center">
      <i className="bxf bx-ghost text-6xl text-gold/70" />
      <h1 className="font-heading text-4xl font-bold text-arcane-glow">404</h1>
      <p className="text-sm text-muted-foreground">
        คาถานี้ยังไม่มีใครค้นพบ — ไม่พบหน้าที่คุณกำลังตามหา
      </p>
      <Button asChild className="mt-2">
        <Link to="/">กลับไปหน้าเลือกเซิฟเวอร์</Link>
      </Button>
    </Card>
  </div>
);

export default NotFound;
