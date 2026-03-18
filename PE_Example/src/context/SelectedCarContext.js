import React, { createContext, useContext, useMemo, useState } from 'react';

const SelectedCarContext = createContext(null);

export function SelectedCarProvider({ children }) {
  const [selectedCar, setSelectedCar] = useState(null);

  const value = useMemo(
    () => ({
      selectedCar,
      setSelectedCar
    }),
    [selectedCar]
  );

  return <SelectedCarContext.Provider value={value}>{children}</SelectedCarContext.Provider>;
}

export function useSelectedCar() {
  const context = useContext(SelectedCarContext);

  if (!context) {
    throw new Error('useSelectedCar must be used inside SelectedCarProvider');
  }

  return context;
}
