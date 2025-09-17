
import { FormControl, FormDescription, FormLabel } from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getWorkspacesByUserId } from "@/redux/slices/adminSlice";
import { selectUserId } from "@/redux/slices/userSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import type {
  FieldValues,
  Path,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

// Define a more specific type for the nested workspace data
type WorkspaceUser = {
  workspaceId: {
    _id: string;
    tags: string[];
  };
};

// Use generics for strong typing with React Hook Form
type TagInputProps<T extends FieldValues> = {
  label: string;
  placeholder: string;
  name: Path<T>;
  setValue: UseFormSetValue<T>;
  watch: UseFormWatch<T>;
};

const TagInput = <T extends FieldValues>({
  label,
  placeholder,
  name,
  setValue,
  watch,
}: TagInputProps<T>) => {
  const [input, setInput] = useState<string>("");
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const userId = useSelector(selectUserId);
  const selectedWorkspaceId = useSelector(
    (state: RootState) => state.workspace.selectedWorkspaceId,
  );
  const tags = watch(name) || [];
  const { workspacesByUserId } = useSelector((state: RootState) => state.admin);
  const [tagsAvailable, setTagsAvailable] = useState<string[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (userId) {
      dispatch(getWorkspacesByUserId(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    const allTags = new Set<string>();
    if (Array.isArray(workspacesByUserId) && workspacesByUserId.length > 0) {
      (workspacesByUserId as WorkspaceUser[]).forEach((workspace) => {
        if (
          workspace.workspaceId._id === selectedWorkspaceId &&
          Array.isArray(workspace.workspaceId.tags)
        ) {
          workspace.workspaceId.tags.forEach((tag) => allTags.add(tag));
        }
      });
    }
    setTagsAvailable(Array.from(allTags));
  }, [workspacesByUserId, selectedWorkspaceId]);

  const addTag = (tagToAdd: string) => {
    const trimmed = tagToAdd.trim();
    if (trimmed && !tags.includes(trimmed)) {
      // Type assertion to ensure compatibility
      setValue(name, [...tags, trimmed] as T[Path<T>]);
      setInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag: string) => tag !== tagToRemove);
    setValue(name, newTags as T[Path<T>]);
  };

  const filteredSuggestions = tagsAvailable.filter(
    (tag) =>
      !tags.includes(tag) && tag.toLowerCase().includes(input.toLowerCase()),
  );

  return (
    <div className="space-y-2">
      <FormLabel>{label}</FormLabel>
      <Popover open={isPopoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            {/* The input is now inside the PopoverTrigger */}
            <input
              type="text"
              placeholder={placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag(input);
                }
              }}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput
              placeholder="Search or create a new tag..."
              value={input}
              onValueChange={setInput}
            />
            <CommandList>
              <CommandEmpty>
                {input.trim() ? (
                  <div
                    className="cursor-pointer p-2 text-sm"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      addTag(input);
                      setPopoverOpen(false);
                    }}
                  >
                    Create new tag: "{input}"
                  </div>
                ) : (
                  <div className="p-2 text-sm text-muted-foreground">
                    Type to search or create a new tag.
                  </div>
                )}
              </CommandEmpty>
              <CommandGroup>
                {filteredSuggestions.map((tag) => (
                  <CommandItem
                    key={tag}
                    onSelect={() => {
                      addTag(tag);
                      setPopoverOpen(false);
                    }}
                  >
                    {tag}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FormDescription>
        Press Enter to add a new tag or select from the list.
      </FormDescription>
      <div className="flex flex-wrap gap-2 pt-2">
        {Array.isArray(tags) &&
          tags.map((tag: string) => (
            <button
              type="button"
              key={tag}
              className="flex items-center gap-1 bg-primary text-primary-foreground hover:bg-destructive px-3 py-1.5 rounded-full text-sm font-medium"
              onClick={() => removeTag(tag)}
            >
              {tag}
              <X className="h-3 w-3" />
            </button>
          ))}
      </div>
    </div>
  );
};

export default TagInput;
