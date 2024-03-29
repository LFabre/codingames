// Char Codes
// A - 65 | Z - 90
// a - 97 | z - 122

// Char to Number
'a'.charCodeAt(0);

// String to Bin
parseInt(binString, 2);

// Number to Char
String.fromCharCode(65);

// Number to Bin
Number.toString(2);

// Number to Hex
Number.toString(2);

// Hex to Number
Number('0x' + 'FF');

// Degree to Rad
angle * (Math.PI/180)

// Regex not - Not a-Z
s.replace(/[^a-z]/g, '')

// Round
10.45.toFixed(1)

// Is Odd
Boolean(13 & 1)

// Sort
['c', 'b', 'a'].sort() // a b c
['a', 'b', 'c'].sort((a, b) => b - a) // c b a

//:: Specifics

// Fahrenheit to Celsius
const celsiusToFahrenheit = c => c * 9 / 5 + 32;
const FahrenheitToCelsius = f => (f - 32) * 5 / 9;

// Angles of Polygon
(n - 2) * 180

// Shadow with angle
Height / Math.tan(degree)

// Array has all the same
arr.every(e => e === arr[0])

// Filter all unique
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}
var unique = a.filter(onlyUnique);

// Shortest tips
//
// - No need to use `let`
// - +number === toString()
// - Use print
// - Try to use WHILE
// - split``
// - join``
// - +readLine()
// - +readLine(str='') // `str` is defined and can be used
