
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Mail, MoreVertical } from "lucide-react";

interface ContactProfile {
  _id: string;
  profilePicture: string;
  name: string;
  jobTitle: string;
  company: string;
  contactInfo: {
    email: string;
  };
  tags: string[];
}

interface ContactCardProps {
  contact: ContactProfile;
  onEdit?: (contactId: string) => void;
  onDelete?: (contactId: string) => void;
}

export function ContactCard({ contact, onEdit, onDelete }: ContactCardProps) {
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const canPerformActions = onEdit || onDelete;

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 border">
              <AvatarImage src={contact.profilePicture} alt={contact.name} />
              <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <CardTitle className="text-lg">{contact.name}</CardTitle>
              <CardDescription>
                {contact.jobTitle} at {contact.company}
              </CardDescription>
            </div>
          </div>

          {/* The entire DropdownMenu is now rendered conditionally */}
          {canPerformActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {/* Conditionally render the "Edit" item */}
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(contact._id)}>
                    Edit Contact
                  </DropdownMenuItem>
                )}
                
                {/* --- REMOVED: The "Message" item is gone --- */}
                
                {/* Conditionally render the separator only if both actions exist */}
                {onEdit && onDelete && <DropdownMenuSeparator />}
                
                {/* Conditionally render the "Delete" item */}
                {onDelete && (
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600"
                    onClick={() => onDelete(contact._id)}
                  >
                    Delete Contact
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Mail className="h-4 w-4" />
          <a href={`mailto:${contact.contactInfo.email}`} className="hover:underline">
            {contact.contactInfo.email}
          </a>
        </div>
        <div className="flex flex-wrap gap-1">
          {contact.tags.map((tag, index) => (
            <Badge key={index} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
