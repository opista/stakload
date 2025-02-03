/* eslint-disable @typescript-eslint/no-explicit-any */

interface IpcDecoratorOptions {
  rawEvent?: boolean;
}

const ipcHandler = (type: "handle" | "on") => (channel: string, options?: IpcDecoratorOptions) => {
  return function (target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const constructor = target.constructor;

    descriptor.value = function (...args: any[]) {
      const methodArgs = options?.rawEvent ? args : args.slice(1);
      return originalMethod.apply(this, methodArgs);
    };

    if (!constructor._ipcHandlers) {
      constructor._ipcHandlers = [];
    }

    constructor._ipcHandlers.push({
      channel,
      handler: descriptor.value,
      type,
    });

    return descriptor;
  };
};

export const IpcHandle = ipcHandler("handle");
export const IpcOn = ipcHandler("on");
