import { readFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { basename, dirname, resolve as resolvePath } from 'node:path';
import { transform } from 'lightningcss';
import { defineConfig } from 'tsdown';

const id = '@qiniu/dsh-qiniu-maas-plugin';
const packageJson = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8'),
) as { version: string };
const clientExternals = [
  'react',
  'react/jsx-runtime',
  '@deepseek-ai/dsh-client-connection',
  '@deepseek-ai/dsh-client-locale',
  '@deepseek-ai/dsh-client-runtime',
  '@deepseek-ai/dsh-client-ui-settings',
  '@deepseek-ai/dsh-client-ui-slots',
];
const cssVirtualPrefix = '\0dsh-css:';
const cssVirtualSuffix = '.mjs';

export default defineConfig({
  entry: { client: 'src/client/index.ts' },
  outDir: 'lib',
  format: 'cjs',
  platform: 'browser',
  target: 'es2022',
  dts: false,
  sourcemap: true,
  clean: false,
  deps: {
    neverBundle: (source: string) => clientExternals.includes(source),
    alwaysBundle: (source: string) => source === 'qiniu-maas-market-sdk',
  },
  define: {
    __QINIU_PLUGIN_VERSION__: JSON.stringify(packageJson.version),
    'process.env.NODE_ENV': JSON.stringify('production'),
    'import.meta.env.MODE': JSON.stringify('production'),
    'import.meta.env': JSON.stringify({ MODE: 'production' }),
  },
  plugins: [
    {
      name: 'dsh-css-modules-inline',
      resolveId(source: string, importer: string | undefined) {
        if (!source.endsWith('.module.css')) return null;
        const absolutePath =
          importer === undefined
            ? source
            : resolvePath(dirname(importer), source);
        return cssVirtualPrefix + absolutePath + cssVirtualSuffix;
      },
      async load(
        this: { addWatchFile(file: string): void },
        virtualId: string,
      ) {
        if (!virtualId.startsWith(cssVirtualPrefix)) return null;
        const filePath = virtualId.slice(
          cssVirtualPrefix.length,
          -cssVirtualSuffix.length,
        );
        this.addWatchFile(filePath);
        const source = await readFile(filePath);
        const { code, exports } = transform({
          filename: filePath,
          code: source,
          cssModules: { pattern: '[hash]_[local]' },
          minify: true,
          targets: {
            chrome: 90 << 16,
            firefox: 100 << 16,
            safari: 13 << 16,
            edge: 90 << 16,
          },
        });
        const classMap: Record<string, string> = {};
        for (const [local, value] of Object.entries(exports ?? {})) {
          classMap[local] = value.name;
        }
        const tagId = `${id}/${basename(filePath)}`;
        return [
          `const css = ${JSON.stringify(code.toString())};`,
          `const tagId = ${JSON.stringify(tagId)};`,
          "if (typeof document !== 'undefined' && document.querySelector('style[data-plugin-css=' + JSON.stringify(tagId) + ']') === null) {",
          "  const tag = document.createElement('style');",
          `  tag.dataset.plugin = ${JSON.stringify(id)};`,
          '  tag.dataset.pluginCss = tagId;',
          '  tag.textContent = css;',
          '  document.head.appendChild(tag);',
          '}',
          `export default ${JSON.stringify(classMap)};`,
        ].join('\n');
      },
    },
  ],
  outputOptions: {
    entryFileNames: 'client.js',
    banner: `window.__ModuleLoader__.load({ id: ${JSON.stringify(id)}, factory: (require) => {`,
    footer: 'return module.exports; } });',
    intro: 'var module = { exports: {} }; var exports = module.exports;',
  },
});
