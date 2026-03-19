// Sorts ab tests in descending threshold order
export function sortTestsByThreshold(tests) {
  let sortedTESTS = tests;
  Object.keys(sortedTESTS).forEach(personProp => {
    // checks if the array exists
    if (sortedTESTS[personProp] && sortedTESTS[personProp].length) {
      sortedTESTS[personProp].sort((a, b) => b.threshold - a.threshold);
    }
  });
  return sortedTESTS;
}
