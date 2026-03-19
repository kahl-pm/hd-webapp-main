const fs = require('fs');

// Read the legal_en_CA.json file
const legalDataEn = fs.readFileSync('./lang/legal_en_CA.json', 'utf8');
const legalJsonEn = JSON.parse(legalDataEn);

// Read the expected_en_CA.json file
const expectedDataEn = fs.readFileSync('./tests/lang/expected_en_CA.json', 'utf8');
const expectedJsonEn = JSON.parse(expectedDataEn);

// Sort the original English keys
const sortOriginalEnKeys = Object.keys(legalJsonEn)
  .sort()
  .reduce((acc, key) => ({
    ...acc, [key]: legalJsonEn[key],
  }), {});
fs.writeFileSync('./lang/legal_en_CA.json', JSON.stringify(sortOriginalEnKeys, null, 4));
console.log('Original English keys sorted successfully!');

// Get the keys that are present in legalJson but missing in expectedJson
const missingKeysEn = Object.keys(legalJsonEn).filter(key => !(key in expectedJsonEn));

console.log('Missing keys EN:', missingKeysEn);

// Add the missing keys to expectedJson
missingKeysEn.forEach(key => {
  expectedJsonEn[key] = legalJsonEn[key];
});

if (missingKeysEn.length > 0) {
  const sorted_keys = Object.keys(expectedJsonEn)
    .sort()
    .reduce((acc, key) => ({
      ...acc, [key]: expectedJsonEn[key],
    }), {});
  // Write the updated expectedJson back to expected_en_CA.json
  fs.writeFileSync('./tests/lang/expected_en_CA.json', JSON.stringify(sorted_keys, null, 4));
  console.log('New tests generated for new key-value pairs added successfully!');
}

// Read the legal_fr_CA.json file
const legalDataFr = fs.readFileSync('./lang/legal_fr_CA.json', 'utf8');
const legalJsonFr = JSON.parse(legalDataFr);

// Read the expected_fr_CA.json file
const expectedDataFr = fs.readFileSync('./tests/lang/expected_fr_CA.json', 'utf8');
const expectedJsonFr = JSON.parse(expectedDataFr);

// Sort the original French keys
const sortOriginalFrKeys = Object.keys(legalJsonFr)
  .sort()
  .reduce((acc, key) => ({
    ...acc, [key]: legalJsonFr[key],
  }), {});
fs.writeFileSync('./lang/legal_fr_CA.json', JSON.stringify(sortOriginalFrKeys, null, 4));
console.log('Original French keys sorted successfully!');

// Get the keys that are present in legalJson but missing in expectedJson
const missingKeysFr = Object.keys(legalJsonFr).filter(key => !(key in expectedJsonFr));

console.log('Missing keys FR:', missingKeysFr);

// Add the missing keys to expectedJson
missingKeysFr.forEach(key => {
  expectedJsonFr[key] = legalJsonFr[key];
});

if (missingKeysFr.length > 0) {
  const sorted_keys = Object.keys(expectedJsonFr)
    .sort()
    .reduce((acc, key) => ({
      ...acc, [key]: expectedJsonFr[key],
    }), {});
  // Write the updated expectedJson back to expected_fr_CA.json
  fs.writeFileSync('./tests/lang/expected_fr_CA.json', JSON.stringify(sorted_keys, null, 4));
  console.log('New tests generated for new key-value pairs added successfully!');
}
