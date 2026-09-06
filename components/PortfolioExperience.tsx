"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import site from "@/src/content/site.json";
import { asset } from "@/app/seo";

type Experience = { period: string; role: string; company: string; summary: string };
type Skill = { id: string; label: string; statement: string; tools: string };
type Education = { school: string; degree: string; year: string };
type HomeContent = {
  availability: string;
  heroLead: string;
  manifestoTitle: string;
  manifestoBody: string;
  experience: Experience[];
  skills: Skill[];
  education: Education[];
};
type Ui = {
  skipToContent: string;
  homeAria: string;
  navAria: string;
  socialAria: string;
  tickerAria: string;
  skillsAria: string;
  langLabel: string;
  nav: { work: string; whatIDo: string; about: string };
  sayHello: string;
  sayHelloDot: string;
  heroAria: string;
  heroTitle: [string, string, string];
  jumpAria: string;
  badge: [string, string];
  rail: [string, string, string];
  workEyebrow: string;
  workHeading: [string, string];
  skillsEyebrow: string;
  skillsHeading: [string, string];
  aboutIntro: string;
  languageNote: string;
  contactPrompt: [string, string];
  footerTag: string;
  resume: string;
};

const LOCALES = [
  { code: "en", label: "English", path: "/", glyph: "A" },
  { code: "es", label: "Español", path: "/es/", glyph: "ñ" },
  { code: "ja", label: "日本語", path: "/ja/", glyph: "あ" },
  { code: "zh", label: "中文", path: "/zh/", glyph: "文" },
  { code: "ko", label: "한국어", path: "/ko/", glyph: "가" },
];

const MAIL = site.contact.emailUrl || `mailto:${site.contact.email}`;

function Arrow({ down = false }: { down?: boolean }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path d={down ? "M12 4v15m0 0 6-6m-6 6-6-6" : "M5 19 19 5m0 0H8m11 0v11"} /></svg>;
}

function TwoLine({ lines }: { lines: [string, string] }) {
  return <>{lines[0]}<br />{lines[1]}</>;
}

function SkillVisual({ id }: { id: string }) {
  if (id === "code") return <div className="code-visual" aria-hidden="true"><span>const idea =</span><strong>await makeUseful()</strong><span>ship(idea)</span><i /></div>;
  if (id === "build") return <div className="build-visual" aria-hidden="true"><i /><i /><i /><span>01 → 03</span></div>;
  if (id === "data") return <svg className="data-visual" viewBox="0 0 520 260" aria-hidden="true"><path className="data-grid" d="M20 50h480M20 105h480M20 160h480M20 215h480"/><motion.path d="M20 203 C80 190 88 133 150 151 S250 77 302 102 S410 25 500 43" fill="none" pathLength="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, ease: [0.16,1,0.3,1] }}/><circle cx="302" cy="102" r="7"/><circle cx="500" cy="43" r="7"/></svg>;
  if (id === "ship") return <div className="ship-visual" aria-hidden="true"><span className="ship-core">LIVE</span>{[0,1,2,3].map((n) => <i key={n} />)}<b>EDGE NETWORK</b></div>;
  if (id === "ai") return <div className="ai-visual" aria-hidden="true"><span>CONTEXT</span><i>+</i><span>MODEL</span><strong>USEFUL ANSWER</strong></div>;
  return <div className="human-visual" aria-hidden="true"><span>人</span><div><strong>human, person</strong><small>ひと · hito</small></div></div>;
}

