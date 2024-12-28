let draggedItem = null;
let items = JSON.parse(localStorage.getItem('itineraryItems')) || [];

function addItem() {
    const type = document.getElementById('itemType').value;
    const description = document.getElementById('itemDescription').value;
    const dateTime = document.getElementById('itemDateTime').value;

    if (!description || !dateTime) {
        alert('Please fill in all fields');
        return;
    }

    const newItem = {
        id: Date.now(),
        type,
        description,
        dateTime
    };

    items.push(newItem);
    saveAndRenderItems();
    clearInputs();
}

function clearInputs() {
    document.getElementById('itemDescription').value = '';
    document.getElementById('itemDateTime').value = '';
}

function deleteItem(id) {
    items = items.filter(item => item.id !== id);
    saveAndRenderItems();
}

function saveAndRenderItems() {
    localStorage.setItem('itineraryItems', JSON.stringify(items));
    renderItems();
}

function getItemIcon(type) {
    switch(type) {
        case 'flight':
            return '<i class="fas fa-plane"></i>';
        case 'hotel':
            return '<i class="fas fa-hotel"></i>';
        case 'activity':
            return '<i class="fas fa-map-marker-alt"></i>';
        default:
            return '<i class="fas fa-calendar"></i>';
    }
}

function renderItems() {
    const itineraryList = document.getElementById('itineraryList');
    itineraryList.innerHTML = '';

    if (items.length === 0) {
        itineraryList.innerHTML = `
            <div class="empty-state">
                <p style="text-align: center; color: var(--text-secondary); padding: 2rem;">
                    No items in your itinerary yet. Start by adding one above!
                </p>
            </div>
        `;
        return;
    }

    items.forEach(item => {
        const itemElement = createItemElement(item);
        itineraryList.appendChild(itemElement);
    });
}

function createItemElement(item) {
    const div = document.createElement('div');
    div.className = 'itinerary-item';
    div.setAttribute('data-id', item.id);
    div.setAttribute('data-type', item.type);
    div.draggable = true;

    const dateTimeFormatted = new Date(item.dateTime).toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });
    
    div.innerHTML = `
        <div class="item-content">
            <div class="item-icon">
                ${getItemIcon(item.type)}
            </div>
            <div class="item-details">
                <h3>${item.description}</h3>
                <p>${dateTimeFormatted}</p>
            </div>
        </div>
        <button class="delete-btn" onclick="deleteItem(${item.id})">
            <i class="fas fa-trash-alt"></i>
        </button>
    `;

    div.addEventListener('dragstart', handleDragStart);
    div.addEventListener('dragend', handleDragEnd);
    div.addEventListener('dragover', handleDragOver);
    div.addEventListener('drop', handleDrop);

    return div;
}

function handleDragStart(e) {
    draggedItem = e.target;
    e.target.classList.add('dragging');
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    draggedItem = null;
}

function handleDragOver(e) {
    e.preventDefault();
    const targetItem = e.target.closest('.itinerary-item');
    if (!targetItem || targetItem === draggedItem) return;

    const boundingRect = targetItem.getBoundingClientRect();
    const draggedIndex = Array.from(targetItem.parentNode.children).indexOf(draggedItem);
    const targetIndex = Array.from(targetItem.parentNode.children).indexOf(targetItem);
    
    if (draggedIndex < targetIndex) {
        targetItem.parentNode.insertBefore(draggedItem, targetItem.nextSibling);
    } else {
        targetItem.parentNode.insertBefore(draggedItem, targetItem);
    }

    const newItems = Array.from(document.querySelectorAll('.itinerary-item')).map(el => {
        return items.find(item => item.id === parseInt(el.getAttribute('data-id')));
    });
    items = newItems;
    localStorage.setItem('itineraryItems', JSON.stringify(items));
}

function handleDrop(e) {
    e.preventDefault();
}

document.addEventListener('DOMContentLoaded', renderItems);