// Función para abrir una ventana
function openWindow(id) {
    const windowElement = document.getElementById(id);
    windowElement.style.display = 'block';
    windowElement.classList.remove('hidden');
    makeWindowDraggable(windowElement);
}

// Función para cerrar una ventana
function closeWindow(id) {
    const windowElement = document.getElementById(id);
    windowElement.style.display = 'none';
}

// Función para cerrar todas las ventanas
function closeAllWindows() {
    const windows = document.querySelectorAll('.window');
    windows.forEach(window => {
        window.style.display = 'none';
    });
}

// Función para mostrar/ocultar el menú de inicio
function toggleStartMenu() {
    const startMenu = document.getElementById('start-menu');
    if (startMenu.classList.contains('show')) {
        startMenu.classList.remove('show');
        setTimeout(() => startMenu.style.display = 'none', 300); // Espera a que la animación termine
    } else {
        startMenu.style.display = 'block';
        setTimeout(() => startMenu.classList.add('show'), 10); // Añade la clase después de que se muestre
    }
}

// Actualización del reloj en la barra de tareas
function updateClock() {
    const clockElement = document.getElementById('clock');
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    clockElement.textContent = `${hours}:${minutes}`;
}

// Hacer que las ventanas sean arrastrables
function makeWindowDraggable(windowElement) {
    const header = windowElement.querySelector('.window-header');
    let offsetX = 0, offsetY = 0, initialX, initialY;

    header.onmousedown = function(e) {
        e.preventDefault();
        initialX = e.clientX;
        initialY = e.clientY;

        document.onmousemove = function(e) {
            offsetX = initialX - e.clientX;
            offsetY = initialY - e.clientY;
            initialX = e.clientX;
            initialY = e.clientY;

            windowElement.style.top = (windowElement.offsetTop - offsetY) + "px";
            windowElement.style.left = (windowElement.offsetLeft - offsetX) + "px";
        };

        document.onmouseup = function() {
            document.onmousemove = null;
            document.onmouseup = null;
        };
    };
}

document.addEventListener('DOMContentLoaded', () => {
    makeIconsDraggable();
});

function makeIconsDraggable() {
    const icons = document.querySelectorAll('.icon');

    icons.forEach(icon => {
        let isDragging = false;
        let offsetX = 0, offsetY = 0;

        icon.onmousedown = function(e) {
            e.preventDefault();
            isDragging = true;

            // Calcula el desplazamiento del ícono respecto al cursor
            offsetX = e.clientX - icon.getBoundingClientRect().left;
            offsetY = e.clientY - icon.getBoundingClientRect().top;

            document.onmousemove = function(e) {
                // Mueve el ícono con el cursor
                icon.style.left = (e.clientX - offsetX) + 'px';
                icon.style.top = (e.clientY - offsetY) + 'px';
            };

            document.onmouseup = function() {
                document.onmousemove = null;
                document.onmouseup = null;

                if (isDragging) {
                    isDragging = false; // Solo se desactiva el arrastre, no se abre la ventana
                }
            };
        };

        icon.onclick = function() {
            if (!isDragging) { // Solo abre la ventana si no se está arrastrando
                const windowId = icon.getAttribute('onclick').split("'")[1];
                openWindow(windowId);
            }
        };
    });
}


// Función para mover el carrusel
let currentIndex = 0;

function moveCarousel(direction) {
    const carousel = document.querySelector('#projects-window .carousel');
    const items = document.querySelectorAll('#projects-window .carousel-item');
    const totalItems = items.length;

    currentIndex += direction;

    if (currentIndex < 0) {
        currentIndex = totalItems - 1;
    } else if (currentIndex >= totalItems) {
        currentIndex = 0;
    }

    const offset = -currentIndex * 100;
    carousel.style.transform = `translateX(${offset}%)`;
}

// Inicializar funciones
document.addEventListener('DOMContentLoaded', () => {
    makeIconsDraggable();
    setInterval(updateClock, 1000);
    updateClock();
});
