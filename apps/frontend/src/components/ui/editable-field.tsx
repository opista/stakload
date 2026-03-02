import { ElementType, FocusEvent, FormEvent, KeyboardEvent, MouseEvent, useEffect, useRef, useState } from "react";

import { Tooltip } from "@components/ui/tooltip";
import { cn } from "@util/cn";

type EditableFieldProps = {
  as?: ElementType;
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
  const ref = useRef<HTMLElement>(null);
  const clickPosRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (editable && ref.current) {
      ref.current.focus();

      let range: Range | null = null;
      if (clickPosRef.current) {
        const { x, y } = clickPosRef.current;
        if (typeof document.caretRangeFromPoint === "function") {
          range = document.caretRangeFromPoint(x, y);
        } else if (typeof document.caretPositionFromPoint === "function") {
          const position = document.caretPositionFromPoint(x, y);
          if (position) {
            range = document.createRange();
            range.setStart(position.offsetNode, position.offset);
            range.collapse(true);
          }
        }
        clickPosRef.current = null;
      }

      if (!range) {
        range = document.createRange();
        range.selectNodeContents(ref.current);
        range.collapse(false);
      }

      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [editable]);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (editable) return;
    clickPosRef.current = { x: event.clientX, y: event.clientY };
    setEditable(true);
  };

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
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

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
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

  const handleInput = (event: FormEvent<HTMLElement>) => {
    const text = event.currentTarget.innerText.trim();
    if (!text && event.currentTarget.innerHTML.includes("<br")) {
      event.currentTarget.innerHTML = "";
    }
  };

  return (
    <Tooltip label={label} disabled={editable} side="right" align="center">
      <Component
        ref={ref}
        className={cn(
          "relative cursor-text select-none outline-none transition-colors",
          "after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:border-b-2 after:border-dashed after:border-white/25 after:content-['']",
          "hover:after:border-current data-[active=true]:after:border-current",
          "empty:inline-block empty:min-w-[1ch] empty:before:content-['\\200b']",
          className,
        )}
        contentEditable={editable}
        data-active={editable}
        onBlur={handleBlur}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        suppressContentEditableWarning
      >
        {value}
      </Component>
    </Tooltip>
  );
};
