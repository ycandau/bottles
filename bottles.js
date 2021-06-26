//------------------------------------------------------------------------------
// Test assertion functions

const assertEqual = function (actual, expected) {
  const [color, emoji, outcome, operator] =
    actual === expected
      ? ['\x1b[2m\x1b[32m', '  ', 'Passed', '===']
      : ['\x1b[0m\x1b[31m', '\u274c', 'Failed', '!=='];
  console.log(
    color + emoji,
    `Assertion ${outcome}: ${actual} ${operator} ${expected}`
  );
};

const eqArrays = (arr1, arr2) => {
  // Check same number of elements
  if (arr1.length !== arr2.length) return false;

  // Check same elements
  for (const index in arr1) {
    const elem = arr1[index];
    const equal = Array.isArray(elem)
      ? eqArrays
      : typeof elem === 'object'
      ? (a, b) => a === b // @todo eqObjects
      : (a, b) => a === b; // also handles undefined
    if (!equal(elem, arr2[index])) return false;
  }
  return true;
};

const assertArraysEqual = (arr1, arr2) => {
  const [color, emoji, outcome, operator] = eqArrays(arr1, arr2)
    ? ['\x1b[2m\x1b[32m', '  ', 'Passed', '===']
    : ['\x1b[0m\x1b[31m', '\u274c', 'Failed', '!=='];

  console.log(
    color + emoji + `Assertion ${outcome}:`,
    `[${arr1.join(', ')}] ${operator} [${arr2.join(', ')}]`
  );
};

//------------------------------------------------------------------------------
// Helper functions

const invest = (investment) => {
  const fullBottles = investment >> 1;
  return {
    fullBottles,
    emptyBottles: 0,
    caps: 0,
    total: fullBottles,
    earnedFromBottles: 0,
    earnedFromCaps: 0,
  };
};

const drink = (inventory) => {
  const count = inventory.fullBottles;
  inventory.fullBottles = 0;
  inventory.emptyBottles += count;
  inventory.caps += count;
};

const redeemBottles = (inventory) => {
  const count = inventory.emptyBottles >> 1;
  inventory.fullBottles += count;
  inventory.emptyBottles -= count << 1;
  inventory.total += count;
  inventory.earnedFromBottles += count;
};

const redeemCaps = (inventory) => {
  const count = inventory.caps >> 2;
  inventory.fullBottles += count;
  inventory.caps -= count << 2;
  inventory.total += count;
  inventory.earnedFromCaps += count;
};

//------------------------------------------------------------------------------
// Task 1: Total number of bottles

const getTotalBottles = (investment) => {
  const inventory = invest(investment);

  while (inventory.fullBottles) {
    drink(inventory);
    redeemBottles(inventory);
    redeemCaps(inventory);
  }
  return inventory;
};

assertEqual(getTotalBottles(10).total, 15);
assertEqual(getTotalBottles(20).total, 35);
assertEqual(getTotalBottles(30).total, 55);
assertEqual(getTotalBottles(40).total, 75);

//------------------------------------------------------------------------------
// Task 2: CLI
// Task 3: Extended report

const report = (inventory) => {
  console.log(
    `Total bottles:  ${inventory.total}\n` +
      'Total earned:\n' +
      `  From bottles: ${inventory.earnedFromBottles}\n` +
      `  From caps:    ${inventory.earnedFromCaps}`
  );
};

const processArgv = () => {
  const investment = process.argv[2];
  if (investment === undefined) return console.log('Nothing to invest?');

  const inventory = getTotalBottles(investment);
  report(inventory);
};

processArgv();
