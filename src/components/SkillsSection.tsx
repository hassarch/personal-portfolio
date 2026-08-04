import { motion } from 'motion/react';
import TerminalFrame from './TerminalFrame';
import { TREE_BRANCH, TREE_BRANCH_LAST, TREE_VERTICAL } from '@/constants/asciiArt';

const skillTree = {
  frontend: {
    label: 'frontend/',
    items: ['React', 'TypeScript', 'Next.js', 'Vue.js', 'Tailwind_CSS', 'HTML/CSS'],
  },
  backend: {
    label: 'backend/',
    items: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'Supabase', 'REST_APIs', 'GraphQL'],
  },
  tools: {
    label: 'tools/',
    items: ['Git', 'Docker', 'Kubernetes', 'AWS', 'Figma', 'CI/CD', 'Testing'],
  },
};

/**
 * Builds the ASCII directory tree string
 */
function buildTree(): string {
  const lines: string[] = ['skills/'];
  const categories = Object.values(skillTree);

  categories.forEach((category, catIndex) => {
    const isLastCategory = catIndex === categories.length - 1;
    const catBranch = isLastCategory ? TREE_BRANCH_LAST : TREE_BRANCH;
    const catPrefix = isLastCategory ? '    ' : `${TREE_VERTICAL}   `;

    lines.push(`${catBranch} ${category.label}`);

    category.items.forEach((item, itemIndex) => {
      const isLastItem = itemIndex === category.items.length - 1;
      const itemBranch = isLastItem ? TREE_BRANCH_LAST : TREE_BRANCH;
      lines.push(`${catPrefix}${itemBranch} ${item}`);
    });
  });

  lines.push('');
  lines.push(`${categories.reduce((sum, cat) => sum + cat.items.length, 0)} items, ${categories.length} directories`);

  return lines.join('\n');
}

const SkillsSection = () => {
  const treeOutput = buildTree();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.03,
        delayChildren: 0.2 
      }
    }
  };

  const lineVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <section id="skills" className="section-base">
      <TerminalFrame title="~/skills">
        <div className="section-content-narrow mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            {/* Terminal command header */}
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.6 }}
              transition={{ delay: 0.3 }}
              className="font-mono text-xs sm:text-sm text-foreground mb-6"
            >
              $ tree skills/
            </motion.p>

            {/* Directory tree output with line-by-line animation */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              {treeOutput.split('\n').map((line, index) => (
                <motion.div
                  key={index}
                  variants={lineVariants}
                  className="font-mono text-xs sm:text-sm text-foreground leading-relaxed"
                  style={{ whiteSpace: 'pre' }}
                >
                  {line || '\u00A0'}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </TerminalFrame>
    </section>
  );
};

export default SkillsSection;
