import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TechBackground } from "@/components/TechBackground";
import { Terminal, ArrowRight, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { Link } from "react-router-dom";

type AuthMode = "login" | "signup" | "forgot";

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } else {
      navigate("/dashboard");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { display_name: displayName },
      },
    });
    setLoading(false);
    if (error) {
      toast({ title: "Signup failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Check your email", description: "We sent you a confirmation link to verify your account." });
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Email sent", description: "Check your inbox for a password reset link." });
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen bg-gradient-hero relative flex items-center justify-center p-4">
      <TechBackground />

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 justify-center mb-8 group">
          <motion.div
            className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
          >
            <Terminal className="w-5 h-5 text-primary-foreground" />
          </motion.div>
          <span className="font-display font-bold text-2xl tracking-tight">Shaenx</span>
        </Link>

        {/* Card */}
        <div className="neon-card p-8">
          {/* Tabs */}
          <div className="flex gap-1 mb-8 p-1 bg-muted rounded-xl">
            {(["login", "signup"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setMode(tab)}
                className={`flex-1 py-2.5 text-sm font-mono font-medium rounded-lg transition-all duration-200 ${
                  mode === tab || (mode === "forgot" && tab === "login")
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {mode === "forgot" ? (
              <motion.form
                key="forgot"
                onSubmit={handleForgotPassword}
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-5"
              >
                <div className="mb-2">
                  <h2 className="font-display text-lg font-semibold">Reset password</h2>
                  <p className="text-sm text-muted-foreground">Enter your email to receive a reset link.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reset-email" className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="reset-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-11 bg-background/50 font-mono" placeholder="you@example.com" />
                  </div>
                </div>
                <Button type="submit" variant="gradient" className="w-full h-11 gap-2" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"} <ArrowRight className="w-4 h-4" />
                </Button>
                <button type="button" onClick={() => setMode("login")} className="text-sm text-muted-foreground hover:text-primary transition-colors font-mono w-full text-center">
                  ← Back to sign in
                </button>
              </motion.form>
            ) : (
              <motion.form
                key={mode}
                onSubmit={mode === "login" ? handleLogin : handleSignup}
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-5"
              >
                {mode === "signup" && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Display Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input id="name" type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="pl-10 h-11 bg-background/50 font-mono" placeholder="Your name" />
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-11 bg-background/50 font-mono" placeholder="you@example.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Password</Label>
                    {mode === "login" && (
                      <button type="button" onClick={() => setMode("forgot")} className="text-xs text-muted-foreground hover:text-primary transition-colors font-mono">
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-11 bg-background/50 font-mono"
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" variant="gradient" className="w-full h-11 gap-2" disabled={loading}>
                  {loading ? "Loading..." : mode === "login" ? "Sign In" : "Create Account"}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6 font-mono">
          By continuing, you agree to our Terms of Service.
        </p>
      </motion.div>
    </div>
  );
}
