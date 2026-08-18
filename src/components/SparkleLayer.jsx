import { useEffect, useState } from 'react';
import { onSparkle } from '@/lib/sparkleBus';

let burstId = 0;
const PARTICLE_COUNT = 12;

// mount ครั้งเดียวที่ระดับแอป -- คอยฟัง sparkleBus แล้ววาดประกายทองฟุ้งออกจากจุดกึ่งกลางด้านบนจอ
// ใช้ตอน action สำเร็จ (บันทึก/เพิ่ม/ลบ) ให้ความรู้สึกฉลองเล็กๆ โดยไม่รบกวนการใช้งาน
const SparkleLayer = () => {
  const [bursts, setBursts] = useState([]);

  useEffect(() => {
    return onSparkle(() => {
      const id = burstId++;
      const particles = Array.from({ length: PARTICLE_COUNT }).map((_, i) => ({
        id: i,
        angle: (i * 360) / PARTICLE_COUNT + (Math.random() * 16 - 8),
        distance: 46 + Math.random() * 46,
        delay: Math.random() * 0.08,
      }));
      setBursts((prev) => [...prev, { id, particles }]);
      setTimeout(() => {
        setBursts((prev) => prev.filter((b) => b.id !== id));
      }, 950);
    });
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-16 z-[100] flex justify-center">
      {bursts.map((burst) => (
        <div key={burst.id} className="relative size-0">
          {burst.particles.map((p) => (
            <span
              key={p.id}
              className="sparkle-particle"
              style={{
                '--sparkle-angle': `${p.angle}deg`,
                '--sparkle-distance': `${p.distance}px`,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default SparkleLayer;
