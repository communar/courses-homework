// Настройка работы VK API
    // Обработка запроса
function vkApi(method, options) {
    if (!options.v) {
        options.v = '5.64';
    }

    return new Promise((resolve, reject) => {
        VK.api(method, options, response => {
            if (response.error) {
                reject(new Error(response.error.error_msg));
            } else {
                resolve(response);
            }
        });
    })
}

    // Иницализация VK
function vkInit() {
    return new Promise((resolve, reject) => {
        VK.init({
            apiId: 6060252
        });

        VK.Auth.login(response => {
            if (response.session) {
                resolve(response);
            } else {
                reject(new Error('Не удалось авторизоваться'));
            }
        }, 2);
    })
}

    // Функция поиска друзей через input-поле
function search(e) {
    let target = e.target;

    if (target.id === 'search-field') {
        sort(target);
    } else if (target.id === 'sub-search-field') {
        sort(target);
    }
}

    // Вспомогательная функция для поиска друзей, выводящая нужные значения
function sort(target) {
    let resultField = target.parentElement.parentElement.lastElementChild,
        input = target.value;
        
    return Array.from(resultField.children, elem => {
        if (elem.textContent.includes(input)) {
            elem.style.display = 'flex';
        } else {
            elem.style.display = 'none';
        }
    });
}

    // Функция сохранения списков
function saveResult() {
    localStorage.main = friends.innerHTML;
    localStorage.sub = subFriends.innerHTML;
}

    // Перемещение по спискам
function moveToList(e) {
    if (e.target.parentElement.parentElement === friends) {
        subFriends.appendChild(e.target.parentElement);
    } else if (e.target.parentElement.parentElement === subFriends) {
        friends.appendChild(e.target.parentElement);
    }
}

    // Функция для получения координат элемента
function getCoords(elem) {
    let box = elem.getBoundingClientRect();

    return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
    };
}

// Блок объявления переменных
    // DOM-элементы
let headerInfo = document.querySelector('#header-info'),
    friends = document.querySelector('#friends'),
    subFriends = document.querySelector('#sub-friends');

    // Константы для шаблона Handlebars
const template = `
{{#each response.items}}
    <div class="friend" draggable=true>
        <img class="photo-100" src={{photo_100}}>
        <div class="name">{{first_name}} {{last_name}}</div>
        <div class="add"></div>
        <div class="plank"></div>
    </div>
{{/each}}
`;
const templateFunc = Handlebars.compile(template);

// Промис работы приложения (основное тело программы)
new Promise(resolve => {
    window.addEventListener('load', () => resolve());
})
    .then(() => vkInit())
    .then(() => vkApi('users.get', {
        name_case: 'gen'
    }))
    .then(response => {
        headerInfo.textContent = `Друзья ${response.response[0].first_name} ${response.response[0].last_name}`;
    })
    .then(() => vkApi('friends.get', {
        fields: 'photo_100'
    }))
    .then(response => {
        // Проверка на ранние сохранения списков
        if (localStorage.main && localStorage.sub) {
            friends.innerHTML = localStorage.main;
            subFriends.innerHTML = localStorage.sub;
        } else {
            friends.innerHTML = templateFunc(response);
        }
    })
    .then(() => {
        let pluses = document.querySelectorAll('.add'),
            searchField = document.querySelector('#search-field'),
            subSearchField = document.querySelector('#sub-search-field'),
            save = document.querySelector('#save');

        // Настройка "живого поиска" по спискам друзей
        searchField.addEventListener('keyup', search);
        subSearchField.addEventListener('keyup', search);
        save.addEventListener('click', saveResult);
        // Обработка click на иконках "добавить/удалить из списка"
        Array.from(pluses, plus => {
            plus.addEventListener('click', moveToList);
        });

        // Конструктор для Drag'n'Drop
        return new function() {
            let dragObject = {},
                self = this;

            // Основные функции
            function mouseDown(e) {
                if (e.which !== 1) {
                    return;
                }
                let elem = e.target.closest('[draggable=true]');

                if (!elem) {
                    return;
                }
                elem.ondragstart = () => false;
                dragObject.elem = elem;
                dragObject.downX = e.pageX;
                dragObject.downY = e.pageY;

                return false;
            }

            function mouseMove(e) {
                if (!dragObject.elem) {

                    return;
                }
                if (!dragObject.avatar) {
                    let moveX = e.pageX - dragObject.downX,
                        moveY = e.pageY - dragObject.downY;

                    if (Math.abs(moveX) < 3 && Math.abs(moveY) < 3) {

                        return;
                    }
                    dragObject.avatar = createAvatar(e);
                    if (!dragObject.avatar) {
                        dragObject = {};

                        return;
                    }
                    let coords = getCoords(dragObject.avatar);

                    dragObject.shiftX = dragObject.downX - coords.left;
                    dragObject.shiftY = dragObject.downY - coords.top;
                    startDrag();
                }
                dragObject.avatar.style.left = e.pageX - dragObject.shiftX + 'px';
                dragObject.avatar.style.top = e.pageY - dragObject.shiftY + 'px';

                return false;
            }

            function mouseUp(e) {
                if (dragObject.avatar) {
                    finishDrag(e);
                }
                dragObject = {};
            }

            // Дочерние функции
                // Создание "аватара" элемента и его backup-метожа
            function createAvatar() {
                let avatar = dragObject.elem,
                    old = {
                        parent: avatar.parentNode,
                        nextSibling: avatar.nextSibling,
                        display: avatar.display || '',
                        position: avatar.position || '',
                        left: avatar.left || '',
                        top: avatar.top || '',
                        width: avatar.width || '100%',
                        zIndex: avatar.zIndex || ''
                    };

                avatar.rollback = function() {
                    old.parent.insertBefore(avatar, old.nextSibling);
                    avatar.style.display = old.display;
                    avatar.style.position = old.position;
                    avatar.style.left = old.left;
                    avatar.style.top = old.top;
                    avatar.style.width = old.width;
                    avatar.style.zIndex = old.zIndex;
                }

                return avatar;
            }

                // Перемещение элемента
            function startDrag() {
                let avatar = dragObject.avatar;

                document.body.appendChild(avatar);
                avatar.style.zIndex = 9999;
                avatar.style.position = 'absolute';
                avatar.style.width = '300px';
            }

                // Завершение перемещения элемента
            function finishDrag(e) {
                let find = findDroppable(e),
                    dropElem = find.droppable,
                    dragSibling = find.draggable;

                if (dropElem) {
                    self.dragEnd(dropElem, dragObject, dragSibling);
                } else {
                    self.dragCancel(dragObject);
                }
            }

                // Поиск близжайшего droppable-контейнера
            function findDroppable(e) {
                dragObject.avatar.style.display = 'none';
                let elem = document.elementFromPoint(e.clientX, e.clientY);

                dragObject.avatar.rollback();
                if (elem === null) {

                    return null;
                }

                return {
                    droppable: elem.closest('.droppable'),
                    draggable: elem.closest('[draggable=true]')
                }
            }

            // Объявление событий
            document.addEventListener('mousedown', mouseDown);
            document.addEventListener('mousemove', mouseMove);
            document.addEventListener('mouseup', mouseUp);
                // Удачное завершение перемещения
            this.dragEnd = function(dropElem, dragObject, dragSibling) {
                dropElem.insertBefore(dragObject.elem, dragSibling);
            };
                // Неудачное завершение перемещения
            this.dragCancel = function(dragObject) {
                dragObject.avatar.rollback();
            };

        }
    })
    .catch(e => alert('Ошибка ' + e.message));
