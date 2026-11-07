# 二十八宿 · 中国星空漫游

网址：https://syuuc111-source.github.io/china-cycle-atlas/mansions/

独立视觉专题站：四象交互天球、28宿百科与单宿星图、六章导览、传统体系专题、文献出处。原站入口在导航与天文页；本站导航与页脚返回原站。

## 内容与数据

- 28宿，每宿含概览、现代天区、主要星官图、可点击恒星、天文说明、文化说明、原文引句及来源。
- 18个来源条目：包含博物馆研究、古籍转录、开放星表；同一古籍的篇级条目与全书条目分别标出，不代表18部独立著作。
- 2,572颗恒星方向与28个同名主要星官。星点源自D3-Celestial / XHIP，连线源自Stellarium中国星空文化；见 LICENSES.txt。
- J2000静态方向，正射投影；不计算地点、日期、地平坐标、古代岁差或实时月亮入宿。
- 七曜禽星名称依据《演禽通纂》，不同文本字形在来源中说明；术数观念和天文学分开介绍。
- 不含配音，不进行吉凶择日或命运配对计算。不宣称穷尽全部相关文献。

## 本地使用与验证

从仓库根目录运行 `python -m http.server 8768 --bind 127.0.0.1`，打开 `http://127.0.0.1:8768/mansions/`。页面使用模块与JSON，需通过HTTP访问。

`python scripts/build-mansions.py` 生成内容与精简星表。首次运行会从公开来源下载两份星表到被Git忽略的 `.cache/mansions/`；研究摘录在 `evidence/mansions-*.json`。

`node tests/mansions-data.cjs` 验证28宿完整性、引文关联、恒星连线、路由和搜索。

`node tests/mansions-browser.cjs` 验证桌面与手机。需要Playwright和Edge；本机使用Codex缓存运行时，其他机器可通过 `PLAYWRIGHT_MODULE`、`BROWSER_EXECUTABLE` 指定。`MANSIONS_URL` 可设为线上网址。测试输出在 `verification/`。

## 深链接

- `#atlas/tiger` 西方白虎
- `#mansion/shen` 参宿
- `#mansion/weiw2` 胃宿
- `#guide/0` 入门第一章
- `#library`、`#traditions`、`#sources`

## 验证记录

数据检查通过；56项浏览器检查通过，覆盖全部28宿、搜索、来源、深链、前后退、焦点恢复、手机无横向溢出、减少动态。独立代码审查发现的胃宿路由、四象返回状态、无声调拼音、焦点恢复、跳到正文问题均已修复并补充回归检查。
