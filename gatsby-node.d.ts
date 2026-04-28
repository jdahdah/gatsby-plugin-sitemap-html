import { GatsbyNode } from 'gatsby';

export interface PluginOptions {
  /**
   * Path to a custom XSL template file.
   * If not provided, the plugin uses its built-in template.
   * @example
   * ```js
   * {
   *   xslTemplate: './src/templates/custom-sitemap.xsl'
   * }
   * ```
   */
  xslTemplate?: string;
  
  /**
   * Folder path where sitemaps are stored.
   * Must match the output option in gatsby-plugin-sitemap.
   * @default '/'
   * @example
   * ```js
   * {
   *   output: '/sitemaps'
   * }
   * ```
   */
  output?: string;

  /**
   * Renames `sitemap-index.xml` to `sitemap.xml`.
   * Set to `false` to keep Gatsby's default `sitemap-index.xml` filename.
   * @default true
   * @example
   * ```js
   * {
   *   renameSitemapIndex: false
   * }
   * ```
   */
  renameSitemapIndex?: boolean;
}

/**
 * Gatsby plugin that extends gatsby-plugin-sitemap to generate HTML-styled sitemaps using XSL.
 * 
 * This plugin automatically:
 * - Copies the XSL stylesheet to your public directory
 * - Injects XSL references into all sitemap files
 * - Renames sitemap-index.xml to sitemap.xml (configurable)
 * 
 * @example
 * ```js
 * // gatsby-config.js
 * module.exports = {
 *   plugins: [
 *     'gatsby-plugin-sitemap',
 *     {
 *       resolve: 'gatsby-plugin-sitemap-html',
 *       options: {
 *         xslTemplate: './src/templates/sitemap.xsl', // optional
 *       },
 *     },
 *   ],
 * };
 * ```
 */
export const onPostBuild: GatsbyNode['onPostBuild'];
