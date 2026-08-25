import type { Answer } from "@/types/answer";
import type { Question } from "@/types/question";

type Props = {
  question: Question;
  answers: Answer[];
  url: string;
};

export function QuestionJsonLd({ question, answers, url }: Props) {
  const data = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      name: question.title,
      text: question.content,
      answerCount: answers.length,
      upvoteCount: question.likeCount,
      datePublished: question.createdAt,
      url,
      author: { "@type": "Person", name: question.user.name },
      ...(answers.length > 0 && {
        suggestedAnswer: answers.map((answer) => ({
          "@type": "Answer",
          text: answer.content,
          upvoteCount: answer.likeCount,
          datePublished: answer.createdAt,
          url,
          author: { "@type": "Person", name: answer.author.name },
        })),
      }),
    },
  };

  const json = JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e");

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
  );
}
