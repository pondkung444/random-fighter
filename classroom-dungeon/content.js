(function(root){
const rows=[
['Gate of Numbers','8 − 3(2)','2','คูณก่อนลบ: 8 − 6 = 2','Arithmetic',120],
['Gate of Numbers','−4 + 7 − 5','−2','คำนวณซ้ายไปขวา: 3 − 5 = −2','Sign',120],
['Gate of Numbers','½ + ¼','¾','ทำส่วนให้เท่ากัน: 2/4 + 1/4','Fraction',150],
['Gate of Numbers','¾ × 8','6','3 × 8 ÷ 4 = 6','Fraction',150],
['Gate of Numbers','Mini Boss: 2(6 − 3)² ÷ 3','6','วงเล็บ → ยกกำลัง → คูณ/หาร: 2 × 9 ÷ 3','Arithmetic',240,'relay'],
['Equation Prison','x + 7 = 15 จงหา x','x = 8','ลบ 7 ทั้งสองข้าง','Equation',150],
['Equation Prison','3x = 21 จงหา x','x = 7','หารทั้งสองข้างด้วย 3','Equation',150],
['Equation Prison','2x + 5 = 17 จงหา x','x = 6','ลบ 5 ทั้งสองข้าง แล้วหารด้วย 2','Equation',180],
['Equation Prison','v = s/t จัดรูปหา s และ t','s = vt, t = s/v','คูณด้วย t ทั้งสองข้าง; หารด้วย v เมื่อ v ≠ 0','Equation',210],
['Equation Prison','Mini Boss: E = ½mv² จัดรูปหา m','m = 2E/v²','คูณ 2 แล้วหารด้วย v² เมื่อ v ≠ 0','Equation',240,'relay'],
['Tower of Powers','10² และ 10⁻² มีค่าเท่าใด','100 และ 0.01','10⁻² = 1/10²','Exponent',120],
['Tower of Powers','5000 = 5 × 10^? และ 0.003 = 3 × 10^?','3 และ −3','ตรวจขนาดของจำนวน','Exponent',150],
['Tower of Powers','(2 × 10³)(3 × 10²)','6 × 10⁵','คูณสัมประสิทธิ์ บวกเลขชี้กำลัง','Exponent',150],
['Tower of Powers','Mini Boss: (8 × 10⁶)/(2 × 10²)','4 × 10⁴','หารสัมประสิทธิ์ ลบเลขชี้กำลัง','Exponent',240,'relay'],
['Tower of Powers','Trap: (3 × 10⁴)²','9 × 10⁸','ยกกำลังทั้ง 3 และ 10⁴','Exponent',150],
['Alchemist Lab','F = ma • m = 2.5 kg, a = 4 m/s² หา F','10 N','F = (2.5)(4) = 10 kg·m/s² = 10 N','Substitution',210,'relay'],
['Alchemist Lab','E = ½mv² • m = 4 kg, v = 3 m/s หา E','18 J','E = ½(4)(3²) = 18 J','Unit',210,'relay'],
['Alchemist Lab','Error Hunt: NPC เขียน E = ½(4)(3) = 6 J ผิดตรงไหน?','ลืมยกกำลังสองความเร็ว; E = 18 J','วงจุดผิด แก้เป็น ½(4)(3²) แล้วอธิบาย','Substitution',240,'recovery'],
['Equation Keeper','BREAK THE ARMOR • v = s/t ให้ v = 12 m/s, t = 5 s หา s','60 m','s = vt = 12 × 5 = 60 m','Equation',300,'armor'],
['Equation Keeper','RANDOM HERO • F = ma ให้ F = 6 × 10³ N, a = 2 × 10¹ m/s² หา m','3 × 10² kg','m = F/a = (6/2) × 10^(3−1) = 300 kg','Exponent',300,'hero'],
['Equation Keeper','PARTY LINK • E = ½mv² ให้ E = 4 × 10⁴ J, v = 2 × 10² m/s หา m','2 kg','ทีมแรกจัดรูป m = 2E/v² → คู่ทีมแทนค่า: 8×10⁴ / 4×10⁴ = 2 kg','Substitution',300,'link'],
['Equation Keeper','ABSOLUTE EQUATION • ใช้ข้อมูลเดิม ส่งงานทั้งห้อง: จัดรูป → แทนค่า → คำนวณ → ตรวจหน่วย','m = 2 kg','m = 2E/v² = 2(4×10⁴)/(2×10²)² = 2 kg; J/(m²/s²) = kg','Unit',300,'core']
];
const questions=rows.map((r,i)=>({id:'q'+(i+1),floor:r[0],prompt:r[1],answer:r[2],solution:r[3],tag:r[4],seconds:r[5],mode:r[6]||'normal'}));
const reserve=[['−3² และ (−3)²','−9 และ 9','Sign'],['18 − 3(4)','6','Arithmetic'],['P = W/t จัดรูปหา W','W = Pt','Equation'],['F = ma จัดรูปหา a','a = F/m เมื่อ m ≠ 0','Equation'],['(5×10²)/(2×10⁻¹)','2.5×10³','Exponent'],['0.00042 ในรูปวิทยาศาสตร์','4.2×10⁻⁴','Exponent'],['s = vt ให้ v = 3 m/s, t = 4 s','12 m','Unit'],['FINAL CHANCE: F = ma ให้ m = 2 kg, a = 5 m/s²','10 N','Substitution']].map((r,i)=>({id:'reserve'+i,floor:'Bonus Chamber',prompt:r[0],answer:r[1],solution:r[1],tag:r[2],seconds:180,mode:i===7?'chance':'bonus'}));
const api={questions,reserve,roles:['Solver','Equation','Calculator','Checker'],tags:['Arithmetic','Fraction','Sign','Equation','Exponent','Substitution','Unit']};
if(typeof module!=='undefined')module.exports=api;else root.DungeonContent=api;
})(globalThis);
