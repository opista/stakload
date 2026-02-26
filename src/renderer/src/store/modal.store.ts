import { create } from "zustand";

interface ModalState {
  isOpen: boolean;
  props: any;
  view: string | null;
}

interface ModalStore extends ModalState {
  closeModal: () => void;
  openModal: (view: string, props?: any) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  closeModal: () => set({ isOpen: false, props: {}, view: null }),
  isOpen: false,
  openModal: (view, props = {}) => set({ isOpen: true, props, view }),
  props: {},
  view: null,
}));
