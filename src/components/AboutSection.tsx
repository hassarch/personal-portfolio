import { Code2, Lightbulb, Rocket } from 'lucide-react';
import { motion } from 'motion/react';

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
    <section id="about" className="relative py-24 md:py-32 px-6 scroll-mt-28 sm:scroll-mt-32 bg-background">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground uppercase tracking-tight">
              About
            </h2>
            <div className="h-2 w-24 bg-foreground mt-4"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div variants={containerVariants} className="space-y-6 font-mono text-sm md:text-base text-foreground leading-relaxed border-l-2 border-foreground pl-6">
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
    <div className="text-3xl font-bold text-foreground mb-1">{value}</div>
    <div className="text-[10px] text-foreground uppercase tracking-widest font-bold font-mono">{label}</div>
  </motion.div>
);

export default AboutSection;
