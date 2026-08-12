# Random Fighter — MVP Development Design Document
**Status:** Development Source of Truth  
**Version:** 1.0  
**Date:** 2026-08-12  
**Basis:** พัฒนาต่อยอดจากต้นแบบ `battle-royale.html` และข้อสรุปจากการออกแบบร่วมกัน

---

## 1. Purpose of This Document

เอกสารนี้เป็น **แกนกลางสำหรับการพัฒนา Random Fighter MVP** เพื่อป้องกัน requirement เคลื่อนระหว่างการพัฒนา

หลักการใช้งานเอกสารนี้:

- สิ่งที่ระบุว่า **LOCKED** ให้ถือเป็นข้อกำหนดหลักของ MVP
- ห้ามเปลี่ยนพฤติกรรมหลักเพียงเพราะการ implementation แบบอื่นง่ายกว่า
- สิ่งที่ระบุว่า **DEFERRED** ยังไม่ออกแบบรายละเอียด และต้องกลับมาคุยก่อนลงมือ
- หากพบข้อจำกัดทางเทคนิค ให้ปรับวิธี implementation ก่อนปรับประสบการณ์ที่ตกลงไว้
- เป้าหมายของ V1 คือพิสูจน์ว่า Random Fighter สามารถเป็น **mini fighting game สำหรับสุ่มนักเรียนในชั้นเรียน** ที่สนุกพอให้เด็กดูและเร็วพอให้ครูใช้ซ้ำได้

---

# 2. Product Positioning

## 2.1 Core Idea — LOCKED

Random Fighter คือ:

> **Mini fighting game used for random student selection**

ไม่ใช่เพียง random-name utility ที่ใส่ animation และไม่ใช่ fighting game เต็มรูปแบบที่ผู้เล่นควบคุมเอง

ประสบการณ์ที่ต้องการคือ:

> นักเรียนทั้งห้องเห็นรายชื่อ → ระบบสุ่มผู้ท้าชิง 2 คน → ครูเลือกอาชีพ → VS → ตัวละครต่อสู้อัตโนมัติแบบ 2D Fighting Game → หมดเวลา → ผู้แพ้ถูกเลือกให้ทำโจทย์

เกมต้องสร้างความรู้สึกว่า:

- ใครจะถูกสุ่มออกมา?
- อาชีพไหนจะได้ลงสนาม?
- ตอนนี้ใครกำลังได้เปรียบ?
- จะมีการพลิกกลับหรือไม่?
- สุดท้ายใครจะแพ้และต้องตอบโจทย์?

---

# 3. Source Prototype

ระบบตั้งต้นคือ `battle-royale.html`

โครงหลักที่นำมาต่อยอด:

1. รายชื่อนักเรียนใน textarea
2. Random card draw
3. Reveal ผู้ถูกเลือก
4. Profession selection
5. Battle
6. Result
7. Play again

แนวคิดจากระบบเดิมที่ต้องรักษา:

- รายชื่อ 1 บรรทัด = 1 คน
- รองรับการแก้รายชื่อได้โดยตรง
- แยก logic การสุ่มออกจาก visual reveal
- ใช้ card flip เพื่อสร้าง suspense
- Single-page flow ไม่ reload ระหว่างขั้นตอน
- ผู้ที่ไม่ได้ถูกเลือกยังปรากฏอยู่บนหน้าสุ่ม แต่ถูก dim ลง
- เล่นรอบใหม่ได้โดยไม่ต้องกรอกรายชื่อใหม่

สิ่งสำคัญที่เปลี่ยนจากระบบเดิม:

> เดิม: นักเรียนทั้งหมด → สุ่ม 4 → เลือกอาชีพ → Auto Battle → Winner 1 คน

เปลี่ยนเป็น:

> นักเรียนทั้งหมด → **สุ่ม 2** → ครูเลือกอาชีพ → 20-second Fighting Game → **Loser 1 คน**

---

# 4. Core User Flow — LOCKED

```text
[Setup]
ใส่/แก้รายชื่อนักเรียน
        ↓
[Card Draw]
สุ่มนักเรียน 2 คน
เปิดไพ่ทีละคนแบบระบบเดิม
        ↓
[Character Select]
ครูเลือกอาชีพให้ Fighter A และ Fighter B
อาชีพห้ามซ้ำ
        ↓
[VS Screen]
ชื่อ + อาชีพ + presentation แบบ arcade
        ↓
[FIGHT!]
Auto Fighting 20 วินาที
        ↓
[TIME!]
หยุดการต่อสู้
        ↓
[Result]
คน HP น้อยกว่า = ผู้แพ้
แสดงชื่อผู้แพ้เพื่อให้ทำโจทย์
        ↓
[Next Round]
ทั้งสองคนกลับเข้าสู่ pool
สามารถถูกสุ่มซ้ำได้ทันที
```

