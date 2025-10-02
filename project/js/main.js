// ===== Función genérica para cargar fragmentos =====
async function loadFragment(containerId, filePath) {
  const container = document.getElementById(containerId);
  
  // Verifica que el contenedor exista en el DOM
  if (!container) {
    console.warn(`⚠️ Contenedor con ID "${containerId}" no encontrado. Saltando carga de ${filePath}.`);
    return;
  }

  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    container.innerHTML = await response.text();
  } catch (error) {
    console.error(`❌ Error al cargar fragmento "${filePath}":`, error);
    container.innerHTML = `<p style="color: red; padding: 1rem;">⚠️ No se pudo cargar ${filePath}</p>`;
  }
}

// ===== Mega menú de modelos (solo desktop)
function initMegaMenuModels() {
  const categories = document.querySelectorAll('.categories .category');
  const contents = document.querySelectorAll('.models-content .category-content');

  if (!categories.length || !contents.length) return;

  categories.forEach(btn => {
    btn.addEventListener('click', () => {
      // Quitar activo a todos
      categories.forEach(b => b.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      // Activar el seleccionado
      btn.classList.add('active');
      const target = btn.getAttribute('data-category');
      const content = document.querySelector(`.category-content[data-target="${target}"]`);
      if (content) content.classList.add('active');
    });
  });
}

// ===== Menú de modelos (versión móvil)
function initMobileModelsMenu() {
  // Mostrar/ocultar el submenú de categorías
  const modelsBtn = document.getElementById('modelsMobileBtn');
  const modelsSubmenu = document.getElementById('modelsMobileSubmenu');
  if (modelsBtn && modelsSubmenu) {
    modelsBtn.addEventListener('click', function(e) {
      e.preventDefault();
      modelsSubmenu.style.display = modelsSubmenu.style.display === 'block' ? 'none' : 'block';
    });
  }

  // Mostrar/ocultar la lista de motos por categoría
  document.querySelectorAll('.category-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const cat = link.getAttribute('data-category');
      document.querySelectorAll('.models-list').forEach(list => {
        list.style.display = (list.getAttribute('data-list') === cat && list.style.display !== 'block') ? 'block' : 'none';
      });
    });
  });

  // Cerrar menú móvil al hacer clic en un modelo
  document.querySelectorAll('.models-list a').forEach(link => {
    link.addEventListener('click', function() {
      const mobileMenu = document.getElementById('mobileMenu');
      if (mobileMenu) {
        mobileMenu.classList.remove('active');
      }
    });
  });
}

// ===== Sidebar toggle =====
// ===== Sidebar colapsable para desktop y móvil =====
function initSidebarToggle() {
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.querySelector('.sidebar-toggle-btn');
  const collapseBtn = document.getElementById('collapseBtn');
  
  if (!sidebar || !toggleBtn) return;

  // Crear overlay para móviles
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  overlay.id = 'sidebarOverlay';
  document.body.appendChild(overlay);

  const sidebarOverlay = document.getElementById('sidebarOverlay');

  // Toggle completo (móvil)
  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    if (sidebarOverlay) sidebarOverlay.classList.toggle('active');
  });

  // Collapse/Expand (desktop)
  if (collapseBtn) {
    collapseBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      // Actualizar margen del contenido principal
      const mainLayout = document.querySelector('.main-layout');
      if (mainLayout) {
        if (sidebar.classList.contains('collapsed')) {
          mainLayout.style.marginLeft = '80px';
        } else {
          mainLayout.style.marginLeft = '260px';
        }
      }
    });
  }

  // Cerrar sidebar al hacer clic en enlace (móvil)
  const navLinks = sidebar.querySelectorAll('.sidebar-nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 1024) {
        sidebar.classList.remove('open');
        if (sidebarOverlay) sidebarOverlay.classList.remove('active');
      }
    });
  });

  // Cerrar con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
      if (sidebarOverlay) sidebarOverlay.classList.remove('active');
    }
  });

  // En desktop, mostrar texto al pasar el mouse sobre el sidebar colapsado
  if (window.innerWidth >= 1024) {
    sidebar.addEventListener('mouseenter', () => {
      if (sidebar.classList.contains('collapsed')) {
        sidebar.classList.remove('collapsed');
        const mainLayout = document.querySelector('.main-layout');
        if (mainLayout) mainLayout.style.marginLeft = '260px';
      }
    });

    sidebar.addEventListener('mouseleave', () => {
      if (!sidebar.matches(':hover') && !sidebar.classList.contains('open')) {
        sidebar.classList.add('collapsed');
        const mainLayout = document.querySelector('.main-layout');
        if (mainLayout) mainLayout.style.marginLeft = '80px';
      }
    });
  }
}

