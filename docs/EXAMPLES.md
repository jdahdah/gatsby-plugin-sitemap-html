# Examples

## Basic Usage

### Minimal Configuration

```js
// gatsby-config.js
module.exports = {
  siteMetadata: {
    siteUrl: 'https://www.example.com',
  },
  plugins: [
    'gatsby-plugin-sitemap',
    'gatsby-plugin-sitemap-html',
  ],
};
```

### With Custom Options

```js
// gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-plugin-sitemap',
      options: {
        excludes: ['/admin/*', '/private/*'],
      },
    },
    {
      resolve: 'gatsby-plugin-sitemap-html',
      options: {
        xslTemplate: `${__dirname}/src/templates/sitemap.xsl`,
      },
    },
  ],
};
```

### Custom Output Directory

```js
// gatsby-config.js
module.exports = {
  siteMetadata: {
    siteUrl: 'https://www.example.com',
  },
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

### Custom Output with Custom Template

```js
// gatsby-config.js
module.exports = {
  siteMetadata: {
    siteUrl: 'https://www.example.com',
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-sitemap',
      options: {
        output: '/seo',
        excludes: ['/dev-404-page', '/404', '/404.html'],
      },
    },
    {
      resolve: 'gatsby-plugin-sitemap-html',
      options: {
        output: '/seo',
        xslTemplate: `${__dirname}/src/templates/custom-sitemap.xsl`,
      },
    },
  ],
};
```

## Advanced Configurations

### Multi-language Site

```js
// gatsby-config.js
module.exports = {
  siteMetadata: {
    siteUrl: 'https://www.example.com',
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-sitemap',
      options: {
        query: `
          {
            allSitePage {
              nodes {
                path
              }
            }
            allMarkdownRemark {
              nodes {
                fields {
                  slug
                  locale
                }
                frontmatter {
                  date
                }
              }
            }
          }
        `,
        resolveSiteUrl: () => 'https://www.example.com',
        resolvePages: ({
          allSitePage: { nodes: allPages },
          allMarkdownRemark: { nodes: allPosts },
        }) => {
          const postMap = allPosts.reduce((acc, post) => {
            acc[post.fields.slug] = post;
            return acc;
          }, {});

          return allPages.map((page) => ({
            ...page,
            ...postMap[page.path],
          }));
        },
        serialize: ({ path, frontmatter, fields }) => ({
          url: path,
          lastmod: frontmatter?.date,
          changefreq: 'daily',
          priority: fields?.locale === 'en' ? 0.8 : 0.6,
        }),
      },
    },
    'gatsby-plugin-sitemap-html',
  ],
};
```

### E-commerce Site

```js
// gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-plugin-sitemap',
      options: {
        excludes: [
          '/checkout/*',
          '/cart',
          '/account/*',
        ],
        query: `
          {
            allSitePage {
              nodes {
                path
              }
            }
            allProduct {
              nodes {
                slug
                updatedAt
              }
            }
          }
        `,
        serialize: ({ path, updatedAt }) => ({
          url: path,
          lastmod: updatedAt,
          changefreq: path.includes('/products/') ? 'weekly' : 'monthly',
          priority: path === '/' ? 1.0 : 0.7,
        }),
      },
    },
    'gatsby-plugin-sitemap-html',
  ],
};
```

### Blog with Categories

```js
// gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-plugin-sitemap',
      options: {
        query: `
          {
            allSitePage {
              nodes {
                path
              }
            }
            allMdx(sort: {frontmatter: {date: DESC}}) {
              nodes {
                slug
                frontmatter {
                  date
                  category
                }
              }
            }
          }
        `,
        serialize: ({ path, frontmatter }) => {
          let priority = 0.5;
          let changefreq = 'monthly';

          if (path === '/') {
            priority = 1.0;
            changefreq = 'daily';
          } else if (path.startsWith('/blog/')) {
            priority = 0.8;
            changefreq = 'weekly';
          } else if (path.startsWith('/category/')) {
            priority = 0.6;
            changefreq = 'weekly';
          }

          return {
            url: path,
            lastmod: frontmatter?.date,
            changefreq,
            priority,
          };
        },
      },
    },
    'gatsby-plugin-sitemap-html',
  ],
};
```

## Custom XSL Templates

### Branded Sitemap

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">

  <xsl:template match="/">
    <html>
      <head>
        <title>My Site - Sitemap</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
            background: #f5f5f5;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            border-radius: 8px;
            margin-bottom: 2rem;
          }
          .url-list {
            background: white;
            border-radius: 8px;
            padding: 1rem;
          }
          .url-item {
            padding: 1rem;
            border-bottom: 1px solid #eee;
          }
          .url-item:hover {
            background: #f9f9f9;
          }
          a {
            color: #667eea;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Sitemap</h1>
          <p>All pages on this website</p>
        </div>
        <div class="url-list">
          <xsl:apply-templates select="//sitemap:url"/>
        </div>
      </body>
    </html>
  </xsl:template>

  <xsl:template match="sitemap:url">
    <div class="url-item">
      <a href="{sitemap:loc}">
        <xsl:value-of select="sitemap:loc"/>
      </a>
      <xsl:if test="sitemap:lastmod">
        <span style="color: #999; margin-left: 1rem;">
          Last updated: <xsl:value-of select="sitemap:lastmod"/>
        </span>
      </xsl:if>
    </div>
  </xsl:template>

</xsl:stylesheet>
```

### Dark Mode Sitemap

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">

  <xsl:template match="/">
    <html>
      <head>
        <title>Sitemap</title>
        <style>
          @media (prefers-color-scheme: dark) {
            body {
              background: #1a1a1a;
              color: #e0e0e0;
            }
            .url-item {
              border-bottom-color: #333;
            }
            .url-item:hover {
              background: #2a2a2a;
            }
            a {
              color: #8b9cff;
            }
          }
          body {
            font-family: monospace;
            max-width: 1000px;
            margin: 0 auto;
            padding: 2rem;
          }
          .url-item {
            padding: 0.5rem;
            border-bottom: 1px solid #ddd;
          }
        </style>
      </head>
      <body>
        <h1>Sitemap</h1>
        <xsl:apply-templates select="//sitemap:url"/>
      </body>
    </html>
  </xsl:template>

  <xsl:template match="sitemap:url">
    <div class="url-item">
      <a href="{sitemap:loc}">
        <xsl:value-of select="sitemap:loc"/>
      </a>
    </div>
  </xsl:template>

</xsl:stylesheet>
```

## Integration Examples

### With Netlify

```toml
# netlify.toml
[build]
  command = "gatsby build"
  publish = "public"

[[headers]]
  for = "/sitemap-index.xml"
  [headers.values]
    Content-Type = "application/xml"
    Cache-Control = "public, max-age=3600"

[[headers]]
  for = "/sitemap.xsl"
  [headers.values]
    Content-Type = "application/xml"
    Cache-Control = "public, max-age=86400"
```

### With Vercel

```json
{
  "headers": [
    {
      "source": "/sitemap-index.xml",
      "headers": [
        {
          "key": "Content-Type",
          "value": "application/xml"
        },
        {
          "key": "Cache-Control",
          "value": "public, max-age=3600"
        }
      ]
    }
  ]
}
```

### With robots.txt

```js
// gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        host: 'https://www.example.com',
        sitemap: 'https://www.example.com/sitemap-index.xml',
        policy: [{ userAgent: '*', allow: '/' }],
      },
    },
    'gatsby-plugin-sitemap',
    'gatsby-plugin-sitemap-html',
  ],
};
```
