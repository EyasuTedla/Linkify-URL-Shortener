
"use server";

import { signIn } from "../../auth";
import { AuthError } from "next-auth";

export async function loginAction(
  prevState: { error: string | null },
  formData: FormData
) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/",
    });

    return { error: null };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error: "Invalid email or password.",
      };
    }

    throw error;
  }
}
