import { Header } from "@/app/components/Header";
import { DeleteMenu } from "@/app/components/DeleteMenu";
import { getCurrentUser } from "@/lib/auth";
import { getServerDictionary } from "@/lib/i18n/server";
import { getQuestion } from "@/lib/questions";
import { isLanguage } from "@/types/language";
import { deleteQuestionAction } from "./_actions/delete";
import React from "react";

type Props = {
    children: React.ReactNode
    params: Promise<{ lang: string; id: string }>
}

export default async function detailLayout ({children, params}:Props) {
    const { lang, id } = await params;
    const language = isLanguage(lang) ? lang : "ko";

    const [{ detail }, user, question] = await Promise.all([
      getServerDictionary(),
      getCurrentUser(),
      getQuestion(id, language),
    ]);

    const isAuthor = user !== null && question?.user.id === user.uid;

    return (
  <>
      <div className="sticky top-0 z-50">
        <Header mainIcon="ChevronLeft" title={detail.headerTitle}>
          {isAuthor && (
            <DeleteMenu
              target="question"
              onDelete={deleteQuestionAction.bind(null, id)}
            />
          )}
        </Header>
      </div>

      <main id="main" tabIndex={-1} className="flex-1 bg-muted ">{children}</main>
      </>
    )
}
