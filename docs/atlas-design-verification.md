# 中国周期图谱主站设计验证

GATE: OPEN 29 (rounds used up)

2026-11-08。未添加门禁豁免。用户批准深色时空研究台；保持操作型界面、直接展示时间轴、全部数据和五行语义配色。

验证：原20项图谱回归、15项周期/天文检查通过；新增40个栏目/屏宽组合检查、数据完全一致、手机图层、色带文字4.5:1、打印配色、减少动态及焦点检查通过。独立复查发现的色带文字和打印对比已修复。

显示规则：夜空#080f20、面板#101c32、正文#e6edf7、次要#a6b7ce、操作青蓝#6cddd7、探针金#f0c77f；既有中文系统字体服务数据阅读。用户指定配色优先于随机配色。主图为真实SVG数据，环形定位标记响应年份；未引入外部图片、假数据、HALOFLUX素材或会话信息。

门禁未关闭项如下。它按营销页面和自带布局库判断，因此保留研究工具的短介绍、多列工作区、可滚动长表与图表口径说明。没有宣称门禁通过。重叠/裁切报告涉及滚动探针和横向表格，需结合浏览器实际裁切区判断；页面各尺寸已人工和交互复核。

1. **hero-fill** — section#tab-atlas "多变量时间轴"
   the next section shows on the first screen: it starts at 298px on a 900px screen (the hero ends at 219px)

2. **nav** — header.topbar > a.brand "中国周期图谱 CHINA · AN ATLAS OF TIME"
   nav link wraps to a second line

3. **overlap-text** — section#tab-atlas > section.window-section.card "1644年前后 30 年 · 1614年—1674年 只汇总已有样本，不代表因果"
   lies over the text "太阳活动 · 黑子年均数" (div.readout:nth-of-type(3) > label) (and 1 more like it: "空白也是信息。周期不是命运。")

4. **button-styles** — (one screen)
   3 button styles on one screen: soft, fill #101c32, outline #293a54 ("导出数据 ↗"); soft, outline #293a54 ("近两千年"); soft, fill #183d48, outline #39717a ("全史"); the odd one out: "全史"

5. **button-styles** — (the page)
   3 button styles on the page: soft, fill #101c32, outline #293a54 x5 ("导出数据 ↗"); soft, fill #183d48, outline #39717a x1 ("全史"); soft, outline #293a54 x5 ("近两千年")

