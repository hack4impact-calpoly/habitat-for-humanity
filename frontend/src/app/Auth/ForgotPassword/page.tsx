"use client";
import { useState, useEffect } from "react";
import { useAuth, useSignIn, useClerk } from "@clerk/nextjs"; // Added useClerk
import { useRouter } from "next/navigation";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [activeStep, setActiveStep] = useState<"initiate" | "reset">("initiate");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { isLoaded, signIn } = useSignIn();
  const { signOut } = useClerk(); // Added signOut

  useEffect(() => {
    if (isSignedIn) router.push("/");
  }, [isSignedIn, router]);

  const initiatePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!signIn) throw new Error("Authentication system not ready");

      const passwordReset = await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });

      if (passwordReset.status === "needs_first_factor") {
        setActiveStep("reset");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Failed to initiate password reset");
    } finally {
      setIsLoading(false);
    }
  };

  const completePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!signIn) throw new Error("Authentication system not ready");

      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: resetCode,
        password: newPassword,
      });

      if (result.status === "complete") {
        // Sign out before redirecting to prevent session conflict
        await signOut();
        router.push("/Auth/Login");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Password reset failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Password Reset</h1>

      <form
        onSubmit={
          activeStep === "initiate"
            ? initiatePasswordReset
            : completePasswordReset
        }
      >
        {activeStep === "initiate" ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Enter your email"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Code"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Reset Code
              </label>
              <input
                type="text"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Enter code from email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Enter new password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default ForgotPasswordPage;