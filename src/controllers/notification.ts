import { Notification } from "../models/notification";

export const getNotifications = async () => {
  const notifications = await Notification.findAll();
  if (!notifications) throw new Error("Notificatios not found");
  return notifications;
};
