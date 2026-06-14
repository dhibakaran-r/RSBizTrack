import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
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

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await login({ email, password });
      localStorage.setItem("token", response.access_token);

      await dispatch(fetchCurrentUser());

      toast.success("Login successful!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Invalid email or password");
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
        {/* <h1
          className="text-2xl font-bold mb-1"
          style={{ color: "var(--color-primary-900)" }}
        >
          RSBizTrack
        </h1> */}
        <div className="w-40">
          <img src={logo} alt="logo" />
        </div>
        {/* <p className="text-sm mb-6" style={{ color: "var(--color-gray-400)" }}>
          Sign in to your account
        </p> */}

        <div className="w-full flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
            style={{
              border: "1px solid var(--color-gray-200)",
              color: "var(--color-gray-800)",
            }}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
            style={{
              border: "1px solid var(--color-gray-200)",
              color: "var(--color-gray-800)",
            }}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleLogin}
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
        </div>
      </div>
    </div>
  );
};

export default Login;
