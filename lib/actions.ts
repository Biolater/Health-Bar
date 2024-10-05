"use server";
import { revalidatePath } from "next/cache";

const revalidateAfterLike = (postId: string) => {
  revalidatePath(`/p/${postId}`);
};

export { revalidateAfterLike };
