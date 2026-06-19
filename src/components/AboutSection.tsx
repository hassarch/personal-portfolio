import { Code2, Lightbulb, Rocket } from 'lucide-react';
import { motion } from 'motion/react';
import TerminalFrame from './TerminalFrame';

const AboutSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <section id="about" className="section-base">
      <TerminalFrame title="~/about">
        <div className="section-content-narrow mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            {/* Terminal-style header */}
            <motion.div variants={itemVariants} className="mb-8">
              <p className="font-mono text-xs sm:text-sm text-foreground opacity-60 mb-2">
                $ cat about.txt
              </p>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground uppercase tracking-tight">
                About
              </h2>
              <div className="h-1 w-24 bg-foreground mt-4"></div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <motion.div variants={containerVariants} className="about-text">
                <motion.p variants={itemVariants}>
                  I'm a Computer Science and Data Science student who enjoys building projects and learning by doing.
                </motion.p>
                <motion.p variants={itemVariants}>
                  I like exploring new technologies and experimenting with ideas. I'm interested in software development, machine learning, and problem solving.
                </motion.p>
                <motion.p variants={itemVariants}>
                  I enjoy turning concepts into real and working applications.
                </motion.p>
              </motion.div>

              <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <StatCard icon={<Code2 size={24} />} value="10+" label="Projects" variants={itemVariants} />
                <StatCard icon={<Lightbulb size={24} />} value="1-2" label="Years Exp" variants={itemVariants} />
                <StatCard icon={<Rocket size={24} />} value="7+" label="Hackathons" variants={itemVariants} className="sm:col-span-2" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </TerminalFrame>
    </section>
  );
};

const StatCard = ({
  icon,
  value,
  label,
  variants,
  className = ""
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  variants: any;
  className?: string;
}) => (
  <motion.div
    variants={variants}
    className={`retro-card flex flex-col items-center justify-center p-6 text-center ${className}`}
  >
    <div className="flex justify-center mb-4 text-foreground">{icon}</div>
    <div className="stat-card-value">{value}</div>
    <div className="stat-card-label">{label}</div>
  </motion.div>
);

export default AboutSection;
