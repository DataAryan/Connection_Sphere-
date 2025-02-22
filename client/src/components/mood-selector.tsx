import { moods, type Mood } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface MoodSelectorProps {
  onSelect: (mood: Mood | null) => void;
}

const moodIcons = {
  Happy: "😊",
  Sad: "😢",
  Stressed: "😰",
  Anxious: "😨",
  Neutral: "😐",
  Excited: "🤗"
};

export function MoodSelector({ onSelect }: MoodSelectorProps) {
  const [selected, setSelected] = useState<Mood | null>(null);

  const handleMoodClick = (mood: Mood) => {
    const newMood = selected === mood ? null : mood;
    setSelected(newMood);
    onSelect(newMood);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-6">How are you feeling today?</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {moods.map((mood) => (
          <Button
            key={mood}
            variant={selected === mood ? "default" : "outline"}
            className="h-24 text-lg"
            onClick={() => handleMoodClick(mood)}
            onDoubleClick={() => handleMoodClick(mood)}
          >
            <span className="text-2xl mr-2">{moodIcons[mood]}</span>
            {mood}
          </Button>
        ))}
      </div>
    </div>
  );
}