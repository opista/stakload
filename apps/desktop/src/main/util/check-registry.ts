import Registry from "winreg";

export const checkRegistry = ({ hive, key, name }: { hive: string; key: string; name: string }): Promise<string> => {
  const reg = new Registry({
    hive,
    key,
  });

  return new Promise((resolve, reject) => {
    reg.get(name, (err, item) => {
      if (err) return reject(err);
      resolve(item?.value);
    });
  });
};
