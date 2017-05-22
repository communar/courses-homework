/** Со звездочкой */
/**
 * Создать страницу с кнопкой
 * При нажатии на кнопку должен создаваться div со случайными размерами, цветом и позицией
 * Необходимо предоставить возможность перетаскивать созданные div при помощи drag and drop
 * Запрощено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/**
 * homeworkContainer - это контейнер для всех ваших домашних заданий
 * Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер
 *
 * @example
 * homeworkContainer.appendChild(...);
 */
let homeworkContainer = document.querySelector('#homework-container');

/**
 * Функция должна создавать и возвращать новый div с классом draggable-div и случайными размерами/цветом/позицией
 * Функция должна только создавать элемент и задвать ему случайные размер/позицию/цвет
 * Функция НЕ должна добавлять элемент на страницу
 *
 * @return {Element}
 */
function randomColor() {
    var color = '#',
        letters = '0123456789ABCDEF'.split('');

    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }

    return color;
}

function createDiv() {
    var elem = document.createElement('div'),
        style = elem.style,
        body = document.body;

    elem.setAttribute('class', 'draggable-div');
    style.backgroundColor = randomColor();
    style.top = Math.random() * body.clientHeight + 'px';
    style.left = Math.random() * (body.clientWidth - elem.offsetWidth) + 'px';
    style.width = Math.random() * body.clientWidth + 'px';
    style.height = Math.random() * body.clientHeight + 'px';

    return elem;
}

/**
 * Функция должна добавлять обработчики событий для перетаскивания элемента при помощи drag and drop
 *
 * @param {Element} target
 */
function addListeners(target) {
    target.addEventListener('mousedown', function(e) {
        var block = this,
            shiftX = e.pageX - getPosition(block).left,
            shiftY = e.pageY - getPosition(block).top,
            draggableElems = document.querySelectorAll('[draggable]');
        
        function getPosition(elem) {
            var position = elem.getBoundingClientRect();

            return {
                top: position.top + pageYOffset,
                left: position.left + pageXOffset
            };
        }

        function moveAt(e) {
            block.style.top = e.pageY - shiftY + 'px';
            block.style.left = e.pageX - shiftX + 'px';
        }

        function stopMove() {
            document.removeEventListener('mousemove', moveAt);
            block.removeEventListener('mouseup', stopMove);
        }
        
        block.style.position = 'absolute';
        moveAt(e);
        Array.from(draggableElems, function(draggableElem) {
            draggableElem.style.zIndex = 1;
        });
        block.style.zIndex = 1000;
        document.addEventListener('mousemove', moveAt);
        block.addEventListener('mouseup', stopMove);
        block.ondragstart = function() {
            return false;
        }
    });
}

let addDivButton = homeworkContainer.querySelector('#addDiv');

addDivButton.addEventListener('click', function() {
    // создать новый div
    let div = createDiv();

    // добавить на страницу
    homeworkContainer.appendChild(div);
    // назначить обработчики событий мыши для реализации d&d
    addListeners(div);
    // можно не назначать обработчики событий каждому div в отдельности, а использовать делегирование
    // или использовать HTML5 D&D - https://www.html5rocks.com/ru/tutorials/dnd/basics/
});

export {
    createDiv
};
