"""Verified source locations; original prose lives in ganzhi_herb_profiles.py."""

HERB_SOURCE_IDS = {'桂枝': ['herb-hkbu-b00138'], '芍药': ['herb-hkbu-b00026', 'herb-hkbu-b00041'], '甘草': ['herb-hkbu-b00129'], '大枣': ['herb-hkbu-b00171'], '麻黄': ['herb-hkbu-b00278'], '附子': ['herb-hkbu-b00058'], '乌头': ['herb-hkbu-b00046', 'herb-hkbu-b00037'], '干姜': ['herb-hkbu-b00013'], '生姜': ['herb-hkbu-b00012'], '细辛': ['herb-hkbu-b00112'], '吴茱萸': ['herb-hkbu-b00212'], '柴胡': ['herb-hkbu-b00038'], '半夏': ['herb-hkbu-b00132'], '黄芪': ['herb-hkbu-b00071'], '白术': ['herb-hkbu-b00032'], '茯苓': ['herb-hkbu-b00356'], '猪苓': ['herb-hkbu-b00360'], '泽泻': ['herb-hkbu-b00123'], '滑石': ['herb-hkbu-b00401'], '防己': ['herb-hkbu-b00055'], '葛根': ['herb-hkbu-b00063'], '栝蒌根': ['herb-hkbu-b00104'], '黄连': ['herb-hkbu-b00070'], '黄芩': ['herb-hkbu-b00072'], '黄柏': ['herb-hkbu-b00346'], '栀子': ['herb-hkbu-b00224'], '大黄': ['herb-hkbu-b00006'], '芒硝': ['herb-hkbu-b00404'], '厚朴': ['herb-hkbu-b00347'], '枳实': ['herb-hkbu-b00223'], '栝蒌实': ['herb-hkbu-b00177'], '薤白': ['herb-hkbu-b00111'], '石膏': ['herb-hkbu-b00412'], '知母': ['herb-hkbu-b00125'], '龙骨': [], '牡蛎': ['herb-hkbu-b00383'], '人参': ['herb-hkbu-b00002'], '麦门冬': ['herb-hkbu-b00084'], '阿胶': ['herb-hkbu-b00373'], '地黄': ['herb-hkbu-b00050'], '当归': ['herb-hkbu-b00049'], '川芎': ['herb-hkbu-b00047'], '牡丹皮': ['herb-hkbu-b00349'], '杏仁': ['herb-hkbu-b00216'], '五味子': ['herb-hkbu-b00211'], '桔梗': ['herb-hkbu-b00076'], '葶苈子': ['herb-hkbu-b00208'], '桃仁': ['herb-hkbu-b00207'], '䗪虫': ['herb-hkbu-b00396'], '水蛭': ['herb-hkbu-b00392']}

RECORDS = {'B00138': '桂枝', 'B00026': '白芍', 'B00041': '赤芍', 'B00129': '甘草', 'B00171': '大枣', 'B00278': '麻黄', 'B00058': '附子', 'B00046': '川乌', 'B00037': '草乌', 'B00013': '干姜', 'B00012': '生姜', 'B00112': '细辛', 'B00212': '吴茱萸', 'B00038': '柴胡', 'B00132': '半夏', 'B00071': '黄芪', 'B00032': '白术', 'B00356': '茯苓', 'B00360': '猪苓', 'B00123': '泽泻', 'B00401': '滑石', 'B00055': '防己', 'B00063': '葛根', 'B00104': '天花粉', 'B00070': '黄连', 'B00072': '黄芩', 'B00346': '黄柏', 'B00224': '栀子', 'B00006': '大黄', 'B00404': '芒硝', 'B00347': '厚朴', 'B00223': '枳实', 'B00177': '瓜蒌', 'B00111': '薤白', 'B00412': '石膏', 'B00125': '知母', 'B00383': '牡蛎', 'B00002': '人参', 'B00084': '麦冬', 'B00373': '阿胶', 'B00050': '地黄', 'B00049': '当归', 'B00047': '川芎', 'B00349': '牡丹皮', 'B00216': '苦杏仁', 'B00211': '五味子', 'B00076': '桔梗', 'B00208': '葶苈子', 'B00207': '桃仁', 'B00396': '土鳖虫', 'B00392': '水蛭'}

