// Parallax Scroll Effect
export const initParallax = () => {
  const handleScroll = () => {
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    const scrolled = window.pageYOffset;

    parallaxLayers.forEach(layer => {
      const speed = layer.dataset.speed || 0.5;
      const yPos = -(scrolled * speed);
      layer.style.transform = `translateY(${yPos}px)`;
    });
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
};
