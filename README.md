# 中国周期图谱

夏朝至今的多变量交互时间轴，分层展示气候、经济、人口、历史政权、事件与传统周期规则。

站点：https://syuuc111-source.github.io/china-cycle-atlas/

网页可直接离线打开，或通过 GitHub Pages 访问。支持变量开关、年份查询、前后窗口、关联实验、资料检索及数据/SVG导出。

2026-11-08 主站视觉升级为深色时空研究台：青蓝交互与金色年份探针、可收起的手机图层、更清晰的控件和资料排版。五行颜色、全部数据样本和计算模型不变；SVG 自带深色底图，下载后无需网页样式。二十八宿专题保持独立。

## 构建和验证

主站源文件位于 `src/atlas/`，运行 `python scripts/build-atlas.py` 生成根目录 `index.html`。构建不联网，输出仍为可离线打开的单文件。发布前须重新生成该文件。

- `node tests/atlas-regression.cjs`：20项原有功能与计算检查。
- `node tests/atlas-cycles-browser.cjs`：15项五行、同轴、天文与导出检查。
- `node tests/atlas-design-browser.cjs`：源数据一致性、深色SVG、五行文字对比、打印、40个栏目/屏宽组合、手机图层与键盘操作。
- `node tests/mansions-integration.cjs`：主站与星宿专题互跳。

浏览器测试默认使用本机 Playwright/Edge；可用 `PLAYWRIGHT_MODULE`、`BROWSER_EXECUTABLE` 替换，使用 `ATLAS_URL` 指定待测地址。前三项默认 `http://127.0.0.1:8768/`，互跳检查默认已发布网址。

2.0新增同轴叠加、五运六气与六十甲子五色对照、二十八宿次序图、八大行星周期和JPL近似日心轨迹。可通过 #overlay、#wuxing、#astronomy 直达对应页面。

## 数据与研究边界

研究快照日期：2026-11-06。包含8条数值系列、1,085个数据点和50个来源入口。不是全网穷尽资料，也不是因果预测模型；数据缺口及来源内部冲突在页面明确标注。

资料来源、使用限制和引用信息见网站“资料与方法”以及 research-notes.md。

SILSO 数据署名：WDC-SILSO, Royal Observatory of Belgium, Brussels；DOI 10.24414/qnza-ac80；来源标示CC BY-NC。

Maddison Project Database 2023 数据 DOI 10.34894/INZBF2；中国原始研究引文见 evidence/maddison_china.json。其余数据遵守各自来源条件，本仓库不将第三方数据重新授予统一许可。


二十八宿专题：https://syuuc111-source.github.io/china-cycle-atlas/mansions/

独立星空风格的四象导览、28宿百科、可点击星图、文化体系与出处。详见 [专题说明](mansions/README.md)。
