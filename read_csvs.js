const fs = require('fs');
const iconv = require('iconv-lite');

function readCSV(file) {
  const buf = fs.readFileSync(file);
  const text = iconv.decode(buf, 'win1251');
  console.log('---', file, '---');
  console.log(text.split('\n').slice(0, 10).join('\n'));
}

readCSV('src/assets/prices_all.csv');
readCSV('src/assets/price_fruits.csv');
