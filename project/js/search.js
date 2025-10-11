// Sistema de búsqueda avanzada para MotoMax
class SearchSystem {
    constructor() {
        this.searchInput = document.getElementById('searchInput');
        this.searchResults = document.getElementById('searchResults');
        this.searchBtn = document.getElementById('searchBtn');
        
        // Elementos móviles
        this.mobileSearchInput = document.getElementById('mobileSearchInput');
        this.mobileSearchResults = document.getElementById('mobileSearchResults');
        this.mobileSearchBtn = document.getElementById('mobileSearchBtn');
        
        this.motosData = null;
        this.searchTimeout = null;
        
        this.init();
    }

    async init() {
        // Cargar datos de motos
        await this.loadMotosData();
        
        // Configurar eventos
        this.setupEventListeners();
    }

    async loadMotosData() {
        try {
            const response = await fetch('data/producto.json');
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            this.motosData = await response.json();
        } catch (error) {
            console.error('Error al cargar datos de motos:', error);
            this.motosData = {};
        }
    }

    setupEventListeners() {
        // Búsqueda desktop
        if (this.searchInput) {
            this.setupDesktopSearch();
        }

        // Búsqueda móvil
        if (this.mobileSearchInput) {
            this.setupMobileSearch();
        }
    }

    setupDesktopSearch() {
        // Búsqueda en tiempo real
        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(this.searchTimeout);
            const query = e.target.value.trim();
            
            if (query.length >= 2) {
                this.searchTimeout = setTimeout(() => {
                    this.performSearch(query, 'desktop');
                }, 300);
            } else {
                this.hideResults('desktop');
            }
        });

        // Búsqueda al hacer clic en el botón
        if (this.searchBtn) {
            this.searchBtn.addEventListener('click', () => {
                const query = this.searchInput.value.trim();
                if (query.length >= 2) {
                    this.performSearch(query, 'desktop');
                }
            });
        }

        // Cerrar resultados al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.hideResults('desktop');
            }
        });

        // Navegación con teclado
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideResults('desktop');
                this.searchInput.blur();
            }
        });
    }

    setupMobileSearch() {
        // Búsqueda en tiempo real móvil
        this.mobileSearchInput.addEventListener('input', (e) => {
            clearTimeout(this.searchTimeout);
            const query = e.target.value.trim();
            
            if (query.length >= 2) {
                this.searchTimeout = setTimeout(() => {
                    this.performSearch(query, 'mobile');
                }, 300);
            } else {
                this.hideResults('mobile');
            }
        });

        // Búsqueda al hacer clic en el botón móvil
        if (this.mobileSearchBtn) {
            this.mobileSearchBtn.addEventListener('click', () => {
                const query = this.mobileSearchInput.value.trim();
                if (query.length >= 2) {
                    this.performSearch(query, 'mobile');
                }
            });
        }

        // Cerrar resultados móviles al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.mobile-search')) {
                this.hideResults('mobile');
            }
        });

        // Navegación con teclado móvil
        this.mobileSearchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideResults('mobile');
                this.mobileSearchInput.blur();
            }
        });
    }

    performSearch(query, platform = 'desktop') {
        if (!this.motosData || Object.keys(this.motosData).length === 0) {
            this.showNoDataMessage(platform);
            return;
        }

        const results = this.searchMotos(query);
        this.displayResults(results, query, platform);
    }

    searchMotos(query) {
        const results = [];
        const searchTerm = query.toLowerCase();

        // Buscar en todas las categorías
        for (const [categoria, motos] of Object.entries(this.motosData)) {
            if (Array.isArray(motos)) {
                motos.forEach(moto => {
                    const score = this.calculateRelevanceScore(moto, searchTerm);
                    if (score > 0) {
                        results.push({
                            ...moto,
                            categoria,
                            score
                        });
                    }
                });
            }
        }

        // Ordenar por relevancia
        return results.sort((a, b) => b.score - a.score).slice(0, 8);
    }

    calculateRelevanceScore(moto, searchTerm) {
        let score = 0;
        const searchFields = [
            moto.marca?.toLowerCase() || '',
            moto.modelo?.toLowerCase() || '',
            moto.especificaciones?.motor?.toLowerCase() || '',
            moto.especificaciones?.potencia?.toLowerCase() || ''
        ];

        searchFields.forEach(field => {
            if (field.includes(searchTerm)) {
                score += 10;
            }
            if (field.startsWith(searchTerm)) {
                score += 5;
            }
            if (field.includes(searchTerm.split(' ')[0])) {
                score += 3;
            }
        });

        return score;
    }

    displayResults(results, query, platform = 'desktop') {
        const resultsContainer = platform === 'mobile' ? this.mobileSearchResults : this.searchResults;
        if (!resultsContainer) return;

        if (results.length === 0) {
            this.showNoResultsMessage(query, platform);
            return;
        }

        const itemClass = platform === 'mobile' ? 'mobile-search-result-item' : 'search-result-item';
        const infoClass = platform === 'mobile' ? 'mobile-search-result-info' : 'search-result-info';

        const html = results.map(moto => `
            <div class="${itemClass}" data-moto-id="${moto.id}">
                <img src="${moto.imagen}" alt="${moto.marca} ${moto.modelo}" 
                     onerror="this.src='https://placehold.co/40x40/ccc/fff?text=IMG'">
                <div class="${infoClass}">
                    <h4>${this.highlightSearchTerm(moto.marca + ' ' + moto.modelo, query)}</h4>
                    <p>${moto.especificaciones?.precio || 'Precio no disponible'} • ${moto.categoria}</p>
                </div>
            </div>
        `).join('');

        resultsContainer.innerHTML = html;
        this.showResults(platform);

        // Agregar eventos a los resultados
        this.attachResultEvents(platform);
    }

    highlightSearchTerm(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark style="background: #ffeb3b; padding: 2px 4px; border-radius: 3px;">$1</mark>');
    }

    attachResultEvents(platform = 'desktop') {
        const resultsContainer = platform === 'mobile' ? this.mobileSearchResults : this.searchResults;
        const itemClass = platform === 'mobile' ? '.mobile-search-result-item' : '.search-result-item';
        
        if (!resultsContainer) return;
        
        const resultItems = resultsContainer.querySelectorAll(itemClass);
        resultItems.forEach(item => {
            item.addEventListener('click', () => {
                const motoId = item.dataset.motoId;
                this.selectMoto(motoId, platform);
            });
        });
    }

    selectMoto(motoId, platform = 'desktop') {
        // Scroll hacia la moto seleccionada
        const motoElement = document.getElementById(`moto-${motoId}`);
        if (motoElement) {
            motoElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            // Efecto visual de resaltado
            motoElement.style.animation = 'pulse 1s ease-in-out';
            setTimeout(() => {
                motoElement.style.animation = '';
            }, 1000);
        }
        
        this.hideResults(platform);
        
        // Limpiar input correspondiente
        if (platform === 'mobile' && this.mobileSearchInput) {
            this.mobileSearchInput.value = '';
        } else if (platform === 'desktop' && this.searchInput) {
            this.searchInput.value = '';
        }
        
        // Cerrar menú móvil si está abierto
        if (platform === 'mobile') {
            const mobileMenu = document.getElementById('mobileMenu');
            if (mobileMenu) {
                mobileMenu.classList.remove('active');
            }
        }
    }

    showResults(platform = 'desktop') {
        const resultsContainer = platform === 'mobile' ? this.mobileSearchResults : this.searchResults;
        if (resultsContainer) {
            resultsContainer.style.display = 'block';
        }
    }

    hideResults(platform = 'desktop') {
        const resultsContainer = platform === 'mobile' ? this.mobileSearchResults : this.searchResults;
        if (resultsContainer) {
            resultsContainer.style.display = 'none';
        }
    }

    showNoResultsMessage(query, platform = 'desktop') {
        const resultsContainer = platform === 'mobile' ? this.mobileSearchResults : this.searchResults;
        const itemClass = platform === 'mobile' ? 'mobile-search-result-item' : 'search-result-item';
        const infoClass = platform === 'mobile' ? 'mobile-search-result-info' : 'search-result-info';
        
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="${itemClass}" style="text-align: center; color: #666;">
                    <div class="${infoClass}">
                        <h4>No se encontraron resultados</h4>
                        <p>No hay motos que coincidan con "${query}"</p>
                    </div>
                </div>
            `;
            this.showResults(platform);
        }
    }

    showNoDataMessage(platform = 'desktop') {
        const resultsContainer = platform === 'mobile' ? this.mobileSearchResults : this.searchResults;
        const itemClass = platform === 'mobile' ? 'mobile-search-result-item' : 'search-result-item';
        const infoClass = platform === 'mobile' ? 'mobile-search-result-info' : 'search-result-info';
        
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="${itemClass}" style="text-align: center; color: #666;">
                    <div class="${infoClass}">
                        <h4>Datos no disponibles</h4>
                        <p>No se pudieron cargar los datos de motos</p>
                    </div>
                </div>
            `;
            this.showResults(platform);
        }
    }
}

// Inicializar el sistema de búsqueda cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    new SearchSystem();
});
