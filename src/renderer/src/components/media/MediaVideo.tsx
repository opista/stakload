import { useModalStore } from "@store/modal.store";
import { IconPlayerPlayFilled } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

const getThumbnailUrl = (watchId: string) => `https://img.youtube.com/vi/${watchId}/hqdefault.jpg`;

const getEmbedUrl = (watchId: string) => `https://www.youtube.com/embed/${watchId}?autoplay=1`;

type MediaVideoProps = {
  id: string;
};

export const MediaVideo = ({ id }: MediaVideoProps) => {
  const { t } = useTranslation();
  const openModal = useModalStore((state) => state.openModal);

  if (!id) return;

  const thumbnailSrc = getThumbnailUrl(id);
  const embedSrc = getEmbedUrl(id);

  return (
    <button
      className="group relative flex h-full w-full overflow-hidden rounded-xl bg-neutral-800 transition-transform hover:scale-[1.02] active:scale-[0.98]"
      onClick={() =>
        openModal("media", {
          children: (
            <div className="aspect-video w-full">
              <iframe
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full border-none"
                src={embedSrc}
              />
            </div>
          ),
          title: t("media" as any),
        })
      }
      type="button"
    >
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/40">
        <IconPlayerPlayFilled className="h-12 w-12 text-white opacity-80 transition-opacity group-hover:opacity-100" />
      </div>
      <div
        className="h-full w-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${thumbnailSrc})` }}
      />
    </button>
  );
};
