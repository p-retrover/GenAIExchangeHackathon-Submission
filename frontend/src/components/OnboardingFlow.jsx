import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { StepFormTransition } from './ui/StepFormTransition';
import { HoverEffectButton } from './ui/HoverEffectButton';
import { AnimatedCard } from './ui/AnimatedCard';
import { Input } from '@/components/ui/Input'; // Assuming these are available
import { Label } from '@/components/ui/Label';
import { Checkbox } from '@/components/ui/Checkbox';
import { BrainCircuit, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

const OnboardingFlow = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    goal: '',
    interests: [],
    skills: [],
  });
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < 3) { // Assuming 3 steps for now
      setCurrentStep(currentStep + 1);
    } else {
      // Simulate completion
      console.log('Onboarding Complete:', formData);
      setShowSuccessAnimation(true); // Trigger success animation
      setTimeout(() => {
        onComplete(); // Notify App.jsx that onboarding is complete
        navigate('/dashboard'); // Redirect to dashboard
      }, 1500); // Delay redirection to allow animation to play
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInterestChange = (interest, checked) => {
    setFormData(prev => ({
      ...prev,
      interests: checked
        ? [...prev.interests, interest]
        : prev.interests.filter(i => i !== interest),
    }));
  };

  const handleSkillChange = (skill, checked) => {
    setFormData(prev => ({
      ...prev,
      skills: checked
        ? [...prev.skills, skill]
        : prev.skills.filter(s => s !== skill),
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <AnimatedCard className="p-6 space-y-4">
            <h2 className="text-2xl font-bold text-center">Welcome to Satori!</h2>
            <p className="text-muted-foreground text-center">Let's get you started on your career journey.</p>
            <div>
              <Label htmlFor="name">What's your name?</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your Full Name"
              />
            </div>
            <div>
              <Label htmlFor="goal">What's your main career goal?</Label>
              <Input
                id="goal"
                value={formData.goal}
                onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value }))}
                placeholder="e.g., Become a Software Engineer"
              />
            </div>
          </AnimatedCard>
        );
      case 2:
        const sampleInterests = ["AI/ML", "Web Development", "Data Science", "Cloud Computing", "Cybersecurity"];
        const sampleSkills = ["Python", "JavaScript", "React", "SQL", "AWS"];
        return (
          <AnimatedCard className="p-6 space-y-4">
            <h2 className="text-2xl font-bold text-center">Tell us about your Interests & Skills</h2>
            <p className="text-muted-foreground text-center">Select what resonates with you.</p>
            <div>
              <h3 className="font-semibold mb-2">Interests:</h3>
              <div className="grid grid-cols-2 gap-2">
                {sampleInterests.map(interest => (
                  <div key={interest} className="flex items-center space-x-2">
                    <Checkbox
                      id={interest}
                      checked={formData.interests.includes(interest)}
                      onCheckedChange={(checked) => handleInterestChange(interest, checked)}
                    />
                    <Label htmlFor={interest}>{interest}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Skills:</h3>
              <div className="grid grid-cols-2 gap-2">
                {sampleSkills.map(skill => (
                  <div key={skill} className="flex items-center space-x-2">
                    <Checkbox
                      id={skill}
                      checked={formData.skills.includes(skill)}
                      onCheckedChange={(checked) => handleSkillChange(skill, checked)}
                    />
                    <Label htmlFor={skill}>{skill}</Label>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedCard>
        );
      case 3:
        return (
          <AnimatedCard className="p-6 space-y-4">
            <h2 className="text-2xl font-bold text-center">Your Career Compass Awaits!</h2>
            <p className="text-muted-foreground text-center">Based on your input, Satori will guide you to your ideal career path.</p>
            {/* Placeholder for a teaser animation */}
            <div className="bg-muted h-32 flex items-center justify-center rounded-md text-muted-foreground">
              [Teaser Animation Placeholder]
            </div>
            <p className="text-center text-sm text-gray-500">Click "Finish" to explore your personalized recommendations.</p>
            <p className="text-center text-sm text-red-500">[NOTE FOR BACKEND TEAM: Implement actual assessment submission and profile completion logic here.]</p>
          </AnimatedCard>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
      <div className="bg-card rounded-lg shadow-2xl max-w-md w-full p-6">
        <div className="flex justify-center mb-6">
          <BrainCircuit className="h-10 w-10 text-primary" />
        </div>
        <AnimatePresence mode="wait">
          {showSuccessAnimation ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 py-10"
            >
              <CheckCircle className="h-20 w-20 text-green-500" />
              <h2 className="text-3xl font-bold text-center text-green-500">Onboarding Complete!</h2>
              <p className="text-muted-foreground text-center">Redirecting you to your dashboard...</p>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <StepFormTransition currentStep={currentStep}>
                {renderStepContent()}
              </StepFormTransition>
              <div className="flex justify-between mt-6">
                <HoverEffectButton
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" /> Previous
                </HoverEffectButton>
                <HoverEffectButton
                  onClick={handleNext}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center"
                >
                  {currentStep === 3 ? 'Finish' : 'Next'} <ArrowRight className="h-4 w-4 ml-2" />
                </HoverEffectButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OnboardingFlow;
