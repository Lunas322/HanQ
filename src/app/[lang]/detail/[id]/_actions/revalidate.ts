import { revalidatePath } from "next/cache";

export function revalidateQuestion(questionId: string): void {
  revalidatePath(`/detail/${questionId}`);
  revalidatePath("/home");
  revalidatePath("/my");
}