---

# 5. Student Selection Rules — LOCKED

## 5.1 Input

- ใช้ textarea เหมือนระบบต้นแบบ
- 1 บรรทัด = 1 นักเรียน
- แก้ไขได้อิสระ
- MVP ยังไม่มี class database
- MVP ยังไม่มี login
- MVP ยังไม่มี saved roster
- MVP ยังไม่มี attendance system

## 5.2 Random Selection

แต่ละรอบสุ่มนักเรียน **2 คน**

- นักเรียนคนเดียวกันห้ามอยู่ทั้งสองฝั่งในรอบเดียวกัน
- เมื่อจบรอบ นักเรียนทั้งสองคนกลับเข้าสู่ pool ทันที
- นักเรียนสามารถถูกสุ่มซ้ำในรอบถัดไปได้
- MVP ยังไม่มี anti-repeat
- MVP ยังไม่มี fair rotation
- MVP ยังไม่มี weighted selection

## 5.3 Outcome Randomization

ทันทีที่นักเรียน 2 คนถูกเลือก:

> ระบบสุ่ม **ผู้แพ้** แบบ 50/50 และล็อกผลไว้ทันที

หลังจากนั้น:

- การเลือกอาชีพห้ามเปลี่ยนผล
- animation ห้ามเปลี่ยนผล
- Combat AI ห้ามเปลี่ยนผล
- Signature Move ห้ามเปลี่ยนผล
- Comeback Finisher ห้ามเปลี่ยนผล

หลักสำคัญ:

> **Outcome และ Performance ต้องแยกออกจากกัน**

### Outcome
ใครจะเป็นผู้แพ้จริง

### Performance
การต่อสู้ 20 วินาทีถูกเล่าออกมาอย่างไร

---

# 6. Profession System — LOCKED

MVP มี **4 อาชีพ**

1. 🥋 นักเตะตะกร้อสายฟ้า
2. 🌶️ แม่ค้าส้มตำมือเพชฌฆาต
3. 🎰 ป้าใบ้หวยสายมู
4. 📚 นักเรียนสายลืมการบ้าน

ตัดออกจาก MVP:

- หมอนวดแผนไทยสายเจ็บ
- นักแบดมือโปรประจำหมู่บ้าน

## 6.1 Character Selection

- ครูเป็นคนเลือกอาชีพ
- Character Select แสดงนักเรียน 2 ฝั่งบนหน้าจอเดียว
- Fighter A เลือกก่อนหรือเลือกฝั่งใดก่อนก็ได้
- เมื่ออาชีพหนึ่งถูกเลือกแล้ว อีกฝั่งเลือกอาชีพเดียวกันไม่ได้
- **ห้าม profession ซ้ำใน fight เดียว**

## 6.2 Profession Balance

อาชีพต่างกันใน:

- visual identity
- costume
- movement personality
- normal attack animation
- defensive animation
- Signature Move
- Comeback Finisher
- อาวุธ/props
- จังหวะและน้ำหนักของการเคลื่อนไหว

แต่อาชีพ **ต้องไม่สร้างความได้เปรียบทาง win rate**

เป้าหมาย:

> ทุก profession matchup ยังมีผลแพ้ชนะพื้นฐาน 50/50 ตาม Outcome ที่ล็อกไว้

---

# 7. Visual Direction — LOCKED

## 7.1 Overall Style

อารมณ์:

> **Classic arcade fighting game / Street Fighter-era presentation**

องค์ประกอบหลัก:

- Fighter A ซ้าย
- Fighter B ขวา
- HP bar ด้านบน
- ชื่อนักเรียนอยู่ด้านบนตลอด
- Timer ตรงกลาง
- VS Screen ก่อนสู้
- FIGHT! ก่อนเริ่ม
- TIME! เมื่อครบเวลา
- victory pose
- loser animation
- retro fighting presentation

## 7.2 Display Target

Primary display:

> **TV / Projector 16:9**

ออกแบบให้เหมาะกับ:

- 1920×1080
- ดูจากท้ายห้อง
- ตัวละครใหญ่
- HP อ่านง่าย
- ชื่อนักเรียนเด่น
- ไม่ใส่ข้อมูล HUD มากเกินไป

Setup screen ต้องยังใช้บน:

- notebook
- tablet/iPad

Mobile:

- ใช้งานได้
- แต่ไม่ใช่ first-class visual target ของ battle scene

## 7.3 Arena

MVP มี:

> **1 Arena**

ยังไม่ทำหลายฉาก

---

# 8. Fighter Rendering Architecture — LOCKED

Battle renderer ใช้:

> **HTML + CSS + Vanilla JavaScript + Canvas 2D**

