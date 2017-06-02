/**
 * ДЗ 7.2 - Создать редактор cookie с возможностью фильтрации
 *
 * На странице должна быть таблица со списком имеющихся cookie:
 * - имя
 * - значение
 * - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)
 *
 * На странице должна быть форма для добавления новой cookie:
 * - имя
 * - значение
 * - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)
 *
 * Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено
 *
 * На странице должно быть текстовое поле для фильтрации cookie
 * В таблице должны быть только те cookie, в имени или значении которых есть введенное значение
 * Если в поле фильтра пусто, то должны выводиться все доступные cookie
 * Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 * Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 * то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена
 *
 * Для более подробной информации можно изучить код тестов
 *
 * Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/**
 * homeworkContainer - это контейнер для всех ваших домашних заданий
 * Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер
 *
 * @example
 * homeworkContainer.appendChild(...);
 */

// *** Блок используемых функций *** //

// ** Работа с cookie ** // 
// Возврат объекта со всеми корректными cookie
function getCookies() {

    return document.cookie
        .split('; ')
        .filter(Boolean || null)
        .map(cookie => cookie.match(/^([^=]+)=(.+)/))
        .filter(cookie => cookie !== null)
        .reduce((obj, [, name, value]) => {
            obj[name] = value;

            return obj;
        }, {});
}

// Установка cookie
function setCookie(name = '', value = '', expires) {
    if (typeof expires === 'number' && expires) {
        expires = new Date(new Date().getDate() + expires);
    }
    if (expires && expires.toUTCString()) {
        expires = expires.toUTCString();
    }
    document.cookie = `${name}=${value};expires=${expires}`;
}

// Удаление cookie из браузера и таблицы
function deleteCookie(name = '', value = '') {
    setCookie(name, value, -1);
    cleanTable(name);
}

// Создание события удаления cookie на кнопке "Удалить cookie"
function createDeleteEvent() {
    let elems = homeworkContainer.querySelectorAll(`#list-table tbody tr td button`);

    Array.from(elems, button => button.addEventListener('click', e => {
        let name = e.target.parentNode.parentNode.getAttribute('name'),
            value = e.target.parentNode.previousElementSibling.textContent;

        deleteCookie(name, value);
    }, false));
}

// True, если cookie с таким именем уже существует
function searchSameCookie(array, name) {
    return array.some(elem => name === elem);
}

// ** Работа с таблицей ** //
// Добавление cookie в таблицу
function addToTable(name = '', value = '') {
    listTable.innerHTML += 
    `<tr name="${name}">
        <td class="cookie-name">${name}</td>
        <td class="cookie-value">${value}</td>
        <td><button>Удалить cookie</button></td>
    </tr>`;
    createDeleteEvent();
}

// Заполнить таблицу свойствами и значениями объекта
function fillTable(obj) {
    let keys = Object.keys(obj);

    for (let prop of keys) {
        addToTable(prop, obj[prop]);
    }
}

// Полностью очистить таблицу, либо удалить строку с именем переданной cookie
function cleanTable(name) {
    if (name) {
        listTable.removeChild(homeworkContainer.querySelector(`#list-table tbody tr[name="${name}"]`));
    } else {
        while (listTable.firstChild) {
            listTable.removeChild(listTable.firstChild);
        }
    }
}

// ** Вспомогательные функции ** //
// Сравнение строки и подстроки
function isMatching(full, chunk) {
    if ( full.toLowerCase().indexOf(chunk.toLowerCase()) !== -1 ) {

        return true;
    }

    return false;
}

// *** Объявление глобальный переменных *** //
let homeworkContainer = document.querySelector('#homework-container');
let filterNameInput = homeworkContainer.querySelector('#filter-name-input');
let addNameInput = homeworkContainer.querySelector('#add-name-input');
let addValueInput = homeworkContainer.querySelector('#add-value-input');
let addButton = homeworkContainer.querySelector('#add-button');
let listTable = homeworkContainer.querySelector('#list-table tbody');

// *** Установка событий *** //
// Прогрузка таблицы с cookie после загрузки страницы
window.addEventListener('load', () => {
    let cooksObj = getCookies();

    if (!filterNameInput.value) {
        fillTable(cooksObj);
    }
});

// Настройка фильтра cookie по таблице
filterNameInput.addEventListener('keyup', () => {
    let filterValue = filterNameInput.value,
        cooksObj = getCookies(),
        keys = Object.keys(cooksObj);
    
    cleanTable();
    if (filterValue) { 
        keys
        .filter(cookie => isMatching(cookie, filterValue) || isMatching(cooksObj[cookie], filterValue))
        .map(cookie => addToTable(cookie, cooksObj[cookie]));
    } else {
        fillTable(cooksObj);
    }
});

// Настройка формы добавление новых cookie
addButton.addEventListener('click', () => {
    let filterValue = filterNameInput.value,
        nameInput = addNameInput.value,
        valueInput = addValueInput.value,
        a = [nameInput, valueInput],
        cooksObj = getCookies(),
        keys = Object.keys(cooksObj);

    if ( (filterValue && (isMatching(nameInput, filterValue) || isMatching(valueInput, filterValue))) || !filterValue ) {
        if (searchSameCookie(keys, nameInput)) {
            deleteCookie(...a);
        }
        setCookie(...a);
        addToTable(...a);
    } else {
        if (searchSameCookie(keys, nameInput)) {
            deleteCookie(...a);
        }
        setCookie(...a);
    }
});
