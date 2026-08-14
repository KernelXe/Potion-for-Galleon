import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SERVERS } from '@/lib/servers';

// การ์ดของแต่ละเซิฟ: มีรูปพื้นหลัง (เบลอ) + gradient สีสำรอง + ชื่อเซิฟทับด้านหน้า
// ถ้าไม่มีไฟล์รูปที่ path ที่กำหนด (หรือโหลดไม่ขึ้น) จะไม่แสดงรูปแตก ๆ
// แต่จะเหลือแค่พื้น gradient สีของเซิฟนั้นแทนโดยอัตโนมัติ
const ServerCard = ({ server }) => {
  const [imageOk, setImageOk] = useState(Boolean(server.bgImage));

  return (
    <Link
      to={`/s/${server.id}`}
      className="group relative flex h-64 flex-col justify-end overflow-hidden rounded-2xl border border-gold/25 no-underline shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:border-gold/50 sm:h-72"
    >
      {/* พื้นหลัง gradient สีของเซิฟ (fallback เสมอ อยู่ชั้นล่างสุด) */}
      <div className={`absolute inset-0 bg-gradient-to-br ${server.theme}`} />

      {/* รูปพื้นหลังของเซิฟ ถ้ามีไฟล์จริง จะเบลอ + ซ้อนทับ gradient ด้านบน */}
      {imageOk && (
        <img
          src={server.bgImage}
          alt=""
          aria-hidden
          onError={() => setImageOk(false)}
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-70 blur-[1px] transition-transform duration-500 group-hover:scale-125"
        />
      )}

      {/* เฉดมืดด้านล่างให้ตัวอักษรอ่านง่าย */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

      {/* กรอบเรืองแสงตอน hover */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 shadow-[inset_0_0_40px_oklch(0.76_0.12_85/0.25)] transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex flex-col gap-1.5 p-5 sm:p-6">
        <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-gold/70">
          <i className="bx bx-server text-xs" /> Server
        </span>
        <h2 className="font-heading text-2xl font-bold text-white drop-shadow sm:text-3xl">
          {server.name}
        </h2>
        <p className="text-sm text-muted-foreground/90">{server.tagline}</p>
      </div>
    </Link>
  );
};

const ServerSelect = () => {
  return (
    <div className="flex flex-col gap-8 pb-12 pt-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex items-center gap-2.5 text-gold/60">
          <i className="bx bx-flask-round text-2xl" />
        </span>
        <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl">
          เลือกเซิฟเวอร์
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          แต่ละเซิฟมีสูตรยา วัตถุดิบ และราคาแยกจากกันโดยสมบูรณ์
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SERVERS.map((server) => (
          <ServerCard key={server.id} server={server} />
        ))}
      </div>
    </div>
  );
};

export default ServerSelect;
