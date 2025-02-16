import { Card, CardContent } from "@/components/ui/card";
import { CharacterId, Dialogue } from "@/types";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { useFontSize } from "@/providers/fontSize.tsx";

const getAvatarUrl = (characterId: string) =>
  `/avatars/${characterId.toLowerCase()}.webp`;

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const normalize = (str: string) =>
  str.toLowerCase().replace(/\s/g, "").replaceAll("_", " ");

const UNKNOWN_CHARACTER: CharacterId = "UNKNOWN";

type Props = {
  dialogue: Dialogue;
};

export function DialogueCard({ dialogue }: Props) {
  const { fontSize } = useFontSize();
  const avatarSize = Math.round(32 * fontSize);

  return (
    <Card className="bg-secondary/30 border-secondary/20 transition-all hover:bg-secondary/40">
      <CardContent className="p-3 flex gap-3 align-middle">
        <div className="flex items-center">
          <div style={{ width: avatarSize, height: avatarSize }}>
            <Avatar className="w-full h-full ring-1 ring-secondary">
              <AvatarImage
                src={getAvatarUrl(dialogue.character.id)}
                alt={dialogue.character.name}
              />
              <AvatarFallback
                className="text-sm bg-secondary text-secondary-foreground"
                style={{ fontSize: `${fontSize}rem` }}
              >
                {dialogue.character.id !== UNKNOWN_CHARACTER
                  ? getInitials(dialogue.character.name)
                  : "??"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-primary/90 mb-1 leading-none capitalize">
            {dialogue.character.id !== UNKNOWN_CHARACTER
              ? normalize(dialogue.character.id)
              : dialogue.character.name}
          </div>
          <div className="text-card-foreground/80 break-words leading-relaxed">
            {dialogue.text}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default DialogueCard;
