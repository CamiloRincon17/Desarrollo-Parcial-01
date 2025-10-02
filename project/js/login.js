// Credenciales quemadas (solo para fines educativos)
const VALID_USERNAME = "admin";
const VALID_PASSWORD = "moto2025";

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault(); // Evita que la página se recargue

  // Obtener valores
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMsg = document.getElementById("errorMessage");

  // Validar
  if (username === VALID_USERNAME && password === VALID_PASSWORD) {
    // Redirigir a la página principal (aún no existe, pero la creamos después)
    window.location.href = "index.html";
  } else {
    // Mostrar mensaje de error
    errorMsg.textContent = "❌ Usuario o contraseña incorrectos.";
    errorMsg.style.display = "block";
    
    // Limpiar campos después de 3 segundos (opcional)
    setTimeout(() => {
      errorMsg.style.display = "none";
    }, 3000);
  }
  
});