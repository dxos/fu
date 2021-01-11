//
// Copyright 2020 DXOS.org
//

import { procesor } from './main';

test('basics', (done) => {
  procesor(['strip', '--dir=./testing', '--ext=js', '--verbose']);

  // TODO(burdon): Fix async processing.
  setTimeout(done, 1000);
});
