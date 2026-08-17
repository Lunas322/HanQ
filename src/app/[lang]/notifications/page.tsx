import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { getServerDictionary } from "@/lib/i18n/server";
import { getCurrentLanguage } from "@/lib/locale";
import { listNotifications } from "@/lib/notifications";
import { localePath } from "@/lib/routes";
import { Avatar } from "@/app/components/Avatar";
import { MarkNotificationsRead } from "@/app/components/MarkNotificationsRead";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect("/logout");

  const [{ notification }, notifications, language] = await Promise.all([
    getServerDictionary(),
    listNotifications(user.uid),
    getCurrentLanguage(),
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
              href={localePath(language, `/detail/${item.questionId}`)}
              className={`flex items-start gap-3 px-5 py-4 ${
                item.read ? "bg-surface" : "bg-brand-subtle"
              }`}
            >
              <Avatar
                name={item.actorName}
                size="md"
                photoUrl={item.actorPhotoUrl}
              />

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
