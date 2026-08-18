// รายชื่อเซิฟเวอร์ทั้งหมดในระบบ
// - id            ใช้เป็นทั้งส่วนของ URL (/s/<id>) และชื่อ document ใน Firestore (data/<id>)
//                 ห้ามมีเว้นวรรค/อักษรพิเศษ แนะนำเป็นตัวพิมพ์เล็กล้วน
// - name          ชื่อที่แสดงให้ผู้ใช้เห็น
// - tagline       ข้อความบรรยายสั้นๆ ใต้ชื่อเซิฟ
// - bgImage       (ไม่บังคับ) path รูปพื้นหลังของเซิฟนี้ เช่น '/assets/servers/mooncraft.jpg'
//                 วางไฟล์รูปไว้ที่ public/assets/servers/ แล้วใส่ path ตรงนี้
//                 ถ้าไม่ใส่ หรือรูปหาไม่เจอ ระบบจะ fallback ไปใช้ gradient สีของ "theme" แทนอัตโนมัติ
// - theme         ชุดสี gradient ใช้ตอนไม่มี bgImage (หรือรูปโหลดไม่ขึ้น)
//
// - comingSoon    (ไม่บังคับ) true = เซิฟยังไม่เปิดใช้งานจริง การ์ดจะแสดงเป็นสถานะ "เร็วๆ นี้"
//                 กดเข้าไม่ได้ (กันสับสน ไม่ให้เข้าไปเจอฐานข้อมูลว่างเปล่าของเซิฟที่ยังไม่มีจริง)
//
// ต้องการเพิ่ม/แก้ไขเซิฟเวอร์ -> แก้ที่ array นี้ที่เดียว หน้าเลือกเซิฟจะอัปเดตให้เองอัตโนมัติ
export const SERVERS = [
  {
    id: 'mooncraft',
    name: 'Mooncraft',
    tagline: 'ระบบปรุงยาของเซิฟ Mooncraft',
    bgImage: '/assets/servers/mooncraft.jpg',
    theme: 'from-indigo-950 via-purple-900/70 to-slate-950',
  },
  {
    id: 'hogwarts',
    name: 'Hogwarts',
    tagline: 'ระบบปรุงยาของเซิฟ Hogwarts',
    bgImage: '/assets/servers/hogwarts.jpg',
    theme: 'from-amber-950 via-rose-950/70 to-slate-950',
  },
  {
    id: 'server3',
    name: 'Soon',
    tagline: 'เซิฟใหม่ เปิดให้ใช้งานเร็วๆ นี้',
    bgImage: '/assets/servers/server3.jpg',
    theme: 'from-emerald-950 via-teal-900/70 to-slate-950',
    comingSoon: true,
  },
];

export const getServerById = (id) => SERVERS.find((s) => s.id === id);
