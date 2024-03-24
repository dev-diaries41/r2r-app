import React, { createContext, useState, ReactNode, useContext } from 'react';

interface LandlordContextProps {
  landlordRequests: any[]; 
  setLandlordRequests: React.Dispatch<React.SetStateAction<any[]>>; 
  landlordAgreements: any[]; 
  setLandlordAgreements: React.Dispatch<React.SetStateAction<any[]>>; 
  listings: any | null;
  setListings: React.Dispatch<React.SetStateAction<any | null>>; 
}

const LandlordContext = createContext<LandlordContextProps | undefined>(undefined);

interface LandlordProviderProps {
  children: ReactNode;
}

const LandlordProvider = ({ children }: LandlordProviderProps) => {
  const [landlordRequests, setLandlordRequests] = useState<any[]>([]);
  const [landlordAgreements, setLandlordAgreements] = useState<any[]>([]);
  const [listings, setListings] = useState<any | null>(null);

  return (
    <LandlordContext.Provider value={{
      landlordRequests,
      setLandlordRequests,
      landlordAgreements,
      setLandlordAgreements,
      listings,
      setListings,
    }}>
      {children}
    </LandlordContext.Provider>
  );
};

const useLandlordContext = (): LandlordContextProps => {
    const context = useContext(LandlordContext);
    if (!context) {
      throw new Error('useLandlordContext must be used within a LandlordProvider');
    }
    return context;
  };


export { LandlordContext, LandlordProvider, useLandlordContext };
