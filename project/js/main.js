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
function initSidebarToggle() {
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.querySelector('.sidebar-toggle-btn');
  if (sidebar && toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('closed');
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
  if (document.getElementById('sidebar-container')) {
    await loadFragment('sidebar-container', 'components/sidebar.html');
    setTimeout(() => {
      initSidebarToggle();
    }, 50);
  }
  if (document.getElementById('footer-container')) {
    await loadFragment('footer-container', 'components/footer.html');
  }

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
document.addEventListener("DOMContentLoaded", loadAllComponents);

