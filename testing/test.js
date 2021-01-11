//
// Copyright 2021 DXOS.org
//

import os from 'os';

/**
 * Test class.
 */
class Test {
  // Method 1
  get name () {
    return 0;
  }

  // Method 2
  get time () {
    return 0;
  }
}

/**
 * Test function.
 */
const test = () => {
  const t = new Test();

  // More.
  console.log(t);
  console.log(os.arch()); // Test this.
};

// Test it.
test();
