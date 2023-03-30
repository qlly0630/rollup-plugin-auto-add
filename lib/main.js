export const PLUGIN_NAME = 'rollup-plugin-auto-add';

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
  const { include = [], exclude = [], inject = [], show = false } = options;
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

  const regRegExpInclude = include.map((item) => {
    if (item instanceof RegExp) {
      return item;
    }
    return new RegExp(item);
  });
  const regRegExpExclude = exclude.map((item) => {
    if (item instanceof RegExp) {
      return item;
    }
    return new RegExp(item);
  });

  const filter = (id) => {
    const include =
      regRegExpInclude.length === 0
        ? false
        : regRegExpInclude.some((reg) => {
            const includeCut = reg.test(id);
            reg.lastIndex = 0;
            return includeCut;
          });
    const exclude =
      regRegExpExclude.length === 0
        ? false
        : !regRegExpExclude.some((reg) => {
            const excludeCut = reg.test(id);
            reg.lastIndex = 0;
            return excludeCut;
          });
    return include && !exclude;
  };

  return {
    name: PLUGIN_NAME,
    options() {},
    transform(code, id) {
      let resultCode = code;
      const needTransform = filter(id);
      show && console.log(`[${PLUGIN_NAME}] ${id} -> ${needTransform}`);
      if (needTransform) {
        resultCode = core(code, originInject);
      }
      return {
        code: resultCode,
      };
    },
  };
}
