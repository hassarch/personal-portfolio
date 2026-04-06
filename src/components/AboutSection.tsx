import { Code2, Lightbulb, Rocket } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const AboutSection = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation();

  return (
    <section id="about" className="relative py-32 md:py-40 px-6 scroll-mt-28 sm:scroll-mt-32 border-b-4 border-foreground bg-background">
      <div className="max-w-6xl mx-auto">
        <div 
          ref={headerRef}
          className={`mb-20 transition-all duration-1000 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            About
          </h2>
        </div>

        <div 
          ref={contentRef}
          className="max-w-4xl mx-auto"
        >
          <div className="space-y-6 mb-16">
            <div className={`space-y-4 transition-all duration-1000 delay-200 ${
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <p className="text-sm md:text-base text-foreground leading-relaxed font-mono">
                I'm a Computer Science and Data Science student who enjoys building projects and learning by doing.
              </p>
              <p className="text-sm md:text-base text-foreground leading-relaxed font-mono">
                I like exploring new technologies and experimenting with ideas.
              </p>
              <p className="text-sm md:text-base text-foreground leading-relaxed font-mono">
                I'm interested in software development, machine learning, and problem solving.
              </p>
              <p className="text-sm md:text-base text-foreground leading-relaxed font-mono">
                I enjoy turning concepts into real, working applications.
              </p>
            </div>

            <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 transition-all duration-1000 delay-400 ${
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <StatCard icon={<Code2 size={24} />} value="10+" label="Projects" delay="0.5s" />
              <StatCard icon={<Lightbulb size={24} />} value="1-2" label="Years Exp" delay="0.6s" />
              <StatCard icon={<Rocket size={24} />} value="7+" label="Hackathons" delay="0.7s" />
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
  delay,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  delay?: string;
}) => (
  <div 
    className="bg-card border-2 border-foreground p-4 text-center hover:shadow-lg hover:translate-x-1 hover:translate-y-1 transition-all duration-200 cursor-default"
    style={{ animationDelay: delay }}
  >
    <div className="flex justify-center mb-2 text-foreground">{icon}</div>
    <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
    <div className="text-xs text-foreground uppercase tracking-wide font-bold">{label}</div>
  </div>
);

export default AboutSection;
