const projects = [
  {
    title: "缤果数字教材",
    type: "产品设计 / 前端实现",
    summary:
      "面向读者端、作者端与出版社端的数字教材工作台，覆盖教材商城、书架、阅读器、审稿流与内容生产。",
    image: "/work-smart-reader.png",
    metrics: ["3 个业务端", "多角色流程", "响应式界面"],
  },
  {
    title: "AI 阅读辅助体验",
    type: "交互原型",
    summary:
      "把划线、批注、知识点解释和学习任务组织在阅读上下文里，减少学生在工具之间切换的成本。",
    metrics: ["沉浸阅读", "学习任务", "知识结构"],
  },
  {
    title: "内容生产后台",
    type: "工作流系统",
    summary:
      "为编辑、作者和出版社协作设计清晰的章节、资源、审稿与发布流程，让复杂内容管理更容易追踪。",
    metrics: ["审稿状态", "资源管理", "协作发布"],
  },
];

const strengths = [
  "把业务流程整理成稳定、可复用的界面结构",
  "用高保真前端原型快速验证产品方向",
  "关注信息层级、表单效率和长时间使用的舒适度",
  "能在视觉、交互和工程实现之间做取舍",
];

const timeline = [
  {
    period: "现在",
    title: "数字教育产品",
    text: "聚焦数字教材、阅读器、内容生产与出版社工作流，持续打磨多角色 SaaS 型体验。",
  },
  {
    period: "近期",
    title: "AI 辅助学习界面",
    text: "探索把大模型能力嵌入真实学习场景，而不是只停留在聊天窗口。",
  },
  {
    period: "长期",
    title: "复杂系统产品化",
    text: "喜欢把混乱需求拆成清楚路径，让用户能在高密度工具里稳定前进。",
  },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="返回首页">
          <span className="brand-mark" aria-hidden="true">
            L
          </span>
          <span>Leo Portfolio</span>
        </a>
        <nav className="nav" aria-label="页面导航">
          <a href="#work">作品</a>
          <a href="#about">能力</a>
          <a href="#contact">联系</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Product minded builder</p>
          <h1>把复杂业务做成清楚、可靠、好用的数字产品。</h1>
          <p className="hero-text">
            我是 Leo，关注产品设计、前端实现和 AI 工具化体验。擅长把模糊需求变成可演示、可迭代、可交付的界面系统。
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#work">
              查看作品
            </a>
            <a className="button button-ghost" href="mailto:hello@example.com">
              发邮件
            </a>
          </div>
        </div>
        <div className="hero-panel" aria-label="作品集概览">
          <div className="panel-bar">
            <span />
            <span />
            <span />
          </div>
          <div className="panel-body">
            <div>
              <p className="panel-label">Focus</p>
              <h2>Digital textbook platform</h2>
            </div>
            <img
              src="/work-smart-reader.png"
              alt="缤果数字教材界面预览"
              width="1774"
              height="887"
            />
          </div>
        </div>
      </section>

      <section className="section" id="work">
        <div className="section-head">
          <p className="eyebrow">Selected work</p>
          <h2>近期作品</h2>
        </div>
        <div className="project-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.title}>
              {project.image ? (
                <img src={project.image} alt={`${project.title}界面预览`} />
              ) : (
                <div className="project-visual" aria-hidden="true">
                  <span>{project.title.slice(0, 2)}</span>
                </div>
              )}
              <div className="project-content">
                <p>{project.type}</p>
                <h3>{project.title}</h3>
                <span>{project.summary}</span>
                <div className="metric-row">
                  {project.metrics.map((metric) => (
                    <strong key={metric}>{metric}</strong>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section split" id="about">
        <div className="section-head">
          <p className="eyebrow">How I work</p>
          <h2>能力与方法</h2>
          <p className="section-copy">
            我更偏向“能跑起来的产品思维”：先抓住用户任务，再把界面、数据和交互状态整理成可以持续迭代的系统。
          </p>
        </div>
        <div className="strength-list">
          {strengths.map((item) => (
            <div className="strength-item" key={item}>
              <span aria-hidden="true" />
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section timeline-section">
        <div className="section-head">
          <p className="eyebrow">Trajectory</p>
          <h2>正在建立的方向</h2>
        </div>
        <div className="timeline">
          {timeline.map((item) => (
            <article key={item.title}>
              <p>{item.period}</p>
              <h3>{item.title}</h3>
              <span>{item.text}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="contact" id="contact">
        <div>
          <p className="eyebrow">Contact</p>
          <h2>想聊一个产品、原型或网站？</h2>
        </div>
        <a className="button button-primary" href="mailto:hello@example.com">
          hello@example.com
        </a>
      </section>
    </main>
  );
}
