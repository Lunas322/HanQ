export const NOTICE_COOKIE_NAME = "hanq-notice-seen";

export const NOTICE_COOKIE_MAX_AGE = 60 * 60 * 24 * 180;

export type Notice = {
  id: string;
  message: string;
};
