import { motion } from 'motion/react';
import TerminalFrame from './TerminalFrame';

const AboutSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  const paragraphVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
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
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: '6rem' }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="h-1 bg-foreground mt-4"
              />
            </motion.div>

            <motion.div variants={containerVariants} className="about-text space-y-0">
              <motion.p 
                variants={paragraphVariants}
                className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-foreground/30"
              >
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
