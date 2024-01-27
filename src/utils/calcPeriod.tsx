import { formatDistanceToNowStrict, format } from "date-fns";

export function getTimeMarginFromDate(dateString: string) {
  const utcDate = new Date(dateString);
  const utcTimezoneOffsetHours = -(utcDate.getTimezoneOffset() / 60);
  const utc =utcDate.setHours(utcDate.getHours() + utcTimezoneOffsetHours);

  const distance = formatDistanceToNowStrict(utc, { addSuffix: true });
  const formattedDate = format(utc, 'MM/dd/yyyy HH:mm:ss');
  return `${distance} - ${formattedDate}`;
}
