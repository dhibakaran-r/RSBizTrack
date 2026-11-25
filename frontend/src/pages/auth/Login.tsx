import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { login } from "@/api/modules/authApi";
import { useAppDispatch } from "@/store/hooks";
import { fetchCurrentUser } from "@/store/slices/authSlice";
import logo from "@/assets/rsbiztrackLogo.png";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await login({ email, password });

      localStorage.setItem("token", response.access_token);

      try {
        await dispatch(fetchCurrentUser()).unwrap();

        toast.success("Login successful!");
        navigate("/");
      } catch (error: unknown) {
        const message =
          typeof error === "object" &&
          error !== null &&
          "message" in error &&
          typeof error.message === "string"
            ? error.message
            : "Unable to verify your account. Please try again.";

        toast.error(message);

        // For temporary errors, show the ProtectedRoute retry screen.
        // For 401, the Axios interceptor has already removed the token.
        if (localStorage.getItem("token")) {
          navigate("/");
        }
      }
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.detail
        : undefined;

      toast.error(
        typeof message === "string"
          ? message
          : "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "var(--color-gray-50)" }}
    >
      <div
        className="flex flex-col items-center justify-center gap-8 bg-white p-8 rounded-xl w-full max-w-md"
        style={{
          border: "1px solid var(--color-gray-200)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        <div className="w-40">
          <img src={logo} alt="logo" />
        </div>

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
            style={{
              border: "1px solid var(--color-gray-200)",
              color: "var(--color-gray-800)",
            }}
          />

          <input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
            style={{
              border: "1px solid var(--color-gray-200)",
              color: "var(--color-gray-800)",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-sm font-medium text-white cursor-pointer"
            style={{
              background: loading
                ? "var(--color-primary-500)"
                : "var(--color-primary-600)",
              border: "none",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