// ===== Cargar todos los fragmentos =====
async function loadAllComponents() {
  // Solo carga los fragmentos cuyos contenedores existan en la página actual
  if (document.getElementById('header-container')) {
    await loadFragment('header-container', 'components/header.html');
    setTimeout(() => {
      initHamburgerMenu();
      initMegaMenuModels();
      initMobileModelsMenu(); 
    }, 50);
  }
  if(document.getElementById("sidebar-container")){
    await loadFragment('sidebar-container', 'components/sidebar.html')
  }
  
  if (document.getElementById('footer-container')) {
    await loadFragment('footer-container', 'components/footer.html');
  }

  setTimeout(() => {
    initHamburgerMenu();
    initMegaMenuModels();
    initMobileModelsMenu(); 
    initSidebarToggle(); // ← Asegúrate que esta línea esté aquí
    initLoginEvents();
  }, 50);
  // Inicializar eventos del login (solo si los elementos existen)
  initLoginEvents();
}
//JavaScript Menu
function initHamburgerMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeMenu = document.getElementById('closeMenu');

  if (!hamburger || !mobileMenu || !closeMenu) {
    // Si falta algún elemento, no hacemos nada
    return;
  }

  // Abrir menú hamburguesa
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    mobileMenu.classList.add('active');
  });

  // Cerrar menú hamburguesa
  closeMenu.addEventListener('click', (e) => {
    e.stopPropagation();
    mobileMenu.classList.remove('active');
  });

  // Cerrar menú al hacer clic fuera (solo en móvil)
  document.addEventListener('click', (e) => {
    if (
      mobileMenu.classList.contains('active') &&
      !mobileMenu.contains(e.target) &&
      e.target !== hamburger
    ) {
      mobileMenu.classList.remove('active');
    }
  });

  // Evitar que clicks dentro del menú cierren el menú
  mobileMenu.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}

// ===== Lógica de login =====
function initLoginEvents() {
  const VALID_USERNAME = "admin";
  const VALID_PASSWORD = "moto2025";

  const myMotomaxBtn = document.getElementById("myMotomaxBtn");
  const dropdownMenu = document.getElementById("dropdownMenu");
  const loginLink = document.getElementById("loginLink");
  const loginModal = document.getElementById("loginModal");
  const closeModal = document.querySelector(".close");
  const loginForm = document.getElementById("loginForm");
  const errorMsg = document.getElementById("errorMessage");

  // Si no existen los elementos del login, salimos
  if (!myMotomaxBtn || !dropdownMenu || !loginLink || !loginModal) {
    console.log("💡 Componentes de login no encontrados. Saltando inicialización.");
    return;
  }

  // Mostrar/ocultar menú desplegable
  myMotomaxBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
  });

  // Cerrar menú al hacer clic fuera
  document.addEventListener("click", (e) => {
    if (!myMotomaxBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
      dropdownMenu.style.display = "none";
    }
  });

  // Abrir modal
// Abrir modal (tanto en desktop como en móvil)
const loginDesktop = document.getElementById("loginLink");
const loginMobile = document.getElementById("loginLinkMobile");

if (loginDesktop) {
  loginDesktop.addEventListener("click", (e) => {
    e.preventDefault();
    loginModal.style.display = "flex";
    dropdownMenu.style.display = "none";
  });
}

