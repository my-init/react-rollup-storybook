import React from 'react';
import { create, ReactTestRenderer } from 'react-test-renderer';

import Msg from './Msg';

let snapshot: ReactTestRenderer;

const MSG = 'Test MSG...';
const TAIL = 'lovely tail❤️';
beforeEach(() => {
  const msg = <Msg msg={MSG} tail={TAIL} />;

  snapshot = create(msg);
});

describe('<Msg />', () => {
  it('it matches the snapshot', () => {
    expect(snapshot.toJSON()).toMatchSnapshot();
  });
});


