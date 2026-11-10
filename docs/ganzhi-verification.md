# 天干地支专题验收记录

日期：2026-11-10。用户已批准规格、Native执行、独立审查及上线。

## 实现与范围

22个干支基础条目、60甲子组合详情、38篇主题文章、6章导览、21项来源。包括五行、本气与纳音、合冲刑害、四柱、纳甲、三式、择日、运气及历史文化等概览；不声称穷尽所有古籍或地方传统。所有日期查询在浏览器本地进行。

## 验收证据

| 标准 | 已运行检查及结果 |
|---|---|
| AC-01 | data/model：22基础条目、60唯一组合、阴阳合法性、纳音配对、6旬旬空、60步回环通过 |
| AC-02 | 38主题正文和来源引用结构完整；研究记录列明实际阅读范围。历史/传统/历算分别标记；部分引用定位到卷或篇，未完成逐句学术校勘 |
| AC-03 | 搜索、别名、无结果、1—60序号、三种五行口径测试通过；120个详情路由及刷新验证通过 |
| AC-04 | 1901—2100全部73,049个民用日有效及干支日连续性通过；独立香港天文台5年1,826日及2024年24节气、2033闰十一月等样例通过；非法输入、换日边界和跨宿主时区通过 |
| AC-05 | 2024-02-09农历癸卯年/节气甲辰年并列；23:30切换日界后日柱和时柱一致改变，解释显示正确 |
| AC-06 | 60步回环、连续20次操作、URL/正文/后退一致；手动键盘控制、暂停、减少动画及卸载清理验证通过 |
| AC-07 | 390/768/1440共27宽度路由组合、320px四页、200%浏览器CSS缩放四页无整页横向溢出；手机折叠目录/章节焦点/路由焦点通过；截图人工复核 |
| AC-08 | 主站20项回归、40响应式路由检查，星宿56项浏览器检查及跨站集成通过；三站入口互通 |

命令：`node --test tests/ganzhi-data.cjs tests/ganzhi-model.cjs tests/ganzhi-calendar.cjs tests/ganzhi-search.cjs`，14项全通过。
浏览器：`tests/ganzhi-browser.cjs`、`tests/ganzhi-accessibility.cjs`、`tests/ganzhi-routes.cjs`均通过，未发现运行时错误。查询提交观察窗口没有网络请求。
旧站：`tests/atlas-regression.cjs`、`tests/atlas-design-browser.cjs`、`tests/mansions-integration.cjs`、`tests/mansions-browser.cjs`均通过。

## 独立审查

审查者发现纳音筛选混入口径、手机目录被隐藏；新增测试先复现失败再修复通过。另修复路由焦点和甲子序号搜索，并细化东亚等文章章节引用。审查者复核搜索及无障碍测试通过，判断ship，主要阻碍解除。未声称重新联网审读每句古籍。

## 视觉及工具边界

深靛底、宋体标题、青金交互与五行固定语义色。桌面、手机首页和手机长文截图人工检查未见截字重叠。采用本地字体；尚未在实体iOS/Android设备测试。200%测试采用桌面浏览器CSS缩放，不等同于全部系统字体放大环境。
Impeccable上下文启动工具本会话不可用；已使用技能文字规则检查，未伪称其工具检查通过。
Taste最终 **GATE: OPEN 42（第3轮）**，不是PASS；无waiver。保留经批准的教育百科布局。以下是全部仍开放的检查，包含营销整屏模板约束、按钮/排版规则及对hash路由的静态误判。链接另有真实浏览器路由验证。

