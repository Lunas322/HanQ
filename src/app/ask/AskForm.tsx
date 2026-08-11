"use client";

import { useState } from "react";

import { Button } from "../components/Button";
import { CategoryPicker } from "../components/CategoryPicker";
import { Notice } from "../components/Notice";
import { TextField } from "../components/TextField";

const TITLE_MAX = 60;
const CONTENT_MAX = 1000;

export function AskForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);

  const canSubmit =
    title.trim().length > 0 && content.trim().length > 0 && categoryId !== null;

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="flex flex-1 flex-col"
    >
      <div className="flex flex-col gap-6 px-5 pb-5 pt-4">
        <TextField
          id="title"
          label="제목"
          value={title}
          onChange={setTitle}
          maxLength={TITLE_MAX}
          placeholder="무엇이 궁금한가요?"
        />

        <TextField
          id="content"
          label="내용"
          value={content}
          onChange={setContent}
          maxLength={CONTENT_MAX}
          placeholder="한국과 어떤 점이 다른지, 배경도 함께 적어주면 좋아요"
          multiline
        />

        <CategoryPicker value={categoryId} onChange={setCategoryId} />

        <Notice emoji="🌐">
          작성한 글은 일본어로 자동 번역돼서 함께 보여져요. 원문도 그대로
          저장돼요.
        </Notice>
      </div>

      <div className="sticky bottom-0 mt-auto bg-surface px-5 pb-[18px] pt-3 shadow-[0_-4px_16px_0_rgba(25,31,40,0.06)]">
        <Button
          content="질문 등록하기"
          size="lg"
          type="submit"
          disabled={!canSubmit}
          className="w-full"
        />
      </div>
    </form>
  );
}
