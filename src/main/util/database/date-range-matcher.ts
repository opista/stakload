import { DateFilter, DateRange } from "@contracts/database/games";

const mapCustomDateRangeFilter = (dateRange: DateRange) => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfDay);
  startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  switch (dateRange) {
    case "ONE_DAY": {
      const gte = new Date(now);
      gte.setDate(now.getDate() - 1);
      return { $gte: gte };
    }
    case "ONE_WEEK": {
      const gte = new Date(now);
      gte.setDate(now.getDate() - 7);
      return { $gte: gte };
    }
    case "ONE_MONTH": {
      const gte = new Date(now);
      gte.setDate(now.getDate() - 30);
      return { $gte: gte };
    }
    case "ONE_YEAR": {
      const gte = new Date(now);
      gte.setFullYear(now.getFullYear() - 1);
      return { $gte: gte };
    }
    case "TODAY": {
      return { $gte: startOfDay };
    }
    case "THIS_WEEK": {
      return { $gte: startOfWeek };
    }
    case "THIS_MONTH": {
      return { $gte: startOfMonth };
    }
    case "THIS_YEAR": {
      return { $gte: startOfYear };
    }
    default:
      return undefined;
  }
};

export const dateRangeMatcher = (field: string, input?: DateFilter) => {
  if (!input) return {};

  const { dateRange, endDate, startDate } = input;

  if (dateRange === "CUSTOM") {
    return {
      [field]: { $gte: startDate, $lte: endDate },
    };
  }

  return {
    [field]: mapCustomDateRangeFilter(dateRange),
  };
};