ไม่ใช้:

- React
- Phaser
- Unity
- Spine
- Blender
- external physics engine

ใน MVP

## 8.1 Responsibilities

### HTML/CSS

ใช้สำหรับ:

- Setup
- Card Draw
- Character Select
- VS
- HUD
- HP bars
- Timer
- Result
- transitions

### Canvas 2D

ใช้สำหรับ:

- arena
- stickman fighter
- costume
- weapons
- attack animations
- dodge/block/counter
- knockdown/get-up
- particles
- impact FX
- blood particles

### JavaScript

ใช้สำหรับ:

- random selection
- locked outcome
- game loop
- fighter state
- combat plan
- animation interpolation
- hit detection
- HP
- timer
- effects
- result

---

# 9. Stickman Design — LOCKED

Character style:

> **2D articulated stickman ที่มีเครื่องแต่งกายและ silhouette ของแต่ละอาชีพชัดเจน**

ไม่ใช่เส้นก้างปลาธรรมดา

ต้องสามารถแยก profession ได้จากตัวละครบนสนาม

Skeleton concept:

```text
Head
Neck
Torso
Left / Right Shoulder
Left / Right Elbow
Left / Right Hand
Hip
Left / Right Knee
Left / Right Foot
```

Animation ใช้:

- key poses
- joint angles / positions
- interpolation
- state machine

ไม่ใช้ sprite frame-by-frame เป็นฐานหลักของ MVP

## 9.1 Shared Animation States

อย่างน้อยต้องรองรับ:

```text
idle
attack_light
attack_heavy
block
dodge_lean
dodge_crouch
dodge_jump
counter
hit
knockdown
getup
signature
comeback_finisher
victory
lose
```

แต่ละ profession สามารถ override animation state บางตัวได้

---

# 10. Fighter Positioning — LOCKED

MVP ใช้ movement เฉพาะแกน X

- Fighter A อยู่ฝั่งซ้าย
- Fighter B อยู่ฝั่งขวา
- ไม่สลับฝั่งกัน
- ไม่เดินผ่านกัน
- ไม่กระโดดข้ามหัวกัน

ตัวละครสามารถขยับเข้าหากันในระยะโจมตีตาม animation ได้

เป้าหมายคือ:

> animation ต้องดูเหมือนโจมตีโดนตัวจริง

ไม่ใช่ยืนห่างแล้ว HP ลดเอง

---

# 11. Combat Duration — LOCKED

Fight duration:

> **20 seconds fixed**

Timer นับถอยหลังจนถึง 0

Fight มีผลลัพธ์ 2 แบบ:

- ประมาณ 70% จบด้วย KO หลังวินาทีที่ 10 และก่อนวินาทีที่ 20
- ประมาณ 30% ต่อสู้ครบ 20 วินาทีแล้วตัดสินด้วย HP เมื่อ TIME

เฉพาะผู้แพ้ที่ล็อกไว้ตั้งแต่ต้นรอบเท่านั้นที่ HP ลงถึง 0 ได้ ผู้ชนะต้องมี HP มากกว่า 0 เสมอ

---

# 12. HP System — LOCKED

- Fighter เริ่ม HP เท่ากัน
- แนวคิดฐาน: 100 HP
- UI แสดง **เฉพาะหลอด HP**
- ไม่แสดงเลข HP ให้ผู้ชมเห็น
- HP ภายในระบบเป็นค่าจริง
- Damage ต้องเกิดจาก combat event จริง
- เมื่อ animation โจมตีโดนจึงลด HP

เมื่อ timer = 0 ในรอบที่ไม่ KO:

> Fighter ที่ HP ต่ำกว่า = ผู้แพ้

ระบบต้องรับประกัน:

- ไม่มี tie
- ผู้แพ้ที่ล็อกไว้ต้องมี HP ต่ำกว่า
- ผู้ชนะ HP มากกว่า 0 เสมอ
- รอบ KO ต้องเกิดหลัง 10 วินาทีและก่อน 20 วินาที
- รอบ TIME ทั้งสองฝ่ายต้องมี HP มากกว่า 0

---

# 13. Combat Pace — LOCKED

ใน 20 วินาที:

> ประมาณ **10–16 attack attempts**

ไม่ต้องตีกันถี่แบบ machine gun

เป้าหมายคือให้มีจังหวะ:

```text
โจมตี
หลบ
สวน
แลกหมัด
พักจังหวะ
โจมตีหนัก
ล้ม
ลุก
พลิกกลับ
closing exchange
```

รูปเกมต้องรู้สึกมี story ไม่ใช่ animation สุ่มต่อกัน

---

# 14. Defensive Mechanics — LOCKED

ระบบต้องรองรับทั้งหมด:

## Block

