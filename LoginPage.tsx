
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  Loader2, 
  AlertCircle,
  ShieldCheck 
} from 'lucide-react';

// Validation Schema
const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginPageProps {
  onLoginSuccess: (email: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setLoginError(null);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (data.email === 'admin@floxhub.com') {
      onLoginSuccess(data.email);
    } else {
      setLoginError('Credenciais inválidas. Tente admin@floxhub.com');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-[420px]">
        {/* Logo/Branding Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="font-black text-lead text-3xl">F</span>
            </div>
            <h1 className="text-3xl font-black text-lead tracking-tighter">
              FLOXHUB <span className="text-primary">GPE</span>
            </h1>
          </div>
          <p className="text-muted font-medium">Acesse sua Jornada Corporativa</p>
        </div>

        {/* Login Card */}
        <div className="bg-surface rounded-2xl p-8 shadow-xl border border-border/50">
          {loginError && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-xs font-semibold text-red-700">{loginError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-lead uppercase tracking-widest mb-2 px-1">
                E-mail Corporativo
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="ex: voce@floxhub.com"
                  className={`w-full pl-12 pr-4 py-3.5 bg-background border rounded-xl text-sm font-medium transition-all outline-none ${
                    errors.email 
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' 
                      : 'border-border focus:border-primary focus:ring-4 focus:ring-primary/10'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-[10px] font-bold text-red-500 px-1 uppercase tracking-tighter">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2 px-1">
                <label className="block text-xs font-bold text-lead uppercase tracking-widest">
                  Senha de Acesso
                </label>
                <a href="#" className="text-[10px] font-bold text-muted hover:text-primary transition-colors uppercase tracking-widest">
                  Esqueceu a senha?
                </a>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3.5 bg-background border rounded-xl text-sm font-medium transition-all outline-none ${
                    errors.password 
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' 
                      : 'border-border focus:border-primary focus:ring-4 focus:ring-primary/10'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-lead transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-[10px] font-bold text-red-500 px-1 uppercase tracking-tighter">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-lead font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span className="tracking-widest uppercase text-sm">Iniciar Jornada</span>
                  <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-[10px] text-muted font-bold uppercase tracking-[0.2em]">
            GPE v1.0.0 • Secure Environment • Floxhub Enterprise
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
