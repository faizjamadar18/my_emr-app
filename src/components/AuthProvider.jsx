import React, { useState } from "react";
import { Shield, Loader2, CheckCircle } from "lucide-react";

const AuthProvider = ({ children, onLogin }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("abha");
  const [abhaId, setAbhaId] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);

  const formatAbhaId = (value) => {
    const cleaned = value.replace(/\D/g, "");
    const limited = cleaned.substring(0, 14);
    if (limited.length <= 2) return limited;
    if (limited.length <= 6) return `${limited.slice(0, 2)}-${limited.slice(2)}`;
    if (limited.length <= 10) return `${limited.slice(0, 2)}-${limited.slice(2, 6)}-${limited.slice(6)}`;
    return `${limited.slice(0, 2)}-${limited.slice(2, 6)}-${limited.slice(6, 10)}-${limited.slice(10)}`;
  };

  const isAbhaIdValid = () => abhaId.replace(/\D/g, "").length === 14;

  const handleAbhaSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!isAbhaIdValid()) {
      setError("Please enter a valid 14-digit ABHA ID");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setStep("otp");
      setLoading(false);
      setOtpTimer(60);
      const countdown = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 1200);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      if (otp === "123456") {
        const mockUser = {
          id: "DR-001",
          name: "Dr. Priya Sharma",
          role: "Ayurveda Physician",
          abhaId,
        };
        setUser(mockUser);
        setIsAuthenticated(true);
        setLoading(false);
        onLogin(mockUser);
      } else {
        setError('Invalid OTP. Please try again. (Hint: Use 123456)');
        setLoading(false);
      }
    }, 1000);
  };

  const handleResendOtp = () => {
    setOtpTimer(60);
    setError("");
    const countdown = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const goBackToAbha = () => {
    setStep("abha");
    setOtp("");
    setError("");
    setOtpTimer(0);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <Shield className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">EMR System</h1>
            <p className="text-gray-600">NAMASTE & ICD-11 Integration</p>
          </div>

          {step === "abha" ? (
            <form onSubmit={handleAbhaSubmit}>
              <div className="mb-6">
                <label htmlFor="abhaId" className="block text-sm font-medium text-gray-700 mb-2">
                  ABHA ID
                </label>
                <input
                  type="text"
                  id="abhaId"
                  value={abhaId}
                  onChange={(e) => {
                    const formatted = formatAbhaId(e.target.value);
                    setAbhaId(formatted);
                    setError("");
                  }}
                  placeholder="XX-XXXX-XXXX-XXXX"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center text-lg font-mono"
                  required
                />
                <p className="text-xs text-gray-500 mt-2">Enter your 14-digit ABHA ID</p>
                <p className="text-xs text-blue-600 mt-1">Current digits: {abhaId.replace(/\D/g, "").length}/14</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !isAbhaIdValid()}
                className={`w-full font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center ${
                  loading || !isAbhaIdValid()
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Shield className="w-5 h-5 mr-2" />}
                {loading ? "Verifying ABHA ID..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit}>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                    Enter OTP
                  </label>
                  <button type="button" onClick={goBackToAbha} className="text-sm text-indigo-600 hover:text-indigo-700">
                    Change ABHA ID
                  </button>
                </div>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").substring(0, 6);
                    setOtp(value);
                    setError("");
                  }}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center text-lg font-mono"
                  required
                />
                <p className="text-xs text-gray-500 mt-2">OTP sent to registered mobile number for {abhaId}</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className={`w-full font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center mb-4 ${
                  loading || otp.length !== 6 ? "bg-gray-400 cursor-not-allowed text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <CheckCircle className="w-5 h-5 mr-2" />}
                {loading ? "Verifying OTP..." : "Verify & Login"}
              </button>

              <div className="text-center">
                {otpTimer > 0 ? (
                  <p className="text-sm text-gray-500">Resend OTP in {otpTimer}s</p>
                ) : (
                  <button type="button" onClick={handleResendOtp} className="text-sm text-indigo-600 hover:text-indigo-700 underline">
                    Resend OTP
                  </button>
                )}
              </div>
            </form>
          )}

          <p className="text-xs text-gray-500 text-center mt-4">Secure authentication via ABHA OAuth 2.0</p>

          {step === "otp" && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-600"><strong>Demo:</strong> Use OTP "123456" to login</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return children;
};

export default AuthProvider;
