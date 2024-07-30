import React, { createContext, useState } from 'react';

export const RegistrationContext = createContext();

export const RegistrationProvider = ({ children }) => {
  const [isPreRegistered, setIsPreRegistered] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  return (
    <RegistrationContext.Provider value={{ isPreRegistered, setIsPreRegistered, isRegistered, setIsRegistered }}>
      {children}
    </RegistrationContext.Provider>
  );
};
