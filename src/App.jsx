import React, { useState, useEffect } from 'react';
import contentData from './content.json';
import Admin from './Admin';
import { evaluateJourney, generateAuditTrail } from './fiqhEngine';
import './index.css';

// Premium SVG Icon Set
const Icons = {
  Compass: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>,
  Check: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Car: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>,
  Pin: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Hourglass: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V2"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/></svg>,
  Edit: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>,
  Refresh: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>,
  Back: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Info: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  Alert: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Calendar: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Home: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Users: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Clock: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  MapBtn: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
  Warning: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
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
  const t = contentData.ui;
  const steps = contentData;

  // --- STATE ---
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [language, setLanguage] = useState('en'); // 'en' or 'alkanz'
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(() => localStorage.getItem('safarDisclaimerAccepted') === 'true');
  const [journeyData, setJourneyData] = useState(() => {
    const saved = localStorage.getItem('safarDataV10');
    return saved ? JSON.parse(saved) : defaultJourneyData;
  });
  const [historyStack, setHistoryStack] = useState(() => {
    const saved = localStorage.getItem('safarHistoryV10');
    return saved ? JSON.parse(saved) : [];
  });

  const [isEditingList, setIsEditingList] = useState(false);
  const [showExceptions, setShowExceptions] = useState(false);
  const [futureDateStr, setFutureDateStr] = useState('');

  // --- EFFECTS ---
  useEffect(() => { localStorage.setItem('safarDataV10', JSON.stringify(journeyData)); }, [journeyData]);
  useEffect(() => { localStorage.setItem('safarHistoryV10', JSON.stringify(historyStack)); }, [historyStack]);
  useEffect(() => {
    const date = new Date(); date.setDate(date.getDate() + 10);
    setFutureDateStr(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  }, []);

  // Keyboard shortcut to open CMS (Ctrl+Shift+D)
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D' && import.meta.env.DEV) {
        setIsAdminOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const { step, status, subState, rozaToday, rozaTomorrow, rozaType } = evaluateJourney(journeyData);

  // --- BILINGUAL HELPERS ---
  const getText = (stepKey) => {
    if (!steps[stepKey]) return "";
    if (stepKey === 'ASK_ARRIVE_TIME') {
       const shafaStr = language === 'alkanz' ? steps[stepKey].question_shafa_alkanz : steps[stepKey].question_shafa_en;
       const zawalStr = language === 'alkanz' ? steps[stepKey].question_zawal_alkanz : steps[stepKey].question_zawal_en;
       return rozaType === 'shafa_check' ? shafaStr : zawalStr;
    }
    const val = language === 'alkanz' ? steps[stepKey].question_alkanz : steps[stepKey].question_en;
    return val ? val.replace('{date}', futureDateStr) : "";
  };

  const getExp = (stepKey) => {
    if (!steps[stepKey]) return "";
    const text = language === 'alkanz' ? steps[stepKey].fiqhExplanation_alkanz : steps[stepKey].fiqhExplanation_en;
    return text || steps[stepKey].fiqhExplanation_en;
  };

  const dir = language === 'alkanz' ? 'rtl' : 'ltr';
  const fontStyle = language === 'alkanz' ? { fontFamily: 'Alkanz, sans-serif' } : {};

  // --- ACTIONS ---
  const updateData = (updates) => {
    setHistoryStack(prev => [...prev, journeyData]);
    setJourneyData(prev => ({ ...prev, ...updates }));
  };

  const goBack = () => {
    if (historyStack.length > 0) {
      const previousState = historyStack[historyStack.length - 1];
      setHistoryStack(prev => prev.slice(0, -1));
      setJourneyData(previousState);
    }
  };

  const triggerSmartEdit = (keysToNullify) => {
    const updates = {};
    keysToNullify.forEach(k => updates[k] = null);
    updateData(updates);
  };

  const startNewJourney = () => {
    if (window.confirm("Are you sure you want to start a new journey?")) {
      setJourneyData(defaultJourneyData);
      setHistoryStack([]);
      setShowExceptions(false);
      setIsEditingList(false);
    }
  };

  const hardTestingReset = () => {
    if (window.confirm("DEVELOPER: Wipe all data and return to Welcome screen?")) {
      localStorage.removeItem('safarDisclaimerAccepted');
      setDisclaimerAccepted(false);
      setJourneyData(defaultJourneyData);
      setHistoryStack([]);
      setShowExceptions(false);
      setIsEditingList(false);
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

  const formatArrivalTime = (val, currentRozaType) => {
    if (!val) return null;
    const limitName = currentRozaType === 'shafa_check' ? 'Dawn (Shafa)' : 'Zawal';
    return val === 'before_limit' ? `Before ${limitName}` : `After ${limitName}`;
  };

  const formatValue = (val, type) => {
    if (val === true) return "Yes";
    if (val === false) return "No";
    if (type === 'transport') return val === 'plane_ship' ? "Flight/Ship" : val === 'train_bus' ? "Train/Bus" : "Car";
    if (type === 'time') {
      if (val === 'before_shafa') return "Before Dawn (Shafa)";
      if (val === 'shafa_to_zawal') return "Shafa to Zawal";
      if (val === 'after_zawal') return "After Zawal";
      if (val === 'before_limit') return "Before Time Limit";
      if (val === 'after_limit') return "After Time Limit";
    }
    if (type === 'pillar') return val === '10days' ? "10 Days Intent" : val === 'property' ? "Owned Property" : val === 'mahram' ? "Mahram" : val === 'brief' ? "Brief Visit" : "Guided Tool";
    return val;
  };

  // --- COMPONENTS ---
  const BackNav = () => (
    historyStack.length > 0 && !isEditingList ? (
      <button onClick={goBack} style={{ background: 'none', border: 'none', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px', padding: '0 0 15px 0', cursor: 'pointer', fontWeight: 'bold' }}>
        <Icons.Back /> Back
      </button>
    ) : null
  );

  const ExpandableInfo = ({ stepKey }) => {
    const [isOpen, setIsOpen] = useState(false);
    const text = getExp(stepKey);
    const image = steps[stepKey]?.fiqhImage;

    if (!text && !image) return null;

    return (
      <div style={{ margin: '15px 0 0 0' }}>
        <button onClick={() => setIsOpen(!isOpen)} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px', padding: 0, cursor: 'pointer', fontWeight: 'bold' }}>
          <Icons.Info /> {isOpen ? 'Hide Fiqh Explanation' : 'Why are we asking this?'}
        </button>
        {isOpen && (
          <div style={{ backgroundColor: '#f0f9ff', borderLeft: '3px solid #3b82f6', padding: '12px', borderRadius: '0 8px 8px 0', marginTop: '10px' }} dir={dir}>
            {text && <p style={{ margin: 0, fontSize: '0.85rem', color: '#0369a1', lineHeight: '1.4', ...fontStyle }}>{text}</p>}
            {image && (
              <img
src={`${import.meta.env.BASE_URL}images/${image}`}
                alt="Fiqh reference"
                style={{ marginTop: text ? '12px' : 0, width: '100%', borderRadius: '6px', border: '1px solid #bae6fd', display: 'block' }}
              />
            )}
          </div>
        )}
      </div>
    );
  };

  const EditRow = ({ label, value, onEditAction }) => {
    if (value === null || value === undefined) return null;
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{label}</div>
          <div style={{ fontWeight: 'bold', color: '#1e293b' }}>{value}</div>
        </div>
        <button onClick={onEditAction} style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', padding: '6px 12px', borderRadius: '6px', color: '#2563eb', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.8rem' }}>Edit</button>
      </div>
    );
  };

  const buildSummary = () => {
    if (step === 'ASK_DISTANCE' || step === 'ASK_RAMADAN' || step === 'ASK_DEPART_TIME') return null;
    if (isEditingList) return null; 
    let parts = [];
    const Wrapper = ({children}) => <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px', color: '#0369a1', fontSize: '0.9rem'}}>{children}</div>;
    
    if (journeyData.isOver12Miles) parts.push(<Wrapper key="dist"><Icons.Check /> <span>{t.sum_dist}</span></Wrapper>);
    if (journeyData.transportMode) parts.push(<Wrapper key="mode"><Icons.Check /> <span>{t.sum_mode} <strong>{formatValue(journeyData.transportMode, 'transport')}</strong></span></Wrapper>);
    if (journeyData.hasDeparted && !journeyData.hasArrived) parts.push(<Wrapper key="transit"><Icons.Car /> <strong>In Transit</strong></Wrapper>);
    if (journeyData.arrivalPillarChoice) parts.push(<Wrapper key="dest"><Icons.Pin /> <span>{formatValue(journeyData.arrivalPillarChoice, 'pillar')}</span></Wrapper>);
    
    if (journeyData.isRamadan && journeyData.arriveTime) {
      parts.push(<Wrapper key="arrive"><Icons.Clock /> <span>Arrived <strong>{formatArrivalTime(journeyData.arriveTime, rozaType)}</strong></span></Wrapper>);
    }

    if (parts.length === 0) return null;
    return <div className="flow-summary summary-slide-down" style={{ marginTop: '15px', backgroundColor: '#e0f2fe', padding: '15px', borderRadius: '12px' }}>{parts}</div>;
  };

  const renderStep = () => {
    const qProps = { className: "question-text", dir: dir, style: fontStyle };

    switch (step) {
      case 'ASK_DISTANCE':
        return (
          <div className="wizard-card"><BackNav /><p {...qProps}>{getText(step)}</p>
            <div className="btn-row"><button className="btn btn-primary" onClick={() => updateData({ isOver12Miles: true })}>{t.btnYes}</button><button className="btn btn-outline" onClick={() => { alert(t.err_distance); updateData({ isOver12Miles: false }); }}>{t.btnNo}</button></div>
            <ExpandableInfo stepKey={step} />
          </div>
        );

      case 'ASK_RAMADAN':
        return (
          <div className="wizard-card"><BackNav /><p {...qProps}>{getText(step)}</p>
            <div className="btn-row"><button className="btn btn-primary" onClick={() => updateData({ isRamadan: true })}>{t.btnYes}</button><button className="btn btn-outline" onClick={() => updateData({ isRamadan: false })}>{t.btnNo}</button></div>
            <ExpandableInfo stepKey={step} />
          </div>
        );

      case 'ASK_DEPART_TIME':
        return (
          <div className="wizard-card"><BackNav /><p {...qProps}>{getText(step)}</p>
            <div className="btn-row" style={{ flexDirection: 'column', gap: '10px' }}>
              <button className="btn btn-outline" onClick={() => updateData({ departTime: 'before_shafa' })}>{t.opt_depart_before_shafa}</button>
              <button className="btn btn-outline" onClick={() => updateData({ departTime: 'shafa_to_zawal' })}>{t.opt_depart_shafa_zawal}</button>
              <button className="btn btn-outline" onClick={() => updateData({ departTime: 'after_zawal' })}>{t.opt_depart_after_zawal}</button>
            </div>
            <ExpandableInfo stepKey={step} />
          </div>
        );

      case 'ASK_TRANSPORT':
        return (
          <div className="wizard-card"><BackNav /><p {...qProps}>{getText(step)}</p>
            <button className="btn btn-list" onClick={() => updateData({ transportMode: 'car' })}>{t.opt_car}</button>
            <button className="btn btn-list" onClick={() => updateData({ transportMode: 'plane_ship' })}>{t.opt_plane_ship}</button>
            <button className="btn btn-list" onClick={() => updateData({ transportMode: 'train_bus' })}>{t.opt_train_bus}</button>
            <ExpandableInfo stepKey={step} />
          </div>
        );

      case 'ASK_CAR_DEPARTURE':
        return (
          <div className="wizard-card" style={{ borderLeft: '5px solid var(--primary-color)' }}>
            <BackNav /><p {...qProps}>{getText(step)}</p>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => updateData({ hasDeparted: true })}>{t.btn_left_house}</button>
            <ExpandableInfo stepKey={step} />
          </div>
        );

      case 'ASK_HADD':
        return (
          <div className="wizard-card"><BackNav /><p {...qProps}>{getText(step)}</p>
            <div className="btn-row"><button className="btn btn-outline" onClick={() => updateData({ isInsideHadd: true })}>{t.opt_inside}</button><button className="btn btn-outline" onClick={() => updateData({ isInsideHadd: false, hasDeparted: true })}>{t.opt_outside}</button></div>
            <ExpandableInfo stepKey={step} />
          </div>
        );

      case 'TRANSIT_DASHBOARD':
        const isStandby = subState === 'STANDBY';
        return (
          <div className="wizard-card" style={{ padding: '30px 20px', borderLeft: `5px solid ${isStandby ? 'var(--gold-accent)' : 'var(--danger-text)'}`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '1.2rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '15px' }}>
               {isStandby ? <Icons.Hourglass /> : <Icons.Car />}
               {isStandby ? "Pre-Departure Standby" : "In Transit"}
            </div>
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
          <div className="wizard-card"><BackNav /><p {...qProps} style={{...fontStyle, color: 'var(--primary-color)'}}>{getText(step)}</p>
            <button className="btn btn-list" style={{display: 'flex', alignItems: 'center', gap: '10px'}} onClick={() => updateData({ arrivalPillarChoice: '10days', intends10Days: true })}><Icons.Calendar /> 10 Days Intent</button>
            <button className="btn btn-list" style={{display: 'flex', alignItems: 'center', gap: '10px'}} onClick={() => updateData({ arrivalPillarChoice: 'property' })}><Icons.Home /> Owned Property</button>
            <button className="btn btn-list" style={{display: 'flex', alignItems: 'center', gap: '10px'}} onClick={() => updateData({ arrivalPillarChoice: 'mahram' })}><Icons.Users /> Mahram</button>
            <button className="btn btn-list" style={{display: 'flex', alignItems: 'center', gap: '10px'}} onClick={() => updateData({ arrivalPillarChoice: 'brief' })}><Icons.Clock /> Brief Visit</button>
            <button className="btn btn-list" style={{ background: '#edf2f7', borderStyle: 'dashed', display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }} onClick={() => updateData({ arrivalPillarChoice: 'guide' })}><Icons.MapBtn /> Guide Me</button>
            <ExpandableInfo stepKey={step} />
          </div>
        );

      case 'ASK_PROPERTY': return (<div className="wizard-card"><BackNav /><p {...qProps}>{getText(step)}</p><div className="btn-row"><button className="btn btn-primary" onClick={() => updateData({ ownsProperty: true })}>{t.btnYes}</button><button className="btn btn-outline" onClick={() => updateData({ ownsProperty: false })}>{t.btnNo}</button></div><ExpandableInfo stepKey={step} /></div>);
      case 'ASK_PROPERTY_FLAT': return (<div className="wizard-card"><BackNav /><p {...qProps}>{getText(step)}</p><div className="btn-row"><button className="btn btn-outline" onClick={() => updateData({ isFlat: true })}>{t.btnYes}</button><button className="btn btn-outline" onClick={() => updateData({ isFlat: false })}>{t.btnNo}</button></div><ExpandableInfo stepKey={step} /></div>);
      case 'ASK_PROPERTY_LAND': return (<div className="wizard-card"><BackNav /><p {...qProps}>{getText(step)}</p><div className="btn-row"><button className="btn btn-primary" onClick={() => updateData({ hasLandShare: true })}>{t.btnYes}</button><button className="btn btn-outline" onClick={() => updateData({ hasLandShare: false })}>{t.btnNo}</button></div><ExpandableInfo stepKey={step} /></div>);
      case 'ASK_PROPERTY_FARZ': return (<div className="wizard-card"><BackNav /><p {...qProps}>{getText(step)}</p><div className="btn-row"><button className="btn btn-primary" onClick={() => updateData({ prayedOneFarz: true })}>{t.btnYes}</button><button className="btn btn-outline" onClick={() => updateData({ prayedOneFarz: false })}>{t.btnNo}</button></div><ExpandableInfo stepKey={step} /></div>);
      
      case 'ASK_10_DAYS': return (<div className="wizard-card"><BackNav /><p {...qProps} style={{...fontStyle, whiteSpace: 'pre-line'}}>{getText(step)}</p><div className="btn-row"><button className="btn btn-primary" onClick={() => updateData({ intends10Days: true })}>{t.btnYes}</button><button className="btn btn-outline" onClick={() => updateData({ intends10Days: false })}>{t.btnNo}</button></div><ExpandableInfo stepKey={step} /></div>);
      
      case 'ASK_MAHRAM_CAT': 
        return (
          <div className="wizard-card"><BackNav /><p {...qProps}>{getText(step)}</p>
            <div className="mahram-grid">
              <div className="mahram-group">
                <div className="mahram-group-title">Parents / Grandparents</div>
                <button className="btn-box" onClick={() => updateData({ mahramCategory: 'Bawa / Maa', mahramValidCategory: true })}>Bawa / Maa</button>
                <button className="btn-box" onClick={() => updateData({ mahramCategory: 'Dada / Dadi', mahramValidCategory: true })}>Dada / Dadi</button>
                <button className="btn-box" onClick={() => updateData({ mahramCategory: 'Nana / Nani', mahramValidCategory: true })}>Nana / Nani</button>
              </div>

              <div className="mahram-group">
                <div className="mahram-group-title">Children / Grandchildren</div>
                <button className="btn-box" onClick={() => updateData({ mahramCategory: 'Dikra / Dikri', mahramValidCategory: true })}>Dikra / Dikri</button>
                <button className="btn-box" onClick={() => updateData({ mahramCategory: 'Grandsons', mahramValidCategory: true })}>Grandsons</button>
                <button className="btn-box" onClick={() => updateData({ mahramCategory: 'Granddaughters', mahramValidCategory: true })}>Granddaughters</button>
              </div>

              <div className="mahram-group">
                <div className="mahram-group-title">Siblings & their Children</div>
                <button className="btn-box" onClick={() => updateData({ mahramCategory: 'Bhai / Behen', mahramValidCategory: true })}>Bhai / Behen</button>
                <button className="btn-box" onClick={() => updateData({ mahramCategory: 'Bhatija / Bhanja', mahramValidCategory: true })}>Bhatija / Bhanja</button>
                <button className="btn-box" onClick={() => updateData({ mahramCategory: 'Bhatiji / Bhanji', mahramValidCategory: true })}>Bhatiji / Bhanji</button>
              </div>

              <div className="mahram-group">
                <div className="mahram-group-title">Uncles & Aunts</div>
                <button className="btn-box" onClick={() => updateData({ mahramCategory: 'Kaka / Fui', mahramValidCategory: true })}>Kaka / Fui</button>
                <button className="btn-box" onClick={() => updateData({ mahramCategory: 'Mama / Masi', mahramValidCategory: true })}>Mama / Masi</button>
              </div>

              <div className="mahram-group">
                <div className="mahram-group-title">Spouse</div>
                <button className="btn-box" style={{ width: '100%' }} onClick={() => updateData({ mahramCategory: 'Zauj / Zaujat', mahramValidCategory: true })}>Husband / Wife</button>
              </div>
            </div>
            <button className="btn btn-list" style={{ marginTop: '20px', color: 'var(--danger-text)', background: 'var(--danger-bg)', display: 'flex', justifyContent: 'center' }} onClick={() => updateData({ mahramCategory: 'none', mahramValidCategory: false })}>None of the above</button>
            <ExpandableInfo stepKey={step} />
          </div>
        );

      case 'ASK_MAHRAM_FACE': return (<div className="wizard-card"><BackNav /><p {...qProps}>{getText(step)}</p><div className="btn-row"><button className="btn btn-primary" onClick={() => updateData({ mahramFaceToFace: true })}>{t.btnYes}</button><button className="btn btn-outline" onClick={() => updateData({ mahramFaceToFace: false })}>{t.btnNo}</button></div><ExpandableInfo stepKey={step} /></div>);
      case 'ASK_MAHRAM_5FARZ': return (<div className="wizard-card"><BackNav /><p {...qProps}>{getText(step)}</p><div className="btn-row"><button className="btn btn-primary" onClick={() => updateData({ mahramStay5Farz: true })}>{t.btnYes}</button><button className="btn btn-outline" onClick={() => updateData({ mahramStay5Farz: false })}>{t.btnNo}</button></div><ExpandableInfo stepKey={step} /></div>);
      
      case 'ASK_ARRIVE_TIME':
        return (
          <div className="wizard-card"><BackNav /><p {...qProps}>{getText(step)}</p>
            <div className="btn-row"><button className="btn btn-outline" onClick={() => updateData({ arriveTime: 'before_limit' })}>{t.btnYes}</button><button className="btn btn-outline" onClick={() => updateData({ arriveTime: 'after_limit' })}>{t.btnNo}</button></div>
            <ExpandableInfo stepKey={step} />
          </div>
        );

      case 'ASK_EXC_MAHRAM':
        return (
          <div className="wizard-card" style={{ borderLeft: '4px solid var(--danger-text)' }}>
            <BackNav /><p {...qProps}>{getText(step)}</p>
            <button className="btn btn-list" onClick={() => updateData({ mahramLeftEarly: 'before_5' })}>{t.opt_mahram_before}</button>
            <button className="btn btn-list" onClick={() => updateData({ mahramLeftEarly: 'after_5' })}>{t.opt_mahram_after}</button>
          </div>
        );
      
      case 'ASK_EXC_10DAYS':
        return (
          <div className="wizard-card" style={{ borderLeft: '4px solid var(--danger-text)' }}>
            <BackNav /><p {...qProps}>{getText(step)}</p>
            <button className="btn btn-list" onClick={() => updateData({ leftBefore10Days: 'avoidable' })}>{t.opt_10d_avoidable}</button>
            <button className="btn btn-list" onClick={() => updateData({ leftBefore10Days: 'unavoidable' })}>{t.opt_10d_unavoid}</button>
          </div>
        );

      case 'DASHBOARD':
        // --- SMART EDIT LIST VIEW ---
        if (isEditingList) {
          return (
            <div className="wizard-card" style={{ marginTop: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h3 style={{ margin: 0, color: '#0f172a' }}>Review & Edit Answers</h3>
              </div>
              <p style={{fontSize: '0.85rem', color: '#64748b', marginBottom: '20px', lineHeight: '1.4'}}>Select an answer to change. The app will securely rewrite subsequent rules based on your new choice.</p>
              
              <h4 style={{ margin: '15px 0 5px 0', color: '#3b82f6', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>1. Route & Timing</h4>
              <EditRow label="Distance > 12 Miles?" value={formatValue(journeyData.isOver12Miles)} onEditAction={() => triggerSmartEdit(['isOver12Miles'])} />
              <EditRow label="Traveling in Ramadan?" value={formatValue(journeyData.isRamadan)} onEditAction={() => triggerSmartEdit(['isRamadan', 'departTime', 'arriveTime'])} />
              <EditRow label="Departure Time" value={formatValue(journeyData.departTime, 'time')} onEditAction={() => triggerSmartEdit(['departTime'])} />
              <EditRow label="Transport Mode" value={formatValue(journeyData.transportMode, 'transport')} onEditAction={() => triggerSmartEdit(['transportMode', 'isInsideHadd', 'hasDeparted'])} />
              <EditRow label="Station in boundary?" value={formatValue(journeyData.isInsideHadd)} onEditAction={() => triggerSmartEdit(['isInsideHadd', 'hasDeparted'])} />
              
              {journeyData.isRamadan && journeyData.hasArrived && (
                  <EditRow label="Arrival Time" value={formatArrivalTime(journeyData.arriveTime, rozaType)} onEditAction={() => triggerSmartEdit(['arriveTime'])} />
              )}

              <h4 style={{ margin: '25px 0 5px 0', color: '#3b82f6', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>2. Destination Intent</h4>
              <EditRow label="Primary Reason" value={formatValue(journeyData.arrivalPillarChoice, 'pillar')} onEditAction={() => triggerSmartEdit(['arrivalPillarChoice', 'ownsProperty', 'isFlat', 'hasLandShare', 'prayedOneFarz', 'intends10Days', 'mahramCategory', 'mahramValidCategory', 'mahramFaceToFace', 'mahramStay5Farz'])} />
              <EditRow label="Owns Property?" value={formatValue(journeyData.ownsProperty)} onEditAction={() => triggerSmartEdit(['ownsProperty', 'isFlat', 'hasLandShare', 'prayedOneFarz'])} />
              <EditRow label="Has Land Share?" value={formatValue(journeyData.hasLandShare)} onEditAction={() => triggerSmartEdit(['hasLandShare', 'prayedOneFarz'])} />
              <EditRow label="Prayed 1 Farz?" value={formatValue(journeyData.prayedOneFarz)} onEditAction={() => triggerSmartEdit(['prayedOneFarz'])} />
              <EditRow label="Mahram Type" value={journeyData.mahramCategory} onEditAction={() => triggerSmartEdit(['mahramCategory', 'mahramValidCategory', 'mahramFaceToFace', 'mahramStay5Farz'])} />
              <EditRow label="Met Face to Face?" value={formatValue(journeyData.mahramFaceToFace)} onEditAction={() => triggerSmartEdit(['mahramFaceToFace', 'mahramStay5Farz'])} />
              <EditRow label="Stay 5 Farz?" value={formatValue(journeyData.mahramStay5Farz)} onEditAction={() => triggerSmartEdit(['mahramStay5Farz'])} />
              <EditRow label="Intends 10 Days?" value={formatValue(journeyData.intends10Days)} onEditAction={() => triggerSmartEdit(['intends10Days'])} />

              <button className="btn btn-primary" style={{ width: '100%', marginTop: '25px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }} onClick={() => setIsEditingList(false)}>
                <Icons.Check /> Confirm & Return to Dashboard
              </button>
            </div>
          );
        }

        // --- NORMAL DASHBOARD ---
        const validPropNoFarz = (journeyData.ownsProperty === true || journeyData.arrivalPillarChoice === 'property') && 
                                (journeyData.isFlat === false || journeyData.hasLandShare === true) && 
                                journeyData.prayedOneFarz === false;
                                
        const hasLeftTown = journeyData.leftBefore10Days !== null || journeyData.mahramLeftEarly !== null;
        const show30DaysBtn = status === 'MUSAFIR' && !journeyData.stayed30Days && !hasLeftTown;
        const showMahramExcBtn = status === 'MUQEEM' && journeyData.mahramStay5Farz && !journeyData.mahramLeftEarly;
        const show10DaysExcBtn = status === 'MUQEEM' && journeyData.intends10Days && !journeyData.leftBefore10Days;
        const hasPostArrivalChanges = show30DaysBtn || showMahramExcBtn || show10DaysExcBtn;

        return (
          <div>
            <h3 style={{ color: 'var(--text-muted)', marginBottom: '10px', fontSize: '0.9rem', letterSpacing: '1px' }}>{t.sum_status}</h3>
            
            <div className={`status-card ${status === 'MUQEEM' ? 'muqeem' : 'musafir'}`}>
              <div className="status-title">{status === 'MUQEEM' ? t.status_muqeem : t.status_musafir}</div>
              <div className="status-action">{status === 'MUQEEM' ? t.action_muqeem : t.action_musafir}</div>
            </div>

            <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', marginTop: '15px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#64748b' }}>WHAT THE APP UNDERSTOOD ABOUT YOUR SITUATION</h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#1e293b', lineHeight: '1.5' }}>{generateAuditTrail(journeyData)}</p>
            </div>

            {status === 'MUSAFIR' && journeyData.mahramValidCategory && journeyData.mahramFaceToFace === false && (
              <div className="wizard-card" style={{ borderLeft: '4px solid var(--gold-accent)', marginTop: '15px' }}>
                <p className="question-text" style={{ fontSize: '1.1rem', color: 'var(--gold-accent)' }}>{t.q_met_now}</p>
                <button className="btn btn-primary" onClick={() => updateData({ mahramFaceToFace: true })}>Yes, Met Face-to-Face</button>
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

            <div style={{ marginTop: '25px', display: 'flex', gap: '10px' }}>
              <button className="btn btn-outline" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }} onClick={() => setIsEditingList(true)}>
                <Icons.Edit /> Edit Answers
              </button>
              <button className="btn btn-primary" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }} onClick={startNewJourney}>
                <Icons.Refresh /> New Trip
              </button>
            </div>
            
            {hasPostArrivalChanges && (
              <div style={{ marginTop: '15px' }}>
                <button className="btn btn-outline" style={{ width: '100%', borderColor: '#f59e0b', color: '#d97706', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }} onClick={() => setShowExceptions(!showExceptions)}>
                  <Icons.Warning /> Post-Arrival Changes / Exceptions
                </button>
                {showExceptions && (
                  <div className="wizard-card" style={{ marginTop: '10px', borderLeft: '4px solid #f59e0b' }}>
                    <p style={{fontSize: '0.85rem', color: '#64748b', marginBottom: '15px'}}>Did your situation unexpectedly change after arriving?</p>
                    {show30DaysBtn && <button className="btn btn-list" onClick={() => { updateData({ stayed30Days: true }); setShowExceptions(false); }}>I have now stayed 30 consecutive days</button>}
                    {showMahramExcBtn && <button className="btn btn-list" onClick={() => { updateData({ triggerMahramException: true }); setShowExceptions(false); }}>My Mahram left early</button>}
                    {show10DaysExcBtn && <button className="btn btn-list" onClick={() => { updateData({ trigger10DaysException: true }); setShowExceptions(false); }}>I have to leave before 10 days</button>}
                  </div>
                )}
              </div>
            )}

            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '15px', borderRadius: '12px', marginTop: '25px', display: 'flex', gap: '10px' }}>
              <div style={{marginTop: '2px'}}><Icons.Alert /></div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#991b1b', lineHeight: '1.4' }}>
                <strong>Disclaimer:</strong> SafarMate calculates rules based on standard inputs. If your situation is complex or changes unexpectedly, consult your local Amil Saheb.
              </p>
            </div>
          </div>
        );

      default:
        return <div>Loading...</div>;
    }
  };

  // --- STARTUP / WELCOME SCREEN ---
  if (!disclaimerAccepted) {
    return (
      <div className={`app-wrapper ${isAdminOpen ? 'admin-open' : ''}`} dir="ltr">
        <header className="app-header" style={{ paddingBottom: '0', flexShrink: 0, backgroundColor: '#fff', zIndex: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '15px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
               <Icons.Compass />
               <h1 className="app-title" style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a' }}>
                 {t.appTitle} <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'normal' }}>(App Demo)</span>
               </h1>
            </div>
            <button 
              onClick={() => setLanguage(lang => lang === 'en' ? 'alkanz' : 'en')}
              style={{ padding: '6px 12px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}
            >
              {language === 'en' ? t.langToggle : "English"}
            </button>
          </div>
        </header>

        <main style={{ flexGrow: 1, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: isAdminOpen ? 'flex-start' : 'center', overflowY: 'auto' }}>
          {isAdminOpen ? (
            <Admin onClose={() => setIsAdminOpen(false)} />
          ) : (
            <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', textAlign: 'center' }}>
              <h1 style={{ fontSize: '1.6rem', color: '#0f172a', marginBottom: '15px' }}>Welcome</h1>
              <p style={{ color: '#475569', lineHeight: '1.6', marginBottom: '25px', textAlign: 'left', fontSize: '0.95rem' }}>
                SafarMate is an educational tool designed to assist with standard Fiqh calculations for travel.
              </p>
              <div style={{ backgroundColor: '#fef2f2', padding: '15px', borderRadius: '10px', textAlign: 'left', borderLeft: '4px solid #ef4444', marginBottom: '25px' }}>
                <p style={{ margin: 0, color: '#991b1b', fontSize: '0.85rem', lineHeight: '1.5' }}>
                  <strong>Important:</strong> This application does not replace official guidance from Dawat-e-Hadiyah. For complex property disputes, ambiguous boundaries, or specific edge cases, consult your local Amil Saheb.
                </p>
              </div>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => { localStorage.setItem('safarDisclaimerAccepted', 'true'); setDisclaimerAccepted(true); }}>I Understand & Agree</button>
            </div>
          )}
        </main>

        <footer style={{ flexShrink: 0, textAlign: 'center', padding: '12px', fontSize: '0.75rem', color: '#94a3b8', borderTop: '1px solid #e2e8f0', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', zIndex: 10 }}>
          <div style={{ display: 'flex', gap: '15px' }}>
          </div>
        </footer>
      </div>
    );
  }

  // --- MAIN APP RENDER ---
  return (
    <div className={`app-wrapper ${isAdminOpen ? 'admin-open' : ''}`} dir="ltr">
      <header className="app-header" style={{ paddingBottom: '0', flexShrink: 0, backgroundColor: '#fff', zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '15px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
             <Icons.Compass />
             <h1 className="app-title" style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a' }}>
               {t.appTitle} <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'normal' }}>(App Demo)</span>
             </h1>
          </div>
          <button 
            onClick={() => setLanguage(lang => lang === 'en' ? 'alkanz' : 'en')}
            style={{ padding: '6px 12px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}
          >
            {language === 'en' ? t.langToggle : "English"}
          </button>
        </div>
        <div style={{ width: '100%', background: '#edf2f7', height: '4px' }}>
          <div style={{ width: `${calculateProgress()}%`, background: 'var(--primary-color)', height: '100%', transition: 'width 0.6s cubic-bezier(0.22, 1, 0.36, 1)' }} />
        </div>
      </header>

      <main style={{ flexGrow: 1, padding: '20px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {isAdminOpen ? (
          <Admin onClose={() => setIsAdminOpen(false)} />
        ) : (
          <>
            {step !== 'DASHBOARD' && buildSummary()}
            <div key={step} className="slide-up-enter" style={{ flexGrow: 1 }}>
              {renderStep()}
            </div>
          </>
        )}
      </main>

      <footer style={{ flexShrink: 0, textAlign: 'center', padding: '12px', fontSize: '0.75rem', color: '#94a3b8', borderTop: '1px solid #e2e8f0', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', zIndex: 10 }}>
        <div style={{ display: 'flex', gap: '15px' }}>
          {import.meta.env.DEV && <button onClick={() => setIsAdminOpen(true)} style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', fontWeight: 'bold' }}>Open CMS</button>}
          {import.meta.env.DEV && <button onClick={hardTestingReset} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.75rem', padding: 0, fontWeight: 'bold' }}>App Reset (Test)</button>}
        </div>
      </footer>
      
      <style>{`
        @keyframes slideUpFade { from { opacity: 0; transform: translateY(20px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .slide-up-enter { animation: slideUpFade 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        @keyframes slideDownEnter { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .summary-slide-down { animation: slideDownEnter 0.3s ease-out forwards; }
        
        /* Mahram CSS Matrix Layout */
        .mahram-grid { display: flex; flex-direction: column; gap: 15px; margin-top: 15px; }
        .mahram-group { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; }
        .mahram-group-title { font-size: 0.8rem; text-transform: uppercase; color: #64748b; font-weight: 800; letter-spacing: 1px; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; }
        .btn-box { display: inline-block; background-color: #fff; border: 1px solid #cbd5e1; padding: 10px 15px; border-radius: 8px; color: #334155; font-weight: 600; cursor: pointer; transition: all 0.2s; margin: 0 8px 8px 0; font-size: 0.9rem; }
        .btn-box:hover { border-color: #3b82f6; background-color: #eff6ff; color: #2563eb; }
        
        /* STRICT APP LAYOUT */
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; -webkit-font-smoothing: antialiased; overflow: hidden; }
        .app-wrapper { max-width: 600px; margin: 0 auto; background: #f8fafc; box-shadow: 0 0 20px rgba(0,0,0,0.05); height: 100dvh; display: flex; flex-direction: column; overflow: hidden; }
      `}</style>
    </div>
  );
}