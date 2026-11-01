const {chromium}=require('playwright'),fs=require('fs'),path=require('path'),A=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({headless:true}),page=await browser.newPage({viewport:{width:1180,height:820}}),errors=[],missing=[];page.on('pageerror',e=>errors.push(e.message));
await page.route('https://dungeon.test/**',async rt=>{const p=new URL(rt.request().url()).pathname,f=path.join(__dirname,'..',p.slice(1));try{await rt.fulfill({contentType:p.endsWith('.js')?'application/javascript':p.endsWith('.css')?'text/css':p.endsWith('.webp')?'image/webp':p.endsWith('.png')?'image/png':'text/html',body:fs.readFileSync(f)});}catch{missing.push(p);await rt.fulfill({status:404,body:'missing'});}});
await page.goto('https://dungeon.test/classroom-dungeon/dragon.html');
const click=a=>page.locator('[data-a="'+a+'"]').first().click();
await page.locator('#names').fill(Array.from({length:7},(_,i)=>'คนที่ '+i).join('\n'));await click('manual');A.equal(await page.locator('[data-student]').count(),7);A.equal(await page.locator('.roster-groups article').count(),5);
await click('begin');A.equal(await page.evaluate(()=>game),null);
for(let i=0;i<7;i++)await page.locator('[data-student="'+i+'"]').selectOption('0');await click('begin');A.equal(await page.evaluate(()=>game),null);
const assignment=[0,1,2,3,4,4,0];for(let i=0;i<7;i++)await page.locator('[data-student="'+i+'"]').selectOption(String(assignment[i]));
await page.locator('#teamname4').fill('มังกรทอง');await page.locator('#teamname4').dispatchEvent('change');A.equal(await page.locator('[data-student="0"] option[value="4"]').innerText(),'มังกรทอง');
await page.locator('[data-student="0"]').selectOption('1');assignment[0]=1;
for(const [w,h] of [[1180,820],[1920,1080],[390,844]]){await page.setViewportSize({width:w,height:h});A(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:'/tmp/five-setup-'+w+'.png',fullPage:true,animations:'disabled'});}
await page.setViewportSize({width:1180,height:820});await click('begin');A.equal(await page.evaluate(()=>game.teams.length),5);
const actual=await page.evaluate(()=>game.teams.map(t=>t.members.map(m=>m.name)));for(let i=0;i<5;i++)A.deepEqual(actual[i],assignment.flatMap((g,j)=>g===i?['คนที่ '+j]:[]));A.equal(actual.flat().length,7);
for(let i=0;i<27;i++){
await click('draw');if(i===2)await page.evaluate(()=>{game.event={...game.event,kind:'raid',mode:'ring',pairs:game.teams.map((t,i)=>[t.id,'t'+((i+1)%5)])};render();});
A.equal(await page.locator('[data-a=lock]').count(),0);await click('ack');
if(await page.locator('[id^=route-]').count())for(let j=0;j<5;j++)await page.locator('#route-t'+j).selectOption(j%2?'risk':'safe');
await click('lock');A.equal(await page.locator('.mark-grid article').count(),5);A.equal(await page.locator('.solution').count(),0);
if(i===0){await click('eventinfo');A.equal(await page.locator('dialog').count(),1);await page.locator('dialog form button').click();await page.reload();A.equal(await page.evaluate(()=>game.teams.length),5);}
for(let j=0;j<5;j++)await page.locator('[data-a="'+(j%2?'false':'true')+'"][data-id=t'+j+']').click();
await click('reveal');await click('settle');while(await page.locator('[data-a=chest]').count())await click('chest');if(i===0){await page.screenshot({path:'/tmp/five-game-ipad.png',fullPage:true,animations:'disabled'});await click('undo');A.equal(await page.evaluate(()=>game.phase),'answer');await click('settle');}
await click('next');
}A.equal(await page.evaluate(()=>game.phase),'finished');await page.reload();A.equal(await page.evaluate(()=>game.history.length),27);A.equal(await page.evaluate(()=>game.teams.length),5);A.deepEqual(errors,[]);A.deepEqual(missing,[]);
await page.evaluate(()=>{game=null;render();});await click('demo');await click('groups');A.equal(await page.locator('[data-student]').count(),20);await click('begin');A.deepEqual(await page.evaluate(()=>game.teams.map(t=>t.members.length)),[4,4,4,4,4]);
await browser.close();console.log('Browser: manual assignment/moving/renaming, unassigned/empty group guards, five assets, iPad/TV/mobile, 27 rounds, undo/reload and optional random grouping passed');
})().catch(e=>{console.error(e);process.exit(1)});
