
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface UserAvatarProps {
  user: any;
  className?: string;
}

export function UserAvatar({ user, className }: UserAvatarProps) {
  const handleProfileClick = () => {
    if (user) {
      return "/profile";
    } else {
      return "/auth";
    }
  };

  return (
    <Button variant="ghost" size="icon" asChild className={`h-8 w-8 rounded-full p-0 ${className}`}>
      <Link to={handleProfileClick()}>
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.user_metadata?.avatar_url} alt="Avatar" />
          <AvatarFallback className="text-sm">
            {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
      </Link>
    </Button>
  );
}
