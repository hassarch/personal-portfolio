import { Code2, Lightbulb, Rocket } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const AboutSection = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation();

  return (
    <section id="about" className="relative py-32 md:py-40 px-6 scroll-mt-28 sm:scroll-mt-32 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <div 
          ref={headerRef}
          className={`text-center mb-20 transition-all duration-1000 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground relative inline-block">
            About Me
            <span className="absolute inset-0 animate-shimmer pointer-events-none"></span>
          </h2>
          <div className="w-20 h-1 bg-foreground mx-auto rounded-full" />
        </div>

        <div 
          ref={contentRef}
          className="max-w-4xl mx-auto"
        >
          <div className="space-y-8 text-center mb-16">
            <div className={`space-y-6 transition-all duration-1000 delay-200 ${
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                I'm a Computer Science and Data Science student who enjoys building projects and learning by doing.
              </p>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                I like exploring new technologies and experimenting with ideas.
              </p>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                I'm interested in software development, machine learning, and problem solving.
              </p>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                I enjoy turning concepts into real, working applications.
              </p>
            </div>

            <div className={`grid grid-cols-1 sm:grid-cols-3 gap-8 pt-16 transition-all duration-1000 delay-400 ${
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <StatCard icon={<Code2 size={28} />} value="10+" label="Projects" delay="0.5s" />
              <StatCard icon={<Lightbulb size={28} />} value="1-2" label="Years Exp" delay="0.6s" />
              <StatCard icon={<Rocket size={28} />} value="7+" label="Hackathons" delay="0.7s" />
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
    className="bg-card border border-border p-6 rounded-lg text-center hover:shadow-2xl hover:scale-110 hover:border-foreground/50 hover:-translate-y-2 transition-all duration-500 cursor-default animate-float group"
    style={{ animationDelay: delay }}
  >
    <div className="flex justify-center mb-3 text-foreground group-hover:scale-110 transition-transform duration-300">{icon}</div>
    <div className="text-3xl font-bold text-foreground mb-1">{value}</div>
    <div className="text-sm text-muted-foreground uppercase tracking-wide">{label}</div>
  </div>
);

export default AboutSection;
