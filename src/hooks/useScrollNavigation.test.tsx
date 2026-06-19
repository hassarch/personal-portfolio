import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { navigateToSection, useCurrentSection, useScrollNavigation } from './useScrollNavigation';

describe('navigateToSection', () => {
  beforeEach(() => {
    // Mock window.scrollTo
    window.scrollTo = vi.fn();
    
    // Mock window dimensions
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 1000,
    });
    
    Object.defineProperty(window, 'pageYOffset', {
      writable: true,
      configurable: true,
      value: 0,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('scrolls to section with centered positioning', () => {
    // Create a mock section element
    const section = document.createElement('section');
    section.id = 'test-section';
    section.getBoundingClientRect = vi.fn(() => ({
      top: 500,
      bottom: 700,
      left: 0,
      right: 0,
      width: 0,
      height: 200,
      x: 0,
      y: 500,
      toJSON: () => {},
    }));
    
    Object.defineProperty(section, 'clientHeight', {
      value: 200,
      writable: false,
    });
    
    document.body.appendChild(section);

    navigateToSection('test-section');

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 100, // 500 (elementPosition) - (1000/2 - 200/2) = 500 - 400 = 100
      behavior: 'smooth',
    });
  });

  it('does nothing if section does not exist', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    navigateToSection('non-existent-section');

    expect(window.scrollTo).not.toHaveBeenCalled();
    expect(consoleWarnSpy).toHaveBeenCalledWith('Section with id "non-existent-section" not found');
    
    consoleWarnSpy.mockRestore();
  });

  it('handles sections at different scroll positions', () => {
    const section = document.createElement('section');
    section.id = 'about';
    section.getBoundingClientRect = vi.fn(() => ({
      top: 2000,
      bottom: 2500,
      left: 0,
      right: 0,
      width: 0,
      height: 500,
      x: 0,
      y: 2000,
      toJSON: () => {},
    }));
    
    Object.defineProperty(section, 'clientHeight', {
      value: 500,
      writable: false,
    });
    
    document.body.appendChild(section);

    navigateToSection('about');

    // 2000 (top) + 0 (pageYOffset) - (1000/2 - 500/2) = 2000 - 250 = 1750
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 1750,
      behavior: 'smooth',
    });
  });

  it('handles small sections correctly', () => {
    const section = document.createElement('section');
    section.id = 'small-section';
    section.getBoundingClientRect = vi.fn(() => ({
      top: 300,
      bottom: 350,
      left: 0,
      right: 0,
      width: 0,
      height: 50,
      x: 0,
      y: 300,
      toJSON: () => {},
    }));
    
    Object.defineProperty(section, 'clientHeight', {
      value: 50,
      writable: false,
    });
    
    document.body.appendChild(section);

    navigateToSection('small-section');

    // 300 - (1000/2 - 50/2) = 300 - 475 = -175 (will scroll to top)
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: -175,
      behavior: 'smooth',
    });
  });
});

describe('useCurrentSection', () => {
  let mockIntersectionObserver: any;
  let observerCallback: IntersectionObserverCallback;

  beforeEach(() => {
    // Mock IntersectionObserver
    mockIntersectionObserver = vi.fn(function(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
      observerCallback = callback;
      return {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
        takeRecords: vi.fn(() => []),
        root: null,
        rootMargin: options?.rootMargin || '',
        thresholds: Array.isArray(options?.threshold) ? options.threshold : [options?.threshold || 0],
      };
    });

    global.IntersectionObserver = mockIntersectionObserver as any;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('initializes with empty string as current section', () => {
    const { result } = renderHook(() => useCurrentSection());
    
    expect(result.current).toBe('');
  });

  it('creates IntersectionObserver with correct options', () => {
    renderHook(() => useCurrentSection(undefined, 0.5));

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        threshold: 0.5,
        rootMargin: '-50px 0px -50px 0px',
      }
    );
  });

  it('updates current section when section intersects', () => {
    const section = document.createElement('section');
    section.id = 'about';
    document.body.appendChild(section);

    const { result } = renderHook(() => useCurrentSection());

    // Simulate intersection
    act(() => {
      observerCallback([
        {
          target: section,
          isIntersecting: true,
          boundingClientRect: {} as DOMRectReadOnly,
          intersectionRatio: 0.5,
          intersectionRect: {} as DOMRectReadOnly,
          rootBounds: null,
          time: Date.now(),
        },
      ], {} as IntersectionObserver);
    });

    expect(result.current).toBe('about');
  });

  it('observes all sections with IDs when sectionIds not provided', () => {
    const section1 = document.createElement('section');
    section1.id = 'home';
    const section2 = document.createElement('section');
    section2.id = 'about';
    const section3 = document.createElement('section');
    section3.id = 'projects';
    
    document.body.appendChild(section1);
    document.body.appendChild(section2);
    document.body.appendChild(section3);

    const { result } = renderHook(() => useCurrentSection());

    const observerInstance = mockIntersectionObserver.mock.results[0].value;
    expect(observerInstance.observe).toHaveBeenCalledTimes(3);
  });

  it('observes only specified sections when sectionIds provided', () => {
    const section1 = document.createElement('section');
    section1.id = 'home';
    const section2 = document.createElement('section');
    section2.id = 'about';
    const section3 = document.createElement('section');
    section3.id = 'projects';
    
    document.body.appendChild(section1);
    document.body.appendChild(section2);
    document.body.appendChild(section3);

    const { result } = renderHook(() => useCurrentSection(['home', 'about']));

    const observerInstance = mockIntersectionObserver.mock.results[0].value;
    expect(observerInstance.observe).toHaveBeenCalledTimes(2);
  });

  it('does not update when section is not intersecting', () => {
    const section = document.createElement('section');
    section.id = 'about';
    document.body.appendChild(section);

    const { result } = renderHook(() => useCurrentSection());

    const initialValue = result.current;

    // Simulate non-intersection
    act(() => {
      observerCallback([
        {
          target: section,
          isIntersecting: false,
          boundingClientRect: {} as DOMRectReadOnly,
          intersectionRatio: 0,
          intersectionRect: {} as DOMRectReadOnly,
          rootBounds: null,
          time: Date.now(),
        },
      ], {} as IntersectionObserver);
    });

    expect(result.current).toBe(initialValue);
  });

  it('disconnects observer on unmount', () => {
    const section = document.createElement('section');
    section.id = 'about';
    document.body.appendChild(section);

    const { unmount } = renderHook(() => useCurrentSection());

    const observerInstance = mockIntersectionObserver.mock.results[0].value;
    
    unmount();

    expect(observerInstance.disconnect).toHaveBeenCalled();
  });

  it('uses custom threshold value', () => {
    renderHook(() => useCurrentSection(undefined, 0.75));

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        threshold: 0.75,
      })
    );
  });

  it('handles multiple section transitions', () => {
    const section1 = document.createElement('section');
    section1.id = 'home';
    const section2 = document.createElement('section');
    section2.id = 'about';
    
    document.body.appendChild(section1);
    document.body.appendChild(section2);

    const { result } = renderHook(() => useCurrentSection());

    // First section intersects
    act(() => {
      observerCallback([
        {
          target: section1,
          isIntersecting: true,
          boundingClientRect: {} as DOMRectReadOnly,
          intersectionRatio: 0.5,
          intersectionRect: {} as DOMRectReadOnly,
          rootBounds: null,
          time: Date.now(),
        },
      ], {} as IntersectionObserver);
    });

    expect(result.current).toBe('home');

    // Second section intersects
    act(() => {
      observerCallback([
        {
          target: section2,
          isIntersecting: true,
          boundingClientRect: {} as DOMRectReadOnly,
          intersectionRatio: 0.5,
          intersectionRect: {} as DOMRectReadOnly,
          rootBounds: null,
          time: Date.now(),
        },
      ], {} as IntersectionObserver);
    });

    expect(result.current).toBe('about');
  });
});

