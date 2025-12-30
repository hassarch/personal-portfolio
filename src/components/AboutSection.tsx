import { Code2, Lightbulb, Rocket } from 'lucide-react';

const AboutSection = () => {
  return (
    <section id="about" className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">About Me</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-6 text-center">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Hello! I{"'"}m <span className="text-foreground font-medium">Mohammed Hassan</span>, 
              a passionate full-stack developer based in India. I love turning complex 
              problems into simple, beautiful, and intuitive solutions.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              I{"'"}m a <span className="text-foreground font-medium">Computer Science undergrad</span> with 
              2-3 years of experience in web development. I enjoy working on diverse projects 
              and continuously learning new technologies.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              I love exploring new tech and am passionate about building cool projects. 
              When I{"'"}m not coding, you{"'"}ll find me diving into the latest frameworks 
              or contributing to open-source.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-6">
              <StatCard icon={<Code2 className="text-primary" />} value="20+" label="Projects" />
              <StatCard icon={<Lightbulb className="text-accent" />} value="2-3" label="Years Exp" />
              <StatCard icon={<Rocket className="text-primary" />} value="10+" label="Happy Clients" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const StatCard = ({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) => (
  <div className="glass-card p-4 rounded-xl text-center hover-glow transition-all duration-300">
    <div className="flex justify-center mb-2">{icon}</div>
    <div className="text-2xl font-bold gradient-text">{value}</div>
    <div className="text-xs text-muted-foreground">{label}</div>
  </div>
);

export default AboutSection;
