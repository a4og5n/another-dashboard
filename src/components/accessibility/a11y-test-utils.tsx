'use client';

import { useEffect, useState } from 'react';
import axe, { AxeResults } from 'axe-core';

interface A11yTestResult {
  violations: AxeResults['violations'];
  passes: AxeResults['passes'];
  incomplete: AxeResults['incomplete'];
  timestamp: Date;
}

/**
 * Hook for running accessibility tests in development
 * 
 * Usage:
 * ```tsx
 * function MyComponent() {
 *   const a11yResults = useA11yTest();
 *   
 *   // In development, check console for a11y results
 *   useEffect(() => {
 *     if (process.env.NODE_ENV === 'development' && a11yResults) {
 *       console.log('A11y Test Results:', a11yResults);
 *     }
 *   }, [a11yResults]);
 *   
 *   return <div>Component content</div>;
 * }
 * ```
 */
export function useA11yTest(element?: Element) {
  const [results, setResults] = useState<A11yTestResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    const runTest = async () => {
      setIsRunning(true);
      try {
        const targetElement = element || document.body;
        const axeResults = await axe.run(targetElement);
        
        setResults({
          violations: axeResults.violations,
          passes: axeResults.passes,
          incomplete: axeResults.incomplete,
          timestamp: new Date(),
        });

        // Log results to console in development
        if (axeResults.violations.length > 0) {
          console.warn('🚫 Accessibility violations found:', axeResults.violations);
        } else {
          console.log('✅ No accessibility violations found');
        }
      } catch (error) {
        console.error('Error running accessibility test:', error);
      } finally {
        setIsRunning(false);
      }
    };

    // Run test after component mounts and DOM is ready
    const timer = setTimeout(runTest, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [element]);

  return { results, isRunning };
}

/**
 * Development-only accessibility testing component
 * Add this component to any page or component to run accessibility tests
 * 
 * Usage:
 * ```tsx
 * <A11yTester>
 *   <YourComponent />
 * </A11yTester>
 * ```
 */
export function A11yTester({ children }: { children: React.ReactNode }) {
  const { results } = useA11yTest();

  // Only render in development
  if (process.env.NODE_ENV !== 'development') {
    return <>{children}</>;
  }

  return (
    <div>
      {children}
      {results && results.violations.length > 0 && (
        <div 
          role="alert" 
          aria-live="polite"
          style={{
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            background: '#ff6b6b',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            fontSize: '12px',
            maxWidth: '300px',
            zIndex: 9999,
          }}
        >
          <strong>⚠️ A11y Issues Found:</strong>
          <div>{results.violations.length} violation(s)</div>
          <div style={{ fontSize: '10px', marginTop: '5px' }}>
            Check console for details
          </div>
        </div>
      )}
    </div>
  );
}
