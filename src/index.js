/* ДЗ 3 - работа с массивами и объеектами */

/*
 Задача 1:
 Напишите аналог встроенного метода forEach для работы с массивами
 */
function forEach(array, fn) {
    for (let i = 0, len = array.length; i < len; i++) {
        fn(array[i], i, array);
    }
}

/*
 Задача 2:
 Напишите аналог встроенного метода map для работы с массивами
 */
function map(array, fn) {
    var len = array.length,
        mapArr = new Array(len);

    for (let i = 0; i < len; i++) {
        mapArr[i] = fn(array[i], i, array);
    }

    return mapArr;
}

/*
 Задача 3:
 Напишите аналог встроенного метода reduce для работы с массивами
 */
function reduce(array, fn, initial) {
    var len = array.length;

    if (initial === undefined) {
        initial = array[0];
        for (let i = 1; i < len; i++) {
            initial = fn(initial, array[i], i, array);
        }
    } else {
        for (let i = 0; i < len; i++) {
            initial = fn(initial, array[i], i, array);
        }
    }
    
    return initial;
}

/*
 Задача 4:
 Функция принимает объект и имя свойства, которое необходиом удалить из объекта
 Функция должна удалить указанное свойство из указанного объекта
 */
function deleteProperty(obj, prop) {
    delete obj[prop];
}

/*
 Задача 5:
 Функция принимает объект и имя свойства и возвращает true или false
 Функция должна проверить существует ли укзаанное свойство в указанном объекте
 */
function hasProperty(obj, prop) {
    return obj.hasOwnProperty([prop]);
}

/*
 Задача 6:
 Функция должна получить все перечисляемые свойства объекта и вернуть их в виде массива
 */
function getEnumProps(obj) {
    var keys = Object.keys(obj),
        propArr = new Array(keys.length);

    for (let i = 0; i < keys.length; i++ ) {
        propArr[i] = keys[i];
    }

    return propArr;
}

/*
 Задача 7:
 Функция должна перебрать все свойства объекта, преобразовать их имена в верхний регистра и вернуть в виде массива
 */
function upperProps(obj) {
    var keys = Object.keys(obj),
        propArr = new Array(keys.length);

    for (let i = 0; i < keys.length; i++ ) {
        propArr[i] = keys[i].toUpperCase();
    }

    return propArr;
}

/*
 Задача 8 *:
 Напишите аналог встроенного метода slice для работы с массивами
 */
function slice(array, from = 0, to = array[array.length-1]) {
    var len = array.length;

    if (from < 0 && (len + from) > 0) {
        from = len + from;
    } else if (from < 0 && (len + from) <= 0) {
        from = 0;
    }
    if (to < 0) {
        to = len + to;
    } else if (to > len) {
        to = array[array.length-1];
    }
    var newArr = [],
        j = 0;

    for (let i = from; i < to; i++) {
        newArr[j] = array[i];
        j++;
    }

    return newArr;
}

/*
 Задача 9 *:
 Функция принимает объект и должна вернуть Proxy для этого объекта
 Proxy должен перехватывать все попытки записи значений свойств и возводить это значение в квадрат
 */
function createProxy(obj) {
    'use strict';

    return new Proxy(obj, {
        set: function(obj, prop, value) {
            obj[prop] = value ** 2;

            return true;
        }
    }) 
}

export {
    forEach,
    map,
    reduce,
    deleteProperty,
    hasProperty,
    getEnumProps,
    upperProps,
    slice,
    createProxy
};
