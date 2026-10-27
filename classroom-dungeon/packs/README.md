# ชุดคำถามของ Classroom Dungeon

ชุดพร้อมเล่นปัจจุบัน: **สมการการเคลื่อนที่** (motion-equations) — คิดเลข → แก้สมการ → สมการการเคลื่อนที่ 5 สูตร

หน้าเตรียมห้องมีช่องเลือกชุด; รายการมาจากชุดที่ลงทะเบียนจริง ไม่ใช้รายการจำลอง เวลาในรายละเอียดคือเวลาทำโจทย์รวม ไม่รวมการตรวจ/อธิบาย/บทนำ

## เพิ่มชุดใหม่

1. คัดลอก new-pack.example.js เป็นไฟล์ชื่อชุด เช่น energy.js
2. แก้ id ให้ไม่ซ้ำ, title, description และ revision
3. แก้ lore (จำนวนฉากอิสระ), rooms (จำนวนห้อง/ข้ออิสระ), summary และ finalChance
4. เพิ่ม script ของไฟล์ใหม่ใน index.html หลัง packs/motion-equations.js และก่อน campaign.js
5. ทดสอบแล้ว deploy รายการใหม่จะปรากฏในช่องเลือกโดยไม่ต้องแก้โค้ดรายชื่อชุด

ตัวอย่างไม่ได้ถูกโหลดในหน้าใช้งานจริง เป็นตัวอย่างที่รันทดสอบได้เท่านั้น ยังไม่มีหน้าฟอร์มสร้าง/แก้ชุด, import JSON หรือการเก็บชุดบน server

## ข้อมูลที่แก้ได้

| ส่วน | ความหมาย |
| --- | --- |
| schemaVersion | ใช้ 1 |
| id | a-z, 0-9 และขีดกลาง เช่น energy-work |
| revision | เปลี่ยนเมื่อเผยแพร่เนื้อหารุ่นใหม่ เช่น 2026-11-01.1 |
| title / description | ชื่อชุดและคำอธิบายในหน้าเลือก |
| lore | รายการ [ชื่อฉาก, เรื่องเล่า] อย่างน้อย 1 ฉาก |
| rooms | ห้องตามลำดับ อย่างน้อย 1 ห้อง |
| bossStartRoom | index เริ่มนับ 0 ของห้องแรกที่ส่งพลังเข้าบอส |
| rewardAfterRoom | index ห้องที่ผ่านแล้วได้ผลึกเวลา |
| summary | สิ่งที่เรียนรู้/สูตร สำหรับรายงานของชุดนี้ |
| variableGuide | คำอธิบายตัวแปร ถ้ามี |
| foundationRooms | จำนวนห้องก่อนเริ่มแสดง variableGuide |
| finalChance | given, ask, answer, seconds, diagram ของโจทย์ท้ายเกม |

### ห้องและโจทย์

ห้องมี title, kind, story, goal, randomSeat, steps และ mechanic (ข้อความกติกา ถ้ามี)

- randomSeat: true = สุ่มจากสมาชิกทุกคนต่อข้อ; false = สุ่มภายใน Role ของข้อนั้น
- แต่ละ step ใช้ชื่อฟิลด์ชัดเจน: given (ข้อมูล), ask (คำถาม), answer (เฉลย), instruction (วิธีส่งงาน), role, seconds, diagram
- role = 0 Solver, 1 Equation, 2 Calculator, 3 Checker; ใช้ได้ทุกจำนวนข้อ ไม่บังคับครบ 4 ขั้นต่อห้อง
- seconds = 20–1800 วินาที; silentSeconds (ถ้ามี) ต้องน้อยกว่าเวลาข้อ ครูเปิดให้ทีมช่วยหลังครบช่วงนี้
- ปรับตัวเลขใน given แล้วต้องตรวจ answer และ diagram ให้ตรงกัน ระบบตรวจรูปแบบข้อมูลได้ แต่ไม่ได้พิสูจน์เฉลยคณิตศาสตร์

### ภาพประกอบที่ใช้กับชุดใหม่

- cards: { kind: 'cards', items: ['ข้อมูล 1', 'ข้อมูล 2'], caption: 'คำอธิบาย' }
- balance: { kind: 'balance', left: 'x + 2', right: '5', caption: 'สมการ' }
- motion: { kind: 'motion', start: 'u = 0 m/s', end: 'v = ?', detail: 'a = 2 m/s², t = 4 s', target: 'หา v', caption: 'ขวาเป็นบวก · ไม่ตามมาตราส่วน' }

ตัว renderer เปลี่ยนข้อมูลเหล่านี้เป็น SVG และ escape ข้อความ ไม่รับ raw HTML/SVG จากชุดใหม่ ควรใช้ข้อความภาพสั้นเพื่อให้อ่านได้บน TV; ทดสอบหน้าจอเมื่อเพิ่มโจทย์ยาว

ชุดการเคลื่อนที่เดิมใช้ motion-classic สำหรับภาพเฉพาะห้อง ซึ่งยังอยู่ใน campaign.js เพื่อรักษาภาพ/ความเข้ากันได้ของ session เดิม ถ้าต้องการชนิดภาพใหม่ ต้องเพิ่ม renderer; ไม่ใช่เพียงแก้ข้อมูล

## การแก้ชุดปัจจุบัน

ข้อมูลทั้งหมดอยู่ที่ packs/motion-equations.js บรรทัด setQuestion(...) คือโจทย์จริง 22 ช่วง ส่วนต้นไฟล์รักษาข้อมูล v2/v3 เดิมไว้ อย่าแก้ข้อมูลเก่าโดยไม่ตั้งใจ เวลา/Role/รูปแบบห้องตั้งค่าท้ายไฟล์

## Session และการแก้ข้อมูลในอนาคต

Session ใหม่เป็น campaign v5 เก็บ packId, packRevision และสำเนาข้อมูลชุดไว้ใน autosave/JSON backup การเปลี่ยนไฟล์ต้นฉบับหรือเพิ่มชุดไม่เปลี่ยนโจทย์กลางคาบ; เริ่มห้องใหม่เพื่อใช้ revision ใหม่ Undo และ refresh ยังคงชุดเดิม ช่องเลือกใช้ได้ก่อน Begin เท่านั้น

v2/v3/v4 ที่มีอยู่ยังเล่นต่อได้: v2/v3 ใช้ชุดเดิม; v4 ไม่มี snapshot จึงอ่านชุดการเคลื่อนที่ปัจจุบันตามพฤติกรรมเดิม การรับประกันสำเนาเนื้อหาเริ่มที่ v5

บอสคิดความคืบหน้าตามจำนวนขั้นในห้องบอสจริง ไม่ผูกกับ 8 ขั้นเดิม ภาพ/ฉากเกมและคะแนนยังเป็นธีมหอดูดาวอัสตรา ใช้ 4 Role เดิม เปลี่ยนเฉพาะชุดความรู้; การเปลี่ยนระบบต่อสู้/ธีมใหม่เป็นงานแยก

## ทดสอบ

node --test tests/question-packs.test.cjs tests/dungeon.test.cjs

Browser: tests/question-packs-browser.cjs, tests/campaign-browser.cjs, tests/dungeon-preparation.cjs, tests/campaign-task-layout.cjs ต้องมี playwright (หรือ PLAYWRIGHT_MODULE) และ Chrome
