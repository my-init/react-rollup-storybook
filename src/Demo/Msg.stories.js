import { Msg } from './Msg';
import React from 'react';

import { storiesOf } from '@storybook/react';

storiesOf('Demo/Msg', module)
  .addParameters({ component: Msg })
  .add('with tail', () => <Msg msg="hello, storybook~" tail="lovely tail ❤️" />);
