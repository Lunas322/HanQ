import Link from "next/link";

import { getServerDictionary } from "@/lib/i18n/server";
import { countUnreadNotifications } from "@/lib/notifications";
import { Icon } from "./Icon";

export async function NotificationBell({ uid }: { uid: string }) {
  const [{ notification }, unread] = await Promise.all([
    getServerDictionary(),
    countUnreadNotifications(uid),
  ]);

  return (
    <Link
      href="/notifications"
      aria-label={notification.bellAria}
      className="relative flex items-center text-icon focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <Icon size="l" icon="Bell" />

      {unread > 0 && (
        <span
          role="status"
          aria-label={notification.unreadAria}
          className="absolute right-0 top-0 h-2 w-2 rounded-full bg-like"
        />
      )}
    </Link>
  );
}
