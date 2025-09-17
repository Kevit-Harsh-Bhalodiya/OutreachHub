import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

interface MessageTemplate {
  _id: string;
  workspaceId: string;
  type: string;
  title: string;
  templateImage?: string;
  template: string;
}

interface MessageTemplateCardProps {
  template: MessageTemplate;
  onDelete?: (templateId: string) => void;
  onUseTemplate?: (templateId: string) => void;
}

export function MessageTemplateCard({
  template,
  onDelete,
}: MessageTemplateCardProps) {
  const canPerformActions = onDelete;

  return (
    <Card className="w-full max-w-sm overflow-hidden flex flex-col">
      {
        template.templateImage &&
        <div className="aspect-[16/9] bg-muted">
          <img
            src={template.templateImage}
            alt={template.title}
            className="w-full h-full object-cover"
          />
        </div>
      }

      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="grid gap-1.5">
            <CardTitle>{template.title}</CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline">{template.type}</Badge>
            </div>
          </div>
          {canPerformActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="flex-shrink-0">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onDelete && (
                  <>
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600"
                      onClick={() => onDelete(template._id)}
                    >
                      Delete Template
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-grow flex flex-col">
        <p className="text-sm font-medium mb-2 text-card-foreground">Template Content:</p>
        <div className="p-3 bg-muted rounded-md border text-sm text-muted-foreground h-full overflow-y-auto font-mono">
          {template.template}
        </div>
      </CardContent>

    </Card>
  );
}
