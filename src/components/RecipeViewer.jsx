import React, { useState } from 'react';

const RecipeViewer = ({ steps }) => {
  const [viewMode, setViewMode] = useState('all'); // 'all' or 'step'
  const [currentStep, setCurrentStep] = useState(0);

  if (!steps || steps.length === 0) return <p style={{ color: 'var(--color-text-secondary)' }}>ไม่มีขั้นตอนสำหรับสูตรยานี้</p>;

  return (
    <div style={{ marginTop: '15px' }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <button 
          className={`btn ${viewMode === 'all' ? 'btn-primary' : 'btn-outline'}`}
          style={{ padding: '6px 12px', fontSize: '12px' }}
          onClick={() => setViewMode('all')}
        >
          <i className='bx bx-list-ul'></i> แสดงทั้งหมด
        </button>
        <button 
          className={`btn ${viewMode === 'step' ? 'btn-primary' : 'btn-outline'}`}
          style={{ padding: '6px 12px', fontSize: '12px' }}
          onClick={() => { setViewMode('step'); setCurrentStep(0); }}
        >
          <i className='bx bx-arrow-right'></i> ทีละขั้นตอน
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '15px', background: 'rgba(0,0,0,0.2)' }}>
        {viewMode === 'all' ? (
          <ul style={{ paddingLeft: '20px', color: 'var(--color-text-secondary)' }}>
            {steps.map((step, idx) => (
              <li key={idx} style={{ marginBottom: '8px' }}>{step}</li>
            ))}
          </ul>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <h3 style={{ color: 'var(--color-accent-primary)', marginBottom: '15px' }}>ขั้นตอนที่ {currentStep + 1} จาก {steps.length}</h3>
            <p style={{ fontSize: '18px', marginBottom: '30px' }}>{steps[currentStep]}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
              <button 
                className="btn btn-outline" 
                disabled={currentStep === 0}
                onClick={() => setCurrentStep(prev => prev - 1)}
                style={{ opacity: currentStep === 0 ? 0.5 : 1 }}
              >
                ก่อนหน้า
              </button>
              <button 
                className="btn btn-primary" 
                disabled={currentStep === steps.length - 1}
                onClick={() => setCurrentStep(prev => prev + 1)}
                style={{ opacity: currentStep === steps.length - 1 ? 0.5 : 1 }}
              >
                ขั้นถัดไป
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeViewer;
