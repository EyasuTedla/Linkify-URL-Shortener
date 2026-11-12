import { auth } from "../auth";
import { redirect } from "next/navigation";
import { logoutAction } from "./actions";
export default async function HomePage() {
  const session = await auth();

  // Redirect unauthenticated users to login
  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-3xl font-bold">
          Welcome to Linkify!
        </h1>

        <div className="rounded-lg border p-6 space-y-3">
          <h2 className="text-xl font-semibold">
            Your Account
          </h2>

          <p>
            Name: {session.user?.name ?? "Not provided"}
          </p>

          <p>
            Email: {session.user?.email ?? "Not provided"}
          </p>

          <p>
            User ID: {session.user.id}
          </p>
        </div>

        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-md bg-black px-5 py-2 text-white"
          >
            Sign out
          </button>
        </form>
      </div>
    </main>
  );
}