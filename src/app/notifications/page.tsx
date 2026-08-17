import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { getServerDictionary } from "@/lib/i18n/server";
import { listNotifications } from "@/lib/notifications";
import { Avatar } from "../components/Avatar";
import { MarkNotificationsRead } from "../components/MarkNotificationsRead";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect("/logout");

  const [{ notification }, notifications] = await Promise.all([
    getServerDictionary(),
    listNotifications(user.uid),
  ]);

  if (notifications.length === 0) {
    return (
      <p className="py-20 text-center text-[14px] text-tertiary">
        {notification.empty}
      </p>
    );
  }

  return (
    <>
      <MarkNotificationsRead />

      <ul className="divide-y divide-muted">
        {notifications.map((item) => (
          <li key={item.id}>
            <Link
              href={`/detail/${item.questionId}`}
              className={`flex items-start gap-3 px-5 py-4 ${
                item.read ? "bg-surface" : "bg-brand-subtle"
              }`}
            >
              <Avatar name={item.actorName} size="md" />

              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="text-[14px] font-bold text-ink">
                  {notification.message[item.type](item.actorName)}
                </p>
                <p className="truncate text-[13px] text-secondary">
                  {item.preview}
                </p>
                <span className="text-[12px] text-tertiary">{item.time}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
