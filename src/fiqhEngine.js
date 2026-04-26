/**
 * PURE FIQH ENGINE - PERFECTED TIMELINE & ROZA LOGIC
 */

export function evaluateJourney(data) {
  
  if (data.isOver12Miles === null) return { step: 'ASK_DISTANCE', status: 'PENDING' };
  if (data.isOver12Miles === false) return { step: 'DASHBOARD', status: 'MUQEEM', reason: 'under_12_miles' };

  if (data.isRamadan === null) return { step: 'ASK_RAMADAN', status: 'PENDING' };
  if (data.isRamadan === true) {
      if (data.departTime === null) return { step: 'ASK_DEPART_TIME', status: 'PENDING' };
  }

  if (!data.transportMode) return { step: 'ASK_TRANSPORT', status: 'PENDING' };
  
  if (data.transportMode === 'car') {
      if (!data.hasDeparted) return { step: 'ASK_CAR_DEPARTURE', status: 'MUQEEM' };
  } else {
      if (data.isInsideHadd === null) return { step: 'ASK_HADD', status: 'PENDING' };
      if (!data.hasDeparted) return { step: 'TRANSIT_DASHBOARD', status: 'MUQEEM', subState: 'STANDBY' };
  }

  if (!data.hasArrived) {
      if (data.journeyCancelled) return { step: 'DASHBOARD', status: 'MUQEEM', reason: 'cancelled' };
      return { step: 'TRANSIT_DASHBOARD', status: 'MUSAFIR', subState: 'IN_TRANSIT' };
  }

  // Handle Exception Screens Intercepts
  if (data.trigger10DaysException && !data.leftBefore10Days) return { step: 'ASK_EXC_10DAYS', status: 'MUQEEM' };
  if (data.triggerMahramException && !data.mahramLeftEarly) return { step: 'ASK_EXC_MAHRAM', status: 'MUQEEM' };

  if (!data.arrivalPillarChoice) return { step: 'ASK_PILLAR_MENU', status: 'MUSAFIR' };

  let determinedStatus = 'MUSAFIR'; 
  if (data.arrivalPillarChoice === 'brief') {
      determinedStatus = 'MUSAFIR';
  } else if (data.arrivalPillarChoice === '10days') {
      determinedStatus = 'MUQEEM'; 
  } else if (data.arrivalPillarChoice === 'property') {
      if (data.isFlat === null) return { step: 'ASK_PROPERTY_FLAT', status: 'MUSAFIR' };
      if (data.isFlat === true && data.hasLandShare === null) return { step: 'ASK_PROPERTY_LAND', status: 'MUSAFIR' };
      const validProperty = data.isFlat === false || data.hasLandShare === true;
      if (validProperty) {
          if (data.prayedOneFarz === null) return { step: 'ASK_PROPERTY_FARZ', status: 'MUSAFIR' };
          if (data.prayedOneFarz === true) determinedStatus = 'MUQEEM';
      }
  } else if (data.arrivalPillarChoice === 'mahram') {
      if (data.mahramValidCategory === null) return { step: 'ASK_MAHRAM_CAT', status: 'MUSAFIR' };
      if (data.mahramValidCategory === true) {
          if (data.mahramFaceToFace === null) return { step: 'ASK_MAHRAM_FACE', status: 'MUSAFIR' };
          if (data.mahramFaceToFace === true) {
              if (data.mahramStay5Farz === null) return { step: 'ASK_MAHRAM_5FARZ', status: 'MUSAFIR' };
              if (data.mahramStay5Farz === true) determinedStatus = 'MUQEEM';
          }
      }
  } else if (data.arrivalPillarChoice === 'guide') {
      if (data.ownsProperty === null) return { step: 'ASK_PROPERTY', status: 'MUSAFIR' };
      if (data.ownsProperty === true) {
          if (data.isFlat === null) return { step: 'ASK_PROPERTY_FLAT', status: 'MUSAFIR' };
          if (data.isFlat === true && data.hasLandShare === null) return { step: 'ASK_PROPERTY_LAND', status: 'MUSAFIR' };
          const validProp = data.isFlat === false || data.hasLandShare === true;
          if (validProp) {
              if (data.prayedOneFarz === null) return { step: 'ASK_PROPERTY_FARZ', status: 'MUSAFIR' };
              if (data.prayedOneFarz === true) determinedStatus = 'MUQEEM';
          }
      }
      if (determinedStatus === 'MUSAFIR') {
          if (data.intends10Days === null) return { step: 'ASK_10_DAYS', status: 'MUSAFIR' };
          if (data.intends10Days === true) determinedStatus = 'MUQEEM';
      }
      if (determinedStatus === 'MUSAFIR') {
          if (data.mahramValidCategory === null) return { step: 'ASK_MAHRAM_CAT', status: 'MUSAFIR' };
          if (data.mahramValidCategory === true) {
              if (data.mahramFaceToFace === null) return { step: 'ASK_MAHRAM_FACE', status: 'MUSAFIR' };
              if (data.mahramFaceToFace === true) {
                  if (data.mahramStay5Farz === null) return { step: 'ASK_MAHRAM_5FARZ', status: 'MUSAFIR' };
                  if (data.mahramStay5Farz === true) determinedStatus = 'MUQEEM';
              }
          }
      }
  }

  let rozaToday = 'N/A';
  if (data.isRamadan === true) {
      
      // FIXED: Always ask the arrival time if they have reached the destination, regardless of departure status.
      if (data.hasArrived && data.arriveTime === null) {
          const isTenDays = (data.arrivalPillarChoice === '10days' || data.intends10Days === true);
          return { 
              step: 'ASK_ARRIVE_TIME', 
              status: determinedStatus,
              rozaType: isTenDays ? 'shafa_check' : 'zawal_check' 
          };
      }

      // Calculate Today's Fast based on full timeline
      if (data.departTime === 'after_zawal') {
          rozaToday = 'VALID';
      } else if (data.departTime === 'shafa_to_zawal' || determinedStatus === 'MUSAFIR') {
          rozaToday = 'BROKEN';
      } else {
          rozaToday = (data.arriveTime === 'before_limit') ? 'VALID' : 'BROKEN';
      }
  }

  // Dashboard Future Overrides 
  let finalDashboardStatus = determinedStatus;
  if (data.stayed30Days === true) finalDashboardStatus = 'MUQEEM';
  if (data.leftBefore10Days === 'avoidable' || data.leftBefore10Days === 'unavoidable') finalDashboardStatus = 'MUSAFIR';
  if (data.mahramLeftEarly === 'before_5' || data.mahramLeftEarly === 'after_5') finalDashboardStatus = 'MUSAFIR';

  // Calculate Tomorrow's Fast dynamically based on the Live Dashboard Override Status
  let rozaTomorrow = 'N/A';
  if (data.isRamadan === true) {
      rozaTomorrow = (finalDashboardStatus === 'MUQEEM') ? 'MUST_FAST' : 'NO_FAST';
  }
  
  return { step: 'DASHBOARD', status: finalDashboardStatus, rozaToday, rozaTomorrow };
}