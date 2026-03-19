const fs = require('fs');
// Read newly extracted json
fs.readFile('./lang/en-new.json', 'utf8', (err, jsonString) => {
  console.log('Reading new lang strings from en-new.json...');
  if (err) {
    console.log('Error reading file from disk:', err);
    return;
  }
  let newStrings;
  let oldStrings;
  let result;
  try {
    // Parse new extracted lang strings to json object
    newStrings = JSON.parse(jsonString);
    // Read old lang strings
    fs.readFile('./lang/en_CA.json', 'utf8', (err2, nextJson) => {
      console.log('Reading old lang strings from en_CA.json...');
      if (err2) {
        console.log('Error reading en_CA.json file from disk:', err2);
        return;
      }
      try {
        // Parse old lang strings to object
        oldStrings = JSON.parse(nextJson);
      } catch (error) {
        console.log('Error parsing JSON string:', error);
      }
      // Concat old strings and new strings
      console.log('Merge old strings and new strings...');
      const unsorted_keys = { ...oldStrings, ...newStrings };
      const sorted_keys = Object.keys(unsorted_keys)
        .sort()
        .reduce((acc, key) => ({
          ...acc, [key]: unsorted_keys[key],
        }), {});
      result = JSON.stringify(sorted_keys, null, 4);
      // Update en_CA.json with newly added strings
      console.log('Update en_CA.json with new strings...');
      fs.writeFile('./lang/en_CA.json', result, 'utf8', () => {});
      // Delete en-new.json
      fs.unlink('./lang/en-new.json', (err3) => {
        if (err3) {
          throw err3;
        }
        console.log('Delete en-new.json file successfully.');
      });
    });
  } catch (error) {
    console.log('Error parsing JSON string:', error);
  }
});
