'use strict';

// Элементы управления
const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');

// Списки с задачами
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogListEl = document.getElementById('backlog-list');
const progressListEl = document.getElementById('progress-list');
const completeListEl = document.getElementById('complete-list');
const onHoldListEl = document.getElementById('on-hold-list');


// Загружены ли массивы из localStorage
let isLoaded = false;

// Инициализация массивов
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Функциональность для перетаскивания
let draggedItem;
let dragging = false;
let currentColumn;
let focusColumn;
let focusId;

// обработчик начала
const drag = (e) => {
    draggedItem = e.target;
    dragging = true;
}

// обработчик места
const allowDrop = (e) => {
    e.preventDefault();
}
// обработчик события
const drop = (e) => {
    e.preventDefault();

// снятие со всех списков
    listColumns.forEach((column) => {
column.classList.remove('over');
    });

    const parent = listColumns[currentColumn];
    parent.appendChild(draggedItem);

    dragging = false;

    rebuildArrays();
}


// когда элемент над зоной сброса
const dragEnter = (column) => {
    listColumns[column].classList.add('over');
    currentColumn = column;
}
listColumns.forEach((list, index )=> {
    list.addEventListener('dragover', allowDrop);
    list.addEventListener('drop', drop);
    list.addEventListener('dragenter', dragEnter.bind(null, index))
});
saveItemBtns.forEach((btn,index) => {
    btn.addEventListener('click', hideInputBox.bind(null, index))
});

addBtns.forEach((btn,index) => {
    btn.addEventListener('click', showInputBox.bind(null, index))
});

// Получение данных из localStorage
const getSavedColumns = () => {
    if (localStorage.getItem('backlogItems')) {
        backlogListArray = JSON.parse(localStorage.backlogItems);
        progressListArray = JSON.parse(localStorage.progressItems);
        completeListArray = JSON.parse(localStorage.completeItems);
        onHoldListArray = JSON.parse(localStorage.onHoldItems);

    } else {
        backlogListArray = ['Отдых'];
        progressListArray = ['Работа над проектами', 'Послушать музыку'];
        completeListArray = ['Ознакомиться с Unsplash API', 'Установить Windows 11'];
        onHoldListArray = ['Курсовой проект'];
    }

}

// Обновление данных в localStorage
const updateSavedColumns = () => {
    listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
    const arrayNames = ['backlog', 'progress', 'complete', 'onHold'];
    arrayNames.forEach((arrayName, index) => {
        localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[index]));
    });
}
// create dom-elemens
const createItemEl = (columnEl, column, item, index) => {
    const listEl = document.createElement('li');
    listEl.textContent = item;
    listEl.id = index;
    listEl.draggable = true;
    listEl.contentEditable = true;
    listEl.addEventListener('dragstart', drag)
    listEl.classList.add('drag-item');
    columnEl.appendChild(listEl);
}



// update dom - columns
const updateDOM = () => {
    if (!isLoaded) {
        getSavedColumns();
        isLoaded = true;
    }

    //backlog
    backlogListEl.textContent = '';
    backlogListArray.forEach((backlogItem, index) => {
        createItemEl(backlogListEl, 0, backlogItem, index);
    });

    // в работе
    progressListEl.textContent = '';
    progressListArray.forEach((progressItem, index) => {
        createItemEl(progressListEl, 0, progressItem, index);
    });

    //Завершено
    completeListEl.textContent = '';
    completeListArray.forEach((completeItem, index) => {
        createItemEl(completeListEl, 0, completeItem, index);
    });

    // приостановлено
    onHoldListEl.textContent = '';
    onHoldListArray.forEach((onHoldItem, index) => {
        createItemEl(onHoldListEl, 0, onHoldItem, index);
    });

    updateSavedColumns();
}

updateDOM();

function addToColumn(column){
    const itemText = addItems[column].textContent;
    const selectedArray = listArrays[column];
    selectedArray.push(itemText);
    addItems[column].textContent = '';
    updateDOM(column);
}

// Перестроение массивов
const rebuildArrays =() => {

    backlogListArray = [];
    for(let el of Array.from(backlogListEl.children)){
        backlogListArray.push(el.textContent);
    }
    progressListArray = [];
    for(let el of Array.from(progressListEl.children)){
        progressListArray.push(el.textContent);
    }
    completeListArray = [];
    for(let el of Array.from(completeListEl.children)){
        completeListArray.push(el.textContent);
    }
    onHoldListArray = [];
    for(let el of Array.from(onHoldListEl.children)){
        onHoldListArray.push(el.textContent);
    }
    updateSavedColumns();
}
function showInputBox(column){
    addBtns[column].style.visibility = 'hidden';
    saveItemBtns[column].style.display = 'flex';
    addItemContainers[column].style.display = 'flex';
}

function hideInputBox(column){
    addBtns[column].style.visibility = 'visible';
    saveItemBtns[column].style.display = 'none';
    addItemContainers[column].style.display = 'none';
    addToColumn(column);
}
//Удаление элементов
const deleteColumn = function () {
    listArrays[focusColumn].splice(focusId,1);
    updateDOM();
}
listColumns.forEach((elem,index)=>{
    elem.addEventListener("focusout",(e) =>{
        if(e.target.textContent == ""){
            deleteColumn()
        }
    })
})

listColumns.forEach((elem,index)=>{
    elem.addEventListener("focusin",(e) =>{
        focusColumn = index;
        focusId = e.target.id;
    })
})
