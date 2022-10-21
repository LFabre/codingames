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

// Regex not
s.replace(/[^a-zA-Z\s]/g, '')

// Round
10.45.toFixed(1)

//:: Specifics

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
