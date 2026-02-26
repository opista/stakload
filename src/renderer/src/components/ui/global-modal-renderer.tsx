import { RemoveGameModal } from "@components/layout/desktop/modals/remove-game-modal";
import { useModalStore } from "@store/modal.store";
import { useShallow } from "zustand/react/shallow";

// Import other modals as they are migrated if needed
import { Modal } from "./modal";

const MODAL_COMPONENTS: Record<string, any> = {
  media: ({ children, onClose, opened, title }: any) => (
    <Modal opened={opened} onClose={onClose} title={title} size="xl">
      {children}
    </Modal>
  ),
  removeGame: RemoveGameModal,
};

export const GlobalModalRenderer = () => {
  const { closeModal, isOpen, props, view } = useModalStore(
    useShallow((state) => ({
      closeModal: state.closeModal,
      isOpen: state.isOpen,
      props: state.props,
      view: state.view,
    })),
  );

  if (!isOpen || !view) return null;

  const ModalComponent = MODAL_COMPONENTS[view];
  if (!ModalComponent) return null;

  return <ModalComponent opened={isOpen} onClose={closeModal} {...props} />;
};

