import { listAnsweredQuestionIds } from "@/lib/answers";
import { findCategory } from "@/lib/categories";
import { getDictionary } from "@/lib/i18n";
import type { Language } from "@/types/language";
import { getQuestionsByIds, listQuestions } from "@/lib/questions";
import { QuestionCard } from "./QuestionCard";

type Props = {
  uid: string;
  isAnswerTab: boolean;
  language: Language;
};

export async function AuthoredQuestionList({
  uid,
  isAnswerTab,
  language,
}: Props) {
  const dictionary = getDictionary(language);

  const questions = isAnswerTab
    ? await getQuestionsByIds(await listAnsweredQuestionIds(uid), language)
    : await listQuestions(language, { authorId: uid });

  if (questions.length === 0) {
    return (
      <p className="py-16 text-center text-[14px] text-tertiary">
        {isAnswerTab
          ? dictionary.my.emptyAnswers
          : dictionary.my.emptyQuestions}
      </p>
    );
  }

  return (
    <ul>
      {questions.map((question) => (
        <li key={question.id}>
          <QuestionCard
            question={question}
            category={findCategory(question.categoryId)}
            language={language}
          />
        </li>
      ))}
    </ul>
  );
}
