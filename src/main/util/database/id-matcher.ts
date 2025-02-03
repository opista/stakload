export const idMatcher = (field: string, ids?: string[]) =>
  ids?.length
    ? {
        [field]: {
          $elemMatch: {
            id: { $in: ids },
          },
        },
      }
    : {};
