import { motion } from 'motion/react';
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
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <section id="skills" className="section-base">
      <div className="section-content-narrow">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
          }}
          className="section-header-wrapper"
        >
          <h2 className="section-header">
            Skills
          </h2>
          <p className="section-subtitle">
            [ Tech Stack & Tooling ]
          </p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="skills-grid"
        >
          {allSkills.map((skill, index) => (
            <SkillPill key={index} label={skill} variants={itemVariants} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

function SkillPill({ label, variants }: { label: string; variants: any }) {
  const icon = getIconForSkill(label);
  
  return (
    <motion.div 
      variants={variants}
      className="skill-pill group"
    >
      <span className="grayscale group-hover:grayscale-0 transition-all">{icon}</span>
      <span className="uppercase tracking-widest">{label}</span>
    </motion.div>
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
