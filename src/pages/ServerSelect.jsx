import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { SERVERS } from '@/lib/servers';

// การ์ดของแต่ละเซิฟ: มีรูปพื้นหลัง (เบลอ) + gradient สีสำรอง + ชื่อเซิฟทับด้านหน้า
// ถ้าไม่มีไฟล์รูปที่ path ที่กำหนด (หรือโหลดไม่ขึ้น) จะไม่แสดงรูปแตก ๆ
// แต่จะเหลือแค่พื้น gradient สีของเซิฟนั้นแทนโดยอัตโนมัติ
const TILT_MAX_DEG = 6;

const ServerCard = ({ server, index = 0 }) => {
  const [imageOk, setImageOk] = useState(Boolean(server.bgImage));
  const cardRef = useRef(null);
  const isComingSoon = Boolean(server.comingSoon);

  // เอียงการ์ดตามตำแหน่งเมาส์เล็กน้อย (tilt 3D) ให้ความรู้สึกมีมิติตอน hover
  const handleMouseMove = (e) => {
    if (isComingSoon) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateX(${(-py * TILT_MAX_DEG).toFixed(2)}deg) rotateY(${(px * TILT_MAX_DEG).toFixed(2)}deg) translateY(-4px)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = '';
  };

  const CardWrapper = isComingSoon ? 'div' : Link;

  return (
    <CardWrapper
      ref={cardRef}
      {...(isComingSoon ? {} : { to: `/s/${server.id}` })}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: 'preserve-3d', willChange: 'transform', '--stagger-delay': `${index * 90}ms` }}
      className={`group relative flex h-64 flex-col justify-end overflow-hidden rounded-2xl border border-gold/25 no-underline shadow-lg transition-transform duration-300 ease-out sm:h-72 card-arcane stagger-fade ${
        isComingSoon ? 'cursor-not-allowed grayscale' : 'hover:border-gold/50'
      }`}
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
          className={`absolute inset-0 h-full w-full scale-110 object-cover opacity-70 blur-[2px] transition-transform duration-500 ${!isComingSoon && 'group-hover:scale-125'}`}
        />
      )}

      {/* เฉดมืดด้านล่างให้ตัวอักษรอ่านง่าย */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

      {isComingSoon ? (
        <>
          {/* เฉดมืดเพิ่มทั้งการ์ดให้ดูปิดใช้งานชัดเจน */}
          <div className="absolute inset-0 bg-background/55" />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="flex items-center gap-2 rounded-full border border-gold/30 bg-background/70 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-gold/80">
              <i className="bx bx-lock-alt text-sm" /> เร็วๆ นี้
            </span>
          </div>
        </>
      ) : (
        <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 shadow-[inset_0_0_40px_oklch(0.76_0.12_85/0.25)] transition-opacity duration-300 group-hover:opacity-100" />
      )}

      <div className="relative flex flex-col gap-1.5 p-5 sm:p-6" style={{ transform: 'translateZ(30px)' }}>
        <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-gold/70">
          <i className="bx bx-server text-xs" /> Server
        </span>
        <h2 className="font-heading text-2xl font-bold text-white drop-shadow sm:text-3xl">
          {server.name}
        </h2>
        <p className="text-sm text-muted-foreground/90">{server.tagline}</p>
      </div>
    </CardWrapper>
  );
};

const ServerSelect = () => {
  return (
    <div className="flex flex-col gap-8 pb-12 pt-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex items-center gap-2.5 text-gold/60">
          <i className="bx bx-flask-round text-2xl" />
        </span>
        <h1 className="font-heading text-3xl font-bold text-arcane-glow sm:text-4xl">
          เลือกเซิฟเวอร์
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          แต่ละเซิฟมีสูตรยา วัตถุดิบ และราคาแยกจากกันโดยสมบูรณ์
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" style={{ perspective: '1000px' }}>
        {SERVERS.map((server, index) => (
          <ServerCard key={server.id} server={server} index={index} />
        ))}
      </div>
    </div>
  );
};

export default ServerSelect;
