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
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
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

            <motion.div variants={containerVariants} className="about-text space-y-0">
              <motion.p variants={itemVariants}>
                I love computers, technology, and building things that people actually enjoy using. I'm always experimenting, learning, and turning random ideas into projects.
                Most of the time, you'll find me coding, fixing things I accidentally broke, or obsessing over a new technology that caught my attention the night before.
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      </TerminalFrame>
    </section>
  );
};

export default AboutSection;
