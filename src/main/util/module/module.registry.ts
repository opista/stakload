import { Container } from "typedi";

export class ModuleRegistry {
  private static registeredProviders = new Set<string>();

  static async register(moduleClass: any) {
    console.log("\n=== Starting Module Registration ===");
    console.log(`Registering module: ${moduleClass.name}`);

    const providers = Reflect.getMetadata("module:providers", moduleClass) || [];
    const imports = Reflect.getMetadata("module:imports", moduleClass) || [];
    const exports = Reflect.getMetadata("module:exports", moduleClass) || [];

    console.log("\nModule Metadata:");
    console.log(
      "Providers:",
      providers.map((p) => p.name),
    );
    console.log(
      "Imports:",
      imports.map((i) => i.name),
    );
    console.log(
      "Exports:",
      exports.map((e) => e.name),
    );

    // Register imported modules first
    for (const importedModule of imports) {
      await this.register(importedModule);
    }

    // Register providers
    console.log("\nRegistering Providers:");
    for (const provider of providers) {
      const providerName = provider.name;
      if (!this.registeredProviders.has(providerName)) {
        try {
          console.log(`\nAttempting to register ${providerName}`);
          console.log("Provider class:", provider);

          // Get instance from Container
          const instance = Container.get(provider);
          console.log("Created instance:", instance);
          console.log("Instance constructor:", instance.constructor.name);

          // Register in container
          Container.set(provider, instance);
          Container.set(providerName, instance);

          // Verify registration
          const retrievedInstance = Container.get(provider);
          console.log("Retrieved instance:", retrievedInstance);
          console.log("Retrieved instance constructor:", retrievedInstance.constructor.name);

          this.registeredProviders.add(providerName);
          console.log(`Successfully registered ${providerName}`);
        } catch (error) {
          console.error(`Failed to register ${providerName}:`, error);
          console.error("Error stack:", error.stack);
        }
      } else {
        console.log(`Provider ${providerName} already registered`);
      }
    }

    // Register exports
    console.log("\nRegistering Exports:");
    for (const exportProvider of exports) {
      const exportName = exportProvider.name;
      if (!this.registeredProviders.has(exportName)) {
        try {
          console.log(`\nAttempting to register export ${exportName}`);
          const instance = Container.get(exportProvider);
          Container.set(exportName, instance);
          this.registeredProviders.add(exportName);
          console.log(`Successfully registered export ${exportName}`);
        } catch (error) {
          console.error(`Failed to register export ${exportName}:`, error);
        }
      } else {
        console.log(`Export ${exportName} already registered`);
      }
    }

    console.log("\n=== Module Registration Complete ===\n");
  }
}
