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
                showDeleteModal(iconElement);
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

        // Añadir menú contextual (click derecho)
        icon.addEventListener('contextmenu', function (event) {
            event.preventDefault();
            showContextMenu(event, icon);
        });
    });
}

function showContextMenu(event, icon) {
    // Crear el menú contextual
    const contextMenu = document.createElement('div');
    contextMenu.className = 'context-menu';
    contextMenu.style.top = `${event.clientY}px`;
    contextMenu.style.left = `${event.clientX}px`;

    // Opciones del menú
    const renameOption = document.createElement('div');
    renameOption.className = 'context-menu-item';
    renameOption.textContent = 'Cambiar nombre';
    renameOption.onclick = function () {
        showRenameModal(icon);
        document.body.removeChild(contextMenu);
    };

    const deleteOption = document.createElement('div');
    deleteOption.className = 'context-menu-item';
    deleteOption.textContent = 'Eliminar';
    deleteOption.onclick = function () {
        showDeleteModal(icon);
        document.body.removeChild(contextMenu);
    };

    // Añadir opciones al menú
    contextMenu.appendChild(renameOption);
    contextMenu.appendChild(deleteOption);

    // Añadir el menú al documento
    document.body.appendChild(contextMenu);

    // Eliminar el menú al hacer clic fuera de él
    document.addEventListener('click', function removeMenu() {
        if (document.body.contains(contextMenu)) {
            document.body.removeChild(contextMenu);
        }
        document.removeEventListener('click', removeMenu);
    });
}

function showRenameModal(icon) {
    const modal = document.createElement('div');
    modal.className = 'xp-modal';

    modal.innerHTML = `
        <div class="xp-modal-header">
            <span>Cambiar nombre</span>
            <button class="close-button">X</button>
        </div>
        <div class="xp-modal-body">
            <p>Introduce el nuevo nombre:</p>
            <input type="text" class="xp-modal-input" value="${icon.querySelector('p').textContent}">
        </div>
        <div class="xp-modal-footer">
            <button class="xp-modal-btn cancel-btn">Cancelar</button>
            <button class="xp-modal-btn confirm-btn">Aceptar</button>
        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.close-button').onclick = () => modal.remove();
    modal.querySelector('.cancel-btn').onclick = () => modal.remove();
    modal.querySelector('.confirm-btn').onclick = () => {
        const newName = modal.querySelector('.xp-modal-input').value;
        if (newName) {
            icon.querySelector('p').textContent = newName;
        }
        modal.remove();
    };
}

function showDeleteModal(icon) {
    const modal = document.createElement('div');
    modal.className = 'xp-modal';

    modal.innerHTML = `
        <div class="xp-modal-header">
            <span>Eliminar ícono</span>
            <button class="close-button">X</button>
        </div>
        <div class="xp-modal-body">
            <p>¿Estás seguro de que deseas eliminar este ícono?</p>
        </div>
        <div class="xp-modal-footer">
            <button class="xp-modal-btn cancel-btn">Cancelar</button>
            <button class="xp-modal-btn confirm-btn">Eliminar</button>
        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.close-button').onclick = () => modal.remove();
    modal.querySelector('.cancel-btn').onclick = () => modal.remove();
    modal.querySelector('.confirm-btn').onclick = () => {
        icon.remove();
        modal.remove();
    };
}

// Inicializar funciones al cargar el documento
document.addEventListener('DOMContentLoaded', () => {
    makeIconsDraggable();
    initializeTrashBinForIcons();
    setInterval(updateClock, 1000);
    updateClock();
});