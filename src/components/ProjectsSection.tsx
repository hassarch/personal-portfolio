import { ExternalLink, Github } from 'lucide-react';
import { Button } from './ui/button';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface Project {
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  image?: string;
}

const projects: Project[] = [
  {
    title: 'Patient Portal',
    description: 'A comprehensive healthcare management system that allows patients to schedule appointments, view medical records, communicate with doctors, and manage their health information securely.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Tailwind CSS', 'TypeScript','shadcn-ui' ],
    githubUrl: 'https://github.com/hassarch/patient-portal.git',
  },
  {
    title: 'Mind Pulse',
    description:'MindPulse is an AI-powered web app that helps students track mood, sleep, stress, and study habits through quick daily check-ins, visual analytics, and burnout risk prediction, delivering personalized insights in a clean, privacy-focused interface',
    technologies: ['React', 'TypeScript', 'Vite', 'shadcn/ui', 'Radix UI', 'Tailwind CSS', 'React Query', 'Zod', 'Recharts'],
    githubUrl: 'https://github.com/hassarch/habit-tracker.git',
    liveUrl: 'https://mind-pulse-ai.vercel.app/',
  },
  {
    title: 'Zone',
    description: 'A productivity-focused Chrome extension that helps users stay focused by tracking time spent on distracting websites and automatically blocking them when daily limits are reached. It features real-time tracking, instant blocking, live countdowns, usage stats, and a clean, minimal interface.',
    technologies:['JavaScript', 'Chrome Extension APIs', 'Node.js', 'Express', 'MongoDB', 'HTML', 'CSS'],
    githubUrl:'https://github.com/hassarch/zone.git',
  },
  {
    title: 'Expenso',
    description: 'An intelligent budget tracking application designed to help users monitor expenses, analyze spending trends through interactive visuals, and forecast future costs with predictive insights, making personal finance management simpler and more effective.',
    technologies: ['React', 'TypeScript', 'Google OAuth','Vite', 'Tailwind CSS'],
    githubUrl: 'https://github.com/hassarch/budget-tracker.git',
    liveUrl: 'https://expenso-alpha.vercel.app/',
  },
  {
    title: 'Daily News Summarizer',
    description: 'An automated AI-powered news summarization service that fetches the latest headlines, generates concise summaries using a self-hosted language model, and delivers a daily top-news digest automatically.',
    technologies: ['Python', 'FastAPI', 'Ollama', 'LangChain', 'APScheduler'],
    githubUrl: 'https://github.com/hassarch/daily-news-summary-bot.git',
  },
  {
    title:'AutoDoc CLI',
    description: 'An AI-powered command-line tool that scans your project structure and automatically generates clean, well-organized documentation. It helps developers save time by creating professional READMEs with features, setup steps, and usage instructions instantly.',
    technologies: ['Node.js','JavaScript','OpenAI API','Commander.js','File System','Npm'],
    githubUrl: 'https://github.com/hassarch/autodoc-cli.git',
  }
];

const ProjectsSection = () => {
  const displayedProjects = projects.slice(-4).reverse();
  const githubReposUrl = 'https://github.com/hassarch?tab=repositories';
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation();

  return (
    <section id="projects" className="relative py-32 md:py-40 px-6 scroll-mt-28 sm:scroll-mt-32 border-b-4 border-foreground bg-background">
      <div className="max-w-6xl mx-auto">
        <div 
          ref={headerRef}
          className={`mb-20 transition-all duration-1000 text-center ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Projects
          </h2>
          <p className="text-foreground text-sm md:text-base max-w-3xl mx-auto font-mono">
            A collection of projects I've worked on, showcasing my skills and experience
          </p>
        </div>

        <div 
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto"
        >
          {displayedProjects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} isVisible={gridVisible} />
          ))}
        </div>

        {projects.length > 4 && (
          <div className="flex justify-center mt-16">
            <Button
              className="retro-button text-sm"
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
          </div>
        )}
      </div>
    </section>
  );
};

const ProjectCard = ({ project, index, isVisible }: { project: Project; index: number; isVisible: boolean }) => {
  return (
    <div 
      className={`bg-card border-2 border-foreground p-6 hover:shadow-lg hover:translate-x-1 hover:translate-y-1 transition-all duration-200 flex flex-col h-full group ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <h3 className="text-lg font-bold mb-3 text-foreground text-left">
        {project.title}
      </h3>

      <p className="text-foreground text-xs mb-4 flex-grow leading-relaxed text-left font-mono">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {project.technologies.map((tech, index) => (
          <span
            key={index}
            className="px-2 py-1 text-xs border border-foreground text-foreground font-mono"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="flex gap-2 mt-auto">
        {project.githubUrl && (
          <Button
            className="retro-button flex-1 text-xs"
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
            className="retro-button-filled flex-1 text-xs"
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
    </div>
  );
};

export default ProjectsSection;
