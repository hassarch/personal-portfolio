import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Smoothly scrolls to a target section with centered positioning
 * @param sectionId - The ID of the target section element
 */
export const navigateToSection = (sectionId: string): void => {
  const element = document.querySelector(`#${sectionId}`);
  if (!element) {
    console.warn(`Section with id "${sectionId}" not found`);
    return;
  }

  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
  const offsetPosition = elementPosition - (window.innerHeight / 2) + (element.clientHeight / 2);

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
};

/**
 * Hook to track the current visible section using IntersectionObserver
 * @param sectionIds - Optional array of section IDs to observe. If not provided, observes all sections with IDs
 * @param threshold - Intersection threshold (default: 0.5 = 50% visibility)
 * @returns The ID of the currently visible section
 */
export const useCurrentSection = (
  sectionIds?: string[],
  threshold: number = 0.5
): string => {
  const [currentSection, setCurrentSection] = useState<string>('');
  // Last known visibility ratio per section id. Kept across callbacks so the
  // most-visible section wins, rather than whichever entry happened to fire
  // last — otherwise a brief intersection during layout sticks permanently.
  const ratiosRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const ratios = ratiosRef.current;
    ratios.clear();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(
            entry.target.id,
            entry.isIntersecting ? entry.intersectionRatio : 0
          );
        });

        let best = '';
        let bestRatio = 0;
        ratios.forEach((ratio, id) => {
          // >= so the most recently updated section wins ties
          if (ratio > 0 && ratio >= bestRatio) {
            best = id;
            bestRatio = ratio;
          }
        });

        // Nothing visible (e.g. scrolled into the footer) — keep the last
        // active section rather than flickering the nav back to nothing.
        if (best) {
          setCurrentSection(best);
        }
      },
      {
        threshold,
        rootMargin: '-50px 0px -50px 0px' // Adjust for centered detection
      }
    );

    // Observe specified sections or all sections with IDs
    const sectionsToObserve = sectionIds
      ? sectionIds.map(id => document.querySelector(`#${id}`)).filter(Boolean)
      : Array.from(document.querySelectorAll('section[id]'));

    sectionsToObserve.forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, [sectionIds, threshold]);

  return currentSection;
};

/**
 * Hook that provides both navigation function and current section tracking
 * @param sectionIds - Optional array of section IDs to observe
 * @param threshold - Intersection threshold for visibility detection
 * @returns Object containing navigateToSection function and currentSection state
 */
export const useScrollNavigation = (
  sectionIds?: string[],
  threshold: number = 0.5
) => {
  const currentSection = useCurrentSection(sectionIds, threshold);

  const navigate = useCallback((sectionId: string) => {
    navigateToSection(sectionId);
  }, []);

  return {
    currentSection,
    navigate,
    navigateToSection: navigate
  };
};
