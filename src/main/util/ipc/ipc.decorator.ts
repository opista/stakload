/* eslint-disable @typescript-eslint/no-explicit-any */
import { AsyncLocalStorage } from "async_hooks";
import { randomUUID } from "crypto";

interface IpcDecoratorOptions {
  rawEvent?: boolean;
}

export const correlationStorage = new AsyncLocalStorage<string>();

const ipcHandler = (type: "handle" | "on") => (channel: string, options?: IpcDecoratorOptions) => {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const constructor = target.constructor;
    const methodName = `${constructor.name}.${propertyKey}`;

    const wrappedMethod = async function (this: any, ...args: any[]) {
      const correlationId = randomUUID();
      const existingCorrelationId = correlationStorage.getStore();

      if (existingCorrelationId) {
        throw new Error(
          `Correlation ID already exists: ${existingCorrelationId} when handling IPC ${methodName}. This indicates a potential async context leak.`,
        );
      }

      return await correlationStorage.run(correlationId, async () => {
        const currentId = correlationStorage.getStore();
        if (currentId !== correlationId) {
          throw new Error(`Correlation ID mismatch in ${methodName}. Expected: ${correlationId}, Got: ${currentId}`);
        }

        const methodArgs = options?.rawEvent ? args : args.slice(1);
        return await originalMethod.apply(this, methodArgs);
      });
    };

    descriptor.value = wrappedMethod;

    if (!constructor._ipcHandlers) {
      constructor._ipcHandlers = [];
    }

    constructor._ipcHandlers.push({
      channel,
      handler: wrappedMethod,
      type,
    });

    return descriptor;
  };
};

export const IpcHandle = ipcHandler("handle");
export const IpcOn = ipcHandler("on");
