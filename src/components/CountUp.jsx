import { useEffect, useRef, useState } from 'react';

// นับตัวเลขไล่จากค่าก่อนหน้าไปยังค่าใหม่แบบ ease-out ทุกครั้งที่ value เปลี่ยน
// ใช้กับตัวเลขราคา/จำนวนที่อยากให้ดูพรีเมียมขึ้นตอนโหลดเสร็จหรือค่าถูกอัปเดต
const CountUp = ({ value = 0, duration = 500 }) => {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const rafRef = useRef(null);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;

    if (from === to) return undefined;

    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(from + (to - from) * eased);
      setDisplay(current);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration]);

  return display.toLocaleString('en-US');
};

export default CountUp;