- รับการโจมตี
- เสีย HP เล็กน้อยแบบ chip damage
- animation ต้องเห็นว่า guard รับแรง

## Lean Dodge

- โยกตัวหลบ
- Damage = 0

## Crouch Dodge

- ก้มหลบ
- Damage = 0

## Jump Dodge

- กระโดดหลบ
- Damage = 0

## Counter

- หลบหรือ block แล้วโจมตีสวน
- เป็น exchange ต่อเนื่อง ไม่ใช่ event แยกขาดจากกัน

---

# 15. Knockdown System — LOCKED

Fighter สามารถ:

> โดนโจมตีหนัก → กระเด็น/ล้ม → อยู่พื้นสั้น ๆ → ลุกขึ้นแบบมี animation → กลับ idle

ต้องมี get-up animation ที่ดูดี

Knockdown:

- ไม่เท่ากับแพ้
- ไม่จบ fight
- เป็นส่วนของ choreography
- ควรเกิดเพียงบางครั้งเพื่อเพิ่ม impact

---

# 16. Hit Detection — LOCKED

MVP ไม่ต้องใช้ physics engine เต็มรูปแบบ

ใช้:

- fighter body hitbox
- attack hitbox
- active hit frames

เมื่อ:

> attack hitbox ตัดกับ opponent body hitbox ใน active frame

จึงเกิด:

- hit reaction
- damage
- HP reduction
- particles
- blood FX
- knockback / knockdown ตามประเภทท่า

หลักสำคัญ:

> ภาพที่ผู้ชมเห็นต้องสัมพันธ์กับ logic ที่เกิดขึ้น

---

# 17. Violence / Effects — LOCKED

Tone:

> cartoon / slapstick fighting

อนุญาต:

- ต่อย
- เตะ
- ใช้อาวุธประจำอาชีพ
- ฟาด
- กระเด็น
- ล้ม
- impact effects
- blood particle เล็กน้อย

ไม่เน้น:

- gore
- บาดแผลละเอียด
- realistic injury

Blood FX:

> **ON by default**

บริบทการใช้งานหลักเป็นนักเรียนโต

MVP ยังไม่จำเป็นต้องมี toggle แต่ architecture ไม่ควรทำให้เพิ่ม toggle ภายหลังยาก

---

# 18. Combat Director — CORE SYSTEM

Combat Director คือระบบสำคัญที่สุดรองจาก animation foundation

หน้าที่:

1. รับ Fighter A / Fighter B
2. รับ locked loser
3. สร้าง fight plan 20 วินาที
4. วาง 10–16 exchanges
5. ตัดสินผลของแต่ละ exchange
6. กระจาย hit/block/dodge/counter/knockdown
7. จัดจังหวะ HP ให้สูสีและพลิกไปมา
8. ใส่ Signature / Comeback ตามสถานการณ์
9. ป้องกัน HP = 0 ก่อนเวลา
10. รับประกันไม่มี tie
11. รับประกัน locked loser แพ้ตอน timer = 0

---

# 19. Fight Narrative — LOCKED

Combat Director ต้องพยายามสร้าง fight ที่:

- มีการผลัดกันนำ
- ไม่รู้ผลตั้งแต่ต้น
- loser ไม่ถูกกระหน่ำฝ่ายเดียว
- winner สามารถตกเป็นรองในบางช่วงได้
- loser สามารถกลับมานำได้
- ช่วงท้ายยังลุ้นได้
- result ดูสมเหตุสมผลเมื่อ timer หมด

ตัวอย่าง narrative ที่ต้องเกิดได้:

```text
Early:
A นำเล็กน้อย

Mid:
B counter และพลิกนำ

Late:
A ใช้ Signature ไล่กลับมา

Final seconds:
B ใช้ Comeback แต่ไม่พอ

TIME:
A 37 HP
B 31 HP

B แพ้
```

แต่ไม่ควรเกิด pattern แบบเดียวทุก fight

---

# 20. Signature Move — LOCKED

ทุก profession ต้องมี:

> **Signature Move**

คุณสมบัติ:

- เป็นท่าประจำอาชีพ
- impact สูงกว่าท่าปกติ
- animation เด่น
- สามารถเกิดระหว่าง fight
- ไม่จำเป็นต้องเกิดทุก fight
- ไม่ควรเป็นการรับประกันผลแพ้ชนะ

---

# 21. Comeback Finisher — LOCKED

ทุก profession ต้องมี:

> **Comeback Finisher**

เป็นระบบแยกจาก Signature Move

หน้าที่:

- ใช้สร้างความรู้สึกพลิกเกม
- มักเหมาะกับช่วงท้าย
- สามารถทำ damage สูง
- คนที่ตามมีโอกาสกลับมาใกล้หรือแซง
- ไม่จำเป็นต้องทำให้คนตามชนะเสมอ
- ไม่เกิดทุก fight
- Combat Director เป็นผู้ตัดสินใจใช้

