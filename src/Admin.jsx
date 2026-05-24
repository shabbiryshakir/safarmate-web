import React, { useState, useEffect } from 'react';

export default function Admin({ onClose }) {
  const [content, setContent] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/api/content')
      .then(res => {
        if (!res.ok) throw new Error('Server error');
        return res.json();
      })
      .then(data => setContent(data))
      .catch(err => setError("Could not connect to the Admin Server. Is 'node server.cjs' running?"));
  }, []);

  const handleTextChange = (stepKey, field, value) => {
    setContent(prev => ({
      ...prev,
      [stepKey]: { ...prev[stepKey], [field]: value }
    }));
  };

  const handleImageUpload = async (stepKey, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('http://localhost:3001/api/upload', { method: 'POST', body: formData });
      const { filename } = await res.json();
      handleTextChange(stepKey, 'fiqhImage', filename);
    } catch (err) {
      alert("Image upload failed.");
    }
  };

  const saveToDisk = async () => {
    setSaving(true);
    try {
      await fetch('http://localhost:3001/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      });
      alert('Saved successfully!');
    } catch (err) {
      alert('Failed to save.');
    }
    setSaving(false);
  };

  if (error) return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h3 style={{ color: '#ef4444', fontSize: '1rem' }}>{error}</h3>
      <button onClick={onClose} className="btn btn-outline">Go Back</button>
    </div>
  );

  if (!content) return <div style={{ textAlign: 'center', padding: '20px' }}>Loading Admin Data...</div>;

  return (
    <div className="slide-up-enter" style={{ width: '100%', paddingBottom: '20px' }}>
      
      {/* Sticky Toolbar - sticks to the top of the main scroll area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', position: 'sticky', top: '-20px', background: '#f8fafc', padding: '15px 0', zIndex: 100, borderBottom: '1px solid #e2e8f0' }}>
        <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a' }}>Content Manager</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={saveToDisk} style={{ padding: '8px 15px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}>
            {saving ? 'Saving...' : 'Save All'}
          </button>
          <button onClick={onClose} style={{ padding: '8px 15px', background: '#64748b', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}>
            Close
          </button>
        </div>
      </div>

      <div style={{ width: '100%' }}>
        {Object.keys(content).filter(k => k !== 'ui').map(stepKey => (
          <div key={stepKey} style={{ background: '#fff', padding: '15px', marginBottom: '15px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
            <h3 style={{ marginTop: 0, color: '#2563eb', borderBottom: '2px solid #eff6ff', paddingBottom: '10px', fontSize: '1rem' }}>{stepKey}</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '0.85rem', color: '#64748b' }}>English Question:</label>
              <input style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }} value={content[stepKey].question_en || ''} onChange={(e) => handleTextChange(stepKey, 'question_en', e.target.value)} />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '0.85rem', color: '#64748b' }}>Alkanz Question:</label>
              <input dir="rtl" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontFamily: 'Alkanz, sans-serif', fontSize: '1.1rem' }} value={content[stepKey].question_alkanz || ''} onChange={(e) => handleTextChange(stepKey, 'question_alkanz', e.target.value)} />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '0.85rem', color: '#64748b' }}>English Explanation:</label>
              <textarea rows="3" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }} value={content[stepKey].fiqhExplanation_en || ''} onChange={(e) => handleTextChange(stepKey, 'fiqhExplanation_en', e.target.value)} />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '0.85rem', color: '#64748b' }}>Alkanz Explanation:</label>
              <textarea dir="rtl" rows="3" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontFamily: 'Alkanz, sans-serif', fontSize: '1.1rem' }} value={content[stepKey].fiqhExplanation_alkanz || ''} onChange={(e) => handleTextChange(stepKey, 'fiqhExplanation_alkanz', e.target.value)} />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '0.85rem', color: '#64748b' }}>Attach Image:</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#f1f5f9', padding: '10px', borderRadius: '6px' }}>
                <input type="file" accept="image/*" style={{ fontSize: '0.8rem' }} onChange={(e) => handleImageUpload(stepKey, e.target.files[0])} />
                {content[stepKey].fiqhImage && <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 'bold' }}>Active: {content[stepKey].fiqhImage}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}