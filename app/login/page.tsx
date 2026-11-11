
import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Welcome back
          </h1>

          <p className="text-gray-500">
            Sign in to your Linkify account.
          </p>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}
