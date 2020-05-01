import {
  ChronoUnit,
  DateTimeFormatter,
  Duration,
  LocalDate,
  LocalDateTime,
  TemporalAdjusters,
  ZonedDateTime
} from "@js-joda/core";
import { Locale } from "@js-joda/locale_en-us";
console.log(Locale);
export const date_with_slashes_pattern = "MM/dd/YYYY";
export const regular_time_pattern = "h:mm a";
export const military_time_pattern = "H:mm";
export const military_time_pattern_double = "HH:mm";
export const month_with_day_pattern = "MMMM d";
export const hours_pattern = "HH";
export const minutes_pattern = "mm";
export const pretty_day_pattern = "EE";
export const month_pattern = "MM";
export const day_pattern = "dd";
export const year_pattern = "YYYY";
export const date_pattern = "YYYY-MM-dd";
//export const request_pattern = "YYYY-MM-DDTHH:mm:ss";
export const date_with_slashes_formatter = DateTimeFormatter.ofPattern(
  date_with_slashes_pattern
).withLocale(Locale.ENGLISH);
export const date_with_military_time_formatter = DateTimeFormatter.ofPattern(
  date_with_slashes_pattern + " @ " + military_time_pattern
).withLocale(Locale.ENGLISH);
export const date_with_regular_time_formatter = DateTimeFormatter.ofPattern(
  date_with_slashes_pattern + " @ " + regular_time_pattern
).withLocale(Locale.ENGLISH);
export const military_time_formatter = DateTimeFormatter.ofPattern(
  military_time_pattern
);
export const military_time_double_formatter = DateTimeFormatter.ofPattern(
  military_time_pattern_double
);
export const regular_time_formatter = DateTimeFormatter.ofPattern(
  regular_time_pattern
);
export const hours_formatter = DateTimeFormatter.ofPattern(hours_pattern);
export const minutes_formatter = DateTimeFormatter.ofPattern(minutes_pattern);
export const month_formatter = DateTimeFormatter.ofPattern(
  month_pattern
).withLocale(Locale.ENGLISH);
export const pretty_day_formatter = DateTimeFormatter.ofPattern(
  pretty_day_pattern
).withLocale(Locale.ENGLISH);
export const year_formatter = DateTimeFormatter.ofPattern(
  year_pattern
).withLocale(Locale.ENGLISH);
export const day_formatter = DateTimeFormatter.ofPattern(
  day_pattern
).withLocale(Locale.ENGLISH);
export const month_with_day_formatter = DateTimeFormatter.ofPattern(
  month_with_day_pattern
).withLocale(Locale.ENGLISH);
export const date_formatter = DateTimeFormatter.ofPattern(
  date_pattern
).withLocale(Locale.ENGLISH);

export function _formatHHMM(datetime) {
  return datetime.format(military_time_double_formatter);
}

export function _formatTime(datetime, am_pm) {
  if (am_pm) {
    return datetime.format(regular_time_formatter);
  } else {
    if (typeof datetime === "string") datetime = LocalDateTime.parse(datetime);
    return datetime.format(military_time_formatter);
  }
}

export function _formatDate(datetime, am_pm) {
  if (am_pm) {
    return datetime.format(date_with_regular_time_formatter);
  } else {
    return datetime.format(date_with_military_time_formatter);
  }
}

export function _formatDateOnly(datetime, am_pm) {
  if (am_pm) {
    return datetime.format(date_with_slashes_formatter);
  } else {
    return datetime.format(date_with_slashes_formatter);
  }
}
