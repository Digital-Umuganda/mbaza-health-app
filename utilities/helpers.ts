import { kinyarwandaMonths } from "@/constants/months";
import { ConversationResponse } from "@/types/conversation";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import duration from "dayjs/plugin/duration";
import isBetween from "dayjs/plugin/isBetween";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(localizedFormat);
dayjs.extend(duration);
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.extend(isBetween);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

export const appDayjs = dayjs;

export function formatKinyarwandaDate(dateString: string): string {
  const date = dayjs(dateString);
  const day = date.date();
  const month = kinyarwandaMonths[date.month()]; // month() is 0-indexed
  const year = date.year();
  return `${day} ${month} ${year}`;
}

export const getStatusInfo = (
  conversation: ConversationResponse,
  minDays = 4,
  maxDays = 14
) => {
  const date = appDayjs(conversation.created_at);
  const today = appDayjs();
  const diffInDays = date.diff(today, "day");

  const days = Math.abs(diffInDays);

  if (days >= minDays && days <= maxDays && !conversation.follow_up_info) {
    return {
      status: "Ikiganiro gikeneye gukurikiranwa nyuma y’iminsi 5",
      statusType: "pending_5days" as const,
      color: "#ff9800",
      days,
    };
  }
  if (days > maxDays && !conversation.follow_up_info) {
    return {
      status: "Ikiganiro gikeneye gukurikiranwa nyuma y’iminsi 14",
      statusType: "pending_14days" as const,
      color: "#ff9800",
      days,
    };
  }

  if (
    conversation.follow_up_info &&
    conversation.follow_up_info.follow_up_status === "followed_up_5days"
  ) {
    return {
      status: "Ikiganiro cyakurikiranwe  nyuma y’iminsi 5",
      statusType: "followed_up_5days" as const,
      color: "#2196f3",
      days,
    };
  }

  if (
    conversation.follow_up_info &&
    conversation.follow_up_info.follow_up_status === "followed_up_14days"
  ) {
    return {
      status: "Ikiganiro cyakurikiranwe  nyuma y’iminsi 14",
      statusType: "followed_up_14days" as const,
      color: "#2196f3",
      days,
    };
  }


  if (days < minDays && !conversation.follow_up_info) {
    return {
      status: "Ikiganiro cyatanzwe",
      statusType: "completed" as const,
      color: "#4caf50",
      days,
    };
  }

  return {
    status: "Ikiganiro kitariho amakuru",
    statusType: "completed" as const,
    color: "#666",
    days,
  };
};
