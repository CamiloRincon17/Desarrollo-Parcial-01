// Módulo de Motos - Solo lógica, sin datos duplicados
(function() {
    'use strict';

    // ========== SERVICIO DE DATOS ==========
    const MotosService = {
        async cargarMotos() {
            try {
                const response = await fetch('data/producto.json');
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
                }
                const data = await response.json();
                
                // Validar estructura de datos
                if (!data || typeof data !== 'object') {
                    throw new Error('Formato de datos inválido');
                }
                
                return data;
            } catch (error) {
                console.error('Error al cargar el archivo producto.json:', error);
                
                // Datos de fallback en caso de error
                return {
                    'Superbike': [{
                        id: 'fallback-1',
                        marca: 'Error',
                        modelo: 'No se pudieron cargar los datos',
                        año: new Date().getFullYear(),
                        imagen: 'https://placehold.co/400x300/ff6b6b/fff?text=Error+de+Carga',
                        especificaciones: {
                            motor: 'Error de conexión',
                            potencia: 'N/A',
                            peso: 'N/A',
                            precio: 'Contactar'
                        },
                        disponible: false
                    }]
                };
            }
        }
    };

    // ========== VISTA ==========
    const MotosView = {
        crearTarjetaMoto(moto, categoria) {
            const estado = moto.disponible ? 
                '<span class="estado disponible">Disponible</span>' : 
                '<span class="estado no-disponible">No disponible</span>';
            // Generar un id único para la moto
            const motoId = 'moto-' + (moto.marca + '-' + moto.modelo).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
            return `
                <div class="moto-card" id="${motoId}" data-moto-id="${moto.id}" data-categoria="${categoria}">
                    <div class="moto-header">
                        <h4>${moto.marca} ${moto.modelo}</h4>
                        ${estado}
                    </div>
                    <div class="moto-image">
                        <img src="${moto.imagen}" alt="${moto.marca} ${moto.modelo}" onerror="this.src='https://placehold.co/400x300/ccc/fff?text=Imagen+no+disponible'">
                        <div class="moto-overlay">
                            <button class="view-details-btn">Ver Detalles</button>
                        </div>
                    </div>
                    <div class="moto-especificaciones">
                        <ul>
                            <li><strong>Motor:</strong> ${moto.especificaciones.motor}</li>
                            <li><strong>Potencia:</strong> ${moto.especificaciones.potencia}</li>
                            <li><strong>Peso:</strong> ${moto.especificaciones.peso}</li>
                            <li><strong>Precio:</strong> ${moto.especificaciones.precio}</li>
                        </ul>
                    </div>
                </div>
            `;
        },

        renderizarMotos(motosData, contenedorId) {
            const contenedor = document.getElementById(contenedorId);
            if (!contenedor) {
                console.error(`Contenedor #${contenedorId} no encontrado`);
                return;
            }

            let html = '';
            
            // Recorrer cada categoría
            for (const categoria in motosData) {
                const motos = motosData[categoria];
                if (motos && motos.length > 0) {
                    // Genera un id seguro para el HTML (sin espacios, minúsculas, sin caracteres especiales)
                    const catId = 'cat-' + categoria.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
                    html += `<h3 class="categoria-titulo" id="${catId}">${categoria}</h3>`;
                    html += '<div class="motos-grid">';
                    
                    motos.forEach(moto => {
                        html += this.crearTarjetaMoto(moto, categoria);
                    });
                    
                    html += '</div>';
                }
            }
            
            contenedor.innerHTML = html;
        },

        mostrarCargando(contenedorId) {
            const contenedor = document.getElementById(contenedorId);
            if (contenedor) {
                contenedor.innerHTML = '<p class="loading">Cargando catálogo de motos...</p>';
            }
        },

        mostrarError(contenedorId, mensaje) {
            const contenedor = document.getElementById(contenedorId);
            if (contenedor) {
                contenedor.innerHTML = `
                    <div class="error-container">
                        <h3>Error</h3>
                        <p>${mensaje}</p>
                    </div>
                `;
            }
        },

        // ✅ CORRECTO: Esta función va como método independiente del objeto
        filtrarPorCategoria(motosData, categoria, contenedorId) {
            const contenedor = document.getElementById(contenedorId);
            if (!contenedor) {
                console.error(`Contenedor #${contenedorId} no encontrado`);
                return;
            }

            if (motosData[categoria]) {
                const motos = motosData[categoria];
                let html = `<h3 class="categoria-titulo">${categoria}</h3>`;
                html += '<div class="motos-grid">';
                
                motos.forEach(moto => {
                    html += this.crearTarjetaMoto(moto, categoria);
                });
                
                html += '</div>';
                contenedor.innerHTML = html;
            } else {
                // Si no se encuentra la categoría, mostrar todas
                this.renderizarMotos(motosData, contenedorId);
            }
        }
    };

    // ========== CONTROLADOR ==========
    class MotosController {
        constructor(contenedorId = 'catalogo-motos') {
            this.contenedorId = contenedorId;
            this.motosData = null;
        }

        async inicializar() {
            try {
                // Mostrar estado de carga
                MotosView.mostrarCargando(this.contenedorId);
                
                // Cargar datos desde JSON externo
                this.motosData = await MotosService.cargarMotos();
                
                // Verificar si hay datos válidos
                if (!this.motosData || Object.keys(this.motosData).length === 0) {
                    throw new Error('No se encontraron datos de motos');
                }
                
                // Renderizar vista
                MotosView.renderizarMotos(this.motosData, this.contenedorId);
                
                // Añadir eventos al menú MODELS
                this.agregarEventosMenu();
                
                // Añadir eventos a las tarjetas de motos
                this.agregarEventosTarjetas();
                
                // Refrescar lazy loading para nuevas imágenes
                if (window.refreshLazyLoading) {
                    setTimeout(() => window.refreshLazyLoading(), 100);
                }
                
            } catch (error) {
                console.error('Error en MotosController.inicializar:', error);
                
                // Mostrar error más específico
                let errorMessage = 'No se pudo cargar el catálogo de motos.';
                
                if (error.message.includes('HTTP')) {
                    errorMessage = 'Error de conexión. Verifica tu conexión a internet.';
                } else if (error.message.includes('JSON')) {
                    errorMessage = 'Error en el formato de datos. Contacta al administrador.';
                } else if (error.message.includes('No se encontraron datos')) {
                    errorMessage = 'No hay motos disponibles en este momento.';
                }
                
                MotosView.mostrarError(this.contenedorId, errorMessage);
            }
        }

        agregarEventosMenu() {
    // Mapeo: valor del data-category → clave real en motos.json
    const mapeoCategorias = {
        'todas': 'todas',
        'superbike': 'Super Sport',   
        'adventure': 'Adventure',
        'scrambler': 'Scrambler',
        'offroad': 'Off-Road'        
    };

    // Seleccionar todos los botones del menú MODELS (desktop y móvil)
    const botonesDesktop = document.querySelectorAll('.category');
    const botonesMobile = document.querySelectorAll('.category-link');

    const todosBotones = [...botonesDesktop, ...botonesMobile];

    todosBotones.forEach(boton => {
        boton.addEventListener('click', (e) => {
            e.preventDefault(); 

            // Obtener el valor de data-category
            const key = boton.dataset.category || boton.closest('.category')?.dataset.category;
            
            if (!key) return;

            if (key === 'todas') {
                MotosView.renderizarMotos(this.motosData, this.contenedorId);
            } else {
                const categoriaReal = mapeoCategorias[key];
                if (categoriaReal && this.motosData[categoriaReal]) {
                    MotosView.filtrarPorCategoria(this.motosData, categoriaReal, this.contenedorId);
                } else {
                    console.warn(`Categoría no encontrada: ${categoriaReal}`);
                    MotosView.renderizarMotos(this.motosData, this.contenedorId); // fallback
                }
            }
        });
    });

    // ✅ Botón "Todas" en el header (si lo agregas)
    const botonTodas = document.querySelector('[data-categoria="todas"]');
    if (botonTodas) {
        botonTodas.addEventListener('click', () => {
            MotosView.renderizarMotos(this.motosData, this.contenedorId);
            // Reagregar eventos después de renderizar
            setTimeout(() => this.agregarEventosTarjetas(), 100);
        });
    }
}

agregarEventosTarjetas() {
    // Agregar eventos a las tarjetas de motos existentes
    const motoCards = document.querySelectorAll('.moto-card');
    motoCards.forEach(card => {
        // Evento para hacer clic en la tarjeta
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const motoId = card.dataset.motoId;
            const categoria = card.dataset.categoria;
            
            if (motoId && this.motosData[categoria]) {
                const moto = this.motosData[categoria].find(m => m.id == motoId);
                if (moto) {
                    // Agregar categoría a los datos de la moto
                    moto.categoria = categoria;
                    // Abrir modal si está disponible
                    if (window.openMotoModal) {
                        window.openMotoModal(moto);
                    }
                }
            }
        });

        // Evento para el botón "Ver Detalles"
        const viewBtn = card.querySelector('.view-details-btn');
        if (viewBtn) {
            viewBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Evitar que se active el evento del card
                const motoId = card.dataset.motoId;
                const categoria = card.dataset.categoria;
                
                if (motoId && this.motosData[categoria]) {
                    const moto = this.motosData[categoria].find(m => m.id == motoId);
                    if (moto) {
                        moto.categoria = categoria;
                        if (window.openMotoModal) {
                            window.openMotoModal(moto);
                        }
                    }
                }
            });
        }
    });
}
    }

    // ========== INICIALIZACIÓN ==========
    document.addEventListener('DOMContentLoaded', function() {
        const catalogo = document.getElementById('catalogo-motos');
        if (catalogo) {
            const controller = new MotosController('catalogo-motos');
            controller.inicializar();
        }
    });

})();