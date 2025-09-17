import { FormControl, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import React from "react";

const TagInput = (props: {
  label: string;
  placeholder: string;
  setValue: any;
  watch: any;
  name: any;
}) => {
  const [input, setInput] = React.useState<string>("");
  const tags = props.watch(props.name);
  const handleKeyDown = (e:any) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const trimmed = input.trim();
      if (trimmed && !tags.includes(trimmed)) {
        props.setValue(props.name, [...tags, trimmed]);
        setInput("");
      }
    }
  };
  const removeTag = (tagToRemove: string) => {
    props.setValue(
      props.name,
      tags.filter((tag: string) => tag !== tagToRemove),
    );
  };
  return (
    <div className="space-y-2">
      <FormLabel>{props.label}</FormLabel>
      <FormControl>
        <Input
          type="text"
          placeholder={props.placeholder}
          value={input}
          onChange={(e:any) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </FormControl>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag: string, index: number) => (
          <button
            key={index}
            className="flex items-center bg-gray-800  text-white hover:bg-red-400 px-3 py-2 rounded-full text-sm"
            onClick={() => removeTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TagInput;
