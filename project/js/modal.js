// Sistema de modal de detalles para MotoMax
class MotoModal {
    constructor() {
        this.modal = document.getElementById('motoModal');
        this.closeBtn = document.querySelector('.close-modal');
        this.contactBtn = document.getElementById('contactBtn');
        this.favoriteBtn = document.getElementById('favoriteBtn');
        this.favorites = JSON.parse(localStorage.getItem('motoFavorites') || '[]');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateFavoriteButton();
    }

    setupEventListeners() {
        // Cerrar modal
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }

        // Cerrar al hacer clic fuera del modal
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.close();
                }
            });
        }

        // Cerrar con tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'block') {
                this.close();
            }
        });

        // Botón de contacto
        if (this.contactBtn) {
            this.contactBtn.addEventListener('click', () => this.handleContact());
        }

        // Botón de favoritos
        if (this.favoriteBtn) {
            this.favoriteBtn.addEventListener('click', () => this.toggleFavorite());
        }
    }

    show(motoData) {
        if (!this.modal) return;

        this.currentMoto = motoData;
        this.populateModal(motoData);
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevenir scroll del body
        
        // Animación de entrada
        this.modal.style.animation = 'fadeIn 0.3s ease-out';
    }

    close() {
        if (!this.modal) return;

        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restaurar scroll del body
        this.currentMoto = null;
    }

    populateModal(moto) {
        // Título y estado
        const title = document.getElementById('modalTitle');
        const status = document.getElementById('modalStatus');
        
        if (title) {
            title.textContent = `${moto.marca} ${moto.modelo}`;
        }
        
        if (status) {
            status.textContent = moto.disponible ? 'Disponible' : 'No disponible';
            status.className = `modal-status ${moto.disponible ? 'disponible' : 'no-disponible'}`;
        }

        // Imagen principal
        const image = document.getElementById('modalImage');
        if (image) {
            image.src = moto.imagen;
            image.alt = `${moto.marca} ${moto.modelo}`;
        }

        // Galería de imágenes (simulada con la misma imagen)
        this.setupImageGallery(moto.imagen);

        // Especificaciones
        const specs = document.getElementById('modalSpecs');
        if (specs && moto.especificaciones) {
            specs.innerHTML = '';
            Object.entries(moto.especificaciones).forEach(([key, value]) => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${this.formatSpecName(key)}:</strong> <span>${value}</span>`;
                specs.appendChild(li);
            });
        }

        // Descripción
        const description = document.getElementById('modalDescription');
        if (description) {
            description.textContent = this.generateDescription(moto);
        }

        // Actualizar botón de favoritos
        this.updateFavoriteButton();
    }

    setupImageGallery(mainImage) {
        const gallery = document.getElementById('imageGallery');
        if (!gallery) return;

        // Simular múltiples imágenes (en un caso real, tendrías un array de imágenes)
        const images = [
            mainImage,
            mainImage, // Simular imagen adicional
            mainImage  // Simular otra imagen
        ];

        gallery.innerHTML = '';
        images.forEach((img, index) => {
            const thumb = document.createElement('img');
            thumb.src = img;
            thumb.className = `gallery-thumb ${index === 0 ? 'active' : ''}`;
            thumb.alt = `Vista ${index + 1}`;
            thumb.addEventListener('click', () => this.changeMainImage(img, thumb));
            gallery.appendChild(thumb);
        });
    }

    changeMainImage(imageSrc, clickedThumb) {
        const mainImage = document.getElementById('modalImage');
        if (mainImage) {
            mainImage.src = imageSrc;
        }

        // Actualizar thumbnails activos
        document.querySelectorAll('.gallery-thumb').forEach(thumb => {
            thumb.classList.remove('active');
        });
        clickedThumb.classList.add('active');
    }

    formatSpecName(key) {
        const specNames = {
            'motor': 'Motor',
            'potencia': 'Potencia',
            'peso': 'Peso',
            'precio': 'Precio',
            'cilindrada': 'Cilindrada',
            'transmision': 'Transmisión',
            'frenos': 'Frenos',
            'suspension': 'Suspensión'
        };
        return specNames[key] || key.charAt(0).toUpperCase() + key.slice(1);
    }

    generateDescription(moto) {
        const descriptions = {
            'Superbike': `La ${moto.marca} ${moto.modelo} es una superbike de alto rendimiento diseñada para la velocidad y la precisión en pista. Con su motor ${moto.especificaciones?.motor || 'potente'}, ofrece una experiencia de conducción excepcional para pilotos experimentados.`,
            'Adventure': `La ${moto.marca} ${moto.modelo} es perfecta para aventureros que buscan explorar terrenos variados. Su diseño robusto y versátil la convierte en la compañera ideal para viajes largos y aventuras off-road.`,
            'Scrambler': `La ${moto.marca} ${moto.modelo} combina el estilo clásico con la tecnología moderna. Su diseño único y su carácter distintivo la hacen perfecta para la ciudad y carreteras secundarias.`,
            'Off-Road': `La ${moto.marca} ${moto.modelo} está diseñada para dominar los terrenos más desafiantes. Su construcción resistente y su suspensión especializada la convierten en la elección perfecta para el off-road.`
        };

        // Determinar categoría basada en el contexto o usar descripción genérica
        const categoria = moto.categoria || 'Superbike';
        return descriptions[categoria] || `La ${moto.marca} ${moto.modelo} es una motocicleta excepcional que combina rendimiento, estilo y tecnología avanzada para ofrecer una experiencia de conducción única.`;
    }

    handleContact() {
        if (!this.currentMoto) return;

        // Simular contacto (en un caso real, abrirías un formulario o redirigirías)
        const message = `Interesado en la ${this.currentMoto.marca} ${this.currentMoto.modelo}`;
        
        // Opción 1: WhatsApp
        const whatsappUrl = `https://wa.me/573001234567?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        // Opción 2: Email
        // const emailUrl = `mailto:ventas@motomax.com?subject=Consulta sobre ${this.currentMoto.marca} ${this.currentMoto.modelo}&body=${encodeURIComponent(message)}`;
        // window.location.href = emailUrl;
    }

    toggleFavorite() {
        if (!this.currentMoto) return;

        const motoId = this.currentMoto.id;
        const index = this.favorites.indexOf(motoId);

        if (index > -1) {
            this.favorites.splice(index, 1);
        } else {
            this.favorites.push(motoId);
        }

        localStorage.setItem('motoFavorites', JSON.stringify(this.favorites));
        this.updateFavoriteButton();
        
        // Mostrar notificación
        this.showNotification(
            index > -1 ? 'Eliminado de favoritos' : 'Agregado a favoritos'
        );
    }

    updateFavoriteButton() {
        if (!this.favoriteBtn || !this.currentMoto) return;

        const isFavorite = this.favorites.includes(this.currentMoto.id);
        this.favoriteBtn.textContent = isFavorite ? '❤️ Favorito' : '🤍 Favorito';
        this.favoriteBtn.style.color = isFavorite ? '#e63946' : '#666';
    }

    showNotification(message) {
        // Crear notificación temporal
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: var(--shadow-medium);
            z-index: 3000;
            animation: slideInRight 0.3s ease-out;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }
}

// Función global para abrir el modal desde las tarjetas de motos
function openMotoModal(motoData) {
    if (window.motoModal) {
        window.motoModal.show(motoData);
    }
}

// Inicializar el modal cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    window.motoModal = new MotoModal();
});

// Agregar estilos para las animaciones de notificación
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);
