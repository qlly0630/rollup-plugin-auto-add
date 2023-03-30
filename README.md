# rollup-plugin-auto-add

add content in the rollup packing process.

## Install

```bash
npm install rollup-plugin-auto-add --save-dev
```

## Usage

```js
// rollup.config.js
import rollupPluginAutoAdd from 'rollup-plugin-auto-add'

export default {
  plugins: [
    rollupPluginAutoAdd({
      include: ['src/index.tsx'],
      inject: [{ content: `import React from 'react';` }],
    }),
  ]
}
```

## Options

### inject

Type: `Inject[]`
Default: `[]`

content to be added.
adding a field allows the content to be placed at the end

```js
import rollupPluginAutoAdd, { Mode } from 'rollup-plugin-auto-add'

export default {
  plugins: [
    rollupPluginAutoAdd({
      include: ['src/index.tsx'],
      inject: [{ content: `export default Component;`, mode: Mode.end }],
    }),
  ]
}
```

you can also skip adding content when some content already exists in the target file.

```js
import rollupPluginAutoAdd from 'rollup-plugin-auto-add'

export default {
  plugins: [
    rollupPluginAutoAdd({
      // match /root/my-project/src/components/*/index.tsx
      include: [/src\/components\/(((?!\/).)+?)\/index\.tsx/gi],
      inject: [{ content: `import React from 'react';`, skip: [/import.*React.*'react';/g] }],
    }),
  ]
}
```

### include

Type: `string[]`
declare the directory of included files.

### exclude

Type: `string[]`
declare the file directories that are not included.

### show

Type: `boolean`
if need to watch which files being matched, can be set to `true`.
