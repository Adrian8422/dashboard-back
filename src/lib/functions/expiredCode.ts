import { isAfter } from "date-fns";

export const expiredCode = async (dateCode: Date) => {
  const now = new Date();
  console.log("DATECODE", dateCode);

  const response = isAfter(now, new Date(dateCode));
  console.log("RESPOUNSEEEE", response);
  return response;
};
