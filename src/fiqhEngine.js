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

// ... (keep your existing evaluateJourney function exactly as it is) ...

/**
 * GENERATES THE PLAIN-TEXT AUDIT TRAIL FOR THE VERDICT SCREEN
 */
export function generateAuditTrail(data) {
  let narrative = [];

  if (data.isOver12Miles === false) {
    return "You indicated your destination is less than 12 miles away (or less than a 24-mile round trip). Safar rules do not apply.";
  }

  // 1. Distance & Transport
  let transportStr = data.transportMode === 'car' ? 'Car' : data.transportMode === 'plane_ship' ? 'Flight/Ship' : 'Train/Bus';
  narrative.push(`You are traveling over 12 miles via ${transportStr}.`);

  // 2. Departure Status
  if (data.transportMode === 'car' && data.hasDeparted) {
    narrative.push("You have departed your home.");
  } else if (data.transportMode !== 'car') {
    if (data.isInsideHadd) {
      narrative.push(`Your station/airport is INSIDE the city boundary.`);
    } else if (data.isInsideHadd === false) {
      narrative.push(`Your station/airport is OUTSIDE the city boundary.`);
    }
  }

  // 3. Ramadan & Timing
  if (data.isRamadan) {
    let timeStr = "";
    if (data.departTime === 'before_shafa') timeStr = "before Dawn (Shafa)";
    if (data.departTime === 'shafa_to_zawal') timeStr = "between Dawn and Zawal";
    if (data.departTime === 'after_zawal') timeStr = "after Zawal";
    
    // DYNAMIC ARRIVAL LIMIT TEXT
    let arriveStr = "";
    let limitName = (data.arrivalPillarChoice === '10days' || data.intends10Days) ? "Dawn (Shafa)" : "Zawal";
    
    if (data.arriveTime === 'before_limit') arriveStr = ` and arrived before ${limitName}`;
    if (data.arriveTime === 'after_limit') arriveStr = ` and arrived after ${limitName}`;

    narrative.push(`You are traveling during Ramadan, departing ${timeStr}${arriveStr}.`);
  }

  // 4. Arrival Intent
  if (data.arrivalPillarChoice) {
    if (data.arrivalPillarChoice === 'brief') {
      narrative.push("You intend a brief visit (less than 10 days) at your destination.");
    } else if (data.arrivalPillarChoice === '10days' || data.intends10Days) {
      narrative.push("You intend to stay for 10 full days at your destination.");
    } else if (data.arrivalPillarChoice === 'property') {
      let landStr = data.hasLandShare ? "with a legal land share" : "without a legal land share";
      narrative.push(`You are traveling to a property you own (${landStr}).`);
    } else if (data.arrivalPillarChoice === 'mahram') {
      let catStr = data.mahramCategory ? data.mahramCategory.toUpperCase() : "a Mahram";
      let farzStr = data.mahramStay5Farz ? "and intend to stay for at least 5 Farz prayers" : "but will stay for less than 5 Farz prayers";
      narrative.push(`You are traveling to visit ${catStr} ${farzStr}.`);
    }
  }

  return narrative.join(" ");
}