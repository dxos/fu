//
// Copyright 2020 DXOS.org
//

import os from 'os';

import { walk } from './walk';
import { strip } from './strip';

test('walk', async () => {
  {
    const files = await walk('src/**');
    expect(files.length).toBe(5);
  }
  {
    const files = await walk('**/+(src|testing)', /node_modules/);
    expect(files.length).toBe(6);
  }
});

test('strip', async () => {
  const text = await strip('testing/test.js');
  expect(text.split(os.EOL)).toHaveLength(21);
});
