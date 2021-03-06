const path = require('path');

const {
  buildChallenges,
  replaceChallengeNode,
  localeChallengesRootDir
} = require('./utils/buildChallenges');

const { API_PROXY: proxyUrl = 'http://localhost:3000' } = process.env;

const curriculumIntroRoot = path.resolve(__dirname, './src/pages');

module.exports = {
  siteMetadata: {
    title: 'freeCodeCamp',
    siteUrl: 'https://www.freecodecamp.org'
  },
  proxy: {
    prefix: '/internal',
    url: proxyUrl
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-postcss',
    {
      resolve: 'gatsby-plugin-create-client-paths',
      options: {
        prefixes: [
          '/certification/*',
          '/unsubscribed/*',
          '/user/*',
          '/settings/*',
          '/n/*'
        ]
      }
    },
    {
      resolve: 'fcc-source-challenges',
      options: {
        name: 'challenges',
        source: buildChallenges,
        onSourceChange: replaceChallengeNode,
        curriculumPath: localeChallengesRootDir
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'introductions',
        path: curriculumIntroRoot
      }
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          'gatsby-remark-fcc-forum-emoji',
          {
            resolve: 'gatsby-remark-prismjs',
            options: {
              // Class prefix for <pre> tags containing syntax highlighting;
              // defaults to 'language-' (eg <pre class="language-js">).
              // If your site loads Prism into the browser at runtime,
              // (eg for use with libraries like react-live),
              // you may use this to prevent Prism from re-processing syntax.
              // This is an uncommon use-case though;
              // If you're unsure, it's best to use the default value.
              classPrefix: 'language-',
              // This is used to allow setting a language for inline code
              // (i.e. single backticks) by creating a separator.
              // This separator is a string and will do no white-space
              // stripping.
              // A suggested value for English speakers is the non-ascii
              // character '›'.
              inlineCodeMarker: null,
              // This lets you set up language aliases.  For example,
              // setting this to '{ sh: "bash" }' will let you use
              // the language "sh" which will highlight using the
              // bash highlighter.
              aliases: {}
            }
          }
        ]
      }
    },
    {
      resolve: 'gatsby-remark-node-identity',
      options: {
        identity: 'blockIntroMarkdown',
        predicate: ({ frontmatter }) => {
          if (!frontmatter) {
            return false;
          }
          const { title, block, superBlock } = frontmatter;
          return title && block && superBlock;
        }
      }
    },
    {
      resolve: 'gatsby-remark-node-identity',
      options: {
        identity: 'superBlockIntroMarkdown',
        predicate: ({ frontmatter }) => {
          if (!frontmatter) {
            return false;
          }
          const { title, block, superBlock } = frontmatter;
          return title && !block && superBlock;
        }
      }
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'freeCodeCamp',
        /* eslint-disable camelcase */
        short_name: 'fCC',
        start_url: '/',
        theme_color: '#0a0a23',
        background_color: '#fff',
        /* eslint-enable camelcase */
        display: 'minimal-ui',
        icon: 'src/assets/images/square_puck.png'
      }
    },
    {
      resolve: 'gatsby-plugin-google-fonts',
      options: {
        fonts: ['Lato:300,400,400i,500,700', 'Roboto Mono:400,700']
      }
    },
    'gatsby-plugin-sitemap',
    'gatsby-plugin-remove-fingerprints',
    'gatsby-plugin-remove-serviceworker'
  ]
};
