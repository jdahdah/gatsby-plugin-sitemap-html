# API Documentation

## Plugin Options

### `xslTemplate`

- **Type:** `string`
- **Default:** Built-in template
- **Optional:** Yes

Path to a custom XSL template file. If not provided, the plugin uses its built-in template.

**Example:**

```js
{
  resolve: 'gatsby-plugin-sitemap-html',
  options: {
    xslTemplate: './src/templates/custom-sitemap.xsl',
  },
}
```

### `output`

- **Type:** `string`
- **Default:** `/`
- **Optional:** Yes

Folder path where sitemaps are stored. Must match the `output` option in `gatsby-plugin-sitemap`.

**Example:**

```js
{
  resolve: 'gatsby-plugin-sitemap',
  options: {
    output: '/sitemaps',
  },
},
{
  resolve: 'gatsby-plugin-sitemap-html',
  options: {
    output: '/sitemaps', // Must match above
  },
}
```

### `renameSitemapIndex`

- **Type:** `boolean`
- **Default:** `true`
- **Optional:** Yes

Renames `sitemap-index.xml` to `sitemap.xml` after sitemap processing. Set to `false` to keep Gatsby's default `sitemap-index.xml` filename.

**Example:**

```js
{
  resolve: 'gatsby-plugin-sitemap-html',
  options: {
    renameSitemapIndex: false,
  },
}
```

## Gatsby Hooks

### `onPostBuild`

This plugin implements the `onPostBuild` hook to process sitemap files after the build completes.

**What it does:**

1. Copies the XSL template to the `public` directory
2. Scans for sitemap files (`sitemap-index.xml`, `sitemap-0.xml`, etc.)
3. Injects XSL stylesheet references into each sitemap file
4. Optionally renames `sitemap-index.xml` to `sitemap.xml`

## File Processing

### Sitemap Files Processed

The plugin automatically processes:

- `sitemap-index.xml` (renamed to `sitemap.xml` by default)
- `sitemap-0.xml`, `sitemap-1.xml`, etc. (all numbered sitemap files)

### XSL Injection

The plugin injects the following line after the XML declaration:

```xml
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
```

This tells browsers to apply the XSL transformation when viewing the sitemap.

## Custom XSL Templates

### Template Structure

A custom XSL template should:

1. Be a valid XSLT 1.0 stylesheet
2. Handle both sitemap index and urlset formats
3. Include proper namespaces

**Minimal example:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
  
  <xsl:template match="/">
    <html>
      <head>
        <title>Sitemap</title>
      </head>
      <body>
        <h1>Sitemap</h1>
        <xsl:apply-templates/>
      </body>
    </html>
  </xsl:template>
  
  <xsl:template match="sitemap:url">
    <div>
      <a href="{sitemap:loc}">
        <xsl:value-of select="sitemap:loc"/>
      </a>
    </div>
  </xsl:template>
  
</xsl:stylesheet>
```

### Available Data

Your XSL template has access to all standard sitemap fields:

**For URL entries:**
- `loc` - The URL
- `lastmod` - Last modification date
- `changefreq` - Change frequency
- `priority` - Priority value

**For sitemap index entries:**
- `loc` - The sitemap URL
- `lastmod` - Last modification date

## Error Handling

### Template Not Found

If the plugin cannot find the XSL template, it throws an error:

```
gatsby-plugin-sitemap-html: cannot find sitemap.xsl in package
```

**Solution:** Ensure the template exists at the specified path or remove the `xslTemplate` option to use the built-in template.

### No Sitemap Files

If no sitemap files are found, the plugin completes silently. This can happen if:

- `gatsby-plugin-sitemap` is not installed
- `gatsby-plugin-sitemap` is configured to skip sitemap generation
- The build failed before sitemap generation

**Solution:** Ensure `gatsby-plugin-sitemap` is properly configured and runs before this plugin.
