import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const RecipeViewer = ({ steps }) => {
  const [viewMode, setViewMode] = useState('all');
  const [currentStep, setCurrentStep] = useState(0);
  const [returnStep, setReturnStep] = useState(null);

  if (!steps || steps.length === 0) {
    return <p className="text-muted-foreground">ไม่มีขั้นตอนสำหรับสูตรยานี้</p>;
  }

  const goToStep = (step) => {
    setCurrentStep(step);
    setReturnStep(null);
  };

  const goToFirstStep = () => {
    if (currentStep === 0) return;
    setReturnStep(currentStep);
    setCurrentStep(0);
  };

  const returnToPreviousStep = () => {
    if (returnStep === null) return;
    setCurrentStep(returnStep);
    setReturnStep(null);
  };

  const enterStepMode = () => {
    setViewMode('step');
    setCurrentStep(0);
    setReturnStep(null);
  };

  return (
    <div className="mt-4">
      <div className="mb-4 flex gap-2">
        <Button
          variant={viewMode === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => {
            setViewMode('all');
            setReturnStep(null);
          }}
        >
          <i className="bx bx-list-ul" /> แสดงทั้งหมด
        </Button>
        <Button
          variant={viewMode === 'step' ? 'default' : 'outline'}
          size="sm"
          onClick={enterStepMode}
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

              <div className="flex flex-col items-center gap-3">
                <div className="flex justify-center gap-4">
                  {currentStep === 0 && returnStep !== null ? (
                    <Button variant="outline" onClick={returnToPreviousStep}>
                      <i className="bx bx-undo" />
                      กลับไปขั้นที่ {returnStep + 1}
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      disabled={currentStep === 0}
                      onClick={() => goToStep(currentStep - 1)}
                    >
                      ก่อนหน้า
                    </Button>
                  )}
                  <Button
                    disabled={currentStep === steps.length - 1}
                    onClick={() => goToStep(currentStep + 1)}
                  >
                    ขั้นถัดไป
                  </Button>
                </div>

                {currentStep > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={goToFirstStep}
                    className="gap-1.5 text-muted-foreground hover:text-gold"
                  >
                    <i className="bx bx-reply" />
                    ไปขั้นที่ 1
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RecipeViewer;
