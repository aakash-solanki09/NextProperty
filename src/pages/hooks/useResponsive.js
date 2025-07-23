import { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';

const useResponsive = () => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Breakpoint definitions (mobile-first)
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const isDesktop = useMediaQuery({ minWidth: 1024 });
  const isLargeDesktop = useMediaQuery({ minWidth: 1440 });
  
  // Specific size queries
  const isSmallMobile = useMediaQuery({ maxWidth: 360 });
  const isMediumMobile = useMediaQuery({ minWidth: 361, maxWidth: 640 });
  const isLargeMobile = useMediaQuery({ minWidth: 641, maxWidth: 767 });
  const isSmallTablet = useMediaQuery({ minWidth: 768, maxWidth: 899 });
  const isLargeTablet = useMediaQuery({ minWidth: 900, maxWidth: 1023 });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper functions for responsive behavior
  const getGridCols = () => {
    if (isSmallMobile) return 1;
    if (isMediumMobile) return 1;
    if (isLargeMobile) return 2;
    if (isTablet) return 2;
    if (isDesktop) return 3;
    if (isLargeDesktop) return 4;
    return 3;
  };

  const getContainerPadding = () => {
    if (isSmallMobile) return 'px-2';
    if (isMobile) return 'px-4';
    if (isTablet) return 'px-6';
    return 'px-8';
  };

  const getTextSize = (base = 'base') => {
    const sizes = {
      xs: isMobile ? 'text-xs' : 'text-sm',
      sm: isMobile ? 'text-sm' : 'text-base',
      base: isMobile ? 'text-base' : 'text-lg',
      lg: isMobile ? 'text-lg' : 'text-xl',
      xl: isMobile ? 'text-xl' : 'text-2xl',
      '2xl': isMobile ? 'text-2xl' : 'text-3xl',
      '3xl': isMobile ? 'text-3xl' : 'text-4xl',
      '4xl': isMobile ? 'text-4xl' : 'text-5xl',
    };
    return sizes[base] || sizes.base;
  };

  const getSpacing = (size = 'md') => {
    const spacing = {
      xs: isMobile ? 'p-1' : 'p-2',
      sm: isMobile ? 'p-2' : 'p-3',
      md: isMobile ? 'p-3' : 'p-4',
      lg: isMobile ? 'p-4' : 'p-6',
      xl: isMobile ? 'p-6' : 'p-8',
    };
    return spacing[size] || spacing.md;
  };

  const getNavLayout = () => {
    if (isMobile) return 'mobile';
    if (isTablet) return 'tablet';
    return 'desktop';
  };

  return {
    // Device type flags
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    isSmallMobile,
    isMediumMobile,
    isLargeMobile,
    isSmallTablet,
    isLargeTablet,
    
    // Dimensions
    width: dimensions.width,
    height: dimensions.height,
    
    // Helper functions
    getGridCols,
    getContainerPadding,
    getTextSize,
    getSpacing,
    getNavLayout,
    
    // Responsive values
    navHeight: isMobile ? '64px' : '72px',
    cardMinHeight: isMobile ? '200px' : '250px',
    buttonSize: isMobile ? 'sm' : 'md',
    modalWidth: isMobile ? '95vw' : isTablet ? '80vw' : '600px',
  };
};

export default useResponsive;