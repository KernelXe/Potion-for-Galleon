// สคริปต์นี้ใช้ครั้งเดียว เพื่อคัดลอกข้อมูลเก่าจาก data/appData (โครงสร้างเดิมก่อนมีระบบหลายเซิฟ)
// ไปไว้ที่ data/mooncraft (โครงสร้างใหม่ที่แยกข้อมูลตามเซิฟ)
//
// วิธีใช้:
// 1. ไปที่ Firebase Console -> รูปเฟือง (Project settings) -> แท็บ "Service accounts"
// 2. กด "Generate new private key" -> จะได้ไฟล์ .json ดาวน์โหลดมา
// 3. เปลี่ยนชื่อไฟล์นั้นเป็น serviceAccountKey.json แล้ววางไว้ที่โฟลเดอร์หลักของโปรเจกต์
//    (ไฟล์นี้ห้าม commit ขึ้น GitHub เด็ดขาด อยู่ใน .gitignore ให้แล้ว)
// 4. เปิด Terminal ที่โฟลเดอร์โปรเจกต์ รันคำสั่ง:
//      npm install --no-save firebase-admin
//      node scripts/migrate-appdata-to-mooncraft.mjs
// 5. เสร็จแล้วลบไฟล์ serviceAccountKey.json ทิ้งได้เลย (ใช้ครั้งเดียว ไม่ต้องเก็บไว้)

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const keyPath = path.join(__dirname, '..', 'serviceAccountKey.json');

let serviceAccount;
try {
  serviceAccount = JSON.parse(readFileSync(keyPath, 'utf-8'));
} catch (err) {
  console.error('อ่านไฟล์ serviceAccountKey.json ไม่ได้ — ตรวจสอบว่าวางไฟล์ไว้ที่โฟลเดอร์หลักของโปรเจกต์แล้วหรือยัง');
  console.error(err.message);
  process.exit(1);
}

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const SOURCE_DOC = 'appData';
const TARGET_DOC = 'mooncraft';

const run = async () => {
  const sourceRef = db.collection('data').doc(SOURCE_DOC);
  const targetRef = db.collection('data').doc(TARGET_DOC);

  const sourceSnap = await sourceRef.get();
  if (!sourceSnap.exists) {
    console.error(`ไม่พบข้อมูลที่ data/${SOURCE_DOC} เลย — ไม่มีอะไรให้ย้าย`);
    process.exit(1);
  }

  const targetSnap = await targetRef.get();
  if (targetSnap.exists) {
    console.warn(`คำเตือน: data/${TARGET_DOC} มีข้อมูลอยู่แล้ว (จากค่า default ตอนสร้างเซิฟใหม่) จะถูกเขียนทับด้วยข้อมูลเก่าจาก appData`);
  }

  const data = sourceSnap.data();
  await targetRef.set(data);

  console.log(`คัดลอกข้อมูลจาก data/${SOURCE_DOC} ไปยัง data/${TARGET_DOC} สำเร็จ`);
  console.log(`- วัตถุดิบ: ${data.ingredients?.length ?? 0} รายการ`);
  console.log(`- สูตรยา: ${data.potions?.length ?? 0} รายการ`);
  console.log(`- หมวดหมู่: ${data.categories?.length ?? 0} รายการ`);
};

run().catch((err) => {
  console.error('เกิดข้อผิดพลาดระหว่างย้ายข้อมูล:', err);
  process.exit(1);
});
