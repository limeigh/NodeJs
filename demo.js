var fs = require('fs')

fs.readFile('./data.txt', 'utf8', function (err, data) {
    if (err) {
        throw err
    }
    console.log(data);
})

var foo = 'bar'

function f(name) {
    console.log('hello ' + name);
}

f(foo)
