import { cn } from "@util/cn";
import React, { createContext, useCallback, useContext, useState } from "react";
import { createPortal } from "react-dom";

export interface ContextMenuItem {
  color?: string;
  divider?: boolean;
  hidden?: boolean;
  icon?: React.ReactNode;
  key: string;
  onClick?: () => void;
  title?: string;
}

interface ContextMenuContextType {
  showContextMenu: (items: ContextMenuItem[]) => (e: React.MouseEvent) => void;
}

const ContextMenuContext = createContext<ContextMenuContextType | null>(null);

export const useContextMenu = () => {
  const context = useContext(ContextMenuContext);
  if (!context) throw new Error("useContextMenu must be used within ContextMenuProvider");
  return context;
};

export const ContextMenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<ContextMenuItem[]>([]);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const showContextMenu = useCallback(
    (newItems: ContextMenuItem[]) => (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setItems(newItems.filter((item) => !item.hidden));
      setPosition({ x: e.clientX, y: e.clientY });
      setIsOpen(true);
    },
    [],
  );

  return (
    <ContextMenuContext.Provider value={{ showContextMenu }}>
      {children}
      {isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999]"
            onMouseDown={() => setIsOpen(false)}
            onContextMenu={(e) => {
              e.preventDefault();
              setIsOpen(false);
            }}
          >
            <div
              className="absolute min-w-[200px] overflow-hidden rounded-xl bg-[#2b2b2b] p-1.5 shadow-2xl ring-1 ring-white/10"
              style={{ left: position.x, top: position.y }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              {items.map((item) => {
                if (item.key.includes("divider")) {
                  return <div key={item.key} className="my-1 h-px bg-white/5" />;
                }

                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      item.onClick?.();
                      setIsOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-white/5",
                      item.color === "red" ? "text-red-400 hover:text-red-300" : "text-neutral-200 hover:text-white",
                    )}
                  >
                    <span className="shrink-0 opacity-70">{item.icon}</span>
                    <span className="flex-1 text-left">{item.title}</span>
                  </button>
                );
              })}
            </div>
          </div>,
          document.body,
        )}
    </ContextMenuContext.Provider>
  );
};
