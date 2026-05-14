const fs = require('fs');
const iconv = require('iconv-lite');
const { parse } = require('csv-parse/sync');

// Read existing products to preserve units if possible
let oldProducts = [];
try {
  oldProducts = JSON.parse(fs.readFileSync('src/data/products.json', 'utf8'));
} catch(e) {}
const unitMap = new Map();
oldProducts.forEach(p => unitMap.set(p.name.trim(), p.unit));

const newProducts = [];
let idCounter = 1;

function capitalizeCat(cat) {
  if (!cat) return 'Разное';
  return cat.trim().charAt(0).toUpperCase() + cat.trim().slice(1).toLowerCase();
}

// 1. Process prices_all.csv
try {
  const allBuf = fs.readFileSync('src/assets/prices_all.csv');
  const allText = iconv.decode(allBuf, 'win1251');
  const allRows = parse(allText, { delimiter: ';', relax_column_count: true, skip_empty_lines: true });

  let currentCategory = 'Разное';

  for (let i = 0; i < allRows.length; i++) {
    const row = allRows[i];
    if (row.length < 3) continue;

    const col0 = row[0] ? row[0].trim() : '';
    let col1 = row[1] ? row[1].trim() : '';
    const col2 = row[2] ? row[2].trim() : '';
    const col3 = row[3] ? row[3].trim() : '';

    // Check if category header
    if (col0 === '' && col1 !== '' && col2 === '') {
      currentCategory = capitalizeCat(col1);
      continue;
    }

    // If it's a product row
    if (col0 !== '' && !isNaN(parseInt(col0)) && col1 !== '' && col2 !== '') {
      const priceStr = col2.replace(/\s/g, '').replace(',', '.');
      const price = parseFloat(priceStr);
      if (isNaN(price)) continue;

      let unit = unitMap.get(col1) || 'шт';
      if (col1.toLowerCase().includes('(вес)') || col1.toLowerCase().includes('весовая')) {
          unit = 'кг';
      }

      newProducts.push({
        id: idCounter++,
        name: col1,
        price: price,
        category: currentCategory,
        unit: unit,
        manufacturer: col3 || 'Не указан'
      });
    }
  }
} catch(e) {
  console.error("Error parsing prices_all.csv:", e);
}

// 2. Process price_fruits.csv
try {
  const fruitsBuf = fs.readFileSync('src/assets/price_fruits.csv');
  let fruitsText = fruitsBuf.toString('utf8');
  if (fruitsText.includes('')) {
    fruitsText = iconv.decode(fruitsBuf, 'win1251');
  }
  
  const fruitsRows = parse(fruitsText, { delimiter: ';', relax_column_count: true, skip_empty_lines: true });

  for (let i = 1; i < fruitsRows.length; i++) {
    const row = fruitsRows[i];
    if (row.length < 4) continue;
    
    let cat = capitalizeCat(row[0]);
    let unit = row[1].trim().replace('.', ''); 
    const name = row[2].trim();
    const price = parseFloat(row[3].trim().replace(/\s/g, '').replace(',', '.'));
    
    if (isNaN(price)) continue;
    
    newProducts.push({
      id: idCounter++,
      name: name,
      price: price,
      category: cat,
      unit: unit,
      manufacturer: 'Казахстан'
    });
  }
} catch (e) {
  console.error("Error parsing price_fruits.csv:", e);
}

fs.writeFileSync('src/data/products.json', JSON.stringify(newProducts, null, 2));
console.log('Done! Total products generated:', newProducts.length);
