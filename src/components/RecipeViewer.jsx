import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const RecipeViewer = ({ steps, onBack }) => {
  const [viewMode, setViewMode] = useState('all');
  const [currentStep, setCurrentStep] = useState(0);

  if (!steps || steps.length === 0) {
    return <p className="text-muted-foreground">ไม่มีขั้นตอนสำหรับสูตรยานี้</p>;
  }

  return (
    <div className="mt-4">
      <div className="mb-4 flex gap-2">
        <Button
          variant={viewMode === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('all')}
        >
          <i className="bx bx-list-ul" /> แสดงทั้งหมด
        </Button>
        <Button
          variant={viewMode === 'step' ? 'default' : 'outline'}
          size="sm"
          onClick={() => {
            setViewMode('step');
            setCurrentStep(0);
          }}
        >
          <i className="bx bx-arrow-right" /> ทีละขั้นตอน
        </Button>
      </div>

      <Card className="bg-black/20 py-4 shadow-none">
        <CardContent className="px-4">
          {viewMode === 'all' ? (
            <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
              {steps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ul>
          ) : (
            <div className="py-5 text-center">
              <h3 className="mb-4 text-primary">
                ขั้นตอนที่ {currentStep + 1} จาก {steps.length}
              </h3>
              <p className="mb-8 text-lg">{steps[currentStep]}</p>
              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  disabled={currentStep === 0}
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                >
                  ก่อนหน้า
                </Button>
                <Button
                  disabled={currentStep === steps.length - 1}
                  onClick={() => setCurrentStep((prev) => prev + 1)}
                >
                  ขั้นถัดไป
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {onBack && (
        <div className="mt-4 flex justify-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onBack}
            className="group gap-2 border-gold/30 text-muted-foreground transition-colors hover:border-gold/60 hover:bg-gold/5 hover:text-gold"
          >
            <i className="bx bx-arrow-back transition-transform duration-200 group-hover:-translate-x-0.5" />
            กลับไปเลือกสูตรอื่น
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecipeViewer;
