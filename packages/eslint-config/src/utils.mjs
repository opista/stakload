const mergeFiles = (files, configFiles) => {
  if (!configFiles?.length) {
    return files;
  }

  return [...new Set([...files, ...configFiles])];
};

const asConfigArray = (configs) => (Array.isArray(configs) ? configs : [configs]);

export const scopeConfigs = (configs, { basePath, files } = {}) =>
  asConfigArray(configs).map((config) => {
    const nextConfig = { ...config };

    if (basePath) {
      nextConfig.basePath = basePath;
    }

    if (files?.length) {
      nextConfig.files = mergeFiles(files, config.files);
    }

    return nextConfig;
  });
