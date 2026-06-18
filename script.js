const itemForm = document.getElementById('item-form')
const itemInput = document.getElementById('item-input')
const itemList = document.getElementById('item-list')
const clearButton = document.getElementById('clear')
const itemFilter = document.getElementById('filter')
const formBtn = itemForm.querySelector('button')
let isEditMode = false;

function displayItems() {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach(item => addItemToDom(item))

    checkUI();
}

function onAddItemSubmit (e) {
    e.preventDefault();

    const newItem = itemInput.value;

    //Validation
    if (newItem === '') {
        alert('Please add an item');
        return
    }

    //Checking for edit mode 
    if(isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode');

        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    } else {
        if(checkDuplicates(newItem)){
            alert('That item already exists!');
            return;
        }
    }
    
    //Create item DOM element
    addItemToDom(newItem);

    //Adding to local storage
    addItemToStorage(newItem);


    itemInput.value = '';
}

function addItemToDom(item) {

    const li = document.createElement('li')
    li.appendChild(document.createTextNode(item))

    const button = createButton('remove-item btn-link text-red')

    li.appendChild(button);
    itemList.appendChild(li);

    checkUI();

}

function createButton(classes) {
    const button = document.createElement('button');
    button.className= classes;
    const icon = createIcon('fa-solid fa-xmark')
    button.appendChild(icon);
    return button;
}

function createIcon(classes) {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon
}

function addItemToStorage(item) {
    const itemsFromStorage = getItemsFromStorage();
    
    //Adding item from array
    itemsFromStorage.push(item);

    //Stringify
    localStorage.setItem('items', JSON.stringify(itemsFromStorage))
}

function getItemsFromStorage() {
    let itemsFromStorage;
    
    if(localStorage.getItem('items') === null){
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'))
    }

    return itemsFromStorage
}

function onClickItem(e) {
    if(e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement)
    } else {
        setItemToEdit(e.target);
    }
}

function checkDuplicates(item) {
    const itemsFromStorage = getItemsFromStorage();

   return itemsFromStorage.includes(item);
}

function setItemToEdit(item) {
    isEditMode = true;

    itemList.querySelectorAll('li').forEach((i) => i.classList.remove('edit-mode'))
    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class="f-solid f-pen"></>  Update Item'
    formBtn.style.backgroundColor = '#228b22'
    item.input.value = item.textContent
}

function removeItem(item) {
    if(confirm('Are you sure?')) {
        item.remove();

        removeItemFromStorage(item.textContent)

        checkUI();
    }
}

function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromStorage();

    //Filtering item to remove
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearItems() {
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild)
    }
    //local storage clean
    localStorage.removeItem('items');

    checkUI();
}

function filterItems(e) {
    const items = itemList.querySelectorAll('li')
    const text = e.target.value.toLowerCase();

    items.forEach(item => {
        const itemName = item.firstChild.textContent.toLowerCase();

        if(itemName.indexOf(text) != -1) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
    
}

function checkUI() {
    itemInput.value = ''

    const items = itemList.querySelectorAll('li')

    if(items.length === 0) {
        clearButton.style.display = 'none'
        itemFilter.style.display = 'none'
    } else {
        clearButton.style.display = 'block'
        itemFilter.style.display = 'block'
    }

    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333'
    
    isEditMode = false
}

//Initialise app

function init() {
    itemForm.addEventListener('submit', onAddItemSubmit);
    itemList.addEventListener('click', onClickItem);
    clearButton.addEventListener('click', clearItems);
    itemFilter.addEventListener('input', filterItems);
    document.addEventListener('DOMContentLoaded', displayItems);
    checkUI();

}


//Event listeners


init();
