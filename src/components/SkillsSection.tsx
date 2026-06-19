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

  return (
    <section id="skills" className="section-base">
      <TerminalFrame title="~/skills">
        <div className="section-content-narrow mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
            }}
          >
            {/* Terminal command header */}
            <p className="font-mono text-xs sm:text-sm text-foreground opacity-60 mb-6">
              $ tree skills/
            </p>

            {/* Directory tree output */}
            <pre className="font-mono text-xs sm:text-sm text-foreground leading-relaxed whitespace-pre select-text overflow-x-auto">
              {treeOutput}
            </pre>
          </motion.div>
        </div>
      </TerminalFrame>
    </section>
  );
};

export default SkillsSection;
