import { createFilter } from '@rollup/pluginutils';

export const Mode = {
  front: 0,
  end: 1,
};

function core(code, originInject) {
  const frontContent = originInject[Mode.front]
    .filter(
      (injectItem) =>
        injectItem.skip?.every((skipItem) => {
          const skipItemCut = skipItem.test(code);
          skipItem.lastIndex = 0;
          return !skipItemCut;
        }) ?? true,
    )
    .map((item) => item.content)
    .join('');
  const endContent = originInject[Mode.end]
    .filter(
      (injectItem) =>
        injectItem.skip?.every((skipItem) => {
          const skipItemCut = skipItem.test(code);
          skipItem.lastIndex = 0;
          return !skipItemCut;
        }) ?? true,
    )
    .map((item) => item.content)
    .join('');
  const finalCode = `${frontContent}${code}${endContent}`;
  return finalCode;
}

export default function rollupPluginAutoAdd(options) {
  const { include = [], exclude = [], inject = [] } = options;
  const originInject = {
    [Mode.front]: [],
    [Mode.end]: [],
  };
  inject.forEach((item) => {
    const { content } = item;
    const result = {
      ...item,
      content: `${content.trim()}\n`,
    };
    if (result.mode === Mode.end) {
      originInject[Mode.end].push(result);
    } else {
      originInject[Mode.front].push(result);
    }
  });
  const stringInclude = include.filter((item) => typeof item === 'string');
  const stringExclude = exclude.filter((item) => typeof item === 'string');
  const regExpInclude = include.filter((item) => item instanceof RegExp);
  const regExpExclude = exclude.filter((item) => item instanceof RegExp);

  let targetInclude = stringInclude;
  let targetExclude = stringExclude;

  let filter = createFilter(targetInclude, targetExclude);
  let umdFilter = () => false;
  return {
    name: 'rollup-plugin-auto-add',
    options({ input, output }) {
      if (typeof input === 'string') {
        input = [input];
      }
      if (output?.[0]?.format === 'umd') {
        umdFilter = (id) => {
          const include =
            regExpInclude.length === 0
              ? true
              : regExpInclude.some((reg) => {
                  const includeCut = reg.test(id);
                  reg.lastIndex = 0;
                  return includeCut;
                });
          const exclude =
            regExpExclude.length === 0
              ? false
              : !regExpExclude.some((reg) => {
                  const excludeCut = reg.test(id);
                  reg.lastIndex = 0;
                  return excludeCut;
                });
          return include && exclude;
        };
      } else {
        const values = Object.values(input);
        const valuesInclude =
          regExpInclude.length === 0
            ? values
            : values.filter((item) =>
                regExpInclude.some((reg) => {
                  reg.lastIndex = 0;
                  return reg.test(item);
                }),
              );
        const valuesExclude =
          regExpExclude.length === 0
            ? []
            : values.filter((item) =>
                regExpExclude.some((reg) => {
                  reg.lastIndex = 0;
                  return reg.test(item);
                }),
              );
        targetInclude = [...targetInclude, ...valuesInclude];
        targetExclude = [...targetExclude, ...valuesExclude];

        filter = createFilter(targetInclude, targetExclude);
      }
    },
    transform(code, id) {
      let resultCode = code;
      if (filter(id) || umdFilter(id)) {
        resultCode = core(code, originInject);
      }
      return {
        code: resultCode,
      };
    },
  };
}
