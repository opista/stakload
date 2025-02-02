/* eslint-disable @typescript-eslint/no-explicit-any */

export function IpcHandle(channel: string) {
  return function (target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const constructor = target.constructor;

    // Wrap the original method to skip the event parameter
    descriptor.value = function (...args: any[]) {
      // Remove the first argument (event) before calling the original method
      return originalMethod.apply(this, args.slice(1));
    };

    if (!constructor._ipcHandlers) {
      constructor._ipcHandlers = [];
    }

    constructor._ipcHandlers.push({
      channel,
      handler: descriptor.value,
      type: "handle",
    });

    return descriptor;
  };
}

export function IpcOn(channel: string) {
  return function (target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const constructor = target.constructor;

    // Wrap the original method to skip the event parameter
    descriptor.value = function (...args: any[]) {
      // Remove the first argument (event) before calling the original method
      return originalMethod.apply(this, args.slice(1));
    };

    if (!constructor._ipcHandlers) {
      constructor._ipcHandlers = [];
    }

    constructor._ipcHandlers.push({
      channel,
      handler: descriptor.value,
      type: "on",
    });

    return descriptor;
  };
}
