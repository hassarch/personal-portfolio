import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { cn } from '@/lib/utils';

// ============================================================================
// DATA - Edit these arrays to update skills and projects
// ============================================================================

type SkillCategory = 'frontend' | 'backend' | 'tools';

interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: number; // 1-5
  x: number; // SVG coordinates
  y: number;
}

interface Project {
  id: string;
  name: string;
  skills: string[]; // skill IDs
}

const SKILLS: Skill[] = [
  // Frontend - Left cluster (80-280 x, 80-320 y)
  { id: 'react', name: 'React', category: 'frontend', level: 5, x: 150, y: 120 },
  { id: 'typescript', name: 'TypeScript', category: 'frontend', level: 4, x: 240, y: 90 },
  { id: 'nextjs', name: 'Next.js', category: 'frontend', level: 4, x: 260, y: 180 },
  { id: 'zustand', name: 'Zustand', category: 'frontend', level: 3, x: 100, y: 220 },
  { id: 'tailwind', name: 'Tailwind', category: 'frontend', level: 5, x: 200, y: 280 },
  
  // Backend - Middle cluster (340-600 x, 70-370 y)
  { id: 'python', name: 'Python', category: 'backend', level: 4, x: 420, y: 90 },
  { id: 'fastapi', name: 'FastAPI', category: 'backend', level: 4, x: 540, y: 100 },
  { id: 'postgresql', name: 'PostgreSQL', category: 'backend', level: 4, x: 580, y: 180 },
  { id: 'sqlalchemy', name: 'SQLAlchemy', category: 'backend', level: 3, x: 460, y: 200 },
  { id: 'redis', name: 'Redis', category: 'backend', level: 3, x: 370, y: 280 },
  { id: 'pydantic', name: 'Pydantic', category: 'backend', level: 3, x: 500, y: 290 },
  { id: 'typer', name: 'Typer', category: 'backend', level: 3, x: 430, y: 370 },
  
  // Tools - Right cluster (640-850 x, 70-390 y)
  { id: 'docker', name: 'Docker', category: 'tools', level: 4, x: 720, y: 90 },
  { id: 'github-actions', name: 'GitHub Actions', category: 'tools', level: 4, x: 840, y: 110 },
  { id: 'ansible', name: 'Ansible', category: 'tools', level: 3, x: 760, y: 160 },
  { id: 'ubuntu', name: 'Ubuntu Server', category: 'tools', level: 4, x: 660, y: 190 },
  { id: 'pytest', name: 'Pytest', category: 'tools', level: 3, x: 830, y: 200 },
  { id: 'cloudflare', name: 'Cloudflare', category: 'tools', level: 3, x: 780, y: 250 },
  { id: 'caddy', name: 'Caddy', category: 'tools', level: 3, x: 680, y: 290 },
  { id: 'ollama', name: 'Ollama', category: 'tools', level: 4, x: 800, y: 320 },
  { id: 'prometheus', name: 'Prometheus', category: 'tools', level: 3, x: 720, y: 360 },
  { id: 'grafana', name: 'Grafana', category: 'tools', level: 3, x: 650, y: 380 },
];

const PROJECTS: Project[] = [
  { 
    id: 'dsa-visualizer', 
    name: 'DSA Visualizer', 
    skills: ['react', 'nextjs', 'zustand', 'tailwind', 'typescript'] 
  },
  { 
    id: 'sanlab', 
    name: 'SanLab', 
    skills: ['docker', 'ansible', 'ubuntu', 'cloudflare', 'caddy', 'prometheus', 'grafana', 'github-actions'] 
  },
  { 
    id: 'nova', 
    name: 'NOVA', 
    skills: ['python', 'postgresql', 'sqlalchemy', 'docker', 'ollama', 'github-actions', 'pytest', 'pydantic', 'typer'] 
  },
  { 
    id: 'resumeiq', 
    name: 'ResumeIQ', 
    skills: ['react', 'fastapi', 'postgresql', 'docker', 'ollama', 'redis'] 
  },
];

