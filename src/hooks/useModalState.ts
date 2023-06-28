import { useCallback, useState } from "react";

interface ModalState {
  show: boolean;
}

export const useModalState = <TState extends ModalState>(
  initialState: TState
) => {
  const [modalState, setModalState] = useState<TState>(initialState);

  const closeModal = useCallback(
    () => setModalState((prev) => ({ ...prev, show: false })),
    []
  );
  const updateModalState = useCallback(
    (newModalState: Partial<TState>) =>
      setModalState((prev) => ({ ...prev, ...newModalState })),
    []
  );

  return [modalState, closeModal, updateModalState] as const;
};
