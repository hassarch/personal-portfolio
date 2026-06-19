import { useState, useEffect, useCallback } from 'react';

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentSection(entry.target.id);
          }
        });
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
