import React, { createContext, useState, ReactNode, useContext } from 'react';

interface SubletterContextProps {
  subletterRequests: any[]; 
  setSubletterRequests: React.Dispatch<React.SetStateAction<any[]>>; 
  subletterAgreements: any[]; 
  setSubletterAgreements: React.Dispatch<React.SetStateAction<any[]>>; 
}

const SubletterContext = createContext<SubletterContextProps | undefined>(undefined);

interface SubletterProviderProps {
  children: ReactNode;
}

const SubletterProvider = ({ children }: SubletterProviderProps) => {
  const [subletterRequests, setSubletterRequests] = useState<any[]>([]);
  const [subletterAgreements, setSubletterAgreements] = useState<any[]>([]);

  return (
    <SubletterContext.Provider value={{
      subletterRequests,
      setSubletterRequests,
      subletterAgreements,
      setSubletterAgreements,
    }}>
      {children}
    </SubletterContext.Provider>
  );
};

const useSubletterContext = (): SubletterContextProps => {
    const context = useContext(SubletterContext);
    if (!context) {
      throw new Error('useSubletterContext must be used within a SubletterProvider');
    }
    return context;
  };


export { SubletterContext, SubletterProvider, useSubletterContext };
