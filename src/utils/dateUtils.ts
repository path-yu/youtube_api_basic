// utils/dateUtils.ts
export function getPublishedAfter(filter: string): string | undefined {
  const now = new Date();
  let publishedAfter: string | undefined;

  switch (filter) {
    case "lastHour":
      publishedAfter = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
      break;
    case "today":
      publishedAfter = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
      ).toISOString();
      break;
    case "thisWeek":
      publishedAfter = new Date(
        now.getTime() - 7 * 24 * 60 * 60 * 1000
      ).toISOString();
      break;
    case "thisMonth":
      publishedAfter = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)
      ).toISOString();
      break;
    case "thisYear":
      publishedAfter = new Date(
        Date.UTC(now.getUTCFullYear(), 0, 1)
      ).toISOString();
      break;
    default:
      publishedAfter = undefined;
  }

  return publishedAfter;
}
