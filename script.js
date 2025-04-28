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

    header.onmousedown = function (e) {
        e.preventDefault();
        initialX = e.clientX;
        initialY = e.clientY;

        document.onmousemove = function (e) {
            offsetX = initialX - e.clientX;
            offsetY = initialY - e.clientY;
            initialX = e.clientX;
            initialY = e.clientY;

            windowElement.style.top = (windowElement.offsetTop - offsetY) + "px";
            windowElement.style.left = (windowElement.offsetLeft - offsetX) + "px";
        };

        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
        };
    };
}

function initializeTrashBinForIcons() {
    const trashBin = document.getElementById('trash-bin');

    // Permitir el "drop" sobre la papelera
    trashBin.addEventListener('dragover', function (event) {
        event.preventDefault();
    });

    // Manejar el evento "drop" para eliminar íconos
    trashBin.addEventListener('drop', function (event) {
        event.preventDefault();
        const iconId = event.dataTransfer.getData('text');
        const iconElement = document.getElementById(iconId);

        if (iconElement) {
            const trashRect = trashBin.getBoundingClientRect();
            const iconRect = iconElement.getBoundingClientRect();

            // Verificar si el ícono está completamente dentro de la papelera
            if (
                iconRect.left >= trashRect.left &&
                iconRect.right <= trashRect.right &&
                iconRect.top >= trashRect.top &&
                iconRect.bottom <= trashRect.bottom
            ) {
                const confirmDelete = confirm(`¿Estás seguro de que deseas eliminar "${iconId}"?`);
                if (confirmDelete) {
                    iconElement.remove(); // Eliminar el ícono del DOM
                    alert(`${iconId} eliminado correctamente.`);
                }
            } else {
                alert('El ícono debe estar completamente dentro de la papelera para eliminarlo.');
            }
        }
    });
}

function makeIconsDraggable() {
    const icons = document.querySelectorAll('.icon');
    const taskbar = document.querySelector('.taskbar');
    const taskbarTop = taskbar.offsetTop; // Posición superior de la barra de tareas
    const gridSize = 100; // Tamaño de la cuadrícula (ajústalo según tus necesidades)

    icons.forEach(icon => {
        icon.setAttribute('draggable', true);

        let isDragging = false;
        let offsetX = 0, offsetY = 0;
        let initialX, initialY;
        let originalX, originalY;

        icon.onmousedown = function (e) {
            e.preventDefault();
            isDragging = false; // Inicialmente no se está arrastrando
            initialX = e.clientX;
            initialY = e.clientY;

            // Guardar la posición original
            originalX = icon.offsetLeft;
            originalY = icon.offsetTop;

            offsetX = e.clientX - icon.getBoundingClientRect().left;
            offsetY = e.clientY - icon.getBoundingClientRect().top;

            document.onmousemove = function (e) {
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

                    // Actualizar la posición del ícono
                    icon.style.left = `${newX}px`;
                    icon.style.top = `${newY}px`;
                }
            };

            document.onmouseup = function () {
                if (isDragging) {
                    // Ajustar la posición del ícono a la cuadrícula
                    const finalX = Math.round(icon.offsetLeft / gridSize) * gridSize;
                    const finalY = Math.round(icon.offsetTop / gridSize) * gridSize;

                    // Verificar si la posición está ocupada
                    const isOccupied = Array.from(icons).some(otherIcon => {
                        if (otherIcon === icon) return false; // Ignorar el ícono actual
                        const otherLeft = parseInt(otherIcon.style.left, 10);
                        const otherTop = parseInt(otherIcon.style.top, 10);
                        return otherLeft === finalX && otherTop === finalY;
                    });

                    if (!isOccupied) {
                        icon.style.left = `${finalX}px`;
                        icon.style.top = `${finalY}px`;
                    } else {
                        // Volver a la posición original si está ocupada
                        icon.style.left = `${originalX}px`;
                        icon.style.top = `${originalY}px`;
                    }
                }

                document.onmousemove = null;
                document.onmouseup = null;
            };
        };

        icon.addEventListener('dragstart', function (event) {
            event.dataTransfer.setData('text', icon.id); // Guardar el ID del ícono
        });

        icon.onclick = function () {
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
    initializeTrashBinForIcons();
    setInterval(updateClock, 1000);
    updateClock();
});