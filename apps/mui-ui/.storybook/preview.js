import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import ThemeSelector from 'components/ThemeSelector';

export const parameters = {
  actions: {argTypesRegex: '^on[A-Z].*'},
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators = [
  Story => (
    <BrowserRouter>
      <ThemeSelector isDark={false}>
        <Story />
      </ThemeSelector>
    </BrowserRouter>
  ),
];
