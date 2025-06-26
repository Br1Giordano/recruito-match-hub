import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, User, Building2, Eye, EyeOff } from "lucide-react";
import AuthErrorHandler from "./AuthErrorHandler";

interface AuthPageProps {
  onBack?: () => void;
  onAuthSuccess?: () => void;
}

export default function AuthPage({ onBack, onAuthSuccess }: AuthPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      toast({
        title: "Accesso effettuato",
        description: "Benvenuto nel sistema!",
      });
      setIsLoading(false);
      // Redirect to dashboard after successful login
      if (onAuthSuccess) onAuthSuccess();
    }
  };

  const handleSignUp = async (email: string, password: string, userType: 'recruiter' | 'company') => {
    setIsLoading(true);
    setError(null);

    // Basic validation
    if (password.length < 6) {
      setError("La password deve essere di almeno 6 caratteri");
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Inserisci un indirizzo email valido");
      setIsLoading(false);
      return;
    }

    const redirectUrl = `${window.location.origin}/`;

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          user_type: userType
        }
      }
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else if (data.user && !data.session) {
      toast({
        title: "Conferma email richiesta",
        description: "Controlla la tua email per confermare l'account.",
      });
      setIsLoading(false);
    } else {
      toast({
        title: "Registrazione completata",
        description: "Account creato con successo!",
      });
      setIsLoading(false);
      // Redirect to dashboard after successful signup
      if (onAuthSuccess) onAuthSuccess();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-recruito-blue/5 via-recruito-teal/5 to-recruito-green/5">
      <div className="border-b bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Torna al Sito
              </Button>
            )}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-recruito-blue to-recruito-teal rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <h1 className="text-xl font-semibold">Accedi a Recruito</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-80px)]">
        <Card className="w-full max-w-lg shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gradient">Autenticazione</CardTitle>
            <CardDescription>
              Accedi al tuo account o registrati per iniziare
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Accedi</TabsTrigger>
                <TabsTrigger value="signup">Registrati</TabsTrigger>
              </TabsList>

              <AuthErrorHandler error={error} />

              <TabsContent value="signin">
                <SignInForm onSubmit={handleSignIn} isLoading={isLoading} showPassword={showPassword} setShowPassword={setShowPassword} />
              </TabsContent>

              <TabsContent value="signup">
                <SignUpForm onSubmit={handleSignUp} isLoading={isLoading} showPassword={showPassword} setShowPassword={setShowPassword} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SignInForm({ onSubmit, isLoading, showPassword, setShowPassword }: {
  onSubmit: (email: string, password: string) => void;
  isLoading: boolean;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && password) {
      onSubmit(email, password);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signin-email">Email</Label>
        <Input
          id="signin-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="nome@esempio.com"
          maxLength={255}
          autoComplete="email"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signin-password">Password</Label>
        <div className="relative">
          <Input
            id="signin-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="La tua password"
            autoComplete="current-password"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      <Button type="submit" className="w-full gradient-recruito" disabled={isLoading}>
        {isLoading ? "Accesso in corso..." : "Accedi"}
      </Button>
    </form>
  );
}

function SignUpForm({ onSubmit, isLoading, showPassword, setShowPassword }: {
  onSubmit: (email: string, password: string, userType: 'recruiter' | 'company') => void;
  isLoading: boolean;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<'recruiter' | 'company'>('recruiter');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && password) {
      onSubmit(email, password, userType);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-3">
        <Label>Tipo di Account</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant={userType === 'recruiter' ? 'default' : 'outline'}
            onClick={() => setUserType('recruiter')}
            className="flex items-center gap-2 h-12"
          >
            <User className="h-4 w-4" />
            Recruiter
          </Button>
          <Button
            type="button"
            variant={userType === 'company' ? 'default' : 'outline'}
            onClick={() => setUserType('company')}
            className="flex items-center gap-2 h-12"
          >
            <Building2 className="h-4 w-4" />
            Azienda
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="nome@esempio.com"
          maxLength={255}
          autoComplete="email"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <div className="relative">
          <Input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Crea una password sicura"
            minLength={6}
            autoComplete="new-password"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      <Button type="submit" className="w-full gradient-recruito" disabled={isLoading}>
        {isLoading ? "Registrazione in corso..." : "Registrati"}
      </Button>
    </form>
  );
}
