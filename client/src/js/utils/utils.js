import tweenr from 'tweenr'

import moment from 'moment'

export const Tweenr = tweenr()

export const ComponentUIDataRef = {
  AppContent: "data-ui-ref",
  NavigationContainer: "data-ui-ref",
}

export const MOMEMT = {
  mdy: (date, seperator = "/") => {
    return `${moment(date).month()}${seperator}${moment(date).day()}${seperator}${moment(date).year()}`
  },
  year: (date) => {
    return moment(date).year()
  },
  month: (date) => {
    return moment(date).month()
  },
  day: (date) => {
    return moment(date).day()
  },
}

export const CONSTANTS = {
  TABLE_HEADER_WIDTH: 65
}

export function downloadCSV(csvString, filename) {
  var blob = new Blob([csvString]);
  if (window.navigator.msSaveOrOpenBlob) // IE hack; see http://msdn.microsoft.com/en${seperator}us/library/ie/hh779016.aspx
    window.navigator.msSaveBlob(blob, `${filename}.csv`);
  else {
    var a = window.document.createElement("a");
    a.href = window.URL.createObjectURL(blob, { type: "text/plain" });
    a.download = `${filename}.csv`;
    document.body.appendChild(a);
    a.click(); // IE: "Access is denied"; see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
    document.body.removeChild(a);
  }
}
