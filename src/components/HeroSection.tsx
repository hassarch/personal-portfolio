import { Github, Linkedin, Mail } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import TerminalFrame from './TerminalFrame';
import { useTypingEffect } from '@/hooks/useTypingEffect';
import { NAME, SOCIALS, type SocialLinkDef } from '@/constants/profile';

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const socialIcons: Record<SocialLinkDef['icon'], React.ReactNode> = {
  github: <Github size={18} />,
  x: <XIcon />,
  linkedin: <Linkedin size={18} />,
  mail: <Mail size={18} />,
};

const HeroSection = () => {
  const typedName = useTypingEffect({ text: NAME, speed: 100, delay: 300 });
  const typedBio = useTypingEffect({
    text: '> Computer Science undergrad and developer, I build cool and useful stuff.',
    speed: 30,
    delay: 1200
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <TerminalFrame
      title="~/welcome"
      flush
      className="bento-tile"
      contentClassName="bento-tile-content sm:p-8 md:p-10"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex h-full flex-col justify-center"
      >
        {/* Terminal-style whoami */}
        <motion.div variants={item} className="mb-6">
          <p className="mb-1 font-mono text-xs text-foreground opacity-60 sm:text-sm">
            $ whoami
          </p>
          <h1 className="text-4xl font-bold uppercase tracking-tight text-foreground sm:text-5xl md:text-6xl">
            {typedName}<span className="animate-blink font-light opacity-80">_</span>
          </h1>
        </motion.div>

        {/* Terminal-style bio */}
        <motion.div variants={item} className="mb-8">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 1.0 }}
            className="mb-1 font-mono text-xs text-foreground sm:text-sm"
          >
            $ cat info.txt
          </motion.p>
          <p className="min-h-[3rem] max-w-2xl font-mono text-sm leading-relaxed text-foreground">
            {typedBio}<span className={typedBio.length > 0 ? "animate-blink" : ""}>_</span>
          </p>
        </motion.div>

        {/* CTA + socials on one row */}
        <motion.div
          variants={item}
          className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6"
        >
          <Button
            className="retro-button w-full bg-foreground px-8 py-6 text-sm text-background hover:bg-background hover:text-foreground sm:w-auto"
            asChild
          >
            <a href="#contact">$ hit_me_up</a>
          </Button>

          <div className="flex gap-3">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="hero-social-link"
              >
                {socialIcons[social.icon]}
              </a>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </TerminalFrame>
  );
};

export default HeroSection;
