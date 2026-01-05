"use client"

import { useState } from "react";

const MAX_STEPS = 4;

export default function SetupPage() {
  
  const [step, setStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  function nextStep() {
    if(step < MAX_STEPS) {
      setStep(step + 1);
    } else {
      // Handle completion logic here
    }
  } 
  function prevStep() {
    if(step > 1) {
      setStep(step - 1);
    }
  }
  
}


function StepsHeader({step, title, description_1, description_2, buttonText}: {
  step: number;
  title: string;
  description_1: string;
  description_2: string;
  buttonText: string;
}) {
  return <div className="w-full aspect-square m-4 bg-gray-" >
    
  </div>
}