describe('useScrollNavigation', () => {
  let mockIntersectionObserver: any;
  let observerCallback: IntersectionObserverCallback;

  beforeEach(() => {
    // Mock window.scrollTo
    window.scrollTo = vi.fn();
    
    // Mock window dimensions
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 1000,
    });
    
    Object.defineProperty(window, 'pageYOffset', {
      writable: true,
      configurable: true,
      value: 0,
    });

    // Mock IntersectionObserver
    mockIntersectionObserver = vi.fn(function(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
      observerCallback = callback;
      return {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
        takeRecords: vi.fn(() => []),
        root: null,
        rootMargin: options?.rootMargin || '',
        thresholds: Array.isArray(options?.threshold) ? options.threshold : [options?.threshold || 0],
      };
    });

    global.IntersectionObserver = mockIntersectionObserver as any;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('returns current section and navigate function', () => {
    const { result } = renderHook(() => useScrollNavigation());

    expect(result.current).toHaveProperty('currentSection');
    expect(result.current).toHaveProperty('navigate');
    expect(result.current).toHaveProperty('navigateToSection');
    expect(typeof result.current.navigate).toBe('function');
    expect(typeof result.current.navigateToSection).toBe('function');
  });

  it('navigate function scrolls to section', () => {
    const section = document.createElement('section');
    section.id = 'projects';
    section.getBoundingClientRect = vi.fn(() => ({
      top: 500,
      bottom: 700,
      left: 0,
      right: 0,
      width: 0,
      height: 200,
      x: 0,
      y: 500,
      toJSON: () => {},
    }));
    
    Object.defineProperty(section, 'clientHeight', {
      value: 200,
      writable: false,
    });
    
    document.body.appendChild(section);

    const { result } = renderHook(() => useScrollNavigation());

    act(() => {
      result.current.navigate('projects');
    });

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 100,
      behavior: 'smooth',
    });
  });

  it('tracks current section via IntersectionObserver', () => {
    const section = document.createElement('section');
    section.id = 'skills';
    document.body.appendChild(section);

    const { result } = renderHook(() => useScrollNavigation());

    expect(result.current.currentSection).toBe('');

    // Simulate intersection
    act(() => {
      observerCallback([
        {
          target: section,
          isIntersecting: true,
          boundingClientRect: {} as DOMRectReadOnly,
          intersectionRatio: 0.5,
          intersectionRect: {} as DOMRectReadOnly,
          rootBounds: null,
          time: Date.now(),
        },
      ], {} as IntersectionObserver);
    });

    expect(result.current.currentSection).toBe('skills');
  });

  it('navigate function reference stays stable', () => {
    const { result, rerender } = renderHook(() => useScrollNavigation());

    const firstNavigate = result.current.navigate;
    
    rerender();
    
    expect(result.current.navigate).toBe(firstNavigate);
  });

  it('passes through sectionIds to useCurrentSection', () => {
    const section1 = document.createElement('section');
    section1.id = 'home';
    const section2 = document.createElement('section');
    section2.id = 'about';
    const section3 = document.createElement('section');
    section3.id = 'projects';
    
    document.body.appendChild(section1);
    document.body.appendChild(section2);
    document.body.appendChild(section3);

    renderHook(() => useScrollNavigation(['home', 'projects']));

    const observerInstance = mockIntersectionObserver.mock.results[0].value;
    expect(observerInstance.observe).toHaveBeenCalledTimes(2);
  });

  it('passes through threshold to useCurrentSection', () => {
    renderHook(() => useScrollNavigation(undefined, 0.8));

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        threshold: 0.8,
      })
    );
  });
});
