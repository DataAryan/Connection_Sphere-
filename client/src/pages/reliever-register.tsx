import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { moods } from "@shared/schema";
import { relieverService } from "@/lib/relieverService";

export default function RelieverRegister() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    displayName: "",
    bio: "",
    skills: "",
    moodExpertise: [] as string[]
  });
  const [error, setError] = useState<string | null>(null);

  const handleMoodToggle = (mood: string) => {
    setFormData(prev => ({
      ...prev,
      moodExpertise: prev.moodExpertise.includes(mood)
        ? prev.moodExpertise.filter(m => m !== mood)
        : [...prev.moodExpertise, mood]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.email || !formData.password || !formData.displayName) {
      setError("All required fields must be filled");
      return;
    }

    if (formData.moodExpertise.length === 0) {
      setError("Please select at least one mood expertise");
      return;
    }

    try {
      const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.displayName}`;
      await relieverService.createReliever({
        username: formData.email, // Using email as username for Firebase auth
        password: formData.password,
        bio: formData.bio,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        moodExpertise: formData.moodExpertise,
        isReliever: true,
        avatar,
        online: true,
        createdAt: new Date()
      });

      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background" />
      </div>

      {/* Content container */}
      <div className="container relative z-10 max-w-[1200px] flex gap-8 items-center">
        {/* Left side - Welcome text and features */}
        <div className="flex-1 hidden lg:block">
          <h1 className="text-4xl font-bold mb-6">Welcome to Relief Chat</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Join our platform to provide expert support and guidance to users in need.
          </p>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <div className="h-6 w-6 text-primary">💬</div>
              </div>
              <div>
                <h3 className="font-semibold">Share Your Expertise</h3>
                <p className="text-sm text-muted-foreground">
                  Help others through text-based support sessions
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <div className="h-6 w-6 text-primary">🎯</div>
              </div>
              <div>
                <h3 className="font-semibold">Flexible Schedule</h3>
                <p className="text-sm text-muted-foreground">
                  Choose when you want to be available
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <div className="h-6 w-6 text-primary">📊</div>
              </div>
              <div>
                <h3 className="font-semibold">Track Your Impact</h3>
                <p className="text-sm text-muted-foreground">
                  Monitor your performance and improve
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Registration form */}
        <Card className="w-full max-w-lg bg-background/95 backdrop-blur shadow-xl relative z-10">
          <CardHeader>
            <h1 className="text-2xl font-bold text-center">Register as a Reliever</h1>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder="Email"
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="border-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="border-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <Input
                  placeholder="Display Name"
                  value={formData.displayName}
                  onChange={e => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                  className="border-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <Textarea
                  placeholder="Bio - Tell us about your experience and expertise"
                  value={formData.bio}
                  onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  className="border-primary/20 focus:border-primary min-h-[100px]"
                />
              </div>
              <div>
                <Input
                  placeholder="Skills (comma-separated)"
                  value={formData.skills}
                  onChange={e => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                  className="border-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">Select your mood expertise:</p>
                <div className="flex flex-wrap gap-2">
                  {moods.map(mood => (
                    <Badge
                      key={mood}
                      variant={formData.moodExpertise.includes(mood) ? "default" : "outline"}
                      className="cursor-pointer transition-colors hover:bg-primary/90"
                      onClick={() => handleMoodToggle(mood)}
                    >
                      {mood}
                    </Badge>
                  ))}
                </div>
              </div>
              {error && (
                <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</div>
              )}
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90"
              >
                Register
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}