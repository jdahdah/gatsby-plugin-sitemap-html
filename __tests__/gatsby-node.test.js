const fs = require('fs-extra');
const path = require('path');
const {
  onPostBuild
} = require('../gatsby-node');
describe('gatsby-plugin-sitemap-html', () => {
  const mockStore = {
    getState: () => ({
      program: {
        directory: '/mock/root'
      }
    })
  };
  beforeEach(() => {
    fs.existsSync = jest.fn();
    fs.pathExistsSync = jest.fn().mockReturnValue(true);
    fs.copy = jest.fn();
    fs.pathExists = jest.fn();
    fs.readFile = jest.fn().mockResolvedValue('<a href="/sitemap.xml" class="back-link">Back to index</a>');
    fs.writeFile = jest.fn();
    fs.readdir = jest.fn().mockResolvedValue([]);
    fs.move = jest.fn();
  });
  test('copies XSL template to public directory', async () => {
    fs.readdir.mockResolvedValue([]);
    await onPostBuild({
      store: mockStore
    }, {});
    expect(fs.copy).toHaveBeenCalledWith(expect.stringMatching(/templates[/\\]sitemap\.xsl/), path.join('/mock/root/public', 'sitemap.xsl'));
    expect(fs.writeFile).toHaveBeenCalledWith(path.join('/mock/root/public', 'sitemap.xsl'), expect.stringContaining('href="/sitemap.xml"'));
  });
  test('injects XSL reference into sitemap files and renames index', async () => {
    fs.readdir.mockResolvedValue(['sitemap-index.xml', 'sitemap-0.xml']);
    fs.pathExists.mockResolvedValue(true);
    fs.readFile.mockResolvedValue('<?xml version="1.0" encoding="UTF-8"?>');
    await onPostBuild({
      store: mockStore
    }, {});
    expect(fs.writeFile).toHaveBeenCalledWith(path.join('/mock/root/public', 'sitemap-index.xml'), expect.stringContaining('<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>'));
    expect(fs.move).toHaveBeenCalledWith(path.join('/mock/root/public', 'sitemap-index.xml'), path.join('/mock/root/public', 'sitemap.xml'), {
      overwrite: true
    });
  });
  test('does not rename sitemap-index.xml when renameSitemapIndex is false', async () => {
    fs.readdir.mockResolvedValue(['sitemap-index.xml']);
    fs.readFile.mockResolvedValue('<?xml version="1.0" encoding="UTF-8"?>');
    await onPostBuild({
      store: mockStore
    }, {
      renameSitemapIndex: false
    });
    expect(fs.move).not.toHaveBeenCalled();
  });
  test('supports custom XSL template path', async () => {
    fs.readdir.mockResolvedValue([]);
    const customPath = '/custom/template.xsl';
    await onPostBuild({
      store: mockStore
    }, {
      xslTemplate: customPath
    });
    expect(fs.copy).toHaveBeenCalledWith(customPath, path.join('/mock/root/public', 'sitemap.xsl'));
  });
  test('updates built-in XSL back link when renameSitemapIndex is false', async () => {
    fs.readdir.mockResolvedValue([]);
    fs.readFile.mockResolvedValue('<a href="/sitemap.xml" class="back-link">Back to index</a>');
    await onPostBuild({
      store: mockStore
    }, {
      renameSitemapIndex: false
    });
    expect(fs.writeFile).toHaveBeenCalledWith(path.join('/mock/root/public', 'sitemap.xsl'), expect.stringContaining('href="/sitemap-index.xml"'));
  });
  test('throws error when XSL template not found', async () => {
    fs.pathExistsSync = jest.fn().mockReturnValue(false);
    await expect(onPostBuild({
      store: mockStore
    }, {})).rejects.toThrow('gatsby-plugin-sitemap-html: cannot find sitemap.xsl at');
  });
  test('adds lastmod to sitemap entries without it', async () => {
    fs.readdir.mockResolvedValue(['sitemap-index.xml']);
    fs.pathExists.mockResolvedValue(true);
    fs.readFile.mockResolvedValue('<?xml version="1.0" encoding="UTF-8"?><sitemapindex><sitemap><loc>https://example.com/sitemap-0.xml</loc></sitemap></sitemapindex>');
    await onPostBuild({
      store: mockStore
    }, {});
    expect(fs.writeFile).toHaveBeenCalledWith(path.join('/mock/root/public', 'sitemap-index.xml'), expect.stringMatching(/<lastmod>.*<\/lastmod>/));
  });
  test('adds lastmod to URL entries without it', async () => {
    fs.readdir.mockResolvedValue(['sitemap-0.xml']);
    fs.readFile.mockResolvedValue('<?xml version="1.0" encoding="UTF-8"?><urlset><url><loc>https://example.com/page</loc></url></urlset>');
    await onPostBuild({
      store: mockStore
    }, {});
    expect(fs.writeFile).toHaveBeenCalledWith(path.join('/mock/root/public', 'sitemap-0.xml'), expect.stringMatching(/<lastmod>.*<\/lastmod>/));
  });
});