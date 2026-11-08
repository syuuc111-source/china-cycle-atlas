const assert=require('node:assert/strict');
(async()=>{
 const {createCamera,shortestAngle}=await import('../mansions/motion.mjs');
 const rad=d=>d*Math.PI/180;
 assert.ok(Math.abs(shortestAngle(rad(350),rad(10))-rad(20))<1e-9);
 const camera=createCamera({angle:rad(350),tilt:0,zoom:1,roll:0});
 camera.to({angle:rad(10),tilt:.3,zoom:1.4,roll:.1},0,1000);
 assert.equal(camera.sample(0).zoom,1,'No jump at start');
 const midway=camera.sample(500);
 assert.ok(midway.zoom>1&&midway.zoom<1.4);
 assert.ok(midway.angle>rad(350)&&midway.angle<rad(370));
 camera.to({angle:rad(90),tilt:-.2,zoom:1,roll:0},500,900);
 assert.deepEqual(camera.sample(500),midway,'Retarget from actual in-flight pose');
 const end=camera.sample(1400);assert.equal(end.zoom,1);assert.equal(end.tilt,-.2);
 assert.ok(Math.abs(Math.sin(end.angle)-1)<1e-9);assert.equal(camera.moving,false);
 camera.to({angle:0,tilt:0,zoom:1.2,roll:0},1500,0);assert.equal(camera.sample(1500).zoom,1.2);assert.equal(camera.moving,false);
 camera.to({angle:1,tilt:.5,zoom:1.4,roll:0},2000,1000);camera.finish();assert.equal(camera.sample(2100).zoom,1.4);assert.equal(camera.moving,false);
 console.log('PASS: shortest arc, progressive camera, interrupted retarget, exact final pose, reduced-motion snap');
})().catch(e=>{console.error(e);process.exit(1)});
