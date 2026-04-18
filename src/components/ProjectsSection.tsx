import { ExternalLink, Github } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './ui/button';

interface Project {
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
}

const projects: Project[] = [
  {
    title: 'Patient Portal',
    description: 'A comprehensive healthcare management system that allows patients to schedule appointments, view medical records, communicate with doctors, and manage their health information securely.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Tailwind', 'TypeScript'],
    githubUrl: 'https://github.com/hassarch/patient-portal.git',
  },
  {
    title: 'Mind Pulse',
    description:'MindPulse is an AI-powered web app that helps students track mood, sleep, stress, and study habits through quick daily check-ins, visual analytics, and burnout risk prediction.',
    technologies: ['React', 'TypeScript', 'Vite', 'Tailwind', 'React Query'],
    githubUrl: 'https://github.com/hassarch/habit-tracker.git',
    liveUrl: 'https://mind-pulse-ai.vercel.app/',
  },
  {
    title: 'Zone',
    description: 'A productivity-focused Chrome extension that helps users stay focused by tracking time spent on distracting websites and automatically blocking them when daily limits are reached.',
    technologies:['Js', 'Chrome API', 'Node.js', 'MongoDB'],
    githubUrl:'https://github.com/hassarch/zone.git',
  },
  {
    title: 'Expenso',
    description: 'An intelligent budget tracking application designed to help users monitor expenses, analyze spending trends through interactive visuals, and forecast future costs.',
    technologies: ['React', 'TypeScript', 'Google OAuth','Vite'],
    githubUrl: 'https://github.com/hassarch/budget-tracker.git',
    liveUrl: 'https://expenso-alpha.vercel.app/',
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
      <div className="section-content">
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
            Projects
          </h2>
          <p className="section-subtitle">
            [ Featured Work & Experiments ]
          </p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="projects-grid"
        >
          {displayedProjects.map((project, index) => (
            <ProjectCard key={index} project={project} variants={itemVariants} />
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="flex justify-center mt-16"
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
              See More Projects
              <ExternalLink size={16} />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

const ProjectCard = ({ project, variants }: { project: Project; variants: any }) => {
  return (
    <motion.div 
      variants={variants}
      className="retro-card flex flex-col h-full bg-card"
    >
      <div className="project-header">
        <h3 className="project-title">
          {project.title}
        </h3>
        <div className="text-foreground">
          <Github size={20} />
        </div>
      </div>

      <p className="project-description">
        {project.description}
      </p>

      <div className="project-tech-list">
        {project.technologies.map((tech, index) => (
          <span
            key={index}
            className="project-tech-pill"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="project-actions">
        {project.githubUrl && (
          <Button
            className="retro-button flex-1 text-xs py-2 px-0 shadow-[2px_2px_0_0_currentColor]"
            asChild
          >
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <Github size={14} />
              Code
            </a>
          </Button>
        )}
        {project.liveUrl && (
          <Button
            className="retro-button bg-foreground text-background hover:bg-background hover:text-foreground flex-1 text-xs py-2 px-0 shadow-[2px_2px_0_0_currentColor]"
            asChild
          >
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <ExternalLink size={14} />
              Live
            </a>
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectsSection;
