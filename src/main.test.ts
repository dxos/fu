//
// Copyright 2020 DXOS.org
//

import { procesor } from './main';

test('basics', async () => {
  await procesor(['strip', '--dir=./testing', '--ext=js', '--verbose']);
});
