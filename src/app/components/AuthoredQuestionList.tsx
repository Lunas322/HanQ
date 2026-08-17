import { listAnsweredQuestionIds } from "@/lib/answers";
import { findCategory } from "@/lib/categories";
import { getServerDictionary } from "@/lib/i18n/server";
import { getQuestionsByIds, listQuestions } from "@/lib/questions";
import { QuestionCard } from "./QuestionCard";

type Props = {
  uid: string;
  isAnswerTab: boolean;
};

export async function AuthoredQuestionList({ uid, isAnswerTab }: Props) {
  const dictionary = await getServerDictionary();

  const questions = isAnswerTab
    ? await getQuestionsByIds(await listAnsweredQuestionIds(uid))
    : await listQuestions({ authorId: uid });

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
          />
        </li>
      ))}
    </ul>
  );
}