1. `nav` — header.site-header.wrap > a.brand "干支 时间之序"：nav link wraps to a second line
2. `text-only` — main#main > section:nth-of-type(2) "先看懂循环，再走进它的世界。"：the closing section is only text: no picture, icon, mock or effect in it
3. `button-styles` — (one screen)：3 button styles on one screen: soft, fill #121f34, outline #304158 ("上一步"); soft, fill #e6c38b, outline #e6c38b ("探索六十甲子"); soft, outline #304158 ("从零开始"); the odd one out: "从零开始"
4. `button-styles` — (the page)：3 button styles on the page: soft, fill #e6c38b, outline #e6c38b x1 ("探索六十甲子"); soft, outline #304158 x1 ("从零开始"); soft, fill #121f34, outline #304158 x2 ("上一步")
5. `cta` — main#main > section:nth-of-type(2) "先看懂循环，再走进它的世界。"：the last section before the footer ends with no button
6. `copy-actions` — div#wheel > div.wheel-controls > button:nth-of-type(1) "上一步"：4 actions in the hero ("探索六十甲子", "从零开始", "上一步", "下一步"); at most 2
7. `links` — header.site-header.wrap > a.brand "干支 时间之序"："干支 时间之序" goes to #home, which is not on this page
8. `links` — header.site-header.wrap > nav > a:nth-of-type(1) "从零开始"："从零开始" goes to #guide/0, which is not on this page
9. `links` — header.site-header.wrap > nav > a:nth-of-type(2) "干支百科"："干支百科" goes to #library, which is not on this page
10. `links` — header.site-header.wrap > nav > a:nth-of-type(3) "关系图解"："关系图解" goes to #relations, which is not on this page
11. `links` — header.site-header.wrap > nav > a:nth-of-type(4) "日期查询"："日期查询" goes to #calendar, which is not on this page
12. `links` — header.site-header.wrap > nav > a:nth-of-type(5) "文献"："文献" goes to #sources, which is not on this page
13. `links` — section.hero > div.hero-copy > div.actions > a.button.primary "探索六十甲子"："探索六十甲子" goes to #cycle/0, which is not on this page
14. `links` — section.hero > div.hero-copy > div.actions > a.button:nth-of-type(2) "从零开始"："从零开始" goes to #guide/0, which is not on this page
15. `links` — main#main > section:nth-of-type(2) > div.home-paths > a.path-link:nth-of-type(1) "翻开干支百科 22个基础条目、60个甲子，连接历法与传统文化的38篇讲解。"："翻开干支百科 22个基础条目、60个甲子，连接历法与传统文化的38篇讲解。" goes to #library, which is not on this page
16. `links` — main#main > section:nth-of-type(2) > div.home-paths > a.path-link:nth-of-type(2) "查询一个日期 对照农历纪年与节气四柱，了解每个结果采用的时间规则。"："查询一个日期 对照农历纪年与节气四柱，了解每个结果采用的时间规则。" goes to #calendar, which is not on this page
17. `links` — main#main > section:nth-of-type(2) > div.home-paths > a.path-link:nth-of-type(3) "读懂相互关系 从五行生克到合冲刑害，在图与文字之间理解各自的体系。"："读懂相互关系 从五行生克到合冲刑害，在图与文字之间理解各自的体系。" goes to #relations, which is not on this page
18. `links` — footer.site-footer.wrap > div > a:nth-of-type(3) "出处与方法"："出处与方法" goes to #sources, which is not on this page
19. `hero-enter` — main#main > section.hero：the hero does not enter on load: no data-enter on the hero and no head line setting html.m-enter (motion.md, The hero's entrance)
20. `moment-none` — (the page)：a software page (--type) deals no moment: every kind carries one, two on a long page (moments.md)
21. `hero-screen` — main#main > section.hero "天干地支十干十二支，在时间里重逢。从甲子走到癸亥，看懂一个六十步的循环。循着历法"：the hero ends at 1046px on a 900px screen, 146px below the fold: it ends at the fold, 1px either way (SR-1)
22. `section-height` — footer.site-footer.wrap "干支 · 时间之序认识循环，也认识它的边界。中国周期图谱二十八宿出处与方法内容版"：the section is 124px tall (0.1 screens), 776px short of one screen (900px): every section after the hero is one screen or two, 2px either way (SR-2)
23. `section-height` — main#main > section:nth-of-type(2) "先看懂循环，再走进它的世界。木火土金水翻开干支百科22个基础条目、60个甲子，连"：the section is 279px tall (0.3 screens), 621px short of one screen (900px): every section after the hero is one screen or two, 2px either way (SR-2)
24. `section-air` — main#main > section:nth-of-type(2) > div.home-paths "翻开干支百科22个基础条目、60个甲子，连接历法与传统文化的38篇讲解。查询一个"：a top border across 100% of the container, between the section's content: sections and their parts are told apart by air and ground, not lines (SR-3)
25. `one-section` — main#main > section:nth-of-type(2) > div.home-intro > h2 "先看懂循环，再走进它的世界。"：the screen at scroll 646px (the top of section 2) shows 279px of section 2 and the heading of section 2 whole and the content of 3 sections, over 24px each beside section 1: a screen shows one section (another may peek 8px, 24px WARN) (SR-4)
26. `container-edges` — header.site-header.wrap "干支时间之序从零开始干支百科关系图解日期查询文献中国周期图谱"：the nav's content runs 60px from the left and 60px from the right (read from its outermost blocks: no .wrap): the margin is 64-120px at 1440px (one container, equal margins, 2px either way) (SR-6)
27. `container-edges` — main#main > section.hero "天干地支十干十二支，在时间里重逢。从甲子走到癸亥，看懂一个六十步的循环。循着历法"：the content of section 1 runs 60px from the left and 60px from the right (read from its outermost blocks: no .wrap): the margin is 64-120px at 1440px (one container, equal margins, 2px either way) (and 2 more like it: "先看懂循环，再走进它的世界。木火土金水翻开干支百", "干支 · 时间之序认识循环，也认识它的边界。中国") (SR-6)
28. `container-edges` — a.skip-link "跳到正文"：a <a> at the top of the page, outside header.nav, main, footer.closing and nav.actionbar (SR-6)
29. `container-edges` — div#wheel > label.wheel-select "直接选择1 · 甲子2 · 乙丑3 · 丙寅4 · 丁卯5 · 戊辰6 · 己巳"：1 text block starts on a left line at x 927, 867px from the container's left: text starts on the container's left, or on one split line (x 620, 732, 844) (SR-6)
30. `container-edges` — div#wheel > p.wheel-caption "十干与十二支同步前进 · 点击轮上文字也可选择"：1 text block starts on a left line at x 885, 825px from the container's left: text starts on the container's left, or on one split line (x 620, 732, 844) (SR-6)
31. `container-edges` — div#wheel > svg.wheel-svg "子丑寅卯辰巳午未申酉戌亥甲乙丙丁戊己庚辛壬癸六十甲子甲子01 / 60 · 阳木"：a <svg> over half the container wide runs 639-1380px, not on the container's lines at 60-1380px (SR-6)
32. `nav` — header.site-header.wrap > a.brand "干支时间之序"：nav link wraps to a second line
33. `hero-fill` — main#main > section:nth-of-type(2) "先看懂循环，再走进它的世界。"：the next section shows on the first screen: it starts at 743px on a 1024px screen (the hero ends at 709px)
34. `edge-left` — section.hero p.wheel-caption "十干与十二支同步前进 · 点击轮上文字也可选择"：starts at x 639.4; the lines are 60 and the column starts
35. `edge-left` — section h3 "查询一个日期"：starts at x 529; the lines are 60 and the column starts
36. `edge-left` — section p "对照农历纪年与节气四柱，了解每个结果采用的时间规则。"：starts at x 529; the lines are 60 and the column starts
37. `edge-left` — section h3 "读懂相互关系"：starts at x 969; the lines are 60 and the column starts
38. `edge-left` — section p "从五行生克到合冲刑害，在图与文字之间理解各自的体系。"：starts at x 969; the lines are 60 and the column starts
39. `screen-short` — section section "先看懂循环，再走进它的世界。木火土金水翻开干支百科22个基础条目"：279px tall; one screen under the nav is 900px
40. `screen-height` — section section "先看懂循环，再走进它的世界。木火土金水翻开干支百科22个基础条目"：279px, 0.31 screens; a section is exactly one or two (--h)
41. `neighbour` — section section "先看懂循环，再走进它的世界。木火土金水翻开干支百科22个基础条目"：framed, 124px of the footer shows
42. `hero-fold` — section.hero section.hero "天干地支十干十二支，在时间里重逢。从甲子走到癸亥，看懂一个六十步"：starts at y 104, not under the nav

