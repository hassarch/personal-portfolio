import { Code2, Lightbulb, Rocket } from 'lucide-react';

const AboutSection = () => {
  return (
    <section id="about" className="relative py-24 px-6 scroll-mt-28 sm:scroll-mt-32">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">About Me</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-6 text-center">
            <div className="space-y-3">
              <p className="text-lg text-muted-foreground leading-relaxed">I’m a Computer Science and Data Science student who enjoys building projects and learning by doing.</p>
              <p className="text-lg text-muted-foreground leading-relaxed">I like exploring new technologies and experimenting with ideas.</p>
              <p className="text-lg text-muted-foreground leading-relaxed">I’m interested in software development, machine learning, and problem solving.</p>
              <p className="text-lg text-muted-foreground leading-relaxed">I enjoy turning concepts into real, working applications.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-6">
              <StatCard icon={<Code2 className="text-primary" />} value="10+" label="Projects" />
              <StatCard icon={<Lightbulb className="text-accent" />} value="1-2" label="Years Exp" />
              <StatCard icon={<Rocket className="text-primary" />} value="7+" label="Hackathons" />
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
