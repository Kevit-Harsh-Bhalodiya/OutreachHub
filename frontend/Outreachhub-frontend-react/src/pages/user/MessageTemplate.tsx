import { MessageTemplateCard } from "@/components/MessageTemplateCard";
import { Input } from "@/components/ui/input";
import { fetchMessageTemplates } from "@/redux/slices/messageTemplateSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "../auth/Login";
import type { AppDispatch, RootState } from "@/redux/store";
import { selectSelectedWorkspaceId } from "@/redux/slices/workspaceSlice";
interface MessageTemplate {
  _id: string;
  workspaceId: string;
  type: string;
  title: string;
  templateImage?: string;
  template: string;
}

const MessageTemplate = () => {
  const navigator = useNavigate();
  const location = useLocation();
  const currentWorkspaceId = useSelector(selectSelectedWorkspaceId);
  useEffect(() => {
    if (!currentWorkspaceId) {
      console.log(
        "No workspace selected, redirecting to /user",
        currentWorkspaceId,
      );
      navigator("/user",{state:{from:location}});
    }
  }, [currentWorkspaceId]);
  const permissions =
    JSON.parse(localStorage.getItem("permissions") ?? "") || "";
  const templates = useSelector(
    (state: RootState) => state.messageTemplate.templates,
  );
  const dispatch = useDispatch<AppDispatch>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterBy, setFilterBy] = useState<string>("title");
  const token = useSelector((state: RootState) => state.auth.token);
  useEffect(() => {
    dispatch(fetchMessageTemplates());
  }, []);
  const filteredTemplates = useMemo(() => {
    if (!searchQuery) {
      return templates;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    return templates.filter((template: MessageTemplate) => {
      switch (filterBy) {
        case "title":
          return template.title.toLowerCase().includes(lowercasedQuery);
        case "template":
          return template.template.toLowerCase().includes(lowercasedQuery);
        default:
          return false;
      }
    });
  }, [templates, searchQuery, filterBy]);
  // const handleEdit = (templateId: string) => {
  //   navigator(`/user/message-template/edit/${templateId}`);
  // };
  const handleDelete = async (templateId: string) => {
    try {
      const response = await axiosInstance.delete(
        `/message-template/${templateId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (response.status === 200) {
        dispatch(fetchMessageTemplates());
        alert("Template deleted successfully.");
      } else {
        alert("Failed to delete template. Please try again.");
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleUseTemplate = (templateId: string) => {
    console.log("Use template with ID:", templateId);
  };
  return (
    <div className="container mx-auto py-4 px-5">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search contacts..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Search by:
            </span>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select a field" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="template">Template</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {permissions.write && (
            <Button
              className="ml-auto"
              onClick={() => navigator("/user/message-template/create",{state:{from:location}})}
            >
              Create Template
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          {filteredTemplates.length > 0 ? (
            permissions.write ? (
              filteredTemplates.map((template: MessageTemplate) => (
                <MessageTemplateCard
                  key={template._id}
                  template={template}
                  onDelete={handleDelete}
                  onUseTemplate={handleUseTemplate}
                />
              ))
            ) : (
              filteredTemplates.map((template: MessageTemplate) => (
                <MessageTemplateCard key={template._id} template={template} />
              ))
            )
          ) : (
            <div className="w-full text-center py-16">
              <p className="text-muted-foreground">No templates found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageTemplate;