สามารถมี:

- successful comeback
- failed comeback
- fake comeback

เพื่อไม่ให้เด็กจับ pattern ได้ง่าย

---

# 22. Profession Animation Detail — DEFERRED

รายละเอียดชุดท่าของแต่ละ profession ยัง **ไม่ล็อกสุดท้าย**

ต้องกลับมาคุยก่อนพัฒนา Phase Profession Animation

กรอบเบื้องต้นที่ตกลงไว้:

## นักเตะตะกร้อสายฟ้า

Identity:
- เร็ว
- คล่องตัว
- ใช้ขาเด่น
- ลูกตะกร้อเป็น prop สำคัญ

Candidate:
- low kick
- sepak kick
- bicycle kick
- lightning sepak signature
- Thunder Sepak Smash comeback

## แม่ค้าส้มตำมือเพชฌฆาต

Identity:
- heavy brawler
- ตลก
- impact สูง
- ใช้สาก/ครก

Candidate:
- pestle strike
- mortar attack
- chili/lime projectile
- สาก uppercut
- ส้มตำเดือดระดับนรก comeback

## ป้าใบ้หวยสายมู

Identity:
- weird / magic comedy
- props สายมู
- attack animation ผิดธรรมดา

Candidate:
- เซียมซี
- ยันต์
- พัด/สมุดหวย
- เลขยักษ์
- เลขเด็ด 3 ตัว finisher

## นักเรียนสายลืมการบ้าน

Identity:
- slapstick
- เอาตัวรอดแบบงง ๆ
- school props

Candidate:
- ปาสมุด
- กระเป๋าฟาด
- วิ่งชน
- หนังสือ barrage
- ครูโผล่แล้ววิ่งหนีชนคู่ต่อสู้ comeback

**หมายเหตุ:** รายละเอียดทั้งหมดใน Section 22 เป็น direction เท่านั้น ยังต้องออกแบบ animation set อีกครั้งก่อน implementation เต็มรูปแบบ

---

# 23. VS Presentation — LOCKED

หลังเลือกอาชีพ:

แสดงหน้าจอ VS ประมาณ 1.5–2 วินาที

ตัวอย่าง:

```text
ปอร์โต้
นักเตะตะกร้อสายฟ้า

VS

แพรว
แม่ค้าส้มตำมือเพชฌฆาต
```

จากนั้น:

> FIGHT!

แล้วเริ่ม timer

---

# 24. End-of-Fight Presentation — LOCKED

การจบไฟต์มี 2 แบบ:

1. `K.O.!` เกิดได้หลังวินาทีที่ 10 และก่อนครบ 20 วินาที โดยตั้งเป้าประมาณ 7 ใน 10 รอบ
2. `TIME!` เกิดเมื่อครบ 20 วินาทีและไม่มีใครถูกน็อก

เมื่อจบไฟต์:

1. หยุด combat loop และ timer ทันที
2. แสดง `K.O.!` หรือ `TIME!` ตามผลจริง
3. Winner ทำ victory pose
4. Loser ล้ม / เซ / คุกเข่า / lose animation
5. แสดงชื่อผู้ชนะและผู้แพ้เด่น โดยผู้แพ้เป็นคนตอบโจทย์

ข้อความแนวทาง:

> **[ชื่อผู้แพ้] แพ้!**  
> **ถึงเวลาตอบโจทย์**

หากจบด้วย `TIME!` Fighter ทั้งคู่ต้องยังมี HP เหลือ และผู้แพ้ที่ล็อกไว้ต้องมี HP ต่ำกว่าโดยห้ามเสมอ

---

# 25. Audio — OUT OF MVP

MVP:

> **ไม่มี sound**

ยังไม่ทำ:

- hit sound
- announcer
- FIGHT voice
- TIME voice
- music
- crowd
- victory sound

ระบบควรเขียนให้สามารถเพิ่ม audio layer ภายหลังได้

---

# 26. Technical Architecture

## 26.1 Technology Stack — LOCKED

```text
Vanilla HTML
CSS
JavaScript
Canvas 2D
requestAnimationFrame()
```

ยังสามารถ deploy เป็น static web app ได้

สามารถคงแนวทางไฟล์เดียวในช่วงต้น:

```text
random-fighter.html
```

เมื่อ code โตขึ้นสามารถแยก module ภายหลังได้โดยไม่เปลี่ยน game design

---

# 27. Proposed Internal Modules

แม้อยู่ใน HTML เดียว ควรแยก responsibility ใน JavaScript ชัดเจน

