/**
 * Profile Constants
 *
 * Single source of truth for personal data referenced across the portfolio.
 * Previously duplicated between HeroSection and ContactSection; the bento
 * tiles need the same values, so they live here.
 */

export const NAME = 'Hassan';

export const LOCATION = 'Bangalore';

/** IANA timezone, used by the ~/time tile via Intl.DateTimeFormat */
export const TIMEZONE = 'Asia/Kolkata';

/** Short label shown next to the clock */
export const TIMEZONE_LABEL = 'IST';

export const GITHUB_USERNAME = 'hassarch';

export const EMAIL = 'hassanrj245@gmail.com';

export const PHONE = '+91 8710030521';

/**
 * Public resume URL. Left empty until a resume is hosted — the navbar CTA
 * only renders when this is non-empty, so nothing breaks in the meantime.
 */
export const RESUME_URL = '';

export const GITHUB_URL = `https://github.com/${GITHUB_USERNAME}`;
export const GITHUB_REPOS_URL = `${GITHUB_URL}?tab=repositories`;
export const LINKEDIN_URL = 'https://www.linkedin.com/in/hassan0777/';
export const X_URL = 'https://x.com/sanxshade';

export interface SocialLinkDef {
  /** Stable key + accessible label */
  label: string;
  href: string;
  /** Which icon the consuming component should render */
  icon: 'github' | 'x' | 'linkedin' | 'mail';
}

export const SOCIALS: SocialLinkDef[] = [
  { label: 'GitHub', href: GITHUB_URL, icon: 'github' },
  { label: 'X', href: X_URL, icon: 'x' },
  { label: 'LinkedIn', href: LINKEDIN_URL, icon: 'linkedin' },
  { label: 'Email', href: `mailto:${EMAIL}`, icon: 'mail' },
];
