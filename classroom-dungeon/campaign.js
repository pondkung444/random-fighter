/* Campaign v2: a separate state machine; legacy sessions retain the original engine. */
const DungeonCampaign=(()=>{
const roles=['นักสำรวจดารา','จอมเวทสมการ','ช่างกลพลังงาน','ผู้พิทักษ์สัจจะ'];
const lore=[['หอดูดาวอัสตรา','ทุกค่ำคืน แสงจากหอดูดาวนำทางผู้เดินทาง แต่คืนนี้… วงแหวนบนยอดหอกลับหมุนเร็วขึ้นไม่หยุด'],['คืนที่เครื่องจักรตื่น','รถรางพุ่งผ่านสถานี สะพานเคลื่อนตัวผิดจังหวะ ผู้รักษาสมดุลปิดประตูขังทุกคนไว้ เขากำลังปกป้องอะไรอยู่?'],['คำสัญญาของผู้กล้า','ก่อนรุ่งสาง เหล่าผู้กล้าต้องขึ้นไปหยุดแกนกลาง อาวุธของพวกเขาคือศาสตร์แห่งการเคลื่อนที่ทั้งห้า ช่วงแรกแข่งขันสะสมพลัง ก่อนร่วมมือกันที่ยอดหอ']];
const rooms=[
{title:'รถรางเที่ยวสุดท้าย',kind:'ภารกิจช่วยเหลือ',story:'รถรางกำลังไหลเข้าหาประตู! ก่อนสั่งเบรก ต้องอ่านสัญญาณการเคลื่อนที่ให้ถูกต้อง',goal:'อ่านข้อมูลและคำนวณความเร็ว เพื่อเปิดระบบเบรก',steps:[
['รถรางเริ่มจากหยุดนิ่ง เคลื่อนทางขวาด้วยความเร่งคงตัว กำหนดขวาเป็นบวก จงระบุ u และเครื่องหมายของ a','u = 0 m/s และ a เป็นบวก','อ่านสถานการณ์แล้วเขียนสิ่งที่รู้ • ทีมช่วยพูดได้ ผู้ถูกเลือกเท่านั้นที่เขียน'],
['ต้องหาความเร็วหลังผ่านไป t วินาที โดยรู้ u และ a เลือกสูตรที่ไม่ต้องรู้การกระจัด','v = u + at','เลือกสูตร • ยังไม่แทนค่าตัวเลข'],
['เปิดสัญญาณ: u = 0 m/s, a = +2 m/s², t = 4 s จงหา v','v = 0 + 2(4) = +8 m/s','แทนค่าและคำนวณ • ใช้สมการจากคนก่อนหน้า'],
['ตรวจคำตอบของทีม: ความเร็ว +8 m/s หมายถึงเคลื่อนทิศใด และตรวจหน่วยของ at','ทางขวา; (m/s²)(s) = m/s','วงจุดผิดแล้วแก้ได้ • อธิบายเหตุผลก่อนยืนยัน']]},
{title:'สะพานที่ไม่รอใคร',kind:'ส่งต่อสร้างสะพาน',story:'แท่นหินเริ่มเคลื่อนจากหยุดนิ่ง ต้องรู้ว่ามันจะไปถึงจุดรับผู้กล้าที่ไหน',goal:'ต่อสะพานด้วยการหาการกระจัด',steps:[
['แท่นหินเคลื่อนแนวตรงด้วยความเร่งคงตัว รู้ u, a, t และต้องหา s ตัวแปรใดไม่จำเป็น?','ไม่จำเป็นต้องรู้ v','ระบุเป้าหมายก่อนเลือกสูตร'],
['เลือกสูตรหา s จาก u, a และ t','s = ut + ½at²','เขียนสูตรให้ทีม • ห้ามสลับ t กับ t²'],
['u = 0 m/s, a = +2 m/s², t = 3 s แท่นหินเคลื่อนที่ได้เท่าไร?','s = 0(3) + ½(2)(3²) = +9 m','คำนวณแล้วส่งต่อกระดาษ'],
['ภาพลวงเขียนว่า ½ × 2 × 3² = 36 ตรวจแล้วแก้ขั้นที่ผิด','3² = 9 ดังนั้น ½ × 2 × 9 = 9 m','จับจุดผิด • ทีมที่ผิดขั้นก่อนแก้ได้โดยเก็บคำตอบเดิมไว้']]},
{title:'อัศวินเบรกแตก',kind:'มินิบอส • ปลดเกราะ',story:'อัศวินผู้เฝ้าประตูถูกล้อจักรกลลากพุ่งเข้ามา! ช่วยหยุดเขาโดยไม่ทำลายแกนชีวิต',goal:'หาระยะเบรกโดยไม่มีข้อมูลเวลา',steps:[
['อัศวินเคลื่อนทางขวาด้วย u = +12 m/s ต้องหยุดให้ v = 0 โดย a = −3 m/s² คงตัว ไม่มีข้อมูลเวลา ต้องหาอะไรเพื่อวางจุดเบรก?','หาระยะหยุด s; กำหนดขวาบวก ความเร่งจึงติดลบ','อ่านสัญญาณ • ทีมช่วยวางแผนได้'],
['เลือกสูตรที่ไม่มี t แล้วจัดรูปเพื่อหา s','v² = u² + 2as → s = (v² − u²)/(2a)','ปลดโซ่เส้นแรกด้วยสมการ'],
['คำนวณระยะหยุด เมื่อ u = +12 m/s, v = 0, a = −3 m/s²','s = (0 − 144)/(−6) = +24 m','ชาร์จวงเวทเบรก • อย่าทำเครื่องหมายลบหาย'],
['ประตูอยู่ห่างจุดเริ่มเบรก 30 m อัศวินหยุดก่อนชนหรือไม่? เหลือระยะเท่าไร?','หยุดก่อนชน เหลือ 30 − 24 = 6 m','ตรวจความสมเหตุสมผล • ส่ง Party Scroll ให้ครู']]},
{title:'อัศวินเบรกแตก',kind:'มินิบอส • เปิดจุดอ่อน',story:'เกราะล้อหลุดออกแล้ว แต่ตราเวทยังบังคับให้เขาเคลื่อน ต้องป้อนระยะเบรกอีกวิธีเพื่อปลดตรา',goal:'ใช้ความเร็วปลาย เวลา และความเร่ง',steps:[
['ระบบทดสอบเบรกอีกช่วง: รู้ v, a, t แต่ไม่รู้ u ต้องหาการกระจัด s','ใช้สูตรที่ไม่มี u','ช่วงนี้เป็นการเคลื่อนที่ชุดใหม่ ความเร่งคงตัว'],
['เลือกสูตรที่ใช้ v, a, t เพื่อหา s','s = vt − ½at²','ระวังเครื่องหมายลบหน้าพจน์ความเร่ง'],
['v = 0 m/s, a = −2 m/s², t = 4 s จงหา s','s = 0(4) − ½(−2)(4²) = +16 m','ลบคูณลบให้ผลบวก • บันทึกหน่วย'],
['เพื่อนคำนวณได้ −16 m แต่การเคลื่อนที่ยังเป็นทางขวาจนหยุด จงชี้จุดผิด','ลืมว่า −½ × (−2) เป็นบวก; คำตอบ +16 m','แก้ตราเวทด้วยการอธิบาย ไม่ใช่แค่บอกเลข']]},
{title:'ผนึกแห่งการหยุด',kind:'มินิบอส • โจมตีร่วม',story:'ผู้พิทักษ์ได้สติชั่วครู่แล้ว ทุกทีมต้องยืนยันสัญญาณหยุดพร้อมกันเพื่อปิดเครื่องจักร',goal:'ใช้ความเร็วเฉลี่ยภายใต้ความเร่งคงตัว',steps:[
['ช่วงสุดท้าย u = +8 m/s, v = 0, t = 4 s ความเร่งคงตัว ต้องหาการกระจัด เลือกข้อมูลใดใช้ได้โดยไม่หา a ก่อน?','ใช้ u, v และ t','ทุกทีมช่วยกัน • แต่เขียนคำตอบแยก Party'],
['เขียนสูตรการกระจัดจากความเร็วต้น ความเร็วปลาย และเวลา','s = ((u + v)/2)t','ความเร็วเฉลี่ยเท่ากับ (u+v)/2 เฉพาะความเร่งคงตัว'],
['แทนค่า u = +8 m/s, v = 0, t = 4 s แล้วคำนวณ s','s = ((8 + 0)/2)(4) = +16 m','คำตอบนี้เป็นกุญแจปิดเครื่องจักร'],
['ทำไมใช้ s = vt โดยแทน v = 0 ตลอดช่วงไม่ได้?','v = 0 เป็นความเร็วปลาย ไม่ใช่ความเร็วตลอดช่วง; ต้องใช้ความเร็วเฉลี่ย 4 m/s','ผู้พิทักษ์อธิบาย • ครูตรวจและเปิดผลก่อน Final Attack']]}
];

// Version 3 uses varied encounters; restored version 2 sessions keep their original steps.
const varied=rooms.map(r=>({...r,steps:r.steps.map(x=>[...x]),roleOrder:[0,1,2,3]}));
varied[0].mechanic='ฝึกส่งคัมภีร์ · ทีมช่วยได้ ผู้เข้าที่เท่านั้นที่เขียน';
varied[1].steps=[['แท่นหินเริ่มจากหยุดนิ่ง เร่งทางขวา +2 m/s² นาน 3 s (ความเร่งคงตัว ขวาเป็นบวก) เลือกสูตรและคำนวณ s เพื่อเลือกจุดวางสะพาน 9 m หรือ 18 m','s = ut + ½at² = 0 + ½(2)(3²) = +9 m; เลือกสะพาน 9 m','จอมเวทนำทีมเลือกจุดวางสะพาน • ทุกคนช่วยได้'],rooms[1].steps[3]];
varied[1].roleOrder=[1,3];varied[1].mechanic='เลือกทาง → ตรวจภาพลวง · 2 ช่วงสั้น';
varied[2].steps=[rooms[2].steps[0],['u = +12 m/s, v = 0, a = −3 m/s² คงตัว ไม่มีข้อมูลเวลา จงเลือกสูตร จัดรูป และหาจุดเริ่มเบรกก่อนประตูห่าง 30 m','v² = u² + 2as → s = (0 − 144)/(−6) = +24 m; ต้องเริ่มเบรกก่อนถึงประตูอย่างน้อย 24 m','ช่างกลรับข้อมูลจากนักสำรวจ • เขียนสูตรและการแทนค่าครบ'],rooms[2].steps[3]];
varied[2].roleOrder=[0,2,3];varied[2].mechanic='ส่งข้อมูล → วางจุดเบรก → ตรวจความปลอดภัย';
varied[3].steps=[['ตราเวทให้ v = 0 m/s, a = −2 m/s², t = 4 s (ขวาเป็นบวก ความเร่งคงตัว) ไม่รู้ u จงเลือกสูตรหา s แล้วจัดพจน์ก่อนส่งให้ผู้พิทักษ์','s = vt − ½at² = 0(4) − ½(−2)(4²)','จอมเวทจัดสูตรและแทนค่า • ยังไม่สรุปผล'],['ภาพลวงสรุปจากข้อมูลเดิมว่า s = −16 m จงแก้พร้อมชี้เครื่องหมายที่ผิด และอธิบายว่าทำไมการกระจัดยังเป็นบวก','−½ × (−2) เป็นบวก จึงได้ s = +16 m; เคลื่อนทางขวาจนหยุด','ผู้พิทักษ์จับผิด • 20 วินาทีแรกคิดเอง จากนั้นครูเปิดให้ทีมช่วย']];
varied[3].roleOrder=[1,3];varied[3].mechanic='ภาพลวงเครื่องหมาย · คิดเอง 20 วินาทีก่อนขอเสียงทีม';
varied[4].steps=[rooms[4].steps[0],['u = +8 m/s, v = 0, t = 4 s ความเร่งคงตัว (ขวาบวก) จงใช้ความเร็วเฉลี่ยสร้างกุญแจการกระจัดโดยไม่หา a','s = ((u+v)/2)t = ((8+0)/2)(4) = +16 m','ช่างกลคำนวณ • ทีมแต่ละคู่แลกตรวจเหตุผลกันก่อนส่ง'],rooms[4].steps[3]];
varied[4].roleOrder=[0,2,3];varied[4].mechanic='Party Link · คู่ทีมแลกตรวจคัมภีร์ แล้วร่วมผนึก';

// v4 starts with arithmetic and algebra; restored v2/v3 sessions keep their curriculum.
const foundations=[
{title:'ประตูพลังตัวเลข',kind:'ด่าน 1 · คิดเลข',story:'ประตูอัสตราดับสนิท ต้องเติมค่าพลังให้ครบสี่ช่องก่อนรถรางออกเดินทาง',goal:'ฝึกลำดับการคำนวณ จำนวนลบ เศษส่วน และเลขยกกำลัง',randomSeat:true,roleOrder:[0,0,0,0],mechanic:'สุ่มหนึ่งคนต่อ Party จากสมาชิกทุกคนก่อนเปิดแต่ละข้อ • ผู้ถูกสุ่มเขียน ทีมช่วยอธิบายได้',steps:[
['หาค่าพลังประตูจาก 18 − 3 × 4 โดยเขียนว่าต้องคำนวณส่วนใดก่อน','คูณก่อน: 3 × 4 = 12 แล้ว 18 − 12 = 6','เขียนวิธีทำ ไม่ตอบเฉพาะตัวเลข'],
['พลังเริ่มที่ −4 เติมอีก 7 แล้วใช้ไป 5 จงหาพลังที่เหลือจาก −4 + 7 − 5','−4 + 7 = 3 จากนั้น 3 − 5 = −2','ใช้เส้นจำนวนในภาพช่วยคิดเรื่องเครื่องหมาย'],
['มีผลึก 8 ก้อน ใช้พลังไป ¾ ของทั้งหมด จงคำนวณจำนวนผลึกที่ใช้จาก ¾ × 8','¾ × 8 = (3 × 8)/4 = 6 ก้อน','แบ่งเป็น 4 ส่วนเท่ากัน แล้วเลือก 3 ส่วน'],
['หาค่าของ ½ × 2 × 3² ให้คิดเลขยกกำลังก่อน แล้วคูณจากซ้ายไปขวา','3² = 9 และ ½ × 2 = 1 จึงได้ 9','วงเลขยกกำลังแล้วแสดงขั้นคำนวณ']]},
{title:'ห้องตราชั่งสมการ',kind:'ด่าน 2 · แก้สมการ',story:'กลไกประตูชั้นในล็อกด้วยค่าที่หายไป สุ่มผู้กล้ามารักษาสมดุลของตราชั่งทีละคน',goal:'แก้สมการและจัดรูป โดยทำสิ่งเดียวกันทั้งสองข้าง',randomSeat:true,roleOrder:[1,1,1,1],mechanic:'สุ่มจากสมาชิกทุกคนใหม่ทุกข้อ ไม่จำกัด Role • เขียนการทำทั้งสองข้าง แล้วแทนกลับตรวจ',steps:[
['แก้สมการ x + 7 = 19 เพื่อหาค่า x พร้อมแทนค่ากลับตรวจ','ลบ 7 ทั้งสองข้าง: x = 12; ตรวจ 12 + 7 = 19','รักษาสมดุลทั้งสองข้างของสมการ'],
['แก้สมการ 3x − 4 = 20 เพื่อหาค่า x พร้อมแสดงสองขั้นตอน','บวก 4 ทั้งสองข้างได้ 3x = 24 แล้วหาร 3 ได้ x = 8','อธิบายว่าทำอะไรทั้งสองข้างก่อน'],
['แก้สมการ x/4 + 2 = 5 เพื่อหาค่า x แล้วแทนกลับตรวจ','ลบ 2 ได้ x/4 = 3 แล้วคูณ 4 ได้ x = 12; ตรวจ 12/4 + 2 = 5','จัดการการบวกก่อน แล้วค่อยการหาร'],
['จาก y = 3x + 2 จงจัดรูปให้ x อยู่ลำพัง โดยไม่ต้องแทนค่าตัวเลข','ลบ 2 ได้ y − 2 = 3x แล้วหาร 3: x = (y − 2)/3','ระวังวงเล็บ ต้องหารทั้ง y − 2 ด้วย 3']]}
];
const motion=varied.map(r=>({...r,steps:r.steps.map(t=>[...t])}));
motion[0].steps[3]=['รถรางเริ่มจากหยุดนิ่ง มีความเร่ง +2 m/s² นาน 4 s (ขวาเป็นบวก) จงเขียนความเร็วปลายพร้อมหน่วย แล้วอธิบายว่าเครื่องหมายบวกบอกทิศใด','v = +8 m/s หรือ 8 เมตรต่อวินาทีไปทางขวา; ความเร่ง 2 เมตรต่อวินาที² ทำให้ความเร็วเพิ่ม 2 เมตรต่อวินาทีทุกวินาที','ตรวจคำตอบจากคนก่อนหน้า • ระบุทั้งขนาด หน่วย และทิศ ไม่ตอบเพียงเลข 8'];
const bootcamp=[...foundations,...motion];

// Editorial pass: each live v4 question states its own givens and expected output.
const setQuestion=(r,j,given,ask,answer,instruction,target)=>{
 const step=bootcamp[r].steps[j];step[0]=given+' '+ask;step[1]=answer;step[2]=instruction;
 step.view={given,ask,target};
};
setQuestion(0,0,'18 − 3 × 4','จงหาค่าของนิพจน์นี้ และแสดงลำดับการคำนวณ','3 × 4 = 12 ก่อน แล้ว 18 − 12 = 6','เขียนอย่างน้อย 2 บรรทัดให้เห็นลำดับการคำนวณ','หาค่าของ 18 − 3 × 4');
setQuestion(0,1,'−4 + 7 − 5','จงหาค่า พร้อมแสดงการบวกและลบทีละขั้น','−4 + 7 = 3 แล้ว 3 − 5 = −2','เริ่มที่ −4 บนเส้นจำนวน แล้วทำตามเครื่องหมาย','หาค่าของ −4 + 7 − 5');
setQuestion(0,2,'มีผลึกทั้งหมด 8 ก้อน ต้องนำออกมาใช้ 3 ใน 4 ของทั้งหมด','ต้องใช้ผลึกกี่ก้อน? เขียนประโยคคำนวณด้วย','¾ × 8 = (8 ÷ 4) × 3 = 6 ก้อน','ตอบเป็นจำนวนก้อน พร้อมแสดงวิธีคิด','จำนวนผลึกที่ใช้ = ? ก้อน');
setQuestion(0,3,'½ × 2 × 3²','จงหาค่าของนิพจน์นี้ โดยแสดงค่าของ 3² ก่อน','3² = 3 × 3 = 9 จึงได้ ½ × 2 × 9 = 9','3² หมายถึง 3 คูณตัวเอง 2 ตัว','หาค่าของ ½ × 2 × 3²');
setQuestion(1,0,'x + 7 = 19','จงหาค่า x แล้วแทนกลับเพื่อตรวจคำตอบ','ลบ 7 ทั้งสองข้างได้ x = 12; ตรวจ 12 + 7 = 19','ทุกขั้นต้องทำสิ่งเดียวกันทั้งสองข้าง','หาค่า x');
setQuestion(1,1,'3x − 4 = 20','จงหาค่า x แล้วแทนกลับเพื่อตรวจคำตอบ','บวก 4 ทั้งสองข้างได้ 3x = 24 แล้วหาร 3 ได้ x = 8; ตรวจ 3(8) − 4 = 20','แสดงการแก้สมการทีละบรรทัด','หาค่า x');
setQuestion(1,2,'x/4 + 2 = 5','จงหาค่า x แล้วแทนกลับเพื่อตรวจคำตอบ','ลบ 2 ทั้งสองข้างได้ x/4 = 3 แล้วคูณ 4 ได้ x = 12; ตรวจ 12/4 + 2 = 5','x/4 หมายถึง x หารด้วย 4','หาค่า x');
setQuestion(1,3,'y = 3x + 2','จงจัดรูปให้ x อยู่ลำพัง คำตอบให้เขียนในรูปที่มี y','ลบ 2 ทั้งสองข้างได้ y − 2 = 3x แล้วหาร 3 ได้ x = (y − 2)/3','ข้อนี้ตอบเป็นสูตร ไม่ต้องหาค่าตัวเลขของ x หรือ y','เขียน x = … โดยใช้ y');
const tram='รถรางเริ่มจากหยุดนิ่ง เร่งคงตัวไปทางขวา 2 m/s² เป็นเวลา 4 s กำหนดขวาเป็นบวก';
setQuestion(2,0,tram,'จงระบุความเร็วต้น u และความเร่ง a พร้อมหน่วยและเครื่องหมาย','u = 0 m/s; a = +2 m/s²','อ่านข้อมูลจากเรื่อง ยังไม่ต้องคำนวณความเร็วปลาย','ระบุ u และ a');
setQuestion(2,1,tram,'ต้องการหาความเร็วปลาย v จงเลือกสูตรที่ใช้ u, a, t โดยไม่ใช้ s','v = u + at','เขียนเฉพาะสูตร ยังไม่ต้องแทนตัวเลข','เลือกสูตรหา v จาก u, a, t');
setQuestion(2,2,'รถรางมี u = 0 m/s, a = +2 m/s² คงตัว และ t = 4 s กำหนดขวาเป็นบวก','จงใช้ v = u + at คำนวณความเร็วปลาย v','v = 0 + (+2)(4) = +8 m/s','แสดงสูตร การแทนค่า และคำตอบพร้อมหน่วย','คำนวณ v = ? m/s');
setQuestion(2,3,'รถรางมี u = 0 m/s, a = +2 m/s² คงตัว และ t = 4 s กำหนดขวาเป็นบวก','จงตรวจคำตอบบนกระดาษทีม: ค่าของ v และหน่วยถูกหรือไม่? เครื่องหมายของ v บอกว่าเคลื่อนทิศใด?','v = +8 m/s หมายถึงเคลื่อนที่ไปทางขวาด้วยความเร็วขนาด 8 เมตรต่อวินาที','ถ้าพบข้อผิดให้วงจุดที่แก้ แล้วเขียนเหตุผล','ตรวจค่า หน่วย และทิศของ v');
const bridge='แท่นหินเริ่มจากหยุดนิ่ง มี a = +2 m/s² คงตัว นาน 3 s กำหนดขวาเป็นบวก';
setQuestion(3,0,bridge,'จุดรับผู้กล้ามี 2 ตำแหน่ง: ห่างจุดเริ่ม 9 m และ 18 m ทางขวา จงหา s แล้วเลือกจุดรับที่แท่นหินไปถึงเมื่อครบ 3 s','s = ut + ½at² = 0(3) + ½(2)(3²) = +9 m จึงเลือกจุดรับ 9 m','ตอบทั้งสูตร การคำนวณ และตำแหน่งที่เลือก','เลือกจุดรับ 9 m หรือ 18 m');
setQuestion(3,1,bridge+' งานที่ให้ตรวจเขียนว่า: 3² = 3 × 2 = 6 จึงได้ s = ½ × 2 × 6 = 6 m','จงระบุขั้นที่ผิด แล้วเขียนวิธีคำนวณที่ถูกต้อง','ผิดที่ 3² ไม่เท่ากับ 3 × 2; ต้องเป็น 3 × 3 = 9 จึงได้ s = ½ × 2 × 9 = +9 m','ข้อความในงานที่ให้ตรวจอาจผิด อย่าคัดลอกเป็นข้อมูลจริง','ตรวจขั้น 3² = 3 × 2');
const brake='อัศวินเคลื่อนทางขวาด้วยความเร็วต้น 12 m/s แล้วเบรกด้วยความเร่งคงตัว −3 m/s² จนหยุด กำหนดขวาเป็นบวก';
setQuestion(4,0,brake,'จงระบุ u, v, a พร้อมหน่วย และบอกว่ารู้เวลาเบรก t หรือไม่','u = +12 m/s, v = 0 m/s, a = −3 m/s²; ไม่ได้ให้เวลา t','คำว่า “จนหยุด” ใช้กำหนดค่า v','ระบุ u, v, a; ทราบ t หรือไม่?');
setQuestion(4,1,'ช่วงเบรกมี u = +12 m/s, v = 0 m/s, a = −3 m/s² คงตัว กำหนดขวาเป็นบวก','จงเลือกสูตรที่ไม่ใช้ t จัดรูปหา s และคำนวณระยะที่เคลื่อนไปก่อนหยุด','v² = u² + 2as → s = (v² − u²)/(2a) = (0 − 144)/(−6) = +24 m','ต้องมีทั้งสูตรที่จัดรูปแล้วและคำตอบพร้อมหน่วย','หา s โดยไม่ใช้ t');
setQuestion(4,2,'เริ่มเบรกห่างประตู 30 m ทางขวา มี u = +12 m/s, v = 0 m/s, a = −3 m/s² คงตัว กำหนดขวาเป็นบวก','ตรวจระยะหยุด s ของทีม แล้วสรุปว่าหยุดก่อนถึงประตูหรือไม่ และห่างประตูอีกกี่เมตร','ระยะหยุด 24 m น้อยกว่า 30 m จึงหยุดก่อนประตู และห่างประตู 30 − 24 = 6 m','ตอบทั้ง “หยุดก่อนหรือไม่” และระยะที่เหลือ','ตรวจระยะหยุดเทียบกับประตู 30 m');
const seal='ช่วงเบรกชุดใหม่มี v = 0 m/s, a = −2 m/s² คงตัว, t = 4 s ไม่ทราบ u กำหนดขวาเป็นบวก';
setQuestion(5,0,seal,'จงเลือกสูตรหา s ที่ไม่ใช้ u แล้วแทนค่าลงในสูตร ยังไม่ต้องคำนวณผลสุดท้าย','s = vt − ½at² = 0(4) − ½(−2)(4²)','เก็บวงเล็บของ a ที่เป็นลบให้ครบ','เลือกสูตรและแทนค่าเพื่อหา s');
setQuestion(5,1,seal+' งานที่ให้ตรวจเขียนว่า: s = 0(4) − ½(−2)(4²) = −16 m','จงคำนวณใหม่ ชี้ว่าเครื่องหมายผิดตรงไหน แล้วบอกทิศของการกระจัดที่ถูกต้อง','−½ × (−2) เป็นบวก จึงได้ s = +16 m หมายถึงการกระจัดไปทางขวา','20 วินาทีแรกคิดเอง จากนั้นครูกดให้ทีมช่วย','ตรวจเครื่องหมายในงานที่ให้ตรวจ');
const finalData='u = +8 m/s, v = 0 m/s, t = 4 s; ความเร่งคงตัว กำหนดขวาเป็นบวก';
setQuestion(6,0,finalData,'จงระบุตัวแปรที่ทราบค่า และตัวแปรที่ต้องหาเมื่อโจทย์ถามการกระจัด','ทราบ u = +8 m/s, v = 0 m/s, t = 4 s; ต้องหา s ไม่จำเป็นต้องคำนวณ a ก่อน','เขียนแยกเป็น “ทราบ” กับ “ต้องหา”','ระบุข้อมูลที่ทราบและสิ่งที่ต้องหา');
setQuestion(6,1,finalData,'จงใช้ความเร็วเฉลี่ยคำนวณการกระจัด s โดยไม่หา a ก่อน','ความเร็วเฉลี่ย = (u + v)/2 = 4 m/s; s = ((u + v)/2)t = 4(4) = +16 m','แสดงความเร็วเฉลี่ยก่อนคำนวณ s แล้วให้คู่ทีมตรวจ','ใช้ความเร็วเฉลี่ยหา s');
setQuestion(6,2,finalData+' งานที่ให้ตรวจ: s = vt = 0 × 4 = 0 m','วิธีนี้ถูกหรือไม่? จงแก้ค่า s และอธิบายว่าต้องใช้ความเร็วใดคูณกับเวลา','ไม่ถูก: 0 m/s เป็นความเร็วปลาย ไม่ใช่ความเร็วตลอด 4 s ต้องใช้ความเร็วเฉลี่ย (8 + 0)/2 = 4 m/s จึงได้ s = +16 m','แยกความเร็วปลายออกจากความเร็วเฉลี่ยให้ชัด','ตรวจการใช้ความเร็วปลายแทนค่าเฉลี่ย');

const physicsOffset=()=>state().version>=4?2:0;
const bossStart=()=>physicsOffset()+2;
const lastRoom=()=>activeRooms().length-1;
const roleLabel=()=>room().randomSeat?'ผู้กล้าที่ถูกสุ่ม':roles[currentRole()];

const activeRooms=()=>state().version>=4?bootcamp:state().version>=3?varied:rooms;
const currentRole=()=>room().roleOrder?.[state().step]??state().step;

function create(){return {version:4,phase:'lore',scene:0,room:0,step:0,selected:{},marks:{},records:[],loot:{},hp:100,attack:false,answer:false};}
const state=()=>s.campaign,room=()=>activeRooms()[state().room];
function pick(){const c=state();c.selected={};s.parties.forEach(p=>{const pool=room().randomSeat?p.members:p.members.filter(m=>m.roles.includes(C.roles[currentRole()]));const recent=c.last?.[p.id];let eligible=pool.length>1?pool.filter(m=>m.id!==recent):pool;const weights=eligible.map(m=>1/(1+(m.campaignCalls||0)));let n=Math.random()*weights.reduce((a,b)=>a+b,0);let m=eligible[eligible.length-1];for(let i=0;i<eligible.length;i++){n-=weights[i];if(n<0){m=eligible[i];break;}}if(!m)throw Error('Party ยังขาดหน้าที่ '+C.roles[currentRole()]);m.campaignCalls=(m.campaignCalls||0)+1;c.selected[p.id]=m.id;c.last=c.last||{};c.last[p.id]=m.id;});c.phase='seats';}
function control(a,id){const c=state();switch(a){
case 'story':if(c.scene<2)c.scene++;else c.phase='teams';break;
case 'skipstory':c.phase='teams';break;
case 'map':c.phase='map';break;
case 'enter':c.phase='intro';break;
case 'pick':pick();break;
case 'ready':if(c.phase!=='seats')return;c.phase='task';s.remaining=90;c.silent=c.version>=3&&c.room===physicsOffset()+3&&c.step===1;s.running=true;last=Date.now();break;
case 'help':if(c.phase==='task'&&s.remaining<=70)c.silent=false;else return;break;
case 'lock':if(c.phase!=='task')return;s.running=false;c.phase='mark';break;
case 'correct':case 'wrong':if(c.phase!=='mark')return;c.marks[id]={correct:a==='correct',recovery:false};break;
case 'recovery':if(c.phase==='mark'&&c.marks[id]?.correct===false)c.marks[id].recovery=!c.marks[id].recovery;break;
case 'result':if(c.phase!=='mark'||s.parties.some(p=>!c.marks[p.id]))throw Error('ตรวจให้ครบทุก Party ก่อน');s.running=false;{let success=0;const records=s.parties.map(p=>{const m=c.marks[p.id];p.score+=(m.correct?3:0)+(m.recovery?1:0);if(m.correct||m.recovery)success++;return {party:p.id,...m};});c.records.push({room:c.room,step:c.step,formula:c.room-physicsOffset(),results:records});if(c.room>=bossStart())c.hp=Math.max(0,c.hp-(c.version>=3?12.5:10)*success/s.parties.length);c.phase='result';}break;
case 'answer':c.answer=!c.answer;break;
case 'continue':if(c.phase!=='result')return;c.answer=false;c.marks={};if(c.step<rLength()-1){c.step++;pick();}else if(c.room===lastRoom()){c.phase='final';}else c.phase='clear';break;
case 'nextroom':if(c.phase!=='clear')return;if(c.version>=3&&c.room===0)s.parties.forEach(p=>{if(!c.loot[p.id])c.loot[p.id]='crystal';});c.room++;c.step=0;c.phase='map';break;
case 'attack':if(c.phase!=='final'||c.attack)return;if(c.hp>0){c.phase=c.version>=3?'chanceSeats':'chance';c.chanceMarks={};s.running=false;}else{c.attack=true;c.phase='victory';}break;
case 'chanceready':if(c.phase!=='chanceSeats')return;c.phase='chanceTask';s.remaining=120;s.running=true;last=Date.now();break;
case 'chancelock':if(c.phase!=='chanceTask')return;c.phase='chance';s.running=false;break;
case 'chanceyes':case 'chanceno':if(c.phase==='chance')c.chanceMarks[id]=a==='chanceyes';break;
case 'chancefinish':if(c.phase!=='chance'||s.parties.some(p=>c.chanceMarks[p.id]===undefined))throw Error('ตรวจคำอธิบายให้ครบทุก Party');c.attack=true;if(s.parties.every(p=>c.chanceMarks[p.id])){c.hp=0;c.phase='victory';}else c.phase='survived';break;
case 'camp':c.phase='camp';break;
case 'loot':if(c.phase!=='camp'||c.loot[id])return;c.loot[id]='crystal';break;
case 'crystal':if(c.loot[id]!=='crystal'||c.phase!=='task')return;c.loot[id]='used';s.remaining+=30;break;
case 'report':c.phase='report';break;
case 'pause':if(!['task','chanceTask'].includes(c.phase))return;s.running=!s.running;last=Date.now();break;
case 'time':if(!['task','chanceTask'].includes(c.phase))return;s.remaining+=30;break;
case 'undo':if(undo.length){s=undo.pop();s.running=false;save();render();}return;
case 'replay':s.running=false;c.scene=0;c.returnPhase=c.phase;c.phase='lore';break;
case 'return':c.phase=c.returnPhase||'map';delete c.returnPhase;break;
}save();render();}
const rLength=()=>room().steps.length;
function partyLinks(){const groups=[];s.parties.forEach((p,i)=>{if(i%2===0)groups.push([p]);else groups[groups.length-1].push(p);});if(groups.length>1&&groups[groups.length-1].length===1)groups[groups.length-2].push(...groups.pop());return groups.map(g=>g.map(p=>esc(p.name)).join(' ↔ ')).join(' · ');}

const button=(a,t,extra='')=>`<button data-campaign="${a}" ${extra}>${t}</button>`;
function knight(){return `<svg class="knight" viewBox="0 0 360 420" role="img" aria-label="อัศวินเบรกแตก ผู้พิทักษ์บนล้อจักรกล"><defs><linearGradient id="metal" x2="1" y2="1"><stop stop-color="#eed49c"/><stop offset=".5" stop-color="#566d76"/><stop offset="1" stop-color="#152d40"/></linearGradient><radialGradient id="core"><stop stop-color="#fff"/><stop offset=".3" stop-color="#8df8ed"/><stop offset="1" stop-color="#207b8f"/></radialGradient></defs><ellipse cx="180" cy="385" rx="145" ry="18" fill="#0008"/><g class="wheels" fill="#162d3b" stroke="#bda16a" stroke-width="9"><circle cx="92" cy="320" r="61"/><circle cx="264" cy="320" r="61"/></g><g stroke="#76c4c5" stroke-width="3">${[92,264].map(x=>[0,45,90,135].map(a=>`<path transform="rotate(${a} ${x} 320)" d="M${x-48} 320h96"/>`).join('')).join('')}</g><g fill="url(#metal)" stroke="#ddbf7a" stroke-width="3"><path d="M112 167L70 148 24 191 54 250 105 226 124 293 234 293 258 223 308 247 337 189 291 147 249 168 220 135 140 135Z"/><path d="M130 55L180 26 231 55 223 128 180 154 138 128Z"/><path d="M127 50L104 8 153 43M229 50L253 8 209 43"/><path d="M108 276L89 328 146 349 181 298 218 350 276 328 250 276Z"/></g><path d="M145 83h70l-13 22h-44Z" fill="#76f2e6"/><circle class="core" cx="181" cy="209" r="38" fill="url(#core)" stroke="#f4dfac" stroke-width="7"/><path d="M160 209l21-26 21 26-21 26Z" fill="#dffff7"/><g class="chains" stroke="#dcb16d" stroke-width="6" stroke-dasharray="13 7"><path d="M60 175L286 278M299 176L73 278"/></g></svg>`;}
function art(){const c=state(),boss=c.room>=bossStart(),cinematic=['lore','teams','final','victory','survived','camp'].includes(c.phase);return '<div class="campaign-art '+(boss?'boss-art ':'')+(c.hp<55?'exposed ':'')+(['victory','camp','report'].includes(c.phase)?'defeated':'')+'">'+(boss||cinematic?'<div class="keyart-frame"><img class="keyart" src="/classroom-dungeon/assets/knight-keyart.png" alt="คณะผู้กล้าสี่คนเผชิญผู้พิทักษ์ล้อจักรกลแห่งอัสตรา"><span class="boss-aura"></span></div>':'<div class="mechanism '+(c.version>=4&&c.room<2?'foundation':c.room===physicsOffset()?'tram':'bridge')+'"><div class="orbit-ring"></div><span>'+(c.version>=4&&c.room<2?(c.room===0?'123':'x = ?'):c.room===physicsOffset()?'🚋':'◇')+'</span><i></i><b>'+(c.version>=4&&c.room<2?(c.room===0?'NUMBER GATE':'EQUATION BALANCE'):c.room===physicsOffset()?'ASTRA RAIL':'STAR BRIDGE')+'</b></div>')+'<span class="art-caption">'+(boss?(c.hp===0?'ผู้พิทักษ์ได้รับอิสระ':c.hp<55?'จุดอ่อนเผยแล้ว · ปลดตราเวท':'ผู้พิทักษ์ประตู · เกราะจักรกล'):'คณะผู้กล้าแห่งอัสตรา')+'</span></div>';}
function seats(){const c=state();return `<div class="campaign-parties">${s.parties.map((p,i)=>{const m=p.members.find(m=>m.id===c.selected[p.id]);return `<div class="party party-${i}"><strong>${esc(p.name)}</strong><div class="seat">${esc(m?.name||'รอสุ่มผู้กล้า')}</div><small>★ ${p.score}</small></div>`;}).join('')}</div>`;}

function taskFigure(){const c=state(),r=room(),p=c.room-physicsOffset(),j=c.step;let inner='',caption='ภาพประกอบโจทย์',label='';
const txt=(x,y,t,size=19)=>'<text x="'+x+'" y="'+y+'" font-size="'+size+'" text-anchor="middle" fill="#edf8ed">'+esc(t)+'</text>';
const rect=(x,y,w,h)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="9" fill="#173c49" stroke="#d6bd80"/>';
if(r.randomSeat&&c.room===0){
const expressions=['18 − 3 × 4','−4 + 7 − 5','¾ × 8','½ × 2 × 3²'];label=expressions[j];caption=['พลังตั้งต้นและกลุ่มพลังที่ต้องนำออก','เติมพลังไปทางขวา ใช้พลังไปทางซ้าย','ผลึก 8 ก้อน แบ่งเป็น 4 กลุ่มเท่ากัน','จัดลำดับการคำนวณในวงจรพลัง'][j];
if(j===0){inner=txt(200,36,'พลังตั้งต้น 18',22);[60,150,240].forEach(x=>{inner+=rect(x,58,85,46)+txt(x+42,88,'4');});inner+=txt(200,145,'นำออก 3 กลุ่ม กลุ่มละ 4',18);}
else if(j===1){inner='<path d="M35 104H365" stroke="#81d8d4" stroke-width="3"/>';for(let n=-6;n<=8;n++){const x=40+(n+6)*22;inner+='<path d="M'+x+' 98v12" stroke="#81d8d4"/>';if([-6,-4,0,4,8].includes(n))inner+=txt(x,128,String(n),15);}inner+='<circle cx="84" cy="104" r="5" fill="#f4d591"/><path d="M84 94V66H238v28m0-28l-10-6m10 6l-10 6M238 135v25H128v-25m0 25l10-6m-10 6l10 6" stroke="#d6bd80" fill="none" stroke-width="3"/>'+txt(160,48,'+7',20)+txt(182,190,'−5',20);}
else if(j===2){for(let k=0;k<8;k++)inner+=rect(32+k*43,67,33,42);for(let k=0;k<4;k++)inner+='<path d="M'+(30+k*86)+' 120h76" stroke="#81d8d4" stroke-width="3"/>';inner+=txt(200,38,'ใช้ 3 ใน 4 กลุ่ม',23)+txt(200,157,'นับจำนวนผลึกที่ใช้',18);}
else{['½','× 2','× 3²'].forEach((x,k)=>inner+=rect(35+k*114,65,103,58)+txt(86+k*114,102,x,27));inner+=txt(200,38,'ค่าพลัง = ?',23);}}
else if(r.randomSeat){const sides=[['x + 7','19'],['3x − 4','20'],['x/4 + 2','5'],['y','3x + 2']][j];label=sides.join(' = ');caption='สมการเหมือนตราชั่ง ทำสิ่งเดียวกันทั้งสองข้าง';inner='<path d="M200 60v95m-28 10h56M70 70H330M95 70l-37 65h74ZM305 70l-37 65h74Z" stroke="#d6bd80" stroke-width="3" fill="none"/>'+txt(100,45,sides[0],25)+txt(300,45,sides[1],25)+txt(200,101,'=',28)+txt(200,189,'หา x',19);}
else {const chance=['chanceTask','chance'].includes(c.phase);let left='เริ่มต้น',right='ปลายทาง',info='',target='s = ?';
if(chance){left='u = +10 m/s';right='v = 0 m/s';info='t = 5 s · a คงตัว';target='หา a และ s';}
else if(p===0){left='u = 0 m/s';right='v = ?';info=c.version>=4?'a = +2 m/s² · t = 4 s':j<2?'a เป็นบวก · t วินาที':'a = +2 m/s² · t = 4 s';target=j===0?'ระบุ u และทิศของ a':j===1?'เลือกสูตรหา v':'หา v และระบุทิศ';}
else if(p===1){left='u = 0 m/s';right='จุดรับผู้กล้า';info='a = +2 m/s² · t = 3 s';target=j===0?'เลือก 9 m หรือ 18 m':'ตรวจ ½ × 2 × 3²';}
else if(p===2){left='u = +12 m/s';right='v = 0 m/s';info=j===0?'a = −3 m/s² · ไม่ทราบ t':'a = −3 m/s²'+(j===2?' · ประตูห่าง 30 m':' · ไม่ทราบ t');target='ระยะเบรก s = ?';}
else if(p===3){left='u ไม่ทราบ';right='v = 0 m/s';info='a = −2 m/s² · t = 4 s';target='หา s · ระวังลบคูณลบ';}
else {left='u = +8 m/s';right='v = 0 m/s';info='t = 4 s · a คงตัว';target='หา s โดยไม่ต้องหา a';}
target=chance?target:(r.steps[j]?.view?.target||target);label=left+' → '+right+'; '+info+'; '+target;caption='แผนภาพการเคลื่อนที่ · ขวาเป็นบวก · ภาพไม่ตามมาตราส่วน';inner=txt(200,24,'ทิศบวก →',17)+rect(35,52,63,30)+rect(302,52,63,30)+'<circle cx="48" cy="86" r="6" fill="#d6bd80"/><circle cx="83" cy="86" r="6" fill="#d6bd80"/><circle cx="315" cy="86" r="6" fill="#d6bd80"/><circle cx="350" cy="86" r="6" fill="#d6bd80"/><path d="M105 68H291l-12-7m12 7l-12 7M40 122H360" stroke="#81d8d4" stroke-width="3" fill="none"/>'+txt(90,110,left,17)+txt(310,110,right,17)+txt(200,149,info,17)+txt(200,181,target,17);}
return '<figure class="task-figure"><svg viewBox="0 0 400 210" role="img" aria-label="'+esc(label)+'">'+inner+'</svg><figcaption>'+esc(caption)+'</figcaption></figure>';}

function renderCampaign(){const c=state(),r=room(),phase=c.phase;document.body.dataset.parties=String(s.parties.length);document.body.classList.toggle('campaign-tv',!!c.tv);const isTask=['task','mark','result'].includes(phase);let body='',primary='';
if(phase==='lore'){body=`<div class="cinema"><small>บทนำ ${c.scene+1} / 3</small><h1>${lore[c.scene][0]}</h1><p>${lore[c.scene][1]}</p></div>`;primary=button('story',c.scene<2?'เล่าเรื่องต่อ →':'เปิดตัวคณะผู้กล้า →')+button('skipstory','ข้ามบทนำ')+(c.returnPhase?button('return','กลับภารกิจ'): '');}
else if(phase==='teams'){body=`<h1>เหล่าผู้กล้า พร้อมออกเดินทาง!</h1><p>กระดาษประจำทีมคือคัมภีร์ภารกิจ • ผู้ถูกเรียกเท่านั้นที่จับปากกา • ทีมช่วยพูดได้</p>${seats()}`;primary=button('map','เปิดแผนที่ →');}
else if(phase==='map'){body=`<small>บทที่ 1 · คิดเลข → แก้สมการ → การเคลื่อนที่</small><h1>เส้นทางสู่ประตูดารา</h1><div class="journey">${activeRooms().map((x,i)=>`<div class="${i===c.room?'current':''}"><b>${i<c.room?'✓':i+1}</b><span>${x.title}<small>${x.kind}</small></span></div>`).join('')}</div><p>ชุดทดลองบทแรก • หลัง Camp บทขึ้นยอดหอยังอยู่ระหว่างพัฒนา</p>`;primary=button('enter','เข้าสู่ '+r.title+' →');}
else if(phase==='intro'){body=`<small>${r.kind}</small><h1>${r.title}</h1><p class="story-copy">${r.story}</p><div class="mission">ภารกิจ: ${r.goal}</div>${c.version>=4&&c.room>=2?'<p class="variable-guide">u = ความเร็วต้น · v = ความเร็วปลาย · a = ความเร่ง · s = การกระจัด · t = เวลา<br>ใช้สมการทั้ง 5 สูตรเมื่อความเร่งคงตัว</p>':''}<p>${r.mechanic||"แต่ละหน้าที่เขียนคนละขั้นบนกระดาษเดิม เพื่อนช่วยอธิบายได้"} • การเปลี่ยนคนหยุดเวลาเสมอ</p>`;primary=button('pick','สุ่มผู้กล้าเข้าที่ →');}
else if(phase==='seats'){body=`<small>${r.randomSeat?'เตรียมผู้ทำโจทย์':'เตรียมส่งต่อ'} · ${r.randomSeat?'ข้อ':'ขั้น'} ${c.step+1} / ${r.steps.length}</small><h1>${roleLabel()} เข้าประจำที่</h1><p>โจทย์ยังถูกผนึก • ให้คนที่มีชื่อเข้าที่ Active Seat ของ Party</p>${seats()}<p class="mission">${c.version>=4?(r.randomSeat?'ผู้มีชื่อเข้าที่พร้อมกระดาษและปากกา • รอครูเปิดโจทย์':'รับกระดาษจากคนก่อนหน้า แล้วรอครูเปิดข้อมูลของขั้นนี้'):r.steps[c.step][2]}</p>`;primary=button('ready','ทุกทีมพร้อม · เปิดโจทย์และเริ่มเวลา');}
else if(isTask){body=`<div class="row"><span class="role">${roleLabel()} · ${r.randomSeat?'ข้อ':'ขั้น'} ${c.step+1}/${r.steps.length}</span><span id="clock" class="timer">${time(s.remaining)}</span></div><div class="task-visual"><div class="question-copy">${r.steps[c.step].view?`<div class="question-givens"><strong>ข้อมูลโจทย์</strong><p>${esc(r.steps[c.step].view.given)}</p></div><div class="motion-question"><strong>สิ่งที่ต้องทำ</strong><p>${esc(r.steps[c.step].view.ask)}</p></div>`:`<div class="motion-question">${esc(r.steps[c.step][0])}</div>`}</div>${taskFigure()}</div><p>${r.steps[c.step][2]}</p>${seats()}`;
if(phase==='task'){primary=button('lock','ล็อกคำตอบ · ตรวจทุกทีม')+button('pause',s.running?'หยุดเวลา':'เดินเวลาต่อ')+button('time','+30 วินาที');body+=c.silent?'<div class="mission">คิดเองก่อน · เมื่อเวลาเหลือ 01:10 ครูกดเปิดเสียงทีม</div>'+button('help','เปิดให้ทีมช่วย'):'';body+=s.remaining===0?'<p class="mission">หมดเวลาแล้ว · ชูคำตอบพร้อมกัน จากนั้นครูกดล็อกคำตอบ</p>':'';body+=s.parties.filter(p=>c.loot[p.id]==='crystal').map(p=>button('crystal',esc(p.name)+' ใช้ผลึก +30 วินาที',`data-id="${p.id}"`)).join('');}
if(phase==='mark'){body+=`<h2>ตรวจแล้ว ${Object.keys(c.marks).length}/${s.parties.length} Party</h2><p>เฉลยยังซ่อนอยู่ • ครูตรวจจากกระดาษ • มินิบอสส่ง Party Scroll</p><div class="mark-grid">${s.parties.map(p=>{const m=c.marks[p.id];return `<section><strong>${esc(p.name)}</strong>${button('correct',m?.correct===true?'✓ ถูกแล้ว':'ถูก',`data-id="${p.id}"`)}${button('wrong',m?.correct===false?'↻ ผิดครั้งแรก':'ผิด',`data-id="${p.id}"`)}${m?.correct===false?button('recovery',m.recovery?'✓ แก้และอธิบายแล้ว':'Recovery สำเร็จ',`data-id="${p.id}"`):''}</section>`;}).join('')}</div>`;primary=button('result','เปิดผลพร้อมกัน',s.parties.some(p=>!c.marks[p.id])?'disabled':'');}
if(phase==='result'){const successes=Object.values(c.marks).filter(m=>m.correct||m.recovery).length;body+=`<div class="mission result-impact">${successes}/${s.parties.length} ทีมส่งพลังสำเร็จ ${successes?(c.room>=bossStart()?'• โซ่ผนึกกำลังคลาย!':'• กลไกตอบสนองแล้ว!'):'• ยังไม่เกิดพลังผนึก ลองทบทวนวิธีกับครู'}</div>${c.answer?`<div class="answer">${esc(r.steps[c.step][1])}</div>`:''}`;primary=button('continue',c.step<r.steps.length-1?(r.randomSeat?'สุ่มผู้กล้าข้อต่อไป':'ส่งต่อ · สุ่ม '+roles[r.roleOrder?.[c.step+1]??c.step+1])+' →':c.room===lastRoom()?'เตรียมโจมตีร่วม →':'ผ่านห้อง →')+button('answer',c.answer?'ซ่อนเฉลย':'เปิดเฉลยบน TV');}}
else if(phase==='clear'){body=`<h1>${c.room<bossStart()?'ผ่านอุปสรรค!':'เกราะอัศวินแตกออก!'}</h1><p>${c.room<bossStart()?'พลังของทีมเปิดทางเดินต่อแล้ว':'เขายังต้านอำนาจแกนกลางอยู่… เราต้องช่วยปลดตราให้ครบ'}</p>${seats()}${c.version>=3&&c.room===0?'<p class="mission">รางวัลผ่านด่านแรก: ทุก Party ได้ผลึก +30 วินาที ใช้ได้หนึ่งครั้งในห้องถัดไป เวลาที่เพิ่มใช้ร่วมกันทั้งห้อง</p>':''}`;primary=button('nextroom','กลับแผนที่ · เดินทางต่อ');}
else if(phase==='final'){body='<h1>ทุกคณะ รวมพลัง!</h1><p class="story-copy">วงเวทเบรกพร้อมแล้ว ผู้พิทักษ์ชูโล่ให้สัญญาณ จอมเวททุกทีมเตรียมผนึกเครื่องจักร</p>';primary=button('attack','รวมพลัง · FINAL ATTACK');}
else if(phase==='chanceSeats'){body='<h1>ผู้กล้าทุกคน เตรียม Final Chance</h1><p>วางคัมภีร์ร่วมกัน ทุก Party ส่งตัวแทนอธิบายเครื่องหมายและหน่วย • โจทย์ยังผนึกอยู่ • มีเวลา 2 นาที</p>';primary=button('chanceready','ทุกทีมพร้อม · เปิดภารกิจสุดท้าย');}
else if(phase==='chanceTask'){body='<h1>FINAL CHANCE</h1><span id="clock" class="timer">'+time(s.remaining)+'</span><div class="motion-question">กำหนดขวาเป็นบวก อัศวินลดความเร็วจาก +10 เป็น 0 m/s ใน 5 s ด้วยความเร่งคงตัว จงหา a และ s พร้อมอธิบายเครื่องหมายและหน่วย</div>';primary=button('chancelock','ล็อกคำตอบ · ตรวจคำอธิบาย')+button('pause',s.running?'หยุดเวลา':'เดินเวลาต่อ')+button('time','+30 วินาที');}
else if(phase==='chance'){body=`<h1>FINAL CHANCE · ปลดตราสุดท้าย</h1><div class="motion-question">อัศวินลดความเร็วจาก +10 เป็น 0 m/s ใน 5 s ด้วยความเร่งคงตัว จงหา a และ s พร้อมอธิบายเครื่องหมาย</div><p>ทั้งห้องช่วยกัน ครูให้แต่ละ Party อธิบายจากกระดาษก่อนยืนยัน • ตรวจเครื่องหมาย หน่วย และวิธีหาการกระจัด</p><div class="mark-grid">${s.parties.map(p=>`<section><b>${esc(p.name)}</b>${button('chanceyes',c.chanceMarks[p.id]===true?'✓ อธิบายผ่าน':'อธิบายผ่าน',`data-id="${p.id}"`)}${button('chanceno',c.chanceMarks[p.id]===false?'ยังไม่ผ่าน ✓':'ยังไม่ผ่าน',`data-id="${p.id}"`)}</section>`).join('')}</div>`;primary=button('chancefinish','ยืนยันการผนึก',s.parties.some(p=>c.chanceMarks[p.id]===undefined)?'disabled':'');}
else if(['victory','survived'].includes(phase)){body=`<h1>${phase==='victory'?'ปลดปล่อยผู้พิทักษ์สำเร็จ!':'อพยพถึงจุดพักแล้ว'}</h1><p class="story-copy">${phase==='victory'?'“ข้าไม่ได้ต้องการทำร้ายพวกเจ้า… แกนกลางกำลังเสีย ผู้รักษาสมดุลยึดมันไว้เพียงลำพัง” อัศวินมอบผลึกนำทาง ก่อนเปิดประตูสู่ Camp':'เครื่องจักรยังถูกผนึกไม่หมด แต่อัศวินช่วยเปิดทางให้ทุกคนถอยไปตั้งหลักที่ Camp ทุกทีมยังอยู่ในการผจญภัย'}</p>`;primary=button('camp','เข้าสู่ Camp แสงดาว →');}
else if(phase==='camp'){body=`<h1>Camp ใต้กลุ่มดาว</h1><p>พักจริงก่อนเดินทางต่อ • ไม่มีเวลานับถอยหลัง • ผลึกจากด่านแรกใช้เพิ่มเวลาร่วมทั้งห้องได้หนึ่งครั้งต่อ Party • ตรวจสัมภาระก่อนขึ้นหอต่อ</p><div class="campaign-parties">${s.parties.map(p=>`<section class="party"><h2>${esc(p.name)}</h2><p>★ ${p.score}</p>${button('loot',c.loot[p.id]==='used'?'✓ ใช้ช่วยทีมแล้ว':c.loot[p.id]?'◇ ผลึกพร้อมใช้ในบทถัดไป':'รับผลึกสำหรับบทถัดไป',`data-id="${p.id}" ${c.loot[p.id]?'disabled':''}`)}</section>`).join('')}</div><p>จบชุดทดลองบทแรก • บทปล่องผลึกและ Equation Keeper จะพัฒนาต่อจากผลทดลองนี้</p>`;primary=button('report','สรุปผลงานบทแรก');}
else if(phase==='report'){body=`<h1>บันทึกคณะผู้กล้า · บทที่ 1</h1><p>ผ่านการตรวจ ${c.records.length} ขั้น • ${c.hp===0?'ช่วยผู้พิทักษ์สำเร็จ':'ยังต้องฝึกก่อนกลับไปช่วยผู้พิทักษ์'} • ผลเป็นระดับ Party</p><div class="campaign-parties">${s.parties.map(p=>{const rs=c.records.flatMap(x=>x.results.filter(r=>r.party===p.id));return `<section class="party"><h2>${esc(p.name)}</h2><p>★ ${p.score}</p><p>ถูกครั้งแรก ${rs.filter(x=>x.correct).length}/${rs.length} • Recovery ${rs.filter(x=>x.recovery).length}</p></section>`;}).join('')}</div><h2>พื้นฐานก่อนออกเดินทาง</h2><p>คิดเลข: ลำดับการคำนวณ จำนวนลบ เศษส่วน เลขยกกำลัง • สมการ: ทำสิ่งเดียวกันทั้งสองข้าง แทนกลับตรวจ และจัดรูปสูตร</p><h2>ศาสตร์ทั้งห้าที่ใช้</h2><p>v = u + at • s = ut + ½at² • v² = u² + 2as • s = vt − ½at² • s = ((u+v)/2)t</p><p>ใช้เมื่อความเร่งคงตัว • กำหนดทิศบวกทุกครั้ง • Final Chance: a = −2 m/s², s = +25 m</p><p>ต่อไป: ปล่องส่งผลึก → แมงมุมกระจกเวลา → ยอดหอ Equation Keeper (ยังไม่เปิดในชุดนี้)</p>`;primary=button('camp','กลับ Camp');}
if(c.version>=3&&c.room===lastRoom()&&['intro','seats','task'].includes(phase))body+='<p class="mission">PARTY LINK · '+partyLinks()+'</p>';
if(c.version>=4&&['chanceTask','chance'].includes(phase))body+=taskFigure();
$('app').innerHTML=`<main class="shell campaign"><header class="top"><div><div class="brand">ASTRA · MOTION CHRONICLES / บทที่ 1</div><h2>${esc(s.name||"Physics Math Bootcamp")}</h2></div><div class="buttons">${button('tv',c.tv?'กลับแผงครู':'โหมดสอน TV')}${btn('fullscreen','เต็มจอ')}${btn('export','สำรอง JSON')}${button('undo','Undo',undo.length?'':'disabled')}${btn('new','ห้องใหม่')}</div></header><div class="campaign-stage ${isTask?'working':''}"><section class="campaign-content">${body}</section>${art()}</div>${c.room>=bossStart()&&!['lore','teams'].includes(phase)?`<div class="enemy-status">ผนึกอัศวิน <progress max="100" value="${100-c.hp}"></progress> ${Math.round(100-c.hp)}% · ${c.hp<55?'เปิดจุดอ่อนแล้ว':'ปลดเกราะด้วยสมการ'}</div>`:''}<footer class="campaign-controls"><span>${esc(isTask?r.title:'ครูเป็นผู้เล่าและควบคุมจังหวะ')} · ${s.running?'กำลังจับเวลา':'หยุดเวลา'}</span><div class="buttons">${primary}</div></footer></main>`;
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-campaign]');if(!b||b.disabled)return;e.preventDefault();const a=b.dataset.campaign,before=E.clone(s);try{if(a==='tv'){state().tv=!state().tv;save();render();return;}if(a==='undo'){control(a);return;}undo.push(before);if(undo.length>50)undo.shift();control(a,b.dataset.id);}catch(error){s=before;undo.pop();save();render();notice(error.message);}},true);
return {create,render:renderCampaign,rooms,activeRooms};
})();
