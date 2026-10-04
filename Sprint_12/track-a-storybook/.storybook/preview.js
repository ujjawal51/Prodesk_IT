/**
 * Storybook Component Preview Configuration
 * Strict adherence to Sprint 12 FAQ Q4:
 * "Storybook renders components within an isolated iframe, completely detached from your global CSS.
 *  You must explicitly import your global stylesheet (e.g., import '../styles/globals.css'; ) within the .storybook/preview.js configuration file."
 */
import '../styles/globals.css';

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#0a0e17'
        },
        {
          name: 'light',
          value: '#ffffff'
        },
        {
          name: 'slate-900',
          value: '#0f172a'
        }
      ]
    },
    layout: 'centered'
  }
};

export default preview;
