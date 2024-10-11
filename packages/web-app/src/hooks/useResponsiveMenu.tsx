import { useState, useEffect, useCallback } from 'react';

export const useResponsiveMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResize = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 768);
      }
    } catch (err) {
      setError(`Resize error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, []);

  useEffect(() => {
    try {
      handleResize();
      if (typeof window !== 'undefined') {
        window.addEventListener('resize', handleResize);
        return () => {
          try {
            window.removeEventListener('resize', handleResize);
          } catch (err) {
            console.error('Error removing resize listener:', err);
          }
        };
      }
    } catch (err) {
      setError(`Effect error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [handleResize]);

  const toggleMenu = useCallback(() => {
    try {
      setIsMenuOpen(!isMenuOpen);
    } catch (err) {
      setError(`Toggle menu error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [isMenuOpen]);

  return { isMenuOpen, isMobile, toggleMenu, error };
};