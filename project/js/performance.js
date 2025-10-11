// Optimizaciones de rendimiento para MotoMax
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.setupImageOptimization();
        this.setupScrollOptimization();
        this.setupResizeOptimization();
        this.setupMemoryManagement();
    }

    // Optimización de imágenes
    setupImageOptimization() {
        // Precargar imágenes críticas
        this.preloadCriticalImages();
        
        // Optimizar carga de imágenes
        this.optimizeImageLoading();
    }

    preloadCriticalImages() {
        const criticalImages = [
            'https://images.ctfassets.net/x7j9qwvpvr5s/45ZhHVy4FiYaE6voY03Y5c/1a0d4a2afb24217f6ce3eeaa4fd268ff/Ducati-MY25-Panigale-V4-ergonomia-gallery-1920x1080-01.jpg'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    optimizeImageLoading() {
        // Agregar loading="lazy" a imágenes que no lo tengan
        const images = document.querySelectorAll('img:not([loading])');
        images.forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
        });
    }

    // Optimización de scroll
    setupScrollOptimization() {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateScrollEffects();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    updateScrollEffects() {
        // Efectos de parallax suaves
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            heroSection.style.transform = `translateY(${parallax}px)`;
        }

        // Mostrar/ocultar header basado en scroll
        const header = document.querySelector('.app-header');
        if (header) {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    }

    // Optimización de resize
    setupResizeOptimization() {
        let resizeTimeout;
        
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        };

        window.addEventListener('resize', handleResize, { passive: true });
    }

    handleResize() {
        // Recalcular layouts si es necesario
        this.refreshLazyLoading();
        this.updateResponsiveElements();
    }

    refreshLazyLoading() {
        if (window.refreshLazyLoading) {
            window.refreshLazyLoading();
        }
    }

    updateResponsiveElements() {
        // Actualizar elementos que dependen del tamaño de pantalla
        const megaMenu = document.querySelector('.mega-menu-models');
        if (megaMenu && window.innerWidth < 768) {
            megaMenu.style.display = 'none';
        }
    }

    // Gestión de memoria
    setupMemoryManagement() {
        // Limpiar event listeners cuando sea necesario
        this.setupCleanup();
        
        // Optimizar uso de memoria
        this.optimizeMemoryUsage();
    }

    setupCleanup() {
        // Limpiar al cambiar de página (si es SPA)
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });
    }

    cleanup() {
        // Limpiar timeouts e intervals
        const highestTimeoutId = setTimeout(() => {}, 0);
        for (let i = 0; i < highestTimeoutId; i++) {
            clearTimeout(i);
        }

        // Limpiar event listeners si es necesario
        // (En este caso, los event listeners se limpian automáticamente)
    }

    optimizeMemoryUsage() {
        // Debounce para funciones costosas
        this.debounce = (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        };

        // Throttle para funciones que se ejecutan frecuentemente
        this.throttle = (func, limit) => {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        };
    }

    // Método para optimizar animaciones
    optimizeAnimations() {
        // Usar transform y opacity para animaciones suaves
        const animatedElements = document.querySelectorAll('[class*="animate"], [class*="transition"]');
        
        animatedElements.forEach(element => {
            element.style.willChange = 'transform, opacity';
        });
    }

    // Método para comprimir datos
    compressData(data) {
        // Simulación de compresión (en un caso real usarías una librería)
        return JSON.stringify(data);
    }

    // Método para cache de datos
    setupDataCache() {
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutos

        this.getCachedData = (key) => {
            const cached = this.cache.get(key);
            if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
            return null;
        };

        this.setCachedData = (key, data) => {
            this.cache.set(key, {
                data: data,
                timestamp: Date.now()
            });
        };
    }
}

// Optimizaciones adicionales
class AdvancedOptimizations {
    constructor() {
        this.init();
    }

    init() {
        this.setupServiceWorker();
        this.setupResourceHints();
        this.setupCriticalCSS();
    }

    setupServiceWorker() {
        // Registrar service worker si está disponible
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registrado:', registration);
                })
                .catch(error => {
                    console.log('Error al registrar SW:', error);
                });
        }
    }

    setupResourceHints() {
        // Agregar hints para recursos críticos
        const hints = [
            { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
            { rel: 'preconnect', href: 'https://images.ctfassets.net' },
            { rel: 'preconnect', href: 'https://placehold.co' }
        ];

        hints.forEach(hint => {
            const link = document.createElement('link');
            link.rel = hint.rel;
            link.href = hint.href;
            document.head.appendChild(link);
        });
    }

    setupCriticalCSS() {
        // Inline critical CSS (ya está en el HTML)
        // Aquí podrías agregar lógica para cargar CSS no crítico de forma asíncrona
        const nonCriticalCSS = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])');
        nonCriticalCSS.forEach(link => {
            link.media = 'print';
            link.onload = function() {
                this.media = 'all';
            };
        });
    }
}

// Inicializar optimizaciones cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    window.performanceOptimizer = new PerformanceOptimizer();
    window.advancedOptimizations = new AdvancedOptimizations();
});

// Exportar para uso global
window.PerformanceOptimizer = PerformanceOptimizer;
window.AdvancedOptimizations = AdvancedOptimizations;
