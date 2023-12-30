import * as React from 'react';
import './index.css';
import { PrimaryButton } from 'office-ui-fabric-react';

function StepWizard(props:any) {
  const [steps, setSteps] = React.useState(props.steps);

  const [activeStep, setActiveStep] = React.useState(steps[0]);

  React.useEffect(() => {
    // Update activeStep when props.steps change
    props.steps.map((step:any,index:number)=>{
      if(step.key==activeStep.key)
      {
        setActiveStep(step);
      }
    })
     // or set it based on your logic
  }, [props.steps]);
  
  const handleNext = () => {
    if (steps[steps.length - 1].key === activeStep.key) {
      alert('You have completed all steps.');
      return;
    }

    let currentIndex = 0;
    steps.forEach((x:any,index:number) => { if(x.key === activeStep.key){currentIndex=index}});

    setSteps((prevStep:any) =>
      prevStep.map((x:any, index:number) => {
        if (index === currentIndex) x.isDone = true;
        return x;
      })
    );

    setActiveStep(steps[currentIndex + 1]);
  };

  const handleBack = () => {
    let currentIndex = 0;
    
    steps.forEach((x:any, index:number) => {if(x.key === activeStep.key){currentIndex=index}});
    if (currentIndex === 0) return;

    setSteps((prevStep:any) =>
      prevStep.map((x:any, index:number) => {
        //if (index === currentIndex) x.isDone = false;
        return x;
      })
    );

    setActiveStep(steps[currentIndex - 1]);
  };

  return (
    <div className="App">
      <div className="box">
        <div className="steps">
          <ul className="nav">
            {steps.map((step:any, i:number) => {
              return (
                <li
                  key={i}
                  className={`${activeStep.key === step.key ? 'active' : ''} ${step.isDone ? 'done' : ''}`}
                >
                  <div>
                    Step {i + 1}
                    <br />
                    <span>{step.label}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="step-component">{activeStep.component()}</div>
        <div className="btn-component">
          <PrimaryButton 
            text='Back'
            onClick={handleBack}
            disabled={steps[0].key === activeStep.key}
            iconProps={{iconName:'DoubleChevronLeft8'}}
          ></PrimaryButton>
          <PrimaryButton 
            text='Next'
            onClick={handleNext}
            disabled={activeStep.isDone?false:true}
            iconProps={{iconName:'DoubleChevronRight8'}}
          ></PrimaryButton>
          {/* <input type="button" value="Back" onClick={handleBack} disabled={steps[0].key === activeStep.key} /> */}
          {/* <input
            type="button"
            value={steps[steps.length - 1].key !== activeStep.key ? 'Next' : 'Submit'}
            onClick={handleNext}
          /> */}
        </div>
      </div>
    </div>
  );
}

export default StepWizard;
