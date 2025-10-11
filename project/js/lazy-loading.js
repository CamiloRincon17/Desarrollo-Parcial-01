// Sistema de Lazy Loading para imágenes
class LazyLoading {
    constructor() {
        this.imageObserver = null;
        this.init();
    }

    init() {
        // Verificar si el navegador soporta Intersection Observer
        if ('IntersectionObserver' in window) {
            this.setupIntersectionObserver();
        } else {
            // Fallback para navegadores que no soportan Intersection Observer
            this.loadAllImages();
        }
    }

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };

        this.imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        // Observar todas las imágenes con data-src
        this.observeImages();
    }

    observeImages() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            this.imageObserver.observe(img);
        });
    }

    loadImage(img) {
        const src = img.getAttribute('data-src');
        if (src) {
            // Crear una nueva imagen para precargar
            const imageLoader = new Image();
            
            imageLoader.onload = () => {
                // Agregar clase de transición
                img.classList.add('lazy-loaded');
                
                // Cambiar el src
                img.src = src;
                img.removeAttribute('data-src');
                
                // Remover el placeholder si existe
                const placeholder = img.parentElement.querySelector('.lazy-placeholder');
                if (placeholder) {
                    placeholder.remove();
                }
            };

            imageLoader.onerror = () => {
                // Imagen de error si falla la carga
                img.src = 'https://placehold.co/400x300/ccc/fff?text=Imagen+no+disponible';
                img.classList.add('lazy-error');
                img.removeAttribute('data-src');
            };

            imageLoader.src = src;
        }
    }

    loadAllImages() {
        // Fallback: cargar todas las imágenes inmediatamente
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            this.loadImage(img);
        });
    }

    // Método para agregar nuevas imágenes al observer
    observeNewImages() {
        if (this.imageObserver) {
            this.observeImages();
        }
    }
}

// Función para convertir imágenes existentes a lazy loading
function convertToLazyLoading() {
    const images = document.querySelectorAll('img:not([data-src])');
    
    images.forEach(img => {
        const src = img.src;
        if (src && !src.includes('placeholder') && !src.includes('data:')) {
            // Crear placeholder
            const placeholder = document.createElement('div');
            placeholder.className = 'lazy-placeholder';
            placeholder.style.cssText = `
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: shimmer 1.5s infinite;
                width: 100%;
                height: 200px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #999;
                font-size: 14px;
            `;
            placeholder.textContent = 'Cargando...';
            
            // Insertar placeholder antes de la imagen
            img.parentNode.insertBefore(placeholder, img);
            
            // Convertir a lazy loading
            img.setAttribute('data-src', src);
            img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB2aWV3Qm94PSIwIDAgMSAxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmMGYwZjAiLz48L3N2Zz4=';
            img.style.opacity = '0.3';
        }
    });
}

// Agregar estilos para lazy loading
const lazyStyles = document.createElement('style');
lazyStyles.textContent = `
    .lazy-loaded {
        opacity: 1 !important;
        transition: opacity 0.3s ease-in-out;
    }
    
    .lazy-error {
        opacity: 0.5;
        filter: grayscale(100%);
    }
    
    @keyframes shimmer {
        0% {
            background-position: -200px 0;
        }
        100% {
            background-position: calc(200px + 100%) 0;
        }
    }
`;
document.head.appendChild(lazyStyles);

// Inicializar lazy loading cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Convertir imágenes existentes a lazy loading
    convertToLazyLoading();
    
    // Inicializar el sistema de lazy loading
    window.lazyLoading = new LazyLoading();
});

// Función para recargar el observer cuando se agreguen nuevas imágenes
function refreshLazyLoading() {
    if (window.lazyLoading) {
        window.lazyLoading.observeNewImages();
    }
}

// Exportar para uso global
window.refreshLazyLoading = refreshLazyLoading;
