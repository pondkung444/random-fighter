/* Copy this file, change id/title/content, then load it after motion-equations.js in index.html.
   This example is intentionally NOT loaded as a selectable classroom lesson. */
DungeonPacks.register({
 schemaVersion:1,id:'new-lesson',revision:'1',title:'ชื่อชุดใหม่',description:'อธิบายหัวข้อและกลุ่มผู้เรียน',
 lore:[['เริ่มภารกิจ','ทีมผู้กล้าต้องไขกุญแจด้วยความรู้ของบทนี้']],
 bossStartRoom:1,rewardAfterRoom:0,
 summary:['ทักษะของชุดใหม่นี้'],nextNote:'สรุปสิ่งที่เรียนรู้ร่วมกัน',
 finalChance:{given:'x + 2 = 5',ask:'จงหาค่า x',answer:'x = 3',seconds:90,diagram:{kind:'balance',left:'x + 2',right:'5'}},
 rooms:[
  {title:'ฝึกพื้นฐาน',kind:'ฝึก',story:'เตรียมกุญแจเข้าห้อง',goal:'ฝึกแก้สมการ',randomSeat:true,
   steps:[{given:'x + 2 = 5',ask:'จงหาค่า x',answer:'ลบ 2 ทั้งสองข้าง ได้ x = 3',instruction:'เขียนวิธีทำและแทนกลับตรวจ',role:0,seconds:90,diagram:{kind:'balance',left:'x + 2',right:'5',caption:'สมการทั้งสองข้างมีค่าเท่ากัน'}}]},
  {title:'รวมพลัง',kind:'บอส',story:'ใช้กุญแจปลดผนึก',goal:'อธิบายความคิด',randomSeat:false,
   steps:[{given:'3x = 12',ask:'จงหาค่า x และอธิบายวิธีทำ',answer:'หาร 3 ทั้งสองข้าง ได้ x = 4',instruction:'ทีมช่วยกัน ผู้ได้รับเลือกเป็นผู้เขียน',role:1,seconds:90,diagram:{kind:'cards',items:['3 × x = 12','หา x'],caption:'แสดงความสัมพันธ์ที่ต้องแก้'}}]}
 ]
});
