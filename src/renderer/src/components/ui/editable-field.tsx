import { Tooltip } from "@components/ui/tooltip";
import { cn } from "@util/cn";
import { ElementType, FocusEvent, KeyboardEvent, useState } from "react";

type EditableFieldProps = {
  as: ElementType;
  className?: string;
  label: string;
  maxLength?: number;
  onBlur: (value: string) => void;
  value: string;
};

export const EditableField = ({
  as: Component = "div",
  className,
  label,
  maxLength,
  onBlur,
  value,
}: EditableFieldProps) => {
  const [editable, setEditable] = useState(false);

  const handleBlur = (event: FocusEvent<HTMLHeadingElement>) => {
    setEditable(false);

    const editableValue = event.currentTarget.innerText.trim();

    if (!editableValue) {
      event.currentTarget.innerText = value;
      return;
    }

    if (editableValue !== value) {
      onBlur?.(editableValue);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLHeadingElement>) => {
    const currentLength = event.currentTarget.innerText.length;

    // Prevent input if we're at max length, unless it's a deletion or navigation key
    const allowedKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Delete", "Backspace", "Enter", "Escape"];
    if (
      maxLength &&
      currentLength >= maxLength &&
      !allowedKeys.includes(event.key) &&
      !event.metaKey &&
      !event.ctrlKey
    ) {
      event.preventDefault();
      return;
    }

    if (["ArrowLeft", "ArrowRight", "Delete", "Backspace"].includes(event.key)) {
      event.stopPropagation();
      return;
    }

    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      event.stopPropagation();
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(event.currentTarget);
      range.collapse(event.key === "ArrowUp"); // true for start (up), false for end (down)
      selection?.removeAllRanges();
      selection?.addRange(range);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      event.currentTarget.blur();
    }

    if (event.key === "Escape") {
      event.preventDefault();
      event.currentTarget.innerText = value;
      setEditable(false);
    }
  };

  return (
    <Tooltip label={label} opened={editable ? false : undefined} position="right">
      <Component
        className={cn(
          "relative cursor-text select-none outline-none transition-colors",
          "after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:border-b-2 after:border-dashed after:border-white/25 after:content-['']",
          "hover:after:border-current data-[active=true]:after:border-current",
          className,
        )}
        contentEditable={editable}
        data-active={editable}
        onBlur={handleBlur}
        onClick={() => setEditable(true)}
        onKeyDown={handleKeyDown}
        suppressContentEditableWarning
      >
        {value}
      </Component>
    </Tooltip>
  );
};
