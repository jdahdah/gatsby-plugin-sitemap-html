# gatsby-plugin-sitemap-html

[![npm version](https://badge.fury.io/js/gatsby-plugin-sitemap-html.svg)](https://www.npmjs.com/package/gatsby-plugin-sitemap-html)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/KtanPatel/gatsby-plugin-sitemap-html/actions/workflows/ci.yml/badge.svg)](https://github.com/KtanPatel/gatsby-plugin-sitemap-html/actions)
[![codecov](https://codecov.io/gh/KtanPatel/gatsby-plugin-sitemap-html/branch/main/graph/badge.svg)](https://codecov.io/gh/KtanPatel/gatsby-plugin-sitemap-html)

A Gatsby plugin that extends `gatsby-plugin-sitemap` to generate **human-readable, HTML-styled sitemaps** using XSL. Transform your XML sitemaps into beautiful, browser-friendly pages that both users and search engines can appreciate.

## ✨ Features

- 🎨 **Beautiful HTML styling** - Makes sitemaps human-readable in browsers
- 🔧 **Zero configuration** - Works out of the box with sensible defaults
- 🎯 **Customizable** - Bring your own XSL template if needed
- 📦 **Lightweight** - Minimal dependencies
- 🚀 **SEO-friendly** - Maintains XML structure for search engines
- 🔄 **Automatic processing** - Handles sitemap index and all sitemap files

## 📦 Installation

```bash
pnpm add gatsby-plugin-sitemap gatsby-plugin-sitemap-html
```

Or with npm:

```bash
npm install gatsby-plugin-sitemap gatsby-plugin-sitemap-html
```

Or with yarn:

```bash
yarn add gatsby-plugin-sitemap gatsby-plugin-sitemap-html
```

## 🚀 Quick Start

Add the plugin to your `gatsby-config.js`. **Important:** Add it after `gatsby-plugin-sitemap`:

```js
module.exports = {
  siteMetadata: {
    siteUrl: 'https://www.example.com',
  },
  plugins: ['gatsby-plugin-sitemap', 'gatsby-plugin-sitemap-html'],
};
```

That's it! Build your site and visit `/sitemap.xml` in your browser to see the styled sitemap.

## ⚙️ Configuration

### Basic Configuration

```js
module.exports = {
  plugins: [
    'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-plugin-sitemap-html',
      options: {
        // Optional: path to custom XSL template
        xslTemplate: `${__dirname}/src/templates/custom-sitemap.xsl`,
      },
    },
  ],
};
```

### Custom Output Path

```js
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-plugin-sitemap',
      options: {
        output: '/sitemaps',
      },
    },
    {
      resolve: 'gatsby-plugin-sitemap-html',
      options: {
        output: '/sitemaps', // Must match gatsby-plugin-sitemap
      },
    },
  ],
};
```

### Options

| Option             | Type    | Default           | Description                                                              |
| ------------------ | ------- | ----------------- | ------------------------------------------------------------------------ |
| xslTemplate        | string  | built-in template | Path to a custom XSL template file (optional)                            |
| output             | string  | `/`               | Folder path where sitemaps are stored (must match gatsby-plugin-sitemap) |
| renameSitemapIndex | boolean | `true`            | Rename `sitemap-index.xml` to `sitemap.xml` after processing             |

## 📖 How It Works

1. `gatsby-plugin-sitemap` generates your sitemap files (`sitemap-index.xml`, `sitemap-0.xml`, etc.)
2. This plugin automatically:
   - Copies the XSL stylesheet to your public directory
   - Injects XSL references into all sitemap files
   - Renames `sitemap-index.xml` to `sitemap.xml` for standard naming (unless disabled)
3. When users visit your sitemap in a browser, they see a styled HTML page
4. Search engines still see the standard XML structure

### Keep `sitemap-index.xml` filename

If you do not want the plugin to rename `sitemap-index.xml` to `sitemap.xml`:

```js
{
  resolve: 'gatsby-plugin-sitemap-html',
  options: {
    renameSitemapIndex: false,
  },
}
```

## 🎨 Custom Styling

To customize the appearance of your sitemap:

1. Create a custom XSL file (you can copy from `node_modules/gatsby-plugin-sitemap-html/templates/sitemap.xsl`)
2. Modify the styles and layout as needed
3. Reference it in your config:

```js
{
  resolve: 'gatsby-plugin-sitemap-html',
  options: {
    xslTemplate: './src/templates/my-sitemap.xsl',
  },
}
```

## 📚 Documentation

- [API Reference](./docs/API.md) - Detailed API documentation
- [Examples](./docs/EXAMPLES.md) - More usage examples and configurations
- [Troubleshooting](./docs/TROUBLESHOOTING.md) - Common issues and solutions

## 🔍 Example

Check the [`example`](./example) directory for a complete working demo.

To run the example:

```bash
cd example
pnpm install
pnpm run build
pnpm run serve
```

Then visit `http://localhost:9000/sitemap.xml`

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) for details.

Please note that this project is released with a [Code of Conduct](./CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## 🔒 Security

See our [Security Policy](./SECURITY.md) for reporting vulnerabilities.

## 📝 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for release history.

## 📄 License

MIT © [Ketan Patel](https://github.com/KtanPatel)

## 🙏 Acknowledgments

- Built on top of [gatsby-plugin-sitemap](https://www.gatsbyjs.com/plugins/gatsby-plugin-sitemap/)
- Inspired by the need for human-readable sitemaps

---

If you find this plugin helpful, please ⭐ star the repo!
