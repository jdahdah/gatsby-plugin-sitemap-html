/**
 * gatsby-plugin-sitemap-html
 * Copyright (c) 2025 Ketan Patel
 * MIT License
 */

const fs = require('fs-extra');
const path = require('path');

exports.onPostBuild = async ({ store }, pluginOptions) => {
  const { program } = store.getState();
  const output = pluginOptions.output || '/';
  const publicDir = program.directory
    ? path.join(program.directory, 'public', output)
    : path.join('public', output);
  let xslTemplate = pluginOptions.xslTemplate;
  if (!xslTemplate) {
    xslTemplate = path.join(__dirname, 'templates', 'sitemap.xsl');
    if (!fs.pathExistsSync(xslTemplate)) {
      throw new Error(
        `gatsby-plugin-sitemap-html: cannot find sitemap.xsl at ${xslTemplate}`
      );
    }
  }

  // Copy XSL template to public directory
  await fs.copy(xslTemplate, path.join(publicDir, 'sitemap.xsl'));

  // Inject XSL reference into all sitemap files
  const sitemapFiles = (await fs.readdir(publicDir)).filter(
    (f) => f === 'sitemap-index.xml' || /^sitemap-\d+\.xml$/.test(f)
  );

  const timestamp = new Date().toISOString();

  for (const file of sitemapFiles) {
    const filePath = path.join(publicDir, file);
    let content = await fs.readFile(filePath, 'utf8');

    // Inject XSL stylesheet reference
    if (!content.includes('<?xml-stylesheet')) {
      content = content.replace(
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>'
      );
    }

    // Add lastmod timestamp to sitemap entries without it
    if (content.includes('<sitemapindex')) {
      content = content.replace(
        /<sitemap>(?![\s\S]*?<lastmod>)([\s\S]*?)<\/sitemap>/g,
        `<sitemap>$1<lastmod>${timestamp}</lastmod></sitemap>`
      );
    }

    // Add lastmod timestamp to URL entries without it
    if (content.includes('<urlset')) {
      content = content.replace(
        /<url>(?![\s\S]*?<lastmod>)([\s\S]*?)<\/url>/g,
        `<url>$1<lastmod>${timestamp}</lastmod></url>`
      );
    }

    await fs.writeFile(filePath, content);
  }
};
