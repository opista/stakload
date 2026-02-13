export const databaseSchema = {
  nested: {
    ActiveProcess: {
      fields: {
        pid: {
          id: 2,
          type: "int32",
        },
        processName: {
          id: 1,
          type: "string",
        },
        uri: {
          id: 3,
          rule: "repeated",
          type: "string",
        },
      },
    },
    BackfillProgress: {
      fields: {
        backgrounddownload: {
          id: 2,
          type: "bool",
        },
        downloadLimit: {
          id: 4,
          type: "uint64",
        },
        paused: {
          id: 3,
          type: "bool",
        },
        progress: {
          id: 1,
          type: "double",
        },
      },
    },
    BaseProductState: {
      fields: {
        backgroundDownloadAvailable: {
          id: 4,
          type: "bool",
        },
        backgroundDownloadBuildConfig: {
          id: 9,
          rule: "repeated",
          type: "BuildConfig",
        },
        backgroundDownloadComplete: {
          id: 5,
          type: "bool",
        },
        completedInstallActions: {
          id: 11,
          rule: "repeated",
          type: "string",
        },
        currentVersion: {
          id: 6,
          type: "string",
        },
        currentVersionStr: {
          id: 7,
          type: "string",
        },
        decryptionKey: {
          id: 10,
          type: "string",
        },
        installed: {
          id: 1,
          type: "bool",
        },
        installedBuildConfig: {
          id: 8,
          rule: "repeated",
          type: "BuildConfig",
        },
        playable: {
          id: 2,
          type: "bool",
        },
        updateComplete: {
          id: 3,
          type: "bool",
        },
      },
    },
    BuildConfig: {
      fields: {
        buildConfig: {
          id: 2,
          type: "string",
        },
        region: {
          id: 1,
          type: "string",
        },
      },
    },
    CachedProductState: {
      fields: {
        backfillProgress: {
          id: 2,
          type: "BackfillProgress",
        },
        baseProductState: {
          id: 1,
          type: "BaseProductState",
        },
        repairProgress: {
          id: 3,
          type: "RepairProgress",
        },
        updateProgress: {
          id: 4,
          type: "UpdateProgress",
        },
      },
    },
    Database: {
      fields: {
        activeInstalls: {
          id: 2,
          rule: "repeated",
          type: "InstallHandshake",
        },
        activeProcesses: {
          id: 3,
          rule: "repeated",
          type: "ActiveProcess",
        },
        downloadSettings: {
          id: 5,
          type: "DownloadSettings",
        },
        productConfigs: {
          id: 4,
          rule: "repeated",
          type: "ProductConfig",
        },
        productInstall: {
          id: 1,
          rule: "repeated",
          type: "ProductInstall",
        },
      },
    },
    DownloadSettings: {
      fields: {
        backfillLimit: {
          id: 2,
          options: {
            default: -1,
          },
          type: "int32",
        },
        downloadLimit: {
          id: 1,
          options: {
            default: -1,
          },
          type: "int32",
        },
      },
    },
    InstallHandshake: {
      fields: {
        product: {
          id: 1,
          type: "string",
        },
        settings: {
          id: 3,
          type: "UserSettings",
        },
        uid: {
          id: 2,
          type: "string",
        },
      },
    },
    LanguageOption: {
      values: {
        LANGOPTION_NONE: 0,
        LANGOPTION_SPEECH: 2,
        LANGOPTION_TEXT: 1,
        LANGOPTION_TEXT_AND_SPEECH: 3,
      },
    },
    LanguageSetting: {
      fields: {
        language: {
          id: 1,
          type: "string",
        },
        option: {
          id: 2,
          type: "LanguageOption",
        },
      },
    },
    LanguageSettingType: {
      values: {
        LANGSETTING_ADVANCED: 3,
        LANGSETTING_NONE: 0,
        LANGSETTING_SIMPLE: 2,
        LANGSETTING_SINGLE: 1,
      },
    },
    Operation: {
      values: {
        OP_BACKFILL: 1,
        OP_NONE: -1,
        OP_REPAIR: 2,
        OP_UPDATE: 0,
      },
    },
    ProductConfig: {
      fields: {
        metadataHash: {
          id: 2,
          type: "string",
        },
        productCode: {
          id: 1,
          type: "string",
        },
        timestamp: {
          id: 3,
          type: "string",
        },
      },
    },
    ProductInstall: {
      fields: {
        cachedProductState: {
          id: 4,
          type: "CachedProductState",
        },
        productCode: {
          id: 2,
          type: "string",
        },
        productOperations: {
          id: 5,
          type: "ProductOperations",
        },
        settings: {
          id: 3,
          type: "UserSettings",
        },
        uid: {
          id: 1,
          type: "string",
        },
      },
    },
    ProductOperations: {
      fields: {
        activeOperation: {
          id: 1,
          options: {
            default: "OP_NONE",
          },
          type: "Operation",
        },
        priority: {
          id: 2,
          type: "uint64",
        },
      },
    },
    RepairProgress: {
      fields: {
        progress: {
          id: 1,
          type: "double",
        },
      },
    },
    ShortcutOption: {
      values: {
        SHORTCUT_ALL_USERS: 2,
        SHORTCUT_NONE: 0,
        SHORTCUT_USER: 1,
      },
    },
    UpdateProgress: {
      fields: {
        discIgnored: {
          id: 3,
          type: "bool",
        },
        downloadRemaining: {
          id: 5,
          options: {
            default: 0,
          },
          type: "uint64",
        },
        lastDiscSetUsed: {
          id: 1,
          type: "string",
        },
        progress: {
          id: 2,
          type: "double",
        },
        totalToDownload: {
          id: 4,
          options: {
            default: 0,
          },
          type: "uint64",
        },
      },
    },
    UserSettings: {
      fields: {
        desktopShortcut: {
          id: 3,
          type: "ShortcutOption",
        },
        gfxOverrideTags: {
          id: 9,
          type: "string",
        },
        installPath: {
          id: 1,
          type: "string",
        },
        languages: {
          id: 8,
          rule: "repeated",
          type: "LanguageSetting",
        },
        languageSettings: {
          id: 5,
          type: "LanguageSettingType",
        },
        playRegion: {
          id: 2,
          type: "string",
        },
        selectedSpeechLanguage: {
          id: 7,
          type: "string",
        },
        selectedTextLanguage: {
          id: 6,
          type: "string",
        },
        startmenuShortcut: {
          id: 4,
          type: "ShortcutOption",
        },
        versionbranch: {
          id: 10,
          type: "string",
        },
      },
    },
  },
} as const;
