export function formatTime(
  timeFormatter: Intl.DateTimeFormat,
  dateString?: string,
) {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "";
  return timeFormatter.format(d);
}
