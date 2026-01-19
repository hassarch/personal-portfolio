import { Network, GitBranch, Beaker } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const skills = {
  frontend: [
    { name: 'React', level: 95 },
    { name: 'TypeScript', level: 90 },
    { name: 'Next.js', level: 85 },
    { name: 'Vue.js', level: 80 },
    { name: 'Tailwind CSS', level: 95 },
    { name: 'HTML/CSS', level: 95 },
  ],
  backend: [
    { name: 'Node.js', level: 90 },
    { name: 'Python', level: 85 },
    { name: 'PostgreSQL', level: 85 },
    { name: 'MongoDB', level: 80 },
    { name: 'REST APIs', level: 90 },
    { name: 'GraphQL', level: 75 },
  ],
  tools: [
    { name: 'Git', level: 95 },
    { name: 'Docker', level: 80 },
    { name: 'AWS', level: 75 },
    { name: 'Figma', level: 70 },
    { name: 'CI/CD', level: 80 },
    { name: 'Testing', level: 85 },
  ],
};

const allSkills = [
  ...skills.frontend.map((s) => s.name),
  ...skills.backend.map((s) => s.name),
  ...skills.tools.map((s) => s.name),
];

const SkillsSection = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: marqueeRef, isVisible: marqueeVisible } = useScrollAnimation();

  return (
    <section id="skills" className="relative py-24 px-6 scroll-mt-28 sm:scroll-mt-32">
      <div className="max-w-6xl mx-auto">
        <div 
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-700 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Skills & Expertise</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Technologies and tools I use to bring ideas to life
          </p>
        </div>

        <div 
          ref={marqueeRef}
          className={`glass-card rounded-2xl p-6 md:p-8 overflow-hidden transition-all duration-700 delay-200 ${
            marqueeVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <Marquee direction="left" speed={30} items={allSkills} />
        </div>
      </div>
    </section>
  );
};

function Marquee({
  items,
  direction = 'left',
  speed = 30,
}: {
  items: string[];
  direction?: 'left' | 'right';
  speed?: number; // seconds for one full loop
}) {
  const animationClass = direction === 'left' ? 'animate-marquee' : 'animate-marquee-reverse';
  const style = { ['--marquee-duration' as any]: `${speed}s` } as React.CSSProperties;

  // duplicate items to create a seamless loop
  const loopItems = [...items, ...items];

  return (
    <div className="relative w-full overflow-hidden">
      <div className={`flex w-max gap-6 ${animationClass}`} style={style} aria-hidden>
        {loopItems.map((name, idx) => (
          <SkillPill key={`${name}-${idx}`} label={name} />
        ))}
      </div>
    </div>
  );
}

function SkillPill({ label }: { label: string }) {
  const icon = getIconForSkill(label);
  return (
    <div className="px-6 py-3.5 rounded-full border border-border/40 bg-muted/30 text-lg md:text-xl text-muted-foreground hover:text-foreground hover:border-primary/50 hover:scale-105 transition-all duration-300 whitespace-nowrap flex items-center gap-4">
      {icon}
      <span>{label}</span>
    </div>
  );
}

function getIconForSkill(label: string): React.ReactNode {
  const l = label.toLowerCase();
  const img = (slug: string, variant: string = 'original') => (
    <img
      src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-${variant}.svg`}
      alt={label}
      className="h-7 w-7 md:h-8 md:w-8 object-contain"
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  );

  if (l.includes('react')) return img('react');
  if (l.includes('type')) return img('typescript');
  if (l.includes('next')) return img('nextjs');
  if (l.includes('vue')) return img('vuejs');
  if (l.includes('tailwind')) return img('tailwindcss', 'original');
  if (l.includes('html')) return img('html5');
  if (l.includes('node')) return img('nodejs');
  if (l.includes('python')) return img('python');
  if (l.includes('postgre')) return img('postgresql');
  if (l.includes('mongo')) return img('mongodb');
  if (l.includes('graphql')) return img('graphql', 'plain');
  if (l === 'git') return img('git');
  if (l.includes('docker')) return img('docker');
  if (l === 'aws' || l.includes('amazon')) return img('amazonwebservices', 'original-wordmark');
  if (l.includes('figma')) return img('figma');

  if (l.includes('rest')) return <Network className="h-6 w-6 md:h-7 md:w-7" />;
  if (l.includes('ci')) return <GitBranch className="h-6 w-6 md:h-7 md:w-7" />;
  if (l.includes('test')) return <Beaker className="h-6 w-6 md:h-7 md:w-7" />;

  return <Network className="h-6 w-6 md:h-7 md:w-7" />;
}

export default SkillsSection;
