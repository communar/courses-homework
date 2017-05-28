/**
 * ДЗ 6.2 - Создать страницу с текстовым полем для фильтрации городов
 *
 * Страница должна предварительно загрузить список городов из
 * https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * и отсортировать в алфавитном порядке.
 *
 * При вводе в текстовое поле, под ним должен появляться список тех городов,
 * в названии которых, хотя бы частично, есть введенное значение.
 * Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.
 *
 * Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 * После окончания загрузки городов, надпись исчезает и появляется текстовое поле.
 *
 * Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 *
 * *** Часть со звездочкой ***
 * Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 * то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 * При клике на кнопку, процесс загруки повторяется заново
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
 * Функция должна загружать список городов из https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * И возвращать Promise, которой должен разрешиться массивом загруженных городов
 *
 * @return {Promise<Array<{name: string}>>}
 */
function loadTowns() {

    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();

        xhr.open('GET', 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json', true);
        xhr.addEventListener('progress', () => {
            againButton.style.display = 'none';
            loadingBlock.style.display = 'block';
            loadingBlock.textContent = 'Загрузка...';
        });
        xhr.addEventListener('error', () => {
            reject('Не удалось загрузить города');
           }
        );
        xhr.addEventListener('load', () => {
            if (xhr.status == 200) {
                let citiesArray = JSON.parse(xhr.response);

                loadingBlock.style.display = 'none';
                resolve(citiesArray.sort((a, b) => {
                	if ( a.name < b.name ) {

                        return -1;
                    } else if ( a.name > b.name ) {

                        return 1;
                    } else {

                        return 0;
                    }
                }));
            } else {
                reject('Не удалось загрузить города');
            }
        });
        xhr.send();
    });
}

/**
 * Функция должна проверять встречается ли подстрока chunk в строке full
 * Проверка должна происходить без учета регистра символов
 *
 * @example
 * isMatching('Moscow', 'moscow') // true
 * isMatching('Moscow', 'mosc') // true
 * isMatching('Moscow', 'cow') // true
 * isMatching('Moscow', 'SCO') // true
 * isMatching('Moscow', 'Moscov') // false
 *
 * @return {boolean}
 */
function isMatching(full, chunk) {
    if ( full.toLowerCase().indexOf(chunk.toLowerCase()) !== -1 ) {

        return true;
    } else {

        return false;
    }
}

// Функция для очищения поля вывода городов
function cleanSearchField(parent, array) {
    for (let elem of array)  {
        parent.removeChild(elem);
    }
}

let loadingBlock = homeworkContainer.querySelector('#loading-block');
let filterBlock = homeworkContainer.querySelector('#filter-block');
let filterInput = homeworkContainer.querySelector('#filter-input');
let filterResult = homeworkContainer.querySelector('#filter-result');
let againButton = document.createElement('button');
let townsPromise;

filterBlock.appendChild(againButton);
againButton.textContent = 'Повторить';

filterInput.addEventListener('keyup', function() {
    let part = filterInput.value,
        lis = filterResult.childNodes;

    cleanSearchField(filterResult, lis);
    if (part) {
        loadTowns().then((towns) => {
            againButton.style.display = 'none';
            for (let town of towns) {
                if (isMatching(town.name, part)) {
                    let li = document.createElement('li');

                    li.textContent = town.name;
                    filterResult.appendChild(li);
                }
            }
        })
        .catch((error) => {
            loadingBlock.style.display = 'block';
            loadingBlock.textContent = error;
            againButton.style.display = 'block';
            againButton.addEventListener('click', loadTowns);
        });
    }
});

filterInput.addEventListener('blur', () => {
    let lis = filterResult.childNodes;

    cleanSearchField(filterResult, lis);
    loadTowns().catch((error) => {
        loadingBlock.style.display = 'block';
        loadingBlock.textContent = error;
        againButton.style.display = 'block';
        againButton.addEventListener('click', loadTowns);
    });
});

export {
    loadTowns,
    isMatching
};
