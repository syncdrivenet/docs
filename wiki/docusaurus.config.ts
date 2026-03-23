import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'SyncDriveNet',
  tagline: 'Multi-Device Recording System Documentation',

  future: {
    v4: true,
  },

  url: 'https://syncdrivenet.github.io',
  baseUrl: '/docs/',

  organizationName: 'syncdrivenet',
  projectName: 'docs',
  trailingSlash: false,
  deploymentBranch: 'gh-pages',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'SyncDriveNet',
      items: [
        {
          to: '/reference/api',
          label: 'Docs',
          position: 'left',
        },
        {
          to: '/guides/data-export',
          label: 'Guide',
          position: 'left',
        },
        {
          href: 'https://github.com/syncdrivenet',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
