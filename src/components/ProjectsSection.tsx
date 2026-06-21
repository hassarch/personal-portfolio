import { ExternalLink, Github } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import TerminalFrame from './TerminalFrame';
import { PROJECT_PREFIX, COMMENT_PREFIX } from '@/constants/asciiArt';

interface Project {
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  date?: string;
}

const projects: Project[] = [
  {
    title: 'DSA Visualizer',
    description: 'An interactive platform that visualizes data structures and algorithms through step-by-step animations, helping users understand complex concepts intuitively.',
    technologies: ['React', 'Next.js', 'Zustand', 'Tailwind', 'TypeScript'],
    githubUrl: 'https://github.com/hassarch/dsa-visualizer.git',
    liveUrl: 'https://dsa-visualizer-mu-smoky.vercel.app/sorting',
    date: '2024-06-15',
  },
  {
    title: 'Mind Pulse',
    description: 'MindPulse is an AI-powered web app that helps students track mood, sleep, stress, and study habits through quick daily check-ins.',
    technologies: ['React', 'TypeScript', 'Vite', 'Tailwind', 'React Query'],
    githubUrl: 'https://github.com/hassarch/habit-tracker.git',
    liveUrl: 'https://mind-pulse-ai.vercel.app/',
    date: '2024-05-20',
  },
  {
    title: 'Zone',
    description: 'A productivity-focused Chrome extension that helps users stay focused by tracking time spent on distracting websites.',
    technologies: ['Js', 'Chrome API', 'Node.js', 'MongoDB'],
    githubUrl: 'https://github.com/hassarch/zone.git',
    date: '2024-04-10',
  },
  {
    title: 'ResumeIQ',
    description: 'AI Resume Screener helps job seekers evaluate their resumes against job descriptions by analyzing skills and keyword relevance.',
    technologies: ['React', 'FastAPI', 'PostgreSQL', 'Docker', 'Ollama', 'Redis'],
    githubUrl: 'https://github.com/hassarch/resume-screening.git',
    date: '2024-03-01',
  },
];

const ProjectsSection = () => {
  const displayedProjects = [...projects].reverse();
  const githubReposUrl = 'https://github.com/hassarch?tab=repositories';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <section id="projects" className="section-base">
      <TerminalFrame title="~/projects">
        <div className="section-content mx-auto">
          {/* Terminal-style header */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
            }}
            className="mb-8"
          >
            <p className="font-mono text-xs sm:text-sm text-foreground opacity-60 mb-4">
              $ ls -la projects/
            </p>
          </motion.div>

          {/* Grid layout projects */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {displayedProjects.map((project, index) => (
              <ProjectEntry key={index} project={project} variants={itemVariants} />
            ))}
          </motion.div>

          {/* See more link */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="flex justify-center mt-12"
          >
            <Button
              className="retro-button text-sm py-6 px-8 rounded-none border-2 shadow-[4px_4px_0_0_currentColor]"
              asChild
            >
              <a
                href={githubReposUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                $ ls ../repositories/
                <ExternalLink size={16} />
              </a>
            </Button>
          </motion.div>
        </div>
      </TerminalFrame>
    </section>
  );
};

const ProjectEntry = ({ project, variants }: { project: Project; variants: Record<string, unknown> }) => {
  return (
    <motion.div 
      variants={variants}
      className="retro-card bg-card p-8 flex flex-col h-full"
    >
      {/* Project Title with Icon */}
      <div className="flex items-start justify-between mb-6">
        <h3 className="text-2xl font-bold text-foreground uppercase tracking-tight">
          {project.title}
        </h3>
        <Github size={20} className="text-foreground flex-shrink-0 ml-4" />
      </div>

      {/* Description */}
      <p className="font-mono text-sm text-foreground mb-6 leading-relaxed flex-grow">
        {project.description}
      </p>

      {/* Tech tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {project.technologies.map((tech, index) => (
          <span
            key={index}
            className="px-3 py-1.5 text-[10px] border border-foreground text-foreground font-mono uppercase tracking-wider font-bold bg-background"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mt-auto">
        {project.githubUrl && (
          <Button
            className="retro-button flex-1 text-sm py-4 px-4 shadow-[2px_2px_0_0_currentColor] bg-foreground text-background hover:bg-background hover:text-foreground"
            asChild
          >
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <Github size={16} />
              Code
            </a>
          </Button>
        )}
        {project.liveUrl && (
          <Button
            className="retro-button flex-1 text-sm py-4 px-4 shadow-[2px_2px_0_0_currentColor] bg-foreground text-background hover:bg-background hover:text-foreground"
            asChild
          >
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <ExternalLink size={16} />
              Live
            </a>
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectsSection;
