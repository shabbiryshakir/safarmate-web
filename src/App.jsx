import React, { useState, useEffect } from 'react';
import { dict } from './dictionary';
import { evaluateJourney } from './fiqhEngine';
import './index.css';

// Premium SVG Icon Set (Replaces Emojis)
const Icons = {
  Compass: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>,
  Check: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Car: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>,
  Pin: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Hourglass: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V2"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/></svg>,
  Edit: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>,
  Refresh: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
};

const defaultJourneyData = {
  isOver12Miles: null, isRamadan: null, departTime: null, transportMode: null,
  isInsideHadd: null, hasDeparted: false, hasArrived: false, journeyCancelled: false,
  arrivalPillarChoice: null, ownsProperty: null, isFlat: null, hasLandShare: null,
  prayedOneFarz: null, intends10Days: null, mahramCategory: null, mahramValidCategory: null,
  mahramFaceToFace: null, mahramStay5Farz: null, arriveTime: null,
  stayed30Days: false, trigger10DaysException: false, leftBefore10Days: null,
  triggerMahramException: false, mahramLeftEarly: null,
};

export default function App() {
  const t = dict['en'];

  const [journeyData, setJourneyData] = useState(() => {
    const saved = localStorage.getItem('safarDataV10');
    return saved ? JSON.parse(saved) : defaultJourneyData;
  });

  useEffect(() => {
    localStorage.setItem('safarDataV10', JSON.stringify(journeyData));
  }, [journeyData]);

  const [futureDateStr, setFutureDateStr] = useState('');
  useEffect(() => {
    const date = new Date();
    date.setDate(date.getDate() + 10);
    setFutureDateStr(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  }, []);

  const [showExceptions, setShowExceptions] = useState(false);

  const { step, status, subState, rozaToday, rozaTomorrow } = evaluateJourney(journeyData);

  const updateData = (updates) => {
    setJourneyData(prev => ({ ...prev, ...updates }));
  };

  const resetApp = () => {
    if (window.confirm("Are you sure you want to start over?")) {
      setJourneyData(defaultJourneyData);
      setShowExceptions(false);
    }
  };

  const calculateProgress = () => {
    if (step === 'DASHBOARD') return 100;
    if (step.includes('ARRIVE') || step.includes('PILLAR') || step.includes('PROPERTY') || step.includes('MAHRAM') || step.includes('10_DAYS') || step.includes('EXC_')) return 80;
    if (step === 'TRANSIT_DASHBOARD' && subState === 'IN_TRANSIT') return 60;
    if (step === 'TRANSIT_DASHBOARD' || step === 'ASK_CAR_DEPARTURE' || step === 'ASK_HADD') return 40;
    if (journeyData.isOver12Miles !== null) return 20;
    return 5; 
  };

  const buildSummary = () => {
    if (step === 'ASK_DISTANCE' || step === 'ASK_RAMADAN' || step === 'ASK_DEPART_TIME') return null;
    let parts = [];
    
    const Wrapper = ({children}) => <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px', color: '#0369a1', fontSize: '0.9rem'}}>{children}</div>;

    if (journeyData.isOver12Miles) {
      parts.push(<Wrapper key="dist"><Icons.Check /> <span>{t.sum_dist}</span></Wrapper>);
    }
    if (journeyData.transportMode) {
      let modeStr = journeyData.transportMode === 'car' ? t.opt_car : journeyData.transportMode === 'plane_ship' ? t.opt_plane_ship : t.opt_train_bus;
      parts.push(<Wrapper key="mode"><Icons.Check /> <span>{t.sum_mode} <strong>{modeStr}</strong></span></Wrapper>);
    }
    if (journeyData.hasDeparted && !journeyData.hasArrived) {
       parts.push(<Wrapper key="transit"><Icons.Car /> <strong>In Transit</strong></Wrapper>);
    }
    if (journeyData.arrivalPillarChoice) {
      let choiceStr = "";
      if (journeyData.arrivalPillarChoice === '10days') choiceStr = '10 Days Intent';
      if (journeyData.arrivalPillarChoice === 'property') choiceStr = 'Owned Property';
      if (journeyData.arrivalPillarChoice === 'mahram') choiceStr = 'Mahram';
      if (journeyData.arrivalPillarChoice === 'brief') choiceStr = 'Brief Visit';
      if (choiceStr) parts.push(<Wrapper key="dest"><Icons.Pin /> <span>{choiceStr}</span></Wrapper>);
    }
    if (parts.length === 0) return null;
    return (
      <div className="flow-summary summary-slide-down" style={{ marginTop: '15px', backgroundColor: '#e0f2fe', padding: '15px', borderRadius: '12px' }}>
        {parts}
      </div>
    );
  };

  const renderStep = () => {
    switch (step) {
      case 'ASK_DISTANCE':
        return (
          <div className="wizard-card"><p className="question-text">{t.q_distance}</p>
            <div className="btn-row"><button className="btn btn-primary" onClick={() => updateData({ isOver12Miles: true })}>{t.btnYes}</button><button className="btn btn-outline" onClick={() => { alert(t.err_distance); updateData({ isOver12Miles: false }); }}>{t.btnNo}</button></div></div>
        );

      case 'ASK_RAMADAN':
        return (
          <div className="wizard-card"><p className="question-text">{t.q_fasting_today}</p>
            <div className="btn-row"><button className="btn btn-primary" onClick={() => updateData({ isRamadan: true })}>{t.btnYes}</button><button className="btn btn-outline" onClick={() => updateData({ isRamadan: false })}>{t.btnNo}</button></div></div>
        );

      case 'ASK_DEPART_TIME':
        return (
          <div className="wizard-card"><p className="question-text">{t.q_depart_time}</p>
            <div className="btn-row" style={{ flexDirection: 'column', gap: '10px' }}>
              <button className="btn btn-outline" onClick={() => updateData({ departTime: 'before_shafa' })}>{t.opt_depart_before_shafa}</button>
              <button className="btn btn-outline" onClick={() => updateData({ departTime: 'shafa_to_zawal' })}>{t.opt_depart_shafa_zawal}</button>
              <button className="btn btn-outline" onClick={() => updateData({ departTime: 'after_zawal' })}>{t.opt_depart_after_zawal}</button>
            </div></div>
        );

      case 'ASK_TRANSPORT':
        return (
          <div className="wizard-card"><p className="question-text">{t.q_transport}</p>
            <button className="btn btn-list" onClick={() => updateData({ transportMode: 'car' })}>{t.opt_car}</button>
            <button className="btn btn-list" onClick={() => updateData({ transportMode: 'plane_ship' })}>{t.opt_plane_ship}</button>
            <button className="btn btn-list" onClick={() => updateData({ transportMode: 'train_bus' })}>{t.opt_train_bus}</button></div>
        );

      case 'ASK_CAR_DEPARTURE':
        return (
          <div className="wizard-card" style={{ borderLeft: '5px solid var(--primary-color)' }}>
            <p className="question-text">{t.q_car_depart}</p>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => updateData({ hasDeparted: true })}>{t.btn_left_house}</button>
          </div>
        );

      case 'ASK_HADD':
        return (
          <div className="wizard-card"><p className="question-text">{t.q_airport_hadd}</p>
            <div className="btn-row"><button className="btn btn-outline" onClick={() => updateData({ isInsideHadd: true })}>{t.opt_inside}</button><button className="btn btn-outline" onClick={() => updateData({ isInsideHadd: false, hasDeparted: true })}>{t.opt_outside}</button></div></div>
        );

      case 'TRANSIT_DASHBOARD':
        const isStandby = subState === 'STANDBY';
        return (
          <div className="wizard-card" style={{ padding: '30px 20px', borderLeft: `5px solid ${isStandby ? 'var(--gold-accent)' : 'var(--danger-text)'}`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {isStandby && <Icons.Hourglass />}
            <h3 style={{ color: 'var(--text-muted)', margin: '15px 0', textAlign: 'center' }}>{t.sum_status}</h3>
            <div className={`status-card ${isStandby ? 'muqeem' : 'musafir'}`} style={{ marginBottom: '25px', width: '100%' }}>
              <div className="status-title">{isStandby ? t.status_muqeem : t.status_musafir}</div>
              <div className="status-action">{isStandby ? t.action_muqeem : t.action_musafir}</div>
            </div>
            <p style={{ fontSize: '1.05rem', marginBottom: '25px', textAlign: 'center', color: 'var(--text-main)' }}>{isStandby ? t.dash_standby_msg : t.dash_transit_msg}</p>
            {isStandby ? (
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => updateData({ hasDeparted: true })}>{t.btn_departed}</button>
            ) : (
              <div style={{ width: '100%' }}>
                <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => updateData({ hasArrived: true })}>{t.btn_arrived}</button>
                <button className="btn btn-outline" style={{ marginTop: '15px', width: '100%', borderColor: 'var(--danger-bg)', color: 'var(--danger-text)' }} onClick={() => { if(window.confirm("Cancel journey?")) updateData({ journeyCancelled: true, hasArrived: true }); }}>{t.btn_cancel_journey}</button>
              </div>
            )}
          </div>
        );

      case 'ASK_PILLAR_MENU':
        return (
          <div className="wizard-card"><p className="question-text" style={{ color: 'var(--primary-color)' }}>{t.q_pillar_menu}</p>
            <button className="btn btn-list" onClick={() => updateData({ arrivalPillarChoice: '10days', intends10Days: true })}>{t.opt_p_10days}</button>
            <button className="btn btn-list" onClick={() => updateData({ arrivalPillarChoice: 'property' })}>{t.opt_p_property}</button>
            <button className="btn btn-list" onClick={() => updateData({ arrivalPillarChoice: 'mahram' })}>{t.opt_p_mahram}</button>
            <button className="btn btn-list" onClick={() => updateData({ arrivalPillarChoice: 'brief' })}>{t.opt_p_brief}</button>
            <button className="btn btn-list" style={{ background: '#edf2f7', borderStyle: 'dashed' }} onClick={() => updateData({ arrivalPillarChoice: 'guide' })}>{t.opt_p_guide}</button>
          </div>
        );

      case 'ASK_PROPERTY': return (<div className="wizard-card"><p className="question-text">{t.q_property}</p><div className="btn-row"><button className="btn btn-primary" onClick={() => updateData({ ownsProperty: true })}>{t.btnYes}</button><button className="btn btn-outline" onClick={() => updateData({ ownsProperty: false })}>{t.btnNo}</button></div></div>);
      case 'ASK_PROPERTY_FLAT': return (<div className="wizard-card"><p className="question-text">{t.q_property_flat}</p><div className="btn-row"><button className="btn btn-outline" onClick={() => updateData({ isFlat: true })}>{t.btnYes}</button><button className="btn btn-outline" onClick={() => updateData({ isFlat: false })}>{t.btnNo}</button></div></div>);
      case 'ASK_PROPERTY_LAND': return (<div className="wizard-card"><p className="question-text">{t.q_property_land}</p><div className="btn-row"><button className="btn btn-primary" onClick={() => updateData({ hasLandShare: true })}>{t.btnYes}</button><button className="btn btn-outline" onClick={() => { alert(t.err_property_land); updateData({ hasLandShare: false }); }}>{t.btnNo}</button></div></div>);
      case 'ASK_PROPERTY_FARZ': return (<div className="wizard-card"><p className="question-text">{t.q_property_farz}</p><div className="btn-row"><button className="btn btn-primary" onClick={() => updateData({ prayedOneFarz: true })}>{t.btnYes}</button><button className="btn btn-outline" onClick={() => updateData({ prayedOneFarz: false })}>{t.btnNo}</button></div></div>);
      
      case 'ASK_10_DAYS': return (<div className="wizard-card"><p className="question-text" style={{ whiteSpace: 'pre-line' }}>{t.q_10days.replace('{date}', futureDateStr)}</p><div className="btn-row"><button className="btn btn-primary" onClick={() => updateData({ intends10Days: true })}>{t.btnYes}</button><button className="btn btn-outline" onClick={() => updateData({ intends10Days: false })}>{t.btnNo}</button></div></div>);
      
      case 'ASK_MAHRAM_CAT': return (
          <div className="wizard-card"><p className="question-text">{t.q_mahram_cat}</p>
            <button className="btn btn-list" onClick={() => updateData({ mahramCategory: 'parents', mahramValidCategory: true })}>{t.m_parents}</button>
            <button className="btn btn-list" onClick={() => updateData({ mahramCategory: 'kids', mahramValidCategory: true })}>{t.m_kids}</button>
            <button className="btn btn-list" onClick={() => updateData({ mahramCategory: 'siblings', mahramValidCategory: true })}>{t.m_siblings}</button>
            <button className="btn btn-list" onClick={() => updateData({ mahramCategory: 'uncles', mahramValidCategory: true })}>{t.m_uncles}</button>
            <button className="btn btn-list" onClick={() => updateData({ mahramCategory: 'spouse', mahramValidCategory: true })}>{t.m_spouse}</button>
            <button className="btn btn-list" style={{ color: 'var(--danger-text)', background: 'var(--danger-bg)' }} onClick={() => updateData({ mahramCategory: 'none', mahramValidCategory: false })}>{t.m_none}</button></div>
        );
      case 'ASK_MAHRAM_FACE': return (<div className="wizard-card"><p className="question-text">{t.q_mahram_face}</p><div className="btn-row"><button className="btn btn-primary" onClick={() => updateData({ mahramFaceToFace: true })}>{t.btnYes}</button><button className="btn btn-outline" onClick={() => updateData({ mahramFaceToFace: false })}>{t.btnNo}</button></div></div>);
      case 'ASK_MAHRAM_5FARZ': return (<div className="wizard-card"><p className="question-text">{t.q_mahram_5farz}</p><div className="btn-row"><button className="btn btn-primary" onClick={() => updateData({ mahramStay5Farz: true })}>{t.btnYes}</button><button className="btn btn-outline" onClick={() => updateData({ mahramStay5Farz: false })}>{t.btnNo}</button></div></div>);
      
      case 'ASK_ARRIVE_TIME':
        const { rozaType } = evaluateJourney(journeyData); 
        return (
          <div className="wizard-card"><p className="question-text">{rozaType === 'shafa_check' ? t.q_arrive_shafa : t.q_arrive_zawal}</p>
            <div className="btn-row"><button className="btn btn-outline" onClick={() => updateData({ arriveTime: 'before_limit' })}>{t.btnYes}</button><button className="btn btn-outline" onClick={() => updateData({ arriveTime: 'after_limit' })}>{t.btnNo}</button></div></div>
        );

      case 'ASK_EXC_MAHRAM':
        return (
          <div className="wizard-card" style={{ borderLeft: '4px solid var(--danger-text)' }}>
            <p className="question-text">{t.q_exc_mahram}</p>
            <button className="btn btn-list" onClick={() => updateData({ mahramLeftEarly: 'before_5' })}>{t.opt_mahram_before}</button>
            <button className="btn btn-list" onClick={() => updateData({ mahramLeftEarly: 'after_5' })}>{t.opt_mahram_after}</button>
          </div>
        );
      
      case 'ASK_EXC_10DAYS':
        return (
          <div className="wizard-card" style={{ borderLeft: '4px solid var(--danger-text)' }}>
            <p className="question-text">{t.q_exc_10days}</p>
            <button className="btn btn-list" onClick={() => updateData({ leftBefore10Days: 'avoidable' })}>{t.opt_10d_avoidable}</button>
            <button className="btn btn-list" onClick={() => updateData({ leftBefore10Days: 'unavoidable' })}>{t.opt_10d_unavoid}</button>
          </div>
        );

      case 'DASHBOARD':
        const hasLeftTown = journeyData.leftBefore10Days !== null || journeyData.mahramLeftEarly !== null;
        
        const validPropNoFarz = (journeyData.ownsProperty === true || journeyData.arrivalPillarChoice === 'property') && 
                                (journeyData.isFlat === false || journeyData.hasLandShare === true) && 
                                journeyData.prayedOneFarz === false;

        return (
          <div>
            <h3 style={{ color: 'var(--text-muted)', marginBottom: '10px', fontSize: '0.9rem', letterSpacing: '1px' }}>{t.sum_status}</h3>
            
            <div className={`status-card ${status === 'MUQEEM' ? 'muqeem' : 'musafir'}`}>
              <div className="status-title">{status === 'MUQEEM' ? t.status_muqeem : t.status_musafir}</div>
              <div className="status-action">{status === 'MUQEEM' ? t.action_muqeem : t.action_musafir}</div>
            </div>

            {status === 'MUSAFIR' && journeyData.mahramValidCategory && journeyData.mahramFaceToFace === false && (
              <div className="wizard-card" style={{ borderLeft: '4px solid var(--gold-accent)', marginTop: '15px' }}>
                <p className="question-text" style={{ fontSize: '1.1rem', color: 'var(--gold-accent)' }}>{t.q_met_now}</p>
                <button className="btn btn-primary" onClick={() => updateData({ mahramFaceToFace: true })}>{t.btn_met}</button>
              </div>
            )}
            
            {status === 'MUSAFIR' && validPropNoFarz && (
              <div className="wizard-card" style={{ borderLeft: '4px solid var(--gold-accent)', marginTop: '15px' }}>
                <p className="question-text" style={{ fontSize: '1.1rem', color: 'var(--gold-accent)' }}>{t.q_farz_now}</p>
                <button className="btn btn-primary" onClick={() => updateData({ prayedOneFarz: true })}>{t.btn_farz_yes}</button>
              </div>
            )}

            {journeyData.isRamadan && rozaToday !== 'N/A' && (
              <div className="info-box" style={{ background: rozaToday === 'BROKEN' ? 'var(--danger-bg)' : 'var(--muqeem-bg)', color: rozaToday === 'BROKEN' ? 'var(--danger-text)' : 'var(--muqeem-text)' }}>
                <strong>{t.roza_today}</strong>{rozaToday === 'BROKEN' ? t.roza_broken : t.roza_valid}
              </div>
            )}
            
            {journeyData.isRamadan && rozaTomorrow !== 'N/A' && (
              <div className="info-box" style={{ marginTop: '10px', background: rozaTomorrow === 'NO_FAST' ? 'var(--danger-bg)' : 'var(--muqeem-bg)', color: rozaTomorrow === 'NO_FAST' ? 'var(--danger-text)' : 'var(--muqeem-text)' }}>
                <strong>{t.roza_tomorrow}</strong>{rozaTomorrow === 'NO_FAST' ? t.roza_tom_musafir : t.roza_tom_muqeem}
              </div>
            )}

            <div style={{ marginTop: '25px' }}>
              <button className="btn btn-outline" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }} onClick={() => setShowExceptions(!showExceptions)}>
                <Icons.Edit /> {t.btn_change_plans}
              </button>
              {showExceptions && (
                <div className="wizard-card" style={{ marginTop: '10px' }}>
                  <button className="btn btn-list" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }} onClick={resetApp}>
                    <Icons.Refresh /> {t.btnReset}
                  </button>
                  
                  {status === 'MUSAFIR' && !journeyData.stayed30Days && !hasLeftTown && (
                     <button className="btn btn-list" onClick={() => { updateData({ stayed30Days: true }); setShowExceptions(false); }}>{t.btn_30days}</button>
                  )}
                  {status === 'MUQEEM' && journeyData.mahramStay5Farz && !journeyData.mahramLeftEarly && (
                     <button className="btn btn-list" style={{ color: 'var(--danger-text)' }} onClick={() => { updateData({ triggerMahramException: true }); setShowExceptions(false); }}>{t.btn_mahram_left}</button>
                  )}
                  {status === 'MUQEEM' && journeyData.intends10Days && !journeyData.leftBefore10Days && (
                     <button className="btn btn-list" style={{ color: 'var(--danger-text)' }} onClick={() => { updateData({ trigger10DaysException: true }); setShowExceptions(false); }}>{t.btn_10days_left}</button>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return <div>Loading...</div>;
    }
  };

  return (
    <div className="app-wrapper" dir="ltr" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      <header className="app-header" style={{ paddingBottom: '0' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', padding: '20px 20px 15px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
             <Icons.Compass />
             <h1 className="app-title" style={{ margin: 0, fontSize: '1.4rem' }}>SafarMate</h1>
          </div>
        </div>
        
        <div style={{ width: '100%', background: '#edf2f7', height: '4px' }}>
          <div style={{ width: `${calculateProgress()}%`, background: 'var(--primary-color)', height: '100%', transition: 'width 0.6s cubic-bezier(0.22, 1, 0.36, 1)' }} />
        </div>
      </header>

      {/* FIXED: Removed overflow-x hidden restriction so body scrolls naturally on mobile */}
      <main style={{ flexGrow: 1, padding: '20px', display: 'flex', flexDirection: 'column' }}>
        {buildSummary()}
        <div key={step} className="slide-up-enter" style={{ flexGrow: 1 }}>
          {renderStep()}
        </div>
      </main>

      <footer style={{ textAlign: 'center', padding: '20px', fontSize: '0.85rem', color: 'var(--text-muted)', borderTop: '1px solid #edf2f7', backgroundColor: '#f8fafc', marginTop: 'auto' }}>
        Created by <a href="https://shabbiryshakir.github.io" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 'bold' }}>M Shabbir Shakir</a>
      </footer>
      
      <style>{`
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .slide-up-enter {
          animation: slideUpFade 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        @keyframes slideDownEnter {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .summary-slide-down {
          animation: slideDownEnter 0.3s ease-out forwards;
        }
        
        /* General mobile resets */
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          background-color: #f8fafc;
          -webkit-font-smoothing: antialiased;
        }
        
        .app-wrapper {
          max-width: 600px;
          margin: 0 auto;
          background: #f8fafc;
          box-shadow: 0 0 20px rgba(0,0,0,0.05);
        }
      `}</style>
    </div>
  );
}