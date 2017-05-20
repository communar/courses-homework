/* ДЗ 4 - работа с DOM */

/**
 * Функция должна создать элемент с тегом DIV, поместить в него текстовый узел и вернуть получившийся элемент
 *
 * @param {string} text - текст, который необходимо поместить в div
 * @return {Element}
 */
function createDivWithText(text) {
    let elem = document.createElement('div');

    elem.textContent = text;

    return elem;
}

/**
 * Функция должна создать элемент с тегом A, установить значение для атрибута href и вернуть получившийся элемент
 *
 * @param {string} hrefValue - значение для атрибута href
 * @return {Element}
 */
function createAWithHref(hrefValue) {
    let elem = document.createElement('a');

    elem.setAttribute('href', hrefValue);

    return elem;
}

/**
 * Функция должна вставлять элемент what в начало элемента where
 *
 * @param {Element} what - что вставлять
 * @param {Element} where - куда вставлять
 */
function prepend(what, where) {
    let before = where.firstChild;

    where.insertBefore(what, before);
}

/**
 * Функция должна перебрать все дочерние элементы элемента where
 * и вернуть массив, состоящий из тех дочерних элементов
 * следующим соседом которых является элемент с тегом P
 * Рекурсия - по желанию
 *
 * @param {Element} where - где искать
 * @return {Array<Element>}
 *
 * @example
 * для html '<div></div><p></p><a></a><span></span><p></p>'
 * функция должна вернуть: [div, span]
 * т.к. следующим соседом этих элементов является элемент с тегом P
 */
function findAllPSiblings(where) {
    let arr = [],
        kid = where.children;

    for (let i = 0, len = kid.length; i < len; i++) {
        if (kid[i].nextElementSibling && kid[i].nextElementSibling.tagName == 'P') {
            arr.push(kid[i]);
        }
    }

    return arr;
}

/**
 * Функция должна перебрать все дочерние узлы типа "элемент" внутри where
 * и вернуть массив, состоящий из текстового содержимого перебираемых элементов
 * Но похоже, что в код закралась ошибка, которую нужно найти и исправить
 *
 * @param {Element} where - где искать
 * @return {Array<string>}
 */
function findError(where) {
    let result = [];

    for (let i = 0, len = where.children.length; i < len; i++) {
        result.push(where.children[i].textContent);
    }

    return result;
}

/**
 * Функция должна перебрать все дочерние узлы элемента where
 * и удалить из него все текстовые узлы
 * Без рекурсии!
 * Будьте внимательны при удалении узлов,
 * можно получить неожиданное поведение при переборе узлов
 *
 * @param {Element} where - где искать
 *
 * @example
 * после выполнения функции, дерево <div></div>привет<p></p>loftchool!!!
 * должно быть преобразовано в <div></div><p></p>
 */
function deleteTextNodes(where) {
    let childNodes = where.childNodes;

    for (let i = 0, len = childNodes.length; i < len; i++) {
        if (childNodes[i] && childNodes[i].nodeType !== 1) {
            where.removeChild(childNodes[i]);
            i--;
        }
    }
}
/**
 * Выполнить предудыщее задание с использование рекурсии
 * то есть необходимо заходить внутрь каждого дочернего элемента
 *
 * @param {Element} where - где искать
 *
 * @example
 * после выполнения функции, дерево <span> <div> <b>привет</b> </div> <p>loftchool</p> !!!</span>
 * должно быть преобразовано в <span><div><b></b></div><p></p></span>
 */
