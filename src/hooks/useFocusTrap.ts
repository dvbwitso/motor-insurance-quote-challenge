import { useEffect, useRef } from 'react';

interface UseFocusTrapOptions {
  active?: boolean;
  restoreFocus?: boolean;
  initialFocus?: string | HTMLElement;
}

export const useFocusTrap = (options: UseFocusTrapOptions = {}) => {
  const { active = true, restoreFocus = true, initialFocus } = options;
  const containerRef = useRef<HTMLElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    
    // Store the previously focused element
    if (restoreFocus) {
      previouslyFocusedElementRef.current = document.activeElement as HTMLElement;
    }

    // Get all focusable elements within the container
    const getFocusableElements = (): HTMLElement[] => {
      const focusableSelectors = [
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        'a[href]',
        '[tabindex]:not([tabindex="-1"])',
        '[contenteditable="true"]',
      ].join(', ');

      return Array.from(container.querySelectorAll(focusableSelectors)).filter(
        (element) => {
          const el = element as HTMLElement;
          return (
            el.offsetWidth > 0 &&
            el.offsetHeight > 0 &&
            getComputedStyle(el).visibility !== 'hidden'
          );
        }
      ) as HTMLElement[];
    };

    // Handle Tab key navigation
    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement || !lastElement) return;

      if (event.shiftKey) {
        // Shift + Tab: moving backwards
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: moving forwards
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    // Handle Escape key
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        if (restoreFocus && previouslyFocusedElementRef.current) {
          previouslyFocusedElementRef.current.focus();
        }
      }
    };

    // Set initial focus
    const setInitialFocus = () => {
      let elementToFocus: HTMLElement | null = null;

      if (initialFocus) {
        if (typeof initialFocus === 'string') {
          elementToFocus = container.querySelector(initialFocus) as HTMLElement;
        } else {
          elementToFocus = initialFocus;
        }
      }

      if (!elementToFocus) {
        const focusableElements = getFocusableElements();
        elementToFocus = focusableElements[0];
      }

      if (elementToFocus) {
        // Use setTimeout to ensure the element is rendered and focusable
        setTimeout(() => {
          elementToFocus?.focus();
        }, 0);
      }
    };

    // Add event listeners
    container.addEventListener('keydown', handleTabKey);
    container.addEventListener('keydown', handleEscapeKey);

    // Set initial focus
    setInitialFocus();

    // Cleanup function
    return () => {
      container.removeEventListener('keydown', handleTabKey);
      container.removeEventListener('keydown', handleEscapeKey);

      // Restore focus to previously focused element
      if (restoreFocus && previouslyFocusedElementRef.current) {
        previouslyFocusedElementRef.current.focus();
      }
    };
  }, [active, restoreFocus, initialFocus]);

  return containerRef;
};

export default useFocusTrap;