export default function PortfolioExperience({ content, t, locale }: { content: HomeContent; t: Ui; locale: string }) {
  const reduceMotion = useReducedMotion();
  const [activeSkill, setActiveSkill] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const progress = useSpring(scrollYProgress, { stiffness: 150, damping: 28, mass: 0.3 });
  const portraitY = useTransform(heroProgress, [0, 1], [0, reduceMotion ? 0 : 110]);
  const portraitRotate = useTransform(heroProgress, [0, 1], [2, reduceMotion ? 2 : -4]);
  const skill = content.skills[activeSkill];
  const ticker = "REACT · TYPESCRIPT · DATA · SQL · AUTOMATION · CLOUDFLARE · FRAMER · AI · ";

  return <div className="locale-root" lang={locale}>
    <motion.div className="scroll-progress" style={{ scaleX: progress }} />
    <a className="skip-link" href="#main-content">{t.skipToContent}</a>

    <header className="site-header shell">
      <a className="wordmark" href="#top" aria-label={t.homeAria}><span>{site.owner.split(" ")[0]}</span><span>{site.owner.split(" ").slice(1).join(" ")}</span></a>
      <nav aria-label={t.navAria}><a href="#work">{t.nav.work}</a><a href="#skills">{t.nav.whatIDo}</a><a href="#about">{t.nav.about}</a></nav>
      <div className="header-tools">
        <label className="locale-switch">
          <span className="sr-only">{t.langLabel}</span>
          <span className="locale-glyph" aria-hidden="true">{LOCALES.find((l) => l.code === locale)?.glyph}</span>
          <select value={locale} onChange={(e) => {
            const next = LOCALES.find((l) => l.code === e.target.value);
            if (next) window.location.assign(next.path);
          }}>
            {LOCALES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>
        </label>
        <a className="header-action" href={MAIL}>{t.sayHello} <Arrow /></a>
      </div>
    </header>

    <main id="main-content">
      <section id="top" className="hero shell" ref={heroRef}>
        <div className="hero-copy">
          <div className="availability"><i /><span>{content.availability}</span></div>
          <h1 aria-label={t.heroAria}>
            <motion.span initial={{ y: reduceMotion ? 0 : "110%" }} animate={{ y: 0 }} transition={{ duration: .85, ease: [0.16,1,0.3,1] }}>{t.heroTitle[0]}</motion.span>
            <motion.span initial={{ y: reduceMotion ? 0 : "110%" }} animate={{ y: 0 }} transition={{ duration: .85, delay: .08, ease: [0.16,1,0.3,1] }}>{t.heroTitle[1]}</motion.span>
            <motion.em initial={{ y: reduceMotion ? 0 : "110%" }} animate={{ y: 0 }} transition={{ duration: .85, delay: .16, ease: [0.16,1,0.3,1] }}>{t.heroTitle[2]}</motion.em>
          </h1>
          <motion.div className="hero-bottom" initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .45 }}>
            <p>{content.heroLead}</p>
            <a className="round-link" href="#skills" aria-label={t.jumpAria}><Arrow down /></a>
          </motion.div>
        </div>
        <motion.div className="portrait-stage" style={{ y: portraitY, rotate: portraitRotate }} initial={{ opacity: 0, clipPath: reduceMotion ? "inset(0)" : "inset(100% 0 0 0)" }} animate={{ opacity: 1, clipPath: "inset(0 0 0 0)" }} transition={{ duration: 1, delay: .28, ease: [0.16,1,0.3,1] }}>
          <div className="portrait-disc" />
          <img src={asset("/headshot.svg")} alt={`Portrait of ${site.owner}`} />
          <div className="portrait-note"><span>{t.badge[0]}</span><strong>{t.badge[1]}</strong></div>
        </motion.div>
        <div className="hero-rail" aria-hidden="true"><span>{t.rail[0]}</span><span>{t.rail[1]}</span><span>{t.rail[2]}</span></div>
      </section>

      <section className="manifesto shell">
        <div className="manifesto-mark" aria-hidden="true">↳</div>
        <div><h2>{content.manifestoTitle}</h2><p>{content.manifestoBody}</p></div>
      </section>

      <section id="work" className="work-section">
        <div className="shell">
          <header className="work-header"><p>{t.workEyebrow}</p><h2><TwoLine lines={t.workHeading} /></h2></header>
          <div className="timeline">{content.experience.map((item, index) => <motion.article className="timeline-item" key={item.role} initial={{ opacity: .7 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: .45 }}>
            <span className="timeline-count">{String(index + 1).padStart(2,"0")}</span><p className="period">{item.period}</p><div className="timeline-title"><h3>{item.role}</h3><p>{item.company}</p></div><p className="timeline-summary">{item.summary}</p><span className="timeline-arrow"><Arrow /></span>
          </motion.article>)}</div>
        </div>
      </section>

      <section id="skills" className="skills-section shell">
        <header className="skills-header"><p>{t.skillsEyebrow}</p><h2><TwoLine lines={t.skillsHeading} /></h2></header>
        <div className="skill-system">
          <div className="skill-nav" role="tablist" aria-label={t.skillsAria}>{content.skills.map((item, index) => <button key={item.id} role="tab" aria-selected={activeSkill === index} aria-controls="skill-demo" onClick={() => setActiveSkill(index)}><span>{String(index + 1).padStart(2,"0")}</span><strong>{item.label}</strong><i /></button>)}</div>
          <motion.div id="skill-demo" className={`skill-demo skill-${skill.id}`} role="tabpanel" aria-live="polite" key={skill.id} initial={{ opacity: reduceMotion ? 1 : 0, scale: reduceMotion ? 1 : .985 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .45, ease: [0.16,1,0.3,1] }}>
            <div className="skill-copy"><span>{skill.label}</span><h3>{skill.statement}</h3><p>{skill.tools}</p></div><SkillVisual id={skill.id} />
          </motion.div>
        </div>
      </section>

      <section className="ticker" aria-label={t.tickerAria}><div>{ticker}<span aria-hidden="true">{ticker}</span></div></section>

      <section id="about" className="about-section shell">
        <div className="about-portrait"><img src={asset("/headshot.svg")} alt={`Portrait of ${site.owner}`} /></div>
        <div className="about-content"><p className="about-intro">{t.aboutIntro}</p><div className="education">{content.education.map((item) => <div key={item.school}><span>{item.year}</span><h3>{item.school}</h3><p>{item.degree}</p></div>)}</div><p className="language-note"><span>日本語</span> {t.languageNote}</p></div>
      </section>

      <section className="contact-section"><div className="shell"><p><TwoLine lines={t.contactPrompt} /></p><a href={MAIL}>{t.sayHelloDot}<Arrow /></a></div></section>
    </main>

    <footer className="site-footer shell">
      <div><strong>{site.owner}</strong><span>{t.footerTag}</span></div>
      <nav aria-label={t.socialAria}>
        {site.social.map((link) => <a key={link.url} href={link.url}>{link.label} <Arrow /></a>)}
        {site.resumeUrl && <a href={asset(site.resumeUrl)} download>{t.resume} ↓</a>}
      </nav>
      <span>© {new Date().getFullYear()}</span>
    </footer>
  </div>;
}