const CATEGORY_COLORS = {
  frontend: '#ffd35a',
  backend: '#ff9a3c',
  tools: '#ff4f8b',
};

const CATEGORY_LABELS = {
  frontend: '[ FRONTEND/ ]',
  backend: '[ BACKEND/ ]',
  tools: '[ TOOLS/ ]',
};

// Constellation connections (within each cluster)
const CONSTELLATION_LINES: Record<SkillCategory, [string, string][]> = {
  frontend: [
    ['react', 'typescript'],
    ['typescript', 'nextjs'],
    ['nextjs', 'tailwind'],
    ['tailwind', 'zustand'],
    ['zustand', 'react'], // close the loop
    ['react', 'nextjs'], // chord
  ],
  backend: [
    ['python', 'fastapi'],
    ['fastapi', 'postgresql'],
    ['postgresql', 'sqlalchemy'],
    ['sqlalchemy', 'redis'],
    ['redis', 'pydantic'],
    ['pydantic', 'typer'],
    ['typer', 'python'], // close the loop
    ['fastapi', 'sqlalchemy'], // chord
    ['redis', 'python'], // chord
  ],
  tools: [
    ['docker', 'ansible'],
    ['ansible', 'ubuntu'],
    ['ubuntu', 'cloudflare'],
    ['cloudflare', 'caddy'],
    ['caddy', 'prometheus'],
    ['prometheus', 'grafana'],
    ['grafana', 'github-actions'],
    ['github-actions', 'ollama'],
    ['ollama', 'pytest'],
    ['pytest', 'docker'], // close the loop
    ['docker', 'github-actions'], // chord
    ['ubuntu', 'prometheus'], // chord
  ],
};

// Background starfield
const STARFIELD_DOTS = Array.from({ length: 80 }, (_, i) => ({
  x: Math.sin(i * 137.508) * 440 + 440,
  y: Math.cos(i * 137.508) * 220 + 220,
  size: 0.5 + (i % 3) * 0.3,
  twinkle: i % 5 === 0,
}));

// ============================================================================
// COMPONENT
// ============================================================================

