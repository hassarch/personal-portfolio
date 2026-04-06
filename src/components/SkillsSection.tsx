import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Network, GitBranch, Beaker } from 'lucide-react';

const skills = {
  frontend: ['React', 'TypeScript', 'Next.js', 'Vue.js', 'Tailwind CSS', 'HTML/CSS'],
  backend: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'Supabase', 'REST APIs', 'GraphQL'],
  tools: ['Git', 'Docker', 'Kubernetes', 'AWS', 'Figma', 'CI/CD', 'Testing'],
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
    <section id="skills" className="relative py-32 md:py-40 px-6 scroll-mt-28 sm:scroll-mt-32 border-b-4 border-foreground bg-background">
      <div className="max-w-6xl mx-auto">
        <div 
          ref={headerRef}
          className={`mb-20 transition-all duration-1000 ease-out text-center ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ willChange: 'opacity, transform' }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Skills
          </h2>
          <p className="text-foreground text-sm md:text-base max-w-3xl mx-auto font-mono">
            Technologies and tools I use to bring ideas to life
          </p>
        </div>

        <div 
          ref={contentRef}
          className={`transition-all duration-1000 ease-out delay-200 ${
            contentVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          style={{ willChange: 'opacity, transform' }}
        >
          <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto">
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
      className="px-3 py-2 border-2 border-foreground bg-card text-xs md:text-sm text-foreground hover:bg-foreground hover:text-background transition-all duration-200 flex items-center gap-2 cursor-default opacity-0 animate-fade-in-up font-bold"
      style={{ 
        animationDelay: `${index * 0.05}s`,
        animationFillMode: 'forwards',
        willChange: 'transform, opacity'
      }}
    >
      <span style={{ willChange: 'transform' }}>{icon}</span>
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
  if (l.includes('kubernetes')) return img('kubernetes', 'plain');
  if (l.includes('supabase')) return img('supabase', 'original');
  if (l === 'aws' || l.includes('amazon')) return img('amazonwebservices', 'original-wordmark');
  if (l.includes('figma')) return img('figma');

  if (l.includes('rest')) return <Network className="h-5 w-5" />;
  if (l.includes('ci')) return <GitBranch className="h-5 w-5" />;
  if (l.includes('test')) return <Beaker className="h-5 w-5" />;

  return <Network className="h-5 w-5" />;
}

export default SkillsSection;
