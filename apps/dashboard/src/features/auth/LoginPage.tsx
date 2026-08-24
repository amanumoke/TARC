/**
 * @file apps/dashboard/src/features/auth/LoginPage.tsx
 * @description Distinctive login page for the TARCMS Management Dashboard.
 * Features animated topographic contour lines referencing the Sheka highlands.
 */

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Sprout } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * Animated topographic contour line component.
 * Renders SVG paths that represent elevation maps of the Sheka coffee-growing region.
 */
function TopographicContours() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const animate = () => {
      setOffset((prev) => (prev + 0.5) % 360);
    };
    const interval = setInterval(animate, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Deep forest gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1B4332] via-[#2D6A4F] to-[#1B4332]" />

      {/* Topographic SVG overlay */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20"
        viewBox="0 0 800 1200"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="Topographic contour lines"
      >
        <title>Topographic map of Sheka highlands</title>
        {/* Contour lines - organic shapes representing elevation */}
        {[
          { baseY: 100, amp: 30, id: 'c1' },
          { baseY: 185, amp: 45, id: 'c2' },
          { baseY: 270, amp: 30, id: 'c3' },
          { baseY: 355, amp: 45, id: 'c4' },
          { baseY: 440, amp: 30, id: 'c5' },
          { baseY: 525, amp: 45, id: 'c6' },
          { baseY: 610, amp: 30, id: 'c7' },
          { baseY: 695, amp: 45, id: 'c8' },
          { baseY: 780, amp: 30, id: 'c9' },
          { baseY: 865, amp: 45, id: 'c10' },
          { baseY: 950, amp: 30, id: 'c11' },
          { baseY: 1035, amp: 45, id: 'c12' },
        ].map((contour) => {
          const phase = offset * 0.02 + Number.parseInt(contour.id.slice(1)) * 0.5;
          return (
            <path
              key={contour.id}
              d={`M 0 ${contour.baseY} Q 200 ${contour.baseY + Math.sin(phase) * contour.amp} 400 ${contour.baseY + Math.cos(phase + 1) * contour.amp * 0.7} T 800 ${contour.baseY + Math.sin(phase + 2) * contour.amp * 0.5}`}
              fill="none"
              stroke="#52B788"
              strokeWidth={1}
              strokeLinecap="round"
              style={{ opacity: 0.3 }}
            />
          );
        })}

        {/* Elevation labels */}
        {[
          { x: 50, y: 250, label: '1,850m', id: 'el1' },
          { x: 680, y: 420, label: '2,120m', id: 'el2' },
          { x: 120, y: 680, label: '1,940m', id: 'el3' },
          { x: 700, y: 850, label: '2,340m', id: 'el4' },
        ].map((item) => (
          <text
            key={item.id}
            x={item.x}
            y={item.y}
            fill="#52B788"
            fontSize="11"
            fontFamily="monospace"
            opacity={0.5}
          >
            {item.label}
          </text>
        ))}
      </svg>

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1B4332]/80 via-transparent to-[#1B4332]/40" />

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
        {/* Logo and branding */}
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
            <Sprout className="h-7 w-7 text-[#52B788]" />
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight block">TARCMS</span>
            <span className="text-xs text-[#52B788] font-medium tracking-wide uppercase">
              Management Portal
            </span>
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="space-y-2">
          <p className="text-sm text-[#52B788] font-medium tracking-wide uppercase">
            Tepi Agricultural Research Center
          </p>
          <p className="text-white/60 text-sm max-w-xs leading-relaxed">
            Empowering researchers and staff with tools to advance agricultural science in Southwest
            Ethiopia.
          </p>
        </div>
      </div>
    </div>
  );
}

interface LoginPageProps {
  onLogin?: (user: {
    id: string;
    name: string;
    email: string;
    role: string;
    token: string;
  }) => void;
}

/**
 * Login page component for the TARCMS Dashboard.
 * Split layout with animated topographic contours on left, login form on right.
 */
export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error?.message || 'Login failed');
        setIsLoading(false);
        return;
      }

      // Store user info in localStorage
      localStorage.setItem('tarcms_token', data.data.token);
      localStorage.setItem('tarcms_user', JSON.stringify(data.data.user));

      onLogin?.({
        id: data.data.user.id,
        name: data.data.user.name,
        email: data.data.user.email,
        role: data.data.user.role,
        token: data.data.token,
      });
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel - Topographic art */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <TopographicContours />
      </div>

      {/* Right panel - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#FEFAE0]">
        <div className="w-full max-w-md space-y-10">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#2D6A4F] flex items-center justify-center">
              <Sprout className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-lg text-[#1B4332]">TARCMS</span>
          </div>

          {/* Welcome header */}
          <div className="space-y-2">
            <h1
              className="text-3xl font-bold text-[#1B4332] tracking-tight"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Welcome back
            </h1>
            <p className="text-[#2D6A4F]/70 text-sm">Sign in to access the management dashboard</p>
          </div>

          {/* Login form card */}
          <Card className="border-[#2D6A4F]/10 shadow-lg shadow-[#2D6A4F]/5">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Error message */}
                {error && (
                  <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
                    {error}
                  </div>
                )}

                {/* Email field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#1B4332]">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="researcher@tarc.gov.et"
                    required
                    className="border-[#2D6A4F]/20 bg-white focus:ring-[#52B788]"
                  />
                </div>

                {/* Password field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[#1B4332]">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="border-[#2D6A4F]/20 bg-white pr-10 focus:ring-[#52B788]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2D6A4F]/60 hover:text-[#2D6A4F] transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember me & Forgot password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-[#2D6A4F]/30 text-[#2D6A4F] focus:ring-[#52B788]"
                    />
                    <span className="text-xs text-[#2D6A4F]/70">Remember me</span>
                  </label>
                  <a
                    href="/forgot-password"
                    className="text-xs text-[#D4A373] hover:text-[#1B4332] font-medium transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-semibold shadow-lg shadow-[#2D6A4F]/20 hover:shadow-[#1B4332]/30 disabled:opacity-60"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    'Sign in'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Footer links */}
          <div className="text-center space-y-3 pt-4 border-t border-[#2D6A4F]/10">
            <p className="text-xs text-[#2D6A4F]/60">Contact IT support if you need assistance</p>
            <a
              href="http://localhost:3000"
              className="inline-flex items-center gap-1.5 text-xs text-[#52B788] hover:text-[#2D6A4F] font-medium transition-colors"
            >
              <Sprout className="h-3 w-3" />
              Back to public website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
