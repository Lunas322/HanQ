import { Header } from "@/app/components/Header";
import { LanguageToggle } from "@/app/components/LanguageToggle";
import { DeleteMenu } from "@/app/components/DeleteMenu";
import { getCurrentUser } from "@/lib/auth";
import { getServerDictionary } from "@/lib/i18n/server";
import { getQuestion } from "@/lib/questions";
import { deleteQuestionAction } from "./_actions/delete";
import React from "react";

type Props = {
    children: React.ReactNode
    params: Promise<{ id: string }>
}

export default async function detailLayout ({children, params}:Props) {
    const { id } = await params;

    const [{ detail }, user, question] = await Promise.all([
      getServerDictionary(),
      getCurrentUser(),
      getQuestion(id),
    ]);

    const isAuthor = user !== null && question?.user.id === user.uid;

    return (
  <>
      <div className="sticky top-0 z-50">
        <Header mainIcon="ChevronLeft" title={detail.headerTitle}>
          <LanguageToggle />
          {isAuthor && (
            <DeleteMenu
              target="question"
              onDelete={deleteQuestionAction.bind(null, id)}
            />
          )}
        </Header>
      </div>

      <main className="flex-1 bg-muted ">{children}</main>
      </>
    )
}