export default function SkillsConstellation() {
  const [filter, setFilter] = useState<'all' | SkillCategory>('all');
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [pinnedSkill, setPinnedSkill] = useState<string | null>(null);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [pinnedProject, setPinnedProject] = useState<string | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const activeSkill = pinnedSkill || hoveredSkill;
  const activeProject = pinnedProject || hoveredProject;

  const filteredSkills = useMemo(() => {
    return filter === 'all' ? SKILLS : SKILLS.filter(s => s.category === filter);
  }, [filter]);

  const skillCounts = useMemo(() => {
    return {
      all: SKILLS.length,
      frontend: SKILLS.filter(s => s.category === 'frontend').length,
      backend: SKILLS.filter(s => s.category === 'backend').length,
      tools: SKILLS.filter(s => s.category === 'tools').length,
    };
  }, []);

  // Project links: which skills are connected via projects
  const projectLinks = useMemo(() => {
    const links: Array<{ from: string; to: string }> = [];
    PROJECTS.forEach(project => {
      for (let i = 0; i < project.skills.length; i++) {
        for (let j = i + 1; j < project.skills.length; j++) {
          links.push({ from: project.skills[i], to: project.skills[j] });
        }
      }
    });
    return links;
  }, []);

  // Which skills are "hot" (share a project with active skill or are in active project)
  const hotSkills = useMemo(() => {
    const hot = new Set<string>();
    if (activeSkill) {
      const relatedProjects = PROJECTS.filter(p => p.skills.includes(activeSkill));
      relatedProjects.forEach(p => p.skills.forEach(s => hot.add(s)));
    }
    if (activeProject) {
      const project = PROJECTS.find(p => p.id === activeProject);
      project?.skills.forEach(s => hot.add(s));
    }
    return hot;
  }, [activeSkill, activeProject]);

  const handleSkillClick = useCallback((skillId: string) => {
    setPinnedSkill(prev => prev === skillId ? null : skillId);
    setPinnedProject(null);
  }, []);

  const handleProjectClick = useCallback((projectId: string) => {
    setPinnedProject(prev => prev === projectId ? null : projectId);
    setPinnedSkill(null);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, skillId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSkillClick(skillId);
    }
    if (e.key === 'Escape') {
      setPinnedSkill(null);
      setPinnedProject(null);
    }
  }, [handleSkillClick]);

  const clusterCounts = useMemo(() => ({
    frontend: SKILLS.filter(s => s.category === 'frontend').length,
    backend: SKILLS.filter(s => s.category === 'backend').length,
    tools: SKILLS.filter(s => s.category === 'tools').length,
  }), []);

  return (
    <div className="w-full max-w-[1200px] mx-auto rounded-[10px] border border-[#eceae4] overflow-hidden bg-[#161616] font-mono">
      {/* Title bar */}
      <div className="h-9 bg-[#1e1e1e] border-b border-[#eceae4]/20 flex items-center px-3 gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 text-center font-bold text-[#eceae4] text-sm">~/SKILLS</div>
      </div>

      {/* Content */}
      <div className="relative p-6 pb-12">
        {/* Background starfield */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
          style={{ filter: 'blur(0.5px)' }}
        >
          {STARFIELD_DOTS.map((dot, i) => (
            <circle
              key={i}
              cx={dot.x}
              cy={dot.y}
              r={dot.size}
              fill="#eceae4"
              className={cn(
                dot.twinkle && !prefersReducedMotion && 'animate-twinkle',
              )}
              style={{
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </svg>

        {/* Command line */}
        <div className="flex items-center mb-4 text-sm">
          <div className="flex items-center gap-2 text-[#28c840]">
            <span>$</span>
            <span className="text-[#eceae4]">skills --map</span>
            <span
              className={cn(
                'inline-block w-2 h-4 bg-[#eceae4] ml-1',
                !prefersReducedMotion && 'animate-blink'
              )}
            />
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(['all', 'frontend', 'backend', 'tools'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded border text-xs transition-all',
                filter === cat
                  ? 'border-[#28c840] bg-[#28c840]/10 text-[#28c840]'
                  : 'border-[#eceae4]/20 text-[#eceae4]/60 hover:border-[#eceae4]/40 hover:text-[#eceae4]'
              )}
            >
              {cat !== 'all' && (
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: CATEGORY_COLORS[cat as SkillCategory] }}
                />
              )}
              <span>{cat}</span>
              <span className="text-[#eceae4]/40">({skillCounts[cat]})</span>
            </button>
          ))}
        </div>

        {/* Main content: visualization + inspector */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Visualization */}
          <div className="flex-1 min-w-0">
            <MapView
              skills={filteredSkills}
              activeSkill={activeSkill}
              hotSkills={hotSkills}
              projectLinks={projectLinks}
              onSkillHover={setHoveredSkill}
              onSkillClick={handleSkillClick}
              onKeyDown={handleKeyDown}
              prefersReducedMotion={prefersReducedMotion}
            />
          </div>

          {/* Inspector panel */}
          <div className="w-full lg:w-[300px] lg:border-l border-[#eceae4]/20 lg:pl-6">
            <Inspector
              activeSkill={activeSkill}
              activeProject={activeProject}
              onProjectClick={handleProjectClick}
              clusterCounts={clusterCounts}
            />
          </div>
        </div>

        {/* Project chips */}
        <div className="mt-6 pt-6 border-t border-[#eceae4]/20">
          <div className="text-xs text-[#eceae4]/60 mb-3">highlight stack →</div>
          <div className="flex flex-wrap gap-2">
            {PROJECTS.map(project => (
              <button
                key={project.id}
                onClick={() => handleProjectClick(project.id)}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
                className={cn(
                  'px-3 py-1.5 rounded border text-xs transition-all',
                  activeProject === project.id
                    ? 'border-[#28c840] bg-[#28c840]/10 text-[#28c840]'
                    : 'border-[#eceae4]/20 text-[#eceae4]/60 hover:border-[#eceae4]/40 hover:text-[#eceae4]'
                )}
              >
                {project.name}
              </button>
            ))}
          </div>
        </div>

        {/* Status bar */}
        <div className="mt-6 pt-3 border-t border-[#eceae4]/20 flex flex-wrap justify-between gap-2 text-xs text-[#eceae4]/60">
          <div>
            {SKILLS.length} skills · {Object.keys(clusterCounts).length} clusters · {PROJECTS.length} projects linked
          </div>
          <div>star size = proficiency · esc to clear</div>
        </div>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @keyframes dash {
          to { stroke-dashoffset: 0; }
        }
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
        .animate-dash {
          animation: dash 2s linear infinite;
        }
      `}</style>
    </div>
  );
}

// ============================================================================
// MAP VIEW
// ============================================================================

interface MapViewProps {
  skills: Skill[];
  activeSkill: string | null;
  hotSkills: Set<string>;
  projectLinks: Array<{ from: string; to: string }>;
  onSkillHover: (skillId: string | null) => void;
  onSkillClick: (skillId: string) => void;
  onKeyDown: (e: React.KeyboardEvent, skillId: string) => void;
  prefersReducedMotion: boolean;
}

function MapView({
  skills,
  activeSkill,
  hotSkills,
  projectLinks,
  onSkillHover,
  onSkillClick,
  onKeyDown,
  prefersReducedMotion,
}: MapViewProps) {
  const skillMap = useMemo(() => {
    const map = new Map<string, Skill>();
    skills.forEach(s => map.set(s.id, s));
    return map;
  }, [skills]);

  // Group skills by category for rendering
  const skillsByCategory = useMemo(() => {
    const groups: Record<SkillCategory, Skill[]> = {
      frontend: [],
      backend: [],
      tools: [],
    };
    skills.forEach(s => groups[s.category].push(s));
    return groups;
  }, [skills]);

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox="0 0 880 440"
        className="w-full h-auto"
        style={{ minHeight: '400px' }}
      >
        <defs>
          {/* Glow filters for each category */}
          {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
            <filter key={cat} id={`glow-${cat}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}

          {/* Orbit ellipses */}
          {Object.entries(skillsByCategory).map(([cat, catSkills]) => {
            if (catSkills.length === 0) return null;
            const avgX = catSkills.reduce((sum, s) => sum + s.x, 0) / catSkills.length;
            const avgY = catSkills.reduce((sum, s) => sum + s.y, 0) / catSkills.length;
            const rx = Math.max(...catSkills.map(s => Math.abs(s.x - avgX))) * 1.3;
            const ry = Math.max(...catSkills.map(s => Math.abs(s.y - avgY))) * 1.3;
            return (
              <g key={`orbit-${cat}`}>
                <ellipse
                  cx={avgX}
                  cy={avgY}
                  rx={rx}
                  ry={ry}
                  fill="none"
                  stroke={CATEGORY_COLORS[cat as SkillCategory]}
                  strokeWidth="0.5"
                  strokeDasharray="4 4"
                  opacity="0.15"
                />
                <ellipse
                  cx={avgX}
                  cy={avgY}
                  rx={rx * 0.6}
                  ry={ry * 0.6}
                  fill="none"
                  stroke={CATEGORY_COLORS[cat as SkillCategory]}
                  strokeWidth="0.5"
                  strokeDasharray="4 4"
                  opacity="0.1"
                />
              </g>
            );
          })}
        </defs>

        {/* Constellation base lines */}
        {Object.entries(CONSTELLATION_LINES).map(([cat, lines]) =>
          lines.map(([from, to], i) => {
            const fromSkill = skillMap.get(from);
            const toSkill = skillMap.get(to);
            if (!fromSkill || !toSkill) return null;
            const isDimmed = activeSkill && !hotSkills.has(from) && !hotSkills.has(to);
            return (
              <line
                key={`${cat}-${i}`}
                x1={fromSkill.x}
                y1={fromSkill.y}
                x2={toSkill.x}
                y2={toSkill.y}
                stroke="#eceae4"
                strokeWidth="0.5"
                opacity={isDimmed ? 0.05 : 0.15}
                className="transition-opacity duration-300"
              />
            );
          })
        )}

        {/* Project links (shown when skill/project selected) */}
        {(activeSkill || hotSkills.size > 0) &&
          projectLinks.map((link, i) => {
            const fromSkill = skillMap.get(link.from);
            const toSkill = skillMap.get(link.to);
            if (!fromSkill || !toSkill) return null;
            if (!hotSkills.has(link.from) || !hotSkills.has(link.to)) return null;
            return (
              <line
                key={`link-${i}`}
                x1={fromSkill.x}
                y1={fromSkill.y}
                x2={toSkill.x}
                y2={toSkill.y}
                stroke="#28c840"
                strokeWidth="1"
                strokeDasharray="4 2"
                strokeDashoffset="20"
                opacity="0.6"
                className={cn(!prefersReducedMotion && 'animate-dash')}
              />
            );
          })}

        {/* Cluster labels */}
        {Object.entries(skillsByCategory).map(([cat, catSkills]) => {
          if (catSkills.length === 0) return null;
          const avgX = catSkills.reduce((sum, s) => sum + s.x, 0) / catSkills.length;
          const minY = Math.min(...catSkills.map(s => s.y));
          return (
            <text
              key={`label-${cat}`}
              x={avgX}
              y={minY - 25}
              textAnchor="middle"
              fill={CATEGORY_COLORS[cat as SkillCategory]}
              fontSize="11"
              fontWeight="bold"
              opacity="0.5"
              fontFamily="'JetBrains Mono', monospace"
            >
              {CATEGORY_LABELS[cat as SkillCategory]}
            </text>
          );
        })}

        {/* Stars (skills) */}
        {skills.map((skill, idx) => {
          const isActive = skill.id === activeSkill;
          const isHot = hotSkills.has(skill.id);
          const isDimmed = (activeSkill || hotSkills.size > 0) && !isActive && !isHot;
          const radius = 2.4 + skill.level * 0.75;
          const hasSparkle = skill.level >= 3;

          return (
            <g
              key={skill.id}
              role="button"
              tabIndex={0}
              aria-label={`${skill.name}, ${skill.category}, level ${skill.level} of 5`}
              onClick={() => onSkillClick(skill.id)}
              onMouseEnter={() => onSkillHover(skill.id)}
              onMouseLeave={() => onSkillHover(null)}
              onKeyDown={(e) => onKeyDown(e, skill.id)}
              className="cursor-pointer focus:outline-none transition-opacity duration-300"
              style={{
                opacity: isDimmed ? 0.17 : 1,
              }}
            >
              {/* Glow halo */}
              <circle
                cx={skill.x}
                cy={skill.y}
                r={radius + (isActive ? 8 : 4)}
                fill={CATEGORY_COLORS[skill.category]}
                opacity={isActive ? 0.4 : 0.2}
                filter={`url(#glow-${skill.category})`}
                className={cn(
                  'transition-all duration-300',
                  !prefersReducedMotion && 'animate-twinkle'
                )}
                style={{
                  animationDelay: `${idx * 0.2}s`,
                }}
              />

              {/* Active ring */}
              {isActive && (
                <circle
                  cx={skill.x}
                  cy={skill.y}
                  r={radius + 4}
                  fill="none"
                  stroke="#eceae4"
                  strokeWidth="1.5"
                />
              )}

              {/* Core star */}
              <circle
                cx={skill.x}
                cy={skill.y}
                r={radius}
                fill={CATEGORY_COLORS[skill.category]}
              />

              {/* Sparkle cross for high-level skills */}
              {hasSparkle && (
                <>
                  <line
                    x1={skill.x}
                    y1={skill.y - radius - 2}
                    x2={skill.x}
                    y2={skill.y + radius + 2}
                    stroke="#eceae4"
                    strokeWidth="1"
                    opacity="0.8"
                  />
                  <line
                    x1={skill.x - radius - 2}
                    y1={skill.y}
                    x2={skill.x + radius + 2}
                    y2={skill.y}
                    stroke="#eceae4"
                    strokeWidth="1"
                    opacity="0.8"
                  />
                </>
              )}

              {/* Label */}
              <text
                x={skill.x + radius + 6}
                y={skill.y + 4}
                fill="#eceae4"
                fontSize="10"
                fontFamily="'JetBrains Mono', monospace"
                opacity={isDimmed ? 0.3 : 0.9}
                className="pointer-events-none select-none transition-opacity duration-300"
              >
                {skill.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ============================================================================
// INSPECTOR
// ============================================================================

interface InspectorProps {
  activeSkill: string | null;
  activeProject: string | null;
  onProjectClick: (projectId: string) => void;
  clusterCounts: Record<SkillCategory, number>;
}

function Inspector({
  activeSkill,
  activeProject,
  onProjectClick,
  clusterCounts,
}: InspectorProps) {
  const skill = SKILLS.find(s => s.id === activeSkill);
  const project = PROJECTS.find(p => p.id === activeProject);
  const relatedProjects = skill
    ? PROJECTS.filter(p => p.skills.includes(skill.id))
    : [];

  return (
    <div
      className="font-mono text-sm text-[#eceae4] space-y-3"
      aria-live="polite"
    >
      {!skill && !project && (
        <>
          <div className="text-[#28c840]">$ skills --summary</div>
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-[#eceae4]/60">Total:</span> {SKILLS.length} skills
            </div>
            {Object.entries(clusterCounts).map(([cat, count]) => (
              <div key={cat} className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: CATEGORY_COLORS[cat as SkillCategory] }}
                />
                <span className="text-[#eceae4]/60">{cat}:</span>
                <span>{'■'.repeat(count)}</span>
                <span className="text-[#eceae4]/40">({count})</span>
              </div>
            ))}
            <div className="pt-2 text-[#eceae4]/40 space-y-1">
              <div>→ hover or click a skill</div>
              <div>→ click a project chip</div>
              <div>→ use filters to focus</div>
            </div>
          </div>
        </>
      )}

      {skill && (
        <>
          <div className="text-[#28c840]">$ inspect --skill {skill.id}</div>
          <div className="space-y-3 text-xs">
            <div className="text-xl font-bold">{skill.name}</div>
            <div>
              <span className="text-[#eceae4]/60">CLUSTER:</span>{' '}
              <span style={{ color: CATEGORY_COLORS[skill.category] }}>
                {skill.category.toUpperCase()}
              </span>
            </div>
            <div>
              <span className="text-[#eceae4]/60">LEVEL:</span>{' '}
              <span>
                {'█'.repeat(skill.level)}
                {'░'.repeat(5 - skill.level)}
              </span>{' '}
              {skill.level}/5
            </div>
            <div>
              <span className="text-[#eceae4]/60">USED IN:</span>
              {relatedProjects.length === 0 ? (
                <div className="text-[#eceae4]/40 mt-1">no linked projects yet</div>
              ) : (
                <div className="mt-2 space-y-1">
                  {relatedProjects.map(p => (
                    <button
                      key={p.id}
                      onClick={() => onProjectClick(p.id)}
                      className="block text-[#28c840] hover:underline"
                    >
                      → {p.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {project && (
        <>
          <div className="text-[#28c840]">$ inspect --project {project.id}</div>
          <div className="space-y-3 text-xs">
            <div className="text-xl font-bold">{project.name}</div>
            <div>
              <span className="text-[#eceae4]/60">STACK:</span>
              <div className="mt-2 space-y-1">
                {project.skills.map(skillId => {
                  const s = SKILLS.find(sk => sk.id === skillId);
                  if (!s) return null;
                  return (
                    <button
                      key={skillId}
                      onClick={() => {
                        // This would trigger skill selection but we're in project mode
                        // Could enhance to allow switching between modes
                      }}
                      className="block hover:text-[#28c840]"
                    >
                      → {s.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
