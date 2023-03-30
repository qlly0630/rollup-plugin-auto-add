# rollup-plugin-auto-add

rollup构建时添加内容到文件内

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

需要被添加的内容

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

当一些内容已经存在于目标文件中时，你也可以跳过添加。

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
声明包含文件的目录。

### exclude

Type: `string[]`
声明不包括的文件目录。

### show

Type: `boolean`
如果需要观察哪些文件被匹配，可以设置为`true`。