```text
StudentPool
RandomSelector
OutcomeDirector

CardDrawController
CharacterSelectController
GameFlowController

Fighter
ProfessionDefinition
AnimationController
PoseLibrary

CombatDirector
CombatExchange
HitDetection
DamageSystem

ParticleSystem
BloodFX

BattleRenderer
HUDController
ResultController
```

---

# 28. Game Loop

Battle ใช้:

```text
requestAnimationFrame()
```

conceptual loop:

```text
read elapsed time
        ↓
update Combat Director / current exchange
        ↓
update Fighter states
        ↓
interpolate animation pose
        ↓
update hitboxes
        ↓
resolve collision
        ↓
apply damage / effects
        ↓
update HP / timer
        ↓
draw arena
        ↓
draw Fighter A
        ↓
draw Fighter B
        ↓
draw particles / blood
        ↓
next frame
```

เป้าหมาย:

> ~60 FPS บน notebook ทั่วไปที่ต่อ TV/Projector

---

# 29. Development Phases

---

## Phase 0 — Freeze Spec & Refactor Base

### Objective

สร้างโครง game flow ใหม่บนฐานระบบเดิม โดยยังไม่ต้องมี combat จริง

### Work

- นำ `battle-royale.html` มาเป็น reference
- เปลี่ยน finalist 4 → 2
- คง textarea
- คง card draw
- reveal 2 คน
- ปรับ Character Select เป็น 2 ฝั่ง
- 4 professions
- profession ห้ามซ้ำ
- สร้าง VS screen
- สร้าง battle screen placeholder
- สร้าง HUD placeholder
- สร้าง result screen สำหรับ loser
- next round กลับ pool

### Exit Criteria

สามารถเล่น flow:

> Setup → Draw 2 → Select → VS → Placeholder Fight → Loser Result → Next Round

ได้ครบโดยไม่ reload

---

## Phase 1 — Stickman Animation Foundation

### Objective

พิสูจน์ว่าตัวละคร procedural Canvas สามารถดูเป็น fighting game ได้จริง

### Work

สร้าง:

- skeleton
- joints
- pose representation
- interpolation
- facing left/right
- idle
- hit
- block
- lean dodge
- crouch dodge
- jump dodge
- knockdown
- get-up
- victory
- lose

### Priority

นี่คือหนึ่งใน phase ที่เสี่ยงที่สุด

ห้ามรีบสร้าง 4 professions ก่อน foundation ดูดี

### Exit Criteria

stickman 2 ตัวบน arena:

- idle ดูมีชีวิต
- movement มีน้ำหนัก
- block อ่านออก
- dodge อ่านออก
- hit reaction สมเหตุสมผล
- knockdown ดูดี
- get-up ดูดี
- ไม่ดูเหมือนก้างปลาขยับแขนขา

---

## Phase 2 — Combat Engine

### Objective

ทำให้สิ่งที่เห็นบน Canvas เป็น combat จริง

### Work

- Fighter state
- HP
- body hitbox
- attack hitbox
- active frames
- recovery frames
- damage
- chip damage
- hit reaction
- dodge = miss
- block
- counter
- knockdown
- blood particle
- impact FX
- timer 20 sec

### Exit Criteria

รัน generic fighter 2 ตัว 20 วินาทีได้

และ:

> ทุก HP reduction ที่เห็นต้องสัมพันธ์กับ animation ที่โดนจริง

---

## Phase 3 — Combat Director

### Objective

สร้าง fight ที่ดูเป็นธรรมชาติ แต่รักษาผลสุ่ม 50/50

### Work

- lock loser
- generate 10–16 exchanges
- control HP trajectory
- alternate advantage
- choose hit/block/dodge/counter
- insert knockdown
- protect HP floor
- no early death
- no tie
- guaranteed locked loser
- fight pacing
- randomized narrative templates

### Exit Criteria

ทดสอบหลายสิบไฟต์แล้ว:

- outcome ถูกต้องทุกครั้ง
- ไม่มี tie
- ไม่มี early death
- fight ไม่เหมือนกันทุกครั้ง
- ไม่รู้ winner/loser ง่ายตั้งแต่ต้น
- HP มีจังหวะพลิก
- ดูสนุกโดยยังไม่ต้องมี profession content เต็ม

---

## Phase 4 — Profession Vertical Slice

### Objective

พิสูจน์ระบบ profession-specific animation

เริ่มเพียง 2 อาชีพที่ต่างกันมาก:

> นักเตะตะกร้อสายฟ้า  
> vs  
> แม่ค้าส้มตำมือเพชฌฆาต

### Work

แต่ละตัวสร้าง:

- costume
- silhouette
- idle personality
- normal attacks
- defensive personality
- prop/weapon
- Signature Move
- Comeback Finisher
- hit reaction tuning
- victory pose