6. **button-styles** — div#nearEvents > button.event-chip "明清政权转换 1644年—1662年 · 政权"
   one button style (soft, fill #101c32, outline #293a54) in 4 heights: 42, 43, 44, 60px ("明清政权转换 1644年—1662年 · 政权" 60px, "查看" 42px)

7. **cta** — main#workspace > section.hero
   the hero has no button (the nav's does not count)

8. **heading-scale** — h2#windowTitle "1644年前后 30 年 · 1614年—1674年"
   h2 headings in 2 sizes, 17px ("多变量时间轴") to 23px (x1.35)

9. **links** — header.topbar > a.brand "中国周期图谱 CHINA · AN ATLAS OF TIME"
   "中国周期图谱 CHINA · AN ATLAS OF TIME" goes to #atlas, which is not on this page

10. **visual-caption** — section#tab-atlas > div.atlas-layout > section.chart-card.card > div.chart-caption "政权并列不代表疆域相同。古气候与现代气温分轨；稀疏估算不跨缺年补线。未来底色仅表"
   a line marked as a caption sits 0px under the drawing (svg) (its class names it one): "政权并列不代表疆域相同。古气候与现代气温分轨；稀疏估算不跨缺年补线。未来底色仅表..."; no caption or description under any image, render or visual (house rule)

11. **hero-enter** — main#workspace > section.hero
   the hero does not enter on load: no data-enter on the hero and no head line setting html.m-enter (motion.md, The hero's entrance)

12. **moment-none** — (the page)
   a software page (--type) deals no moment: every kind carries one, two on a long page (moments.md)

13. **hero-screen** — main#workspace > section.hero "把四千年，放在同一条时间轴上。观察共时，追问关联。让每个数据点都有出处，让每一种"
   the hero ends at 219px on a 900px screen, 682px above the fold: it ends at the fold, 1px either way (SR-1)

14. **hero-screen** — main#workspace > nav.tabs "时间图谱同轴对照五运六气星宿与行星关联实验周期知识库未来情景资料与方法"
   682px of the next section shows on the first screen (from 219px on a 900px screen): nothing below the hero shows at load (SR-1)

15. **section-height** — main#workspace > nav.tabs "时间图谱同轴对照五运六气星宿与行星关联实验周期知识库未来情景资料与方法"
   the section is 56px tall (0.1 screens), 845px short of one screen (900px): every section after the hero is one screen or two, 2px either way (SR-2)

16. **section-height** — section#tab-atlas "全史近两千年明清近现代现代统计未来窗口起点 —终点 查看 负数表示公元前；没有公"
   the section is 2240px tall (2.5 screens), 440px over two screens (1800px): every section after the hero is one screen or two, 2px either way (SR-2)

17. **section-air** — main#workspace > nav.tabs / section#tab-atlas
   25px of air between the content of these two sections: 128-480px (64-600px WARN) (SR-3)

18. **one-section** — main#workspace > section.hero > div:nth-of-type(1) > h1 "把四千年，放在同一条时间轴上。"
   the screen at scroll 0px (stride 0) shows 137px of section 1 and the heading of section 1 whole and the content of 3 sections, over 24px each beside section 3: a screen shows one section (another may peek 8px, 24px WARN) (SR-4)

19. **one-section** — section#tab-atlas > section.window-section.card "1644年前后 30 年 · 1614年—1674年只汇总已有样本，不代表因果效"
   a band: a box 100% of the section wide on a ground of its own that holds only text: the section's own ground is the band (SR-4)

20. **one-heading** — h2#windowTitle "1644年前后 30 年 · 1614年—1674年"
   the section holds 2 h2 headings: one per section, first in its .wrap (SR-5)

21. **container-edges** — header.topbar "中国周期图谱CHINA · AN ATLAS OF TIME 研究快照 · 20"
   the nav's content runs 32px from the left and 32px from the right (read from its outermost blocks: no .wrap): the margin is 64-120px at 1440px (one container, equal margins, 2px either way) (SR-6)

22. **container-edges** — main#workspace > section.hero "把四千年，放在同一条时间轴上。观察共时，追问关联。让每个数据点都有出处，让每一种"
   the content of section 1 runs 32px from the left and 32px from the right (read from its outermost blocks: no .wrap): the margin is 64-120px at 1440px (one container, equal margins, 2px either way) (SR-6)

23. **container-edges** — main#workspace > nav.tabs "时间图谱同轴对照五运六气星宿与行星关联实验周期知识库未来情景资料与方法"
   the content of section 2 runs 32px from the left and 32px from the right (read from its outermost blocks: no .wrap): the margin is 64-120px at 1440px (one container, equal margins, 2px either way) (and 2 more like it: "全史近两千年明清近现代现代统计未来窗口起点 —终", "中国周期图谱 · 有出处的历史探索空白也是信息。") (SR-6)

24. **container-edges** — a.skip-link "跳到时间图谱"
   a <a> at the top of the page, outside header.nav, main, footer.closing and nav.actionbar (SR-6)

25. **container-edges** — section.chart-card.card > div.chart-top > div:nth-of-type(1) > h2 "多变量时间轴"
   the h2 starts 263px right of the container's left: every h1 and h2 starts on it, 2px either way (SR-6)

26. **container-edges** — h2#windowTitle "1644年前后 30 年 · 1614年—1674年"
   1 text block starts on a left line at x 59, 27px from the container's left: text starts on the container's left, or on one split line (x 615, 732, 849) (and 1 more like it: "1644年前后 30 年 · 1614年—167") (SR-6)

27. **row-lines** — section#tab-atlas > div.atlas-layout "变量图层展开图层全部开关历史背景政权与历史分期历史事件选集数值变量冬半年温度重建"
   a row of 3 items: its items are 1395/1363/860px tall, not one height (2px either way) (SR-7)

28. **cut-text** — tbody#windowTable > tr:nth-of-type(7) > td:nth-of-type(3) "1,330 · n=1"
   runs past the edge of its box section#tab-atlas > section.window-section.card

29. **container** — page
   no .wrap

## 性能

Taste perf 单次本机CPU渲染样本：1440px与390px均为0 FAIL、0 WARN，CLS均为0，LCP约324/320ms，无失败请求。非真实用户网络指标；内联JS/CSS被工具归到HTML传输，不代表没有脚本。

独立审查复核确认两项对比缺陷修复，生成HTML与源码一致。
