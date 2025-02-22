import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type User, type Chat } from "@shared/schema";
import { useWebSocket } from "@/lib/websocket";
import { apiRequest } from "@/lib/queryClient";

export default function RelieverDashboard() {
  const { data: user } = useQuery<User>({
    queryKey: ['/api/users/me']
  });

  const { data: chats = [] } = useQuery<Chat[]>({
    queryKey: ['/api/chats/reliever'],
    refetchInterval: 5000 // Refresh every 5 seconds
  });

  const { mutate: updateStatus } = useMutation({
    mutationFn: async (online: boolean) => {
      await apiRequest('PATCH', `/api/users/${user?.id}`, { online });
    }
  });

  const activeChats = chats.filter(chat => chat.status === 'active');
  const queuedChats = chats.filter(chat => chat.status === 'queued');

  if (!user) return null;

  // Calculate metrics
  const avgResponseTime = activeChats.length > 0 ? '2m' : '0m'; // This would be calculated from actual message timestamps
  const sessionRating = '4.5'; // This would be calculated from actual ratings

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Profile Card */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar ?? undefined} />
              <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{user.username}</h2>
              <div className="flex gap-2 mt-2">
                {user.moodExpertise?.map(mood => (
                  <Badge key={mood}>{mood}</Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={user.online ?? false}
                onCheckedChange={updateStatus}
              />
              <span>{user.online ? 'Available' : 'Offline'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
            <p className="text-2xl font-bold">{activeChats.length}</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">In Queue</CardTitle>
            <p className="text-2xl font-bold">{queuedChats.length}</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <p className="text-2xl font-bold">{avgResponseTime}</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Session Rating</CardTitle>
            <p className="text-2xl font-bold">{sessionRating}</p>
          </CardHeader>
        </Card>
      </div>

      {/* Chats Tabs */}
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="active" className="space-y-4">
            <TabsList>
              <TabsTrigger value="active">Active Chats</TabsTrigger>
              <TabsTrigger value="queue">Queue</TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              {activeChats.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No active chats
                </div>
              ) : (
                <div className="space-y-4">
                  {activeChats.map(chat => (
                    <div key={chat.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{chat.userAlias}</p>
                          <p className="text-sm text-muted-foreground">
                            Started {new Date(chat.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="queue">
              {queuedChats.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No chats in queue
                </div>
              ) : (
                <div className="space-y-4">
                  {queuedChats.map(chat => (
                    <div key={chat.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{chat.userAlias}</p>
                          <p className="text-sm text-muted-foreground">
                            Queued {new Date(chat.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}