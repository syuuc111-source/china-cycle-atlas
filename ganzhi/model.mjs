export const STEMS='甲乙丙丁戊己庚辛壬癸';
export const BRANCHES='子丑寅卯辰巳午未申酉戌亥';
export const STEM_IDS=['jia','yi','bing','ding','wu-stem','ji','geng','xin','ren','gui'];
export const BRANCH_IDS=['zi','chou','yin','mao','chen','si','wu','wei','shen','you','xu','hai'];
export const ELEMENTS={木:'#348b50',火:'#d7443e',土:'#e88328',金:'#c9a32c',水:'#307dc0'};
export const NAYIN='海中金 炉中火 大林木 路旁土 剑锋金 山头火 涧下水 城头土 白蜡金 杨柳木 泉中水 屋上土 霹雳火 松柏木 长流水 沙中金 山下火 平地木 壁上土 金箔金 覆灯火 天河水 大驿土 钗钏金 桑柘木 大溪水 沙中土 天上火 石榴木 大海水'.split(' ');
export const mod=(x,n)=>(x%n+n)%n;
export const cycleDelta=(from,to)=>mod(to-from+30,60)-30;
export function cycleAt(index){
 if(!Number.isSafeInteger(index))throw new TypeError('序号必须为安全整数');
 const i=mod(index,60),g=i%10,b=i%12,head=Math.floor(i/10)*10,nayin=NAYIN[Math.floor(i/2)];
 return {index:i,name:STEMS[g]+BRANCHES[b],stem:STEMS[g],branch:BRANCHES[b],stemElement:'木木火火土土金金水水'[g],branchElement:'水土木木土火火土金金土水'[b],polarity:i%2?'阴':'阳',nayin,nayinElement:nayin.slice(-1),xunHead:'甲'+BRANCHES[head%12],voidBranches:[BRANCHES[(head+10)%12],BRANCHES[(head+11)%12]]};
}
export function hourPillar(dayStemIndex,hour){
 if(!Number.isInteger(dayStemIndex)||dayStemIndex<0||dayStemIndex>9||!Number.isInteger(hour)||hour<0||hour>23)throw new RangeError('日干或小时超出范围');
 const b=Math.floor((hour+1)/2)%12,g=(dayStemIndex%5*2+b)%10;return STEMS[g]+BRANCHES[b];
}
export const CYCLES=Array.from({length:60},(_,i)=>cycleAt(i));
export const cycleIndex=name=>CYCLES.findIndex(x=>x.name===name);
export const RELATIONS={
 '五行相生':['木→火','火→土','土→金','金→水','水→木'],
 '五行相克':['木→土','土→水','水→火','火→金','金→木'],
 '天干五合':['甲己','乙庚','丙辛','丁壬','戊癸'],
 '地支六合':['子丑','寅亥','卯戌','辰酉','巳申','午未'],
 '地支六冲':['子午','丑未','寅申','卯酉','辰戌','巳亥'],
 '地支三合':['申子辰','亥卯未','寅午戌','巳酉丑'],
 '地支三会':['寅卯辰','巳午未','申酉戌','亥子丑'],
 '地支六害':['子未','丑午','寅巳','卯辰','申亥','酉戌'],
 '地支六破':['子酉','卯午','辰丑','戌未','寅亥','巳申'],
 '地支相刑':['寅巳申','丑戌未','子卯','辰辰','午午','酉酉','亥亥']
};
