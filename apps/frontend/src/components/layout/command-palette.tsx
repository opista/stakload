import { Dialog } from "@base-ui/react/dialog";
import { GameCover } from "@components/game/game-cover";
import { SHORTCUT_KEYS } from "@constants/shortcuts";
import { useCommandPaletteStore } from "@store/command-palette.store";
import { useGameStore } from "@store/game.store";
import { IconSearch } from "@tabler/icons-react";
import { cn } from "@util/cn";
import { mapLibraryIcon } from "@util/map-library-icon";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useShallow } from "zustand/react/shallow";

export const CommandPalette = () => {
  const { close, isOpen, open } = useCommandPaletteStore();
  const games = useGameStore(useShallow((state) => state.gamesList));
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredGames =
    games?.filter((game) => game.name.toLowerCase().includes(query.toLowerCase())).slice(0, 10) || [];

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === SHORTCUT_KEYS.SEARCH[1].toLowerCase()) {
        event.preventDefault();
        open();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) => (prev + 1) % filteredGames.length);
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prev) => (prev - 1 + filteredGames.length) % filteredGames.length);
    } else if (e.key === "Enter" && filteredGames[selectedIndex]) {
      navigate(`/library/${filteredGames[selectedIndex]._id}`);
      close();
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && close()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-md" />
        <Dialog.Popup
          className="fixed top-[20%] left-1/2 z-[1001] w-full max-w-2xl -translate-x-1/2 overflow-hidden rounded-2xl bg-[#1b2c3b] shadow-2xl ring-1 ring-white/10"
          onKeyDown={handleKeyDown}
        >
          <div className="flex items-center gap-3 border-b border-white/5 p-4">
            <IconSearch className="text-neutral-500" size={20} />
            <input
              ref={inputRef}
              className="flex-1 bg-transparent text-lg text-white placeholder-neutral-500 outline-none"
              placeholder={t("common.search")}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
            />
          </div>

          <div className="max-h-[400px] overflow-y-auto p-2">
            {filteredGames.length > 0 ? (
              filteredGames.map((game, index) => {
                const { icon: LibIcon } = mapLibraryIcon(game.library);
                return (
                  <button
                    key={game._id}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl p-2 transition-colors",
                      index === selectedIndex ? "bg-cyan-500 text-white" : "hover:bg-white/5 text-neutral-400",
                    )}
                    onClick={() => {
                      navigate(`/library/${game._id}`);
                      close();
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <GameCover game={game} showGameTitle={false} className="h-10 w-8 shrink-0 rounded" />
                    <span
                      className={cn(
                        "flex-1 text-left font-semibold",
                        index === selectedIndex ? "text-white" : "text-neutral-200",
                      )}
                    >
                      {game.name}
                    </span>
                    <LibIcon size={18} className="opacity-50" />
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center text-neutral-500">{t("spotlight.noResultsFound")}</div>
            )}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
