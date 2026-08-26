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
    <TerminalFrame
      title="~/about"
      flush
      className="bento-tile"
      contentClassName="bento-tile-content sm:p-6"
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="flex h-full flex-col"
      >
        {/* Terminal-style header */}
        <motion.div variants={itemVariants} className="mb-5">
          <p className="mb-2 font-mono text-[10px] text-foreground opacity-50 sm:text-xs">
            $ cat about.txt
          </p>
          <h2 className="text-2xl font-bold uppercase tracking-tight text-foreground md:text-3xl">
            About
          </h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '4rem' }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-3 h-1 bg-foreground"
          />
        </motion.div>

        <motion.p
          variants={paragraphVariants}
          className="relative border-l-2 border-foreground/30 pl-5 font-mono text-sm leading-relaxed text-foreground"
        >
          I love computers, technology, and building things that people actually enjoy using. I'm always experimenting, learning, and turning random ideas into projects.
          Most of the time, you'll find me coding, fixing things I accidentally broke, or obsessing over a new technology that caught my attention the night before.
        </motion.p>
      </motion.div>
    </TerminalFrame>
  );
};

export default AboutSection;