def add_sources(sources):
    for pid,name in RECORDS.items():
        identity_only=name=='芒硝'
        sources.append(dict(id='herb-hkbu-'+pid.lower(),title=name+' · 中药材资料',author='香港浸会大学中医药学院、图书馆',url='https://sys01.lib.hkbu.edu.hk/cmed/mmid/detail.php?lang=chs&pid='+pid,locator='名称、来源'+('；本条只核对身份信息' if identity_only else '、性味、传统功效及页面载有的炮制品'),supports=['药材来源及名称辨析'] if identity_only else ['药材名称和来源','传统功效与制品区别'],note='数据库的功效栏属于传统应用资料，不是逐病种临床疗效评估。本站仅转述事实与阅读重点，不转载图像或全文。'+('该页功效措辞存在疑义，本版芒硝的传统应用据用户提供的药证书，不采用其功效栏。' if identity_only else ''),status='verified',checkedAt='2026-11-10'))
    for id,title,author,url,scope in EXTRA:
        sources.append(dict(id=id,title=title,author=author,url=url,locator=scope,supports=[scope],note='已读取相关正文，本站以原创中文解释使用；不据此把传统功效认作单味药治愈疾病的证据。',status='verified',checkedAt='2026-11-10'))

EXTRA = [
 ('herb-aristolochic','含马兜铃酸药材：基原与风险','香港卫生署中医药规管办公室','https://www.cmro.gov.hk/html/b5/useful_information/public_health/publication/AdverseEvents13.html','防己与广防己、细辛药材来源及风险辨别'),
 ('herb-apricot','苦杏仁：不良事件资料','香港卫生署中医药规管办公室','https://www.cmro.gov.hk/html/b5/useful_information/public_health/publication/AdverseEvents17.html','苦杏仁中毒风险及症状'),
 ('herb-banxia','生半夏和制半夏','香港卫生署中医药规管办公室','https://www.cmro.gov.hk/html/b5/useful_information/public_health/publication/AdverseEvents7.html','半夏生制品与误食风险'),
 ('herb-decoctions','煎药常识','香港卫生署中医药规管办公室','https://www.cmro.gov.hk/html/b5/useful_information/public_health/pamphlet/Preparing_Herbal_Decoctions.html','煎药器具、一般过程、特殊药物依处方处理'),
 ('herb-methods','中药的先煎、后下、包煎、烊化、冲服和另煎解析','深圳市宝安纯中医治疗医院','https://www.bawjxt.net/szsbaczyzlyy/whxj/zyywh/content/post_917762.html','先煎、后下、包煎、另煎、烊化等特殊用法术语；本站不转录毒性药物的煎煮时长'),
 ('herb-ginger','Ginger：生姜研究与安全','美国国家补充与整合健康中心 NCCIH','https://www.nccih.nih.gov/health/ginger','恶心等研究结论、制剂与安全限制'),
 ('herb-ginseng','Asian Ginseng：人参研究与安全','美国国家补充与整合健康中心 NCCIH','https://www.nccih.nih.gov/health/asian-ginseng','疲劳、血糖等研究的局限及用药注意'),
 ('herb-astragalus','Astragalus：黄芪研究与安全','美国国家补充与整合健康中心 NCCIH','https://www.nccih.nih.gov/health/astragalus','临床研究质量限制、自身免疫病和免疫抑制药注意'),
 ('herb-schisandra','Schisandra：五味子与药物相互作用','纪念斯隆凯特琳癌症中心 MSK','https://www.mskcc.org/cancer-care/integrative-medicine/herbs/schisandra','有限人体研究；他克莫司血药浓度变化与合用注意'),
 ('herb-dongquai','Dong Quai：当归安全与相互作用','纪念斯隆凯特琳癌症中心 MSK','https://www.mskcc.org/cancer-care/integrative-medicine/herbs/dong-quai','当归与抗凝药、孕期等注意事项')
]
