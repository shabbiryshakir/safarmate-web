import { useState, useEffect } from 'react';

const defaultJourneyState = {
  journeyActive: false,
  language: 'lsd', 
  
  // App-level preferences
  settings: {
    gpsEnabled: null, // true/false if they opt-in to location verification
  },

  departure: {
    transportMode: null, // 'car', 'bus', 'train', 'plane', 'ship'
    destinationIsMecca: null, // The Absolute Override
    isOver12Miles: null,
    originType: null,    
    hasCrossedHadd: false,
    
    // Exception: Mid-Journey Cancellation
    journeyCancelled: false, 
    cancelledBefore12Miles: null 
  },

  roza: {
    isFasting: null,
    departureTime: null,
    transitDelayed: null, // Exception: Left house before dawn, but transport delayed
    arrivalTime: null,
    status: 'PENDING'
  },

  destination: {
    arrived: false,
    wizardComplete: false,
    stayed30Days: false, // Exception: Default Muqeem after 1 month
    
    // Pillar 1: Property with Land Share Nuance
    property: { owns: null, isFlat: null, hasLandShare: null, prayedOneFarz: null },
    
    // Pillar 2: Intention
    intention10Days: { made: null, leftEarly: false, departureWasAvoidable: null },
    
    // Pillar 3: Mahram
    mahram: { categorySelected: null, isValidCategory: null, faceToFaceMet: null, staying5Farz: null, hasLeftEarly: false },
  },
  
  currentStatus: 'PENDING',
};

export function useJourney() {
  const [journey, setJourney] = useState(() => {
    const savedData = localStorage.getItem('safarCompanionState');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      
      // Auto-repair script: Ensures older saves don't crash when we add new variables
      if (!parsed.settings) parsed.settings = defaultJourneyState.settings;
      if (parsed.departure.destinationIsMecca === undefined) {
        parsed.departure.destinationIsMecca = null;
        parsed.departure.transportMode = null;
        parsed.departure.journeyCancelled = false;
        parsed.departure.cancelledBefore12Miles = null;
      }
      if (parsed.roza && parsed.roza.transitDelayed === undefined) parsed.roza.transitDelayed = null;
      if (parsed.destination && parsed.destination.property.isFlat === undefined) {
        parsed.destination.property.isFlat = null;
        parsed.destination.property.hasLandShare = null;
        parsed.destination.stayed30Days = false;
      }
      
      return parsed;
    }
    return defaultJourneyState;
  });

  useEffect(() => {
    localStorage.setItem('safarCompanionState', JSON.stringify(journey));
  }, [journey]);

  const resetJourney = () => setJourney(defaultJourneyState);

  return { journey, setJourney, resetJourney };
}