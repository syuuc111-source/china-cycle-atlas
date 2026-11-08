"""Build attributed educational content and reduced J2000/HIP data. Run from repository root."""
import json
from pathlib import Path
from urllib.request import urlopen

ROOT=Path(__file__).resolve().parents[1]
EVIDENCE=ROOT/'evidence'
RAW=ROOT/'.cache'/'mansions'
RAW.mkdir(parents=True,exist_ok=True)
for filename,url in {
 'stellarium-index.txt':'https://raw.githubusercontent.com/Stellarium/stellarium/master/skycultures/chinese/index.json',
 'stars8.json':'https://raw.githubusercontent.com/ofrohn/d3-celestial/master/data/stars.8.json',
}.items():
 if not (RAW/filename).exists():
  with urlopen(url,timeout=60) as response:(RAW/filename).write_bytes(response.read())
OUT=ROOT/'mansions'/'data'
OUT.mkdir(parents=True,exist_ok=True)
groups=[
 dict(id='dragon',name='东方苍龙',short='苍龙',direction='东',season='春',element='木',color='#73edc7',en='AZURE DRAGON',intro='从角宿出发，沿着心宿的赤色星光，一直走到银河边的尾与箕。七宿连成古人想象中的苍龙。',verse='龙的轮廓，藏在七宿之间。'),
 dict(id='tortoise',name='北方玄武',short='玄武',direction='北',season='冬',element='水',color='#83bcff',en='BLACK TORTOISE',intro='斗、牛、女、虚、危、室、壁，名字里有农事、屋宇与生活。龟蛇合体的玄武，是北方的象征。',verse='把人间的生活，安放在天上。'),
 dict(id='tiger',name='西方白虎',short='白虎',direction='西',season='秋',element='金',color='#f6d991',en='WHITE TIGER',intro='从奎娄到觜参，跨过细密的昴星团与醒目的参宿三星。白虎七宿里，藏着许多熟悉的冬夜星光。',verse='一簇微光，三颗并列的星。'),
 dict(id='bird',name='南方朱雀',short='朱雀',direction='南',season='夏',element='火',color='#ff957e',en='VERMILION BIRD',intro='井、鬼、柳、星、张、翼、轸，朱雀展开长翼，横过双子、巨蟹、长蛇与乌鸦等现代星座所在的天区。',verse='张开羽翼，掠过南方长空。')
]
# Each row: id, name, reading, region, anchor label, anchor HIP, overview, astronomy, culture.
rows=[
('jiao','角','jiǎo','室女座','角宿一 · Spica',65474,'苍龙从一对角开始。角宿两颗主要恒星一南一北，明亮的角宿一是进入东方七宿的好路标。','角宿同名星官位于现代室女座。角宿一对应 α Virginis（Spica），另一主要成员为角宿二。宿是一片传统天区，不能用这两颗星的连线圈出完整范围。','“角”在四象叙事中被解释为龙角。《史记·天官书》将角与东方苍龙的叙事相连；这是历史文化解释，不是恒星的物理性质。'),
('kang','亢','kàng','室女座','亢宿一 · κ Virginis',69427,'沿苍龙向东走，来到亢宿。它的星光不算醒目，却承担着把龙角接向龙身的叙事位置。','同名星官由室女座的一组恒星构成，κ Virginis 是常用的辨认参照。古代星官与现代星座的边界不同，亢宿不等于整个室女座。','“亢”常被释为颈项，因而有龙颈的文化解释。《史记·天官书》另有“亢为疏庙”的政治礼制解释，同一星名可以叠加不同意义。'),
('di','氐','dī','天秤座','氐宿一 · α Librae',72622,'氐宿处在苍龙身体的中段。四颗主要恒星构成一个舒展的形状，连接亢宿与房宿。','主要星官在现代天秤座区域。α Librae 的位置可作为辨认起点。此处展示的是星表中的恒星连线，不是对龙形的客观测量。','氐的名称与根基、下部等解释有关，龙胸或前足的说法是常见文化图解，不能当作各时期一致的定义。古籍中的天官体系还赋予它宫廷角色。'),
('fang','房','fáng','天蝎座','房宿一 · π Scorpii',78265,'房宿像一道细长的星门，位于心宿前方。它与心、尾一起，构成苍龙最容易辨认的一段。','主要成员位于现代天蝎座头部一带。π Scorpii 是传统距星资料中常见的对应，本页以它作聚焦参照，不据此计算古代宿界。','《史记·天官书》把房解释为“府”，又有“天驷”的说法。宫室和车马意象体现了古人把地上制度投射到星空的方式。'),
('xin','心','xīn','天蝎座','心宿二 · Antares',80763,'三颗星中间，一颗红色亮星格外醒目。这就是心宿二，古人所说的“大火”通常指向它。','心宿二对应天蝎座 α 星 Antares，是红超巨星。它与火星不是同一天体；火星会在背景恒星间移动，心宿二则属于遥远恒星。','《诗经·豳风·七月》有“七月流火”。这里的“火”通常释为大火星，描述季节性位置变化，不应按现代口语理解为酷热或流星。古代月份也不直接等于公历七月。'),
('wei','尾','wěi','天蝎座','尾宿一 · μ Scorpii',82514,'苍龙的尾巴向银河弯去。尾宿的曲线，与现代天蝎座尾部大致重合，是很有辨识度的一组星。','尾宿位于天蝎座的南部，多个成员沿弧线排列。它靠近银河明亮区域；能否看全与纬度、季节、地平遮挡有关。','把这段星链看成龙尾，是四象系统的形象化读法。古籍又会从后宫等社会秩序解释尾宿，学习时应区分图像联想与占候文本。'),
('ji','箕','jī','人马座','箕宿一 · γ Sagittarii',88635,'苍龙七宿的末尾是一只“簸箕”。箕宿几颗亮星形成敞开的轮廓，名字来自古代扬谷去糠的器具。','同名星官位于现代人马座，γ Sagittarii 是辨认参照。它在银河附近，但星官成员并不因此必然构成真实的物理星团。','《诗经·小雅·大东》写“维南有箕，不可以簸扬”，借天上有器具之名却不能使用来表达诗意。这是名称文化的直接文献例子。'),
('dou','斗','dǒu','人马座','斗宿一 · φ Sagittarii',92041,'这是一把南方的斗，不是北斗七星。斗宿开启玄武七宿，六颗主要恒星在银河旁勾出斗形。','斗宿主要星官位于人马座，通常称“南斗”。北斗位于大熊座区域，二者位置和星官体系不同；不能把“斗宿”按钮当成北斗定位。','《诗经·大东》以“维北有斗，不可以挹酒”借用斗形意象，但诗中“北有斗”不能直接据此判定就是本页的南斗。后世南斗神话另有宗教发展。'),
('niu','牛','niú','摩羯座','牛宿一 · β Capricorni',100345,'牛宿的名字很熟悉，但它并不是日常故事里那颗牛郎星。星宿名与传说中的角色，需要分开认识。','牛宿同名星官主要在摩羯座，β Capricorni 为常用参照。现代俗称牛郎星的河鼓二是天鹰座 α 星 Altair，属于另一个星官。','古籍“牵牛”的指称有历史层次，不能把所有时代文本都机械对应同一颗星。阅读牛郎织女故事时，应核对所用文献与年代。'),
('nv','女','nǚ','宝瓶座','女宿一 · ε Aquarii',102618,'女宿以女性劳作的意象进入星空。它的主要成员比较暗，需要借助周围亮星逐步辨认。','女宿同名星官位于宝瓶座一带，ε Aquarii 可作参照。织女一则是天琴座 α 星 Vega；女宿与织女星官不是同一个对象。','古代名称常见“婺女”等写法。天文学上的女宿、七夕传说里的织女，以及后世神祇身份，是有关联但不能简单合并的层次。'),
('xu','虚','xū','宝瓶座、 小马座','虚宿一 · β Aquarii',106278,'虚宿把两片现代星座连接起来。名字的“虚”给后人留下了城邑、空旷与废墟等不同解释。','虚宿一为宝瓶座 β 星，另一主要成员位于小马座。一个传统星官横跨多个现代星座，正说明两种划分并非一一对应。','《尚书·尧典》有“宵中星虚”的记述，把特定昏中星与季节联系起来。文本成书和天象年代需要专门考证，不能直接把它当作现代观测时间表。'),
('weiw','危','wēi','宝瓶座、飞马座','危宿一 · α Aquarii',109074,'危宿的三角轮廓像屋顶。它接在虚宿之后，把视线带向飞马座大四边形附近。','主要星官跨宝瓶座与飞马座，α Aquarii 是参照星。星图中的连线是帮助识别的约定，不是天空中存在的实体线段。','“危”有高处、屋脊等解释，后世图解常将其理解为屋顶。名称的解释存在文化层次，本页不把它等同现代日常语境中的危险预告。'),
('shi','室','shì','飞马座','室宿一 · α Pegasi',113963,'室与壁一起，在秋夜星空中搭出一座房屋。室宿的两颗主要恒星构成飞马座大四边形的一边。','室宿一与室宿二对应飞马座 α、β 星。与壁宿的两颗星合看，可找到俗称的秋季四边形，但实际可见月份随地点和时刻变化。','《诗经·鄘风·定之方中》中的“定”传统上释为营室。诗把星象与营建活动相联系，体现古人以星定时的经验，而非现代建筑择日算法。'),
('biw','壁','bì','飞马座、仙女座','壁宿一 · γ Pegasi',1067,'室宿旁边是壁宿。两颗主要恒星像另一道屋墙，与室宿共同构成醒目的大四边形。','壁宿一在飞马座，壁宿二在仙女座，展示了中国星官与现代星座的交叉关系。连线只是同名星官的形状，并非整片壁宿天区的边缘。','壁宿常称“东壁”。在古代星官的社会化解释中，它还与图书、文府等意象相连；这些象征不改变恒星的天文学性质。'),
('kui','奎','kuí','仙女座、双鱼座','奎宿一 · η Andromedae',4463,'白虎七宿从一个宽阔的星群开始。奎宿星光较细碎，轮廓比参宿、心宿更难一眼认出。','主要成员分布在仙女座与双鱼座，组成长而不规则的闭合轮廓。这里采用晚期传统星表的现代对应，不能反推每个古代时期都完全相同。','奎常被联系到两股之间或足部等身体意象，后世又衍生出文运崇拜。奎星与魁星名称相近但相关神话、造像与历史不可一概而论。'),
('lou','娄','lóu','白羊座','娄宿一 · β Arietis',8903,'娄宿的几颗主要星聚在一起，构成白虎七宿中较紧凑的一段，可借白羊座附近的亮星寻找。','同名星官位于白羊座。β Arietis 为参照，周边恒星共同形成小型轮廓；一宿所辖区域远不止图上这几颗亮星。','娄的文化解释有聚众、牧养等内容，属于历史星官的象征语言。它与后世“娄金狗”的七曜禽星名称不是同一时期、同一用途的定义。'),
('weiw2','胃','wèi','白羊座','胃宿一 · 35 Arietis',12719,'胃宿名字像身体的一部分，也承载粮食与仓廪的联想。它处在娄宿和昴宿之间。','主要星官位于白羊座，成员不如附近昴星团醒目。35 Arietis 可用作定位参照；肉眼观测需要较暗的天空。','传统解释把胃与消化、收藏粮食联系起来，把身体与社会生活的意象搬上天空。后世占候中的丰歉含义应作为观念史阅读。'),
('mao','昴','mǎo','金牛座','昴宿六 · Alcyone',17702,'一小簇星光，像洒在夜空中的碎银。昴宿的核心对应著名的昴星团，是认识星团的好入口。','昴星团又称 Pleiades、M45，是疏散星团。肉眼能看见几颗取决于视力与环境；“七姐妹”或传统七星说法，不等于星团实际只有七颗成员。','《尚书·尧典》有“日短星昴”。它把星象与冬季节令联系起来；同一颗星在不同世纪的昏中日期还会受到岁差与历法口径影响。'),
('bi','毕','bì','金牛座','毕宿五 · Aldebaran',21421,'毕宿像一张捕猎的网，橙红色的毕宿五格外明亮。它与昴宿都在金牛座附近，却是不同对象。','毕宿五对应 α Tauri（Aldebaran），视方向靠近毕星团。毕宿五是前景恒星，不能因为它落在这幅图形里就认定它属于毕星团。','《诗经·小雅·渐渐之石》有“月离于毕，俾滂沱矣”，保存了月亮与毕宿、降雨之间的传统联想。这是古代观念和经验记述，不是现代天气预报公式。'),
('zi','觜','zī','猎户座','觜宿一 · λ Orionis',26207,'“觜”在宿名中读 zī。它是一组小而紧凑的恒星，位于参宿的上方，常被当作认识参宿时的邻居。','觜宿主要星官在猎户座头部附近，λ Orionis 是参照。它与参宿在赤经上很接近，历史宿距和距星处理需要指定星表与时代。','名称常被解释为鸟喙或觜觿一类形象。识字与读音本身就是传统星名的一部分，不能按日常“嘴”的读法随意替换。'),
('shen','参','shēn','猎户座','参宿二 · Alnilam',26311,'三颗并列的星，是参宿最醒目的标志。再向四周看，明亮的肩与足让整个轮廓立起来。','参宿主要星官位于猎户座。腰带三星为参宿一、二、三；参宿四是 Betelgeuse，参宿七是 Rigel。投影上相近不代表这些恒星在空间里排成平面。','《诗经·唐风·绸缪》写“三星在天”，传统注疏常将其解释为参宿三星；另有解释，不能仅凭诗句唯一还原观测日期。杜甫“动如参与商”则借星象写人生离别。'),
('jing','井','jǐng','双子座','井宿一 · μ Geminorum',30343,'朱雀从一口天上的井开始。井宿几条相交的星线，让人联想到井栏与取水的空间。','主要星官位于双子座，μ Geminorum 为参照。传统连线跨越多颗恒星，和现代双子座人物画法不同。','井常称“东井”，古籍把它纳入水事、政事等象征体系。用生活器物命名星官，是中国传统星空很鲜明的特点。'),
('gui','鬼','guǐ','巨蟹座','鬼宿一 · θ Cancri',41822,'鬼宿周围的星光不强，中间却有一团朦胧的亮斑。暗夜里，它会把目光引向一片星团。','鬼宿同名星官位于巨蟹座，附近的积尸气对应蜂巢星团 M44。积尸气与鬼宿主要四星是相关但不同的命名对象。','“鬼”“积尸”等名称反映古代对这片天区的想象与占候分类。现代天文学把 M44 解释为疏散星团，而不是任何凶兆。'),
('liu','柳','liǔ','长蛇座','柳宿一 · δ Hydrae',42313,'柳宿的星链弯曲舒展，像低垂的柳枝。它位于朱雀七宿的前段，也靠近长蛇座的头部。','主要成员集中在现代长蛇座头部区域，δ Hydrae 是参照。星官与西方长蛇形象各有来源，只是共享同一片真实星空。','传统图解常把柳宿解释成朱雀的喙或头部，另有柳枝般的形状联想。四象的身体部位并非所有文献都给出同样配法。'),
('xing','星','xīng','长蛇座','星宿一 · Alphard',46390,'“星宿”既是通称，也是一宿的专名。这里的星宿，指朱雀七宿中由星宿一带头的一组星。','星宿一对应长蛇座 α 星 Alphard，周围缺少同样明亮的恒星，因此十分突出。搜索“星宿”时，注意区分这一个条目与二十八宿的总称。','古籍也称“七星”。《尚书·尧典》中的“日中星鸟”有古代天文解释传统，但“鸟”如何对应具体星官需要结合注疏，不能当作现代星图按钮的唯一映射。'),
('zhang','张','zhāng','长蛇座','张宿一 · υ¹ Hydrae',48356,'张宿把朱雀的形象继续向东延展。几颗星形成张开的轮廓，名字也让人想到张弓或张网。','同名星官位于长蛇座中部，υ¹ Hydrae 为常用参照。它的星较暗，认星时应从周围已确认的明亮星逐步移动。','“张”的文化图解常与朱雀张开的嗉囊、翅翼等身体意象联系。古代名称释义并非都能被唯一确定，本页保留这种解释上的余地。'),
('yi','翼','yì','巨爵座、长蛇座','翼宿一 · α Crateris',53740,'翼宿展开一大片星光，是二十八宿中同名星官成员较多的一组。朱雀的翅膀在这里舒展。','主要星官跨现代巨爵座与长蛇座。图中连线按所采用的晚期星官资料绘制，增星及不同星表的成员数可能有差异。','王勃《滕王阁序》写“星分翼轸，地接衡庐”，使用了分野观念。分野把天区与地理政治空间对应，是历史解释体系，不是现代地理坐标投影。'),
('zhen','轸','zhěn','乌鸦座','轸宿一 · γ Corvi',59803,'朱雀七宿在轸宿收束。四颗主要恒星勾出一个倾斜的四边形，像一辆天上的车。','主要星官位于现代乌鸦座，γ Corvi 为参照。轸宿之后回到角宿，二十八宿的传统次序形成循环，但每一段的实际宽度并不相同。','“轸”与车的部件有关，古代星官用车驾意象解释它。《滕王阁序》的“翼轸”可作为理解分野的例子，不能据此断言星宿影响某地的兴衰。')
]
src=[
 dict(id='stellarium',title='Stellarium · Chinese sky culture 说明',url='https://github.com/Stellarium/stellarium/blob/master/skycultures/chinese/description.md',kind='星表说明',note='已读全文。介绍星官、距星、宿距与四象，说明采用《仪象考成》《仪象考成续编》及伊世同等现代整理。不是夏商时期星图复原。'),
 dict(id='lines',title='Stellarium · 中国星官连线与 HIP 编号',url='https://github.com/Stellarium/stellarium/blob/master/skycultures/chinese/index.json',kind='开放数据',note='已读取并提取28个同名星官。连线以 HIP 编号关联恒星；所选代表星用于浏览聚焦，不据此建立宿界。数据 CC BY-SA 4.0。'),
 dict(id='stars',title='D3-Celestial · 恒星位置数据',url='https://github.com/ofrohn/d3-celestial',kind='开放数据',note='采用 stars.6.json 及 stars.8.json 中的 HIP、赤经赤纬和视星等。J2000 静态方向示意，不含观测地点、岁差到日期、折射或地平遮挡。'),
 dict(id='moon',title='NASA/NSSDCA · Moon Fact Sheet',url='https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html',kind='现代天文',note='前期已读详细表；恒星月约27.3217日，朔望月约29.53日。它们均不等于严格28日循环。'),
]
name_table=json.loads((EVIDENCE/'mansions-literature-supplement.json').read_text(encoding='utf8'))['normalized_seven_luminaries_animals']
mans=[]
for i,r in enumerate(rows):
 ident,name,reading,region,label,hip,summary,astronomy,culture=r
 m=dict(id=ident,name=name,reading=reading,group=groups[i//7]['id'],number=i+1,region=region,anchor=dict(label=label,hip=hip),summary=summary,astronomy=astronomy,culture=culture,sourceIds=['stellarium','lines'],fullName=name_table[i],luminary=name_table[i][1],animal=name_table[i][2:])
 mans.append(m)
chapters=[
 dict(kicker='01 / 把天空分成可辨认的路标',title='宿，是星空里的驿站。',lead='在漫天恒星之间，古人用二十八组熟悉的星，标记日月与行星经过的位置。',body='“宿”读 xiù。它可以指传统天区，也可以指该天区内同名的主要星官。星官是人们为一组星命名的图形；单颗恒星、星官、宿、现代星座，是四个不同层次。把它们分清，才不会把二十八宿误认成二十八颗星。',fact='28 宿 ≠ 28 颗星 ≠ 28 个现代星座',action='从角宿开始',target='jiao',sources=['stellarium']),
 dict(kicker='02 / 四象与方向',title='七宿连成一象。',lead='东方苍龙、北方玄武、西方白虎、南方朱雀。四组七宿，共同环绕天空。',body='四象的方向、季节与五行，是传统对应关系。它并不表示你此刻抬头，苍龙一定在正东方，也不表示“白虎属秋”就只能在秋夜看见参宿。实际方位随地点、日期与时刻变化。选择下方四象，比较不同的七宿。',fact='四象方位是文化框架，实时方位是观测量',action='走近参宿',target='shen',sources=['stellarium']),
 dict(kicker='03 / 月亮与时间',title='二十八宿，不等于二十八天。',lead='月亮相对恒星绕行一周约27.32天；从一次新月到下一次新月，约29.53天。',body='二十八宿真实宽度不相等，月球的运动速度也在变化，因此不能机械地说“每天恰好走一宿”。传统二十八日值宿表是历法或术数中的排表约定；它与天文学的月亮入宿不是同一个计算问题。',fact='恒星月 27.3217 d　／　朔望月约 29.53 d',action='认识月亮附近的昴宿',target='mao',sources=['moon','stellarium']),
 dict(kicker='04 / 历史证据',title='把星名写在器物上。',lead='战国时期的曾侯乙墓漆箱，保存了成组的二十八宿名称，是理解这套系统的重要物证。',body='墓葬年代通常约定在公元前433年左右。文物能说明该时期已经存在这样的名称体系，不能单凭它推定二十八宿恰好在这一年发明。更早的起源、星名的演变和体系的定型，需要结合其他材料讨论。',fact='目前所见的证据年代，不等于发明年代',action='回到二十八宿总览',target='atlas',sources=['stellarium']),
 dict(kicker='05 / 从星空走进诗句',title='三星在天，是怎样的夜晚？',lead='参宿的腰带三星、心宿的“大火”、诗中的翼轸，让古人的夜空重新变得具体。',body='诗文中的星名可以帮助理解作品，却不总能唯一确定观测日期。例如“三星在天”有传统注疏释为参宿，也有其他解释；“七月流火”的月份和星象须放回古代历法语境。先读诗，再查注，最后才谈天象复原。',fact='辨认星名，是理解文本的起点',action='读参宿的故事',target='shen',sources=['stellarium']),
 dict(kicker='06 / 认识一张会变化的星图',title='星空长在时间里。',lead='星名会演变，星表会修订，地球自转轴也在缓慢改变方向。',body='本网站的星点采用现代J2000参考方向，连线采用Stellarium整理的晚期传统星官。它帮助理解图形与命名，不是某个古代夜晚的复原。若要计算某年某地的月亮入宿，还必须明确距星、时代、岁差、时间尺度和地平坐标。',fact='每幅星图，都有自己的时代与口径',action='查阅全部出处',target='sources',sources=['stellarium','stars','lines'])
]
traditions=[
 dict(id='astronomy',tag='天文 · 测量',title='距星与宿距：古人的天空坐标',text='在传统赤道坐标体系中，距星提供宿的起算参照，天体位置可以用入宿度与去极度描述。宿距是相邻距星之间的角距，各宿不等宽。古制“周天度”也不能在未经说明时直接当作现代360度制；历史上距星与测量结果会变化。',note='本网站不把等分导航环当作真实宿界，也不计算某日期的月亮入宿。',sources=['stellarium']),
 dict(id='symbols',tag='文化 · 分类',title='四象与五行：两个层次的配属',text='四象通常对应东方苍龙、南方朱雀、西方白虎、北方玄武，并联系春夏秋冬及木火金水。五行的“土”在这种五方框架里对应中央，不能为了凑齐颜色而增设“第五象”。每宿全名中的木、金、土、日、月、火、水，则属于另一套七曜配属。',note='四象方位色与每宿的七曜色分别标注，避免把角木蛟的“木”当作角宿恒星的物理属性。',sources=['stellarium']),
 dict(id='luminaries',tag='传统 · 七曜禽星',title='为什么叫角木蛟、心月狐？',text='通行的七曜禽星名称，把宿名、七曜配属和禽兽名组合起来。例如角木蛟、亢金龙、氐土貉、房日兔、心月狐、尾火虎、箕水豹。木金土火水在这里对应五颗可见行星，加上日月构成七曜。它们是配属符号，不表示那些行星永远位于相应星宿。',note='本页展示通行名称用于辨识；完整演变史与不同术数流派不能由一张配表代替。日月使用独立标识，不强行归入五行颜色。',sources=['stellarium']),
 dict(id='fenye',tag='历史 · 分野',title='“星分翼轸”，如何连接天地？',text='分野把天区与地上州国区域建立对应，用于古代政治地理叙述和占候。《滕王阁序》的“星分翼轸，地接衡庐”是著名用例。不同文献、不同历史时期的地理对应可能有差异，不能把某一套分野视为永久不变的地图。',note='分野属于历史知识体系，不能据此证明天区决定地方经济、战争或王朝兴衰。',sources=['stellarium']),
 dict(id='duties',tag='术数 · 值宿',title='二十八日轮值，与真实月亮的位置',text='民间通书常见按日轮值的星宿名称及宜忌。它需要某个起算锚点和排法；同样写“今日某宿”，也可能与按月球实际位置判定的入宿完全不同。没有明确历法、年界、日界、时区和依据时，排表结果不具备可比性。',note='本专题介绍体系差别，不输出择日宜忌或把固定28日轮转伪装成天文观测。',sources=['moon','stellarium']),
 dict(id='sukuyo',tag='宗教 · 宿曜',title='二十七宿与二十八宿，为什么并存？',text='佛教宿曜传统受到印度天文历法和占星传统影响，流传中既涉及二十八宿，也常见二十七宿的用法；某些排法不列牛宿。不能把某个现代宿曜网站的生日算法直接覆盖到中国二十八宿星区上。具体解释需要回到所用经典和历法版本。',note='“中国星官”“佛教宿曜”“现代商业配对算法”分栏理解；同名不保证同一套计算。',sources=['stellarium']),
 dict(id='gods',tag='宗教 · 神话',title='从恒星图形到星君与故事',text='二十八宿在后世宗教和文学中被人格化，出现星君、禽兽形象以及小说角色。神祇名称、造像和故事随时代与文本变化。某一宿的小说情节，应署明作品；不能把小说人物传记倒写成早期天文学起源。',note='恒星、星官图形、四象神兽、星君和小说角色，是可以关联但不能互相替代的知识层。',sources=['stellarium']),
 dict(id='seasons',tag='观测 · 节令',title='昏中星：用一片星空识别季节',text='固定观测地点和傍晚时段，观察哪些恒星在南方中天附近，是古代认识季节的方法之一。《尧典》的星鸟、星火、星虚、星昴常在这一背景下讨论。岁差使恒星与季节的关系缓慢变化，古代记录不能未经校正直接当成今天的观星指南。',note='辨认季节不等于证明气候或经济具有同样的天文周期。',sources=['stellarium']),
]
research=json.loads((EVIDENCE/'mansions-sources-new.json').read_text(encoding='utf8'))
for s in research['sources']:
 src.append(dict(id=s['id'],title=s['title'],url=s['url'],kind='馆方研究' if s['id']=='hubei_lacquer' else '历史文献',note=s['status']+'。'+s['supports']+' '+s['limits']))
extra_path=EVIDENCE/'mansions-literature-supplement.json'
if extra_path.exists():
 for s in json.loads(extra_path.read_text(encoding='utf8'))['sources']:
  if not any(x['id']==s['id'] for x in src):src.append(dict(id=s['id'],title=s['title'],url=s['url'],kind='历史文献',note='已读相关篇章。'+s.get('context',s.get('supports',''))+' '+s.get('limits','')))
quotes={q['name']:q for q in research['mansion_cultural_quotes']}
for m in mans:
 q=quotes.get(m['name'])
 if q:
  m['culturalQuote']=q['quote'];m['quoteNote']=q['note'];m['quoteSource']=q['source'];m['sourceIds'].append(q['source'])
 if m['id'] in ['xin','ji','dou','shi','mao','bi','shen'] and 'shijing' not in m['sourceIds']:m['sourceIds'].append('shijing')
 m['sourceIds'].append('yanqin_names')
 appendix=json.loads(extra_path.read_text(encoding='utf8'))
 full=appendix['normalized_seven_luminaries_animals'][m['number']-1]
 m['fullName']=full;m['luminary']=full[1];m['animal']=full[2:]
 specific={'xin':['shijing_qiyue'],'ji':['shijing_dadong'],'dou':['shijing_dadong'],'xu':['shangshu_yaodian'],'shi':['shijing_ding'],'mao':['shangshu_yaodian'],'bi':['shijing_jianjian'],'shen':['shijing_choumou','dufu_weiba'],'xing':['shangshu_yaodian'],'yi':['wangbo_tengwang'],'zhen':['wangbo_tengwang']}
 m['sourceIds'].extend(specific.get(m['id'],[]))
chapters[3]['sources']=['hubei_lacquer','shiji_tianguan']
chapters[3]['body']='这件战国早期漆箱的盖面中心写“斗”，周围写二十八宿名，左右配有龙虎图。它能说明该时期已经存在完整名称体系，不能单凭它推定二十八宿恰好在这一时期发明。更早的起源、星名的演变和体系的定型，需要结合其他材料讨论。'
chapters[4]['sources']=['shijing','shiji_tianguan']
for t in traditions:
 if t['id']=='sukuyo':t['sources']=['xiuyao'];t['text']='《宿曜经》及唐代修注中既涉及二十八宿，也有二十七宿与三九法；原注明言“唐用二十八宿西国除牛宿”，又指出经文说星与中国不同。因此不能把被省略的印度星群直接等同中国牛宿的现代星位。具体排法需要回到所用文本、历法和版本。'
 if t['id']=='duties':t['sources']=['xiuyao','moon']
 if t['id']=='fenye':t['sources']=['shiji_tianguan']
 if t['id']=='gods':t['text']='二十八宿在后世宗教和文学中被人格化，出现星君、禽兽形象以及小说角色。神祇名称、造像和故事随时代与文本变化。《封神演义》第九十九回的封神叙事即包含二十八宿。小说角色应署明作品，不能把小说当作统一宗教正典或早期天文学起源。'
 if t['id']=='gods':t['sources']=['fengshen_personification']
 if t['id']=='luminaries':t['sources']=['yanqin_names','xiuyao'];t['note']='采用《演禽通纂》名例，氐土狢规范为氐土貉、嘴火猴规范为觜火猴，壁水貐保留该本字形。日月独立标识，不强行归入五行。不能由这张表倒推配属的起源年代。'
 if t['id']=='fenye':t['sources'].append('wangbo_tengwang')
 if t['id']=='seasons':t['sources']=['shangshu_yaodian','stellarium']
 if t['id']=='symbols':t['sources'].append('yanqin_names')
data=dict(title='二十八宿',version='2026.11',groups=groups,mansions=mans,sources=src,chapters=chapters,traditions=traditions)
(OUT/'content.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf8')

catalog=json.loads((RAW/'stellarium-index.txt').read_text(encoding='utf8'))
starfile=RAW/'stars8.json'
allstars=json.loads(starfile.read_text(encoding='utf8'))['features']
wanted={m['name']+'宿':m for m in mans}
asterisms=[dict(id=wanted[c['common_name']['native']]['id'],name=c['common_name']['native'],group=wanted[c['common_name']['native']]['group'],lines=c['lines']) for c in catalog['constellations'] if c['common_name'].get('native') in wanted]
needed={hip for c in asterisms for line in c['lines'] for hip in line}|{m['anchor']['hip'] for m in mans}
stars=[[s['id'],*s['geometry']['coordinates'],s['properties']['mag']] for s in allstars if s['properties']['mag']<=5.4 or s['id'] in needed]
names={}
for hip in needed:
 for entry in catalog.get('common_names',{}).get('HIP '+str(hip),[]):
  if entry.get('native'):names[str(hip)]=entry['native'];break
sky=dict(epoch='J2000',projection='orthographic',stars=stars,asterisms=asterisms,names=names,attribution='Chinese asterisms: Stellarium / Karrie Berglund, Sun Shuwei, CC BY-SA 4.0. Stellar positions: D3-Celestial, Hipparcos-derived catalog.')
(OUT/'sky.json').write_text(json.dumps(sky,ensure_ascii=False,separators=(',',':')),encoding='utf8')
print('Built',len(mans),'mansions,',len(stars),'stars,',len(asterisms),'asterisms')
