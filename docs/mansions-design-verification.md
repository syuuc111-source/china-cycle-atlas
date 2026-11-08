# 二十八宿视觉升级检查

2026-11-08。GATE: OPEN 30 (rounds used up)。没有使用豁免。

浏览器功能56项、动效25项、原图谱回归20项、站间互跳通过。新增字体/色光/星官小图和24个响应式路由检查通过。独立复查未发现阻塞缺陷。

以下为设计门禁的全部未关闭条目。此门禁按营销单页与自带布局/动效库判断；本站保留用户已认可的哈希路由、共享Canvas、百科和专用动效。链接行为已实际点击验证，文献与星图口径说明仍保留。

1. **nav** — header.site-header > a.brand "二十八宿 THE CHINESE SKY"
   nav link wraps to a second line

2. **overlap-text** — canvas#sky
   lies over the text "东方苍龙 · 七宿" (span#sky-label)

3. **links** — header.site-header > a.brand "二十八宿 THE CHINESE SKY"
   "二十八宿 THE CHINESE SKY" goes to #home, which is not on this page

4. **links** — header.site-header > nav > a:nth-of-type(1) "入门导览"
   "入门导览" goes to #guide/0, which is not on this page

5. **links** — header.site-header > nav > a:nth-of-type(2) "四象星图"
   "四象星图" goes to #atlas, which is not on this page

6. **links** — header.site-header > nav > a:nth-of-type(3) "星宿百科"
   "星宿百科" goes to #library, which is not on this page

7. **links** — header.site-header > nav > a:nth-of-type(4) "文化脉络"
   "文化脉络" goes to #traditions, which is not on this page

8. **links** — header.site-header > nav > a:nth-of-type(5) "文献索引"
   "文献索引" goes to #sources, which is not on this page

9. **links** — div.hero > div.hero-copy > div.hero-actions > a.button.primary "探索二十八宿 ↗"
   "探索二十八宿 ↗" goes to #atlas, which is not on this page

10. **links** — div.hero > div.hero-copy > div.hero-actions > a.text-link "从这里读起 →"
   "从这里读起 →" goes to #guide/0, which is not on this page

11. **links** — section#view-home > div.home-bottom > a "每一束星光，都有来处 ↗"
   "每一束星光，都有来处 ↗" goes to #sources, which is not on this page

12. **links** — a#share-mansion "此宿链接 ↗"
   "此宿链接 ↗" goes to "#", nowhere

13. **links** — footer.site-footer > a:nth-of-type(1) "二十八宿 · 中国星空漫游"
   "二十八宿 · 中国星空漫游" goes to #home, which is not on this page

14. **hero-enter** — section#view-home > div.hero
   the hero does not enter on load: no data-enter on the hero and no head line setting html.m-enter (motion.md, The hero's entrance)

15. **moment-none** — (the page)
   a software page (--type) deals no moment: every kind carries one, two on a long page (moments.md)

16. **hero-screen** — div#app "二十八宿仰望之间，读懂古人的宇宙。循着四象，走进二十八座星空驿站。让遥远的星光，"
   the hero ends at 1319px on a 900px screen, 419px below the fold: it ends at the fold, 1px either way (SR-1)

17. **section-height** — footer.site-footer "二十八宿 · 中国星空漫游以星为引，以文为证。返回中国周期图谱 ↗"
   the section is 91px tall (0.1 screens), 809px short of one screen (900px): every section after the hero is one screen or two, 2px either way (SR-2)

18. **section-height** — div#app "二十八宿仰望之间，读懂古人的宇宙。循着四象，走进二十八座星空驿站。让遥远的星光，"
   the section starts at 96px, 96px below the screen grid (0 x 900px): sections start on whole screens (SR-2)

19. **one-section** — footer.site-footer "二十八宿 · 中国星空漫游以星为引，以文为证。返回中国周期图谱 ↗"
   the screen at scroll 510px (the top of section 2) shows 91px of section 2 and the content of 2 sections, over 24px each beside section 1: a screen shows one section (another may peek 8px, 24px WARN) (SR-4)

20. **one-section** — div#app "二十八宿仰望之间，读懂古人的宇宙。循着四象，走进二十八座星空驿站。让遥远的星光，"
   a <div> sits directly in <main>: every part of <main> is a <section> (SR-4)

21. **one-heading** — section#view-home > div.symbols-strip > div.strip-heading > h2 "四方有象，星空有序。"
   the hero holds an h2 (1): its heading is the h1, and an h2 opens the next section (SR-5)

22. **container-edges** — a.skip-link "跳到正文"
   a <a> at the top of the page, outside header.nav, main, footer.closing and nav.actionbar (SR-6)

23. **container-edges** — header.site-header "二十八宿THE CHINESE SKY 入门导览四象星图星宿百科文化脉络文献索引"
   a <header> at the top of the page, outside header.nav, main, footer.closing and nav.actionbar (SR-6)

24. **container-edges** — footer.site-footer "二十八宿 · 中国星空漫游以星为引，以文为证。返回中国周期图谱 ↗"
   a <footer> at the top of the page, outside header.nav, main, footer.closing and nav.actionbar (and 2 more like it: "二十八宿仰望之间，读懂古人的宇宙。循着四象，走进", "二十八宿 · 中国星空漫游以星为引，以文为证。返") (SR-6)

25. **container-edges** — span#sky-label "东方苍龙 · 七宿"
   1 text block starts on a left line at x 626, 554px from the container's left: text starts on the container's left, or on one split line (x 622, 732, 842) (SR-6)

26. **container-edges** — div#sky-stage > div.sky-bottom > span "J2000 星位 · 非实时地平星空"
   1 text block starts on a left line at x 610, 538px from the container's left: text starts on the container's left, or on one split line (x 622, 732, 842) (SR-6)

27. **container-edges** — section#view-home > div.hero > div.hero-copy > p.hero-note "传统星官 · 现代星位 · 历史文本"
   1 text block starts on a left line at x 122, 50px from the container's left: text starts on the container's left, or on one split line (x 622, 732, 842) (SR-6)

28. **container-edges** — canvas#sky "传统星官天球图，使用下方星宿按钮查看详情"
   a <canvas> over half the container wide runs 544-1368px, not on the container's lines at 72-1368px (SR-6)

29. **off-grid** — div#sky-stage > div.sky-bottom > span "J2000 星位 · 非实时地平星空"
   left edge at 34px, 10px off the page margin at 24px (11 elements, like a.button.primary)

30. **container** — page
   no .wrap
