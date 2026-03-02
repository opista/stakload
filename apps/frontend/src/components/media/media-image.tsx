import { useTranslation } from "react-i18next";

import { useModalStore } from "@store/modal.store";

export type MediaImageProps = {
  src: string;
};

export const MediaImage = ({ src }: MediaImageProps) => {
  const { t } = useTranslation();
  const openModal = useModalStore((state) => state.openModal);

  return (
    <button
      className="relative flex h-full w-full overflow-hidden rounded-xl bg-neutral-800 transition-transform hover:scale-[1.02] active:scale-[0.98]"
      onClick={() =>
        openModal("media", {
          children: <img className="block max-h-[85vh] w-full object-contain" src={src} />,
          title: t("mediaImage.title"),
        })
      }
      type="button"
    >
      <div className="h-full w-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${src})` }} />
    </button>
  );
};
