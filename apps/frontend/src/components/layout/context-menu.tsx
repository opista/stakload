import { ContextMenu } from "@base-ui/react/context-menu";
import { cn } from "@util/cn";
import { createContext, MouseEvent as ReactMouseEvent, ReactNode, useCallback, useContext, useState } from "react";

export interface ContextMenuItem {
  color?: string;
  divider?: boolean;
  hidden?: boolean;
  icon?: ReactNode;
  key: string;
  onClick?: () => void;
  title?: string;
}

interface ContextMenuContextType {
  showContextMenu: (items: ContextMenuItem[]) => (e: ReactMouseEvent<HTMLElement>) => void;
}

const ContextMenuContext = createContext<ContextMenuContextType | null>(null);

export const useContextMenu = () => {
  const context = useContext(ContextMenuContext);
  if (!context) throw new Error("useContextMenu must be used within ContextMenuProvider");
  return context;
};

export const ContextMenuProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<ContextMenuItem[]>([]);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const showContextMenu = useCallback(
    (newItems: ContextMenuItem[]) => (e: ReactMouseEvent<HTMLElement>) => {
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
      <ContextMenu.Root open={isOpen} onOpenChange={setIsOpen}>
        {/* Trigger with virtual element for the recorded position */}
        <ContextMenu.Trigger render={<div style={{ left: position.x, position: "fixed", top: position.y }} />} />
        <ContextMenu.Portal>
          <ContextMenu.Positioner side="right" align="start">
            <ContextMenu.Popup className="animate-in fade-in zoom-in-95 z-[9999] min-w-[200px] overflow-hidden rounded-xl bg-[#2b2b2b] p-1.5 shadow-2xl ring-1 ring-white/10 duration-200 outline-none">
              {items.map((item) => {
                if (item.key.includes("divider")) {
                  return <ContextMenu.Separator key={item.key} className="my-1 h-px bg-white/5" />;
                }

                return (
                  <ContextMenu.Item
                    key={item.key}
                    onSelect={() => {
                      item.onClick?.();
                    }}
                    className={cn(
                      "flex w-full cursor-pointer select-none items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors outline-none focus:bg-white/5 data-[highlighted]:bg-white/5",
                      item.color === "red" ? "text-red-400 hover:text-red-300" : "text-neutral-200 hover:text-white",
                    )}
                  >
                    <span className="shrink-0 opacity-70">{item.icon}</span>
                    <span className="flex-1 text-left">{item.title}</span>
                  </ContextMenu.Item>
                );
              })}
            </ContextMenu.Popup>
          </ContextMenu.Positioner>
        </ContextMenu.Portal>
      </ContextMenu.Root>
      {children}
    </ContextMenuContext.Provider>
  );
};