## 历算与内容限制

固定UTC+8，1901—2100；不自动套历史夏令时或出生地真太阳时。2024节气对照容差90秒，不能推广成全部年份秒级准确。传统预测体系只介绍分类与历史解释，不据此生成个人命运、医学诊断或历史因果结论。藏干/十二长生保留常见子平版本及异说说明；一些原典仅核读相关卷段，来源页面已标示。

## 发布

目标：https://syuuc111-source.github.io/china-cycle-atlas/ganzhi/ 。公开部署验证在发布后追加。

## 最终本地性能抽样

1440px和390px各3次：0 FAIL、4 WARN。警告为两个宽度各自的JavaScript解析体积和本地中文字库体积；无失败资源或长任务。以下是工具实测摘要，不是公网用户性能承诺：

```text
perf 127.0.0.1:8768/ganzhi/ @ 1440px
  WARN  JS parsed                                  457.9 KiB      6 files, 459K gz
  WARN  font bytes                                 170.9 KiB
  PASS  LCP (CPU, relative)                        96 ms          runs 3, 92..284, p.hero-subtitle
  PASS  layout shift                               0.084          runs 3, 0.000..0.084; at load 0.084
perf 127.0.0.1:8768/ganzhi/ @ 390px
  WARN  JS parsed                                  457.9 KiB      6 files, 459K gz
  WARN  font bytes                                 170.9 KiB
  PASS  LCP (CPU, relative)                        92 ms          runs 3, 92..92, h1
  PASS  layout shift                               0.000          runs 3, 0.000..0.000; at load 0.000
SUMMARY 127.0.0.1:8768/ganzhi/: 0 FAIL, 4 WARN  -> WARN
```

正文/辅助文字/青金链接对三种背景的设计色值最小对比度 7.30:1，达到普通文本AA；五行彩色小点不承担独立文本识别。
