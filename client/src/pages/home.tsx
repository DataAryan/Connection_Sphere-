import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MoodSelector } from "@/components/mood-selector";
import { RelieverCard } from "@/components/reliever-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"; // Added import
import { useLocation } from "wouter";
import { type User, type Mood } from "@shared/schema";
import { useWebSocket } from "@/lib/websocket";
import { relieverService } from "@/lib/relieverService";

function generateAlias() {
  return `Anonymous${Math.floor(Math.random() * 10000)}`;
}

export default function Home() {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [search, setSearch] = useState("");
  const [, navigate] = useLocation();
  const { sendMessage } = useWebSocket();

  const { data: relievers = [], isLoading, error } = useQuery<User[]>({
    queryKey: ['relievers'],
    queryFn: () => relieverService.getRelievers(),
    retry: 1,
    staleTime: 30000
  });

  console.log("Relievers data:", relievers);

  const filteredRelievers = relievers.filter(reliever => {
    if (!reliever) return false;
    if (selectedMood && !reliever.moodExpertise?.includes(selectedMood)) {
      return false;
    }
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        reliever.username.toLowerCase().includes(searchLower) ||
        reliever.skills?.some(skill => skill.toLowerCase().includes(searchLower))
      );
    }
    return true;
  });

  const handleConnect = async (relieverId: number) => {
    const userAlias = generateAlias();

    sendMessage('start_chat', {
      relieverId,
      userAlias,
      status: 'active'
    });

    navigate(`/chat/${relieverId}?alias=${userAlias}`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12"> {/* Added div for button and styling */}
        <h1 className="text-4xl font-bold mb-4">
          Connect with Expert Support
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          Get instant help from our qualified relievers. No registration required.
        </p>
        <Button
          variant="outline"
          size="lg"
          onClick={() => navigate("/auth")}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Become a Reliever
        </Button>
      </div>

      <MoodSelector onSelect={setSelectedMood} />

      <div className="max-w-xl mx-auto mt-12 mb-8">
        <Input
          placeholder="Search by name or skills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="text-center">Loading relievers...</div>
      ) : error ? (
        <div className="text-center text-red-500">
          Error loading relievers. Please try again later.
        </div>
      ) : filteredRelievers.length === 0 ? (
        <div className="text-center">No relievers found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRelievers.map((reliever) => (
            <RelieverCard
              key={reliever.id}
              reliever={reliever}
              onConnect={handleConnect}
            />
          ))}
        </div>
      )}
    </div>
  );
}