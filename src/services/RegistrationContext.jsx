import React, { createContext, useState, useEffect } from 'react';

export const RegistrationContext = createContext();

export const RegistrationProvider = ({ children }) => {
  const [isPreRegistered, setIsPreRegistered] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    console.log('RegistrationContext state:', { isPreRegistered, isRegistered });
  }, [isPreRegistered, isRegistered]);

  return (
    <RegistrationContext.Provider value={{ isPreRegistered, setIsPreRegistered, isRegistered, setIsRegistered }}>
      {children}
    </RegistrationContext.Provider>
  );
};
