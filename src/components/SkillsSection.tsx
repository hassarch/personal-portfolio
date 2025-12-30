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

const SkillsSection = () => {
  return (
    <section id="skills" className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Skills & Expertise</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Technologies and tools I use to bring ideas to life
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <SkillCategory title="Frontend" skills={skills.frontend} />
          <SkillCategory title="Backend" skills={skills.backend} />
          <SkillCategory title="Tools & Others" skills={skills.tools} />
        </div>
      </div>
    </section>
  );
};

const SkillCategory = ({
  title,
  skills,
}: {
  title: string;
  skills: { name: string; level: number }[];
}) => (
  <div className="glass-card p-6 rounded-2xl hover-glow transition-all duration-500">
    <h3 className="text-xl font-semibold mb-6 text-center">
      <span className="gradient-text">{title}</span>
    </h3>
    <div className="grid grid-cols-3 gap-4">
      {skills.map((skill) => (
        <CircularProgress key={skill.name} name={skill.name} level={skill.level} />
      ))}
    </div>
  </div>
);

const CircularProgress = ({ name, level }: { name: string; level: number }) => {
  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (level / 100) * circumference;

  return (
    <div className="flex flex-col items-center group">
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 transform -rotate-90">
          <circle
            cx="40"
            cy="40"
            r="36"
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            className="text-secondary"
          />
          <circle
            cx="40"
            cy="40"
            r="36"
            stroke="url(#gradient)"
            strokeWidth="6"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out group-hover:drop-shadow-[0_0_8px_hsl(var(--primary))]"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--accent))" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
            {level}%
          </span>
        </div>
      </div>
      <span className="mt-2 text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300 text-center">
        {name}
      </span>
    </div>
  );
};

export default SkillsSection;
