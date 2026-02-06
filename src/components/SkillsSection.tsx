import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Network, GitBranch, Beaker } from 'lucide-react';

const skills = {
  frontend: ['React', 'TypeScript', 'Next.js', 'Vue.js', 'Tailwind CSS', 'HTML/CSS'],
  backend: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'REST APIs', 'GraphQL'],
  tools: ['Git', 'Docker', 'AWS', 'Figma', 'CI/CD', 'Testing'],
};

const allSkills = [
  ...skills.frontend,
  ...skills.backend,
  ...skills.tools,
];

const SkillsSection = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation();

  return (
    <section id="skills" className="relative py-32 md:py-40 px-6 scroll-mt-28 sm:scroll-mt-32">
      <div className="max-w-6xl mx-auto">
        <div 
          ref={headerRef}
          className={`text-center mb-20 transition-all duration-1000 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground relative inline-block">
            Skills & Expertise
            <span className="absolute inset-0 animate-shimmer pointer-events-none"></span>
          </h2>
          <div className="w-20 h-1 bg-foreground mx-auto rounded-full mb-8" />
          <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto">
            Technologies and tools I use to bring ideas to life
          </p>
        </div>

        <div 
          ref={contentRef}
          className={`transition-all duration-1000 delay-200 ${
            contentVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
            {allSkills.map((skill, index) => (
              <SkillPill key={index} label={skill} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

function SkillPill({ label, index }: { label: string; index: number }) {
  const icon = getIconForSkill(label);
  
  return (
    <div 
      className="px-5 py-2.5 rounded-full border border-border bg-card text-sm md:text-base text-foreground hover:border-foreground hover:shadow-lg hover:scale-110 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 cursor-default opacity-0 animate-fade-in-up group"
      style={{ 
        animationDelay: `${index * 0.05}s`,
        animationFillMode: 'forwards'
      }}
    >
      <span className="group-hover:scale-110 transition-transform duration-300">{icon}</span>
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
      className="h-5 w-5 object-contain"
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

  if (l.includes('rest')) return <Network className="h-5 w-5" />;
  if (l.includes('ci')) return <GitBranch className="h-5 w-5" />;
  if (l.includes('test')) return <Beaker className="h-5 w-5" />;

  return <Network className="h-5 w-5" />;
}

export default SkillsSection;
