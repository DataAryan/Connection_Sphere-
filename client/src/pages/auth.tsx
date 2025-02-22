import { useState } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { relieverService } from "@/lib/relieverService";

export default function AuthPage() {
  const [location, navigate] = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // TODO: Implement actual login logic
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="flex-1 bg-background p-12 flex flex-col justify-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Relief Chat</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Join our platform to provide expert support and guidance to users in need.
        </p>

        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <div className="h-6 w-6 text-primary">+</div>
            </div>
            <div>
              <h3 className="font-semibold">Create Your Profile</h3>
              <p className="text-sm text-muted-foreground">
                Set up your professional profile and showcase your expertise
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <div className="h-6 w-6 text-primary">💬</div>
            </div>
            <div>
              <h3 className="font-semibold">Connect with Users</h3>
              <p className="text-sm text-muted-foreground">
                Help users through text and voice chat
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <div className="h-6 w-6 text-primary">📊</div>
            </div>
            <div>
              <h3 className="font-semibold">Track Performance</h3>
              <p className="text-sm text-muted-foreground">
                Monitor your impact and improve your service
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-[480px] bg-muted/50 p-12 flex items-center">
        <Card className="w-full p-6">
          <h2 className="text-2xl font-semibold mb-2">Reliever Access</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Login or create an account to start helping users
          </p>

          <Tabs defaultValue="login">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="login" className="flex-1">Login</TabsTrigger>
              <TabsTrigger value="register" className="flex-1">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    placeholder="Email"
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Input
                    placeholder="Password"
                    type="password"
                    value={formData.password}
                    onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  />
                </div>
                {error && (
                  <div className="text-red-500 text-sm">{error}</div>
                )}
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/register")}
              >
                Complete Registration
              </Button>
            </TabsContent>
          </Tabs>

          <p className="text-xs text-muted-foreground text-center mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </Card>
      </div>
    </div>
  );
}
