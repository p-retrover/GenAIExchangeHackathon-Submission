import { useState, useRef, useEffect } from "react";
import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Progress } from "@/components/ui/Progress";
import { User, GraduationCap, Target, Brain, FileText, ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProfileDetails from "./ProfileDetails";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import ProfileTabs from "./ProfileTabs";

const Profile = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Info
    name: "",
    age: "",
    email: "",
    phone: "",
    
    // Education
    education: "",
    stream: "",
    year: "",
    percentage: "",
    
    // Interests
    interests: [],
    
    // Skills
    skills: "",
    
    // Career Aspirations
    aspirations: "",
    preferredIndustries: [],
    
    // Additional
    resume: null
  });

  const navigate = useNavigate();
  const progressBarRef = useRef(null);

  const steps = [
    { id: 1, title: "Basic Info", icon: User },
    { id: 2, title: "Education", icon: GraduationCap },
    { id: 3, title: "Interests", icon: Target },
    { id: 4, title: "Skills & Goals", icon: Brain },
    { id: 5, title: "Final Details", icon: FileText }
  ];

  const interests = [
    "Technology & Programming",
    "Healthcare & Medicine",
    "Arts & Design",
    "Business & Finance",
    "Engineering",
    "Education & Teaching",
    "Media & Entertainment",
    "Sports & Fitness",
    "Environment & Sustainability",
    "Social Work & NGO"
  ];

  const industries = [
    "Information Technology",
    "Healthcare",
    "Finance & Banking",
    "Education",
    "Manufacturing",
    "Retail & E-commerce",
    "Government & Public Sector",
    "Consulting",
    "Startups",
    "Research & Development"
  ];

  const progress = (currentStep / steps.length) * 100;

  useEffect(() => {
    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, { 
        value: progress, 
        duration: 0.5, 
        ease: "power2.out" 
      });
    }
  }, [progress]);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit form and navigate to recommendations
      console.log("Profile data:", formData);
      navigate("/dashboard");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInterestChange = (interest, checked) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        interests: prev.interests.filter(i => i !== interest)
      }));
    }
  };

  const handleIndustryChange = (industry, checked) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        preferredIndustries: [...prev.preferredIndustries, industry]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        preferredIndustries: prev.preferredIndustries.filter(i => i !== industry)
      }));
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                  placeholder="Your age"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="education">Education Level</Label>
                <Select value={formData.education} onValueChange={(value) => setFormData(prev => ({ ...prev, education: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10th">10th Standard</SelectItem>
                    <SelectItem value="12th">12th Standard</SelectItem>
                    <SelectItem value="graduation">Graduation</SelectItem>
                    <SelectItem value="post-graduation">Post Graduation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="stream">Stream/Field</Label>
                <Select value={formData.stream} onValueChange={(value) => setFormData(prev => ({ ...prev, stream: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your stream" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="commerce">Commerce</SelectItem>
                    <SelectItem value="arts">Arts</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="medicine">Medicine</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="year">Year of Study/Completion</Label>
                <Input
                  id="year"
                  value={formData.year}
                  onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                  placeholder="e.g., 2024"
                />
              </div>
              <div>
                <Label htmlFor="percentage">Percentage/CGPA</Label>
                <Input
                  id="percentage"
                  value={formData.percentage}
                  onChange={(e) => setFormData(prev => ({ ...prev, percentage: e.target.value }))}
                  placeholder="e.g., 85% or 8.5 CGPA"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">What are your interests? (Select all that apply)</Label>
              <p className="text-sm text-muted-foreground mb-4">Choose the areas that excite you the most</p>
              <div className="grid md:grid-cols-2 gap-3">
                {interests.map((interest) => (
                  <div key={interest} className="flex items-center space-x-2">
                    <Checkbox
                      id={interest}
                      checked={formData.interests.includes(interest)}
                      onCheckedChange={(checked) => handleInterestChange(interest, checked)}
                    />
                    <Label htmlFor={interest} className="cursor-pointer">{interest}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="skills">Current Skills</Label>
              <Textarea
                id="skills"
                value={formData.skills}
                onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                placeholder="List your current skills, certifications, projects, etc."
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="aspirations">Career Aspirations</Label>
              <Textarea
                id="aspirations"
                value={formData.aspirations}
                onChange={(e) => setFormData(prev => ({ ...prev, aspirations: e.target.value }))}
                placeholder="Describe your career goals and what you want to achieve"
                rows={4}
              />
            </div>
            <div>
              <Label className="text-base font-medium">Preferred Industries</Label>
              <p className="text-sm text-muted-foreground mb-4">Select industries you'd like to work in</p>
              <div className="grid md:grid-cols-2 gap-3">
                {industries.map((industry) => (
                  <div key={industry} className="flex items-center space-x-2">
                    <Checkbox
                      id={industry}
                      checked={formData.preferredIndustries.includes(industry)}
                      onCheckedChange={(checked) => handleIndustryChange(industry, checked)}
                    />
                    <Label htmlFor={industry} className="cursor-pointer">{industry}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="resume">Resume/CV (Optional)</Label>
              <p className="text-sm text-muted-foreground mb-2">Upload your resume for better recommendations</p>
              <Input
                id="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setFormData(prev => ({ ...prev, resume: e.target.files?.[0] || null }))}
              />
            </div>
            
            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Summary</CardTitle>
                <CardDescription>Review your information before proceeding</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div><strong>Name:</strong> {formData.name}</div>
                <div><strong>Education:</strong> {formData.education} in {formData.stream}</div>
                <div><strong>Interests:</strong> {formData.interests.join(", ")}</div>
                <div><strong>Preferred Industries:</strong> {formData.preferredIndustries.join(", ")}</div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const tabs = [
    { name: "View Profile", content: <ProfileDetails onEdit={() => {}} /> },
    { 
      name: "Edit Profile", 
      content: (
        <div className="container mx-auto px-4 py-8">
          {/* Progress Header */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold mb-2">Build Your Career Profile</h1>
              <p className="text-muted-foreground">Help us understand you better to provide personalized recommendations</p>
            </div>
            
            <div className="mb-6">
              <Progress value={progress} className="w-full h-2" />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>Step {currentStep} of {steps.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
            </div>

            {/* Steps */}
            <div className="flex justify-between mb-8">
              {steps.map((step) => {
                const Icon = step.icon;
                const isActive = step.id === currentStep;
                const isCompleted = step.id < currentStep;
                
                return (
                  <div key={step.id} className="flex flex-col items-center space-y-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isActive ? 'bg-primary text-primary-foreground' :
                      isCompleted ? 'bg-accent text-accent-foreground' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className={`text-xs ${isActive ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Content */}
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {React.createElement(steps[currentStep - 1].icon, { className: "h-5 w-5" })}
                  <span>{steps[currentStep - 1].title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderStepContent()}
                
                <div className="flex justify-between mt-8">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={currentStep === 1}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate("/dashboard")}
                    >
                      Cancel
                    </Button>
                  </div>
                  
                  <Button
                    variant="hero"
                    onClick={handleNext}
                  >
                    {currentStep === steps.length ? "Get Recommendations" : "Next"}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ProfileTabs tabs={tabs} />
    </div>
  );
};

export default Profile;


