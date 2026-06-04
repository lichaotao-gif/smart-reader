import "./styles/main.css";

/** 首版关闭：学校绑定、学校展示。改为 true 可恢复侧栏/我的教材/设置中的学校与激活码弹窗 */
const FEATURE_SCHOOL_UI = false;

// Pastel palette for covers — soft, airy
const PAL=[
  ['#4a8ec8','#7ab4de'],  // mint
  ['#4a8ec8','#7ab4de'],  // sky
  ['#d48548','#e8a870'],  // peach
  ['#8a60b8','#aa88d0'],  // lavender
  ['#c85a72','#e08898'],  // rose
  ['#b8a030','#d0c060'],  // lemon
  ['#4a98b0','#78bcd0'],  // ice
  ['#98804a','#b8a878'],  // sand
];

const SM={计算机基础:0,Python:1,程序设计:2,计算机网络:3,Web前端:4,办公应用:5,数字媒体:6,数据库:0,Linux:1,算法与结构:2,人工智能:3,机器学习:4,深度学习:5,自然语言:6,云计算:7,大数据:0,移动开发:1,网络安全:2,机器人:3};

/** 数字教材书目：readModeKeys 为后台配置的阅读模式，仅展示已配置的项（可省略或 [] 表示不展示） */
const BOOK_READ_MODES = [
  { key: 'read', label: '阅读模式' },
  { key: 'teach', label: '教学模式' },
  { key: 'av', label: '视听模式' },
  { key: 'task', label: '任务模式' },
  { key: 'kg', label: '知识图谱' },
];

const HOME_RECOMMENDED_BOOKS = [
  { t: '运动营养学', en: 'SPORTS NUTRITION', editor: '赵建国', publisher: '四川电教馆电子音像出版社', theme: 'sports' },
  { t: '中华优秀传统文化', en: 'TRADITIONAL CULTURE', editor: '刘文静', publisher: '四川电教馆电子音像出版社', theme: 'culture' },
  { t: '新能源汽车概论', en: 'NEW ENERGY VEHICLE', editor: '李娟强', publisher: '四川电教馆电子音像出版社', theme: 'vehicle' },
  { t: '数据算法与结构', en: 'DATA STRUCTURE', editor: '姚晓明', publisher: '四川电教馆电子', theme: 'data' },
  { t: '新时代下的媒体资源', en: 'MEDIA RESOURCE', editor: '王晓晴', publisher: '四川电教馆电子音像出版社', theme: 'media' },
  { t: '智能家居', en: 'SMART HOME', editor: '陈思远', publisher: '四川电教馆电子音像出版社', theme: 'home' },
  { t: '半导体物理学', en: 'SEMICONDUCTOR PHYSICS', editor: '李国强', publisher: '四川电教馆电子音像出版社', theme: 'chip' },
  { t: '人工智能导论', en: 'ARTIFICIAL INTELLIGENCE', editor: '周明', publisher: '四川电教馆电子音像出版社', theme: 'ai' },
  { t: '数字化设计与3D打印', en: 'DIGITAL DESIGN & 3D PRINTING', editor: '陈明', publisher: '四川电教馆电子音像出版社', theme: 'print' },
  { t: '田野书香', en: 'FIELD READING', editor: '余小梅', publisher: '四川电教馆电子音像出版社', theme: 'field' },
  { t: '摄像技术', en: 'CAMERA TECHNOLOGY', editor: '李霖', publisher: '四川电教馆电子音像出版社', theme: 'camera' },
  { t: '首饰组织', en: 'JEWELRY DESIGN', editor: '吴理珍', publisher: '四川电教馆电子音像出版社', theme: 'jewel' },
];

function resolveLibReadModes(b) {
  const keys = b && Array.isArray(b.readModeKeys) ? b.readModeKeys : [];
  if (!keys.length) return [];
  return keys
    .map((k) => BOOK_READ_MODES.find((a) => a.key === k))
    .filter(Boolean)
    .filter((m) => m.key !== 'teach' || isCurrentUserClassGroupAdmin());
}

const MODE_ARROW_SVG_DETAIL =
  '<svg class="mode-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>';

/** 教材详情「学习模式」单卡（「阅读模式」进阅读器；其他模式为外链式入口的演示） */
function detailModeCardHtml(modeKey) {
  const blocks = {
    read: {
      cls: 'mi-read',
      icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
      name: '阅读模式',
      desc: '沉浸式阅读体验，支持批注、书签、笔记和划线标注',
    },
    av: {
      cls: 'mi-av',
      icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
      name: '视听模式',
      desc: '配套微课视频、课文朗读、名师讲解音频资源',
    },
    task: {
      cls: 'mi-task',
      icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
      name: '任务模式',
      desc: '章节练习、课后作业、自测试卷，自动批改与错题收集',
    },
    kg: {
      cls: 'mi-kg',
      icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="3"/><circle cx="5" cy="19" r="3"/><circle cx="19" cy="19" r="3"/><line x1="12" y1="8" x2="5" y2="16"/><line x1="12" y1="8" x2="19" y2="16"/><line x1="5" y1="19" x2="19" y2="19"/></svg>',
      name: '知识图谱',
      desc: '可视化知识结构，智能关联跨章节概念与考点脉络',
    },
    teach: {
      cls: 'mi-teach',
      icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="10" rx="1.2"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="5" y1="15" x2="7" y2="19"/><line x1="19" y1="15" x2="17" y2="19"/><line x1="4" y1="19" x2="8" y2="19"/></svg>',
      name: '教学模式',
      desc: '课堂演示与本书配套教学课件，支持类 PPT 换页，并可一键二分屏与教材原文对照，便于投屏讲练结合（演示，仅组群管理员可见入口）',
    },
  };
  const m = blocks[modeKey];
  if (!m) return '';
  return `<div class="mode-card" onclick="openReaderFromDetailMode('${modeKey}')">
          <div class="mode-icon ${m.cls}">${m.icon}</div>
          <div class="mode-info">
            <div class="mode-name">${m.name}</div>
            <div class="mode-desc">${m.desc}</div>
          </div>
          ${MODE_ARROW_SVG_DETAIL}
        </div>`;
}

function detailLearningModesSectionHtml(modeEntries) {
  if (!modeEntries.length) return '';
  const cards = modeEntries.map((e) => detailModeCardHtml(e.key)).join('');
  if (!cards.trim()) return '';
  return `<div class="mode-section">
      <div class="intro-heading"><span class="bar"></span>学习模式</div>
      <div class="mode-grid">
        ${cards}
      </div>
    </div>`;
}

const books=[
  {t:'运动营养学',s:'实践篇',g:'中职 二年级',p:'四川电教馆电子音像出版社',tp:'o',sub:'运动营养',cat:'体育健康',paperDigital:true,editor:'赵建国',readModeKeys:['read','av','task']},
  {t:'计算机应用基础',s:'上册',g:'中职 一年级',p:'高等教育出版社',tp:'o',sub:'计算机基础',cat:'计算机基础',paperDigital:true,editor:'张炜 等',readModeKeys:['read','av','task','kg']},
  {t:'计算机应用基础',s:'下册',g:'中职 一年级',p:'高等教育出版社',tp:'o',sub:'计算机基础',cat:'计算机基础',editor:'张炜 等',readModeKeys:['read','av','task']},
  {t:'C语言程序设计',s:'上册',g:'中职 一年级',p:'高等教育出版社',tp:'o',sub:'程序设计',cat:'程序与开发',readModeKeys:['read','task']},
  {t:'C语言程序设计',s:'下册',g:'中职 一年级',p:'高等教育出版社',tp:'o',sub:'程序设计',cat:'程序与开发',readModeKeys:['read']},
  {t:'Python程序设计',s:'入门篇',g:'中职 一年级',p:'人民邮电出版社',tp:'o',sub:'Python',cat:'程序与开发',paperDigital:true,editor:'李可 等',readModeKeys:['read','av','task'],introVideoUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'},
  {t:'Python程序设计',s:'项目篇',g:'中职 一年级',p:'人民邮电出版社',tp:'o',sub:'Python',cat:'程序与开发',editor:'李可 等',readModeKeys:['read']},
  {t:'计算机网络技术',s:'基础与互联',g:'中职 一年级',p:'电子工业出版社',tp:'o',sub:'计算机网络',cat:'网络与运维',readModeKeys:['read','av','task','kg']},
  {t:'网页设计与制作',s:'HTML5/CSS3',g:'中职 一年级',p:'人民邮电出版社',tp:'o',sub:'Web前端',cat:'程序与开发',readModeKeys:['read','av']},
  {t:'办公自动化',s:'WPS与信息素养',g:'中职 一年级',p:'中国劳动社会保障出版社',tp:'o',sub:'办公应用',cat:'计算机基础',readModeKeys:['read','task']},
  {t:'数字媒体技术',s:'版式与图形',g:'中职 一年级',p:'中国劳动社会保障出版社',tp:'o',sub:'数字媒体',cat:'计算机基础',readModeKeys:['read']},
  {t:'MySQL数据库应用',s:'基础与查询',g:'中职 二年级',p:'人民邮电出版社',tp:'o',sub:'数据库',cat:'数据与平台',readModeKeys:['read','task','kg']},
  {t:'MySQL数据库应用',s:'设计与管理',g:'中职 二年级',p:'人民邮电出版社',tp:'o',sub:'数据库',cat:'数据与平台',readModeKeys:['read']},
  {t:'Linux操作系统',s:'命令与Shell',g:'中职 二年级',p:'电子工业出版社',tp:'o',sub:'Linux',cat:'网络与运维',readModeKeys:['read','av','task']},
  {t:'数据结构与算法',s:'C语言版',g:'中职 二年级',p:'清华大学出版社',tp:'o',sub:'算法与结构',cat:'程序与开发',readModeKeys:['read','task']},
  {t:'Java程序设计',s:'面向对象',g:'中职 二年级',p:'人民邮电出版社',tp:'o',sub:'程序设计',cat:'程序与开发',readModeKeys:['read','av','task']},
  {t:'人工智能导论',s:'通识与伦理',g:'中职 二年级',p:'高等教育出版社',tp:'o',sub:'人工智能',cat:'人工智能',paperDigital:true,editor:'赵明 等',readModeKeys:['read','av','task','kg'],introVideoEmbed:'https://www.youtube.com/embed/jNQXAC9IVRw'},
  {t:'机器学习基础',s:'监督与评估',g:'中职 三年级',p:'人民邮电出版社',tp:'o',sub:'机器学习',cat:'人工智能',readModeKeys:['read']},
  {t:'深度学习应用',s:'视觉与语音',g:'中职 三年级',p:'电子工业出版社',tp:'o',sub:'深度学习',cat:'人工智能',readModeKeys:['read','av','task']},
  {t:'自然语言处理入门',s:'文本与对话',g:'中职 三年级',p:'人民邮电出版社',tp:'o',sub:'自然语言',cat:'人工智能',readModeKeys:['read','av','kg']},
  {t:'云计算与虚拟化',s:'容器与运维入门',g:'中职 三年级',p:'人民邮电出版社',tp:'o',sub:'云计算',cat:'网络与运维',readModeKeys:['read']},
  {t:'大数据技术',s:'采集与分析',g:'中职 三年级',p:'中国劳动社会保障出版社',tp:'o',sub:'大数据',cat:'数据与平台',readModeKeys:['read']},
  {t:'移动应用开发',s:'Android基础',g:'中职 三年级',p:'电子工业出版社',tp:'o',sub:'移动开发',cat:'程序与开发',readModeKeys:['read']},
  {t:'网络信息安全',s:'防护与合规',g:'中职 三年级',p:'中国劳动社会保障出版社',tp:'o',sub:'网络安全',cat:'网络与运维',readModeKeys:['read','task']},
  {t:'机器人技术基础',s:'控制与视觉',g:'中职 三年级',p:'中国劳动社会保障出版社',tp:'o',sub:'机器人',cat:'人工智能',readModeKeys:['read']},
];

const myB=[
  {t:'人工智能导论',s:'通识与伦理',g:'中职 二年级',p:'高等教育出版社',tp:'o',sub:'人工智能',cat:'人工智能',pr:78,paperDigital:true,editor:'赵明 等',actionKeys:['read','cloudHandout','teach','task','questionBank','internship','resourceLib','learnStats','myDemo1','myDemo2','myDemo3','myDemo4','myDemo5','myDemo6'],introVideoEmbed:'https://www.youtube.com/embed/jNQXAC9IVRw'},
  {t:'Python程序设计',s:'入门篇',g:'中职 一年级',p:'人民邮电出版社',tp:'o',sub:'Python',cat:'程序与开发',pr:45,editor:'李可 等',introVideoUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'},
  {t:'计算机网络技术',s:'基础与互联',g:'中职 一年级',p:'电子工业出版社',tp:'o',sub:'计算机网络',cat:'网络与运维',pr:92,paperDigital:true,actionKeys:['read','task','questionBank','learnStats']},
  {t:'数据结构与算法',s:'C语言版',g:'中职 二年级',p:'清华大学出版社',tp:'o',sub:'算法与结构',cat:'程序与开发',pr:30,editor:'王硕 等',actionKeys:['read','resourceLib']},
  {t:'MySQL数据库应用',s:'基础与查询',g:'中职 二年级',p:'人民邮电出版社',tp:'o',sub:'数据库',cat:'数据与平台',pr:15,editor:'刘洋 等'},
  {t:'机器学习基础',s:'监督与评估',g:'中职 三年级',p:'人民邮电出版社',tp:'o',sub:'机器学习',cat:'人工智能',pr:60,paperDigital:true,editor:'陈晨 等',actionKeys:['read','cloudHandout','teach','task','questionBank','internship','resourceLib','learnStats']},
  {t:'移动应用开发',s:'Android基础',g:'中职 三年级',p:'电子工业出版社',tp:'o',sub:'移动开发',cat:'程序与开发',pr:68,paperDigital:true,editor:'刘芳 等',actionKeys:['read','task','questionBank','learnStats']},
];

function c(sub){return PAL[SM[sub]??0]}

function buildLibraryHeroHtml() {
  return `<section class="home-hero">
    <div class="home-hero__copy">
      <h2 class="home-hero__title">发现优质数字教材</h2>
      <p class="home-hero__desc">海量优质资源，助力高效学习</p>
      <div class="home-hero__actions">
        <button type="button" class="home-hero__btn home-hero__btn--primary" onclick="openLibraryCatalog()">探索全部教材 <span aria-hidden="true">→</span></button>
      </div>
    </div>
    <div class="home-hero__visual" aria-hidden="true">
      <img class="home-hero__image" src="/reader/home-hero-digital-textbook.png" width="1774" height="887" alt="">
    </div>
  </section>`;
}

function mkLibraryShowcaseCard(item, i) {
  const matchedBookIdx = books.findIndex((b) => b.t === item.t);
  const bookIdx = matchedBookIdx >= 0 ? matchedBookIdx : i % books.length;
  return `<article class="library-card" onclick="openDetail(${bookIdx},'lib')">
    <div class="library-card__cover library-cover--${item.theme}">
      <div class="library-card__cover-inner">
        <div class="library-card__title">${escAttr(item.t)}</div>
        <div class="library-card__en">${escAttr(item.en)}</div>
        <div class="library-card__editor">主编：${escAttr(item.editor)}</div>
        <div class="library-card__figure" aria-hidden="true"></div>
      </div>
    </div>
    <div class="library-card__body">
      <h3 class="library-card__name">${escAttr(item.t)}</h3>
      <p class="library-card__publisher">${escAttr(item.publisher)}</p>
    </div>
  </article>`;
}

/** 后台配置：是否为纸数融合教材 */
function isPaperDigital(b){return !!(b&&b.paperDigital)}

// Book descriptions
const DESC={
  运动营养:'本教材围绕运动前、中、后的能量供给、营养补给与身体恢复，结合校园运动、体能训练和职业健康场景展开。通过饮食记录、能量消耗估算与补水方案设计，帮助学习者理解营养素、运动强度和恢复节奏之间的关系。',
  计算机基础:'本教材依据中等职业学校信息技术课程标准，从计算机软硬件、操作系统、信息素养与安全等方面建立完整认知。通过上机任务与项目案例，培养规范操作、信息意识与基本的信息技术应用能力，为后续专业学习打牢基础。',
  程序设计:'本教材以中职学生认知规律为主线，从语法基础到模块化与面向对象，配合大量例题与综合实训。强调算法思维、调试能力与代码规范，衔接岗位常见的控制台与小型应用开发场景。',
  Python:'本教材选用 Python 作为首门编程语言，涵盖基本语法、数据结构、文件与异常、简单类与包管理等内容。以「做中学」为路径，通过脚本自动化、小工具与轻量项目培养计算思维与可迁移的编程能力。',
  计算机网络:'本教材介绍网络体系结构、IP 与路由、交换与无线、常见服务与安全初步，配合仿真与实机操作。帮助理解互联网工作原理与常见网络故障的排查思路，为运维与开发岗位奠基。',
  Web前端:'本教材围绕网站搭建与页面呈现，系统讲解 HTML 语义、CSS 布局与响应式、基础交互与可访问性意识。通过多页面项目串联，培养版面还原、规范编码与与后端协作的接口意识。',
  办公应用:'本教材面向现代办公与信息化岗位，介绍文字处理、表格、演示与信息检索协作，并融入 WPS/Office 高效操作。强调版式、数据与汇报场景中的规范表达，提升信息整理与展示能力。',
  数字媒体:'本教材从图形图像基础、版式设计、色彩与字体规范到简单动效，配合常用工具完成图文排版与轻量设计。培养审美意识、作品版权意识与在数字内容岗位中的基本产出能力。',
  数据库:'本教材以关系型数据库为核心，讲解概念模型、SQL 增删改查、约束与简单程序访问，延伸到备份与安全常识。以真实业务小库为练手，提升数据组织能力与岗位常见的数据质量意识。',
  Linux:'本教材从命令行与文件系统入手，介绍用户与权限、进程与服务、包管理与网络配置，并涉及 Shell 脚本初步。为服务器部署、运维与云主机操作提供实操路径。',
  算法与结构:'本教材精选线性表、栈与队列、树与图、排序与查找等基础结构，以 C 语言实现为主，强调时间空间复杂度分析。为后续学习人工智能与工程实践建立严谨的抽象与推理能力。',
  人工智能:'本教材以中职可理解的深度介绍智能时代的技术脉络、典型应用与数据伦理。涵盖搜索与推理、机器学习与深度学习概览、生成式与就业面向，并突出合规、隐私与可解释性讨论。',
  机器学习:'本教材在人工智能导论基础上，从数据集划分、特征与评价指标切入，讲解决策树、近邻、朴素贝叶斯与基础神经网络等。配合开源工具链演示训练与调参的完整流程，强调可复现实验与报告习惯。',
  深度学习:'本教材以计算机视觉与语音/文本的入门应用为主线，介绍张量、卷积与简单序列模型，配合轻量项目体验部署与端侧应用。注意算力、数据与模型风险的工程视角。',
  自然语言:'本教材介绍分词、词向量、文本分类与简单对话等任务，并演示调用主流模型接口完成「文本理解+生成」小项目。关注提示工程、安全与内容审核在真实产品中的基本做法。',
  云计算:'本教材以虚拟化与容器、公有云基本服务、自动化部署为线索，用演示环境完成站点发布与简单伸缩。帮助建立「资源即服务、配置即代码」的运维与协作意识。',
  大数据:'本教材介绍数据生命周期、Hadoop 生态组件概念、ETL 与批流处理初体验，以可视化小案例理解指标与看板。强调数据治理、隐私与合规在采集与分析中的基本约束。',
  移动开发:'本教材从 Android 工程结构、Activity 与布局、数据存储与网络请求入门，以小型 App 为牵引培养界面与交互实现能力。为对接前后端与上架规范预留扩展位。',
  网络安全:'本教材从密码学常识、身份认证、常见漏洞与防护、等级保护与应急响应入门组织内容。以攻防演示培养底线思维与安全开发生命周期意识，强调合法合规的实验环境。',
  机器人:'本教材涵盖传感器、执行器、开环与闭环控制、运动学与简单视觉，配合示教与仿真完成任务编程。与智能制造岗位衔接，培养机电软协同解决问题的基本能力。',
};

// TOC data per subject
const TOC={
  计算机基础:[
    {u:'第一单元 信息与计算环境',ls:['1.1 信息与数字化','1.2 计算机组成概览','1.3 操作系统与界面操作']},
    {u:'第二单元 网络与信息社会责任',ls:['2.1 互联网与常用服务','2.2 信息安全与密码常识','2.3 信息伦理与版权']},
  ],
  程序设计:[
    {u:'模块一 基础语法与流程',ls:['1.1 环境搭建与项目结构','1.2 变量、类型与输入输出','1.3 条件与循环']},
    {u:'模块二 函数与工程习惯',ls:['2.1 函数与模块化','2.2 文件与项目组织','2.3 综合实训：小型工具']},
  ],
  Python:[
    {u:'入门篇 语法与数据',ls:['第1课 环境、变量与基本类型','第2课 条件与循环','第3课 函数与包导入']},
    {u:'入门篇 结构化数据',ls:['第4课 列表与字典','第5课 文件与异常']},
    {u:'项目篇 综合案例',ls:['项目一 数据清洗脚本','项目二 简易成绩统计']},
  ],
  计算机网络:[
    {u:'第1章 网络与协议栈',ls:['1.1 局域网与因特网','1.2 OSI 与 TCP/IP 简介','1.3 IP 地址与 DNS']},
    {u:'第2章 传输与互联',ls:['2.1 路由与交换','2.2 应用层：HTTP/HTTPS','2.3 安全基础：防火墙与常见攻击']},
  ],
  Web前端:[
    {u:'第1章 语义化页面',ls:['1.1 文档结构与文本','1.2 超链接、图像与媒体','1.3 列表与表格']},
    {u:'第2章 样式与布局',ls:['2.1 盒模型与布局入门','2.2 Flex 与响应式','2.3 可访问性初步']},
  ],
  办公应用:[
    {u:'单元一 文档与表格',ls:['1.1 格式与样式','1.2 长文档与目录','1.3 数据表与基础函数']},
    {u:'单元二 报告与展示',ls:['2.1 图表与数据可视化','2.2 演讲稿与放映','2.3 协作与版本']},
  ],
  数字媒体:[
    {u:'上篇 设计基础',ls:['1 平面构成与版式','2 色彩与对比','3 品牌与信息层级']},
    {u:'下篇 项目实训',ls:['4 海报与多页宣传册','5 自媒体封面']},
  ],
  数据库:[
    {u:'第1部分 关系与 SQL',ls:['1.1 概念、键与关系','1.2 查询、过滤与排序','1.3 连接与聚合']},
    {u:'第2部分 设计与管理',ls:['2.1 表设计与范式初步','2.2 用户权限与备份']},
  ],
  Linux:[
    {u:'第1章 Shell 与文件',ls:['1.1 发行版与目录树','1.2 用户与权限','1.3 重定向与管道']},
    {u:'第2章 服务与网络',ls:['2.1 进程与 systemd','2.2 包管理与环境变量','2.3 网络配置与排障']},
  ],
  算法与结构:[
    {u:'基础结构',ls:['1.1 线性表与链式存储','1.2 栈与队列','1.3 树与简单遍历']},
    {u:'经典算法',ls:['2.1 查找与排序','2.2 分治与递推']},
  ],
  人工智能:[
    {u:'模块1 导论与伦理',ls:['1.1 从规则到学习','1.2 数据、模型与可解释性','1.3 安全、隐私与法规']},
    {u:'模块2 技术脉络',ls:['2.1 机器学习与深度学习关系','2.2 大模型与就业面向']},
  ],
  机器学习:[
    {u:'第1章 问题定义与数据',ls:['1.1 监督/无监督','1.2 划分、验证与过拟合','1.3 指标与混淆矩阵']},
    {u:'第2章 模型入门',ls:['2.1 线性/逻辑与决策树','2.2 集成与调参']},
  ],
  深度学习:[
    {u:'视觉篇',ls:['1.1 张量与网络','1.2 卷积与池化','1.3 迁移学习']},
    {u:'多模态篇',ls:['2.1 基础序列模型','2.2 语音/文本小实践']},
  ],
  自然语言:[
    {u:'文本与词表示',ls:['1.1 分词与 n-gram','1.2 向量化与相似度']},
    {u:'应用与工程',ls:['2.1 分类与命名实体','2.2 提示工程与接口']},
  ],
  云计算:[
    {u:'虚拟化与容器',ls:['1.1 虚机与镜像','1.2 Docker 基础','1.3 CI/CD 概念']},
  ],
  大数据:[
    {u:'生态与平台',ls:['1.1 批与流处理','1.2 HDFS/MapReduce 概览']},
  ],
  移动开发:[
    {u:'基础开发',ls:['1.1 工程与界面','1.2 活动与数据存储']},
  ],
  网络安全:[
    {u:'防护体系',ls:['1.1 威胁与漏洞','1.2 安全开发生命周期']},
  ],
  机器人:[
    {u:'机电与控制',ls:['1.1 传感器与执行器','1.2 开环与反馈']},
  ],
};

// Prices
const PRICES={计算机基础:21.00,程序设计:23.50,Python:26.00,计算机网络:25.00,Web前端:24.50,办公应用:19.80,数字媒体:20.00,数据库:25.50,Linux:24.00,算法与结构:22.00,人工智能:28.00,机器学习:28.50,深度学习:29.00,自然语言:27.50,云计算:26.50,大数据:26.00,移动开发:27.00,网络安全:25.80,机器人:23.00};

/** 数字教材：未购时默认可试读目录前 N 条，其余锁定；演示内「立即购买」写入会话 */
const LIB_PREVIEW_LESSON_COUNT = 2;
const libPurchasedBookKeys = new Set();
function libBookKey(b) {
  return b ? `${b.t}|${b.s}` : '';
}
function isLibBookPurchased(b) {
  return !!(b && libPurchasedBookKeys.has(libBookKey(b)));
}
let detailViewContext = { bookIdx: null, source: null, b: null };

// === CLASS GROUP DATA ===
const CURRENT_USER = '李明远';

const SCHOOL_STORAGE_KEY = 'sc-digital-school';
const SCHOOL_CODE_MAP = {
  CD7Z2026: '成都市第七中学',
  SCDEMO001: '四川省示范中学',
  SCH2026SC: '四川师范大学附属中学',
};

function normalizeSchoolCode(s) {
  return String(s).replace(/[^A-Za-z0-9]/g, '').toUpperCase();
}

function getBoundSchool() {
  try {
    const raw = localStorage.getItem(SCHOOL_STORAGE_KEY);
    if (!raw) return null;
    const o = JSON.parse(raw);
    if (o && typeof o.name === 'string' && o.name) return o;
  } catch (_) {}
  return null;
}

function setBoundSchool(school) {
  if (school) localStorage.setItem(SCHOOL_STORAGE_KEY, JSON.stringify(school));
  else localStorage.removeItem(SCHOOL_STORAGE_KEY);
}

function resolveSchoolName(code) {
  const n = normalizeSchoolCode(code);
  if (SCHOOL_CODE_MAP[n]) return SCHOOL_CODE_MAP[n];
  const t = code.trim();
  if (t.length <= 10) return `合作学校（${t}）`;
  return `合作学校（${t.slice(0, 10)}…）`;
}

let schoolModalMode = 'bind';

function openSchoolModal(mode) {
  if (!FEATURE_SCHOOL_UI) return;
  schoolModalMode = mode === 'change' ? 'change' : 'bind';
  const input = document.getElementById('schoolActivationCode');
  const school = getBoundSchool();
  if (input) {
    input.value = schoolModalMode === 'change' && school ? school.code : '';
    input.classList.remove('school-modal-input--err');
  }
  document.getElementById('schoolModalOverlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => input?.focus(), 100);
}

function closeSchoolModal() {
  document.getElementById('schoolModalOverlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

function confirmSchoolBind() {
  if (!FEATURE_SCHOOL_UI) return;
  const input = document.getElementById('schoolActivationCode');
  const raw = (input?.value || '').trim();
  if (raw.length < 4) {
    input?.classList.add('school-modal-input--err');
    setTimeout(() => input?.classList.remove('school-modal-input--err'), 1500);
    return;
  }
  const name = resolveSchoolName(raw);
  setBoundSchool({ name, code: raw });
  closeSchoolModal();
  refreshSchoolDependentPages();
  const toast = document.createElement('div');
  toast.style.cssText =
    'position:fixed;bottom:32px;left:50%;transform:translateX(-50%);background:var(--deep);color:white;padding:14px 28px;border-radius:12px;font-size:13px;z-index:320;box-shadow:0 8px 30px rgba(0,0,0,0.15);animation:fadeUp 0.3s ease;display:flex;align-items:center;gap:10px';
  toast.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>已绑定：${name}`;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 2200);
}

function clearSchoolBind() {
  if (!FEATURE_SCHOOL_UI) return;
  setBoundSchool(null);
  refreshSchoolDependentPages();
  const toast = document.createElement('div');
  toast.style.cssText =
    'position:fixed;bottom:32px;left:50%;transform:translateX(-50%);background:var(--deep);color:white;padding:14px 28px;border-radius:12px;font-size:13px;z-index:320;box-shadow:0 8px 30px rgba(0,0,0,0.15);animation:fadeUp 0.3s ease';
  toast.textContent = '已解除学校绑定';
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

const PROFILE_STORAGE_KEY = 'sc-user-profile';
const DEFAULT_USER_PROFILE = {
  nickname: '李明远',
  phone: '13800138000',
  roleLine: '省示范中职 · 计算机专业教师',
  avatarDataUrl: '',
};

/** 演示登录层默认预填信息（演示无真实校验，密码满足≥6位即可） */
const DEMO_LOGIN_PASSWORD = 'demo123456';

function getUserProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return null;
    const o = JSON.parse(raw);
    return { ...DEFAULT_USER_PROFILE, ...o };
  } catch (_) {
    return null;
  }
}

/** 组群/演示逻辑中的「当前用户姓名」：已登录用昵称，否则回退常量 */
function getCurrentUserDisplayName() {
  const u = getUserProfile();
  const n = u && u.nickname ? String(u.nickname).trim() : '';
  return n || CURRENT_USER;
}

function saveUserProfile(partial) {
  const prev = getUserProfile();
  const next = { ...DEFAULT_USER_PROFILE, ...(prev || {}), ...partial };
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(next));
  syncSidebarUser();
}

function escAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

/** 脱敏显示 11 位手机号 */
function maskPhone(phone) {
  const s = String(phone || '').replace(/\D/g, '');
  if (s.length === 11) return `${s.slice(0, 3)}****${s.slice(7)}`;
  if (s.length) return s;
  return '未绑定';
}

/** 换绑手机号：演示用短信验证码状态（正式环境接短信网关） */
let _phoneOtp = { code: '', target: '', cool: 0 };
let _phoneOtpTimer = null;
function _clearPhoneOtpTimer() {
  if (_phoneOtpTimer) {
    clearInterval(_phoneOtpTimer);
    _phoneOtpTimer = null;
  }
}

function syncSidebarUser() {
  const u = getUserProfile();
  const av = document.getElementById('sidebarAvatar') || document.querySelector('.sidebar-foot .avatar');
  const nameEl = document.getElementById('sidebarUserName') || document.querySelector('.sidebar-foot .user-name');
  const topbarAvatar = document.getElementById('topbarAvatar');
  const topbarName = document.getElementById('topbarUserName');
  if (!u) {
    if (av) {
      av.style.backgroundImage = '';
      av.style.backgroundSize = '';
      av.style.backgroundPosition = '';
      av.textContent = '登';
    }
    if (nameEl) nameEl.textContent = '未登录';
    if (topbarAvatar) topbarAvatar.textContent = '登';
    if (topbarName) topbarName.textContent = '请先登录';
    const schoolEl = document.getElementById('sidebarUserSchool');
    if (schoolEl) schoolEl.hidden = true;
    return;
  }
  if (av) {
    if (u.avatarDataUrl) {
      av.style.backgroundImage = `url(${JSON.stringify(u.avatarDataUrl)})`;
      av.style.backgroundSize = 'cover';
      av.style.backgroundPosition = 'center';
      av.textContent = '';
    } else {
      av.style.backgroundImage = '';
      av.style.backgroundSize = '';
      av.style.backgroundPosition = '';
      const n = (u.nickname && u.nickname.trim()) ? u.nickname.trim().slice(0, 1) : '用';
      av.textContent = n;
    }
  }
  if (nameEl) nameEl.textContent = u.nickname || DEFAULT_USER_PROFILE.nickname;
  if (topbarAvatar) topbarAvatar.textContent = (u.nickname || DEFAULT_USER_PROFILE.nickname).trim().slice(0, 1);
  if (topbarName) topbarName.textContent = u.nickname || DEFAULT_USER_PROFILE.nickname;
  const schoolEl = document.getElementById('sidebarUserSchool');
  if (schoolEl) {
    if (!FEATURE_SCHOOL_UI) {
      schoolEl.hidden = true;
    } else {
      const sch = getBoundSchool();
      schoolEl.textContent = sch && sch.name ? sch.name : '成都市第七中学（演示）';
      schoolEl.hidden = false;
    }
  }
}

/** 登录页与主壳显隐：无本地会话时全屏登录 */
function applyAuthShell() {
  const logged = !!localStorage.getItem(PROFILE_STORAGE_KEY);
  document.body.classList.toggle('login-overlay-active', !logged);
  const app = document.querySelector('.app');
  if (app) app.hidden = !logged;
  const lo = document.getElementById('loginOverlay');
  if (lo) {
    lo.classList.toggle('open', !logged);
    lo.setAttribute('aria-hidden', logged ? 'true' : 'false');
  }
  if (!logged) {
    document.body.style.overflow = 'hidden';
  } else if (
    !document.getElementById('readerOverlay')?.classList.contains('open') &&
    !document.getElementById('teachModePage')?.classList.contains('open') &&
    !document.getElementById('avModePage')?.classList.contains('open')
  ) {
    document.body.style.overflow = '';
  }
}

let _loginOtp = { code: '', target: '', cool: 0 };
let _loginOtpTimer = null;
function _clearLoginOtpTimer() {
  if (_loginOtpTimer) {
    clearInterval(_loginOtpTimer);
    _loginOtpTimer = null;
  }
}

function initLoginForm() {
  const p1 = document.getElementById('loginPhonePwd');
  const p2 = document.getElementById('loginPhoneOtp');
  const pw = document.getElementById('loginPassword');
  const c = document.getElementById('loginSmsCode');
  const e1 = document.getElementById('loginErrPwd');
  const e2 = document.getElementById('loginErrOtp');
  const demoPhone = DEFAULT_USER_PROFILE.phone;
  if (p1) p1.value = demoPhone;
  if (p2) p2.value = demoPhone;
  if (pw) pw.value = DEMO_LOGIN_PASSWORD;
  if (c) c.value = '';
  if (e1) e1.textContent = '';
  if (e2) e2.textContent = '';
  _loginOtp = { code: '', target: '', cool: 0 };
  _clearLoginOtpTimer();
  const btn = document.getElementById('loginSendCodeBtn');
  if (btn) {
    btn.disabled = false;
    btn.textContent = '获取验证码';
  }
  setLoginTab('pwd');
  showLoginMain();
  const rp = document.getElementById('regPhone');
  const rs = document.getElementById('regSmsCode');
  const rpw = document.getElementById('regPassword');
  const rpw2 = document.getElementById('regPassword2');
  const re = document.getElementById('regErr');
  if (import.meta.env.DEV && rp) rp.value = demoPhone;
  else if (rp) rp.value = '';
  if (rs) rs.value = '';
  if (rpw) rpw.value = '';
  if (rpw2) rpw2.value = '';
  if (re) re.textContent = '';
  const fp = document.getElementById('fgPhone');
  const fs = document.getElementById('fgSmsCode');
  const fpw = document.getElementById('fgPassword');
  const fpw2 = document.getElementById('fgPassword2');
  const fe = document.getElementById('fgErr');
  if (import.meta.env.DEV && fp) fp.value = demoPhone;
  else if (fp) fp.value = '';
  if (fs) fs.value = '';
  if (fpw) fpw.value = '';
  if (fpw2) fpw2.value = '';
  if (fe) fe.textContent = '';
  _regOtp = { code: '', target: '', cool: 0 };
  _forgotOtp = { code: '', target: '', cool: 0 };
  _clearRegOtpTimer();
  _clearForgotOtpTimer();
  const rb = document.getElementById('regSendCodeBtn');
  if (rb) {
    rb.disabled = false;
    rb.textContent = '获取验证码';
  }
  const fb = document.getElementById('fgSendCodeBtn');
  if (fb) {
    fb.disabled = false;
    fb.textContent = '获取验证码';
  }
}

function showLoginMain() {
  document.getElementById('loginMainBlock')?.classList.remove('login-main--hidden');
  document.getElementById('loginPaneRegister')?.classList.add('login-pane--hidden');
  document.getElementById('loginPaneForgot')?.classList.add('login-pane--hidden');
}

function showLoginRegister() {
  document.getElementById('loginMainBlock')?.classList.add('login-main--hidden');
  document.getElementById('loginPaneRegister')?.classList.remove('login-pane--hidden');
  document.getElementById('loginPaneForgot')?.classList.add('login-pane--hidden');
  document.getElementById('regErr') && (document.getElementById('regErr').textContent = '');
}

function showLoginForgot() {
  document.getElementById('loginMainBlock')?.classList.add('login-main--hidden');
  document.getElementById('loginPaneForgot')?.classList.remove('login-pane--hidden');
  document.getElementById('loginPaneRegister')?.classList.add('login-pane--hidden');
  document.getElementById('fgErr') && (document.getElementById('fgErr').textContent = '');
}

let _regOtp = { code: '', target: '', cool: 0 };
let _regOtpTimer = null;
function _clearRegOtpTimer() {
  if (_regOtpTimer) {
    clearInterval(_regOtpTimer);
    _regOtpTimer = null;
  }
}

let _forgotOtp = { code: '', target: '', cool: 0 };
let _forgotOtpTimer = null;
function _clearForgotOtpTimer() {
  if (_forgotOtpTimer) {
    clearInterval(_forgotOtpTimer);
    _forgotOtpTimer = null;
  }
}

function sendRegisterSmsCode() {
  const p = document.getElementById('regPhone')?.value.trim() || '';
  const err = document.getElementById('regErr');
  if (err) err.textContent = '';
  if (!/^1\d{10}$/.test(p)) {
    if (err) err.textContent = '请输入正确的 11 位手机号';
    return;
  }
  if (_regOtp.cool > 0) return;
  const code = String(100000 + Math.floor(Math.random() * 900000));
  _regOtp.code = code;
  _regOtp.target = p;
  const btn = document.getElementById('regSendCodeBtn');
  _regOtp.cool = 60;
  showProfileToast(`验证码已发送（演示：${code}）`);
  const tick = () => {
    _regOtp.cool = Math.max(0, _regOtp.cool - 1);
    if (btn) {
      btn.textContent = _regOtp.cool > 0 ? `${_regOtp.cool} s 后重发` : '获取验证码';
      btn.disabled = _regOtp.cool > 0;
    }
    if (_regOtp.cool <= 0) _clearRegOtpTimer();
  };
  tick();
  _regOtpTimer = setInterval(tick, 1000);
}

function sendForgotSmsCode() {
  const p = document.getElementById('fgPhone')?.value.trim() || '';
  const err = document.getElementById('fgErr');
  if (err) err.textContent = '';
  if (!/^1\d{10}$/.test(p)) {
    if (err) err.textContent = '请输入正确的 11 位手机号';
    return;
  }
  if (_forgotOtp.cool > 0) return;
  const code = String(100000 + Math.floor(Math.random() * 900000));
  _forgotOtp.code = code;
  _forgotOtp.target = p;
  const btn = document.getElementById('fgSendCodeBtn');
  _forgotOtp.cool = 60;
  showProfileToast(`验证码已发送（演示：${code}）`);
  const tick = () => {
    _forgotOtp.cool = Math.max(0, _forgotOtp.cool - 1);
    if (btn) {
      btn.textContent = _forgotOtp.cool > 0 ? `${_forgotOtp.cool} s 后重发` : '获取验证码';
      btn.disabled = _forgotOtp.cool > 0;
    }
    if (_forgotOtp.cool <= 0) _clearForgotOtpTimer();
  };
  tick();
  _forgotOtpTimer = setInterval(tick, 1000);
}

function submitRegister() {
  const phone = document.getElementById('regPhone')?.value.trim() || '';
  const code = document.getElementById('regSmsCode')?.value.trim() || '';
  const pwd = document.getElementById('regPassword')?.value || '';
  const pwd2 = document.getElementById('regPassword2')?.value || '';
  const err = document.getElementById('regErr');
  if (err) err.textContent = '';
  if (!/^1\d{10}$/.test(phone)) {
    if (err) err.textContent = '请输入正确的 11 位手机号';
    return;
  }
  if (!/^\d{6}$/.test(code)) {
    if (err) err.textContent = '请输入 6 位短信验证码';
    return;
  }
  if (!_regOtp.code) {
    if (err) err.textContent = '请先点击「获取验证码」';
    return;
  }
  if (phone !== _regOtp.target) {
    if (err) err.textContent = '手机号与接收验证码的号码不一致，请重新获取验证码';
    return;
  }
  if (code !== _regOtp.code) {
    if (err) err.textContent = '验证码错误';
    return;
  }
  if (pwd.length < 6) {
    if (err) err.textContent = '密码至少 6 位';
    return;
  }
  if (pwd !== pwd2) {
    if (err) err.textContent = '两次输入的密码不一致';
    return;
  }
  _clearRegOtpTimer();
  const btn = document.getElementById('regSendCodeBtn');
  if (btn) {
    btn.disabled = false;
    btn.textContent = '获取验证码';
  }
  const nickname =
    phone === '13800138000' ? DEFAULT_USER_PROFILE.nickname : `用户${phone.slice(-4)}`;
  completeLoginSession(
    phone,
    nickname,
    `注册成功，欢迎使用，${nickname || '用户'}`
  );
}

function submitForgotPassword() {
  const phone = document.getElementById('fgPhone')?.value.trim() || '';
  const code = document.getElementById('fgSmsCode')?.value.trim() || '';
  const pwd = document.getElementById('fgPassword')?.value || '';
  const pwd2 = document.getElementById('fgPassword2')?.value || '';
  const err = document.getElementById('fgErr');
  if (err) err.textContent = '';
  if (!/^1\d{10}$/.test(phone)) {
    if (err) err.textContent = '请输入正确的 11 位手机号';
    return;
  }
  if (!/^\d{6}$/.test(code)) {
    if (err) err.textContent = '请输入 6 位短信验证码';
    return;
  }
  if (!_forgotOtp.code) {
    if (err) err.textContent = '请先点击「获取验证码」';
    return;
  }
  if (phone !== _forgotOtp.target) {
    if (err) err.textContent = '手机号与接收验证码的号码不一致，请重新获取验证码';
    return;
  }
  if (code !== _forgotOtp.code) {
    if (err) err.textContent = '验证码错误';
    return;
  }
  if (pwd.length < 6) {
    if (err) err.textContent = '新密码至少 6 位';
    return;
  }
  if (pwd !== pwd2) {
    if (err) err.textContent = '两次输入的新密码不一致';
    return;
  }
  _clearForgotOtpTimer();
  const btn = document.getElementById('fgSendCodeBtn');
  if (btn) {
    btn.disabled = false;
    btn.textContent = '获取验证码';
  }
  const nickname =
    phone === '13800138000' ? DEFAULT_USER_PROFILE.nickname : `用户${phone.slice(-4)}`;
  completeLoginSession(
    phone,
    nickname,
    `密码已重置（演示），已为您登录，${nickname || '用户'}`
  );
}

function setLoginTab(which) {
  const pwdTab = document.getElementById('loginTabPwd');
  const otpTab = document.getElementById('loginTabOtp');
  const pwdPane = document.getElementById('loginPanePwd');
  const otpPane = document.getElementById('loginPaneOtp');
  const isPwd = which !== 'otp';
  pwdTab?.classList.toggle('is-active', isPwd);
  otpTab?.classList.toggle('is-active', !isPwd);
  pwdTab?.setAttribute('aria-selected', isPwd ? 'true' : 'false');
  otpTab?.setAttribute('aria-selected', !isPwd ? 'true' : 'false');
  pwdPane?.classList.toggle('login-pane--hidden', !isPwd);
  otpPane?.classList.toggle('login-pane--hidden', isPwd);
  pwdPane?.setAttribute('aria-hidden', isPwd ? 'false' : 'true');
  otpPane?.setAttribute('aria-hidden', isPwd ? 'true' : 'false');
  document.getElementById('loginErrPwd') && (document.getElementById('loginErrPwd').textContent = '');
  document.getElementById('loginErrOtp') && (document.getElementById('loginErrOtp').textContent = '');
}

function sendLoginSmsCode() {
  const p = document.getElementById('loginPhoneOtp')?.value.trim() || '';
  const err = document.getElementById('loginErrOtp');
  if (err) err.textContent = '';
  if (!/^1\d{10}$/.test(p)) {
    if (err) err.textContent = '请输入正确的 11 位手机号';
    return;
  }
  if (_loginOtp.cool > 0) return;
  const code = String(100000 + Math.floor(Math.random() * 900000));
  _loginOtp.code = code;
  _loginOtp.target = p;
  const btn = document.getElementById('loginSendCodeBtn');
  _loginOtp.cool = 60;
  showProfileToast(`验证码已发送（演示：${code}）`);
  const tick = () => {
    _loginOtp.cool = Math.max(0, _loginOtp.cool - 1);
    if (btn) {
      btn.textContent = _loginOtp.cool > 0 ? `${_loginOtp.cool} s 后重发` : '获取验证码';
      btn.disabled = _loginOtp.cool > 0;
    }
    if (_loginOtp.cool <= 0) _clearLoginOtpTimer();
  };
  tick();
  _loginOtpTimer = setInterval(tick, 1000);
}

function completeLoginSession(phone, nickname, welcomeToast) {
  saveUserProfile({
    phone,
    nickname: nickname || DEFAULT_USER_PROFILE.nickname,
  });
  initLoginForm();
  applyAuthShell();
  renderLib();
  go('library');
  tryOpenPendingBookDetail();
  tryOpenPendingReader();
  showProfileToast(
    welcomeToast || `欢迎回来，${nickname || '用户'}`
  );
}

function submitLoginPassword() {
  const phone = document.getElementById('loginPhonePwd')?.value.trim() || '';
  const pwd = document.getElementById('loginPassword')?.value || '';
  const err = document.getElementById('loginErrPwd');
  if (err) err.textContent = '';
  if (!/^1\d{10}$/.test(phone)) {
    if (err) err.textContent = '请输入正确的 11 位手机号';
    return;
  }
  if (pwd.length < 6) {
    if (err) err.textContent = '密码至少 6 位';
    return;
  }
  const nickname = phone === '13800138000' ? DEFAULT_USER_PROFILE.nickname : `用户${phone.slice(-4)}`;
  completeLoginSession(phone, nickname);
  const pwEl = document.getElementById('loginPassword');
  if (pwEl) pwEl.value = '';
}

function submitLoginOtp() {
  const phone = document.getElementById('loginPhoneOtp')?.value.trim() || '';
  const code = document.getElementById('loginSmsCode')?.value.trim() || '';
  const err = document.getElementById('loginErrOtp');
  if (err) err.textContent = '';
  if (!/^1\d{10}$/.test(phone)) {
    if (err) err.textContent = '请输入正确的 11 位手机号';
    return;
  }
  if (!/^\d{6}$/.test(code)) {
    if (err) err.textContent = '请输入 6 位短信验证码';
    return;
  }
  if (!_loginOtp.code) {
    if (err) err.textContent = '请先点击「获取验证码」';
    return;
  }
  if (phone !== _loginOtp.target) {
    if (err) err.textContent = '手机号与接收验证码的号码不一致，请重新获取验证码';
    return;
  }
  if (code !== _loginOtp.code) {
    if (err) err.textContent = '验证码错误';
    return;
  }
  const nickname = phone === '13800138000' ? DEFAULT_USER_PROFILE.nickname : `用户${phone.slice(-4)}`;
  _clearLoginOtpTimer();
  const btn = document.getElementById('loginSendCodeBtn');
  if (btn) {
    btn.disabled = false;
    btn.textContent = '获取验证码';
  }
  completeLoginSession(phone, nickname);
}

function refreshSchoolDependentPages() {
  if (document.getElementById('page-my')?.classList.contains('active')) renderMy();
  if (document.getElementById('page-settings')?.classList.contains('active')) renderSettings();
  syncSidebarUser();
}

/** 设置页 — 用户反馈待上传图片（演示，提交后对接 FormData 接口） */
let feedbackDraftFiles = [];

function resetFeedbackDraft() {
  feedbackDraftFiles = [];
}

function onFeedbackFilesChange(e) {
  const input = e.target;
  const picked = Array.from(input.files || []);
  input.value = '';
  for (const f of picked) {
    if (feedbackDraftFiles.length >= 6) break;
    if (!/^image\//.test(f.type)) continue;
    if (f.size > 4 * 1024 * 1024) {
      showProfileToast('单张图片请小于 4MB');
      continue;
    }
    feedbackDraftFiles.push(f);
  }
  renderFeedbackPreview();
}

function removeFeedbackImage(idx) {
  feedbackDraftFiles.splice(idx, 1);
  renderFeedbackPreview();
}

function renderFeedbackPreview() {
  const box = document.getElementById('feedbackModalPreview');
  if (!box) return;
  box.querySelectorAll('.feedback-thumb').forEach((img) => {
    if (img.src.startsWith('blob:')) URL.revokeObjectURL(img.src);
  });
  box.innerHTML = feedbackDraftFiles
    .map(
      (f, i) => `
    <div class="feedback-thumb-wrap">
      <img class="feedback-thumb" src="${URL.createObjectURL(f)}" alt="">
      <button type="button" class="feedback-thumb-remove" onclick="removeFeedbackImage(${i})" aria-label="移除">×</button>
    </div>`
    )
    .join('');
}

function _clearFeedbackMetaFields() {
  const ids = [
    'feedbackIdentity',
    'feedbackSchool',
    'feedbackDuty',
    'feedbackSubject',
    'feedbackEmail',
    'feedbackModalText',
  ];
  for (const id of ids) {
    const el = document.getElementById(id);
    if (!el) continue;
    if (el.tagName === 'SELECT') el.value = '';
    else el.value = '';
  }
}

function openFeedbackModal() {
  if (!getUserProfile()) return;
  resetFeedbackDraft();
  _clearFeedbackMetaFields();
  const fi = document.getElementById('feedbackModalFileInput');
  if (fi) fi.value = '';
  renderFeedbackPreview();
  document.getElementById('feedbackModalOverlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('feedbackIdentity')?.focus(), 100);
}

function closeFeedbackModal() {
  document.getElementById('feedbackModalOverlay')?.classList.remove('open');
  document.body.style.overflow = '';
  resetFeedbackDraft();
  _clearFeedbackMetaFields();
  const fi = document.getElementById('feedbackModalFileInput');
  if (fi) fi.value = '';
  renderFeedbackPreview();
}

function submitUserFeedback() {
  const identity = document.getElementById('feedbackIdentity')?.value?.trim() || '';
  if (!identity) {
    showProfileToast('请选择身份');
    document.getElementById('feedbackIdentity')?.focus();
    return;
  }
  const school = document.getElementById('feedbackSchool')?.value?.trim() || '';
  const duty = document.getElementById('feedbackDuty')?.value?.trim() || '';
  const subject = document.getElementById('feedbackSubject')?.value?.trim() || '';
  const email = document.getElementById('feedbackEmail')?.value?.trim() || '';
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showProfileToast('请填写正确的邮箱格式');
    document.getElementById('feedbackEmail')?.focus();
    return;
  }
  const ta = document.getElementById('feedbackModalText');
  const text = (ta && ta.value.trim()) || '';
  if (!text && feedbackDraftFiles.length === 0) {
    showProfileToast('请填写反馈内容或上传图片');
    return;
  }
  const fd = new FormData();
  fd.append('identity', identity);
  fd.append('school', school);
  fd.append('duty', duty);
  fd.append('subject', subject);
  fd.append('email', email);
  fd.append('content', text);
  fd.append('client', 'web-demo');
  feedbackDraftFiles.forEach((f, i) => fd.append(`image_${i}`, f, f.name));
  console.log('[用户反馈·演示]', {
    identity,
    school: school || undefined,
    duty: duty || undefined,
    subject: subject || undefined,
    email: email || undefined,
    content: text,
    images: feedbackDraftFiles.map((f) => ({ name: f.name, size: f.size })),
  });
  closeFeedbackModal();
  showProfileToast('反馈已提交，我们会尽快处理（演示）');
}

function showProfileToast(msg) {
  const toast = document.createElement('div');
  toast.style.cssText =
    'position:fixed;bottom:32px;left:50%;transform:translateX(-50%);background:var(--deep);color:white;padding:14px 28px;border-radius:12px;font-size:13px;z-index:320;box-shadow:0 8px 30px rgba(0,0,0,0.15);animation:fadeUp 0.3s ease';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 2200);
}

function renderSettings() {
  const u = getUserProfile();
  if (!u) {
    document.getElementById('page-settings').innerHTML = `
    <div class="settings-page">
      <div class="settings-card">
        <p class="settings-empty-login">请先登录后查看设置。</p>
      </div>
    </div>`;
    return;
  }
  const schoolBlock = FEATURE_SCHOOL_UI
    ? (() => {
        const sch = getBoundSchool();
        const schoolHtml = sch
          ? `<div class="settings-school-line"><span class="settings-school-name">${escAttr(sch.name)}</span><span class="settings-school-sub">已绑定</span></div>
       <div class="settings-school-actions">
         <button type="button" class="btn-settings-ghost" onclick="openSchoolModal('change')">更换学校</button>
         <button type="button" class="settings-link-danger" onclick="clearSchoolBind()">解除绑定</button>
       </div>`
          : `<div class="settings-school-line muted">未绑定学校</div>
       <div class="settings-school-actions">
         <button type="button" class="btn-settings-primary" onclick="openSchoolModal('bind')">绑定学校</button>
       </div>`;
        return `<label class="settings-label">学校 <span class="settings-optional">（选填）</span></label>
            ${schoolHtml}`;
      })()
    : '';

  const avLetter = escAttr((u.nickname && u.nickname.trim()) ? u.nickname.trim().slice(0, 1) : '用');

  document.getElementById('page-settings').innerHTML = `
    <div class="settings-page">
      <div class="settings-card">
        <h2 class="settings-card-title">个人信息</h2>
        <div class="settings-profile-block">
          <div class="settings-avatar-col">
            <div class="settings-avatar${u.avatarDataUrl ? ' settings-avatar--img' : ''}" id="settingsAvatarDisplay">${u.avatarDataUrl ? '' : avLetter}</div>
            <input type="file" id="settingsAvatarInput" accept="image/jpeg,image/png,image/webp,image/gif" style="display:none" onchange="handleSettingsAvatar(event)">
            <button type="button" class="btn-settings-text" onclick="document.getElementById('settingsAvatarInput').click()">更换头像</button>
            <p class="settings-hint">支持 JPG、PNG，建议小于 2MB</p>
          </div>
          <div class="settings-fields-col">
            <label class="settings-label" for="settingsNickname">昵称</label>
            <input type="text" id="settingsNickname" class="settings-input" maxlength="32" value="${escAttr(u.nickname)}" placeholder="请输入昵称" autocomplete="nickname">
            ${schoolBlock}
          </div>
        </div>
      </div>
      <div class="settings-card">
        <h2 class="settings-card-title">账户信息</h2>
        <label class="settings-label">手机号</label>
        <div class="settings-phone-row">
          <span class="settings-phone-val" id="settingsPhoneDisplay">${escAttr(maskPhone(u.phone))}</span>
          <button type="button" class="btn-settings-ghost" onclick="openPhoneModal()">修改</button>
        </div>
        <p class="settings-hint">用于登录与安全验证。换绑请点击「修改」，在弹窗中输入新号码与短信验证码。</p>
      </div>
      <div class="settings-card settings-card--compact">
        <h2 class="settings-card-title">安全</h2>
        <button type="button" class="settings-row-action" onclick="openPasswordModal()">
          <span>修改密码</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
      <div class="settings-card settings-card--compact">
        <h2 class="settings-card-title">帮助与反馈</h2>
        <button type="button" class="settings-row-action" onclick="openFeedbackModal()">
          <span>用户反馈</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
      <div class="settings-logout-wrap">
        <button type="button" class="btn-settings-logout" onclick="logoutAccount()">退出账号</button>
      </div>
    </div>`;
  const avDisp = document.getElementById('settingsAvatarDisplay');
  if (avDisp && u.avatarDataUrl) {
    avDisp.style.backgroundImage = `url(${JSON.stringify(u.avatarDataUrl)})`;
    avDisp.classList.add('settings-avatar--img');
    avDisp.textContent = '';
  }
  const nickInp = document.getElementById('settingsNickname');
  if (nickInp) {
    const onNickBlur = () => {
      if (!document.getElementById('page-settings')?.classList.contains('active')) return;
      const v = String(nickInp.value).trim() || '';
      const prev = getUserProfile().nickname || '';
      if (v === prev) return;
      if (!v) {
        nickInp.value = prev;
        showProfileToast('昵称不能为空');
        return;
      }
      saveUserProfile({ nickname: v });
      showProfileToast('昵称已保存');
      const ad = document.getElementById('settingsAvatarDisplay');
      if (ad && !getUserProfile().avatarDataUrl) {
        ad.textContent = v.slice(0, 1);
      }
    };
    nickInp.addEventListener('blur', onNickBlur);
  }
}

function handleSettingsAvatar(e) {
  const f = e.target.files && e.target.files[0];
  e.target.value = '';
  if (!f || !/^image\//.test(f.type)) return;
  if (f.size > 2 * 1024 * 1024) {
    showProfileToast('图片请小于 2MB');
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    saveUserProfile({ avatarDataUrl: reader.result });
    showProfileToast('头像已更新');
    renderSettings();
  };
  reader.readAsDataURL(f);
}

function openPhoneModal() {
  const u = getUserProfile();
  if (!u) return;
  const cur = document.getElementById('phoneModalCurrent');
  if (cur) cur.textContent = maskPhone(u.phone);
  const inp = document.getElementById('phoneNew');
  const code = document.getElementById('phoneCode');
  const err = document.getElementById('phoneModalErr');
  const btn = document.getElementById('phoneSendCodeBtn');
  if (inp) inp.value = '';
  if (code) code.value = '';
  if (err) err.textContent = '';
  _phoneOtp = { code: '', target: '', cool: 0 };
  _clearPhoneOtpTimer();
  if (btn) {
    btn.disabled = false;
    btn.textContent = '获取验证码';
  }
  document.getElementById('phoneModalOverlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('phoneNew')?.focus(), 50);
}

function closePhoneModal() {
  _clearPhoneOtpTimer();
  document.getElementById('phoneModalOverlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

function sendPhoneChangeCode() {
  const p = document.getElementById('phoneNew')?.value.trim() || '';
  const err = document.getElementById('phoneModalErr');
  if (err) err.textContent = '';
  if (!/^1\d{10}$/.test(p)) {
    if (err) err.textContent = '请输入正确的 11 位新手机号';
    return;
  }
  const current = getUserProfile().phone;
  if (p === current) {
    if (err) err.textContent = '新号码与当前号码相同，无需更换';
    return;
  }
  if (_phoneOtp.cool > 0) return;
  const code = String(100000 + Math.floor(Math.random() * 900000));
  _phoneOtp.code = code;
  _phoneOtp.target = p;
  const btn = document.getElementById('phoneSendCodeBtn');
  _phoneOtp.cool = 60;
  showProfileToast(`验证码已发送（演示：${code}）`);
  const tick = () => {
    _phoneOtp.cool = Math.max(0, _phoneOtp.cool - 1);
    if (btn) {
      btn.textContent = _phoneOtp.cool > 0 ? `${_phoneOtp.cool} s 后重发` : '获取验证码';
      btn.disabled = _phoneOtp.cool > 0;
    }
    if (_phoneOtp.cool <= 0) _clearPhoneOtpTimer();
  };
  tick();
  _phoneOtpTimer = setInterval(tick, 1000);
}

function confirmPhoneChange() {
  const p = document.getElementById('phoneNew')?.value.trim() || '';
  const c = document.getElementById('phoneCode')?.value.trim() || '';
  const err = document.getElementById('phoneModalErr');
  if (!/^1\d{10}$/.test(p)) {
    if (err) err.textContent = '请输入正确的 11 位新手机号';
    return;
  }
  if (!/^\d{6}$/.test(c)) {
    if (err) err.textContent = '请输入 6 位短信验证码';
    return;
  }
  if (!_phoneOtp.code) {
    if (err) err.textContent = '请先点击「获取验证码」';
    return;
  }
  if (p !== _phoneOtp.target) {
    if (err) err.textContent = '新手机号与接收验证码的号码不一致，请重新获取验证码';
    return;
  }
  if (c !== _phoneOtp.code) {
    if (err) err.textContent = '验证码错误';
    return;
  }
  if (p === getUserProfile().phone) {
    if (err) err.textContent = '新号码与当前号码相同';
    return;
  }
  if (err) err.textContent = '';
  saveUserProfile({ phone: p });
  _phoneOtp = { code: '', target: '', cool: 0 };
  _clearPhoneOtpTimer();
  closePhoneModal();
  showProfileToast('手机号已更新');
  renderSettings();
}

function openPasswordModal() {
  if (!getUserProfile()) return;
  const o = document.getElementById('pwdOld');
  const a = document.getElementById('pwdNew');
  const b = document.getElementById('pwdNew2');
  const err = document.getElementById('pwdModalErr');
  if (o) o.value = '';
  if (a) a.value = '';
  if (b) b.value = '';
  if (err) err.textContent = '';
  document.getElementById('pwdModalOverlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePasswordModal() {
  document.getElementById('pwdModalOverlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

function confirmPasswordChange() {
  const oldP = document.getElementById('pwdOld')?.value || '';
  const n1 = document.getElementById('pwdNew')?.value || '';
  const n2 = document.getElementById('pwdNew2')?.value || '';
  const errEl = document.getElementById('pwdModalErr');
  if (!oldP) {
    if (errEl) errEl.textContent = '请输入当前密码';
    return;
  }
  if (n1.length < 6) {
    if (errEl) errEl.textContent = '新密码至少 6 位';
    return;
  }
  if (n1 !== n2) {
    if (errEl) errEl.textContent = '两次输入的新密码不一致';
    return;
  }
  if (errEl) errEl.textContent = '';
  closePasswordModal();
  showProfileToast('密码已更新（演示）');
}

function logoutAccount() {
  if (!confirm('确定退出当前账号？未同步的数据可能丢失。')) return;
  localStorage.removeItem(PROFILE_STORAGE_KEY);
  localStorage.removeItem(SCHOOL_STORAGE_KEY);
  _clearLoginOtpTimer();
  _clearRegOtpTimer();
  _clearForgotOtpTimer();
  initLoginForm();
  applyAuthShell();
  syncSidebarUser();
  showProfileToast('已退出账号');
}

const classGroups=[
  {
    id:1,name:'中职·人工智能研读组',subject:'人工智能',desc:'《人工智能导论》与《机器学习》共读',
    code:'SCH2-YWRD',created:'2026-03-15',admin:'李明远',
    books:[
      {t:'人工智能导论',s:'通识与伦理',g:'中职 二年级',p:'高等教育出版社',sub:'人工智能'},
      {t:'Python程序设计',s:'入门篇',g:'中职 一年级',p:'人民邮电出版社',sub:'Python'},
      {t:'机器学习基础',s:'监督与评估',g:'中职 三年级',p:'人民邮电出版社',sub:'机器学习'},
    ],
    students:[
      {name:'王思涵',id:'2024030101',bp:[95,88,72],qp:[92,85,70],last:'今天'},
      {name:'张子墨',id:'2024030102',bp:[82,79,68],qp:[80,75,64],last:'今天'},
      {name:'刘雨桐',id:'2024030103',bp:[78,65,61],qp:[74,62,58],last:'昨天'},
      {name:'陈思远',id:'2024030104',bp:[70,60,58],qp:[68,58,55],last:'昨天'},
      {name:'赵梓涵',id:'2024030105',bp:[66,55,52],qp:[64,51,50],last:'2天前'},
      {name:'孙晓彤',id:'2024030106',bp:[62,50,48],qp:[60,48,45],last:'2天前'},
      {name:'周文博',id:'2024030107',bp:[55,48,44],qp:[52,45,40],last:'3天前'},
      {name:'吴思琪',id:'2024030108',bp:[50,40,39],qp:[48,38,36],last:'3天前'},
      {name:'郑浩然',id:'2024030109',bp:[42,35,33],qp:[40,33,30],last:'4天前'},
      {name:'马欣怡',id:'2024030110',bp:[35,28,30],qp:[33,26,28],last:'5天前'},
      {name:'黄子轩',id:'2024030111',bp:[28,20,25],qp:[26,18,22],last:'6天前'},
      {name:'林雅琪',id:'2024030112',bp:[22,15,20],qp:[20,14,18],last:'1周前'},
    ]
  },
  {
    id:2,name:'数据结构与网络实训',subject:'计算机',desc:'数据结构与网络综合练习',
    code:'SCH2-SXTG',created:'2026-03-20',admin:'李明远',
    books:[
      {t:'数据结构与算法',s:'C语言版',g:'中职 二年级',p:'清华大学出版社',sub:'算法与结构'},
      {t:'计算机网络技术',s:'基础与互联',g:'中职 一年级',p:'电子工业出版社',sub:'计算机网络'},
    ],
    students:[
      {name:'李泽宇',id:'2024030201',bp:[88,85],qp:[86,83],last:'今天'},
      {name:'杨思涵',id:'2024030202',bp:[82,80],qp:[80,78],last:'今天'},
      {name:'何子豪',id:'2024030203',bp:[75,72],qp:[72,70],last:'昨天'},
      {name:'罗雨萱',id:'2024030204',bp:[70,65],qp:[68,62],last:'昨天'},
      {name:'谢明轩',id:'2024030205',bp:[62,58],qp:[60,55],last:'2天前'},
      {name:'韩思琪',id:'2024030206',bp:[55,52],qp:[52,50],last:'3天前'},
      {name:'唐文杰',id:'2024030207',bp:[48,45],qp:[45,42],last:'4天前'},
      {name:'曹雅婷',id:'2024030208',bp:[40,38],qp:[38,35],last:'5天前'},
    ]
  },
  {
    id:3,name:'Web 与移动开发组',subject:'开发',desc:'《网页设计》+《移动应用》项目学习',
    code:'SCH2-ENRD',created:'2026-04-02',admin:'刘芳',
    books:[
      {t:'网页设计与制作',s:'HTML5/CSS3',g:'中职 一年级',p:'人民邮电出版社',sub:'Web前端'},
      {t:'移动应用开发',s:'Android基础',g:'中职 三年级',p:'电子工业出版社',sub:'移动开发'},
    ],
    students:[
      {name:'周洋',id:'2024030301',bp:[90,88],qp:[88,85],last:'今天'},
      {name:'吴静',id:'2024030302',bp:[76,74],qp:[74,70],last:'昨天'},
      {name:'李明远',id:'2024030303',bp:[68,65],qp:[65,60],last:'昨天'},
    ]
  },
  /* 演示：多组群时书架 Tab 换行（均为当前演示账号「李明远」管理，便于本地预览） */
  {
    id:4,name:'演示·04 计算机网络拓展',subject:'计算机',desc:'',
    code:'DEMO-G04',created:'2026-04-05',admin:'李明远',books:[],students:[],
  },
  {
    id:5,name:'演示·05 数据库与运维',subject:'计算机',desc:'',
    code:'DEMO-G05',created:'2026-04-06',admin:'李明远',books:[],students:[],
  },
  {
    id:6,name:'演示·06 物联网基础班',subject:'计算机',desc:'',
    code:'DEMO-G06',created:'2026-04-07',admin:'李明远',books:[],students:[],
  },
  {
    id:7,name:'演示·07 数字媒体设计',subject:'艺术',desc:'',
    code:'DEMO-G07',created:'2026-04-08',admin:'李明远',books:[],students:[],
  },
  {
    id:8,name:'演示·08 电子商务实务',subject:'商贸',desc:'',
    code:'DEMO-G08',created:'2026-04-09',admin:'李明远',books:[],students:[],
  },
  {
    id:9,name:'演示·09 会计信息化',subject:'财经',desc:'',
    code:'DEMO-G09',created:'2026-04-10',admin:'李明远',books:[],students:[],
  },
  {
    id:10,name:'演示·10 智能制造导论',subject:'制造',desc:'',
    code:'DEMO-G10',created:'2026-04-11',admin:'李明远',books:[],students:[],
  },
];

/** 当前用户是否担任至少一个组群的「管理员 / 创建者」 */
function isCurrentUserClassGroupAdmin() {
  return classGroups.some((c) => c.admin === getCurrentUserDisplayName());
}

/** 在学习模式列表中、紧跟「阅读模式」后注入「教学模式」（仅组群管理员；不由书目 readModeKeys 配置） */
function withTeachIfAdmin(modes) {
  if (!isCurrentUserClassGroupAdmin() || !modes || !modes.length) return modes;
  if (modes.some((m) => m.key === 'teach')) return modes;
  const t = BOOK_READ_MODES.find((a) => a.key === 'teach');
  if (!t) return modes;
  const out = [...modes];
  const ri = out.findIndex((m) => m.key === 'read');
  if (ri >= 0) {
    out.splice(ri + 1, 0, t);
    return out;
  }
  return [...out, t];
}

/** 当前用户可见的组群：创建者或已加入的成员 */
function isClassVisibleForUser(cls) {
  const me = getCurrentUserDisplayName();
  return cls.admin === me || cls.students.some((s) => s.name === me);
}

/** 组群教材条目与「我的教材」是否为同一本书（与添加教材逻辑一致） */
function classBookMatchesMyBook(cb, b) {
  return cb.t === b.t && cb.s === b.s;
}

/** 本书被哪些（当前用户可见的）组群用作教材，一书可对应多群 */
function getClassNamesForMyBook(b) {
  const names = [];
  for (const cls of classGroups) {
    if (!isClassVisibleForUser(cls)) continue;
    if (cls.books.some((cb) => classBookMatchesMyBook(cb, b))) names.push(cls.name);
  }
  return names;
}

/** 教材详情弹层 — 运用于组群（仅「我的教材」） */
/** 教材简介内可选视频：`introVideoEmbed` 为 iframe 地址；`introVideoUrl` 为直链视频（`<video>`），均须 https。后台可按书目配置。 */
function detailIntroVideoHtml(b) {
  const embed = b && typeof b.introVideoEmbed === 'string' ? b.introVideoEmbed.trim() : '';
  const file = b && typeof b.introVideoUrl === 'string' ? b.introVideoUrl.trim() : '';
  if (!embed && !file) return '';
  if (embed && !/^https:\/\//i.test(embed)) return '';
  if (file && !/^https:\/\//i.test(file)) return '';
  const title = escAttr(`《${b.t || '教材'}》视频介绍`);
  if (embed) {
    return `<div class="intro-video-wrap">
      <div class="intro-video-cap">视频介绍</div>
      <div class="intro-video-frame intro-video-frame--embed">
        <iframe src="${escAttr(embed)}" title="${title}" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>
      </div>
    </div>`;
  }
  return `<div class="intro-video-wrap">
    <div class="intro-video-cap">视频介绍</div>
    <div class="intro-video-frame">
      <video controls playsinline preload="metadata" src="${escAttr(file)}">您的浏览器不支持视频播放。</video>
    </div>
  </div>`;
}

function mkDetailGroupUseHtml(b) {
  const names = getClassNamesForMyBook(b);
  if (!names.length) {
    return `<div class="detail-group-use">
      <div class="detail-group-use-label">运用于组群</div>
      <p class="detail-group-use-empty">暂未关联组群</p>
    </div>`;
  }
  return `<div class="detail-group-use">
    <div class="detail-group-use-label">运用于组群</div>
    <div class="detail-group-tags" title="${names.map(escAttr).join('、')}">
      ${names.map((n) => `<span class="detail-group-tag">${escAttr(n)}</span>`).join('')}
    </div>
  </div>`;
}

function refreshMyPageIfActive() {
  if (document.getElementById('page-my')?.classList.contains('active')) renderMy();
}

const AVATAR_COLORS=[
  ['#4a8ec8','#7ab4de'],['#4a8ec8','#7ab4de'],['#d48548','#e8a870'],
  ['#8a60b8','#aa88d0'],['#c85a72','#e08898'],['#b8a030','#d0c060'],
  ['#4a98b0','#78bcd0'],['#98804a','#b8a878'],
];

function openDetail(bookIdx, source){
  const list = source === 'my' ? myB : books;
  const b = list[bookIdx];
  detailViewContext = { bookIdx, source, b };
  const [c1,c2] = c(b.sub);
  const price = PRICES[b.sub] || 19.90;
  const isMine = source === 'my';
  const libUnlocked = source === 'lib' && isLibBookPurchased(b);
  const tocFullAccess = isMine || libUnlocked;

  // Hero
  document.getElementById('detailHero').innerHTML = `
    <div class="detail-cover">
      <div class="cover-inner" style="background:linear-gradient(145deg,${c1},${c2})">
        <div class="cover-name">${b.t}</div>
        <div class="cover-sub">${b.s}</div>
      </div>
    </div>
    <div class="detail-info">
      <div class="detail-book-title">${b.t} · ${b.s}</div>
      <div class="detail-book-sub">${b.g}${isPaperDigital(b)?' · <span class="detail-pd-badge">纸数融合</span>':''}</div>
      <div class="detail-meta-grid">
        <div class="meta-item"><span class="meta-label">出版社</span><span class="meta-value">${b.p}</span></div>
        <div class="meta-item"><span class="meta-label">主编</span><span class="meta-value">${(b&&b.editor)?b.editor:'—'}</span></div>
        <div class="meta-item"><span class="meta-label">ISBN</span><span class="meta-value">978-7-${Math.floor(1000+Math.random()*9000)}-${Math.floor(1000+Math.random()*9000)}-${Math.floor(1+Math.random()*9)}</span></div>
      </div>
      ${isMine ? mkDetailGroupUseHtml(b) : ''}
      <div class="detail-actions">
        ${isMine
          ? `<button type="button" class="btn-enter-reader" onclick="openReaderFromDetail()">开始阅读</button>
             <button class="btn-print" onclick="handlePrint(event)">
               <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
               打印
             </button>`
          : libUnlocked
            ? `<button type="button" class="btn-buy" onclick="openReaderFromDetail()">开始阅读</button>`
            : `<button type="button" class="btn-buy" onclick="handleBuy(this)">立即购买</button>
             <button type="button" class="btn-trial" onclick="openRedeem()">
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="margin-right:4px;vertical-align:-2px"><path d="M21 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"/><path d="M16 2v6M8 2v6"/></svg>兑换码
             </button>
             <button type="button" class="btn-trial" onclick="openReaderFromDetail()">免费试读</button>
             <span class="detail-price">¥${price.toFixed(2)}</span>
             <span class="detail-price-orig">¥${(price*1.5).toFixed(2)}</span>`
        }
      </div>
    </div>`;

  // Intro（我的教材：按配置展示学习模式；组群管理员额外可见「教学模式」；数字教材按 readModeKeys 展示）
  const desc = DESC[b.sub] || '本教材面向中等职业教育相关专业编写，内容对接岗位与实训要求，强调规范操作、项目能力与职业素养。';
  const modeEntriesMine = BOOK_READ_MODES.filter((m) => m.key !== 'teach' || isCurrentUserClassGroupAdmin());
  const modeSectionHtml = isMine
    ? detailLearningModesSectionHtml(modeEntriesMine)
    : detailLearningModesSectionHtml(withTeachIfAdmin(resolveLibReadModes(b)));

  document.getElementById('pane-intro').innerHTML = `
    ${modeSectionHtml}
    <div class="intro-section" ${modeSectionHtml ? 'style="margin-top:28px"' : ''}>
      <div class="intro-heading"><span class="bar"></span>教材简介</div>
      ${detailIntroVideoHtml(b)}
      <div class="intro-text">${desc}</div>
    </div>`;

  // TOC（商城未购：前 LIB_PREVIEW_LESSON_COUNT 条可试读，其余带锁；已购/我的教材：全部开放）
  const toc = TOC[b.sub] || [{u:'第一单元',ls:['第1课','第2课','第3课']},{u:'第二单元',ls:['第4课','第5课','第6课']}];
  const tocColor = c1;
  let lessonSeq = 0;
  const lockSvg = `<svg class="toc-lesson-lock" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;
  document.getElementById('pane-toc').innerHTML = `
    ${source === 'lib' && !tocFullAccess ? `<p class="toc-trial-hint">试读：未购买时默认可阅读前 <strong>${LIB_PREVIEW_LESSON_COUNT}</strong> 条目录；购买本教材后解锁全部章节。</p>` : ''}
    <ul class="toc-list">
      ${toc.map((unit,ui) => `
        <li class="toc-unit${ui===0?' open':''}">
          <div class="toc-unit-head" onclick="toggleUnit(this)">
            <span class="toc-unit-num" style="background:${tocColor}15;color:${tocColor}">${ui+1}</span>
            <span>${unit.u}</span>
            <svg class="toc-unit-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
          <div class="toc-lessons">
            ${unit.ls.map((l) => {
              const locked = !tocFullAccess && lessonSeq >= LIB_PREVIEW_LESSON_COUNT;
              lessonSeq += 1;
              return `
              <div class="toc-lesson${locked ? ' toc-lesson--locked' : ''}"${locked ? ' onclick="onTocLockedClick(event)" role="button" tabindex="0"' : ''}>
                <span class="toc-lesson-dot" style="background:${tocColor}"></span>
                <span class="toc-lesson-text">${l}</span>
                ${locked ? lockSvg : ''}
              </div>`;
            }).join('')}
          </div>
        </li>`).join('')}
    </ul>`;

  // Reset tabs
  document.querySelectorAll('.detail-tab').forEach(t=>t.classList.toggle('active',t.dataset.tab==='intro'));
  document.querySelectorAll('.tab-pane').forEach(p=>p.classList.toggle('active',p.id==='pane-intro'));

  document.getElementById('overlay').classList.add('open');
  document.body.style.overflow='hidden';
}

function closeDetail(){
  document.getElementById('overlay').classList.remove('open');
  document.body.style.overflow='';
}

function switchTab(tab){
  document.querySelectorAll('.detail-tab').forEach(t=>t.classList.toggle('active',t.dataset.tab===tab));
  document.querySelectorAll('.tab-pane').forEach(p=>p.classList.toggle('active',p.id===`pane-${tab}`));
}

function toggleUnit(el){
  el.parentElement.classList.toggle('open');
}

function handleBuy(btn){
  const { source, b, bookIdx } = detailViewContext;
  if (source === 'lib' && b) {
    libPurchasedBookKeys.add(libBookKey(b));
    openDetail(bookIdx, 'lib');
    showProfileToast('购买成功，已解锁全部章节（演示）');
    return;
  }
  btn.textContent='已购买';
  btn.classList.add('purchased');
  const actions = btn.parentElement;
  const trial = actions.querySelector('.btn-trial');
  const price = actions.querySelector('.detail-price');
  const orig = actions.querySelector('.detail-price-orig');
  if(trial) trial.style.display='none';
  if(price) price.style.display='none';
  if(orig) orig.style.display='none';
}

function onTocLockedClick(e) {
  e.preventDefault();
  e.stopPropagation();
  showProfileToast('该章节需购买教材后解锁');
}

// Close on Escape
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    if(document.getElementById('readerOverlay')?.classList.contains('open')){closeReader();return;}
    closeRedeem();closeDetail();closeCreateClass();closeClassDetail();closeBookPicker();closeJoinClass();closeSchoolModal();closePhoneModal();closePasswordModal();closeFeedbackModal();
  }
});

// Redeem code
function openRedeem(){
  document.getElementById('redeemForm').style.display='block';
  document.getElementById('redeemSuccess').classList.remove('show');
  document.getElementById('redeemCode').value='';
  document.getElementById('redeemOverlay').classList.add('open');
}

function closeRedeem(){
  document.getElementById('redeemOverlay').classList.remove('open');
}

function doRedeem(){
  const code=document.getElementById('redeemCode').value.trim();
  if(code.length<4){
    document.getElementById('redeemCode').style.borderColor='var(--rose-deep)';
    document.getElementById('redeemCode').style.boxShadow='0 0 0 3px rgba(196,92,116,0.1)';
    setTimeout(()=>{
      document.getElementById('redeemCode').style.borderColor='';
      document.getElementById('redeemCode').style.boxShadow='';
    },1500);
    return;
  }
  document.getElementById('redeemForm').style.display='none';
  document.getElementById('redeemSuccess').classList.add('show');
  setTimeout(()=>closeRedeem(),2000);
}

// Auto-format redeem code (add dashes)
document.getElementById('redeemCode').addEventListener('input',function(e){
  let v=this.value.replace(/[^A-Za-z0-9]/g,'').toUpperCase();
  if(v.length>16) v=v.slice(0,16);
  let formatted='';
  for(let i=0;i<v.length;i++){
    if(i>0 && i%4===0) formatted+='-';
    formatted+=v[i];
  }
  this.value=formatted;
});

// Print
function handlePrint(e){
  e&&e.stopPropagation();
  const btn=e.target.closest('.btn-print');
  const orig=btn.innerHTML;
  btn.innerHTML='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> 已发送至打印队列';
  btn.style.color='var(--mint-deep)';
  btn.style.borderColor='var(--mint-mid)';
  btn.style.background='var(--mint)';
  setTimeout(()=>{
    btn.innerHTML=orig;
    btn.style.color='';
    btn.style.borderColor='';
    btn.style.background='';
  },2500);
}

// === CLASS GROUP FUNCTIONS ===
function openCreateClass(){
  const n = document.getElementById('ccmName');
  if (n) n.value = '';
  document.getElementById('createClassOverlay').classList.add('open');
}
function closeCreateClass(){
  document.getElementById('createClassOverlay').classList.remove('open');
}
function doCreateClass(){
  const name=document.getElementById('ccmName').value.trim();
  if(!name){
    document.getElementById('ccmName').style.borderColor='var(--rose-deep)';
    document.getElementById('ccmName').style.boxShadow='0 0 0 3px rgba(196,92,116,0.1)';
    setTimeout(()=>{document.getElementById('ccmName').style.borderColor='';document.getElementById('ccmName').style.boxShadow=''},1500);
    return;
  }
  const code = `SC${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 9)}-GRP${Math.floor(1000 + Math.random() * 9000)}`;
  classGroups.push({
    id: Date.now(),
    name,
    subject: '综合',
    desc: name,
    code,
    created: new Date().toISOString().slice(0, 10),
    admin: getCurrentUserDisplayName(),
    books: [],
    students: [],
  });
  closeCreateClass();
  renderMy();
  // success toast
  const toast=document.createElement('div');
  toast.style.cssText='position:fixed;bottom:32px;left:50%;transform:translateX(-50%);background:var(--deep);color:white;padding:14px 28px;border-radius:12px;font-size:13px;z-index:300;box-shadow:0 8px 30px rgba(0,0,0,0.15);animation:fadeUp 0.3s ease;display:flex;align-items:center;gap:10px';
  toast.innerHTML=`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>组群「${name}」创建成功`;
  document.body.appendChild(toast);
  setTimeout(()=>{toast.style.opacity='0';toast.style.transition='opacity 0.3s';setTimeout(()=>toast.remove(),300)},2000);
}

function normalizeInviteCode(s){
  return String(s).replace(/[^A-Za-z0-9]/g,'').toUpperCase();
}

function openJoinClass(){
  const input=document.getElementById('joinClassCode');
  if(input)input.value='';
  const err=document.getElementById('joinClassErr');
  if(err)err.textContent='';
  const form=document.getElementById('joinClassForm');
  if(form)form.style.display='block';
  const ok=document.getElementById('joinClassSuccess');
  if(ok)ok.classList.remove('show');
  document.getElementById('joinClassOverlay').classList.add('open');
}

function closeJoinClass(){
  document.getElementById('joinClassOverlay').classList.remove('open');
}

function doJoinClass(){
  const raw=document.getElementById('joinClassCode').value;
  const norm=normalizeInviteCode(raw);
  const errEl=document.getElementById('joinClassErr');
  errEl.textContent='';
  if(norm.length<4){
    errEl.textContent='请输入管理员提供的邀请码';
    return;
  }
  const cls=classGroups.find(c=>normalizeInviteCode(c.code)===norm);
  if(!cls){
    errEl.textContent='未找到该邀请码，请核对后重试';
    return;
  }
  if(cls.admin===getCurrentUserDisplayName()){
    errEl.textContent='你已是该组群的管理员，无需通过邀请码加入';
    return;
  }
  if(cls.students.some(s=>s.name===getCurrentUserDisplayName())){
    errEl.textContent='你已在该组群中';
    return;
  }
  const nBooks=cls.books.length;
  const bp=nBooks?Array.from({length:nBooks},()=>Math.floor(Math.random()*45)+35):[];
  const qp=nBooks?bp.map((p)=>Math.max(0, Math.min(100, p - Math.floor(4 + Math.random() * 15)))):[];
  cls.students.push({
    name:getCurrentUserDisplayName(),
    id:'2024'+String(Math.floor(100000+Math.random()*900000)),
    bp,
    qp,
    last:'今天'
  });
  document.getElementById('joinSuccessName').textContent=cls.name;
  document.getElementById('joinClassForm').style.display='none';
  document.getElementById('joinClassSuccess').classList.add('show');
  setTimeout(()=>{
    closeJoinClass();
    renderMy();
    const toast=document.createElement('div');
    toast.style.cssText='position:fixed;bottom:32px;left:50%;transform:translateX(-50%);background:var(--deep);color:white;padding:14px 28px;border-radius:12px;font-size:13px;z-index:300;box-shadow:0 8px 30px rgba(0,0,0,0.15);animation:fadeUp 0.3s ease;display:flex;align-items:center;gap:10px';
    toast.innerHTML=`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>已加入组群「${cls.name}」`;
    document.body.appendChild(toast);
    setTimeout(()=>{toast.style.opacity='0';toast.style.transition='opacity 0.3s';setTimeout(()=>toast.remove(),300)},2200);
  },1600);
}

function drawQR(canvas,text){
  // Simple visual QR-like pattern (decorative)
  const ctx=canvas.getContext('2d');
  const s=canvas.width;ctx.clearRect(0,0,s,s);
  const grid=21,cell=Math.floor(s/grid);
  // Seed from text
  let seed=0;for(let i=0;i<text.length;i++)seed=(seed*31+text.charCodeAt(i))&0x7fffffff;
  function rng(){seed=(seed*16807)%2147483647;return seed/2147483647}
  // Draw modules
  ctx.fillStyle='#1f2937';
  for(let r=0;r<grid;r++)for(let cl=0;cl<grid;cl++){
    // Fixed patterns (finder)
    const inFinder=(r<7&&cl<7)||(r<7&&cl>=grid-7)||(r>=grid-7&&cl<7);
    if(inFinder){
      const fr=r<7?0:grid-7,fc=cl<7?0:grid-7;
      const lr=r-fr,lc=cl-fc;
      if(lr===0||lr===6||lc===0||lc===6||(lr>=2&&lr<=4&&lc>=2&&lc<=4))
        ctx.fillRect(cl*cell,r*cell,cell,cell);
    } else if(rng()>0.5){
      ctx.fillRect(cl*cell,r*cell,cell,cell);
    }
  }
}

let currentClassIdx=null;

function ensureStudentBookMetrics(st) {
  const n = (st.bp && st.bp.length) || 0;
  if (!n) {
    st.bp = st.bp || [];
    st.qp = st.qp || [];
    return;
  }
  if (!st.qp || st.qp.length !== n) {
    st.qp = st.bp.map((p) => Math.max(0, Math.min(100, (p|0) - 8 + ((n + p) % 5))));
  }
}

function openClassDetail(idx, bookIdx) {
  currentClassIdx=idx;
  const cls=classGroups[idx];
  if(!cls)return;
  cls.students.forEach(ensureStudentBookMetrics);
  const nBooks=cls.books.length;
  let selB=0;
  if (typeof bookIdx==='number' && !Number.isNaN(bookIdx) && nBooks) {
    selB=Math.max(0, Math.min(nBooks-1, Math.floor(bookIdx)));
  }
  const isClassAdmin=cls.admin===getCurrentUserDisplayName();

  const classBooksHtml=cls.books.map((bk,bi)=>{
    const [c1,c2]=c(bk.sub);
    const removeBtn=isClassAdmin?`<button class="class-book-remove" title="移除教材" onclick="removeClassBook(${idx},${bi})">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>`:'';
    return `<div class="class-book-row">
      <div class="class-book-cover" style="background:linear-gradient(145deg,${c1},${c2})">
        <div class="class-book-cover-name">${bk.t}</div>
      </div>
      <div class="class-book-info">
        <div class="class-book-name">${bk.t} · ${bk.s}</div>
        <div class="class-book-pub">${bk.p} · ${bk.g}</div>
      </div>
      ${removeBtn}
    </div>`;
  }).join('');

  const studentsSorted=nBooks? [...cls.students].map(st=>{
    ensureStudentBookMetrics(st);
    const readP=st.bp[selB]??0;
    const quizP=st.qp[selB]??0;
    return { ...st, readP, quizP };
  }).sort((a,b)=>b.readP-a.readP): [];

  const titleBadge=isClassAdmin
    ?`<span class="admin-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>管理员</span>`
    :`<span class="member-pill">组员</span>`;

  const dangerBlock=isClassAdmin
    ?`<div class="class-detail-danger">
        <button type="button" class="btn-class-dissolve" onclick="dissolveClass(${idx})">解散群组</button>
        <p class="class-detail-danger-hint">解散后组群将从所有成员的「我的组群」中移除，且不可恢复。</p>
      </div>`
    :`<div class="class-detail-danger">
        <button type="button" class="btn-class-leave" onclick="leaveClass(${idx})">退出群组</button>
        <p class="class-detail-danger-hint">退出后你将不再出现在该组群成员列表中，可凭邀请码再次加入。</p>
      </div>`;

  const inviteBlock=isClassAdmin?`
    <div class="invite-section">
      <div class="invite-code-box">
        <div class="invite-label">邀请码</div>
        <div class="invite-code-display">
          <span class="invite-code-text">${cls.code}</span>
          <button class="invite-copy-btn" onclick="copyCode(this,'${cls.code}')">复制</button>
        </div>
      </div>
      <div class="invite-qr-box">
        <div class="invite-label">扫码加入</div>
        <div class="qr-canvas"><canvas id="qrCanvas" width="104" height="104"></canvas></div>
        <div class="qr-hint">学生扫码即可加入</div>
      </div>
    </div>`:`
    <div class="invite-readonly">
      <p class="invite-readonly-text">组群由 <strong>${cls.admin}</strong> 管理。邀请码仅管理员可见；如需邀请其他同学，请联系管理员获取邀请码。</p>
    </div>`;

  const addBookBtn=isClassAdmin?`
        <button class="btn-add-book" onclick="openBookPicker(${idx})">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          添加教材
        </button>`:'';

  const emptyBooksMsg=cls.books.length?'':(isClassAdmin
    ?'<div style="text-align:center;padding:24px;color:var(--stone);font-size:12.5px">暂未添加教材，点击上方按钮从「我的教材」中添加</div>'
    :'<div style="text-align:center;padding:24px;color:var(--stone);font-size:12.5px">组群暂未添加教材</div>');

  const bookTabsHtml=nBooks? cls.books.map((bk, bi) => {
    const active=bi===selB ? ' is-active' : '';
    const raw=bk.t.length>12?`${bk.t.slice(0,12)}…`:`${bk.t}`;
    return `<button type="button" class="class-book-tab${active}" title="${escAttr(`${bk.t} · ${bk.s}`)}" role="tab" aria-selected="${bi===selB}" onclick="openClassDetail(${idx},${bi})">${escAttr(raw)}</button>`;
  }).join('') :'';

  const nMembers=cls.students.length;
  const curBookLine=nBooks && cls.books[selB] ? escAttr(`${cls.books[selB].t} · ${cls.books[selB].s}`) : '';

  const colorFor=(pct)=>{const p=pct|0;if(p>=80)return 'var(--mint-deep)';if(p>=50)return 'var(--peach-deep)';return 'var(--rose-deep)';};

  const content=document.getElementById('classDetailContent');
  content.innerHTML=`
    <div class="class-detail-header">
      <div class="class-detail-name">${cls.name} ${titleBadge}</div>
      <div class="class-detail-meta">
        <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>${cls.subject}</span>
        <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>${cls.created}</span>
        <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>${nMembers} 名学生</span>
        <span>创建者: ${cls.admin}</span>
      </div>
    </div>
    ${inviteBlock}
    <div class="class-books-section">
      <div class="class-books-head">
        <div class="class-books-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          组群教材
          <span class="class-books-count">${cls.books.length} 本</span>
        </div>
        ${addBookBtn}
      </div>
      <div class="class-book-list">
        ${cls.books.length?classBooksHtml:emptyBooksMsg}
      </div>
    </div>
    <div class="class-stats-row class-stats-row--duo">
      <div class="cs-box"><div class="cs-val">${nMembers}</div><div class="cs-lab">组群人数</div></div>
      <div class="cs-box"><div class="cs-val">${nBooks}</div><div class="cs-lab">组群教材</div></div>
    </div>
    <div class="student-section">
      <div class="student-head">
        <div class="student-title-wrap">
          <div class="student-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            学情排行
          </div>
          <p class="student-lead-hint">多本教材时无法综合排名；请切换下方教材，查看该书中的<strong>阅读进度</strong>与<strong>答题进度</strong>（随堂测验、章末练习等）。</p>
        </div>
        <span class="student-count">共 ${nMembers} 人</span>
      </div>
      ${nBooks?`<div class="class-book-tabs" role="tablist" aria-label="组群教材">
        ${bookTabsHtml}
        <span class="class-book-tab-cur" title="当前统计范围">${curBookLine}</span>
      </div>`:''}
      <div class="student-list">
        ${nBooks? studentsSorted.map((st,i)=>{
          const ac=AVATAR_COLORS[i%AVATAR_COLORS.length];
          const rCol=colorFor(st.readP);
          const qCol=colorFor(st.quizP);
          const rc=i===0?'rank-1':i===1?'rank-2':i===2?'rank-3':'rank-other';
          return `<div class="student-row student-row--by-book">
            <div class="student-rank ${rc}">${i+1}</div>
            <div class="student-avatar" style="background:linear-gradient(135deg,${ac[0]},${ac[1]})">${st.name.slice(-1)}</div>
            <div class="student-info">
              <div class="student-name">${st.name}</div>
              <div class="student-id">${st.id}</div>
            </div>
            <div class="student-metric-cols">
              <div class="sm-col" title="本教材已读章节/页码进度（演示数据）">
                <div class="sm-lab">阅读</div>
                <div class="sm-row">
                  <div class="student-bar sm-bar"><div class="student-bar-fill" style="width:${st.readP}%;background:${rCol}"></div></div>
                  <span class="student-pct sm-pct" style="color:${rCol}">${st.readP}%</span>
                </div>
              </div>
              <div class="sm-col" title="本教材内测验与练习完成情况（演示数据）">
                <div class="sm-lab">答题</div>
                <div class="sm-row">
                  <div class="student-bar sm-bar"><div class="student-bar-fill" style="width:${st.quizP}%;background:${qCol}"></div></div>
                  <span class="student-pct sm-pct" style="color:${qCol}">${st.quizP}%</span>
                </div>
              </div>
            </div>
            <div class="student-last">${st.last}</div>
          </div>`;
        }).join(''):`<div class="class-leaderboard-empty">请先在组群内添加教材，再按教材查看学情与排行</div>`}
      </div>
    </div>
    ${dangerBlock}`;

  document.getElementById('classOverlay').classList.add('open');
  document.body.style.overflow='hidden';
  setTimeout(()=>{
    const cv=document.getElementById('qrCanvas');
    if(cv)drawQR(cv,cls.code);
  },50);
}

function closeClassDetail(){
  document.getElementById('classOverlay').classList.remove('open');
  document.body.style.overflow='';
}

function dissolveClass(idx) {
  const cls = classGroups[idx];
  if (!cls || cls.admin !== getCurrentUserDisplayName()) return;
  if (!confirm('确定解散该组群？解散后所有成员将无法再从「我的组群」进入，此操作不可恢复。')) return;
  classGroups.splice(idx, 1);
  currentClassIdx = null;
  closeClassDetail();
  renderMy();
  const toast = document.createElement('div');
  toast.style.cssText =
    'position:fixed;bottom:32px;left:50%;transform:translateX(-50%);background:var(--deep);color:white;padding:14px 28px;border-radius:12px;font-size:13px;z-index:300;box-shadow:0 8px 30px rgba(0,0,0,0.15);animation:fadeUp 0.3s ease;display:flex;align-items:center;gap:10px';
  toast.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>已解散组群「${cls.name}」`;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 2200);
}

function leaveClass(idx) {
  const cls = classGroups[idx];
  if (!cls || cls.admin === getCurrentUserDisplayName()) return;
  const si = cls.students.findIndex((s) => s.name === getCurrentUserDisplayName());
  if (si < 0) return;
  if (!confirm('确定退出该组群？退出后将不再显示在「我的组群」中。')) return;
  cls.students.splice(si, 1);
  currentClassIdx = null;
  closeClassDetail();
  renderMy();
  const toast = document.createElement('div');
  toast.style.cssText =
    'position:fixed;bottom:32px;left:50%;transform:translateX(-50%);background:var(--deep);color:white;padding:14px 28px;border-radius:12px;font-size:13px;z-index:300;box-shadow:0 8px 30px rgba(0,0,0,0.15);animation:fadeUp 0.3s ease;display:flex;align-items:center;gap:10px';
  toast.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>已退出组群「${cls.name}」`;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 2200);
}

function copyCode(btn,code){
  navigator.clipboard.writeText(code).catch(()=>{});
  btn.textContent='已复制';btn.classList.add('copied');
  setTimeout(()=>{btn.textContent='复制';btn.classList.remove('copied')},2000);
}

function openBookPicker(classIdx){
  const cls=classGroups[classIdx];
  if(!cls||cls.admin!==getCurrentUserDisplayName())return;
  currentClassIdx=classIdx;
  const list=document.getElementById('bpList');
  list.innerHTML=myB.map((bk,i)=>{
    const [c1,c2]=c(bk.sub);
    const already=cls.books.some(cb=>cb.t===bk.t&&cb.s===bk.s);
    return `<div class="bp-item${already?' added':''}" onclick="${already?'':'addBookToClass('+classIdx+','+i+',this)'}">
      <div class="bp-cover" style="background:linear-gradient(145deg,${c1},${c2})">
        <div class="bp-cover-name">${bk.t}</div>
      </div>
      <div class="bp-info">
        <div class="bp-name">${bk.t} · ${bk.s}</div>
        <div class="bp-sub">${bk.p} · ${bk.g}</div>
      </div>
    </div>`;
  }).join('');
  document.getElementById('bookPickerOverlay').classList.add('open');
}

function closeBookPicker(){
  document.getElementById('bookPickerOverlay').classList.remove('open');
}

function addBookToClass(classIdx,bookIdx,el){
  const cls=classGroups[classIdx];
  if(!cls||cls.admin!==getCurrentUserDisplayName())return;
  const bk=myB[bookIdx];
  cls.books.push({t:bk.t,s:bk.s,g:bk.g,p:bk.p,sub:bk.sub,cat:bk.cat,paperDigital:!!bk.paperDigital,editor:bk.editor||''});
  cls.students.forEach((st) => {
    st.bp.push(Math.floor(Math.random() * 60) + 20);
    if (!st.qp) st.qp = [];
    st.qp.push(Math.floor(Math.random() * 55) + 15);
  });
  el.classList.add('added');
  el.onclick=null;
  // Refresh detail
  closeBookPicker();
  openClassDetail(classIdx);
  refreshMyPageIfActive();
}

function removeClassBook(classIdx,bookIdx){
  const cls=classGroups[classIdx];
  if(!cls||cls.admin!==getCurrentUserDisplayName())return;
  cls.books.splice(bookIdx,1);
  cls.students.forEach((st) => {
    st.bp.splice(bookIdx, 1);
    if (st.qp && st.qp.length > bookIdx) st.qp.splice(bookIdx, 1);
  });
  openClassDetail(classIdx);
  refreshMyPageIfActive();
}

/** 我的教材：单书功能元数据（「阅读」也可通过封面/信息区进入详情） */
const BOOK_MY_ACTIONS = [
  { key: 'read', label: '阅读' },
  { key: 'cloudHandout', label: '智能云讲义' },
  { key: 'teach', label: '教学' },
  { key: 'task', label: '任务' },
  { key: 'questionBank', label: '题库' },
  { key: 'internship', label: '岗位实习' },
  { key: 'resourceLib', label: '资源库' },
  { key: 'learnStats', label: '学习统计' },
  /* 书架「更多」溢出演示用（仅示例数据） */
  { key: 'myDemo1', label: '测试①' },
  { key: 'myDemo2', label: '测试②' },
  { key: 'myDemo3', label: '测试③' },
  { key: 'myDemo4', label: '测试④' },
  { key: 'myDemo5', label: '测试⑤' },
  { key: 'myDemo6', label: '测试⑥' },
];

function resolveBookActionEntries(b) {
  const keys = b && Array.isArray(b.actionKeys) ? b.actionKeys : [];
  if (!keys.length) return [];
  const hasGroup = b ? getClassNamesForMyBook(b).length > 0 : false;
  return keys
    .filter((k) => k !== 'questionBank' || hasGroup)
    .map((k) => BOOK_MY_ACTIONS.find((a) => a.key === k))
    .filter(Boolean);
}

function bookShortcut(bookIdx, actionKey) {
  const b = myB[bookIdx];
  if (!b) return;
  if (actionKey === 'read') {
    openReader(bookIdx, 'my');
    return;
  }
  if (actionKey === 'questionBank') {
    openQuestionBankMode(b);
    return;
  }
  const act = BOOK_MY_ACTIONS.find((a) => a.key === actionKey);
  const actionName = act ? act.label : actionKey;
  const toast = document.createElement('div');
  toast.style.cssText =
    'position:fixed;bottom:32px;left:50%;transform:translateX(-50%);background:var(--deep);color:white;padding:14px 24px;border-radius:12px;font-size:13px;z-index:300;box-shadow:0 8px 30px rgba(0,0,0,0.15);animation:fadeUp 0.3s ease;max-width:min(420px,calc(100vw - 48px));text-align:center;line-height:1.5';
  toast.innerHTML = `<span style="opacity:0.9">「${b.t} · ${b.s}」</span><br><span style="font-weight:500">${actionName}</span> <span style="opacity:0.75">（演示入口，可对接业务）</span>`;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 2400);
}

function mkMyActionRow(b, i) {
  const entries = resolveBookActionEntries(b);
  if (!entries.length) return '';
  return `<div class="card-actions" onclick="event.stopPropagation()">
    <div class="card-actions-scroll" role="toolbar" aria-label="教材功能">
    ${entries.map(
      (a) =>
        `<button type="button" class="card-action" onclick="event.stopPropagation();bookShortcut(${i},'${a.key}')">${a.label}</button>`
    ).join('')}
    </div>
  </div>`;
}

/** 我的书架专用操作区：支持两行高度超出时收入「更多」下拉 */
function mkMyShelfActionsRow(b, i) {
  const entries = resolveBookActionEntries(b);
  if (!entries.length) return '';
  const btns = entries
    .map(
      (a) =>
        `<button type="button" class="card-action" onclick="event.stopPropagation();bookShortcut(${i},'${a.key}');closeAllMineShelfMore()">${a.label}</button>`
    )
    .join('');
  return `<div class="card-actions mine-shelf-actions" data-book-idx="${i}" onclick="event.stopPropagation()">
    <div class="mine-shelf-actions-inner card-actions-scroll" role="toolbar" aria-label="教材功能">
      ${btns}
      <div class="mine-shelf-more-anchor">
        <button type="button" class="card-action mine-shelf-more-btn" hidden aria-expanded="false" aria-haspopup="true" onclick="event.stopPropagation();toggleMineShelfMore(${i})">更多操作...</button>
        <div class="mine-shelf-more-dropdown" id="mineShelfMore_${i}" hidden role="menu" onclick="event.stopPropagation()"></div>
      </div>
    </div>
  </div>`;
}

function closeAllMineShelfMore() {
  document.querySelectorAll('.mine-shelf-more-dropdown').forEach((dd) => {
    dd.hidden = true;
  });
  document.querySelectorAll('.mine-shelf-more-btn').forEach((btn) => {
    btn.setAttribute('aria-expanded', 'false');
  });
}

function toggleMineShelfMore(bookIdx) {
  const idx = Number(bookIdx);
  const wrap = document.querySelector(`.mine-shelf-actions[data-book-idx="${idx}"]`);
  if (!wrap) return;
  mineShelfReflowOne(wrap);
  const dd = document.getElementById(`mineShelfMore_${idx}`);
  const btn = wrap.querySelector('.mine-shelf-more-btn');
  if (!dd || !btn || !dd.children.length) return;
  const willOpen = dd.hidden;
  closeAllMineShelfMore();
  if (willOpen) {
    dd.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
  }
}

/** 单卡：最多两行按钮高度，超出移入下拉，「更多」占位 */
function mineShelfReflowOne(container) {
  const inner = container.querySelector('.mine-shelf-actions-inner');
  const anchor = container.querySelector('.mine-shelf-more-anchor');
  const moreBtn = container.querySelector('.mine-shelf-more-btn');
  const dropdown = container.querySelector('.mine-shelf-more-dropdown');
  if (!inner || !anchor || !moreBtn || !dropdown) return;

  while (dropdown.firstChild) {
    inner.insertBefore(dropdown.firstChild, anchor);
  }
  moreBtn.hidden = true;
  moreBtn.setAttribute('aria-expanded', 'false');
  dropdown.hidden = true;

  /** 仅统计工具条直接子级里的功能按钮（「更多」在 anchor 内，不会命中） */
  const regular = () => [...inner.querySelectorAll(':scope > .card-action')];
  if (!regular().length) return;

  const maxScroll = () => {
    const r = regular();
    if (!r.length) return 9999;
    const h = r[0].offsetHeight || 28;
    return 2 * h + 6;
  };

  const trimToTwoRows = () => {
    let guard = 48;
    while (guard-- > 0 && inner.scrollHeight > maxScroll() + 1 && regular().length > 1) {
      const vis = regular();
      dropdown.insertBefore(vis[vis.length - 1], dropdown.firstChild);
    }
  };

  trimToTwoRows();

  if (dropdown.children.length) {
    moreBtn.hidden = false;
    trimToTwoRows();
  }
}

function mineShelfReflowAll() {
  document.querySelectorAll('.mine-shelf-actions').forEach((el) => mineShelfReflowOne(el));
}

let _mineShelfUiBound = false;
function bindMineShelfUiEvents() {
  if (_mineShelfUiBound) return;
  _mineShelfUiBound = true;
  let t;
  window.addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(() => mineShelfReflowAll(), 120);
  });
  document.addEventListener('click', (e) => {
    if (e.target.closest('.mine-shelf-actions')) return;
    closeAllMineShelfMore();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllMineShelfMore();
  });
}

/** 我的书架：左封面 + 右信息与操作（每行两本栅格由 CSS grid--my-books 控制） */
function mkMyShelfCard(b, i, opts = {}) {
  const groupNames = Array.isArray(opts.groupNames) ? opts.groupNames.filter(Boolean) : [];
  const shownGroupNames = groupNames.slice(0, 2);
  const extraGroupCount = Math.max(groupNames.length - shownGroupNames.length, 0);
  const groupTags = groupNames.length
    ? `<div class="mine-shelf-groups" title="${groupNames.map(escAttr).join('、')}">
        ${shownGroupNames.map((n) => `<span class="mine-shelf-group-tag">${escAttr(n)}</span>`).join('')}
        ${extraGroupCount ? `<span class="mine-shelf-group-more">+${extraGroupCount}</span>` : ''}
      </div>`
    : '';
  const [c1, c2] = c(b.sub);
  const pc =
    (b.pr || 0) >= 80 ? 'var(--mint-deep)' : (b.pr || 0) >= 40 ? 'var(--peach-deep)' : 'var(--rose-deep)';
  const st = `<div class="card-st st-ok mine-shelf-badge" title="已在书架"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></div>`;
  const pg = `<div class="prog mine-shelf-prog"><div class="prog-track"><div class="prog-fill" style="width:${b.pr}%;background:${pc}"></div></div><span class="prog-pct">${b.pr}%</span></div>`;
  const pdTag = isPaperDigital(b) ? `<span class="tag tag-pd">纸数融合</span>` : '';
  const actions = mkMyShelfActionsRow(b, i);
  const coverInner = `<div class="mine-shelf-cover-inner cover-inner" style="background:linear-gradient(145deg,${c1},${c2})"><span class="cover-grade">${b.g}</span><div class="cover-name">${b.t}</div><div class="cover-sub">${b.s}</div></div>`;
  const open = `onclick="openDetail(${i},'my')"`;
  return `<div class="card card--mine card--mine-shelf" style="animation-delay:${i * 0.04}s">
    ${st}
    <div class="mine-shelf-row">
      <div class="mine-shelf-cover-wrap">
        <div class="mine-shelf-cover cover cover--open" ${open} title="打开教材详情">${coverInner}</div>
      </div>
      <div class="mine-shelf-body">
        <div class="mine-shelf-main" ${open}>
          <div class="mine-shelf-title">${b.t} · ${b.s}</div>
          <div class="mine-shelf-meta"><span class="detail-pub">${b.p}</span>${pdTag}</div>
          ${groupTags}
          ${pg}
        </div>
        ${actions}
      </div>
    </div>
  </div>`;
}

function mkCard(b,i,wp){
  const [c1,c2]=c(b.sub);
  const pc=(b.pr||0)>=80?'var(--mint-deep)':(b.pr||0)>=40?'var(--peach-deep)':'var(--rose-deep)';
  let st='';
  if(wp) st=`<div class="card-st st-ok" title="已在书架"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></div>`;
  let pg='';
  if(wp) pg=`<div class="prog"><div class="prog-track"><div class="prog-fill" style="width:${b.pr}%;background:${pc}"></div></div><span class="prog-pct">${b.pr}%</span></div>`;
  const pdTag=isPaperDigital(b)?`<span class="tag tag-pd">纸数融合</span>`:'';
  const actions=wp?mkMyActionRow(b,i):'';
  const cardCls=wp?'card card--mine':'card';
  const coverInner=`<div class="cover-inner" style="background:linear-gradient(145deg,${c1},${c2})"><span class="cover-grade">${b.g}</span><div class="cover-name">${b.t}</div><div class="cover-sub">${b.s}</div></div>`;
  if(wp){
    const open=`onclick="openDetail(${i},'my')"`;
    return `<div class="${cardCls}" style="animation-delay:${i*0.04}s">${st}<div class="cover cover--open" ${open} title="打开教材详情">${coverInner}</div><div class="detail"><div class="detail-main" ${open}><div class="detail-title">${b.t} · ${b.s}</div><div class="detail-row"><span class="detail-pub">${b.p}</span>${pdTag}</div>${pg}</div>${actions}</div></div>`;
  }
  const bookIdx=i;
  return `<div class="${cardCls}" style="animation-delay:${bookIdx*0.04}s" onclick="openDetail(${bookIdx},'lib')">${st}<div class="cover">${coverInner}</div><div class="detail"><div class="detail-title">${b.t} · ${b.s}</div><div class="detail-row"><span class="detail-pub">${b.p}</span>${pdTag}</div>${pg}</div></div>`;
}

let fG='全部',fS='全部科目';
let libraryView='home';
let myShelfView = 'mine';
let myShelfClassFilter = 'all';
function setGradeFilter(g){fG=g;renderLib();}
function setSubjectFilter(s){fS=s;renderLib();}

function syncLibraryTopbar(){
  const topbar=document.querySelector('.topbar');
  const backBtn=document.getElementById('topbarBackBtn');
  const onLibrary=document.getElementById('page-library')?.classList.contains('active');
  if(!topbar||!onLibrary)return;
  const isCatalog=libraryView==='catalog';
  topbar.classList.toggle('topbar--library',!isCatalog);
  topbar.classList.toggle('topbar--catalog',isCatalog);
  if(backBtn)backBtn.hidden=!isCatalog;
  const sw=document.getElementById('topbarSearchWrap');
  if(sw)sw.style.display=isCatalog?'none':(onLibrary?'':'none');
  const t=document.getElementById('pTitle'),h=document.getElementById('pHint');
  if(!t||!h)return;
  if(isCatalog){
    t.textContent='全部数字教材';
    h.textContent='按年级与科目筛选浏览';
  }else{
    t.textContent='数字教材';
    h.textContent='浏览、选购全部上架数字教材';
  }
}

function openLibraryCatalog(){
  libraryView='catalog';
  syncLibraryTopbar();
  renderLib();
  document.querySelector('.scroll')?.scrollTo({top:0,behavior:'smooth'});
}

function closeLibraryCatalog(){
  libraryView='home';
  syncLibraryTopbar();
  renderLib();
  document.querySelector('.scroll')?.scrollTo({top:0,behavior:'smooth'});
}

function onLibrarySearchInput(){
  renderLib();
}
function setMyShelfTab(tabId){
  if (tabId === 'mine') {
    myShelfView = 'mine';
    myShelfClassFilter = 'all';
    refreshMyPageIfActive();
    return;
  }
  myShelfView = 'group';
  myShelfClassFilter = tabId;
  refreshMyPageIfActive();
}

function openMyGroupsView(){
  myShelfView = 'groups';
  myShelfClassFilter = 'all';
  refreshMyPageIfActive();
  document.querySelector('.scroll')?.scrollTo({top:0,behavior:'smooth'});
}

function backToMyShelf(){
  myShelfView = 'mine';
  myShelfClassFilter = 'all';
  refreshMyPageIfActive();
  document.querySelector('.scroll')?.scrollTo({top:0,behavior:'smooth'});
}

/** 组群书架无书时的空态（图标 + 文案 + 管理员可添加教材） */
function mkMyGroupShelfEmptyState(className, classIdx, isClassAdmin) {
  const name = className || '该组群';
  const addBlock = isClassAdmin && typeof classIdx === 'number'
    ? `<button type="button" class="my-shelf-empty-btn" onclick="openBookPicker(${classIdx})">添加教材</button>`
    : `<p class="my-shelf-empty-hint">请联系组群管理员添加教材</p>`;
  return `<div class="my-shelf-empty my-shelf-empty--with-icon">
    <div class="my-shelf-empty-icon" aria-hidden="true">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M8 7h8"/><path d="M8 11h6"/></svg>
    </div>
    <div class="my-shelf-empty-title">暂无教材</div>
    <p class="my-shelf-empty-desc"><span class="my-shelf-empty-class">${escAttr(name)}</span> 下暂无可显示的教材</p>
    ${addBlock}
  </div>`;
}

const GS=['全部','中职 一年级','中职 二年级','中职 三年级'];
/** 数字教材页「科目」筛选项（大类）；与书目字段 cat 对应，细分类仍用 sub 展示简介/目录 */
const SS=['全部科目','计算机基础','程序与开发','网络与运维','数据与平台','人工智能'];

function filterLibraryBookItems(){
  let items=books.map((b,i)=>({b,i}));
  if(fG!=='全部')items=items.filter(({b})=>b.g===fG);
  if(fS!=='全部科目')items=items.filter(({b})=>(b.cat||b.sub)===fS);
  const q=(document.getElementById('sInput')?.value||'').trim().toLowerCase();
  if(q)items=items.filter(({b})=>b.t.includes(q)||b.s.includes(q)||b.p.includes(q)||(b.cat||'').includes(q)||(b.sub||'').includes(q));
  return items;
}

function renderLibraryCatalog(){
  syncLibraryTopbar();
  const items=filterLibraryBookItems();
  const gc=GS.map(g=>`<button type="button" class="pill ${g===fG?'active':''}" onclick='setGradeFilter(${JSON.stringify(g)})'>${escAttr(g)}</button>`).join('');
  const sc=SS.map(s=>`<button type="button" class="pill ${s===fS?'active':''}" onclick='setSubjectFilter(${JSON.stringify(s)})'>${escAttr(s)}</button>`).join('');
  const bk=items.length
    ?`<div class="grid">${items.map(({b,i})=>mkCard(b,i,false)).join('')}</div>`
    :`<div class="library-empty">
        <p class="library-empty__title">未找到匹配教材</p>
        <p class="library-empty__desc">请尝试调整筛选条件或搜索关键词。</p>
      </div>`;

  document.getElementById('page-library').innerHTML=`
    <div class="library-catalog">
      <div class="filters" role="toolbar" aria-label="教材筛选">${gc}<div class="pill-sep"></div>${sc}</div>
      <div class="sec-head">
        <div class="sec-title"><span class="dot"></span>教材资源</div>
        <div class="sec-extra">共 ${items.length} 本</div>
      </div>
      ${bk}
    </div>`;
}

function renderLibraryHome(){
  syncLibraryTopbar();
  const q=(document.getElementById('sInput')?.value||'').trim().toLowerCase();
  const featuredList = q ? HOME_RECOMMENDED_BOOKS.filter((b) => b.t.includes(q) || b.publisher.includes(q)) : HOME_RECOMMENDED_BOOKS;
  const content = featuredList.length
    ? `<div class="library-grid">${featuredList.map((b, i) => mkLibraryShowcaseCard(b, i)).join('')}</div>`
    : `<div class="library-empty">
        <p class="library-empty__title">未找到匹配教材</p>
        <p class="library-empty__desc">请尝试调整关键词后重新搜索。</p>
      </div>`;

  document.getElementById('page-library').innerHTML=`
    <div class="library-home">
      ${buildLibraryHeroHtml()}
      <div class="library-section-head">
        <div class="library-section-head__title"><span class="library-fire" aria-hidden="true">🔥</span>热门教材</div>
        <button type="button" class="library-section-head__more" onclick="openLibraryCatalog()">查看全部教材 <span aria-hidden="true">›</span></button>
      </div>
      <div class="library-content">
        ${content}
      </div>
    </div>`;
}

function renderLib(){
  if(libraryView==='catalog')renderLibraryCatalog();
  else renderLibraryHome();
}

function renderMy(){
  if (!getUserProfile()) return;
  const schoolCardHtml = !FEATURE_SCHOOL_UI
    ? ''
    : (() => {
        const school = getBoundSchool();
        return school
          ? `<div class="school-bind-card school-bind-card--in-grid">
      <div class="school-bind-main">
        <div class="school-bind-ic">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </div>
        <div class="school-bind-text">
          <div class="school-bind-label">当前学校</div>
          <div class="school-bind-value">${school.name}</div>
        </div>
      </div>
      <div class="school-bind-actions">
        <button type="button" class="school-bind-link" onclick="event.stopPropagation();clearSchoolBind()">解除绑定</button>
        <button type="button" class="btn-school-ghost" onclick="event.stopPropagation();openSchoolModal('change')">更换学校</button>
      </div>
    </div>`
          : `<div class="school-bind-card school-bind-card--in-grid">
      <div class="school-bind-main">
        <div class="school-bind-ic">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </div>
        <div class="school-bind-text">
          <div class="school-bind-label">学校信息</div>
          <div class="school-bind-value muted">尚未绑定学校（可选）。绑定后可与学校课程、组群服务关联</div>
        </div>
      </div>
      <div class="school-bind-actions">
        <button type="button" class="btn-school-primary" onclick="event.stopPropagation();openSchoolModal('bind')">绑定学校</button>
      </div>
    </div>`;
      })();

  const myClassEntries = classGroups
    .map((cls, i) => ({ cls, i }))
    .filter(({ cls }) => isClassVisibleForUser(cls));
  const classHtml=myClassEntries.map(({cls,i})=>{
    return `<div class="class-card" onclick="openClassDetail(${i})">
      ${cls.admin===getCurrentUserDisplayName()?'<div class="class-card-admin"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>管理员</div>':''}
      <div class="class-card-head">
        <div class="class-card-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <div class="class-card-info">
          <div class="class-card-name">${cls.name}</div>
          <div class="class-card-sub">${cls.subject} · ${cls.books.length} 本教材 · ${cls.students.length} 人</div>
        </div>
      </div>
      <div class="class-card-stats">
        <div class="class-stat"><div class="class-stat-val">${cls.students.length}</div><div class="class-stat-lab">学生人数</div></div>
        <div class="class-stat"><div class="class-stat-val">${cls.books.length}</div><div class="class-stat-lab">组群教材</div></div>
      </div>
      <div class="class-card-foot">
        <div class="class-card-date">创建于 ${cls.created}</div>
        <svg class="class-card-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
      </div>
    </div>`;
  }).join('');
  const groupShelfEntries = myB
    .map((b, i) => ({ b, i, classNames: getClassNamesForMyBook(b) }))
    .filter((item) => item.classNames.length > 0);
  const groupTabOptions = myClassEntries.map(({ cls }) => ({
    id: cls.name,
    label: cls.name,
    isAdmin: cls.admin === getCurrentUserDisplayName(),
  }));
  const groupTabIds = new Set(groupTabOptions.map((o) => o.id));
  if (myShelfView === 'group') {
    if (!groupTabOptions.length) {
      myShelfView = 'mine';
      myShelfClassFilter = 'all';
    } else if (myShelfClassFilter === 'all' || !groupTabIds.has(myShelfClassFilter)) {
      myShelfClassFilter = groupTabOptions[0].id;
    }
  }
  const shelfTabOptions = [{ id: 'mine', label: '我的书架' }, ...groupTabOptions];
  const shownGroupShelfEntries =
    myShelfView === 'group' && groupTabIds.has(myShelfClassFilter)
      ? groupShelfEntries.filter((item) => item.classNames.includes(myShelfClassFilter))
      : [];
  const mineShelfHtml = myB.length
    ? `<div class="grid grid--my-books">${myB.map((b, i) => mkMyShelfCard(b, i)).join('')}</div>`
    : `<div class="my-shelf-empty">暂无教材，可通过兑换码添加到书架</div>`;
  const selectedClassEntry =
    myShelfView === 'group' && groupTabIds.has(myShelfClassFilter)
      ? myClassEntries.find(({ cls }) => cls.name === myShelfClassFilter)
      : null;
  const groupShelfHtml =
    myShelfView !== 'group'
      ? ''
      : shownGroupShelfEntries.length
        ? `<div class="grid grid--my-books">${shownGroupShelfEntries.map((item) => mkMyShelfCard(item.b, item.i, { groupNames: item.classNames })).join('')}</div>`
        : !groupTabOptions.length
          ? `<div class="my-shelf-empty my-shelf-empty--with-icon">
              <div class="my-shelf-empty-icon" aria-hidden="true">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <div class="my-shelf-empty-title">暂无组群</div>
              <p class="my-shelf-empty-desc">加入或创建组群后，可按组群查看教材</p>
            </div>`
          : mkMyGroupShelfEmptyState(
              myShelfClassFilter,
              selectedClassEntry?.i,
              !!(selectedClassEntry && selectedClassEntry.cls.admin === getCurrentUserDisplayName()),
            );
  const shelfTabsHtml = `<div class="my-shelf-tabs" role="navigation" aria-label="书架与组群">
      ${shelfTabOptions.map((opt) => {
        const active = opt.id === 'mine'
          ? myShelfView === 'mine'
          : (myShelfView === 'group' && myShelfClassFilter === opt.id);
        const adminMark = opt.isAdmin ? '<span class="my-shelf-tab-admin">管理员</span>' : '';
        return `<button type="button" class="my-shelf-tab ${active ? 'is-active' : ''}" onclick='setMyShelfTab(${JSON.stringify(opt.id)})'><span class="my-shelf-tab-label">${escAttr(opt.label)}</span>${adminMark}</button>`;
      }).join('')}
    </div>`;
  const activeClassName = myShelfClassFilter;
  const groupsOnlyHtml = `
    <div class="class-section class-section--standalone">
      <div class="sec-head">
        <div class="sec-title"><span class="dot"></span>我的群组</div>
        <div class="sec-head-actions">
          <span class="sec-extra">共 ${myClassEntries.length} 个群组</span>
          <button type="button" class="my-shelf-back-btn" onclick="backToMyShelf()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
            返回我的书架
          </button>
        </div>
      </div>
      <div class="class-grid">
        ${classHtml}
        <div class="class-card-create" onclick="openCreateClass()">
          <div class="class-create-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </div>
          <div class="class-create-text">创建组群</div>
        </div>
      </div>
    </div>`;

  document.getElementById('page-my').innerHTML=`
    <div class="my-action-row">
      <div class="join-class-entry join-class-entry--duo" onclick="openRedeem()" role="button" tabindex="0">
        <div class="join-class-entry-ic join-class-entry-ic--lavender">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"/><path d="M16 2v6M8 2v6"/></svg>
        </div>
        <div class="join-class-entry-text">
          <div class="join-class-entry-title">兑换教材</div>
          <div class="join-class-entry-desc">输入兑换码，将数字教材添加至书架</div>
        </div>
        <svg class="join-class-entry-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
      </div>
      <div class="join-class-entry join-class-entry--duo" onclick="openJoinClass()" role="button" tabindex="0">
        <div class="join-class-entry-ic join-class-entry-ic--peach">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/></svg>
        </div>
        <div class="join-class-entry-text">
          <div class="join-class-entry-title">加入组群</div>
          <div class="join-class-entry-desc">输入管理员提供的邀请码加入对应组群</div>
        </div>
        <svg class="join-class-entry-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
      </div>
      <div class="join-class-entry join-class-entry--duo" onclick="openMyGroupsView()" role="button" tabindex="0">
        <div class="join-class-entry-ic join-class-entry-ic--sky">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <div class="join-class-entry-text">
          <div class="join-class-entry-title">我的群组</div>
          <div class="join-class-entry-desc">查看已创建或已加入的全部群组</div>
        </div>
        <svg class="join-class-entry-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
      </div>
    </div>
    ${myShelfView === 'groups' ? groupsOnlyHtml : `
    <div class="sec-head sec-head--my-shelf">
      <div class="sec-title"><span class="dot"></span>书架</div>
      <div class="sec-head-actions sec-head-actions--my-shelf">
        <span class="sec-extra">${myShelfView === 'mine' ? `共 ${myB.length} 本` : `${activeClassName} · ${shownGroupShelfEntries.length} 本`}</span>
        <button type="button" class="my-shelf-create-quick" onclick="openCreateClass()">
          <svg class="my-shelf-create-ic" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          <span>创建组群</span>
        </button>
      </div>
    </div>
    ${shelfTabsHtml}
    ${myShelfView === 'mine' ? mineShelfHtml : groupShelfHtml}
    <div class="class-section">
      <div class="sec-head">
        <div class="sec-title"><span class="dot"></span>我的组群</div>
        <div class="sec-head-actions">
          <span class="sec-extra">共 ${myClassEntries.length} 个组群</span>
        </div>
      </div>
      <div class="class-grid">
        ${schoolCardHtml}
        ${classHtml}
        <div class="class-card-create" onclick="openCreateClass()">
          <div class="class-create-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </div>
          <div class="class-create-text">创建组群</div>
        </div>
      </div>
    </div>`}`;
  bindMineShelfUiEvents();
  requestAnimationFrame(() => {
    mineShelfReflowAll();
    requestAnimationFrame(() => mineShelfReflowAll());
  });
}

function go(p){
  if (!getUserProfile()) return;
  document.querySelectorAll('.nav-item[data-page]').forEach(el=>el.classList.toggle('active',el.dataset.page===p));
  document.querySelectorAll('.page').forEach(el=>el.classList.toggle('active',el.id===`page-${p}`));
  const t=document.getElementById('pTitle'),h=document.getElementById('pHint');
  const topbar=document.querySelector('.topbar');
  const sw=document.getElementById('topbarSearchWrap');
  if(sw) sw.style.display=p==='library'?'':'none';
  if(p!=='library'){
    libraryView='home';
    if(topbar){
      topbar.classList.remove('topbar--library','topbar--catalog');
    }
    const backBtn=document.getElementById('topbarBackBtn');
    if(backBtn)backBtn.hidden=true;
  }
  if(p==='library'){
    libraryView='home';
    renderLib();
  }
  else if(p==='my'){t.textContent='我的书架';h.textContent='管理已添加的教材与学习进度';renderMy()}
  else if(p==='settings'){t.textContent='设置';h.textContent='账号与个人信息';renderSettings()}
}

consumeExternalBookQuery();
if (import.meta.env.DEV && !localStorage.getItem(PROFILE_STORAGE_KEY)) {
  saveUserProfile({});
}
applyAuthShell();
if (getUserProfile()) {
  renderLib();
  tryOpenPendingBookDetail();
  tryOpenPendingReader();
}
syncSidebarUser();

document.getElementById('loginPassword')?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    submitLoginPassword();
  }
});
document.getElementById('loginSmsCode')?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    submitLoginOtp();
  }
});
document.getElementById('regPassword2')?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    submitRegister();
  }
});
document.getElementById('fgPassword2')?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    submitForgotPassword();
  }
});

document.getElementById('joinClassCode')?.addEventListener('keydown',e=>{
  if(e.key==='Enter'){e.preventDefault();doJoinClass();}
});

document.getElementById('schoolActivationCode')?.addEventListener('keydown',e=>{
  if(e.key==='Enter'){e.preventDefault();confirmSchoolBind();}
});

document.getElementById('pwdNew2')?.addEventListener('keydown',e=>{
  if(e.key==='Enter'){e.preventDefault();confirmPasswordChange();}
});

document.getElementById('phoneCode')?.addEventListener('keydown',e=>{
  if(e.key==='Enter'){e.preventDefault();confirmPhoneChange();}
});

// === 数字教材阅读页 ===
/** 三级目录演示数据（可对接接口替换） */
const READER_OUTLINE = [
  {
    title: '第一模块 智能技术与社会',
    children: [
      {
        title: '第1课 人工智能能做什么？',
        children: [
          { title: '导读与关键概念', cid: 'r1' },
          { title: '案例与拓展阅读', cid: 'r2' },
          { title: '实训与互动', cid: 'r5' },
          { title: '交互案例', cid: 'r6' },
        ],
      },
      {
        title: '第2课 数据、模型与风险',
        children: [{ title: '综合练习', cid: 'r3' }],
      },
    ],
  },
  {
    title: '第二模块 项目式学习',
    children: [
      {
        title: '第3课 从分类到简单神经网络',
        children: [{ title: '拓展阅读与练习', cid: 'r4' }],
      },
    ],
  },
];

/** 目录角标：须与 buildReaderArticleHtml 各 cid 是否含实训 / 交互案例保持一致 */
const READER_CID_FEATURES = {
  r5: { lab: true },
  r6: { icase: true },
};

function readerTocFeatureBadgesHtml(cid) {
  const f = READER_CID_FEATURES[cid];
  if (!f) return '';
  const chips = [];
  if (f.lab) chips.push('<span class="reader-toc-badge reader-toc-badge--lab" title="本页含在线实训">实训</span>');
  if (f.icase) chips.push('<span class="reader-toc-badge reader-toc-badge--icase" title="本页含交互案例">案例</span>');
  if (!chips.length) return '';
  return `<span class="reader-toc-badges" aria-hidden="true">${chips.join('')}</span>`;
}

/** 阅读页嵌入「测试/练习」演示题库（可对接 CMS） */
const READER_DEMO_QUIZ = {
  title: '本节综合测评',
  subtitle: '《人工智能导论》· 智能技术与社会（演示）',
  questions: [
    {
      id: 'q1',
      type: 'choice',
      stem: '下列哪一项最符合「可解释性」在人工智能应用中的含义？',
      options: [
        '模型参数量必须尽可能大',
        '能向用户或监管方说明关键预测依据，便于审计与纠偏',
        '完全禁止在课堂中使用大模型',
      ],
      correctIndex: 1,
      explain: '可解释性强调在医疗、教育、金融等场景下，关键决策应可被理解与追溯，以落实责任与合规。',
    },
    {
      id: 'q2',
      type: 'fill',
      stem: '监督学习通常需要带________的数据来训练预测模型。',
      answers: ['标签', '标注', 'label'],
      explain: '监督学习依赖输入与对应输出（标签），以便学习从特征到目标的映射关系。',
    },
    {
      id: 'q3',
      type: 'tf',
      stem: '在大模型时代，学生仍应关注数据来源、版权与引用规范，避免将他人作品标为自己的成果。',
      correct: true,
      explain: '学术与工程实践均要求诚信与版权合规，技术能力与人文规范同样重要。',
    },
    {
      id: 'q4',
      type: 'short',
      stem: '请简要说明：在课堂或实训中使用生成式人工智能时，你应至少注意哪两类风险？（建议不少于 25 字）',
      keywords: ['隐私', '信息', '偏见', '幻觉', '安全', '版权', '学术', '规范'],
      minLen: 25,
      sampleAnswer:
        '一是注意隐私与敏感信息泄露，避免把个人或学校未公开数据直接输入公网服务；二是注意「幻觉」与事实错误，对输出进行查证，并遵守学术诚信与版权要求。',
      explain: '可围绕隐私/安全、事实性、版权、学术诚信、模型偏见等任两点展开，表述清楚即可。',
    },
  ],
};

/** 第二套演示题（拓展阅读主题；与综合测评独立计分与完成态） */
const READER_DEMO_QUIZ_B = {
  title: '拓展练习',
  subtitle: '网络与数据安全基础（演示）',
  questions: [
    {
      id: 'bq1',
      type: 'choice',
      stem: '在公共 Wi-Fi 下访问学校内网或传输作业，较稳妥的做法是？',
      options: [
        '直接连接并关闭所有安全提示以提速',
        '使用学校提供的 VPN/加密通道或可信蜂窝网络，并避免明文传输敏感信息',
        '将账号密码保存到便签并拍照上传云盘',
      ],
      correctIndex: 1,
      explain: '不可信网络宜通过加密通道访问内网，并减少敏感数据在公共链路上的暴露面。',
    },
    {
      id: 'bq2',
      type: 'fill',
      stem: '对称加密中，加解密使用________密钥；非对称加密常使用公钥与私钥配对。',
      answers: ['相同', '同一', '一样'],
      explain: '对称加密用同一密钥加解密，速度快但密钥分发是难点；非对称可更好解决身份与密钥交换问题。',
    },
    {
      id: 'bq3',
      type: 'tf',
      stem: '将同学或客户的个人信息用于「训练自己的模型」而不告知用途，可能违反个人信息保护与学校管理制度。',
      correct: true,
      explain: '收集与使用个人信息应遵循目的限制与告知同意，教学演示也应使用脱敏或公开数据集。',
    },
  ],
};

/** 拓展阅读页可挂载多组练习（id 对应 localStorage 槽位与弹层题库） */
const READER_PRACTICE_SLOTS = [
  {
    id: 'a',
    quiz: READER_DEMO_QUIZ,
    sectionTitle: '拓展练习',
  },
  {
    id: 'b',
    quiz: READER_DEMO_QUIZ_B,
    sectionTitle: '拓展练习',
  },
];

/** 演示：无 localStorage 记录时，该槽位默认展示「已完成」样例（另一槽位仍为未完成；作答提交后以真实记录为准） */
const READER_DEMO_PRESET_COMPLETED_SLOT = 'a';

let readerQuizPhase = 'idle';
let readerActiveQuizSlot = 'a';
let readerQuizStepIndex = 0;
/** 单题作答：跨题暂存答案（题号切换时写入） */
let readerQuizDraftAnswers = {};

/** 嵌入练习题库（演示；正式环境可按书目 id 从接口取） */
function readerGetQuizBySlot(slotId) {
  const s = READER_PRACTICE_SLOTS.find((x) => x.id === slotId);
  return s ? s.quiz : READER_DEMO_QUIZ;
}

function readerGetCurrentQuiz() {
  return readerGetQuizBySlot(readerActiveQuizSlot);
}

function readerQuizLsKey(b, slotId = 'a') {
  if (!b || !b.t) return null;
  return `readerQuizDone:v2:${b.t}::${b.s}::${slotId}`;
}

function readerGetQuizCompletion(b, slotId = 'a') {
  const k = readerQuizLsKey(b, slotId);
  if (!k || typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(k);
    if (raw) return JSON.parse(raw);
    if (slotId === 'a') {
      const legacy = `readerQuizDone:v1:${b.t}::${b.s}`;
      const raw2 = localStorage.getItem(legacy);
      if (raw2) return JSON.parse(raw2);
    }
  } catch {
    return null;
  }
  if (slotId === READER_DEMO_PRESET_COMPLETED_SLOT) {
    const report = readerBuildDemoReportResult(slotId);
    if (!report) return null;
    return {
      done: true,
      score: report.score,
      total: report.total,
      at: 0,
      report,
      demoPreset: true,
    };
  }
  return null;
}

function readerSaveQuizCompletion(b, result, slotId = 'a') {
  const k = readerQuizLsKey(b, slotId);
  if (!k || !result) return;
  try {
    localStorage.setItem(
      k,
      JSON.stringify({
        done: true,
        score: result.score,
        total: result.total,
        at: Date.now(),
        report: result,
      })
    );
  } catch (_) {}
}

/** 正确率 0–100，整数 */
function readerQuizAccuracyPercent(score, total) {
  if (score == null || total == null || !Number.isFinite(total) || total <= 0) return null;
  return Math.round((score / total) * 100);
}

/** 「拓展练习」板块 HTML */
function readerPracticeSectionHtml(b, slot) {
  const comp = readerGetQuizCompletion(b, slot.id);
  const done = !!(comp && comp.done);
  const nQ = slot.quiz.questions.length;
  const score = comp && Number.isFinite(comp.score) ? comp.score : null;
  const total = comp && Number.isFinite(comp.total) ? comp.total : nQ;
  const accPct = done ? readerQuizAccuracyPercent(score, total) : null;
  const sectionCls = done
    ? 'reader-practice-section reader-practice-section--done reader-practice-section--under-extend'
    : 'reader-practice-section reader-practice-section--under-extend';
  const cardCls = done ? 'reader-practice-card reader-practice-card--done' : 'reader-practice-card';
  const badge = done ? '<span class="reader-practice-badge">已完成</span>' : '';
  const desc = done
    ? '你已完成本节测评。如需巩固可再次作答，成绩以最近一次提交为准。'
    : '含选择题、填空、判断与简答；提交后自动判分，可查看每题解析与 AI 学习评价（演示，可对接 CMS）。';
  const accStat = done
    ? `<li class="reader-practice-stat reader-practice-stat--accent"><span class="reader-practice-stat__lab">正确率</span><span class="reader-practice-stat__val">${
        accPct != null ? `${accPct}%` : '—'
      }</span></li>`
    : '';
  const kicker = slot.eyebrow && String(slot.eyebrow).trim() ? escAttr(String(slot.eyebrow).trim()) : '';
  const kickerHtml = kicker ? `<p class="reader-practice-kicker">${kicker}</p>` : '';
  const ariaBits = [slot.sectionTitle, slot.eyebrow && String(slot.eyebrow).trim()].filter(Boolean);
  const ariaLab = escAttr(ariaBits.join(' · '));
  const titleHtml = escAttr(slot.sectionTitle);
  const ctaBlock = done
    ? `<div class="reader-practice-cta reader-practice-cta--row" role="group" aria-label="报告与重测">
        <button type="button" class="reader-practice-btn reader-practice-btn--primary" onclick="readerOpenSavedReport('${slot.id}')">查看报告</button>
        <button type="button" class="reader-practice-btn reader-practice-btn--secondary" onclick="readerOpenQuizModal('${slot.id}')">再次测评</button>
      </div>`
    : `<div class="reader-practice-cta">
        <button type="button" class="reader-practice-btn reader-practice-btn--primary" onclick="readerOpenQuizModal('${slot.id}')">进入答题</button>
      </div>`;
  return `<section class="${sectionCls}" aria-label="${ariaLab}">
        <div class="${cardCls}">
          <header class="reader-practice-card__head">
            <div class="reader-practice-card__head-main">
              ${kickerHtml}
              <h3 class="reader-practice-h3">${titleHtml}</h3>
            </div>
            ${badge}
          </header>
          <div class="reader-practice-card__body">
            <p class="reader-practice-lede">${desc}</p>
            <ul class="reader-practice-statrow" aria-label="本组题概况">
              <li class="reader-practice-stat"><span class="reader-practice-stat__lab">题量</span><span class="reader-practice-stat__val">${nQ} 题</span></li>
              ${accStat}
            </ul>
            ${ctaBlock}
          </div>
        </div>
      </section>`;
}

/** 阅读页「在线实训」可挂载项（点击后在全屏页中打开，可接 CMS / 多实训 id） */
const READER_LAB_UNITS = [
  {
    id: 'image-classify',
    kicker: '在线实训',
    title: '体验人工智能：图片识别物体',
    desc: '在浏览器中完成一次图像分类与置信度体验：可选择示例图或本地上传（演示为模拟输出，不调用外网大模型）。',
  },
];

const READER_AI_PAINTING_EXPERIMENT_UNIT = {
  id: 'ai-painting-lab',
  kicker: '',
  title: 'AI绘画',
  desc: '只要输入文字，我就能帮你画出心里的画面。实验标题、说明文案和跳转链接后期可在作者端配置。',
  pill: '',
  buttonLabel: '立即进入实验',
  url: 'https://scmeow.com/',
  visualUrl: '/reader/ai-painting-lab.jpg',
};

const READER_LAB_IMAGE_SAMPLES = [
  { src: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=640&q=80', label: '猫' },
  { src: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=640&q=80', label: '狗' },
  { src: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=640&q=80', label: '汽车' },
  { src: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=640&q=80', label: '花卉' },
];

let readerLabActiveObjectUrl = null;
/** { type:'sample', index:number } | { type:'file' } */
let readerLabPicked = null;

function readerLabUnitHtml(unit) {
  const kicker = unit.kicker && String(unit.kicker).trim();
  const kickerHtml = kicker ? `<p class="reader-lab-kicker">${escAttr(kicker)}</p>` : '';
  const t = escAttr(String(unit.title));
  const d = escAttr(String(unit.desc));
  const aria = escAttr([kicker, unit.title].filter(Boolean).join(' · '));
  const id = String(unit.id).replace(/"/g, '');
  const pillRaw = Object.prototype.hasOwnProperty.call(unit, 'pill') ? unit.pill : '实训';
  const pill = pillRaw && String(pillRaw).trim() ? escAttr(String(pillRaw).trim()) : '';
  const buttonLabel = escAttr(unit.buttonLabel || '进入实训');
  const url = unit.url && String(unit.url).trim();
  const visualUrl = unit.visualUrl && String(unit.visualUrl).trim();
  const cardCls = visualUrl ? 'reader-lab-card reader-lab-card--feature' : 'reader-lab-card';
  const visualHtml = visualUrl
    ? `<div class="reader-lab-card__visual" aria-hidden="true">
        <img class="reader-lab-card__img" src="${escAttr(visualUrl)}" alt="" loading="lazy">
      </div>`
    : '';
  const cta = url
    ? `<a class="reader-lab-btn reader-lab-btn--link" href="${escAttr(url)}" target="_blank" rel="noopener noreferrer"><span>${buttonLabel}</span><span class="reader-lab-btn__arrow" aria-hidden="true">→</span></a>`
    : `<button type="button" class="reader-lab-btn" onclick="readerOpenLab('${id}')"><span>${buttonLabel}</span><span class="reader-lab-btn__arrow" aria-hidden="true">→</span></button>`;
  return `<section class="reader-lab-section" aria-label="${aria}">
    <div class="${cardCls}">
      ${visualHtml}
      <div class="reader-lab-card__content">
        <header class="reader-lab-card__head">
          <div class="reader-lab-card__head-main">
            ${kickerHtml}
            <h3 class="reader-lab-h3">${t}</h3>
          </div>
          ${pill ? `<span class="reader-lab-pill" aria-hidden="true">${pill}</span>` : ''}
        </header>
        <div class="reader-lab-card__body">
          <p class="reader-lab-lede">${d}</p>
          <div class="reader-lab-cta">
            ${cta}
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

function readerIsSportsNutritionBook(b) {
  return !!(b && b.t === '运动营养学');
}

function readerSportsExperimentSectionHtml(b) {
  if (!readerIsSportsNutritionBook(b)) return '';
  return `<div class="reader-lab-below reader-lab-below--experiment" aria-label="本课科学小实验">
        ${readerLabUnitHtml(READER_AI_PAINTING_EXPERIMENT_UNIT)}
      </div>`;
}

/** 阅读页「交互案例」可挂载项（可在线调参、观察可视化，可接 CMS / 多案例 id） */
const READER_ICASE_UNITS = [
  {
    id: 'gradient-toy',
    kicker: '交互案例',
    title: '人工智能算法原理：学习率与梯度下降',
    desc: '在最小化 L(w)=½(w−2)² 的示例中，用滑块改变学习率、初值和迭代步数，观察损失曲线和参数在横轴上如何向最优解移动。',
  },
];

function readerICaseUnitHtml(unit) {
  const kicker = unit.kicker && String(unit.kicker).trim();
  const kickerHtml = kicker ? `<p class="reader-icase-kicker">${escAttr(kicker)}</p>` : '';
  const t = escAttr(String(unit.title));
  const d = escAttr(String(unit.desc));
  const aria = escAttr([kicker, unit.title].filter(Boolean).join(' · '));
  const id = String(unit.id).replace(/"/g, '');
  return `<section class="reader-icase-section" aria-label="${aria}">
    <div class="reader-icase-card">
      <header class="reader-icase-card__head">
        <div class="reader-icase-card__head-main">
          ${kickerHtml}
          <h3 class="reader-icase-h3">${t}</h3>
        </div>
        <span class="reader-icase-pill" aria-hidden="true">案例</span>
      </header>
      <div class="reader-icase-card__body">
        <p class="reader-icase-lede">${d}</p>
        <div class="reader-icase-cta">
          <button type="button" class="reader-icase-btn" onclick="readerOpenICase('${id}')">体验案例</button>
        </div>
      </div>
    </div>
  </section>`;
}

function readerBuildImageClassifyBodyHtml() {
  const tiles = READER_LAB_IMAGE_SAMPLES.map(
    (s, i) =>
      `<button type="button" class="reader-lab-ic__tile" data-idx="${i}" aria-pressed="false" aria-label="使用示例图 ${i + 1}：${escAttr(
        s.label
      )}">
        <img src="${escAttr(s.src)}" alt="" class="reader-lab-ic__img" loading="lazy" width="160" height="120">
        <span class="reader-lab-ic__cap">示例：${escAttr(s.label)}</span>
      </button>`
  ).join('');
  return `<div class="reader-lab-ic">
    <p class="reader-lab-ic__lead">下方每张示例图在演示环境中对应固定的<strong>「模拟」识别标签</strong>。你也可以上传本地图片：当前为教学演示，上传结果以随机标签示意，正式部署时可接入云端或边缘推理服务。</p>
    <div class="reader-lab-ic__samples" role="group" aria-label="示例图片">${tiles}</div>
    <div class="reader-lab-ic__upload">
      <label class="reader-lab-ic__uplab">
        <span>或上传图片</span>
        <input type="file" id="readerLabFileInput" class="reader-lab-ic__file" accept="image/*" title="从本机选择图片">
      </label>
    </div>
    <p class="reader-lab-ic__preview" id="readerLabPreview" hidden>已选择本机图片，可点击下方开始识别（演示用）。</p>
    <div class="reader-lab-ic__go">
      <button type="button" class="reader-lab-ic__run" id="readerLabRunBtn" disabled>开始识别</button>
    </div>
    <div class="reader-lab-ic__out" id="readerLabClassifyOut" role="status" aria-live="polite"></div>
  </div>`;
}

function _readerLabTeardownPickedTiles() {
  document.querySelectorAll('.reader-lab-ic__tile[aria-pressed="true"]').forEach((b) => {
    b.setAttribute('aria-pressed', 'false');
    b.classList.remove('is-on');
  });
}

function readerBindImageClassifyPage() {
  const runBtn = document.getElementById('readerLabRunBtn');
  const out = document.getElementById('readerLabClassifyOut');
  const prev = document.getElementById('readerLabPreview');
  const fileIn = document.getElementById('readerLabFileInput');
  if (!runBtn || !out) return;
  document.querySelectorAll('.reader-lab-ic__tile').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (readerLabActiveObjectUrl) {
        try {
          URL.revokeObjectURL(readerLabActiveObjectUrl);
        } catch (_) {}
        readerLabActiveObjectUrl = null;
      }
      if (fileIn) fileIn.value = '';
      _readerLabTeardownPickedTiles();
      btn.setAttribute('aria-pressed', 'true');
      btn.classList.add('is-on');
      const idx = Number(btn.dataset.idx);
      readerLabPicked = { type: 'sample', index: Number.isFinite(idx) ? idx : 0 };
      if (prev) prev.hidden = true;
      out.innerHTML = '';
      runBtn.disabled = false;
    });
  });
  if (fileIn) {
    fileIn.addEventListener('change', () => {
      const f = fileIn.files && fileIn.files[0];
      _readerLabTeardownPickedTiles();
      out.innerHTML = '';
      if (readerLabActiveObjectUrl) {
        try {
          URL.revokeObjectURL(readerLabActiveObjectUrl);
        } catch (_) {}
        readerLabActiveObjectUrl = null;
      }
      if (!f) {
        readerLabPicked = null;
        if (prev) prev.hidden = true;
        runBtn.disabled = true;
        return;
      }
      try {
        readerLabActiveObjectUrl = URL.createObjectURL(f);
      } catch (_) {
        readerLabPicked = null;
        if (prev) prev.hidden = true;
        runBtn.disabled = true;
        return;
      }
      readerLabPicked = { type: 'file' };
      if (prev) prev.hidden = false;
      runBtn.disabled = false;
    });
  }
  runBtn.addEventListener('click', () => {
    if (!readerLabPicked) return;
    out.innerHTML = '<p class="reader-lab-ic__status">正在推理（演示）…</p>';
    runBtn.disabled = true;
    const delay = 650 + Math.random() * 500;
    window.setTimeout(() => {
      if (readerLabPicked && readerLabPicked.type === 'sample') {
        const s = READER_LAB_IMAGE_SAMPLES[readerLabPicked.index];
        const conf = 0.86 + Math.random() * 0.12;
        const pct = (conf * 100).toFixed(1);
        out.innerHTML = `<div class="reader-lab-ic__result">
          <p class="reader-lab-ic__result-head">识别结果</p>
          <p>预测标签：<strong>${escAttr(s.label)}</strong></p>
          <p>模拟置信度：<strong>${pct}%</strong>（本示例为固定对应关系，便于理解「分类+置信度」过程）</p>
        </div>`;
      } else {
        const pool = ['日常物品', '自然风景', '建筑', '交通工具', '食品', '人物', '植物'];
        const pick = pool[Math.floor(Math.random() * pool.length)];
        const conf = 0.52 + Math.random() * 0.3;
        const pct = (conf * 100).toFixed(1);
        out.innerHTML = `<div class="reader-lab-ic__result reader-lab-ic__result--file">
          <p class="reader-lab-ic__result-head">识别结果</p>
          <p>预测标签（演示随机）：<strong>${escAttr(pick)}</strong></p>
          <p>模拟置信度：<strong>${pct}%</strong></p>
          <p class="reader-lab-ic__hint">本地上传在演示中未做真实特征提取，仅供课堂流程体验；可对接 TensorFlow.js、云端 API 等实现实识别别。</p>
        </div>`;
      }
      runBtn.disabled = !readerLabPicked;
    }, delay);
  });
}

function readerOpenLab(labId) {
  const u = READER_LAB_UNITS.find((x) => x.id === labId);
  if (!u) return;
  readerCloseICase();
  readerCloseQuizModal();
  readerClosePopovers();
  if (document.getElementById('readerAiDrawer')?.getAttribute('aria-hidden') === 'false') {
    readerToggleAi();
  }
  if (document.getElementById('readerNotesDrawer')?.getAttribute('aria-hidden') === 'false') {
    readerToggleNotes();
  }
  readerLabPicked = null;
  if (readerLabActiveObjectUrl) {
    try {
      URL.revokeObjectURL(readerLabActiveObjectUrl);
    } catch (_) {}
    readerLabActiveObjectUrl = null;
  }
  const tEl = document.getElementById('readerLabPageTitle');
  if (tEl) tEl.textContent = u.title;
  const kEl = document.getElementById('readerLabPageKicker');
  if (kEl) kEl.textContent = u.kicker || '在线实训';
  const root = document.getElementById('readerLabPageRoot');
  if (labId === 'image-classify' && root) {
    root.innerHTML = readerBuildImageClassifyBodyHtml();
    readerBindImageClassifyPage();
  } else if (root) {
    root.innerHTML = '<p class="reader-lab-page__empty">该实训未配置或暂不可用。</p>';
  }
  const page = document.getElementById('readerLabPage');
  if (page) {
    page.classList.add('open');
    page.setAttribute('aria-hidden', 'false');
  }
  document.getElementById('readerLabPageRoot')?.focus({ preventScroll: true });
}

function readerCloseLab() {
  if (readerLabActiveObjectUrl) {
    try {
      URL.revokeObjectURL(readerLabActiveObjectUrl);
    } catch (_) {}
    readerLabActiveObjectUrl = null;
  }
  readerLabPicked = null;
  const page = document.getElementById('readerLabPage');
  if (page) {
    page.classList.remove('open');
    page.setAttribute('aria-hidden', 'true');
  }
  const root = document.getElementById('readerLabPageRoot');
  if (root) root.innerHTML = '';
}

/** 一维平方损失上的梯度下降轨迹（教学演示，纯前端计算与绘图） */
function readerIcaseRunGradient(eta, w0, maxSteps) {
  const wStar = 2;
  const safeEta = Math.max(0, Number(eta) || 0);
  const wInit = Number(w0) === 0 ? 0 : Number.isFinite(w0) ? w0 : 0;
  const n = Math.max(1, Math.min(120, Math.floor(maxSteps) || 30));
  const ws = [wInit];
  const losses = [0.5 * (wInit - wStar) ** 2];
  let w = wInit;
  for (let i = 0; i < n; i += 1) {
    const g = w - wStar;
    w = w - safeEta * g;
    if (!Number.isFinite(w)) {
      break;
    }
    ws.push(w);
    losses.push(0.5 * (w - wStar) ** 2);
    if (Math.abs(w - wStar) < 1e-5) {
      break;
    }
  }
  return { ws, losses, wStar };
}

function readerBuildGradientToyBodyHtml() {
  return `<div class="reader-icase-toy">
    <p class="reader-icase-toy__lead">在目标函数 <em>L(w) = ½(w−2)²</em> 中，自变量 w 的梯度为 <em>g = w−2</em>。用梯度下降更新 w ← w − η g。拖动滑块，观察 <strong>学习率 η</strong> 过大时轨迹会在最优点附近震荡甚至发散、适中时则平滑逼近 <strong>w* = 2</strong>。</p>
    <div class="reader-icase-toy__sliders" role="group" aria-label="调整参数">
      <div class="reader-icase-toy__row">
        <span class="reader-icase-toy__name">学习率 η</span>
        <input type="range" id="icaseEta" class="reader-icase-toy__range" min="0.01" max="1.2" step="0.01" value="0.3">
        <output class="reader-icase-toy__out" for="icaseEta" id="icaseEtaVal">0.30</output>
      </div>
      <div class="reader-icase-toy__row">
        <span class="reader-icase-toy__name">初值 w₀</span>
        <input type="range" id="icaseW0" class="reader-icase-toy__range" min="0" max="5" step="0.05" value="4.5">
        <output class="reader-icase-toy__out" for="icaseW0" id="icaseW0Val">4.50</output>
      </div>
      <div class="reader-icase-toy__row">
        <span class="reader-icase-toy__name">最大迭代步数</span>
        <input type="range" id="icaseN" class="reader-icase-toy__range" min="3" max="100" step="1" value="32">
        <output class="reader-icase-toy__out" for="icaseN" id="icaseNVal">32</output>
      </div>
    </div>
    <p class="reader-icase-toy__tip" id="icaseHint" role="status">提示会随你调节参数更新。</p>
    <div class="reader-icase-toy__canvases">
      <div class="reader-icase-toy__panel">
        <p class="reader-icase-toy__plab">损失 L(w) 与参数轨迹（w 在横轴）</p>
        <div class="reader-icase-toy__frame">
          <canvas class="reader-icase-canvas" id="icaseCvW" width="720" height="220" role="img" aria-label="损失与参数轨迹图"></canvas>
        </div>
      </div>
      <div class="reader-icase-toy__panel">
        <p class="reader-icase-toy__plab">损失随迭代步数 t</p>
        <div class="reader-icase-toy__frame">
          <canvas class="reader-icase-canvas" id="icaseCvT" width="720" height="150" role="img" aria-label="损失与迭代步数图"></canvas>
        </div>
      </div>
    </div>
  </div>`;
}

function readerIcaseDrawGradientToy() {
  const elEta = document.getElementById('icaseEta');
  const elW0 = document.getElementById('icaseW0');
  const elN = document.getElementById('icaseN');
  const oEta = document.getElementById('icaseEtaVal');
  const oW0 = document.getElementById('icaseW0Val');
  const oN = document.getElementById('icaseNVal');
  const hint = document.getElementById('icaseHint');
  if (!elEta || !elW0 || !elN) return;
  const eta = +elEta.value;
  const w0 = +elW0.value;
  const nMax = +elN.value;
  if (oEta) oEta.textContent = Number.isFinite(eta) ? eta.toFixed(2) : '—';
  if (oW0) oW0.textContent = Number.isFinite(w0) ? w0.toFixed(2) : '—';
  if (oN) oN.textContent = String(Math.round(nMax));
  const { ws, losses, wStar } = readerIcaseRunGradient(eta, w0, nMax);
  if (hint) {
    if (eta <= 0) {
      hint.textContent = '请把学习率设为略大于 0 的值。';
    } else if (eta >= 2) {
      hint.textContent = '在 L(w)=½(w−2)² 中，|1−η|≥1 时迭代不收敛；η=2 往往在两值间震荡，η>2 时参数会越跑越远。可对比 η=0.3 与 η=0.1。';
    } else if (eta > 0.1 && eta < 2) {
      hint.textContent = '0<η<2 时单调区间上通常收敛到 w*；η 小则步小但稳，η 大则快但可能在最优点附近摆动。试把起点 w₀ 与 η 联调观察。';
    } else {
      hint.textContent = '学习率较小，步幅细腻，可观察损失曲线更平滑。';
    }
  }
  const cW = document.getElementById('icaseCvW');
  const cT = document.getElementById('icaseCvT');
  if (cW && cW.getContext) {
    readerIcaseDrawLossCurve(cW, ws, losses, wStar);
  }
  if (cT && cT.getContext) {
    readerIcaseDrawLossByStep(cT, losses);
  }
}

function readerIcaseDrawLossCurve(canvas, ws, losses, wStar) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const wCss = Math.max(200, Math.floor(canvas.getBoundingClientRect().width) || 720);
  const h = 220;
  canvas.width = Math.floor(wCss * dpr);
  canvas.height = Math.floor(h * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const W = wCss;
  const pad = { l: 40, r: 16, t: 12, b: 28 };
  const plotW = W - pad.l - pad.r;
  const plotH = h - pad.t - pad.b;
  ctx.clearRect(0, 0, W, h);
  const wMin = -0.6;
  const wMax = 5.2;
  const lTop = Math.max(0.1, ...losses);
  const lMax = lTop * 1.1 + 0.05;
  const xOf = (w) => pad.l + ((w - wMin) / (wMax - wMin)) * plotW;
  const yOf = (loss) => pad.t + (1 - loss / lMax) * plotH;
  ctx.save();
  ctx.lineWidth = 1;
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(pad.l, pad.t, plotW, plotH);
  ctx.strokeStyle = 'rgba(148,163,184,0.45)';
  ctx.setLineDash([3, 4]);
  for (let i = 0; i <= 5; i += 1) {
    const w = wMin + ((wMax - wMin) * i) / 5;
    const x = xOf(w);
    ctx.beginPath();
    ctx.moveTo(x, pad.t);
    ctx.lineTo(x, pad.t + plotH);
    ctx.stroke();
  }
  for (let i = 0; i <= 3; i += 1) {
    const l = (lMax * (3 - i)) / 3;
    const y = yOf(l);
    ctx.beginPath();
    ctx.moveTo(pad.l, y);
    ctx.lineTo(pad.l + plotW, y);
    ctx.stroke();
  }
  ctx.setLineDash([]);
  /** _loss curve */
  ctx.beginPath();
  for (let px = 0; px <= 400; px += 1) {
    const w = wMin + ((wMax - wMin) * px) / 400;
    const l = 0.5 * (w - wStar) ** 2;
    const x = xOf(w);
    const y = yOf(l);
    if (px === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = 'rgba(99,102,241,0.7)';
  ctx.lineWidth = 2;
  ctx.stroke();
  /**  trajectory */
  ctx.beginPath();
  for (let i = 0; i < losses.length; i += 1) {
    const x = xOf(ws[i]);
    const y = yOf(losses[i]);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = '#597ef7';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  for (let i = 0; i < Math.min(60, losses.length); i += 1) {
    const x = xOf(ws[i]);
    const y = yOf(losses[i]);
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = i === 0 ? '#b45309' : i === losses.length - 1 ? '#1d39c4' : 'rgba(47,84,235,0.85)';
    ctx.fill();
  }
  if (ws.length > 0) {
    const ox = xOf(wStar);
    const oy = yOf(0);
    ctx.setLineDash([2, 3]);
    ctx.strokeStyle = 'rgba(234,88,12,0.5)';
    ctx.beginPath();
    ctx.moveTo(ox, yOf(lMax));
    ctx.lineTo(ox, oy);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(ox, oy, 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(234,88,12,0.85)';
    ctx.fill();
  }
  ctx.fillStyle = '#64748b';
  ctx.font = '11px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('w', pad.l + plotW * 0.5, h - 18);
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.fillText('L', pad.l - 6, pad.t + plotH * 0.5);
  ctx.font = '10px system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.fillText('0', pad.l - 4, yOf(0) - 2);
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.fillText('w*', xOf(wStar) - 6, yOf(0) - 2);
  ctx.restore();
}

function readerIcaseDrawLossByStep(canvas, losses) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const wCss = Math.max(200, Math.floor(canvas.getBoundingClientRect().width) || 720);
  const h = 150;
  canvas.width = Math.floor(wCss * dpr);
  canvas.height = Math.floor(h * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const W = wCss;
  const pad = { l: 40, r: 16, t: 8, b: 22 };
  const plotW = W - pad.l - pad.r;
  const plotH = h - pad.t - pad.b;
  ctx.clearRect(0, 0, W, h);
  const tMax = Math.max(losses.length - 1, 1);
  const lMax = Math.max(...losses) * 1.08 + 0.01;
  const xOfT = (t) => pad.l + (t / tMax) * plotW;
  const yL = (loss) => pad.t + (1 - loss / lMax) * plotH;
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(pad.l, pad.t, plotW, plotH);
  ctx.strokeStyle = 'rgba(148,163,184,0.3)';
  ctx.setLineDash([2, 4]);
  for (let i = 0; i <= 4; i += 1) {
    const y = pad.t + (plotH * (4 - i)) / 4;
    ctx.beginPath();
    ctx.moveTo(pad.l, y);
    ctx.lineTo(pad.l + plotW, y);
    ctx.stroke();
  }
  ctx.setLineDash([]);
  /**  step plot */
  ctx.beginPath();
  for (let i = 0; i < losses.length; i += 1) {
    const x = xOfT(i);
    const y = yL(losses[i]);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = '#1d39c4';
  ctx.lineWidth = 2;
  ctx.stroke();
  for (let i = 0; i < losses.length; i += 1) {
    const x = xOfT(i);
    const y = yL(losses[i]);
    ctx.beginPath();
    ctx.arc(x, y, 2.2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(47,84,235,0.9)';
    ctx.fill();
  }
  ctx.fillStyle = '#64748b';
  ctx.font = '10px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('迭代步 t', pad.l + plotW * 0.5, h - 16);
}

let readerIcaseOnResize = null;
function readerBindGradientToyPage() {
  if (readerIcaseOnResize) {
    window.removeEventListener('resize', readerIcaseOnResize);
    readerIcaseOnResize = null;
  }
  const redraw = () => {
    readerIcaseDrawGradientToy();
  };
  ['icaseEta', 'icaseW0', 'icaseN'].forEach((id) => {
    document.getElementById(id)?.addEventListener('input', redraw);
  });
  readerIcaseOnResize = redraw;
  window.addEventListener('resize', readerIcaseOnResize);
  setTimeout(() => {
    redraw();
  }, 0);
}

function readerOpenICase(caseId) {
  const u = READER_ICASE_UNITS.find((x) => x.id === caseId);
  if (!u) return;
  readerCloseLab();
  readerCloseQuizModal();
  readerClosePopovers();
  if (document.getElementById('readerAiDrawer')?.getAttribute('aria-hidden') === 'false') {
    readerToggleAi();
  }
  if (document.getElementById('readerNotesDrawer')?.getAttribute('aria-hidden') === 'false') {
    readerToggleNotes();
  }
  const tEl = document.getElementById('readerIcasePageTitle');
  if (tEl) tEl.textContent = u.title;
  const kEl = document.getElementById('readerIcasePageKicker');
  if (kEl) kEl.textContent = u.kicker || '交互案例';
  const root = document.getElementById('readerIcasePageRoot');
  if (caseId === 'gradient-toy' && root) {
    root.innerHTML = readerBuildGradientToyBodyHtml();
    readerBindGradientToyPage();
  } else if (root) {
    root.innerHTML = '<p class="reader-icase-page__empty">该案例未配置或暂不可用。</p>';
  }
  const page = document.getElementById('readerIcasePage');
  if (page) {
    page.classList.add('open');
    page.setAttribute('aria-hidden', 'false');
  }
  document.getElementById('readerIcasePageRoot')?.focus({ preventScroll: true });
}

function readerCloseICase() {
  if (readerIcaseOnResize) {
    window.removeEventListener('resize', readerIcaseOnResize);
    readerIcaseOnResize = null;
  }
  const page = document.getElementById('readerIcasePage');
  if (page) {
    page.classList.remove('open');
    page.setAttribute('aria-hidden', 'true');
  }
  const root = document.getElementById('readerIcasePageRoot');
  if (root) root.innerHTML = '';
}

let readerContext = { bookIdx: null, source: null, b: null, currentCid: null };
const readerNotesStore = [];

function firstReaderCid(nodes) {
  for (const n of nodes) {
    if (n.cid) return n.cid;
    if (n.children) {
      const c = firstReaderCid(n.children);
      if (c) return c;
    }
  }
  return null;
}

function readerOutlineHasCid(nodes, cid) {
  for (const n of nodes) {
    if (n.cid === cid) return true;
    if (n.children && readerOutlineHasCid(n.children, cid)) return true;
  }
  return false;
}

/** 打开阅读器时默认进入的章节（优先 r4「拓展阅读」，便于直接看到「测试与练习」板块） */
function readerDefaultEntryCid() {
  if (readerOutlineHasCid(READER_OUTLINE, 'r4')) return 'r4';
  return firstReaderCid(READER_OUTLINE);
}

/** goFnName：'readerGo' 阅读器目录；'teachGo' 教学模式教材窗 */
function renderReaderTocNodes(nodes, depth, goFnName) {
  const go = goFnName || 'readerGo';
  return nodes
    .map((node) => {
      if (node.cid) {
        const st = escAttr(node.title);
        const label = escAttr(node.title);
        const badges = readerTocFeatureBadgesHtml(node.cid);
        return `<div class="reader-toc-leaf" data-cid="${node.cid}" data-search="${st}" onclick="${go}('${node.cid}')"><span class="reader-toc-leaf-label">${label}</span>${badges}</div>`;
      }
      return `<div class="reader-toc-group open" data-depth="${depth}">
      <button type="button" class="reader-toc-head" onclick="readerToggleTocGroup(this)">
        <span class="reader-toc-chev">▾</span>
        <span class="reader-toc-head-text">${node.title}</span>
      </button>
      <div class="reader-toc-children">${renderReaderTocNodes(node.children, depth + 1, go)}</div>
    </div>`;
    })
    .join('');
}

function readerToggleTocGroup(btn) {
  const g = btn && btn.closest('.reader-toc-group');
  if (g) g.classList.toggle('open');
}

let _readerSelectionUiBound = false;
let _readerSelectionHideTimer = null;

function readerSelectionNodeInToolbar(node) {
  return !!(node && node.nodeType === 1 && (node.id === 'readerSelectionBar' || node.closest('#readerSelectionBar')));
}

function readerSelectionIsEditableNode(node) {
  let n = node;
  while (n) {
    if (n.nodeType === 1) {
      const el = n;
      const tag = el.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'BUTTON') return true;
      if (el.isContentEditable) return true;
    }
    n = n.parentNode;
  }
  return false;
}

function readerHideSelectionToolbar(clearSel) {
  const bar = document.getElementById('readerSelectionBar');
  if (bar) {
    bar.hidden = true;
    bar.removeAttribute('aria-hidden');
  }
  if (_readerSelectionHideTimer) {
    clearTimeout(_readerSelectionHideTimer);
    _readerSelectionHideTimer = null;
  }
  if (clearSel) {
    const sel = window.getSelection && window.getSelection();
    if (sel && sel.rangeCount) sel.removeAllRanges();
  }
}

function readerPositionSelectionBar(sel, main, bar) {
  if (!sel.rangeCount) return;
  const range = sel.getRangeAt(0).cloneRange();
  const rects = range.getClientRects();
  let r = rects.length ? rects[rects.length - 1] : range.getBoundingClientRect();
  if (!r || (r.width === 0 && r.height === 0)) {
    r = range.getBoundingClientRect();
  }
  const mw = main.clientWidth;
  const mh = main.clientHeight;
  const bw = bar.offsetWidth || 140;
  const bh = bar.offsetHeight || 120;
  const pad = 8;
  let left = r.right - main.getBoundingClientRect().left + 6;
  let top = r.top - main.getBoundingClientRect().top - 4;
  if (left + bw + pad > mw) left = Math.max(pad, r.left - main.getBoundingClientRect().left - bw - 6);
  if (top + bh + pad > mh) top = Math.max(pad, mh - bh - pad);
  if (top < pad) top = pad;
  bar.style.left = `${Math.round(left)}px`;
  bar.style.top = `${Math.round(top)}px`;
}

function readerSyncSelectionBar() {
  const ov = document.getElementById('readerOverlay');
  if (!ov || !ov.classList.contains('open')) {
    readerHideSelectionToolbar(false);
    return;
  }
  const main = document.getElementById('readerMain');
  const article = document.getElementById('readerArticle');
  const bar = document.getElementById('readerSelectionBar');
  if (!main || !article || !bar) return;
  const sel = window.getSelection && window.getSelection();
  if (!sel || !sel.rangeCount || sel.isCollapsed) {
    readerHideSelectionToolbar(false);
    return;
  }
  const range = sel.getRangeAt(0);
  if (!article.contains(range.commonAncestorContainer)) {
    readerHideSelectionToolbar(false);
    return;
  }
  if (readerSelectionIsEditableNode(range.commonAncestorContainer)) {
    readerHideSelectionToolbar(false);
    return;
  }
  const t = (sel.toString() || '').trim();
  if (!t) {
    readerHideSelectionToolbar(false);
    return;
  }
  bar.hidden = false;
  bar.setAttribute('aria-hidden', 'false');
  requestAnimationFrame(() => readerPositionSelectionBar(sel, main, bar));
}

function readerBindSelectionToolbarOnce() {
  if (_readerSelectionUiBound) return;
  _readerSelectionUiBound = true;
  document.addEventListener(
    'mouseup',
    (e) => {
      const ov = document.getElementById('readerOverlay');
      if (!ov || !ov.classList.contains('open')) return;
      if (readerSelectionNodeInToolbar(e.target)) return;
      const main = document.getElementById('readerMain');
      if (!main || !main.contains(e.target)) return;
      window.setTimeout(readerSyncSelectionBar, 0);
    },
    true
  );
  document.addEventListener('selectionchange', () => {
    const ov = document.getElementById('readerOverlay');
    if (!ov || !ov.classList.contains('open')) return;
    if (_readerSelectionHideTimer) clearTimeout(_readerSelectionHideTimer);
    _readerSelectionHideTimer = window.setTimeout(readerSyncSelectionBar, 40);
  });
  document.addEventListener(
    'mousedown',
    (e) => {
      const bar = document.getElementById('readerSelectionBar');
      if (!bar || bar.hidden) return;
      if (readerSelectionNodeInToolbar(e.target)) return;
      readerHideSelectionToolbar(false);
    },
    true
  );
  document.getElementById('readerMain')?.addEventListener(
    'scroll',
    () => {
      const bar = document.getElementById('readerSelectionBar');
      if (bar && !bar.hidden) readerHideSelectionToolbar(false);
    },
    { passive: true }
  );
}

function readerWrapRangeHighlight(range) {
  const span = document.createElement('span');
  span.className = 'reader-text-hl';
  try {
    range.surroundContents(span);
  } catch (_) {
    const contents = range.extractContents();
    if (!contents.textContent || !String(contents.textContent).trim()) {
      return false;
    }
    span.appendChild(contents);
    range.insertNode(span);
  }
  return true;
}

function readerSelectionActionHighlight() {
  const article = document.getElementById('readerArticle');
  if (!article) return;
  const sel = window.getSelection && window.getSelection();
  if (!sel || !sel.rangeCount) return;
  const range = sel.getRangeAt(0);
  if (!article.contains(range.commonAncestorContainer)) return;
  const t = (sel.toString() || '').trim();
  if (!t) return;
  if (range.commonAncestorContainer.nodeType === 1 && range.commonAncestorContainer.closest('.reader-text-hl')) {
    showProfileToast('已在高亮内');
    readerHideSelectionToolbar(true);
    return;
  }
  const ok = readerWrapRangeHighlight(range);
  readerHideSelectionToolbar(true);
  showProfileToast(ok ? '已高亮选中文本（演示）' : '无法高亮该选区');
}

function readerSelectionActionCopy() {
  const sel = window.getSelection && window.getSelection();
  const t = sel ? String(sel.toString() || '').trim() : '';
  readerHideSelectionToolbar(true);
  if (!t) return;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(t).then(
      () => showProfileToast('复制成功'),
      () => showProfileToast('复制失败，请手动复制')
    );
  } else {
    showProfileToast('浏览器不支持自动复制');
  }
}

function readerSelectionActionNote() {
  const sel = window.getSelection && window.getSelection();
  const t = sel ? String(sel.toString() || '').trim() : '';
  readerHideSelectionToolbar(true);
  if (!t) return;
  readerCloseToolSlots();
  const ov = document.getElementById('readerOverlay');
  if (ov && !ov.classList.contains('notes-open')) readerToggleNotes();
  const ta = document.getElementById('readerNotesTextarea');
  if (ta) {
    const prefix = `「${t.slice(0, 400)}${t.length > 400 ? '…' : ''}」\n\n`;
    ta.value = prefix + (ta.value || '');
    ta.focus();
    ta.setSelectionRange(ta.value.length, ta.value.length);
  }
}

function readerSelectionActionAi() {
  const sel = window.getSelection && window.getSelection();
  const t = sel ? String(sel.toString() || '').trim() : '';
  readerHideSelectionToolbar(true);
  if (!t) return;
  readerCloseToolSlots();
  const ov = document.getElementById('readerOverlay');
  if (ov && !ov.classList.contains('ai-open')) readerToggleAi();
  const inp = document.getElementById('readerAiInput');
  if (inp) {
    const q = `请结合本课上下文解读：${t.slice(0, 600)}${t.length > 600 ? '…' : ''}`;
    inp.value = q;
    inp.focus();
  }
}

function readerGo(cid, opts) {
  readerHideSelectionToolbar(false);
  readerContext.currentCid = cid;
  document.querySelectorAll('#readerTocTree .reader-toc-leaf').forEach((el) => {
    el.classList.toggle('is-active', el.dataset.cid === cid);
  });
  const el = document.getElementById('readerArticle');
  if (el) el.innerHTML = buildReaderArticleHtml(cid, readerContext.b);
  if (!opts || !opts.noScroll) {
    document.getElementById('readerMain')?.scrollTo(0, 0);
  }
}

function buildReaderArticleHtml(cid, b) {
  const bt = b ? `${b.t} · ${b.s}` : '本教材';
  const blocks = {
    r1: `<div class="reader-block"><h2>导读与关键概念</h2><p>本课来自「${bt}」。请带着三个问题阅读：本课要解决什么岗位或项目问题？用到了哪类数据与模型？可能带来哪些伦理或安全风险？</p><p>建议先浏览小结与拓展资源，再回看术语表，在教材旁注中写下你的「可执行行动」。</p></div>`,
    r2: `<div class="reader-block"><h2>案例与拓展阅读</h2><p>智能辅导、代码补全、医学影像辅助、工业质检等，都是将统计学习与领域知识结合的实际场景。请思考：当模型输出与教师/工程师判断不一致时，应如何建立复核与反馈闭环。</p>
      <figure class="reader-figure"><img src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80" alt="代码与数据" loading="lazy"><figcaption class="reader-figcap">图 · 计算与数据（示意）</figcaption></figure>
      <div class="reader-video-block">
        <div class="reader-video-wrap">
          <video class="reader-video-el" controls playsinline preload="metadata" poster="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&q=80">
            <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4">
          </video>
        </div>
        <p class="reader-video-cap">配套微课 · 案例导读（演示视频，支持播放/暂停与进度条）</p>
      </div>
      <div class="reader-gallery"><img src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80" alt="" loading="lazy"><img src="https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&q=80" alt="" loading="lazy"></div>
      </div>`,
    r5: `<div class="reader-block">
        <h2>随堂实训与互动</h2>
        <p>本课在教材正文中以<strong>板块</strong>形式提供<strong>在线实训</strong>。你可从下方「实训」卡进入全屏操作页，完成与知识点对应的动手练习。首个示范为 <strong>体验人工智能：图片识别物体</strong>，帮助你把「从图像到预测标签、置信度」的直觉与课堂概念对应起来（演示为浏览器内模拟过程，不调用外网大模型）。</p>
      </div>
      <div class="reader-lab-below" aria-label="本课在线实训">
        ${READER_LAB_UNITS.map((u) => readerLabUnitHtml(u)).join('')}
      </div>`,
    r6: `<div class="reader-block">
        <h2>交互案例</h2>
        <p>下列板块为<strong>可在线体验的交互式案例</strong>：在浏览器中调参数、看曲线与数据变化。首个示例为<strong>学习率、初值、迭代与损失</strong>的直观演示，与「从误差到更新」的算法思维衔接；后续亦可扩展更多可交互算法示例。</p>
      </div>
      <div class="reader-icase-below" aria-label="本课交互案例">
        ${READER_ICASE_UNITS.map((u) => readerICaseUnitHtml(u)).join('')}
      </div>`,
    r3: `<div class="reader-block"><h2>综合练习</h2><p>试比较「规则系统」与「从数据学习」的适用条件；各举一个在校园生活中可以合规收集数据的例子，并说明你会如何脱敏与存储。</p></div>`,
    r4: `<div class="reader-r4-split">
      <div class="reader-block reader-ext-read">
        <h2>拓展阅读与练习</h2>
        <p>阅读配套文章：从感知机到深度网络的技术脉络。思考：过拟合、数据偏差与提示攻击分别会在教学或实训中造成什么后果？可结合本组项目讨论缓解策略。</p>
        <div class="reader-video-block">
          <div class="reader-video-wrap">
            <video class="reader-video-el" controls playsinline preload="metadata" poster="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80">
              <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4">
            </video>
          </div>
          <p class="reader-video-cap">拓展素材 · 神经网络与实训安全（演示视频）</p>
        </div>
      </div>
      <div class="reader-practice-below" aria-label="拓展阅读之下的测评区">
        ${READER_PRACTICE_SLOTS.map((s) => readerPracticeSectionHtml(b, s)).join('')}
      </div>
      ${readerSportsExperimentSectionHtml(b)}
    </div>`,
  };
  return blocks[cid] || `<div class="reader-block"><p>本节暂无演示内容。</p></div>`;
}

function readerQuizNormalizeText(s) {
  return String(s || '')
    .trim()
    .toLowerCase()
    .replace(/[\s\u3000，。、；：""''（）()．·]/g, '');
}

function readerQuizGradeFill(user, acceptedList) {
  const u = readerQuizNormalizeText(user);
  if (!u) return false;
  return acceptedList.some((a) => {
    const t = readerQuizNormalizeText(a);
    return t && (u === t || u.includes(t));
  });
}

function readerQuizGradeShort(user, q) {
  const raw = (user || '').trim();
  if (raw.length < (q.minLen || 15)) return false;
  const low = raw.toLowerCase();
  const kws = q.keywords || [];
  let hits = 0;
  for (const kw of kws) {
    if (low.includes(String(kw).toLowerCase())) hits += 1;
  }
  return hits >= 2 || (raw.length >= (q.minLen || 25) && hits >= 1);
}

function readerQuizTypeLabel(type) {
  const m = { choice: '选择题', fill: '填空题', tf: '判断题', short: '简答题' };
  return m[type] || type;
}

function readerQuizPickChoice(btn) {
  const wrap = btn.closest('.reader-q-choices');
  if (!wrap) return;
  wrap.querySelectorAll('.reader-q-choice').forEach((b) => b.classList.remove('is-on'));
  btn.classList.add('is-on');
  readerQuizAfterAnswerChange();
}

function readerQuizPickTf(btn, qid, val) {
  const row = btn.closest('.reader-q-tf');
  if (!row) return;
  row.querySelectorAll('.reader-q-tf-btn').forEach((b) => b.classList.remove('is-on'));
  btn.classList.add('is-on');
  row.dataset.picked = val;
  readerQuizAfterAnswerChange();
}

function readerQuizAfterAnswerChange() {
  if (readerQuizPhase !== 'questions') return;
  readerQuizSyncCurrentToDraft();
  readerQuizUpdateSheet();
}

function readerQuizOnInputChanged() {
  readerQuizAfterAnswerChange();
}

/** 将当前屏这一题的作答写入草稿 */
function readerQuizSyncCurrentToDraft() {
  const quiz = readerGetCurrentQuiz();
  if (!quiz || readerQuizPhase !== 'questions') return;
  const q = quiz.questions[readerQuizStepIndex];
  if (!q) return;
  if (q.type === 'choice') {
    const on = document.querySelector(`.reader-q-choice.is-on[data-qid="${q.id}"]`);
    if (on) readerQuizDraftAnswers[q.id] = parseInt(on.dataset.idx, 10);
    else delete readerQuizDraftAnswers[q.id];
  } else if (q.type === 'fill') {
    const inp = document.getElementById(`reader-q-fill-${q.id}`);
    const t = inp ? String(inp.value).trim() : '';
    if (t) readerQuizDraftAnswers[q.id] = inp.value;
    else delete readerQuizDraftAnswers[q.id];
  } else if (q.type === 'tf') {
    const row = document.querySelector(`.reader-q-tf[data-qid="${q.id}"]`);
    const p = row && row.dataset.picked;
    if (p === 'true') readerQuizDraftAnswers[q.id] = true;
    else if (p === 'false') readerQuizDraftAnswers[q.id] = false;
    else delete readerQuizDraftAnswers[q.id];
  } else if (q.type === 'short') {
    const ta = document.getElementById(`reader-q-short-${q.id}`);
    const t = ta ? String(ta.value).trim() : '';
    if (t) readerQuizDraftAnswers[q.id] = ta.value;
    else delete readerQuizDraftAnswers[q.id];
  }
}

function readerQuizApplyDraftToDom(q) {
  const v = readerQuizDraftAnswers[q.id];
  if (v === undefined) return;
  if (q.type === 'choice' && typeof v === 'number' && !Number.isNaN(v)) {
    const btn = document.querySelector(`.reader-q-choice[data-qid="${q.id}"][data-idx="${v}"]`);
    if (btn) btn.classList.add('is-on');
  } else if (q.type === 'fill') {
    const inp = document.getElementById(`reader-q-fill-${q.id}`);
    if (inp) inp.value = v;
  } else if (q.type === 'tf' && (v === true || v === false)) {
    const row = document.querySelector(`.reader-q-tf[data-qid="${q.id}"]`);
    if (row) {
      row.dataset.picked = String(v);
      row.querySelectorAll('.reader-q-tf-btn').forEach((b) => b.classList.remove('is-on'));
      const btn = row.querySelector(`.reader-q-tf-btn[data-val="${v}"]`);
      btn?.classList.add('is-on');
    }
  } else if (q.type === 'short') {
    const ta = document.getElementById(`reader-q-short-${q.id}`);
    if (ta) ta.value = v;
  }
}

function readerQuizIsDraftAnswered(q) {
  const v = readerQuizDraftAnswers[q.id];
  if (q.type === 'choice') return v != null && !Number.isNaN(v);
  if (q.type === 'tf') return v === true || v === false;
  if (q.type === 'fill' || q.type === 'short') return String(v || '').trim().length > 0;
  return false;
}

function readerRenderQuizQuestionForm(q, index) {
  const n = index + 1;
  const lab = readerQuizTypeLabel(q.type);
  if (q.type === 'choice') {
    return `<div class="reader-q-item" data-qid="${q.id}">
      <div class="reader-q-label"><span class="reader-q-num">${n}</span><span class="reader-q-type">${lab}</span></div>
      <p class="reader-q-stem">${escAttr(q.stem)}</p>
      <div class="reader-q-choices">
        ${q.options
          .map(
            (opt, j) =>
              `<button type="button" class="reader-q-choice" data-qid="${q.id}" data-idx="${j}" onclick="readerQuizPickChoice(this)">${escAttr(opt)}</button>`
          )
          .join('')}
      </div>
    </div>`;
  }
  if (q.type === 'fill') {
    return `<div class="reader-q-item" data-qid="${q.id}">
      <div class="reader-q-label"><span class="reader-q-num">${n}</span><span class="reader-q-type">${lab}</span></div>
      <p class="reader-q-stem">${escAttr(q.stem)}</p>
      <input type="text" class="reader-q-fill" id="reader-q-fill-${q.id}" placeholder="请填写答案" autocomplete="off" oninput="readerQuizOnInputChanged()">
    </div>`;
  }
  if (q.type === 'tf') {
    return `<div class="reader-q-item" data-qid="${q.id}">
      <div class="reader-q-label"><span class="reader-q-num">${n}</span><span class="reader-q-type">${lab}</span></div>
      <p class="reader-q-stem">${escAttr(q.stem)}</p>
      <div class="reader-q-tf" data-qid="${q.id}" data-picked="">
        <button type="button" class="reader-q-tf-btn" data-val="true" onclick="readerQuizPickTf(this,'${q.id}', 'true')">正确</button>
        <button type="button" class="reader-q-tf-btn" data-val="false" onclick="readerQuizPickTf(this,'${q.id}', 'false')">错误</button>
      </div>
    </div>`;
  }
  if (q.type === 'short') {
    return `<div class="reader-q-item" data-qid="${q.id}">
      <div class="reader-q-label"><span class="reader-q-num">${n}</span><span class="reader-q-type">${lab}</span></div>
      <p class="reader-q-stem">${escAttr(q.stem)}</p>
      <textarea class="reader-q-short" id="reader-q-short-${q.id}" rows="4" placeholder="请输入作答内容" oninput="readerQuizOnInputChanged()"></textarea>
    </div>`;
  }
  return '';
}

function readerCollectQuizAnswers() {
  readerQuizSyncCurrentToDraft();
  const out = {};
  const quiz = readerGetCurrentQuiz();
  if (!quiz) return out;
  for (const q of quiz.questions) {
    const v = readerQuizDraftAnswers[q.id];
    if (q.type === 'choice') {
      out[q.id] = v == null || Number.isNaN(v) ? null : v;
    } else if (q.type === 'fill' || q.type === 'short') {
      out[q.id] = v != null ? String(v) : '';
    } else if (q.type === 'tf') {
      out[q.id] = v === true || v === false ? v : null;
    }
  }
  return out;
}

function readerQuizLayoutHtml() {
  return `<div class="reader-quiz-layout">
    <div class="reader-quiz-main-col">
      <div class="reader-quiz-step-hint" id="readerQuizStepHint"></div>
      <div class="reader-quiz-step-inner" id="readerQuizStepInner"></div>
    </div>
    <aside class="reader-quiz-sheet-col" aria-label="答题卡">
      <div class="reader-quiz-sheet-head">答题卡</div>
      <p class="reader-quiz-sheet-progress" id="readerQuizSheetProgress"></p>
      <div class="reader-quiz-sheet-grid" id="readerQuizSheetGrid"></div>
    </aside>
  </div>`;
}

function readerQuizUpdateSheet() {
  const quiz = readerGetCurrentQuiz();
  const grid = document.getElementById('readerQuizSheetGrid');
  const prog = document.getElementById('readerQuizSheetProgress');
  if (!quiz || !grid) return;
  readerQuizSyncCurrentToDraft();
  let answered = 0;
  for (const q of quiz.questions) {
    if (readerQuizIsDraftAnswered(q)) answered += 1;
  }
  if (prog) {
    prog.textContent = `共 ${quiz.questions.length} 题 · 已答 ${answered} 题`;
  }
  grid.innerHTML = quiz.questions
    .map((q, i) => {
      const ok = readerQuizIsDraftAnswered(q);
      const cur = i === readerQuizStepIndex;
      let cls = 'reader-quiz-sheet-pill';
      if (cur) cls += ' is-current';
      if (ok) cls += ' is-answered';
      const ac = cur ? ' aria-current="step"' : '';
      return `<button type="button" class="${cls}" data-i="${i}" aria-label="第 ${i + 1} 题${ok ? '，已作答' : '，未作答'}${cur ? '，当前' : ''}"${ac} onclick="readerQuizJumpToStep(${i})">${i + 1}</button>`;
    })
    .join('');
}

function readerQuizUpdateFoot() {
  const quiz = readerGetCurrentQuiz();
  const foot = document.getElementById('readerQuizFoot');
  if (!quiz || !foot) return;
  const total = quiz.questions.length;
  const isFirst = readerQuizStepIndex === 0;
  const isLast = readerQuizStepIndex === total - 1;
  const prevDis = isFirst ? ' disabled' : '';
  const primaryLabel = isLast ? '提交并生成报告' : '下一题';
  const primaryFn = isLast ? 'readerSubmitQuizModal()' : 'readerQuizGoNext()';
  foot.innerHTML = `<button type="button" class="reader-quiz-btn" onclick="readerCloseQuizModal()">返回阅读</button>
    <button type="button" class="reader-quiz-btn" onclick="readerQuizGoPrev()"${prevDis}>上一题</button>
    <button type="button" class="reader-quiz-btn reader-quiz-btn--primary" onclick="${primaryFn}">${primaryLabel}</button>`;
}

function readerQuizRenderCurrentStep() {
  const quiz = readerGetCurrentQuiz();
  const inner = document.getElementById('readerQuizStepInner');
  const hint = document.getElementById('readerQuizStepHint');
  if (!quiz || !inner) return;
  const q = quiz.questions[readerQuizStepIndex];
  const total = quiz.questions.length;
  if (!q) return;
  if (hint) hint.textContent = `第 ${readerQuizStepIndex + 1} / ${total} 题 · ${readerQuizTypeLabel(q.type)}`;
  inner.innerHTML = readerRenderQuizQuestionForm(q, readerQuizStepIndex);
  readerQuizApplyDraftToDom(q);
  readerQuizUpdateSheet();
  readerQuizUpdateFoot();
}

function readerQuizGoNext() {
  const quiz = readerGetCurrentQuiz();
  if (!quiz || readerQuizPhase !== 'questions') return;
  readerQuizSyncCurrentToDraft();
  if (readerQuizStepIndex >= quiz.questions.length - 1) return;
  readerQuizStepIndex += 1;
  readerQuizRenderCurrentStep();
}

function readerQuizGoPrev() {
  const quiz = readerGetCurrentQuiz();
  if (!quiz || readerQuizPhase !== 'questions') return;
  if (readerQuizStepIndex <= 0) return;
  readerQuizSyncCurrentToDraft();
  readerQuizStepIndex -= 1;
  readerQuizRenderCurrentStep();
}

function readerQuizJumpToStep(i) {
  const quiz = readerGetCurrentQuiz();
  if (!quiz || readerQuizPhase !== 'questions') return;
  if (i < 0 || i >= quiz.questions.length || i === readerQuizStepIndex) return;
  readerQuizSyncCurrentToDraft();
  readerQuizStepIndex = i;
  readerQuizRenderCurrentStep();
}

function readerGradeQuizSession(answers) {
  const details = [];
  let score = 0;
  const quiz = readerGetCurrentQuiz();
  if (!quiz) return { score: 0, total: 0, details: [] };
  const total = quiz.questions.length;
  for (const q of quiz.questions) {
    const u = answers[q.id];
    let ok = false;
    let displayUser = '';
    let displayCorrect = '';
    if (q.type === 'choice') {
      ok = u === q.correctIndex;
      displayUser = u == null ? '（未作答）' : q.options[u] || '（无效选项）';
      displayCorrect = q.options[q.correctIndex];
    } else if (q.type === 'fill') {
      ok = readerQuizGradeFill(u, q.answers);
      displayUser = (u && String(u).trim()) || '（未作答）';
      displayCorrect = q.answers.join(' / ');
    } else if (q.type === 'tf') {
      ok = u === q.correct;
      displayUser =
        u === null ? '（未作答）' : u ? '正确' : '错误';
      displayCorrect = q.correct ? '正确' : '错误';
    } else if (q.type === 'short') {
      ok = readerQuizGradeShort(u, q);
      displayUser = (u && String(u).trim()) || '（未作答）';
      displayCorrect = q.sampleAnswer;
    }
    if (ok) score += 1;
    details.push({
      q,
      ok,
      userLabel: displayUser,
      correctLabel: displayCorrect,
    });
  }
  return { score, total, details };
}

/** 演示用：生成一套「错一题」的判分结果，用于无存档时的预设已完成态与查看报告 */
function readerBuildDemoReportResult(slotId) {
  const slot = READER_PRACTICE_SLOTS.find((s) => s.id === slotId);
  if (!slot) return null;
  const quiz = slot.quiz;
  const answers = {};
  quiz.questions.forEach((q, i) => {
    if (i === 0) {
      if (q.type === 'choice') answers[q.id] = q.correctIndex === 0 ? 1 : 0;
      else if (q.type === 'fill') answers[q.id] = '（演示错题）';
      else if (q.type === 'tf') answers[q.id] = !q.correct;
      else answers[q.id] = 'x';
    } else if (q.type === 'choice') {
      answers[q.id] = q.correctIndex;
    } else if (q.type === 'fill') {
      answers[q.id] = q.answers[0];
    } else if (q.type === 'tf') {
      answers[q.id] = q.correct;
    } else {
      answers[q.id] = q.sampleAnswer || '演示作答';
    }
  });
  return readerGradeQuizSession(answers);
}

function readerQuizAiSummary(score, total, details) {
  const ratio = total ? score / total : 0;
  const weak = details.filter((d) => !d.ok).map((d) => readerQuizTypeLabel(d.q.type));
  const weakHint = weak.length ? `建议重点回顾：${[...new Set(weak)].join('、')}。` : '各题型表现均衡，可继续结合教材案例做小项目或拓展练习。';
  let tone =
    ratio >= 0.85
      ? '整体掌握扎实，能理解本节的原理要点与在实训中的应用场景。'
      : ratio >= 0.5
        ? '已掌握部分要点，可针对错题回到相关章节，对照操作步骤与术语再练一遍。'
        : '基础可继续夯实，建议先画概念关系图或复现实验，再补做同类题巩固。';
  const pct = total ? Math.round((score / total) * 100) : 0;
  return `综合 AI 评价（演示）：本题组正确率 ${pct}%（${score}/${total} 题）。${tone}${weakHint}正式环境中可接入大模型，结合组群学情生成个性化学习路径与错题再练。`;
}

function readerRenderQuizReport(result) {
  const { score, total, details } = result;
  const aiText = readerQuizAiSummary(score, total, details);
  const pct = total ? Math.round((score / total) * 100) : 0;
  const rows = details
    .map((d, i) => {
      const tag = d.ok
        ? '<span class="reader-quiz-tag-ok">正确</span>'
        : '<span class="reader-quiz-tag-bad">待加强</span>';
      const u = escAttr(String(d.userLabel));
      const c = escAttr(String(d.correctLabel));
      const ex = escAttr(d.q.explain);
      const cardMod = d.ok ? ' reader-quiz-qreport--ok' : ' reader-quiz-qreport--miss';
      return `<div class="reader-quiz-qreport${cardMod}">
        <div class="reader-quiz-qreport-head">
          <span class="reader-quiz-qreport-num">${i + 1}</span>
          <div class="reader-quiz-qreport-head-text">
            <div class="reader-quiz-qreport-title">${readerQuizTypeLabel(d.q.type)} · 第 ${i + 1} 题 ${tag}</div>
          </div>
        </div>
        <div class="reader-quiz-qreport-body">
          <div class="reader-quiz-qreport-row"><span class="reader-quiz-qreport-k">你的答案</span><span class="reader-quiz-qreport-v">${u}</span></div>
          <div class="reader-quiz-qreport-row"><span class="reader-quiz-qreport-k">参考答案</span><span class="reader-quiz-qreport-v">${c}</span></div>
          <div class="reader-quiz-parse"><span class="reader-quiz-parse-k">解析</span>${ex}</div>
        </div>
      </div>`;
    })
    .join('');
  return `<div class="reader-quiz-report-wrap">
    <div class="reader-quiz-report-hero">
      <div class="reader-quiz-report-donut" style="--acc:${pct}">
        <div class="reader-quiz-report-donut-hole">
          <span class="reader-quiz-report-donut-pct">${pct}<span class="reader-quiz-report-donut-unit">%</span></span>
          <span class="reader-quiz-report-donut-lab">正确率</span>
        </div>
      </div>
      <div class="reader-quiz-report-hero-text">
        <div class="reader-quiz-report-hero-kicker">测评报告</div>
        <h3 class="reader-quiz-report-hero-title">本次作答概览</h3>
        <p class="reader-quiz-report-hero-sub">共 <strong>${total}</strong> 题 · 答对 <strong>${score}</strong> 题</p>
      </div>
    </div>
    <div class="reader-quiz-report-ai-card">
      <div class="reader-quiz-report-ai-card-head">
        <span class="reader-quiz-report-ai-spark" aria-hidden="true"></span>
        <span class="reader-quiz-report-ai-label">AI 学习评价</span>
      </div>
      <p class="reader-quiz-report-ai">${escAttr(aiText)}</p>
    </div>
  </div>
  <div class="reader-quiz-report-detail-head">逐题解析</div>
  ${rows}`;
}

function readerOpenQuizModal(slotId) {
  if (slotId && READER_PRACTICE_SLOTS.some((s) => s.id === slotId)) {
    readerActiveQuizSlot = slotId;
  } else {
    readerActiveQuizSlot = 'a';
  }
  const qz = readerGetCurrentQuiz();
  const page = document.getElementById('readerQuizPage');
  const body = document.getElementById('readerQuizBody');
  const foot = document.getElementById('readerQuizFoot');
  const sub = document.getElementById('readerQuizSub');
  const title = document.getElementById('readerQuizTitle');
  if (!qz || !page || !body || !foot) return;
  if (title) title.textContent = qz.title;
  if (sub) sub.textContent = qz.subtitle;
  readerQuizPhase = 'questions';
  readerQuizStepIndex = 0;
  readerQuizDraftAnswers = {};
  body.innerHTML = readerQuizLayoutHtml();
  readerQuizRenderCurrentStep();
  page.classList.add('open');
  page.setAttribute('aria-hidden', 'false');
  body.focus({ preventScroll: true });
}

function readerCloseQuizModal() {
  const page = document.getElementById('readerQuizPage');
  if (!page) return;
  page.classList.remove('open');
  page.setAttribute('aria-hidden', 'true');
  readerQuizPhase = 'idle';
  readerQuizStepIndex = 0;
  readerQuizDraftAnswers = {};
}

/** 已完成：从本地存档打开最近一次答题报告（无逐题存档时仅展示正确率说明） */
function readerOpenSavedReport(slotId) {
  if (slotId && READER_PRACTICE_SLOTS.some((s) => s.id === slotId)) {
    readerActiveQuizSlot = slotId;
  } else {
    readerActiveQuizSlot = 'a';
  }
  const b = readerContext.b;
  if (!b) {
    showProfileToast('请先打开教材阅读');
    return;
  }
  const comp = readerGetQuizCompletion(b, slotId);
  if (!comp || !comp.done) {
    showProfileToast('暂无答题报告');
    return;
  }
  let result = comp.report;
  if (!result && comp.demoPreset && slotId === READER_DEMO_PRESET_COMPLETED_SLOT) {
    result = readerBuildDemoReportResult(slotId);
  }
  const qz = readerGetQuizBySlot(readerActiveQuizSlot);
  const page = document.getElementById('readerQuizPage');
  const body = document.getElementById('readerQuizBody');
  const foot = document.getElementById('readerQuizFoot');
  const title = document.getElementById('readerQuizTitle');
  const sub = document.getElementById('readerQuizSub');
  if (!qz || !page || !body || !foot) return;
  if (title) title.textContent = qz.title;
  if (sub) sub.textContent = qz.subtitle;
  readerQuizPhase = 'report';
  const sid = readerActiveQuizSlot;
  if (result) {
    body.innerHTML = readerRenderQuizReport(result);
  } else {
    const sc = comp.score != null ? comp.score : '—';
    const tot = comp.total != null ? comp.total : '—';
    const legacyPct =
      sc !== '—' && tot !== '—' && Number.isFinite(Number(sc)) && Number.isFinite(Number(tot)) && Number(tot) > 0
        ? Math.round((Number(sc) / Number(tot)) * 100)
        : null;
    body.innerHTML = `<div class="reader-quiz-report-wrap">
      <div class="reader-quiz-report-hero reader-quiz-report-hero--simple">
        <div class="reader-quiz-report-donut" style="--acc:${legacyPct != null ? legacyPct : 0}">
          <div class="reader-quiz-report-donut-hole">
            <span class="reader-quiz-report-donut-pct">${legacyPct != null ? legacyPct : '—'}${legacyPct != null ? '<span class="reader-quiz-report-donut-unit">%</span>' : ''}</span>
            <span class="reader-quiz-report-donut-lab">正确率</span>
          </div>
        </div>
        <div class="reader-quiz-report-hero-text">
          <div class="reader-quiz-report-hero-kicker">答题报告</div>
          <h3 class="reader-quiz-report-hero-title">答题历史</h3>
          <p class="reader-quiz-report-hero-sub">答对 <strong>${sc}</strong> / <strong>${tot}</strong> 题</p>
        </div>
      </div>
      <div class="reader-quiz-report-ai-card reader-quiz-report-ai-card--muted">
        <p class="reader-quiz-report-ai">暂无逐题解析存档。可点击「再测一次」重新作答以生成完整报告与 AI 评价。</p>
      </div>
    </div>`;
  }
  foot.innerHTML = `<button type="button" class="reader-quiz-btn" onclick="readerCloseQuizModal()">返回阅读</button>
    <button type="button" class="reader-quiz-btn reader-quiz-btn--primary" onclick="readerOpenQuizModal('${sid}')">再测一次</button>`;
  page.classList.add('open');
  page.setAttribute('aria-hidden', 'false');
  body.focus({ preventScroll: true });
}

function readerSubmitQuizModal() {
  if (readerQuizPhase !== 'questions') return;
  const qz = readerGetCurrentQuiz();
  if (!qz) return;
  const answers = readerCollectQuizAnswers();
  const missing = qz.questions.some((q) => {
    const v = answers[q.id];
    if (q.type === 'choice') return v == null || Number.isNaN(v);
    if (q.type === 'tf') return v !== true && v !== false;
    if (q.type === 'fill' || q.type === 'short') return !String(v || '').trim();
    return false;
  });
  if (missing) {
    showProfileToast('请完成全部题目后再提交');
    return;
  }
  const result = readerGradeQuizSession(answers);
  readerSaveQuizCompletion(readerContext.b, result, readerActiveQuizSlot);
  const body = document.getElementById('readerQuizBody');
  const foot = document.getElementById('readerQuizFoot');
  const slot = readerActiveQuizSlot;
  if (body) body.innerHTML = readerRenderQuizReport(result);
  if (foot) {
    foot.innerHTML = `<button type="button" class="reader-quiz-btn" onclick="readerCloseQuizModal()">返回阅读</button>
      <button type="button" class="reader-quiz-btn reader-quiz-btn--primary" onclick="readerOpenQuizModal('${slot}')">再测一次</button>`;
  }
  readerQuizPhase = 'report';
  if (readerContext.currentCid === 'r4') {
    readerGo('r4', { noScroll: true });
  }
}

function readerQuizOnKeydown(ev) {
  if (ev.key !== 'Escape') return;
  if (document.getElementById('readerQuizPage')?.classList.contains('open')) {
    readerCloseQuizModal();
  }
}
document.addEventListener('keydown', readerQuizOnKeydown);

const AV_MODE_PROGRESS_PREFIX = 'sc-av-done-';
const AV_SAMPLE_VIDEOS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
];
const AV_SAMPLE_AUDIO = 'https://www.w3schools.com/html/horse.mp3';

function avProgressStorageKey(b) {
  return `${AV_MODE_PROGRESS_PREFIX}${libBookKey(b)}`;
}

function avLoadDoneSet(b) {
  try {
    const raw = localStorage.getItem(avProgressStorageKey(b));
    if (!raw) return new Set();
    const o = JSON.parse(raw);
    return new Set(Array.isArray(o.done) ? o.done : []);
  } catch (_) {
    return new Set();
  }
}

function avSaveDoneSet(b, set) {
  localStorage.setItem(avProgressStorageKey(b), JSON.stringify({ done: [...set] }));
}

function avBuildPoints(lessonTitle, sub) {
  const s = sub || '本课程';
  return [
    `${lessonTitle}：核心概念与关键要点梳理`,
    `${s}：与岗位能力的衔接与应用场景`,
    '规范操作、安全意识与拓展阅读建议',
  ];
}

function avDefaultCurriculum(sub) {
  const s = sub || '课程';
  return [
    {
      id: 'u-d0',
      title: '第一单元 导学',
      lessons: [
        {
          id: 'avl-d-0',
          title: '课程导读',
          videoUrl: AV_SAMPLE_VIDEOS[0],
          audioUrl: AV_SAMPLE_AUDIO,
          points: avBuildPoints('课程导读', s),
        },
        {
          id: 'avl-d-1',
          title: '学习方法与资源',
          videoUrl: AV_SAMPLE_VIDEOS[1],
          audioUrl: AV_SAMPLE_AUDIO,
          points: avBuildPoints('学习方法与资源', s),
        },
      ],
    },
    {
      id: 'u-d1',
      title: '第二单元 核心内容',
      lessons: [
        {
          id: 'avl-d-2',
          title: '关键知识点串讲',
          videoUrl: AV_SAMPLE_VIDEOS[0],
          audioUrl: AV_SAMPLE_AUDIO,
          points: avBuildPoints('关键知识点串讲', s),
        },
      ],
    },
  ];
}

function buildAvCurriculumForBook(b) {
  const sub = b && b.sub;
  const toc = sub && TOC[sub] ? TOC[sub] : null;
  const units = [];
  let vidI = 0;
  if (toc && toc.length) {
    toc.forEach((unit, ui) => {
      const lessons = (unit.ls || []).map((title, li) => {
        const id = `avl-${ui}-${li}`;
        const videoUrl = AV_SAMPLE_VIDEOS[vidI++ % AV_SAMPLE_VIDEOS.length];
        return {
          id,
          title,
          videoUrl,
          audioUrl: AV_SAMPLE_AUDIO,
          points: avBuildPoints(title, sub),
        };
      });
      if (lessons.length) units.push({ id: `u-${ui}`, title: unit.u, lessons });
    });
  }
  if (!units.length) return avDefaultCurriculum(sub);
  return units;
}

let avModeContext = {
  book: null,
  tab: 'video',
  units: [],
  selectedLessonId: null,
};

function avFlatLessons(units) {
  const out = [];
  for (const u of units || []) {
    for (const l of u.lessons || []) out.push(l);
  }
  return out;
}

function avFindLesson(lessonId) {
  for (const u of avModeContext.units || []) {
    const l = (u.lessons || []).find((x) => x.id === lessonId);
    if (l) return l;
  }
  return null;
}

function openAvMode(book) {
  if (!book) return;
  closeReader();
  closeDetail();
  const units = buildAvCurriculumForBook(book);
  const flat = avFlatLessons(units);
  const first = flat[0] || null;
  avModeContext = {
    book,
    tab: 'video',
    units,
    selectedLessonId: first ? first.id : null,
  };
  const line = document.getElementById('avModeBookLine');
  if (line) line.textContent = `${book.t} · ${book.s}`;
  setAvModeTab('video', true);
  renderAvModeStats();
  renderAvModeNav();
  renderAvModeMain();
  const page = document.getElementById('avModePage');
  if (page) {
    page.classList.add('open');
    page.setAttribute('aria-hidden', 'false');
  }
  document.body.style.overflow = 'hidden';
}

function closeAvMode() {
  const main = document.getElementById('avModeMain');
  const v = main?.querySelector('video');
  const a = main?.querySelector('audio');
  if (v) {
    v.pause();
    v.removeAttribute('src');
    v.load();
  }
  if (a) {
    a.pause();
    a.removeAttribute('src');
    a.load();
  }
  const page = document.getElementById('avModePage');
  if (page) {
    page.classList.remove('open', 'tab-blog');
    page.setAttribute('aria-hidden', 'true');
  }
  if (
    !document.getElementById('readerOverlay')?.classList.contains('open') &&
    !document.getElementById('teachModePage')?.classList.contains('open') &&
    !document.getElementById('avModePage')?.classList.contains('open') &&
    !document.getElementById('taskModePage')?.classList.contains('open') &&
    !document.getElementById('questionBankPage')?.classList.contains('open')
  ) {
    document.body.style.overflow = '';
  }
}

function setAvModeTab(tab, silent) {
  const t = tab === 'blog' ? 'blog' : 'video';
  avModeContext.tab = t;
  const page = document.getElementById('avModePage');
  if (page) page.classList.toggle('tab-blog', t === 'blog');
  document.getElementById('avTabVideo')?.classList.toggle('is-active', t === 'video');
  document.getElementById('avTabBlog')?.classList.toggle('is-active', t === 'blog');
  document.getElementById('avTabVideo')?.setAttribute('aria-selected', t === 'video' ? 'true' : 'false');
  document.getElementById('avTabBlog')?.setAttribute('aria-selected', t === 'blog' ? 'true' : 'false');
  if (!silent) renderAvModeStats();
  renderAvModeMain();
}

function renderAvModeStats() {
  const box = document.getElementById('avModeStats');
  if (!box || !avModeContext.book) return;
  const flat = avFlatLessons(avModeContext.units);
  const total = flat.length;
  const done = avLoadDoneSet(avModeContext.book);
  let n = 0;
  for (const l of flat) {
    if (done.has(l.id)) n += 1;
  }
  const pct = total ? Math.round((n / total) * 100) : 0;
  const isBlog = avModeContext.tab === 'blog';
  const resLabel = isBlog ? '音频' : '视频';
  const resIcon = isBlog
    ? '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1v-6h3v4zM3 19a2 2 0 0 0 2 2h1v-6H3v4z"/></svg>'
    : '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>';
  box.innerHTML = `
    <div class="av-mode__stat-ring" style="--p:${pct}">
      <div class="av-mode__stat-ring-val">${pct}<small>%</small></div>
    </div>
    <div class="av-mode__stat-info">
      <div class="av-mode__stat-title">学习进度</div>
      <div class="av-mode__stat-main">已完成 <em>${n}</em> / ${total} 节</div>
      <div class="av-mode__stat-muted">${resIcon}<span>${resLabel}资源 ${total} 个</span></div>
    </div>`;
}

function toggleAvUnit(btn) {
  btn.closest('.av-unit')?.classList.toggle('av-unit--open');
}

function selectAvLesson(lessonId) {
  avModeContext.selectedLessonId = lessonId;
  renderAvModeNav();
  renderAvModeMain();
}

function avMarkCurrentLessonDone() {
  const id = avModeContext.selectedLessonId;
  if (!id || !avModeContext.book) return;
  const set = avLoadDoneSet(avModeContext.book);
  if (set.has(id)) {
    showProfileToast('本节已在已完成列表中');
    return;
  }
  set.add(id);
  avSaveDoneSet(avModeContext.book, set);
  renderAvModeStats();
  renderAvModeNav();
  renderAvModeMain();
  showProfileToast('已标记本节为已完成（演示）');
}

function avOnAvMediaEnded() {
  const id = avModeContext.selectedLessonId;
  if (!id || !avModeContext.book) return;
  const set = avLoadDoneSet(avModeContext.book);
  if (set.has(id)) return;
  set.add(id);
  avSaveDoneSet(avModeContext.book, set);
  renderAvModeStats();
  renderAvModeNav();
  renderAvModeMain();
  showProfileToast('播放完毕，已记录为已完成');
}

function avFindUnitOfLesson(lessonId) {
  for (const u of avModeContext.units || []) {
    if ((u.lessons || []).some((l) => l.id === lessonId)) return u;
  }
  return null;
}

function renderAvModeNav() {
  const nav = document.getElementById('avModeNav');
  if (!nav) return;
  const book = avModeContext.book;
  const done = book ? avLoadDoneSet(book) : new Set();
  const sel = avModeContext.selectedLessonId;
  nav.innerHTML = (avModeContext.units || [])
    .map((u) => {
      const lessons = u.lessons || [];
      const total = lessons.length;
      const n = lessons.reduce((s, l) => s + (done.has(l.id) ? 1 : 0), 0);
      const allDone = total > 0 && n === total;
      return `
    <div class="av-unit av-unit--open${allDone ? ' av-unit--all-done' : ''}">
      <button type="button" class="av-unit-head" onclick="toggleAvUnit(this)">
        <span class="av-unit-title">${escAttr(u.title)}</span>
        <span class="av-unit-progress">${n}/${total}</span>
        <svg class="av-unit-chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div class="av-unit-body">
        ${lessons
          .map((l) => {
            const isDone = done.has(l.id);
            const isSel = l.id === sel;
            const stateHtml = isDone
              ? '<span class="av-lesson-state is-done">已完成</span>'
              : isSel
                ? '<span class="av-lesson-state is-learning">学习中</span>'
                : '<span class="av-lesson-state is-placeholder">占位</span>';
            return `<button type="button" class="av-lesson${isSel ? ' is-active' : ''}${isDone ? ' is-done' : ' is-todo'}" onclick="selectAvLesson('${l.id}')">
              <span class="av-lesson-txt">${escAttr(l.title)}</span>
              ${stateHtml}
            </button>`;
          })
          .join('')}
      </div>
    </div>`;
    })
    .join('');
}

function renderAvModeMain() {
  const main = document.getElementById('avModeMain');
  if (!main) return;
  const lesson = avFindLesson(avModeContext.selectedLessonId);
  if (!lesson) {
    main.innerHTML = '<div class="av-mode__hero"><p class="av-mode__stat-muted">暂无小节内容</p></div>';
    return;
  }
  const tab = avModeContext.tab;
  const book = avModeContext.book;
  const unit = avFindUnitOfLesson(lesson.id);
  const done = book ? avLoadDoneSet(book) : new Set();
  const isDone = done.has(lesson.id);
  const vsrc = lesson.videoUrl || AV_SAMPLE_VIDEOS[0];
  const asrc = lesson.audioUrl || AV_SAMPLE_AUDIO;

  const media =
    tab === 'blog'
      ? `<div class="av-mode__podcast">
          <div class="av-mode__podcast-cover" aria-hidden="true">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1v-6h3v4zM3 19a2 2 0 0 0 2 2h1v-6H3v4z"/></svg>
          </div>
          <div class="av-mode__podcast-body">
            <div class="av-mode__podcast-tag">AUDIO · 博客</div>
            <h3 class="av-mode__podcast-title">${escAttr(lesson.title)}</h3>
            <p class="av-mode__podcast-desc">${escAttr(unit ? unit.title : '本节内容')} · 适合碎片时间收听</p>
            <audio controls preload="metadata" src="${asrc}" onended="avOnAvMediaEnded()">不支持音频</audio>
          </div>
        </div>`
      : `<div class="av-mode__media"><video controls playsinline preload="metadata" src="${vsrc}" onended="avOnAvMediaEnded()">不支持视频</video></div>`;

  const badge = isDone
    ? '<span class="av-mode__lesson-badge is-done"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>已完成</span>'
    : '<span class="av-mode__lesson-badge is-todo">未学</span>';

  const pointsHtml = (lesson.points || [])
    .map((p) => {
      const text =
        typeof p === 'string'
          ? p
          : p && typeof p === 'object'
            ? [p.title, p.body].filter(Boolean).join('：') || ''
            : String(p ?? '');
      return `<li class="av-mode__kpoints-li">${escAttr(text)}</li>`;
    })
    .join('');

  main.innerHTML = `
    <div class="av-mode__hero">
      <div class="av-mode__crumbs"><strong>${escAttr(unit ? unit.title : '')}</strong><span>·</span><span>${escAttr(lesson.title)}</span></div>
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
        <h2 class="av-mode__lesson-title">${escAttr(lesson.title)}</h2>
        ${badge}
      </div>
      ${media}
      <div class="av-mode__kpoints">
        <div class="av-mode__kpoints-label" id="avKpointsHeading">本课知识点</div>
        <ul class="av-mode__kpoints-list" aria-labelledby="avKpointsHeading">${pointsHtml}</ul>
      </div>
    </div>`;
}

const TASK_MODE_STORAGE_PREFIX = 'sc_task_done:';
let taskModeContext = {
  book: null,
  projects: [],
  selectedProjectId: null,
  selectedTaskId: null,
};

function taskStorageKey(book) {
  if (!book) return '';
  return TASK_MODE_STORAGE_PREFIX + encodeURIComponent(`${book.t || ''}|${book.s || ''}`);
}

function taskLoadDoneSet(book) {
  const key = taskStorageKey(book);
  if (!key) return new Set();
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch (_err) {
    return new Set();
  }
}

function taskSaveDoneSet(book, set) {
  const key = taskStorageKey(book);
  if (!key) return;
  localStorage.setItem(key, JSON.stringify(Array.from(set)));
}

function taskBuildProjectsForBook(book) {
  const sub = book && book.sub;
  const toc = sub && TOC[sub] ? TOC[sub] : null;
  if (toc && toc.length) {
    return toc.map((u, ui) => ({
      id: `tp-${ui}`,
      title: `项目 ${ui + 1} ${u.u}`,
      tasks: (u.ls || []).map((title, li) => ({
        id: `tsk-${ui}-${li}`,
        title,
        type: li % 2 === 0 ? '习题' : '实训',
      })),
    }));
  }
  const fallback = avDefaultCurriculum(sub).map((u, ui) => ({
    id: `tp-f-${ui}`,
    title: `项目 ${ui + 1} ${u.title}`,
    tasks: (u.lessons || []).map((l, li) => ({
      id: `tsk-f-${ui}-${li}`,
      title: l.title,
      type: li % 2 === 0 ? '习题' : '实训',
    })),
  }));
  return fallback;
}

function taskFlatTasks(projects) {
  const out = [];
  (projects || []).forEach((p, pi) => {
    (p.tasks || []).forEach((t, ti) => out.push({ project: p, task: t, pi, ti }));
  });
  return out;
}

function taskFindByTaskId(taskId) {
  const flat = taskFlatTasks(taskModeContext.projects);
  return flat.find((x) => x.task.id === taskId) || null;
}

function taskFindNextTaskId(taskId) {
  const flat = taskFlatTasks(taskModeContext.projects);
  const idx = flat.findIndex((x) => x.task.id === taskId);
  if (idx < 0 || idx >= flat.length - 1) return null;
  return flat[idx + 1].task.id;
}

function taskRenderSummary() {
  const box = document.getElementById('taskModeProgressStats');
  const currentEl = document.getElementById('taskModeCurrentTask');
  if (!box || !currentEl) return;
  const flat = taskFlatTasks(taskModeContext.projects);
  const total = flat.length;
  const done = taskLoadDoneSet(taskModeContext.book);
  const doneCount = flat.reduce((n, x) => n + (done.has(x.task.id) ? 1 : 0), 0);
  const current = taskFindByTaskId(taskModeContext.selectedTaskId) || flat[0] || null;
  if (current) {
    currentEl.textContent = `任务${current.pi + 1}.${current.ti + 1} ${current.task.title}（${current.task.type}）`;
  } else {
    currentEl.textContent = '暂无任务';
  }
  box.innerHTML = `
    <div class="task-mode__metric">
      <small>已完成</small>
      <strong>${doneCount}</strong>
    </div>
    <div class="task-mode__metric">
      <small>总任务</small>
      <strong>${total}</strong>
    </div>`;
}

function taskRenderProjects() {
  const root = document.getElementById('taskModeProjects');
  if (!root) return;
  root.innerHTML = (taskModeContext.projects || [])
    .map(
      (p) => `<button type="button" class="task-mode__project${p.id === taskModeContext.selectedProjectId ? ' is-active' : ''}" onclick="taskSelectProject('${p.id}')">${escAttr(p.title)}</button>`
    )
    .join('');
}

function taskRenderTimeline() {
  const root = document.getElementById('taskModeTimeline');
  if (!root) return;
  const proj =
    (taskModeContext.projects || []).find((p) => p.id === taskModeContext.selectedProjectId) ||
    taskModeContext.projects[0];
  if (!proj) {
    root.innerHTML = '';
    return;
  }
  const done = taskLoadDoneSet(taskModeContext.book);
  const pIdx = Math.max(0, taskModeContext.projects.findIndex((p) => p.id === proj.id));
  root.innerHTML = (proj.tasks || [])
    .map((t, ti) => {
      const isDone = done.has(t.id);
      const isActive = t.id === taskModeContext.selectedTaskId;
      return `
      <div class="task-mode__timeline-item${isDone ? ' is-done' : ''}${isActive ? ' is-active' : ''}" onclick="taskSelectItem('${t.id}')">
        <div class="task-mode__timeline-dot">${ti + 1}</div>
        <div class="task-mode__timeline-main">
          <div class="task-mode__timeline-title-row">
            <div class="task-mode__timeline-title">任务${pIdx + 1}.${ti + 1} ${escAttr(t.title)}</div>
            <span class="task-mode__timeline-type">${t.type}</span>
          </div>
          <div class="task-mode__timeline-sub">${escAttr(proj.title)}</div>
        </div>
      </div>`;
    })
    .join('');
}

function taskSelectProject(projectId) {
  const p = (taskModeContext.projects || []).find((x) => x.id === projectId);
  if (!p) return;
  taskModeContext.selectedProjectId = p.id;
  if (!(p.tasks || []).some((t) => t.id === taskModeContext.selectedTaskId)) {
    taskModeContext.selectedTaskId = p.tasks && p.tasks[0] ? p.tasks[0].id : null;
  }
  taskRenderProjects();
  taskRenderTimeline();
  taskRenderSummary();
}

function taskSelectItem(taskId) {
  const hit = taskFindByTaskId(taskId);
  if (!hit) return;
  taskModeContext.selectedProjectId = hit.project.id;
  taskModeContext.selectedTaskId = taskId;
  taskRenderProjects();
  taskRenderTimeline();
  taskRenderSummary();
}

function taskStartTask(taskId) {
  const hit = taskFindByTaskId(taskId);
  if (!hit || !taskModeContext.book) return;
  const done = taskLoadDoneSet(taskModeContext.book);
  if (!done.has(taskId)) {
    done.add(taskId);
    taskSaveDoneSet(taskModeContext.book, done);
    showProfileToast(`已完成：任务${hit.pi + 1}.${hit.ti + 1}（演示）`);
  }
  const nextId = taskFindNextTaskId(taskId);
  if (nextId) {
    const next = taskFindByTaskId(nextId);
    taskModeContext.selectedTaskId = nextId;
    taskModeContext.selectedProjectId = next ? next.project.id : taskModeContext.selectedProjectId;
  } else {
    taskModeContext.selectedTaskId = taskId;
    taskModeContext.selectedProjectId = hit.project.id;
  }
  taskRenderProjects();
  taskRenderTimeline();
  taskRenderSummary();
}

function taskStartCurrent() {
  if (!taskModeContext.selectedTaskId) return;
  taskStartTask(taskModeContext.selectedTaskId);
}

function openTaskMode(book) {
  if (!book) return;
  closeReader();
  closeDetail();
  const projects = taskBuildProjectsForBook(book);
  const flat = taskFlatTasks(projects);
  const done = taskLoadDoneSet(book);
  const firstTodo = flat.find((x) => !done.has(x.task.id)) || flat[0] || null;
  taskModeContext = {
    book,
    projects,
    selectedProjectId: firstTodo ? firstTodo.project.id : projects[0]?.id || null,
    selectedTaskId: firstTodo ? firstTodo.task.id : projects[0]?.tasks?.[0]?.id || null,
  };
  const line = document.getElementById('taskModeBookLine');
  if (line) line.textContent = `${book.t} · ${book.s}`;
  taskRenderProjects();
  taskRenderTimeline();
  taskRenderSummary();
  const page = document.getElementById('taskModePage');
  if (page) {
    page.classList.add('open');
    page.setAttribute('aria-hidden', 'false');
  }
  document.body.style.overflow = 'hidden';
}

function closeTaskMode() {
  const page = document.getElementById('taskModePage');
  if (page) {
    page.classList.remove('open');
    page.setAttribute('aria-hidden', 'true');
  }
  if (
    !document.getElementById('readerOverlay')?.classList.contains('open') &&
    !document.getElementById('teachModePage')?.classList.contains('open') &&
    !document.getElementById('avModePage')?.classList.contains('open') &&
    !document.getElementById('questionBankPage')?.classList.contains('open')
  ) {
    document.body.style.overflow = '';
  }
}

let questionBankContext = { book: null, classes: [], isAdmin: false };

function getVisibleClassesForBook(book) {
  if (!book) return [];
  return classGroups
    .map((cls, i) => ({ cls, i }))
    .filter(({ cls }) => isClassVisibleForUser(cls) && cls.books.some((cb) => classBookMatchesMyBook(cb, book)));
}

function questionBankPaperRows(book, classes, isAdmin) {
  const groupName = classes[0]?.cls.name || '关联组群';
  const adminRows = [
    { id: 'unit1', name: '第 1 单元基础检测', group: groupName, status: '已发布', type: '普通练习', publishedAt: '2026-06-01 09:30', meta: '20 题 · 100 分 · 自动批阅', done: '9/12 已提交', actions: [{ label: '查看', view: 'view', preview: true }, { label: '查看数据', view: 'data' }, { label: '撤回', view: 'withdraw', danger: true }] },
    { id: 'project', name: '项目任务阶段测验', group: classes[1]?.cls.name || groupName, status: '草稿', type: '考试', publishedAt: '未发布', meta: '12 题 · 60 分 · 支持主观题', done: '待设置分数', actions: [{ label: '预览发布试卷', view: 'preview', preview: true }, { label: '设置分数', view: 'score' }] },
    { id: 'final', name: `${book.t} 综合练习卷`, group: groupName, status: '已发布', type: '考试', publishedAt: '2026-06-03 14:00', meta: '30 题 · 100 分 · AI 辅助解析', done: '12/12 已提交', actions: [{ label: '查看', view: 'view', preview: true }, { label: '查看数据', view: 'data' }, { label: '撤回', view: 'withdraw', danger: true }] },
  ];
  const studentRows = [
    { id: 'unit1', name: '第 1 单元基础检测', group: groupName, status: '待完成', meta: '20 题 · 100 分 · 自动批阅', done: '截止 06-12', actions: [{ label: '去作答', view: 'answer', primary: true }] },
    { id: 'final', name: `${book.t} 综合练习卷`, group: groupName, status: '已完成', meta: '30 题 · 100 分 · AI 辅助解析', done: '得分 86', actions: [{ label: '查看已答', view: 'result' }, { label: '重做', view: 'answer', primary: true }] },
    { id: 'project', name: '项目任务阶段测验', group: groupName, status: '已完成', meta: '12 题 · 60 分 · 支持主观题', done: '得分 78', actions: [{ label: '查看已答', view: 'result' }, { label: '重做', view: 'answer', primary: true }] },
  ];
  const base = isAdmin ? adminRows : studentRows;
  return base.map((p) => `<div class="qb-paper-row">
    <div class="qb-paper-main">
      <div class="qb-paper-name">${escAttr(p.name)}</div>
      <div class="qb-paper-meta">${escAttr(p.group)} · ${escAttr(p.meta)}</div>
      ${isAdmin ? `<div class="qb-paper-submeta"><span>发布时间：${escAttr(p.publishedAt)}</span><span>类型：${escAttr(p.type)}</span></div>` : ''}
    </div>
    <span class="qb-paper-status">${escAttr(p.status)}</span>
    <span class="qb-paper-done">${escAttr(p.done)}</span>
    <div class="qb-paper-actions">
      ${p.actions.map((action) => {
        const handler = action.view === 'withdraw'
          ? `withdrawQuestionBankPaper('${p.id}')`
          : `openQuestionBankPaperPanel('${action.view}','${p.id}')`;
        return `<button type="button" class="qb-paper-action ${action.preview ? 'qb-paper-action--preview' : ''} ${action.primary ? 'qb-paper-action--primary' : ''} ${action.danger ? 'qb-paper-action--danger' : ''}" onclick="${handler}">${escAttr(action.label)}</button>`;
      }).join('')}
    </div>
  </div>`).join('');
}

function questionBankSectionCard(key, title, desc, stat, action) {
  const icons = {
    mine: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="10" y="7" width="25" height="34" rx="6" fill="#8b5cf6"/><rect x="15" y="13" width="15" height="3" rx="1.5" fill="#fff" opacity=".9"/><rect x="15" y="21" width="16" height="3" rx="1.5" fill="#fff" opacity=".72"/><rect x="15" y="29" width="11" height="3" rx="1.5" fill="#fff" opacity=".72"/><circle cx="35" cy="34" r="8" fill="#c4b5fd"/><path d="M31.5 34.2l2.2 2.2 4.5-5" fill="none" stroke="#5b21b6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    support: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="8" y="9" width="15" height="30" rx="5" fill="#3b82f6"/><rect x="25" y="9" width="15" height="30" rx="5" fill="#60a5fa"/><path d="M23 13v25" stroke="#dbeafe" stroke-width="2"/><rect x="12" y="16" width="7" height="3" rx="1.5" fill="#fff" opacity=".9"/><rect x="29" y="16" width="7" height="3" rx="1.5" fill="#fff" opacity=".9"/><rect x="29" y="24" width="6" height="3" rx="1.5" fill="#fff" opacity=".72"/></svg>',
    wrong: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="9" y="8" width="30" height="32" rx="8" fill="#fb923c"/><circle cx="34" cy="14" r="7" fill="#fed7aa"/><path d="M31.5 11.5l5 5M36.5 11.5l-5 5" stroke="#c2410c" stroke-width="2.6" stroke-linecap="round"/><rect x="15" y="18" width="13" height="3" rx="1.5" fill="#fff" opacity=".9"/><rect x="15" y="26" width="18" height="3" rx="1.5" fill="#fff" opacity=".72"/></svg>',
  };
  const canOpenList = key === 'mine' || key === 'support';
  const openAttr = canOpenList ? ` onclick="openQuestionBankLibraryList('${key}')" role="button" tabindex="0" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openQuestionBankLibraryList('${key}')}"` : '';
  const btnAction = canOpenList ? `openQuestionBankLibraryList('${key}')` : `showProfileToast('${title}功能建设中。')`;
  return `<section class="qb-section-card qb-section-card--${key}"${openAttr}>
    <div class="qb-section-ic" aria-hidden="true">${icons[key] || icons.mine}</div>
    <div class="qb-section-main">
      <h3>${title}</h3>
      <p>${desc}</p>
      <span>${stat}</span>
    </div>
    <button type="button" class="qb-section-btn" onclick="event.stopPropagation();${btnAction}">${action}</button>
  </section>`;
}

function questionBankLibraryItems(kind) {
  const book = questionBankContext.book || myB[0];
  if (kind === 'support') {
    return [
      { id: 'support-unit1', name: '第 1 单元 认识人工智能', createdAt: '2026-05-18 10:20', count: '2 套题 · 16 题', status: '配套', source: book.t },
      { id: 'support-unit2', name: '第 2 单元 数据与算法基础', createdAt: '2026-05-20 14:35', count: '3 套题 · 24 题', status: '配套', source: book.t },
      { id: 'support-project', name: `${book.t} 项目实践题库`, createdAt: '2026-05-26 09:10', count: '4 套题 · 30 题', status: '配套', source: book.t },
      { id: 'support-final', name: `${book.t} 综合测试题库`, createdAt: '2026-05-30 16:00', count: '5 套题 · 42 题', status: '配套', source: book.t },
    ];
  }
  return [
    { id: 'mine-ai', name: `${book.t} 习题集`, createdAt: '2026-06-04 15:11', count: '8 题 · 40 分', status: '草稿', source: 'AI 出题' },
    { id: 'mine-import', name: '课堂导入题库 · 智能技术与社会', createdAt: '2026-06-03 18:30', count: '18 题 · 76 分', status: '未发布', source: 'Word 导入' },
    { id: 'mine-chapter', name: '第 1 单元随堂练习题库', createdAt: '2026-06-01 09:45', count: '20 题 · 100 分', status: '已发布', source: '手动出题' },
    { id: 'mine-pick', name: `${book.t} 期末复习题库`, createdAt: '2026-05-29 11:20', count: '30 题 · 100 分', status: '已发布', source: '现有题库选题' },
  ];
}

function openQuestionBankLibraryList(kind = 'mine') {
  const host = document.getElementById('questionBankPanel');
  if (!host) return;
  const isSupport = kind === 'support';
  const book = questionBankContext.book || myB[0];
  const title = isSupport ? '配套题库列表' : '我的题库列表';
  const desc = isSupport ? `来自《${book.t}》的章节测试题和综合练习。` : '管理我创建、导入和收藏沉淀的题库。';
  const rows = questionBankLibraryItems(kind);
  host.innerHTML = `<div class="qb-panel-page">
    <header class="qb-panel-head">
      <button type="button" class="qb-panel-back" onclick="closeQuestionBankPaperPanel()">返回</button>
      <div><h2>${title}</h2><p>${escAttr(desc)}</p></div>
      ${isSupport
        ? '<button type="button" class="qb-panel-primary" onclick="openQuestionBankPaperEditor(\'project\')">从配套题库选题</button>'
        : '<button type="button" class="qb-panel-primary" onclick="openQuestionBankAiModal()">创建题库</button>'}
    </header>
    <main class="qb-panel-body">
      <section class="qb-library-card">
        <div class="qb-library-head">
          <span>题库名称</span>
          <span>创建时间</span>
          <span>题量</span>
          <span>状态</span>
          <span>操作</span>
        </div>
        <div class="qb-library-list">
          ${rows.map((item) => `<article class="qb-library-row">
            <button type="button" class="qb-library-title" onclick="openQuestionBankLibraryDetail('${kind}','${item.id}')">
              <strong>${escAttr(item.name)}</strong>
              <small>${escAttr(item.source)}</small>
            </button>
            <span class="qb-library-time">${escAttr(item.createdAt)}</span>
            <span class="qb-library-count">${escAttr(item.count)}</span>
            <span class="qb-library-status qb-library-status--${item.status === '已发布' ? 'published' : item.status === '草稿' ? 'draft' : 'support'}">${escAttr(item.status)}</span>
            <div class="qb-library-actions">
              ${isSupport
                ? `<button type="button" onclick="openQuestionBankLibraryDetail('${kind}','${item.id}')">查看</button><button type="button" class="is-primary" onclick="openQuestionBankPaperEditor('project')">选题</button>`
                : `<button type="button" class="is-primary" onclick="openQuestionBankPublishModal()">发布</button><button type="button" onclick="openQuestionBankLibraryDetail('${kind}','${item.id}')">查看</button><button type="button" class="is-danger" onclick="deleteQuestionBankLibraryItem('${item.id}')">删除</button>`}
            </div>
          </article>`).join('')}
        </div>
      </section>
    </main>
  </div>`;
  host.classList.add('open');
  host.setAttribute('aria-hidden', 'false');
}

function openQuestionBankLibraryDetail(kind, itemId) {
  const item = questionBankLibraryItems(kind).find((entry) => entry.id === itemId);
  showProfileToast(`${item?.name || '题库'}详情页建设中，当前先进入试卷预览。`);
  openQuestionBankPaperPanel('preview', 'project');
}

function deleteQuestionBankLibraryItem(itemId) {
  const item = questionBankLibraryItems('mine').find((entry) => entry.id === itemId);
  showProfileToast(`${item?.name || '题库'} 已删除（演示）。`);
}

function questionBankPanelPaper(id) {
  const book = questionBankContext.book || myB[0];
  const map = {
    unit1: { id: 'unit1', name: '第 1 单元基础检测', group: questionBankContext.classes[0]?.cls.name || '关联组群', total: '20 题 · 100 分', status: '已发布', type: '普通练习', publishedAt: '2026-06-01 09:30' },
    project: { id: 'project', name: '项目任务阶段测验', group: questionBankContext.classes[1]?.cls.name || questionBankContext.classes[0]?.cls.name || '关联组群', total: '12 题 · 60 分', status: '草稿', type: '考试', publishedAt: '未发布' },
    final: { id: 'final', name: `${book.t} 综合练习卷`, group: questionBankContext.classes[0]?.cls.name || '关联组群', total: '30 题 · 100 分', status: '已发布', type: '考试', publishedAt: '2026-06-03 14:00' },
  };
  return map[id] || map.unit1;
}

function questionBankSubmissionData(paperId) {
  const cls = questionBankContext.classes[0]?.cls;
  const students = cls?.students?.length ? cls.students : [
    { name: '王思涵', id: '2024030101', last: '今天' },
    { name: '张子墨', id: '2024030102', last: '今天' },
    { name: '刘雨桐', id: '2024030103', last: '昨天' },
  ];
  const submitCount = paperId === 'final' ? students.length : Math.max(1, Math.min(students.length, Math.ceil(students.length * 0.75)));
  const submitted = students.slice(0, submitCount).map((st, i) => ({
    ...st,
    score: Math.max(62, 94 - i * 4),
    submittedAt: i < 2 ? '今天 10:2' + i : '昨天 18:1' + i,
    duration: `${18 + i * 3} 分钟`,
  }));
  const pending = students.slice(submitCount).map((st, i) => ({
    ...st,
    status: i === 0 ? '已提醒' : '未提交',
  }));
  return { submitted, pending, total: students.length };
}

function questionBankSubmissionListHtml(paperId) {
  const data = questionBankSubmissionData(paperId);
  const submittedRows = data.submitted.map((st) => `<div class="qb-submit-row">
    <div class="qb-submit-user">
      <span>${escAttr(st.name.slice(-1))}</span>
      <div><strong>${escAttr(st.name)}</strong><em>${escAttr(st.id)}</em></div>
    </div>
    <b>${st.score} 分</b>
    <small>${escAttr(st.submittedAt)} · ${escAttr(st.duration)}</small>
    <button type="button" class="qb-paper-action qb-paper-action--preview" onclick="openQuestionBankMemberReport('${paperId}','${escAttr(st.id)}')">查看报告</button>
  </div>`).join('');
  const pendingRows = data.pending.length
    ? data.pending.map((st) => `<div class="qb-submit-row qb-submit-row--pending">
        <div class="qb-submit-user">
          <span>${escAttr(st.name.slice(-1))}</span>
          <div><strong>${escAttr(st.name)}</strong><em>${escAttr(st.id)}</em></div>
        </div>
        <b>${escAttr(st.status)}</b>
        <small>最后学习：${escAttr(st.last || '暂无')}</small>
        <button type="button" class="qb-paper-action" onclick="showProfileToast('已发送提交提醒（演示）。')">提醒</button>
      </div>`).join('')
    : '<div class="qb-submit-empty">全部组员已提交。</div>';
  return `<div class="qb-submission-grid">
    <section class="qb-panel-card">
      <div class="qb-panel-card-head"><h3>已提交组员</h3><span>${data.submitted.length}/${data.total}</span></div>
      <div class="qb-submit-list">${submittedRows}</div>
    </section>
    <section class="qb-panel-card">
      <div class="qb-panel-card-head"><h3>未提交组员</h3><span>${data.pending.length}/${data.total}</span></div>
      <div class="qb-submit-list">${pendingRows}</div>
    </section>
  </div>`;
}

function questionBankStudentResultHtml(paper) {
  const isMobile = String(questionBankContext.book?.t || '').includes('移动应用开发');
  const summary = isMobile
    ? '你对 Activity、Manifest 与移动端适配的基础概念掌握较好；建议继续巩固登录安全设计，尤其是 Token 存储、隐私授权和异常会话处理。'
    : '你对人工智能的基础概念、机器感知和模型评估掌握较好；需要继续巩固 AI 伦理场景题，尤其是隐私授权、数据最小化和误识别风险的表述。';
  return `<div class="qb-result-hero">
      <div class="qb-result-score"><strong>86</strong><span>分</span></div>
      <div>
        <h3>AI 已完成自动批阅</h3>
        <p>${escAttr(paper.name)} 提交成功。客观题已自动判分，简答题按关键词覆盖度与表达完整度给出智能评分建议。</p>
      </div>
    </div>
    <div class="qb-panel-stats">
      <div><strong>4/5</strong><span>已答对</span></div>
      <div><strong>92%</strong><span>知识点覆盖</span></div>
      <div><strong>1</strong><span>待巩固题</span></div>
      <div><strong>2 分钟</strong><span>建议复习</span></div>
    </div>
    <div class="qb-panel-card">
      <h3>AI 总结</h3>
      <p class="qb-ai-summary">${summary}</p>
    </div>
    <div class="qb-panel-card">
      <h3>逐题反馈</h3>
      ${questionBankGeneratedQuestions().slice(0, 4).map((q, i) => `<div class="qb-result-row ${i === 3 ? 'is-weak' : 'is-ok'}">
        <b>${i + 1}. ${escAttr(q.type)}</b>
        <span>${i === 3 ? '需巩固' : '正确'} · ${q.score} 分 · ${escAttr(q.points.join('、'))}</span>
      </div>`).join('')}
    </div>`;
}

function questionBankAnswerInputHtml(q, i, prefix) {
  const name = `${prefix}-${i}`;
  if (q.options) {
    return `<div class="qb-answer-options">${q.options.map((op, j) => `<label><input type="radio" name="${name}"><span>${String.fromCharCode(65 + j)}</span>${escAttr(op)}</label>`).join('')}</div>`;
  }
  if (q.type === '判断题') {
    return `<div class="qb-answer-options qb-answer-options--inline"><label><input type="radio" name="${name}"><span>对</span>正确</label><label><input type="radio" name="${name}"><span>错</span>错误</label></div>`;
  }
  return `<textarea class="qb-answer-textarea" rows="${q.type === '简答题' ? 4 : 2}" placeholder="请输入答案"></textarea>`;
}

function questionBankAnswerPaperHtml(prefix = 'qb-answer') {
  const typeOrder = ['选择题', '填空题', '判断题', '简答题'];
  let no = 0;
  return `<div class="qb-panel-card qb-answer-card qb-answer-card--paper">
    ${typeOrder.map((type) => {
      const list = questionBankGeneratedQuestions().filter((q) => q.type === type).slice(0, 2);
      if (!list.length) return '';
      const score = list.reduce((sum, q) => sum + (q.score || 0), 0);
      return `<section class="qb-answer-type-section">
        <div class="qb-answer-type-head"><h3>${escAttr(type)}</h3><span>共 ${list.length} 题 · ${score} 分</span></div>
        ${list.map((q) => {
          no += 1;
          return `<section class="qb-answer-item">
            <div class="qb-answer-stem"><b>${no}</b><strong>${escAttr(q.stem)}</strong><em>${escAttr(q.type)} · ${q.score} 分</em></div>
            ${questionBankAnswerInputHtml(q, no, prefix)}
          </section>`;
        }).join('')}
      </section>`;
    }).join('')}
  </div>`;
}

function openQuestionBankPaperPanel(mode, paperId) {
  const host = document.getElementById('questionBankPanel');
  if (!host) return;
  const paper = questionBankPanelPaper(paperId);
  const submissions = questionBankSubmissionData(paperId);
  const isDraftPreview = mode === 'preview' && paper.status === '草稿';
  const title = mode === 'data' ? '试卷数据' : mode === 'score' ? '设置分数' : mode === 'answer' ? '试卷作答' : mode === 'result' ? 'AI 批阅报告' : mode === 'view' ? '查看试卷' : '预览发布试卷';
  const body = mode === 'data'
    ? `<div class="qb-panel-stats">
        <div><strong>${submissions.total}</strong><span>应交人数</span></div>
        <div><strong>${submissions.submitted.length}</strong><span>已提交</span></div>
        <div><strong>${submissions.pending.length}</strong><span>未提交</span></div>
        <div><strong>88.5</strong><span>平均分</span></div>
      </div>
      ${questionBankSubmissionListHtml(paperId)}
      <div class="qb-panel-card">
        <h3>题目表现</h3>
        <div class="qb-panel-bars">
          <p><span>选择题</span><b style="width:86%"></b><em>86%</em></p>
          <p><span>填空题</span><b style="width:72%"></b><em>72%</em></p>
          <p><span>判断题</span><b style="width:91%"></b><em>91%</em></p>
          <p><span>简答题</span><b style="width:64%"></b><em>64%</em></p>
        </div>
      </div>
      <div class="qb-panel-card">
        <h3>高频薄弱点</h3>
        <div class="qb-panel-tags"><span>机器感知</span><span>模型评估</span><span>AI伦理</span></div>
      </div>`
    : mode === 'score'
      ? `<div class="qb-panel-card">
          <div class="qb-panel-score-head">
            <h3>按题型批量设置</h3>
            <div class="qb-panel-total-score"><span>当前总分</span><strong id="questionBankScoreTotal">40</strong><em>分</em></div>
          </div>
          <div class="qb-panel-score-grid">
            <label><span>选择题</span><input type="number" min="0" value="5" data-count="2" oninput="updateQuestionBankScoreTotal()"><em>分/题 · 2题</em></label>
            <label><span>填空题</span><input type="number" min="0" value="4" data-count="2" oninput="updateQuestionBankScoreTotal()"><em>分/题 · 2题</em></label>
            <label><span>判断题</span><input type="number" min="0" value="3" data-count="2" oninput="updateQuestionBankScoreTotal()"><em>分/题 · 2题</em></label>
            <label><span>简答题</span><input type="number" min="0" value="8" data-count="2" oninput="updateQuestionBankScoreTotal()"><em>分/题 · 2题</em></label>
          </div>
        </div>
        <div class="qb-panel-card">
          <h3>发布规则</h3>
          <div class="qb-panel-form">
            <label><span>发布组群</span><select><option>${escAttr(paper.group)}</option></select></label>
            <label><span>截止时间</span><input value="2026-06-12 18:00"></label>
            <label><span>批阅方式</span><select><option>客观题自动批阅，主观题教师复核</option></select></label>
          </div>
        </div>`
      : mode === 'answer'
        ? questionBankAnswerPaperHtml('qb-answer')
        : mode === 'result'
          ? questionBankStudentResultHtml(paper)
      : `<div class="qb-panel-card">
          <h3>试卷概览</h3>
          <div class="qb-panel-preview">
            <p><strong>发布对象</strong><span>${escAttr(paper.group)}</span></p>
            <p><strong>题量分值</strong><span>${escAttr(paper.total)}</span></p>
            <p><strong>状态</strong><span>${escAttr(paper.status)}</span></p>
            <p><strong>发布时间</strong><span>${escAttr(paper.publishedAt)}</span></p>
            <p><strong>试卷类型</strong><span>${escAttr(paper.type)}</span></p>
            <p><strong>批阅</strong><span>客观题自动批阅，主观题可复核</span></p>
          </div>
        </div>
        ${questionBankAnswerPaperHtml(`qb-preview-${paperId}`)}`;
  const primaryText = isDraftPreview ? '编辑试卷' : mode === 'preview' ? '确认发布' : mode === 'view' ? '关闭' : mode === 'score' ? '保存设置' : mode === 'data' ? '刷新数据' : mode === 'answer' ? '提交并 AI 批阅' : '重新练习';
  const primaryAction = isDraftPreview
    ? `openQuestionBankPaperEditor('${paperId}')`
    : mode === 'preview'
    ? 'openQuestionBankPublishModal()'
    : mode === 'view'
    ? 'closeQuestionBankPaperPanel()'
    : mode === 'answer'
    ? `openQuestionBankPaperPanel('result','${paperId}')`
    : mode === 'result'
      ? `openQuestionBankPaperPanel('answer','${paperId}')`
      : `showProfileToast('${mode === 'preview' ? '试卷已发布（演示）。' : mode === 'score' ? '分数设置已保存。' : '数据已刷新。'}')`;
  host.innerHTML = `<div class="qb-panel-page">
    <header class="qb-panel-head">
      <button type="button" class="qb-panel-back" onclick="closeQuestionBankPaperPanel()">返回</button>
      <div><h2>${title}</h2><p>${escAttr(paper.name)} · ${escAttr(paper.group)}</p></div>
      <button type="button" class="qb-panel-primary" onclick="${primaryAction}">${primaryText}</button>
    </header>
    <main class="qb-panel-body">${body}</main>
  </div>`;
  host.classList.add('open');
  host.setAttribute('aria-hidden', 'false');
}

function openQuestionBankMemberReport(paperId, studentId) {
  const host = document.getElementById('questionBankPanel');
  if (!host) return;
  const paper = questionBankPanelPaper(paperId);
  const data = questionBankSubmissionData(paperId);
  const student = data.submitted.find((st) => String(st.id) === String(studentId)) || data.submitted[0];
  if (!student) return;
  const questions = questionBankGeneratedQuestions().slice(0, 4);
  host.innerHTML = `<div class="qb-panel-page">
    <header class="qb-panel-head">
      <button type="button" class="qb-panel-back" onclick="openQuestionBankPaperPanel('data','${paperId}')">返回数据</button>
      <div><h2>组员答题报告</h2><p>${escAttr(student.name)} · ${escAttr(paper.name)}</p></div>
      <button type="button" class="qb-panel-primary" onclick="showProfileToast('报告已导出（演示）。')">导出报告</button>
    </header>
    <main class="qb-panel-body">
      <div class="qb-member-report-hero">
        <div class="qb-result-score"><strong>${student.score}</strong><span>分</span></div>
        <div>
          <h3>${escAttr(student.name)} 的 AI 批阅结果</h3>
          <p>提交时间：${escAttr(student.submittedAt)} · 用时：${escAttr(student.duration)}。客观题已自动判分，主观题给出智能评分建议。</p>
        </div>
      </div>
      <div class="qb-panel-stats">
        <div><strong>${student.score >= 85 ? '优秀' : '良好'}</strong><span>等级</span></div>
        <div><strong>${Math.max(1, Math.round(student.score / 20))}/5</strong><span>答对题</span></div>
        <div><strong>${Math.min(96, student.score + 6)}%</strong><span>知识点覆盖</span></div>
        <div><strong>${student.score < 80 ? 2 : 1}</strong><span>待巩固点</span></div>
      </div>
      <div class="qb-panel-card">
        <h3>AI 总结</h3>
        <p class="qb-ai-summary">${escAttr(student.name)} 对基础概念掌握较稳定，选择题和判断题完成质量较高；建议继续复习简答题中的场景分析表达，答题时补充“原因、风险、改进建议”三个层次。</p>
      </div>
      <div class="qb-panel-card">
        <h3>逐题报告</h3>
        ${questions.map((q, i) => `<div class="qb-result-row ${i === 3 && student.score < 90 ? 'is-weak' : 'is-ok'}">
          <b>${i + 1}. ${escAttr(q.type)}</b>
          <span>${i === 3 && student.score < 90 ? '需巩固' : '正确'} · ${q.score} 分 · 答案：${escAttr(q.answer)}</span>
        </div>`).join('')}
      </div>
    </main>
  </div>`;
  host.classList.add('open');
  host.setAttribute('aria-hidden', 'false');
}

function withdrawQuestionBankPaper(paperId) {
  const paper = questionBankPanelPaper(paperId);
  showProfileToast(`${paper.name} 已撤回（演示）。`);
}

function closeQuestionBankPaperPanel() {
  const host = document.getElementById('questionBankPanel');
  if (!host) return;
  host.classList.remove('open');
  host.setAttribute('aria-hidden', 'true');
  host.innerHTML = '';
}

function openQuestionBankPublishModal() {
  const modal = document.getElementById('questionBankPublishModal');
  if (!modal) return;
  const book = questionBankContext.book || myB[0];
  const groups = questionBankContext.classes.length
    ? questionBankContext.classes.map(({ cls }) => cls.name)
    : ['关联组群'];
  modal.innerHTML = `<div class="qb-publish-bg" onclick="closeQuestionBankPublishModal()"></div>
    <section class="qb-publish-panel" role="dialog" aria-modal="true" aria-labelledby="qbPublishTitle">
      <button type="button" class="qb-publish-close" onclick="closeQuestionBankPublishModal()" aria-label="关闭">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <div class="qb-publish-card">
        <h2 id="qbPublishTitle">发布信息</h2>
        <label class="qb-publish-field is-required">
          <span>试卷名称</span>
          <div class="qb-publish-input-wrap">
            <input type="text" value="${escAttr(book.t)} 习题集" maxlength="30">
            <em>${String(`${book.t} 习题集`).length}/30</em>
          </div>
        </label>
        <label class="qb-publish-field is-required">
          <span>组群名称</span>
          <div class="qb-publish-select-wrap">
            <div class="qb-publish-chip">${escAttr(groups[0])}<button type="button" aria-label="移除组群">×</button></div>
            <select aria-label="选择组群">${groups.map((g) => `<option>${escAttr(g)}</option>`).join('')}</select>
          </div>
        </label>
        <div class="qb-publish-field">
          <span>试卷类型</span>
          <div class="qb-publish-radios">
            <label><input type="radio" name="qbPublishType" checked><span>普通练习</span></label>
            <label><input type="radio" name="qbPublishType"><span>考试</span></label>
          </div>
        </div>
        <label class="qb-publish-field qb-publish-field--short">
          <span>是否可以重做</span>
          <select>
            <option>是</option>
            <option>否</option>
          </select>
        </label>
      </div>
      <button type="button" class="qb-publish-submit" onclick="submitQuestionBankPublish()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M2 21l20-9L2 3v7l12 2-12 2v7z"/></svg>
        发布
      </button>
    </section>`;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeQuestionBankPublishModal() {
  const modal = document.getElementById('questionBankPublishModal');
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = '';
}

function submitQuestionBankPublish() {
  closeQuestionBankPublishModal();
  showProfileToast('试卷已发布到组群。');
}

function renderQuestionBankHome() {
  const book = questionBankContext.book;
  if (!book) return;
  const classes = questionBankContext.classes;
  const isAdmin = questionBankContext.isAdmin;
  const body = document.getElementById('questionBankBody');
  const line = document.getElementById('questionBankBookLine');
  if (line) line.textContent = `${book.t} · ${book.s}`;
  if (!body) return;
  const classNames = classes.map(({ cls }) => cls.name);
  const publishTools = isAdmin
    ? `<div class="qb-compose-panel">
        <div class="qb-compose-head">
          <h2>发布试卷任务</h2>
        </div>
        <div class="qb-tool-grid">
          <button type="button" class="qb-tool qb-tool--ai" onclick="openQuestionBankAiModal()"><span class="qb-tool-ic" aria-hidden="true"><svg viewBox="0 0 48 48"><rect x="8" y="10" width="32" height="28" rx="10" fill="#597ef7"/><path d="M24 15l2.2 4.4 4.8.7-3.5 3.4.8 4.8L24 26l-4.3 2.3.8-4.8-3.5-3.4 4.8-.7L24 15z" fill="#fff"/><circle cx="37" cy="12" r="5" fill="#adc6ff"/></svg></span><strong>AI 出题</strong><span>按章节、难度、题型生成</span></button>
          <button type="button" class="qb-tool qb-tool--manual"><span class="qb-tool-ic" aria-hidden="true"><svg viewBox="0 0 48 48"><rect x="9" y="9" width="30" height="30" rx="9" fill="#fb923c"/><path d="M18 31l2.2-7.2L30.8 13.2a3.2 3.2 0 0 1 4.5 4.5L24.8 28.2 18 31z" fill="#fff"/><path d="M29 15l4 4" stroke="#fed7aa" stroke-width="3" stroke-linecap="round"/></svg></span><strong>手动出题</strong><span>单选、多选、判断、填空、简答</span></button>
          <button type="button" class="qb-tool qb-tool--import"><span class="qb-tool-ic" aria-hidden="true"><svg viewBox="0 0 48 48"><rect x="12" y="7" width="24" height="34" rx="7" fill="#10b981"/><path d="M28 7v9h8" fill="#a7f3d0"/><path d="M24 19v12M19 26l5 5 5-5" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></span><strong>导入题目</strong><span>支持 Word、Excel、PDF</span></button>
          <button type="button" class="qb-tool qb-tool--pick"><span class="qb-tool-ic" aria-hidden="true"><svg viewBox="0 0 48 48"><rect x="8" y="9" width="32" height="30" rx="9" fill="#8b5cf6"/><rect x="15" y="16" width="18" height="3" rx="1.5" fill="#fff"/><rect x="15" y="23" width="14" height="3" rx="1.5" fill="#fff" opacity=".75"/><circle cx="34" cy="33" r="7" fill="#ddd6fe"/><path d="M31 33h6M34 30v6" stroke="#6d28d9" stroke-width="2.6" stroke-linecap="round"/></svg></span><strong>现有题库选题</strong><span>从我的题库和配套题库组卷</span></button>
        </div>
      </div>`
    : `<div class="qb-compose-panel">
        <div class="qb-compose-head">
          <h2>完成老师发布的试卷任务</h2>
          <button type="button" class="qb-primary-btn">开始待完成试卷</button>
        </div>
        <div class="qb-student-note">提交后可自动批阅客观题，生成得分、错题和解析；主观题等待老师复核。</div>
      </div>`;
  body.innerHTML = `
    <div class="qb-hero">
      <div>
        <h1>题库</h1>
        <p>${escAttr(classNames.join('、')) || '暂无组群'} · 围绕本教材进行组卷、发布、作答与自动批阅。</p>
      </div>
      <div class="qb-hero-stats">
        <div><strong>${classes.length}</strong><span>关联组群</span></div>
        <div><strong>${isAdmin ? '5' : '2'}</strong><span>${isAdmin ? '待处理试卷' : '待完成任务'}</span></div>
        <div><strong>128</strong><span>题目资源</span></div>
      </div>
    </div>
    ${publishTools}
    <div class="qb-layout">
      <section class="qb-paper-list">
        <div class="qb-block-head">
          <h2>${isAdmin ? '我发布的试卷任务' : '老师发布的试卷任务'}</h2>
          <button type="button" class="qb-ghost-btn">查看全部</button>
        </div>
        ${questionBankPaperRows(book, classes, isAdmin)}
      </section>
      <div class="qb-section-grid">
        ${questionBankSectionCard('mine', '我的题库', isAdmin ? '沉淀个人创建、导入和收藏的题目。' : '查看已收藏题目和个人练习记录。', isAdmin ? '8 套题 · 46 题' : '3 套题 · 12 题', '进入')}
        ${questionBankSectionCard('support', '配套题库', '书中自带测试题与章节练习，可直接组卷。', '12 套题 · 82 题', '选题')}
        ${questionBankSectionCard('wrong', '错题集', isAdmin ? '按组群查看高频错题与薄弱知识点。' : '自动汇总我的错题，支持重做。', isAdmin ? '18 个高频错点' : '7 道待巩固', '查看')}
      </div>
    </div>`;
}

function openQuestionBankMode(book) {
  if (!book) return;
  const classes = getVisibleClassesForBook(book);
  if (!classes.length) {
    showProfileToast('这本教材暂未关联组群，加入或创建组群后可使用题库。');
    return;
  }
  closeReader();
  closeDetail();
  questionBankContext = {
    book,
    classes,
    isAdmin: classes.some(({ cls }) => cls.admin === getCurrentUserDisplayName()),
  };
  renderQuestionBankHome();
  const page = document.getElementById('questionBankPage');
  if (page) {
    page.classList.add('open');
    page.setAttribute('aria-hidden', 'false');
  }
  document.body.style.overflow = 'hidden';
}

function openQuestionBankAiModal() {
  const modal = document.getElementById('questionBankAiModal');
  if (!modal) return;
  const book = questionBankContext.book;
  const nameInput = document.getElementById('qbAiSetName');
  if (nameInput && book) nameInput.value = `${book.t} 习题集`;
  const chapter = document.getElementById('qbAiChapter');
  if (chapter && book) {
    chapter.innerHTML = `<option>${book.t} · 全书</option><option>第 1 单元 基础知识</option><option>第 2 单元 项目实践</option><option>第 3 单元 综合应用</option>`;
  }
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  updateQuestionBankAiReqCount();
}

function closeQuestionBankAiModal() {
  const modal = document.getElementById('questionBankAiModal');
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

function updateQuestionBankAiReqCount() {
  const ta = document.getElementById('qbAiRequirement');
  const out = document.getElementById('qbAiReqCount');
  if (!ta || !out) return;
  out.textContent = `${String(ta.value || '').length}/1000`;
}

function stepQuestionBankAiCount(id, delta) {
  const el = document.getElementById(id);
  if (!el) return;
  const next = Math.max(0, Math.min(99, (parseInt(el.value, 10) || 0) + delta));
  el.value = String(next);
}

function questionBankGeneratedQuestions() {
  if (String(questionBankContext.book?.t || '').includes('移动应用开发')) {
    return [
      {
        type: '选择题',
        score: 5,
        stem: 'Android 应用中用于展示一个界面并承载交互逻辑的核心组件通常是？',
        options: ['Activity', 'Manifest 权限', 'Gradle 仓库', 'Drawable 图片'],
        answer: 'A',
        analysis: 'Activity 是 Android 应用中承载界面和交互流程的重要组件。',
        points: ['Activity', 'Android组件'],
      },
      {
        type: '选择题',
        score: 5,
        stem: '下列哪项最适合用于在 Android 页面之间传递少量基础数据？',
        options: ['Intent extra', 'APK 签名文件', '图片资源目录', 'Gradle 缓存'],
        answer: 'A',
        analysis: 'Intent extra 常用于 Activity 之间传递字符串、数字等少量数据。',
        points: ['Intent', '页面跳转'],
      },
      {
        type: '填空题',
        score: 4,
        stem: 'Android 项目中声明应用权限、组件和启动入口的文件通常是 ______。',
        answer: 'AndroidManifest.xml',
        analysis: 'Manifest 文件用于描述应用的基础配置、权限与组件注册。',
        points: ['Manifest', '应用配置'],
      },
      {
        type: '填空题',
        score: 4,
        stem: 'Android 中用于表示设备无关像素、便于适配不同屏幕密度的单位是 ______。',
        answer: 'dp',
        analysis: 'dp 可降低不同屏幕密度下控件显示尺寸差异。',
        points: ['屏幕适配', 'dp单位'],
      },
      {
        type: '判断题',
        score: 3,
        stem: '移动应用适配不同屏幕尺寸时，只需要固定一个像素尺寸即可。',
        answer: '错误',
        analysis: '移动端需要考虑不同屏幕尺寸、密度和方向，通常使用 dp、约束布局和资源适配。',
        points: ['屏幕适配', '响应式布局'],
      },
      {
        type: '判断题',
        score: 3,
        stem: '在移动应用中申请相机、定位等敏感权限时，应向用户说明使用目的。',
        answer: '正确',
        analysis: '敏感权限涉及隐私，应遵循最小必要和明确告知原则。',
        points: ['权限管理', '隐私保护'],
      },
      {
        type: '简答题',
        score: 8,
        stem: '请简述移动应用登录功能设计时需要关注的安全要点。',
        answer: '应关注密码加密传输、Token 安全存储、登录失败限制、隐私授权和异常会话处理。',
        analysis: '登录功能涉及身份认证与敏感信息，应兼顾安全、隐私与用户体验。',
        points: ['登录安全', '隐私保护'],
      },
      {
        type: '简答题',
        score: 8,
        stem: '请说明 Android 应用做列表页面时，为什么常使用 RecyclerView。',
        answer: 'RecyclerView 适合展示大量列表数据，支持视图复用、滚动性能优化和灵活布局。',
        analysis: '该题关注列表控件选择及其性能优势。',
        points: ['RecyclerView', '列表性能'],
      },
    ];
  }
  return [
    {
      type: '选择题',
      score: 5,
      stem: '以下哪项最能体现人工智能系统“感知”的能力？',
      options: ['根据传感器采集图像并识别物体', '人工手动录入全部结论', '仅保存历史文件', '关闭网络连接'],
      answer: 'A',
      analysis: '感知能力强调从图像、语音、文本等数据中提取信息并形成可计算的表示。',
      points: ['机器感知', '图像识别'],
    },
    {
      type: '填空题',
      score: 4,
      stem: '人工智能三要素通常包括数据、算法和______。',
      answer: '算力',
      analysis: '数据提供样本，算法提供方法，算力支撑模型训练和推理。',
      points: ['人工智能基础'],
    },
    {
      type: '填空题',
      score: 4,
      stem: '为了评估模型在新样本上的表现，训练过程中通常会划分训练集和______集。',
      answer: '验证',
      analysis: '验证集用于调参与观察模型泛化效果。',
      points: ['模型评估', '数据划分'],
    },
    {
      type: '判断题',
      score: 3,
      stem: '机器学习模型训练完成后，在所有新场景中都不需要继续评估和优化。',
      answer: '错误',
      analysis: '模型上线后仍需持续评估数据漂移、准确率和业务效果。',
      points: ['模型评估'],
    },
    {
      type: '判断题',
      score: 3,
      stem: '使用 AI 生成内容时，仍需要核查事实准确性与版权来源。',
      answer: '正确',
      analysis: 'AI 生成内容可能存在事实错误和版权风险，需要人工核查。',
      points: ['AI伦理', '内容审核'],
    },
    {
      type: '简答题',
      score: 8,
      stem: '请简述在校园场景中使用人脸识别系统时需要关注的伦理与安全问题。',
      answer: '应关注个人信息授权、数据最小化采集、存储安全、误识别风险、公平性以及使用边界。',
      analysis: '该题关注技术应用中的隐私保护、算法公平和治理规范。',
      points: ['AI伦理', '数据安全'],
    },
    {
      type: '简答题',
      score: 8,
      stem: '请简述机器学习模型出现过拟合时，通常可以采取哪些改进方法。',
      answer: '可增加数据、进行数据增强、简化模型、加入正则化、交叉验证或早停等方法。',
      analysis: '该题考查对过拟合现象及常见缓解策略的理解。',
      points: ['过拟合', '模型优化'],
    },
    {
      type: '选择题',
      score: 5,
      stem: '在训练图像分类模型时，划分验证集的主要目的是什么？',
      options: ['评估模型在未参与训练数据上的表现', '减少图片文件大小', '替代所有训练数据', '隐藏模型参数'],
      answer: 'A',
      analysis: '验证集用于观察泛化能力，帮助调参并发现过拟合。',
      points: ['模型训练', '泛化能力'],
    },
  ];
}

function questionBankRenderQuestion(q, idx) {
  const optionHtml = q.options
    ? `<div class="qb-edit-options">${q.options.map((op, i) => `<div class="qb-edit-option"><span>${String.fromCharCode(65 + i)}</span>${escAttr(op)}</div>`).join('')}</div>`
    : '';
  const points = q.points.map((p) => `<span>${escAttr(p)}</span>`).join('');
  return `<article class="qb-edit-question" draggable="true" data-type="${escAttr(q.type)}" data-stem="${escAttr(q.stem)}" data-answer="${escAttr(q.answer)}" data-analysis="${escAttr(q.analysis)}" ondragstart="questionBankDragStart(event)" ondragover="questionBankDragOver(event)" ondrop="questionBankDrop(event)" ondragend="questionBankDragEnd(event)">
    <div class="qb-edit-q-head">
      <div class="qb-edit-q-title"><button type="button" class="qb-edit-drag" title="拖拽排序" aria-label="拖拽排序">⋮⋮</button><span>${idx + 1}</span>${escAttr(q.stem)}</div>
      <div class="qb-edit-q-actions">
        <button type="button" class="qb-edit-mini-btn" onclick="openQuestionEditModal(this)">编辑</button>
        <button type="button" class="qb-edit-mini-btn">删除</button>
        <input type="number" value="${q.score}" min="0" max="100" aria-label="题目分数">
        <em>分</em>
      </div>
    </div>
    ${optionHtml}
    <div class="qb-edit-answer">
      <div class="qb-edit-answer-row qb-edit-answer-row--answer"><strong>题目答案</strong><span>${escAttr(q.answer)}</span></div>
      <div class="qb-edit-answer-row qb-edit-answer-row--analysis"><strong>题目解析</strong><span>${escAttr(q.analysis)}</span></div>
      <div class="qb-edit-answer-row qb-edit-answer-row--points"><strong>知识点</strong><span class="qb-edit-points">${points}</span></div>
    </div>
  </article>`;
}

function questionBankEditActionHtml(kind, label, onclick) {
  const icons = {
    back: '<svg viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>',
    draft: '<svg viewBox="0 0 24 24"><path d="M5 4h11l3 3v13H5z"/><path d="M8 4v6h8"/><path d="M8 17h8"/></svg>',
    word: '<svg viewBox="0 0 24 24"><path d="M6 3h9l3 3v15H6z"/><path d="M15 3v5h5"/><path d="M8.5 11l1.2 6 1.6-4 1.6 4 1.2-6"/></svg>',
    score: '<svg viewBox="0 0 24 24"><path d="M4 6h16"/><path d="M7 12h10"/><path d="M10 18h4"/><circle cx="18" cy="18" r="3"/></svg>',
    preview: '<svg viewBox="0 0 24 24"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
    add: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    next: '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 5l7 7-7 7"/></svg>',
  };
  return `<button type="button" class="qb-edit-action qb-edit-action--${kind}" onclick="${onclick}"><span class="qb-edit-action-ic">${icons[kind] || icons.add}</span>${label}</button>`;
}

function questionBankRenderTypeGroup(type, list) {
  const total = list.reduce((sum, q) => sum + (q.score || 0), 0);
  return `<section class="qb-edit-type-group" data-type="${escAttr(type)}">
    <div class="qb-edit-type-head">
      <h3>${escAttr(type)}</h3>
      <span>${list.length} 题 · ${total} 分 · 同题型内可拖拽排序</span>
    </div>
    <div class="qb-edit-type-list">
      ${list.map(questionBankRenderQuestion).join('')}
    </div>
  </section>`;
}

function openQuestionBankPaperEditor(paperId = 'project') {
  closeQuestionBankAiModal();
  closeQuestionBankPaperPanel();
  const editor = document.getElementById('questionBankPaperEditor');
  if (!editor) return;
  editor.innerHTML = '';
  editor.dataset.paperId = paperId;
  const book = questionBankContext.book || myB[0];
  const questions = questionBankGeneratedQuestions();
  const grouped = questions.reduce((acc, q) => {
    acc[q.type] = (acc[q.type] || 0) + 1;
    return acc;
  }, {});
  const typeOrder = ['选择题', '填空题', '判断题', '简答题'];
  const groupsHtml = typeOrder
    .map((type) => {
      const list = questions.filter((q) => q.type === type);
      return list.length ? questionBankRenderTypeGroup(type, list) : '';
    })
    .join('');
  editor.innerHTML = `<div class="qb-edit-page">
    <header class="qb-edit-hero">
      <div class="qb-edit-topbar">
        ${questionBankEditActionHtml('back', '返回', 'closeQuestionBankPaperEditor()')}
        <div class="qb-edit-actions">
          ${questionBankEditActionHtml('preview', '预览试卷', 'previewQuestionBankPaperFromEditor()')}
          ${questionBankEditActionHtml('word', '导出为 Word', 'exportQuestionBankPaperWord()')}
          ${questionBankEditActionHtml('score', '批量设置分数', 'batchSetQuestionBankScores()')}
        </div>
      </div>
      <div class="qb-edit-title-wrap">
        <h2>${escAttr(book.t)} 习题集</h2>
        <p>AI 已生成题目草稿，可调整题目顺序、修改内容并导出使用。</p>
        <div class="qb-edit-summary">
          <span>共 ${questions.length} 题</span>
          <span>${Object.entries(grouped).map(([k, v]) => `${k} ${v}`).join(' · ')}</span>
        </div>
      </div>
    </header>
    <main class="qb-edit-body">
      <div class="qb-edit-section-head">
        <h3>题目列表</h3>
        ${questionBankEditActionHtml('add', '添加题目', 'addQuestionBankPaperQuestion()')}
      </div>
      ${groupsHtml}
    </main>
    <footer class="qb-edit-foot">
      ${questionBankEditActionHtml('draft', '保存草稿', 'saveQuestionBankPaperDraft()')}
      ${questionBankEditActionHtml('next', '下一步', 'nextQuestionBankPaperStep()')}
    </footer>
    <div class="qb-edit-modal" id="questionEditModal" aria-hidden="true">
      <div class="qb-edit-modal__bg" onclick="closeQuestionEditModal()"></div>
      <section class="qb-edit-modal__panel" role="dialog" aria-modal="true">
        <div class="qb-edit-modal__head">
          <h3>编辑题目</h3>
          <button type="button" onclick="closeQuestionEditModal()">关闭</button>
        </div>
        <label><span>题干</span><textarea id="questionEditStem" rows="4"></textarea></label>
        <label><span>题目答案</span><input id="questionEditAnswer" type="text"></label>
        <label><span>题目解析</span><textarea id="questionEditAnalysis" rows="3"></textarea></label>
        <div class="qb-edit-modal__foot">
          <button type="button" class="qb-ai-secondary" onclick="closeQuestionEditModal()">取消</button>
          <button type="button" class="qb-ai-primary" onclick="saveQuestionEditModal()">保存</button>
        </div>
      </section>
    </div>
  </div>`;
  editor.classList.add('open');
  editor.setAttribute('aria-hidden', 'false');
}

function questionBankDragStart(ev) {
  const card = ev.currentTarget;
  card.classList.add('is-dragging');
  ev.dataTransfer.effectAllowed = 'move';
  ev.dataTransfer.setData('text/plain', card.dataset.type || '');
}

function questionBankDragOver(ev) {
  ev.preventDefault();
  const target = ev.currentTarget;
  const dragging = document.querySelector('.qb-edit-question.is-dragging');
  if (!dragging || dragging === target || dragging.dataset.type !== target.dataset.type) return;
  const list = target.closest('.qb-edit-type-list');
  const box = target.getBoundingClientRect();
  if (!list) return;
  if (ev.clientY > box.top + box.height / 2) list.insertBefore(dragging, target.nextSibling);
  else list.insertBefore(dragging, target);
}

function questionBankDrop(ev) {
  ev.preventDefault();
  showProfileToast('已调整当前题型内的题目顺序。');
}

function questionBankDragEnd(ev) {
  ev.currentTarget.classList.remove('is-dragging');
}

function openQuestionEditModal(btn) {
  const card = btn.closest('.qb-edit-question');
  const modal = document.getElementById('questionEditModal');
  if (!card || !modal) return;
  modal.dataset.targetType = card.dataset.type || '';
  modal.dataset.targetIndex = [...card.parentElement.children].indexOf(card);
  document.getElementById('questionEditStem').value = card.dataset.stem || '';
  document.getElementById('questionEditAnswer').value = card.dataset.answer || '';
  document.getElementById('questionEditAnalysis').value = card.dataset.analysis || '';
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeQuestionEditModal() {
  const modal = document.getElementById('questionEditModal');
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

function saveQuestionEditModal() {
  closeQuestionEditModal();
  showProfileToast('题目修改已保存。');
}

function closeQuestionBankPaperEditor() {
  const editor = document.getElementById('questionBankPaperEditor');
  if (!editor) return;
  editor.classList.remove('open');
  editor.setAttribute('aria-hidden', 'true');
  editor.innerHTML = '';
  delete editor.dataset.paperId;
}

function previewQuestionBankPaperFromEditor() {
  const editor = document.getElementById('questionBankPaperEditor');
  const paperId = editor?.dataset.paperId || 'project';
  closeQuestionBankPaperEditor();
  openQuestionBankPaperPanel('preview', paperId);
}

function saveQuestionBankPaperDraft() {
  showProfileToast('试卷草稿已保存。');
}

function exportQuestionBankPaperWord() {
  showProfileToast('正在导出为 Word（演示）。');
}

function updateQuestionBankScoreTotal() {
  const total = Array.from(document.querySelectorAll('.qb-panel-score-grid input')).reduce((sum, input) => {
    const score = Number.parseFloat(input.value) || 0;
    const count = Number.parseInt(input.dataset.count || '1', 10);
    return sum + score * count;
  }, 0);
  const target = document.getElementById('questionBankScoreTotal');
  if (target) target.textContent = Number.isInteger(total) ? String(total) : total.toFixed(1);
}

function batchSetQuestionBankScores() {
  document.querySelectorAll('#questionBankPaperEditor .qb-edit-question input[type="number"]').forEach((inp) => {
    const type = inp.closest('.qb-edit-question')?.dataset.type;
    inp.value = type === '简答题' ? '8' : type === '判断题' ? '3' : type === '填空题' ? '4' : '5';
  });
  showProfileToast('已按题型批量设置分数。');
}

function nextQuestionBankPaperStep() {
  openQuestionBankPublishModal();
}

function addQuestionBankPaperQuestion() {
  showProfileToast('进入新增题目（演示）。');
}

function generateQuestionBankAiSet() {
  openQuestionBankPaperEditor();
}

function closeQuestionBankMode() {
  closeQuestionBankAiModal();
  closeQuestionBankPaperEditor();
  closeQuestionBankPaperPanel();
  closeQuestionBankPublishModal();
  const page = document.getElementById('questionBankPage');
  if (page) {
    page.classList.remove('open');
    page.setAttribute('aria-hidden', 'true');
  }
  questionBankContext = { book: null, classes: [], isAdmin: false };
  if (
    !document.getElementById('readerOverlay')?.classList.contains('open') &&
    !document.getElementById('teachModePage')?.classList.contains('open') &&
    !document.getElementById('avModePage')?.classList.contains('open') &&
    !document.getElementById('taskModePage')?.classList.contains('open')
  ) {
    document.body.style.overflow = '';
  }
}

/** 从阅读器进入非「阅读」学习模式时：关闭阅读层并提示（可对接各模式独立路由/站外页，不再在阅读页内切模式） */
function readerShowLearningModeNavExternal(modeKey, book) {
  if (modeKey === 'teach' && book) {
    openTeachMode(book);
    return;
  }
  if (modeKey === 'av' && book) {
    openAvMode(book);
    return;
  }
  if (modeKey === 'task' && book) {
    openTaskMode(book);
    return;
  }
  if (modeKey === 'questionBank' && book) {
    openQuestionBankMode(book);
    return;
  }
  const labels = { read: '阅读模式', av: '视听模式', task: '任务模式', kg: '知识图谱', teach: '教学模式', questionBank: '题库' };
  const name = labels[modeKey] || modeKey;
  const bookLine = book && book.t ? `《${book.t} · ${book.s}》` : '';
  showProfileToast(
    `正在进入「${name}」` + (bookLine ? ` · ${bookLine}` : '') + '（演示：可对接各模式独立页面）'
  );
}

/** 阅读顶栏模式 pill 前的彩色小图标（与模式 key 对应；阅读页内仅展示非 read 的入口） */
function readerModePillIconHtml(modeKey) {
  const ic = {
    read: `<span class="reader-mode-pill-icon" aria-hidden="true"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="#1d39c4" d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path fill="#597ef7" d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path fill="#85a5ff" d="M6.5 2H18v18H6.5A2.5 2.5 0 0 1 4 17.5v-13A2.5 2.5 0 0 1 6.5 2z" opacity=".4"/></svg></span>`,
    av: `<span class="reader-mode-pill-icon" aria-hidden="true"><svg width="17" height="17" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#8b5cf6"/><path fill="#fff" d="M10 8.5l5.5 3.5-5.5 3.5v-7z"/></svg></span>`,
    task: `<span class="reader-mode-pill-icon" aria-hidden="true"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="3" width="14" height="18" rx="2" fill="#f97316"/><path fill="#fff" fill-opacity=".9" d="M8 7h8v1.8H8V7zm0 3.2h5v1.8H8v-1.8z"/><path stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" d="M8.3 16.2l2.2 2.2 4.2-5"/></svg></span>`,
    kg: `<span class="reader-mode-pill-icon" aria-hidden="true"><svg width="17" height="17" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="5.5" cy="8" r="3" fill="#0ea5e9"/><circle cx="18.5" cy="8" r="3" fill="#6366f1"/><circle cx="12" cy="17" r="3" fill="#ec4899"/><path stroke="#94a3b8" stroke-width="1.3" stroke-linecap="round" d="M7.8 10.2l4.4 5M16.2 10.2l-4.4 5"/></svg></span>`,
    teach: `<span class="reader-mode-pill-icon" aria-hidden="true"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="11" rx="1" fill="none" stroke="#f59e0b"/><line x1="3" y1="10" x2="21" y2="10" stroke="#f59e0b"/></svg></span>`,
  };
  return ic[modeKey] || '';
}

/** 外链：?bookDetail= / ?bookDetailMy= → 教材详情页（与用户端点击书目卡片一致）；?readerLib= → 直达阅读器（可选） */
function consumeExternalBookQuery() {
  try {
    const q = new URLSearchParams(window.location.search);
    const lib = q.get('readerLib');
    const my = q.get('readerMy');
    const bdLib = q.get('bookDetail');
    const bdMy = q.get('bookDetailMy');
    let any = false;
    if (lib !== null && lib !== '') {
      sessionStorage.setItem('pendingReaderLib', lib);
      any = true;
    }
    if (my !== null && my !== '') {
      sessionStorage.setItem('pendingReaderMy', my);
      any = true;
    }
    if (bdLib !== null && bdLib !== '') {
      sessionStorage.setItem('pendingBookDetailLib', bdLib);
      any = true;
    }
    if (bdMy !== null && bdMy !== '') {
      sessionStorage.setItem('pendingBookDetailMy', bdMy);
      any = true;
    }
    if (any) {
      const url = new URL(window.location.href);
      url.searchParams.delete('readerLib');
      url.searchParams.delete('readerMy');
      url.searchParams.delete('bookDetail');
      url.searchParams.delete('bookDetailMy');
      window.history.replaceState({}, '', url.pathname + url.search + url.hash);
    }
  } catch (_) {}
}

function tryOpenPendingBookDetail() {
  if (!getUserProfile()) return;
  const dLib = sessionStorage.getItem('pendingBookDetailLib');
  const dMy = sessionStorage.getItem('pendingBookDetailMy');
  if (dLib !== null) {
    sessionStorage.removeItem('pendingBookDetailLib');
    const idx = parseInt(dLib, 10);
    if (!Number.isNaN(idx) && idx >= 0 && idx < books.length) {
      go('library');
      openDetail(idx, 'lib');
    }
    return;
  }
  if (dMy !== null) {
    sessionStorage.removeItem('pendingBookDetailMy');
    const idx = parseInt(dMy, 10);
    if (!Number.isNaN(idx) && idx >= 0 && idx < myB.length) {
      go('my');
      openDetail(idx, 'my');
    }
  }
}

function tryOpenPendingReader() {
  if (!getUserProfile()) return;
  const lib = sessionStorage.getItem('pendingReaderLib');
  const my = sessionStorage.getItem('pendingReaderMy');
  if (lib !== null) {
    sessionStorage.removeItem('pendingReaderLib');
    const idx = parseInt(lib, 10);
    if (!Number.isNaN(idx) && idx >= 0 && idx < books.length) openReader(idx, 'lib');
    return;
  }
  if (my !== null) {
    sessionStorage.removeItem('pendingReaderMy');
    const idx = parseInt(my, 10);
    if (!Number.isNaN(idx) && idx >= 0 && idx < myB.length) openReader(idx, 'my');
  }
}

function openReader(bookIdx, source) {
  const list = source === 'my' ? myB : books;
  const b = list[bookIdx];
  if (!b) return;
  readerBindSelectionToolbarOnce();
  readerHideSelectionToolbar(false);
  readerCloseQuizModal();
  readerActiveQuizSlot = 'a';
  readerContext = { bookIdx, source, b, currentCid: null };
  const tEl = document.getElementById('readerDocTitle');
  if (tEl) tEl.textContent = `${b.t} · ${b.s}`;
  const tocEl = document.getElementById('readerTocTree');
  if (tocEl) tocEl.innerHTML = renderReaderTocNodes(READER_OUTLINE, 0);
  let resolved = resolveLibReadModes(b);
  if (!resolved.length) {
    resolved = BOOK_READ_MODES.filter((m) => m.key !== 'teach');
  }
  const modeList = withTeachIfAdmin(resolved);
  const readerModeLinks = modeList.filter((m) => m.key !== 'read');
  const listEl = document.getElementById('readerModeList');
  const toolMode = document.getElementById('readerToolMode');
  if (listEl) {
    listEl.innerHTML = readerModeLinks
      .map(
        (m) =>
          `<button type="button" data-mode="${m.key}" class="reader-mode-pill reader-mode-pill--link" onclick="readerQuickMode('${m.key}')">${readerModePillIconHtml(m.key)}<span class="reader-mode-pill-label">${m.label}</span></button>`
      )
      .join('');
  }
  if (toolMode) {
    if (readerModeLinks.length > 0) {
      toolMode.style.display = '';
      toolMode.removeAttribute('hidden');
    } else {
      toolMode.style.display = 'none';
      toolMode.setAttribute('hidden', '');
    }
  }
  const entry = readerDefaultEntryCid();
  if (entry) readerGo(entry);
  const ov = document.getElementById('readerOverlay');
  if (ov) {
    ov.classList.add('open');
    ov.setAttribute('aria-hidden', 'false');
  }
  document.body.style.overflow = 'hidden';
  readerSetBg('paper', true);
  readerApplyFontSize(document.getElementById('readerFontRange')?.value || '17', true);
  renderReaderNotesList();
}

function closeReader() {
  readerHideSelectionToolbar(true);
  readerCloseICase();
  readerCloseLab();
  readerCloseQuizModal();
  const ov = document.getElementById('readerOverlay');
  if (ov) {
    ov.classList.remove('open', 'ai-open', 'notes-open', 'toc-collapsed');
    ov.setAttribute('aria-hidden', 'true');
  }
  document.body.style.overflow = '';
  readerCloseToolSlots();
}

// === 教学模式：课堂课件 + 可切换教材对照 + 悬浮工具，可接 CMS/课件包 ===
let teachContext = { b: null, currentCid: null, slideIndex: 0, showBook: false, slides: [] };
let _teachKeyHandler = null;
let _teachCountdownTimer = null;
let _teachCountdownLeft = 0;
let _teachPenOnResize = null;
let _teachOpenSubtool = null;
let _teachPenDrawing = false;
let _teachPenLast = { x: 0, y: 0 };
const DEFAULT_PICK_NAMES = '李明远\n张悦\n王浩\n陈欣\n刘洋\n赵明\n周婷\n何俊';

function buildTeachSlidesForBook(b) {
  const bt = b && b.t ? escAttr(`${b.t} · ${b.s}`) : '本教材';
  return [
    {
      k: '1',
      title: '本课导学与目标',
      kicker: '第 1 张',
      html: `<p class="teach-slide__lead">面向 <strong>${bt}</strong>。默认全屏显示<strong>课件</strong>。需要与课本对照时，点击顶栏 <strong>「课件 / 教材」</strong> 展开与教材的<strong>二分屏</strong>，再点即收起、回到仅课件。</p><ul class="teach-slide__list"><li>说清本课在模块中的位置与岗位/生活关联</li><li>用 2～3 个问题带出核心概念与课堂活动</li><li>点明与教材对应章节，便于学生翻书</li></ul>`,
    },
    {
      k: '2',
      title: '关键概念串讲',
      kicker: '第 2 张',
      html: `<p class="teach-slide__lead">将教材中的黑体术语与图表示意投影强化。展开「课件/教材」后可打开<strong>与阅读器同源的目录与正文</strong>指读「导读」与图。</p><ol class="teach-slide__olist"><li>用情境引入定义与符号</li><li>用正反例与边界条件</li><li>小结成「能复述、能举例子」的课堂检测句</li></ol>`,
    },
    {
      k: '3',
      title: '示范与规范',
      kicker: '第 3 张',
      html: `<p class="teach-slide__lead">示范操作/解题步骤、书写或实验安全要点。需要对照课本步骤时展开教材；右侧悬浮条可随时调用<strong>画笔、倒计时、抽问、AI 助手</strong>。</p><p class="teach-slide__hint">提示：正式环境可接入 PPT/PDF、互动课件或 H5 演示包。</p>`,
    },
    {
      k: '4',
      title: '课堂随练与小结',
      kicker: '第 4 张',
      html: `<p class="teach-slide__lead">形成性练习与小结。教材窗内可切到章末练习/拓展。悬浮工具中<strong>抽问、倒计时</strong>可穿插组织课堂活动。</p><ul class="teach-slide__list"><li>公布作答时限与计分/互评方式</li><li>点出与下节课衔接</li><li>布置纸数版作业与资源链接</li></ul>`,
    },
  ];
}

function teachRenderSlide() {
  const n = teachContext.slides.length;
  const i = Math.max(0, Math.min(teachContext.slideIndex, n - 1));
  teachContext.slideIndex = n ? i : 0;
  const s = n ? teachContext.slides[teachContext.slideIndex] : null;
  const el = document.getElementById('teachSlideView');
  const meta = document.getElementById('teachSlideMeta');
  if (meta) meta.textContent = n ? `${teachContext.slideIndex + 1} / ${n}` : '0 / 0';
  if (!el) return;
  if (!s) {
    el.innerHTML = '<p class="teach-slide__empty">暂无本教材的课件包（演示：可接 CMS 或上传 PPT/PDF 解析）。</p>';
    return;
  }
  const kick = s.kicker ? escAttr(s.kicker) : '';
  const t = escAttr(s.title);
  el.innerHTML = `<div class="teach-slide__content">
    ${kick ? `<div class="teach-slide__kicker">${kick}</div>` : ''}
    <h2 class="teach-slide__h2">${t}</h2>
    <div class="teach-slide__body">${s.html}</div>
  </div>`;
}

function teachPrevSlide() {
  if (teachContext.slideIndex <= 0) return;
  teachContext.slideIndex -= 1;
  teachRenderSlide();
}

function teachNextSlide() {
  if (teachContext.slideIndex >= teachContext.slides.length - 1) return;
  teachContext.slideIndex += 1;
  teachRenderSlide();
}

function teachSyncBookPanelUI() {
  const open = !!teachContext.showBook;
  const body = document.getElementById('teachModeBody');
  const p = document.getElementById('teachBookPanel');
  const btn = document.getElementById('teachToggleBookBtn');
  if (body) body.setAttribute('data-book-open', open ? 'true' : 'false');
  if (p) p.toggleAttribute('hidden', !open);
  if (btn) {
    btn.setAttribute('aria-pressed', open ? 'true' : 'false');
    btn.textContent = open ? '收起教材' : '课件 / 教材';
  }
}

function teachToggleBookPanel() {
  teachContext.showBook = !teachContext.showBook;
  teachSyncBookPanelUI();
}

function _teachFabSetActive(name, on) {
  const id = { pen: 'teachFabPen', timer: 'teachFabTimer', pick: 'teachFabPick', ai: 'teachFabAi' }[name];
  const el = id && document.getElementById(id);
  if (el) el.setAttribute('aria-pressed', on ? 'true' : 'false');
  el?.classList.toggle('is-on', !!on);
}

function teachSubtoolClose() {
  document.getElementById('teachToolPopTimer')?.setAttribute('hidden', '');
  document.getElementById('teachToolPopPick')?.setAttribute('hidden', '');
  document.getElementById('teachToolPopAi')?.setAttribute('hidden', '');
  _teachFabSetActive('timer', false);
  _teachFabSetActive('pick', false);
  _teachFabSetActive('ai', false);
  _teachOpenSubtool = null;
}

/** 右下教学工具条：默认收合，展开后显示全部子工具 */
function teachToolFloatSetOpen(open) {
  const nav = document.getElementById('teachToolFloat');
  const t = document.getElementById('teachToolFloatToggle');
  const list = document.getElementById('teachToolFloatList');
  const label = document.getElementById('teachToolFloatToggleLabel');
  if (!nav) return;
  nav.classList.toggle('teach-tool-float--open', !!open);
  if (list) {
    list.setAttribute('aria-hidden', open ? 'false' : 'true');
  }
  if (label) label.textContent = open ? '收合' : '教学工具';
  if (t) {
    t.setAttribute('aria-expanded', open ? 'true' : 'false');
    t.setAttribute('title', open ? '收合教学工具' : '展开教学工具（画笔、计时、抽问、AI）');
  }
  nav.setAttribute('data-tool-expanded', open ? 'true' : 'false');
}

function teachToolFloatToggle() {
  const nav = document.getElementById('teachToolFloat');
  if (!nav) return;
  const next = !nav.classList.contains('teach-tool-float--open');
  teachToolFloatSetOpen(next);
}

function teachToolFloatCollapse() {
  teachToolFloatSetOpen(false);
}

function _teachPenEndResize() {
  if (_teachPenOnResize) {
    window.removeEventListener('resize', _teachPenOnResize);
    _teachPenOnResize = null;
  }
}

function _teachPenSizeCanvas() {
  const c = document.getElementById('teachPenCanvas');
  if (!c || c.hasAttribute('hidden')) return;
  const w = window.innerWidth;
  const h = window.innerHeight;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  c.width = Math.floor(w * dpr);
  c.height = Math.floor(h * dpr);
  c.style.width = `${w}px`;
  c.style.height = `${h}px`;
  const ctx = c.getContext('2d');
  if (ctx) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgba(234, 88, 12, 0.92)';
  }
}

function teachPenClear() {
  const c = document.getElementById('teachPenCanvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  if (!ctx) return;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = window.innerWidth;
  const h = window.innerHeight;
  ctx.clearRect(0, 0, w, h);
}

let _teachPenEls = null;
function _teachPenUnbind() {
  if (!_teachPenEls) return;
  const { c, down, move, up } = _teachPenEls;
  c.removeEventListener('mousedown', down);
  c.removeEventListener('mousemove', move);
  c.removeEventListener('mouseup', up);
  c.removeEventListener('mouseleave', up);
  c.removeEventListener('touchstart', down);
  c.removeEventListener('touchmove', move);
  c.removeEventListener('touchend', up);
  _teachPenEls = null;
}
function _teachPenBind() {
  const c = document.getElementById('teachPenCanvas');
  if (!c || _teachPenEls) return;
  const getCtx = () => {
    const ctx = c.getContext('2d');
    if (ctx) {
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = 'rgba(234, 88, 12, 0.92)';
    }
    return ctx;
  };
  const down = (e) => {
    if (e.type === 'touchstart') e.preventDefault();
    const ctx = getCtx();
    if (!ctx) return;
    _teachPenDrawing = true;
    const { x, y } = _teachPenGetXY(e, c);
    _teachPenLast = { x, y };
  };
  const move = (e) => {
    if (!_teachPenDrawing) return;
    if (e.type === 'touchmove') e.preventDefault();
    const ctx = getCtx();
    if (!ctx) return;
    const { x, y } = _teachPenGetXY(e, c);
    ctx.beginPath();
    ctx.moveTo(_teachPenLast.x, _teachPenLast.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    _teachPenLast = { x, y };
  };
  const up = () => {
    _teachPenDrawing = false;
  };
  c.addEventListener('mousedown', down);
  c.addEventListener('mousemove', move);
  c.addEventListener('mouseup', up);
  c.addEventListener('mouseleave', up);
  c.addEventListener('touchstart', down, { passive: false });
  c.addEventListener('touchmove', move, { passive: false });
  c.addEventListener('touchend', up);
  _teachPenEls = { c, down, move, up };
}

function teachToolToggle(name) {
  if (!['pen', 'timer', 'pick', 'ai'].includes(name)) return;
  const page = document.getElementById('teachModePage');
  if (!page || !page.classList.contains('open')) return;
  teachToolFloatSetOpen(true);
  if (name === 'pen') {
    const c = document.getElementById('teachPenCanvas');
    const bar = document.getElementById('teachPenBar');
    const isOn = c && !c.hasAttribute('hidden');
    if (isOn) {
      _teachPenUnbind();
      c.setAttribute('hidden', '');
      c.setAttribute('aria-hidden', 'true');
      if (bar) bar.setAttribute('hidden', '');
      page.classList.remove('teach-mode--pen');
      _teachFabSetActive('pen', false);
      if (_teachOpenSubtool === 'pen') _teachOpenSubtool = null;
      _teachPenEndResize();
    } else {
      teachSubtoolClose();
      c.removeAttribute('hidden');
      c.setAttribute('aria-hidden', 'false');
      if (bar) bar.removeAttribute('hidden');
      page.classList.add('teach-mode--pen');
      _teachFabSetActive('pen', true);
      _teachOpenSubtool = 'pen';
      _teachPenSizeCanvas();
      _teachPenBind();
      _teachPenOnResize = () => {
        _teachPenUnbind();
        _teachPenSizeCanvas();
        teachPenClear();
        _teachPenBind();
      };
      window.addEventListener('resize', _teachPenOnResize);
    }
    return;
  }
  if (_teachOpenSubtool === 'pen' && (name === 'timer' || name === 'pick' || name === 'ai')) {
    _teachPenUnbind();
    const c2 = document.getElementById('teachPenCanvas');
    c2?.setAttribute('hidden', '');
    c2?.setAttribute('aria-hidden', 'true');
    document.getElementById('teachPenBar')?.setAttribute('hidden', '');
    page.classList.remove('teach-mode--pen');
    _teachFabSetActive('pen', false);
    _teachPenEndResize();
    _teachOpenSubtool = null;
  }
  const map = { timer: 'teachToolPopTimer', pick: 'teachToolPopPick', ai: 'teachToolPopAi' };
  const pop = document.getElementById(map[name]);
  if (!pop) return;
  const isOpen = !pop.hasAttribute('hidden');
  teachSubtoolClose();
  if (isOpen) return;
  pop.removeAttribute('hidden');
  _teachOpenSubtool = name;
  _teachFabSetActive(name, true);
}

function _teachPenGetXY(ev, canvas) {
  const r = canvas.getBoundingClientRect();
  const t = (ev.touches && ev.touches[0]) || (ev.changedTouches && ev.changedTouches[0]) || null;
  const clientX = t ? t.clientX : ev.clientX;
  const clientY = t ? t.clientY : ev.clientY;
  return { x: clientX - r.left, y: clientY - r.top };
}

function teachCountdownStart() {
  if (_teachCountdownTimer) {
    clearInterval(_teachCountdownTimer);
    _teachCountdownTimer = null;
  }
  const m = Math.max(0, parseInt(document.getElementById('teachTimerMin')?.value, 10) || 0);
  const s = Math.min(59, Math.max(0, parseInt(document.getElementById('teachTimerSec')?.value, 10) || 0));
  _teachCountdownLeft = m * 60 + s;
  if (_teachCountdownLeft <= 0) {
    showProfileToast('请设置正数时长');
    return;
  }
  const huge = document.getElementById('teachTimerHuge');
  const val = document.getElementById('teachTimerHugeVal');
  const tick = () => {
    if (_teachCountdownLeft < 0) {
      clearInterval(_teachCountdownTimer);
      _teachCountdownTimer = null;
      return;
    }
    const mm = Math.floor(_teachCountdownLeft / 60);
    const ss = _teachCountdownLeft % 60;
    if (val) {
      val.textContent = `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
    }
    if (huge) huge.removeAttribute('hidden');
    if (_teachCountdownLeft === 0) {
      clearInterval(_teachCountdownTimer);
      _teachCountdownTimer = null;
      showProfileToast('时间到');
      teachCountdownStop();
      return;
    }
    _teachCountdownLeft -= 1;
  };
  tick();
  _teachCountdownTimer = setInterval(tick, 1000);
}

function teachCountdownStop() {
  if (_teachCountdownTimer) {
    clearInterval(_teachCountdownTimer);
    _teachCountdownTimer = null;
  }
  _teachCountdownLeft = 0;
  const huge = document.getElementById('teachTimerHuge');
  if (huge) huge.setAttribute('hidden', '');
}

function teachPickRun() {
  const ta = document.getElementById('teachPickNames');
  const out = document.getElementById('teachPickResult');
  if (!out) return;
  const raw = (ta && ta.value) || '';
  const names = raw
    .split(/\n+/)
    .map((x) => x.trim())
    .filter(Boolean);
  const list = names.length ? names : DEFAULT_PICK_NAMES.split('\n');
  if (!list.length) {
    out.textContent = '请先填写名单';
    return;
  }
  const w = list[Math.floor(Math.random() * list.length)];
  out.textContent = w;
  out.classList.remove('is-pick-burst', 'is-flash');
  void out.offsetWidth;
  out.classList.add('is-pick-burst', 'is-flash');
  setTimeout(() => {
    out.classList.remove('is-flash', 'is-pick-burst');
  }, 650);
}

function teachAiSend() {
  const inp = document.getElementById('teachAiInput');
  const q = (inp && inp.value.trim()) || '';
  if (!q) return;
  const box = document.getElementById('teachAiMessages');
  if (!box) return;
  box.insertAdjacentHTML(
    'beforeend',
    `<div class="teach-ai-bubble teach-ai-bubble--user">${escAttr(q)}</div><div class="teach-ai-bubble">已记录。演示不连真实大模型，课堂正式环境可接校内 AI。</div>`
  );
  if (inp) inp.value = '';
  box.scrollTop = box.scrollHeight;
}

function teachToolTeardown() {
  _teachPenUnbind();
  teachCountdownStop();
  teachSubtoolClose();
  const c = document.getElementById('teachPenCanvas');
  c?.setAttribute('hidden', '');
  c?.setAttribute('aria-hidden', 'true');
  document.getElementById('teachPenBar')?.setAttribute('hidden', '');
  document.getElementById('teachModePage')?.classList.remove('teach-mode--pen');
  _teachPenEndResize();
  _teachFabSetActive('pen', false);
  const t = document.getElementById('teachAiMessages');
  if (t) t.innerHTML = '';
  const ta = document.getElementById('teachPickNames');
  if (ta) ta.value = '';
  if (document.getElementById('teachPickResult')) {
    document.getElementById('teachPickResult').textContent = '—';
  }
  teachToolFloatCollapse();
}

function teachGo(cid, opts) {
  if (!teachContext.b) return;
  teachContext.currentCid = cid;
  document.querySelectorAll('#teachTocTree .reader-toc-leaf').forEach((el) => {
    el.classList.toggle('is-active', el.dataset.cid === cid);
  });
  const art = document.getElementById('teachArticle');
  if (art) art.innerHTML = buildReaderArticleHtml(cid, teachContext.b);
  const m = document.getElementById('teachBookMain');
  if (m && (!opts || !opts.noScroll)) m.scrollTo(0, 0);
}

function _teachOnKey(ev) {
  if (!document.getElementById('teachModePage')?.classList.contains('open')) return;
  if (ev.key === 'ArrowLeft') {
    ev.preventDefault();
    teachPrevSlide();
  } else if (ev.key === 'ArrowRight') {
    ev.preventDefault();
    teachNextSlide();
  }
}

function openTeachMode(b) {
  if (!b) return;
  teachToolTeardown();
  teachContext = {
    b,
    currentCid: null,
    slideIndex: 0,
    showBook: false,
    slides: buildTeachSlidesForBook(b),
  };
  const titleEl = document.getElementById('teachModeBookTitle');
  if (titleEl) titleEl.textContent = `${b.t} · ${b.s}`;
  const sub = document.getElementById('teachModeBookSub');
  if (sub) {
    const pub = b.p && String(b.p).trim() ? ` · ${b.p}` : '';
    sub.textContent = `组群/课堂演示用 · 课件与教材可对照${pub}（演示数据）`;
  }
  const toc = document.getElementById('teachTocTree');
  if (toc) toc.innerHTML = renderReaderTocNodes(READER_OUTLINE, 0, 'teachGo');
  const start = readerDefaultEntryCid();
  if (start) teachGo(start, { noScroll: false });
  else {
    const art = document.getElementById('teachArticle');
    if (art) art.innerHTML = '<p class="teach-slide__empty">无可用目录。</p>';
  }
  teachSyncBookPanelUI();
  {
    const ta = document.getElementById('teachPickNames');
    if (ta && !String(ta.value || '').trim()) ta.value = DEFAULT_PICK_NAMES;
  }
  teachRenderSlide();
  const page = document.getElementById('teachModePage');
  if (page) {
    page.classList.add('open');
    page.setAttribute('aria-hidden', 'false');
  }
  document.body.style.overflow = 'hidden';
  if (_teachKeyHandler) {
    document.removeEventListener('keydown', _teachKeyHandler, true);
  }
  _teachKeyHandler = _teachOnKey;
  document.addEventListener('keydown', _teachKeyHandler, true);
  setTimeout(() => {
    document.getElementById('teachDeckFocus')?.focus({ preventScroll: true });
  }, 0);
}

function closeTeachMode() {
  if (_teachKeyHandler) {
    document.removeEventListener('keydown', _teachKeyHandler, true);
    _teachKeyHandler = null;
  }
  teachToolTeardown();
  const page = document.getElementById('teachModePage');
  if (page) {
    page.classList.remove('open');
    page.setAttribute('aria-hidden', 'true');
  }
  const art = document.getElementById('teachArticle');
  if (art) art.innerHTML = '';
  const toc = document.getElementById('teachTocTree');
  if (toc) toc.innerHTML = '';
  teachContext = { b: null, currentCid: null, slideIndex: 0, showBook: false, slides: [] };
  teachSyncBookPanelUI();
  if (
    !document.getElementById('readerOverlay')?.classList.contains('open') &&
    !document.getElementById('avModePage')?.classList.contains('open') &&
    !document.getElementById('taskModePage')?.classList.contains('open') &&
    !document.getElementById('questionBankPage')?.classList.contains('open')
  ) {
    document.body.style.overflow = '';
  }
}

function openReaderFromDetail() {
  const { bookIdx, source, b } = detailViewContext;
  if (bookIdx == null || !b) return;
  closeDetail();
  openReader(bookIdx, source);
}

/** 详情「学习模式」卡：阅读进阅读器；教学 / 视听为独立全屏页；其余模式仍为演示提示（可对接独立页） */
function openReaderFromDetailMode(modeKey) {
  const { bookIdx, source, b } = detailViewContext;
  if (bookIdx == null || !b) return;
  const teachOk = isCurrentUserClassGroupAdmin() ? ['teach'] : [];
  const valid = new Set(['read', 'av', 'task', 'kg', ...teachOk]);
  const k = valid.has(modeKey) ? modeKey : 'read';

  if (source === 'lib' && !isLibBookPurchased(b)) {
    if (k === 'read') {
      closeDetail();
      openReader(bookIdx, 'lib');
      return;
    }
    closeDetail();
    readerShowLearningModeNavExternal(k, b);
    return;
  }

  closeDetail();
  if (k === 'read') {
    openReader(bookIdx, source);
    return;
  }
  readerShowLearningModeNavExternal(k, b);
}

function readerQuickMode(k) {
  if (k === 'read') return;
  readerCloseToolSlots();
  const b = readerContext && readerContext.b;
  closeReader();
  readerShowLearningModeNavExternal(k, b);
}

function readerToggleAi() {
  readerCloseToolSlots();
  readerHideSelectionToolbar(false);
  const ov = document.getElementById('readerOverlay');
  if (!ov) return;
  ov.classList.toggle('ai-open');
  ov.classList.remove('notes-open');
  if (ov.classList.contains('ai-open') && !document.getElementById('readerAiMessages')?.dataset.inited) {
    const box = document.getElementById('readerAiMessages');
    if (box) {
      box.innerHTML = `<div class="reader-ai-bubble">你好，我是阅读助手。可为你讲解本课生词、段落大意与阅读题思路。</div>`;
      box.dataset.inited = '1';
    }
  }
}

function readerSendAi() {
  const inp = document.getElementById('readerAiInput');
  const q = (inp && inp.value.trim()) || '';
  if (!q) return;
  const box = document.getElementById('readerAiMessages');
  if (!box) return;
  box.insertAdjacentHTML(
    'beforeend',
    `<div class="reader-ai-bubble reader-ai-bubble--user">${escAttr(q)}</div><div class="reader-ai-bubble">已收到。演示环境不连接真实大模型，可对接业务接口后返回答案。</div>`
  );
  inp.value = '';
  box.scrollTop = box.scrollHeight;
}

function readerToggleNotes() {
  readerCloseToolSlots();
  readerHideSelectionToolbar(false);
  const ov = document.getElementById('readerOverlay');
  if (!ov) return;
  ov.classList.toggle('notes-open');
  ov.classList.remove('ai-open');
}

function readerSaveNote() {
  const ta = document.getElementById('readerNotesTextarea');
  const text = (ta && ta.value.trim()) || '';
  if (!text) {
    showProfileToast('请先输入笔记内容');
    return;
  }
  readerNotesStore.push({ text, t: Date.now(), cid: readerContext.currentCid });
  if (ta) ta.value = '';
  renderReaderNotesList();
  showProfileToast('笔记已保存（演示）');
}

function renderReaderNotesList() {
  const list = document.getElementById('readerNotesList');
  if (!list) return;
  if (!readerNotesStore.length) {
    list.innerHTML = '<p style="color:var(--silver);font-size:12px;margin:0">暂无笔记</p>';
    return;
  }
  list.innerHTML = readerNotesStore
    .map(
      (n) =>
        `<div class="reader-note-item"><div class="reader-note-time">${new Date(n.t).toLocaleString()}</div>${escAttr(n.text)}</div>`
    )
    .reverse()
    .join('');
}

function readerToggleModePanel() {
  const m = document.getElementById('readerToolMode');
  if (!m || m.hasAttribute('hidden') || m.style.display === 'none') return;
  const d = document.getElementById('readerToolDisplay');
  const s = document.getElementById('readerToolSearch');
  m.classList.toggle('is-open');
  d?.classList.remove('is-open');
  s?.classList.remove('is-open');
  const btn = document.getElementById('readerModeToolBtn');
  if (btn) btn.setAttribute('aria-expanded', m.classList.contains('is-open') ? 'true' : 'false');
}

function readerToggleDisplayPanel() {
  const m = document.getElementById('readerToolMode');
  const d = document.getElementById('readerToolDisplay');
  const s = document.getElementById('readerToolSearch');
  if (!d) return;
  d.classList.toggle('is-open');
  m?.classList.remove('is-open');
  s?.classList.remove('is-open');
  const btn = document.getElementById('readerModeToolBtn');
  if (btn) btn.setAttribute('aria-expanded', 'false');
}

function readerToggleSearch() {
  const m = document.getElementById('readerToolMode');
  const d = document.getElementById('readerToolDisplay');
  const s = document.getElementById('readerToolSearch');
  if (!s) return;
  s.classList.toggle('is-open');
  m?.classList.remove('is-open');
  d?.classList.remove('is-open');
  const btn = document.getElementById('readerModeToolBtn');
  if (btn) btn.setAttribute('aria-expanded', 'false');
  if (s.classList.contains('is-open')) {
    setTimeout(() => document.getElementById('readerSearchInput')?.focus(), 30);
  }
}

function readerOnSearchInput() {
  const q = (document.getElementById('readerSearchInput')?.value || '').trim().toLowerCase();
  document.querySelectorAll('#readerTocTree .reader-toc-leaf').forEach((el) => {
    const t = (el.dataset.search || el.textContent || '').toLowerCase();
    el.classList.toggle('reader-toc-dim', !!q && !t.includes(q));
  });
}

function readerCloseToolSlots() {
  document.querySelectorAll('.reader-tool-slot.is-open').forEach((el) => el.classList.remove('is-open'));
  const modeBtn = document.getElementById('readerModeToolBtn');
  if (modeBtn) modeBtn.setAttribute('aria-expanded', 'false');
}

function readerClosePopovers() {
  readerCloseToolSlots();
  readerHideSelectionToolbar(false);
}

function readerApplyFontSize(px, silent) {
  const n = Math.min(22, Math.max(14, parseInt(px, 10) || 17));
  const main = document.getElementById('readerMain');
  if (main) main.style.setProperty('--reader-font', `${n}px`);
  const fv = document.getElementById('readerFontVal');
  if (fv) fv.textContent = `${n}px`;
  const r = document.getElementById('readerFontRange');
  if (r) r.value = String(n);
}

function readerSetBg(mode, silent) {
  const main = document.getElementById('readerMain');
  if (main) main.setAttribute('data-bg', mode);
  document.querySelectorAll('.reader-bg-swatch').forEach((s) => {
    s.classList.toggle('is-active', s.dataset.bg === mode);
  });
}

function readerToggleTocCollapse() {
  document.getElementById('readerOverlay')?.classList.toggle('toc-collapsed');
}

document.getElementById('readerFontRange')?.addEventListener('input', (e) => {
  readerApplyFontSize(e.target.value, true);
});

Object.assign(window, {
  go, renderLib, openLibraryCatalog, closeLibraryCatalog, onLibrarySearchInput, openDetail, closeDetail, switchTab, toggleUnit, handleBuy, handlePrint, onTocLockedClick,
  openRedeem, closeRedeem, doRedeem, openCreateClass, closeCreateClass, doCreateClass,
  openJoinClass, closeJoinClass, doJoinClass,
  openClassDetail, closeClassDetail, copyCode, openBookPicker, closeBookPicker, dissolveClass, leaveClass,
  addBookToClass, removeClassBook, setGradeFilter, setSubjectFilter, setMyShelfTab, openMyGroupsView, backToMyShelf,
  openSchoolModal, closeSchoolModal, confirmSchoolBind, clearSchoolBind,
  bookShortcut,
  toggleMineShelfMore, closeAllMineShelfMore,
  openReader, closeReader, openReaderFromDetail, openReaderFromDetailMode, tryOpenPendingBookDetail, tryOpenPendingReader, readerGo, readerToggleTocGroup,
  readerOpenQuizModal, readerCloseQuizModal, readerSubmitQuizModal, readerQuizPickChoice, readerQuizPickTf,
  readerOpenLab, readerCloseLab, readerOpenICase, readerCloseICase,
  readerQuizGoNext, readerQuizGoPrev, readerQuizJumpToStep, readerQuizOnInputChanged, readerOpenSavedReport,
  readerQuickMode, teachGo, openTeachMode, closeTeachMode, teachPrevSlide, teachNextSlide,
  closeAvMode, setAvModeTab, selectAvLesson, toggleAvUnit, avOnAvMediaEnded,
  openTaskMode, closeTaskMode, taskSelectProject, taskSelectItem, taskStartTask, taskStartCurrent,
  openQuestionBankMode, closeQuestionBankMode, openQuestionBankAiModal, closeQuestionBankAiModal, updateQuestionBankAiReqCount, stepQuestionBankAiCount, generateQuestionBankAiSet,
  openQuestionBankPaperPanel, closeQuestionBankPaperPanel, openQuestionBankMemberReport, withdrawQuestionBankPaper,
  openQuestionBankLibraryList, openQuestionBankLibraryDetail, deleteQuestionBankLibraryItem,
  openQuestionBankPaperEditor, closeQuestionBankPaperEditor, previewQuestionBankPaperFromEditor, saveQuestionBankPaperDraft, exportQuestionBankPaperWord, updateQuestionBankScoreTotal, batchSetQuestionBankScores, nextQuestionBankPaperStep, addQuestionBankPaperQuestion,
  questionBankDragStart, questionBankDragOver, questionBankDrop, questionBankDragEnd, openQuestionEditModal, closeQuestionEditModal, saveQuestionEditModal,
  openQuestionBankPublishModal, closeQuestionBankPublishModal, submitQuestionBankPublish,
  teachToggleBookPanel, teachToolFloatToggle, teachToolToggle, teachCountdownStart, teachCountdownStop, teachPenClear, teachPickRun, teachAiSend,
  readerToggleAi, readerSendAi, readerToggleNotes, readerSaveNote, readerToggleSearch, readerOnSearchInput,
  readerSelectionActionAi, readerSelectionActionHighlight, readerSelectionActionNote, readerSelectionActionCopy,
  readerToggleModePanel, readerToggleDisplayPanel, readerClosePopovers, readerCloseToolSlots, readerApplyFontSize, readerSetBg, readerToggleTocCollapse,
  renderSettings, handleSettingsAvatar, openPhoneModal, closePhoneModal, sendPhoneChangeCode, confirmPhoneChange,
  openPasswordModal, closePasswordModal, confirmPasswordChange, logoutAccount,
  setLoginTab, sendLoginSmsCode, submitLoginPassword, submitLoginOtp,
  showLoginMain, showLoginRegister, showLoginForgot,
  sendRegisterSmsCode, sendForgotSmsCode, submitRegister, submitForgotPassword,
  onFeedbackFilesChange, removeFeedbackImage, submitUserFeedback, openFeedbackModal, closeFeedbackModal
});
