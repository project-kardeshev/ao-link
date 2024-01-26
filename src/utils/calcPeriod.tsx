export function getTimeMarginFromDate(dateString: string) {
  var dateFuture = +new Date(dateString);
  var dateNow = +new Date();

  var seconds = Math.floor((dateFuture - dateNow) / 1000);
  var minutes = Math.floor(seconds / 60);
  var hours = Math.floor(minutes / 60);
  var days = Math.floor(hours / 24);
  hours = hours - days * 24;
  minutes = minutes - days * 24 * 60 - hours * 60;
  seconds = seconds - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60;
  return `${days}d ${hours}h ${minutes}m ${seconds}s ago`;
}