function deleteTextNodesRecursive(where) {
    let child;

    for (let i = 0, len = where.childNodes.length; i < len; i++) {
        if (where.childNodes[i] && where.childNodes[i].nodeType !== 1) {
            where.removeChild(where.childNodes[i]);
            i--;
        } else if (where.childNodes[i] && where.childNodes[i].childNodes) {
            child = where.childNodes[i];
            deleteTextNodesRecursive(child);
        }
    }
}
/**
 * *** Со звездочкой ***
 * Необходимо собрать статистику по всем узлам внутри элемента root и вернуть ее в виде объекта
 * Статистика должна содержать:
 * - количество текстовых узлов
 * - количество элементов каждого класса
 * - количество элементов каждого тега
 * Для работы с классами рекомендуется использовать свойство classList
 * Постарайтесь не создавать глобальных переменных
 *
 * @param {Element} root - где собирать статистику
 * @return {{tags: Object<string, number>, classes: Object<string, number>, texts: number}}
 *
 * @example
 * для html <div class="some-class-1"><b>привет!</b> <b class="some-class-1 some-class-2">loftschool</b></div>
 * должен быть возвращен такой объект:
 * {
 *   tags: { DIV: 1, B: 2},
 *   classes: { "some-class-1": 2, "some-class-2": 1 },
 *   texts: 3
 * }
 */
var stat = {
    tags: {},
    classes: {},
    texts: 0
};

function collectDOMStat(root) {
    var child,
        childNodes = root.childNodes;

    for (var i = 0, len = childNodes.length; i < len; i++) {
        if (childNodes[i] && childNodes[i].nodeType !== 1) {
            stat.texts++;
        } else if (childNodes[i] && childNodes[i].childNodes) {
            if (stat.tags.hasOwnProperty([childNodes[i].tagName])) {
                stat.tags[childNodes[i].tagName]++;
            } else {
                stat.tags[childNodes[i].tagName] = 1;
            }
            for (var j = 0, classLen = childNodes[i].classList.length; j < classLen; j++) {
                if (stat.classes.hasOwnProperty([childNodes[i].classList[j]])) {
                    stat.classes[childNodes[i].classList[j]]++;
                } else {
                    stat.classes[childNodes[i].classList[j]] = 1;
                }
            }
            child = childNodes[i];
            collectDOMStat(child);
        }
    }

    return stat;
}
/**
 * *** Со звездочкой ***
 * Функция должна отслеживать добавление и удаление элементов внутри элемента where
 * Как только в where добавляются или удаляются элемента,
 * необходимо сообщать об этом при помощи вызова функции fn со специальным аргументом
 * В качестве аргумента должен быть передан объек с двумя свойствами:
 * - type: типа события (insert или remove)
 * - nodes: массив из удаленных или добавленных элементов (а зависимости от события)
 * Отслеживание должно работать вне зависимости от глубины создаваемых/удаляемых элементов
 * Рекомендуется использовать MutationObserver
 *
 * @param {Element} where - где отслеживать
 * @param {function(info: {type: string, nodes: Array<Element>})} fn - функция, которую необходимо вызвать
 *
 * @example
 * если в where или в одного из его детей добавляется элемент div
 * то fn должна быть вызвана с аргументов:
 * {
 *   type: 'insert',
 *   nodes: [div]
 * }
 *
 * ------
 *
 * если из where или из одного из его детей удаляется элемент div
 * то fn должна быть вызвана с аргументов:
 * {
 *   type: 'remove',
 *   nodes: [div]
 * }

function observeChildNodes(where, fn) {
    let child,
        arg = {
            type: '',
            nodes: []
        },
        options = {
            childList: true,
            characterData: true,
            attributes: true
        };

    for (let i = 0, len = where.childNodes.length; i < len; i++) {
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutations) {
                if (mutations.addedNodes) {
                    arg.nodes.push(mutations.addedNodes[0]);
                    arg.type = 'insert';
                } else if (mutations.removedNodes) {
                    arg.nodes.push(mutations.removedNodes[0]);
                    arg.type = 'remove';
                }
            });
        });
        
        observer.observe(where, options);
        if (where.childNodes[i] && where.childNodes[i].childNodes) {
            child = where.childNodes[i];
            observeChildNodes(child, fn);
        }
    }
    
    return fn(arg);
}
*/

function observeChildNodes(where, fn) {
}

export {
    createDivWithText,
    createAWithHref,
    prepend,
    findAllPSiblings,
    findError,
    deleteTextNodes,
    deleteTextNodesRecursive,
    collectDOMStat,
    observeChildNodes
};
