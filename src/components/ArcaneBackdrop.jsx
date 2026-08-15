// ลายวงเวทมนตร์ (arcane sigil) วางไว้เป็นพื้นหลังเบื้องหลังทุกหน้า
// เป็น SVG นิ่ง ไม่มีอนิเมชัน ความทึบต่ำมาก (แค่ให้เห็นลางๆ เป็น texture ไม่ใช่ลวดลายเด่น)
// ป้องกันไม่ให้กวนสายตาหรือรบกวนการอ่านเนื้อหาข้างหน้า
const Sigil = ({ className }) => (
  <svg viewBox="0 0 400 400" className={className} aria-hidden focusable="false">
    <g fill="none" stroke="currentColor" strokeWidth="0.6">
      <circle cx="200" cy="200" r="180" />
      <circle cx="200" cy="200" r="150" />
      <circle cx="200" cy="200" r="60" />
      <polygon points="200,40 330,270 70,270" />
      <polygon points="200,360 70,130 330,130" />
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 360) / 24;
        const rad = (angle * Math.PI) / 180;
        const x1 = 200 + 180 * Math.cos(rad);
        const y1 = 200 + 180 * Math.sin(rad);
        const x2 = 200 + 170 * Math.cos(rad);
        const y2 = 200 + 170 * Math.sin(rad);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
      })}
    </g>
  </svg>
);

const ArcaneBackdrop = () => {
  // สุ่มตำแหน่ง/ความเร็ว/ดีเลย์ของฝุ่นแสงแต่ละจุดครั้งเดียวตอน mount (ไม่สุ่มใหม่ทุก re-render)
  const motes = Array.from({ length: 10 }).map((_, i) => ({
    id: i,
    left: `${(i * 9.7) % 100}%`,
    duration: `${18 + (i % 5) * 3}s`,
    delay: `${-(i * 2.3)}s`,
    opacity: 0.35 + (i % 4) * 0.1,
  }));

  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden text-gold">
        <Sigil className="absolute -left-40 -top-40 size-[560px] opacity-[0.05] sm:size-[680px]" />
        <Sigil className="absolute -bottom-56 -right-40 size-[520px] opacity-[0.04] sm:size-[640px]" />
        {motes.map((m) => (
          <span
            key={m.id}
            className="dust-mote"
            style={{
              left: m.left,
              animationDuration: m.duration,
              animationDelay: m.delay,
              '--dust-opacity': m.opacity,
            }}
          />
        ))}
      </div>
      <div className="grain-overlay" aria-hidden />
    </>
  );
};

export default ArcaneBackdrop;
