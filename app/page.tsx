import { redirect } from "next/navigation";
import { loginAction } from "@/lib/actions";
import { readSession } from "@/lib/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await readSession()) redirect("/dashboard");
  const params = await searchParams;
  return (
    <div className="login-page">
      <form className="login-card" action={loginAction}>
        <h1>Shop POS</h1>
        <p>Sign in with your shop username and password to view records from anywhere.</p>
        {params.error ? (
          <div className="error">Invalid username or password.</div>
        ) : null}
        <label>
          Username
          <input name="username" autoComplete="username" required />
        </label>
        <label>
          Password
          <input name="password" type="password" autoComplete="current-password" required />
        </label>
        <button type="submit">Sign in</button>
      </form>
    </div>
  );
}
