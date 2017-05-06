/* ДЗ 1 - Функции */

/*
 Задание 1:

 Функция должна принимать один аргумент и возвращать его
 */
function returnFirstArgument(arg) {
	return arg;
};

var result = returnFirstArgument(Math.floor(Math.random()*(100-0)));
console.log('Exercise 1: '+result);

/*
 Задание 2:

 Функция должна принимать два аргумента и возвращать сумму переданных значений
 Значение по умолчанию второго аргумента должно быть 100
 */
function defaultParameterValue(a, b = 100) {
	return a + b;
};

var sum = defaultParameterValue(50, 30);
console.log('Excercise 2: '+sum);

/*
 Задание 3:

 Функция должна возвращать все переданные в нее аргументы в виде массива
 Количество переданных аргументов заранее неизвестно
 */
function returnArgumentsArray() {
	var arr = [];
	for (var i = 0, len = arguments.length; i < len; i++) {
		arr.push(arguments[i]);
	}
	return arr;
};

console.log('Excercise 3: '+returnArgumentsArray('1', 2, 'three'));


/*
 Задание 4:

 Функция должна принимать другую функцию и возвращать результат вызова переданной функции
 */
function returnFnResult(fn) {
	return 'random number is ' + fn();
};

function F() {
	return Math.floor(Math.random()*(100-0));
};

console.log('Excercise 4: '+returnFnResult(F));

/*
 Задание 5:

 Функция должна принимать число (значение по умолчанию - 0) и возвращать функцию (F)
 При вызове F, переданное число должно быть увеличено на единицу и возвращено из F
 */
function returnCounter(number = 0) {
	function F() {
		return ++number;
	}
	return F();
}

console.log('Excercise 5: '+returnCounter());

/*
 Задание 6 *:

 Функция должна принимать другую функцию (F) и некоторое количество дополнительных аргументов
 Функция должна привязать переданные аргументы к функции F и вернуть получившуюся функцию
 */
function bindFunction(fn, x, n) {
	return fn(x, n);
}

function pow(x, n) {
	return x ** n;
}

console.log('Excercise 6: '+bindFunction(pow, 2, 2));

export {
    returnFirstArgument,
    defaultParameterValue,
    returnArgumentsArray,
    returnFnResult,
    returnCounter,
    bindFunction
}
