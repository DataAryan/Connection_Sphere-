import { type User } from "@shared/schema";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface RelieverCardProps {
  reliever: User;
  onConnect: (relieverId: number) => void;
}

export function RelieverCard({ reliever, onConnect }: RelieverCardProps) {
  const fallbackInitial = reliever.username ? reliever.username[0].toUpperCase() : '?';

  return (
    <Card className="w-full h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-14 w-14">
              {reliever.avatar ? (
                <AvatarImage src={reliever.avatar} alt={reliever.username} />
              ) : (
                <AvatarFallback>
                  {fallbackInitial}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold line-clamp-1">
                {reliever.username}
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                <span>Expert Reliever</span>
              </div>
            </div>
          </div>
          <Badge variant={reliever.online ? "default" : "outline"} className="capitalize">
            {reliever.online ? "Online" : "Offline"}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          {reliever.moodExpertise?.map((mood) => (
            <Badge key={mood} variant="secondary">
              {mood}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {reliever.bio || "No bio available"}
        </p>
        <div className="flex flex-wrap gap-1">
          {reliever.skills?.map((skill) => (
            <Badge key={skill} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="border-t pt-4">
        <Button
          className="w-full"
          disabled={!reliever.online}
          onClick={() => onConnect(reliever.id)}
        >
          {reliever.online ? "Connect Now" : "Currently Offline"}
        </Button>
      </CardFooter>
    </Card>
  );
}