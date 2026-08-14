// แสดงตอนกำลังโหลดข้อมูลจาก Firestore -- แทนที่ grid ของ skeleton เทาๆ เดิม
// ด้วยไอคอนหม้อต้มยา (เอฟเฟกต์เด้งเบาๆ) + ฟองอากาศลอยขึ้น ให้ตรงธีมเวทมนตร์มากขึ้น
const CauldronLoader = ({ label = 'กำลังปรุงข้อมูล...' }) => (
  <div className="flex min-h-[280px] flex-col items-center justify-center gap-5 py-16">
    <div className="relative flex h-20 w-20 items-center justify-center">
      <span className="cauldron-bubble left-[22px]" style={{ animationDelay: '0s' }} />
      <span className="cauldron-bubble left-[38px]" style={{ animationDelay: '0.45s' }} />
      <span className="cauldron-bubble left-[50px]" style={{ animationDelay: '0.9s' }} />
      <span
        aria-hidden
        className="absolute inset-0 rounded-full bg-gold/15 blur-xl"
      />
      <i
        className="bxf bx-flask-round relative text-6xl text-gold drop-shadow-[0_0_16px_oklch(0.76_0.12_85/0.5)]"
        style={{ animation: 'cauldron-bob 2.2s ease-in-out infinite' }}
      />
    </div>
    <p className="font-heading text-xs uppercase tracking-[0.3em] text-muted-foreground">
      {label}
    </p>
  </div>
);

export default CauldronLoader;