### Exit Criteria

ถอดชื่อออกจาก HUD แล้วผู้ชมยังพอเดาได้ว่า:

> ใครคือนักตะกร้อ  
> ใครคือแม่ค้าส้มตำ

และ animation architecture รองรับ character style ที่ต่างกันได้จริง

---

## Phase 5 — Complete Four Professions

### Objective

เติม profession content ให้ครบ MVP

เพิ่ม:

- ป้าใบ้หวยสายมู
- นักเรียนสายลืมการบ้าน

### Work

- animation set
- costume
- props
- attacks
- defense
- signature
- comeback
- victory/lose personality
- matchup testing

### Approved Moveset Direction

ป้าใบ้หวยสายมู:

- silhouette: ผมมวย แว่น เสื้อดอก ผ้าพาดไหล่
- persistent prop: สมุดหวยหรือพัดเลข
- light: ใบหวยปะหน้า
- heavy: เซียมซีพิฆาต
- signature: สามตัวตรง! — เลขสามตัวขนาดใหญ่ลอยพุ่งใส่คู่ต่อสู้
- comeback: เจ้าที่บอกเลข! — ยันต์และเลขหมุนสร้างแรงกระแทก

นักเรียนสายลืมการบ้าน:

- silhouette: เครื่องแบบนักเรียน กระเป๋าสะพาย และทรงผมนักเรียน
- persistent prop: กระเป๋านักเรียน
- light: สมุดบิน!
- heavy: กระเป๋าฟาด
- signature: การบ้านถล่ม! — หนังสือและกระดาษลอยถล่มคู่ต่อสู้
- comeback: ครูมาแล้ว! — ตกใจวิ่งหนีแล้วชนคู่ต่อสู้

Signature projectile เป็น presentation ที่ต้องอ่านออกชัด แต่ damage ยังต้องเกิดจาก active-frame contact event จริง

### Balance Principle

> combat style ต่าง แต่ expected win rate ห้ามต่าง

### Exit Criteria

ทุก matchup เล่นได้:

```text
Takraw vs Somtam
Takraw vs Mor
Takraw vs Student
Somtam vs Mor
Somtam vs Student
Mor vs Student
```

โดยไม่มี profession ใดดูได้เปรียบเชิงระบบ

---

## Phase 6 — Full Experience Polish & Classroom Test

### Objective

รวมทุกระบบเป็น experience ที่พร้อมใช้หน้าห้องจริง

### Work

- card reveal timing
- character select polish
- VS presentation
- FIGHT transition
- HUD polish
- retro visual identity
- HP readability
- timer readability
- TIME presentation
- loser result
- victory pose
- blood FX polish
- TV scaling
- projector testing
- performance
- repeated-round stability
- combat banter แบบสุ่มตามอาชีพและเหตุการณ์ attack / block / dodge / hit / knockdown
- banter cooldown, ไม่พูดซ้ำติดกัน และไม่บังชื่อท่า Signature / Comeback
- ปิด timer, speech bubble, projectile, particle และ state ค้างเมื่อเปลี่ยนรอบหรือกลับหน้า setup

### Exit Criteria

ครูสามารถใช้:

> Random → Fight → Loser → Next Round

ซ้ำหลายรอบในคาบเรียนได้โดยไม่ reload และไม่เกิด game state พัง

นักเรียนที่ท้ายห้องต้องสามารถมองออกว่า:

- ใครกำลังสู้
- ใคร HP มากกว่า
- เวลาเหลือเท่าไร
- ใครแพ้

---

# 30. MVP Definition of Done

Version 1 ถือว่าเสร็จเมื่อ flow นี้ทำงานสมบูรณ์:

```text
กรอกรายชื่อ
        ↓
สุ่ม 2 คน
        ↓
เปิดไพ่ reveal
        ↓
ครูเลือก 2 อาชีพที่ไม่ซ้ำ
        ↓
VS
        ↓
FIGHT!
        ↓
Stickman 2D auto fight สูงสุด 20 sec
        ↓
HP จริง
        ↓
Hit / Block / Dodge / Counter
        ↓
Knockdown / Get-up
        ↓
Signature / Comeback possibility
        ↓
K.O. หลัง 10 sec หรือ TIME เมื่อครบ 20 sec
        ↓
HP ต่ำกว่าแพ้
        ↓
แสดงชื่อผู้แพ้ให้ตอบโจทย์
        ↓
สุ่มรอบต่อไป
```

---

# 31. Explicitly Out of Scope for V1

ห้ามเพิ่มเข้ามาระหว่าง development หากยังไม่ได้ตัดสินใจใหม่:

