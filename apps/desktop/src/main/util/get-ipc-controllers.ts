import { Constructor, isIpcController } from "@electron-ipc-bridge/core";
import { INestApplicationContext } from "@nestjs/common";
import { ModulesContainer } from "@nestjs/core";

export const getIpcControllers = (app: INestApplicationContext) => {
  const modulesContainer = app.get(ModulesContainer);
  const controllers: Constructor[] = [];

  const modules = [...modulesContainer.values()];
  for (const module of modules) {
    const moduleControllers = [...module.controllers.values()];
    for (const wrapper of moduleControllers) {
      if (wrapper.metatype && isIpcController(wrapper.metatype)) {
        controllers.push(wrapper.metatype);
      }
    }
  }

  return controllers;
};
