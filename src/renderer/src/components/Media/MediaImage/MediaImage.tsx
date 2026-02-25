import { modals } from "@mantine/modals";
import { useTranslation } from "react-i18next";

export type MediaImageProps = {
  src: string;
};

export const MediaImage = ({ src }: MediaImageProps) => {
  const { t } = useTranslation();

  return (
    <button
      className="relative flex h-full w-full overflow-hidden rounded-lg bg-neutral-800 transition-transform hover:scale-[1.02] active:scale-[0.98]"
      onClick={() =>
        modals.open({
          centered: true,
          children: <img className="block max-h-[85vh] w-full object-contain" src={src} />,
          size: "auto",
          title: t("mediaImage.title"),
        })
      }
      type="button"
    >
      <div className="h-full w-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${src})` }} />
    </button>
  );
};