if (loginMobile) {
  loginMobile.addEventListener("click", (e) => {
    e.preventDefault();
    loginModal.style.display = "flex";
    // Cerrar el menú hamburguesa
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) mobileMenu.classList.remove('active');
  });
}

  // Cerrar modal (botón X)
  if (closeModal) {
    closeModal.addEventListener("click", () => {
      loginModal.style.display = "none";
      if (errorMsg) errorMsg.style.display = "none";
      if (loginForm) loginForm.reset();
    });
  }

  // Cerrar modal al hacer clic fuera del contenido
  window.addEventListener("click", (e) => {
    if (e.target === loginModal) {
      loginModal.style.display = "none";
      if (errorMsg) errorMsg.style.display = "none";
      if (loginForm) loginForm.reset();
    }
  });

  // Validar login
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("username")?.value.trim() || "";
      const password = document.getElementById("password")?.value.trim() || "";

      if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        alert("¡Bienvenido a MotoMax!");
        window.location.href = "index.html"; // o dashboard.html, según corresponda
      } else {
        if (errorMsg) {
          errorMsg.textContent = "❌ Usuario o contraseña incorrectos.";
          errorMsg.style.display = "block";
          setTimeout(() => {
            errorMsg.style.display = "none";
          }, 3000);
        }
      }
    });
  }
}

// ===== Iniciar cuando el DOM esté listo =====
document.addEventListener("DOMContentLoaded", function() {
  loadAllComponents();

  // Productos de ejemplo
  const productos = [
    {
      nombre: "Ducati Panigale V4",
      imagen: "https://www.ducaticolombia.co/wp-content/uploads/2022/09/Panigale-V4-S-768x475-1.png",
      detalles: [
        "Motor: V4 Desmosedici Stradale",
        "Potencia: 215 CV",
        "Peso: 174 kg",
        "Precio: Desde 25.000 €"
      ]
    },
    {
      nombre: "Kawasaki Z H2",
      imagen: "https://web2.fireboldweb.com/wp-content/uploads/2023/06/080620231686230650kawasaki-zh2-foto01.png",
      detalles: [
        "Motor: 4 cilindros en línea, 998 cc",
        "Potencia: 203 CV",
        "Peso: 206 kg",
        "Precio: Desde 17.999 €"
      ]
    },
    {
      nombre: "BMW S1000RR",
      imagen: "https://www.bmw-motorrad.com/content/dam/bmw/marketBMW_Motorrad/marketBMW_Motorrad_en/global/images/models/sport/s1000rr/bmw-motorrad-s1000rr-modelhighlight-teaser-01.jpg",
      detalles: [
        "Motor: 4 cilindros en línea, 999 cc",
        "Potencia: 207 CV",
        "Peso: 197 kg",
        "Precio: Desde 21.500 €"
      ]
    }
  ];

  // Renderizar productos
  const template = document.getElementById('producto-template');
  const contenedor = document.getElementById('productos-dinamicos');

  productos.forEach(producto => {
    const clone = template.content.cloneNode(true);
    clone.querySelector('.producto-nombre').textContent = producto.nombre;
    const img = clone.querySelector('.producto-imagen');
    img.src = producto.imagen;
    img.alt = producto.nombre;

    const detallesUl = clone.querySelector('.producto-detalles');
    producto.detalles.forEach(detalle => {
      const li = document.createElement('li');
      li.textContent = detalle;
      detallesUl.appendChild(li);
    });

    contenedor.appendChild(clone);
  });
});



// Cerrar sidebar al hacer clic fuera (solo en móvil)
document.addEventListener('click', (e) => {
  if (
    window.innerWidth < 1024 &&
    sidebar.classList.contains('open') &&
    !sidebar.contains(e.target) &&
    e.target !== toggleBtn
  ) {
    sidebar.classList.remove('open');
  }
});

// Cargar motos cuando el documento esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        // Si tienes un archivo motos.js, asegúrate de que esté cargado
        // La función cargarMotos se ejecutará automáticamente en motos.js
    });
} else {
    // Si ya está cargado, ejecuta directamente
    // La función cargarMotos se ejecutará automáticamente en motos.js
}