"use client";
import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Brand } from "../../components/shell";
import { Icon } from "../../components/icon";
import { createClient, authRedirect } from "../../lib/supabase/client";
import { DocumentPreview } from "../../components/document-preview";
import { sampleContent } from "../../lib/documents";
type Mode = "signin" | "signup" | "reset" | "update";
function friendlyError(message: string) {
  if (/email address not authorized|email.*not.*allowed/i.test(message))
    return "Email delivery is not available for this address yet. The site owner needs to finish the email service setup. You can still use the builder without an account.";
  if (/rate limit/i.test(message))
    return "Too many requests. Please wait before trying again. Your browser drafts are still available.";
  return message;
}
export default function Login() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [verification, setVerification] = useState(false);
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const hash = new URLSearchParams(location.hash.slice(1));
    const recovering = hash.get("type") === "recovery";
    if (recovering) setMode("update");
    else if (query.get("mode") === "signup") setMode("signup");
    if (hash.get("error_description"))
      setError(hash.get("error_description")!.replace(/\+/g, " "));
    const client = createClient();
    const { data } = client.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setMode("update");
    });
    client.auth.getSession().then(({ data, error }) => {
      if (error) setError(error.message);
      else if (data.session && !recovering) router.replace("/dashboard");
    });
    return () => data.subscription.unsubscribe();
  }, [router]);
  function switchMode(next: Mode) {
    setMode(next);
    setMessage("");
    setError("");
    setPassword("");
    setConfirm("");
    setVerification(false);
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    const client = createClient();
    try {
      if ((mode === "signup" || mode === "update") && password !== confirm)
        throw new Error("The passwords do not match.");
      if (mode === "signin") {
        const { error } = await client.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        router.replace("/dashboard");
      }
      if (mode === "signup") {
        const { data, error } = await client.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: name.trim() },
            emailRedirectTo: authRedirect(),
          },
        });
        if (error) throw error;
        if (data.session) router.replace("/dashboard");
        else {
          setVerification(true);
          setMessage(
            "Check your email for a confirmation link. After confirming, return here to sign in. If you already have an account, sign in or reset your password.",
          );
          setPassword("");
          setConfirm("");
        }
      }
      if (mode === "reset") {
        const { error } = await client.auth.resetPasswordForEmail(
          email.trim(),
          { redirectTo: authRedirect() },
        );
        if (error) throw error;
        setMessage(
          "If a matching account can receive email, a password reset link has been requested. Check your inbox and spam folder.",
        );
      }
      if (mode === "update") {
        const { error } = await client.auth.updateUser({ password });
        if (error) throw error;
        router.replace("/dashboard");
      }
    } catch (e) {
      setError(
        friendlyError(
          e instanceof Error
            ? e.message
            : "Unable to connect. Please try again.",
        ),
      );
    } finally {
      setBusy(false);
    }
  }
  async function resend() {
    setBusy(true);
    setError("");
    try {
      const { error } = await createClient().auth.resend({
        type: "signup",
        email: email.trim(),
        options: { emailRedirectTo: authRedirect() },
      });
      if (error) throw error;
      setMessage(
        "A confirmation email has been requested. Please check your inbox.",
      );
    } catch (e) {
      setError(
        friendlyError(e instanceof Error ? e.message : "Unable to resend."),
      );
    } finally {
      setBusy(false);
    }
  }
  const titles = {
    signin: "Welcome back.",
    signup: "Your next chapter starts here.",
    reset: "Let’s get you back in.",
    update: "Choose a new password.",
  };
  return (
    <main id="main" className="auth-page">
      <section className="auth-form-side">
        <Brand />
        <div className="auth-form-wrap">
          <span className="eyebrow">YOUR VITAPATH ACCOUNT</span>
          <h1>{titles[mode]}</h1>
          <p>
            {mode === "signup"
              ? "Save your documents in one place and return whenever inspiration strikes."
              : mode === "signin"
                ? "Sign in to pick up where you left off."
                : "Keep access to your application documents."}
          </p>
          {message && (
            <div className="notice success" role="status">
              {message}
            </div>
          )}
          {error && (
            <div className="notice error" role="alert">
              {error}
            </div>
          )}
          <form onSubmit={submit} className="auth-form">
            {mode === "signup" && (
              <label>
                Full name
                <input
                  required
                  autoComplete="name"
                  maxLength={120}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
            )}
            {mode !== "update" && (
              <label>
                Email address
                <input
                  required
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
            )}
            {mode !== "reset" && (
              <>
                <label>
                  Password
                  <div className="password-field">
                    <input
                      aria-label="Password"
                      required
                      type={show ? "text" : "password"}
                      autoComplete={
                        mode === "signin" ? "current-password" : "new-password"
                      }
                      minLength={mode === "signin" ? 1 : 8}
                      maxLength={128}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      aria-label={show ? "Hide password" : "Show password"}
                      onClick={() => setShow(!show)}
                    >
                      {show ? "Hide" : "Show"}
                    </button>
                  </div>
                  {mode !== "signin" && (
                    <small>
                      Use at least 8 characters. A long, unique password is
                      best.
                    </small>
                  )}
                </label>
                {(mode === "signup" || mode === "update") && (
                  <label>
                    Confirm password
                    <input
                      required
                      type="password"
                      autoComplete="new-password"
                      minLength={8}
                      maxLength={128}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                    />
                  </label>
                )}
              </>
            )}
            {mode === "signin" && (
              <button
                className="text-button align-right"
                type="button"
                onClick={() => switchMode("reset")}
              >
                Forgot password?
              </button>
            )}
            <button className="button full" disabled={busy}>
              {busy
                ? "Please wait…"
                : mode === "signin"
                  ? "Sign in"
                  : mode === "signup"
                    ? "Create account"
                    : mode === "reset"
                      ? "Send reset link"
                      : "Update password"}
              <Icon name="arrow" size={18} />
            </button>
          </form>
          {verification && (
            <button className="text-button" disabled={busy} onClick={resend}>
              Resend confirmation email
            </button>
          )}
          <p className="auth-switch">
            {mode === "signin" ? (
              <>
                New to VitaPath?{" "}
                <button onClick={() => switchMode("signup")}>
                  Create an account
                </button>
              </>
            ) : (
              <button onClick={() => switchMode("signin")}>
                Back to sign in
              </button>
            )}
          </p>
          <p className="auth-privacy">
            By using an account, you acknowledge our{" "}
            <Link href="/privacy">privacy information</Link>. Only save personal
            data you intend to store.
          </p>
          <div className="auth-divider">
            <span>or start with a browser draft</span>
          </div>
          <Link className="button secondary full" href="/builder">
            Continue without an account
          </Link>
        </div>
        <Link href="/" className="text-link">
          ← Back to VitaPath
        </Link>
      </section>
      <aside className="auth-art">
        <span className="eyebrow">A WORLD OF POSSIBILITIES</span>
        <h2>
          Big ambitions.
          <br />
          <em>Better beginnings.</em>
        </h2>
        <div className="auth-paper">
          <DocumentPreview
            content={sampleContent("modern")}
            kind="resume"
            mini
          />
        </div>
        <p>
          Your experience. Your voice.
          <br />A thoughtful space to bring them together.
        </p>
        <span className="quiet">Fictional example document</span>
      </aside>
    </main>
  );
}
