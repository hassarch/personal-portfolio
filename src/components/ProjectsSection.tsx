import { ExternalLink, Github, Code2 } from 'lucide-react';
import { Button } from './ui/button';

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
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Express'],
    githubUrl: 'https://github.com/yourusername/patient-portal',
    liveUrl: 'https://yourproject.com',
  },
  {
    title: 'Pet Adoption',
    description: 'An interactive platform connecting pet lovers with rescue organizations. Features include pet listings, search filters, adoption applications, and user profiles for managing favorite pets.',
    technologies: ['Next.js', 'TypeScript', 'MongoDB', 'Tailwind CSS'],
    githubUrl: 'https://github.com/yourusername/pet-adoption',
    liveUrl: 'https://yourproject.com',
  },
  {
    title: 'Student Performance Predictor',
    description: 'A machine learning-powered application that predicts student academic performance based on various factors. Includes data visualization, performance analytics, and actionable insights for educators.',
    technologies: ['Python', 'React', 'TensorFlow', 'Flask'],
    githubUrl: 'https://github.com/yourusername/student-predictor',
    liveUrl: 'https://yourproject.com',
  },
];

const ProjectsSection = () => {
  return (
    <section id="projects" className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Featured Projects</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            A collection of projects I've worked on, showcasing my skills and experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <div className="glass-card p-6 rounded-2xl hover-glow transition-all duration-500 group flex flex-col h-full">
      <div className="mb-4 flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300">
        <Code2 className="text-primary" size={32} />
      </div>

      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
        {project.title}
      </h3>

      <p className="text-muted-foreground text-sm mb-4 flex-grow leading-relaxed">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {project.technologies.map((tech, index) => (
          <span
            key={index}
            className="px-2 py-1 text-xs rounded-md bg-secondary/50 text-muted-foreground border border-border/50 group-hover:border-primary/30 transition-colors duration-300"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="flex gap-2 mt-auto">
        {project.githubUrl && (
          <Button
            variant="outline"
            size="sm"
            className="flex-1 group/btn"
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
            variant="hero"
            size="sm"
            className="flex-1 group/btn"
            asChild
          >
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <ExternalLink size={16} />
              Live Demo
            </a>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProjectsSection;

