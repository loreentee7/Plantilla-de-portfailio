function openWindow(id) {
    // Cerrar todas las ventanas abiertas
    closeAllWindows();

    // Abrir la nueva ventana
    const windowElement = document.getElementById(id);
    windowElement.style.display = 'block';
    windowElement.classList.remove('hidden');

    // Centrar la ventana en la pantalla
    centerWindow(windowElement);

    // Hacer que la ventana sea arrastrable
    makeWindowDraggable(windowElement);
}

// Función para centrar una ventana en la pantalla
function centerWindow(windowElement) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const windowWidth = windowElement.offsetWidth;
    const windowHeight = windowElement.offsetHeight;

    const left = (viewportWidth - windowWidth) / 2;
    const top = (viewportHeight - windowHeight) / 2;

    windowElement.style.left = `${left}px`;
    windowElement.style.top = `${top}px`;
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
    const taskbar = document.querySelector('.taskbar');
    const taskbarTop = taskbar.offsetTop; // Posición superior de la barra de tareas

    icons.forEach(icon => {
        let isDragging = false;
        let offsetX = 0, offsetY = 0;
        let initialX, initialY;

        icon.onmousedown = function(e) {
            e.preventDefault();
            isDragging = false; // Inicialmente no se está arrastrando
            initialX = e.clientX;
            initialY = e.clientY;

            offsetX = e.clientX - icon.getBoundingClientRect().left;
            offsetY = e.clientY - icon.getBoundingClientRect().top;

            document.onmousemove = function(e) {
                const deltaX = e.clientX - initialX;
                const deltaY = e.clientY - initialY;

                // Consideramos que es un arrastre si el movimiento es significativo
                if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
                    isDragging = true;
                    let newX = e.clientX - offsetX;
                    let newY = e.clientY - offsetY;

                    // Restricción para no mover el icono por debajo de la barra de tareas
                    if (newY + icon.offsetHeight > taskbarTop) {
                        newY = taskbarTop - icon.offsetHeight;
                    }

                    icon.style.left = `${newX}px`;
                    icon.style.top = `${newY}px`;
                }
            };

            document.onmouseup = function() {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        };

        icon.onclick = function() {
            if (!isDragging) {
                // Solo abre la ventana si no se arrastró el icono
                const windowId = icon.getAttribute('onclick').split("'")[1];
                openWindow(windowId);
            }
        };
    });
}

// Inicializar funciones al cargar el documento
document.addEventListener('DOMContentLoaded', () => {
    makeIconsDraggable();
    setInterval(updateClock, 1000);
    updateClock();
});





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