- Sound
- Music
- Multiple arenas
- Login
- Database
- Class management
- Saved roster
- Attendance
- History
- Anti-repeat
- Fair rotation
- Weighted random
- Character stats affecting win rate
- Manual fighter control
- Multiplayer
- Online battle
- Full physics engine
- Complex Y-axis movement
- Side switching
- Game rounds
- KO before timer
- Random environmental events
- Original Battle Royale events
- Additional professions beyond 4

---

# 32. Key Development Risks

## Risk 1 — Stickman Movement Quality

เป็นความเสี่ยงอันดับหนึ่ง

ต่อให้ระบบสุ่มและ combat logic ดี หากตัวละคร:

- แข็ง
- ไม่มีน้ำหนัก
- แขนขาแปลก
- impact ไม่ชัด

เกมจะไม่รู้สึกเป็น Fighting Game

### Mitigation

พิสูจน์ Phase 1 ก่อนสร้าง profession content จำนวนมาก

---

## Risk 2 — Combat Director Feels Scripted

เพราะ outcome ถูกล็อกล่วงหน้า

หาก choreography ซ้ำ:

> เด็กจะเริ่มจับได้ว่าใครแพ้

### Mitigation

- HP trajectory หลายแบบ
- exchange templates หลายแบบ
- successful / failed comeback
- random defense
- random knockdown timing
- signature ไม่เกิดทุก fight

---

## Risk 3 — Animation Work Explosion

4 professions × หลายท่าอาจสร้าง workload สูง

### Mitigation

ใช้:

- shared skeleton
- shared core states
- profession override
- procedural pose animation
- reusable defensive animation
- Vertical Slice ก่อนทำครบ 4 ตัว

---

# 33. Development Principle

ห้ามเริ่มจาก:

> ทำท่าทั้ง 4 อาชีพให้ครบ

ก่อน engine ผ่าน

ลำดับความสำคัญที่ถูกต้อง:

```text
Movement Quality
      ↓
Combat Foundation
      ↓
Combat Director
      ↓
Profession Identity
      ↓
Content Expansion
      ↓
Polish
```

---

# 34. First Major Milestone

Milestone สำคัญที่สุดหลัง Phase 0:

> **Vertical Combat Prototype**

ยังไม่ต้องมีระบบเต็มทั้งหมด

ต้องมี:

- 2 generic stickmen
- 1 arena
- HP bars
- timer 20 sec
- hit
- block
- dodge
- counter
- knockdown
- get-up
- locked loser
- Combat Director
- TIME result

หาก generic fight นี้ **ดูสนุกและลุ้นได้โดยไม่ต้องพึ่ง costume** แสดงว่า foundation แข็งแรงพอสำหรับขยายไป 4 professions

หาก generic fight ยังไม่สนุก:

> ห้ามแก้ปัญหาด้วยการเพิ่ม content หรือเพิ่ม profession

ให้กลับไปปรับ movement/combat ก่อน

---

# 35. Decisions Reserved for Later

หัวข้อต่อไปนี้ยังต้องกลับมาคุยก่อน implement:

1. Detailed moveset ของแต่ละ profession
2. จำนวน normal attacks ต่อ profession
3. Damage profile ของแต่ละ animation
4. Signature Move animation เต็ม
5. Comeback Finisher animation เต็ม
6. Costume รายละเอียด
7. props ใดติดตัวตลอด / props ใด spawn ตอนใช้ท่า
8. arena artwork รายละเอียด
9. exact visual theme / fonts / palette
10. จำนวน combat narrative templates
11. exact HP floor ก่อนช่วงท้าย
12. exact damage ranges
13. blood particle intensity
14. future audio design

---

# 36. Source-of-Truth Summary

Random Fighter MVP ต้องรักษาหลักต่อไปนี้เสมอ:

> **สุ่มนักเรียน 2 คนอย่างยุติธรรม → ล็อกผู้แพ้ 50/50 → ครูเลือกอาชีพที่ไม่ซ้ำ → ตัวละคร Stickman 2D สู้กันจริง → HP ลดจาก hit จริง → fight มี block/dodge/counter/knockdown และการพลิกนำ → ประมาณ 70% จบ KO หลัง 10 วินาทีและก่อน 20 วินาที อีกประมาณ 30% จบเมื่อ TIME → ไม่มี tie → ผู้แพ้ต้องตรงกับ locked outcome → แสดงชื่อผู้แพ้ให้ตอบโจทย์**

หัวใจของ product ไม่ใช่ simulation ที่แม่นยำที่สุด

หัวใจคือ:

> **เด็กต้องรู้สึกว่ากำลังดูเกม Fighting ที่ลุ้นจริง  
> ขณะที่ครูยังได้ระบบสุ่มนักเรียนที่ยุติธรรมและใช้งานง่าย**

---

**End of Random Fighter MVP Development Design Document v1.0**
