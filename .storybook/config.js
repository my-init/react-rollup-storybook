import { configure, addDecorator } from '@storybook/react';
import '@storybook/addon-docs/register';
// automatically import all files ending in *.stories.js
const req = require.context('../src', true, /\.stories\.(js|mdx|tsx)$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);

// import { addParameters } from '@storybook/react';
// import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks';

// addParameters({
//   docs: {
//     container: DocsContainer,
//     page: DocsPage
//   }
// });
