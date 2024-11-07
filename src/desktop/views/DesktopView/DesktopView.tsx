import { AppShell, Divider, ScrollArea } from "@mantine/core";
import { useSettings } from "../../../hooks/use-settings";
import { SearchControl } from "../../../components/SearchControl/SearchControl";
import { Spotlight } from "../../../components/Spotlight/Spotlight";
import { Header } from "../../components/Header/Header";
import { GameNavigation } from "../../components/GameNavigation/GameNavigation";
import { useRxCollection, useRxQuery } from "rxdb-hooks";
import { GameStoreModel } from "../../../database/schema/game.schema";

export const DesktopView = () => {
  const { settings, updateSetting } = useSettings();
  const collection = useRxCollection<GameStoreModel>("games");

  const query = collection?.find({ sort: [{ name: "asc" }] });

  const { result: games } = useRxQuery(query);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm" }}
      padding="md"
    >
      <Spotlight />
      <AppShell.Header>
        <Header />
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <AppShell.Section>
          <SearchControl />
          <Divider my="md" />
        </AppShell.Section>
        <AppShell.Section component={ScrollArea}>
          <GameNavigation games={games} />
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>
        <div>
          settings: {JSON.stringify(settings, null, "\t")}
          <p className="text-3xl font-bold underline">
            binaryVersion: {window.NL_VERSION}
          </p>
          <p>clientVersion: {window.NL_CVERSION}</p>
        </div>
        <button onClick={() => updateSetting("bar", Math.random())}>
          update
        </button>
      </AppShell.Main>
    </AppShell>
  );
};
