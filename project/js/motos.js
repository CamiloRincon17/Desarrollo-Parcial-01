// Módulo de Motos - Solo lógica, sin datos duplicados
(function() {
    'use strict';

    // ========== SERVICIO DE DATOS ==========
    const MotosService = {
        async cargarMotos() {
            try {
                const response = await fetch('data/motos.json');
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Error al cargar el archivo motos.json:', error);
                throw error; // No hay fallback, solo muestra error
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
                <div class="moto-card" id="${motoId}">
                    <div class="moto-header">
                        <h4>${moto.marca} ${moto.modelo}</h4>
                        ${estado}
                    </div>
                    <div class="moto-image">
                        <img src="${moto.imagen}" alt="${moto.marca} ${moto.modelo}" onerror="this.src='https://placehold.co/400x300/ccc/fff?text=Imagen+no+disponible'">
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
                
                // Renderizar vista
                MotosView.renderizarMotos(this.motosData, this.contenedorId);
                
                // Añadir eventos al menú MODELS
                this.agregarEventosMenu();
                
            } catch (error) {
                console.error('Error en MotosController.inicializar:', error);
                MotosView.mostrarError(this.contenedorId, 'No se pudo cargar el catálogo de motos. Verifica que el archivo motos.json exista en la carpeta data/.');
            }
        }

        agregarEventosMenu() {
            // Eventos para las categorías del menú MODELS
            const categorias = ['Superbike', 'Adventure', 'Scrambler', 'Off-Road'];
            
            categorias.forEach(categoria => {
                // Buscar botones con el texto de la categoría
                const botones = document.querySelectorAll('.category');
                botones.forEach(boton => {
                    if (boton.textContent.trim() === categoria) {
                        boton.addEventListener('click', () => {
                            MotosView.filtrarPorCategoria(this.motosData, categoria, this.contenedorId);
                        });
                    }
                });
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