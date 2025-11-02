import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { UserCircle, Mail, Phone, BookOpen, Award, Lightbulb, Briefcase, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfileDetails = ({ userProfile, onEdit }) => {
  // Placeholder data for now
  const user = userProfile || {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 123 456 7890",
    education: "Graduation in Computer Science",
    skills: "React, Node.js, Python, Tailwind CSS",
    interests: "Technology & Programming, AI/ML, Web Development",
    aspirations: "Become a Senior Software Engineer at a leading tech company.",
    preferredIndustries: "Information Technology, Startups"
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-4">
            <UserCircle className="h-12 w-12 text-primary" />
            <div>
              <CardTitle className="text-2xl font-bold">{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
          </div>
          <Button onClick={onEdit}>Edit Profile</Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <p><strong>Email:</strong> {user.email}</p>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <p><strong>Phone:</strong> {user.phone}</p>
            </div>
            <div className="flex items-center space-x-3">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              <p><strong>Education:</strong> {user.education}</p>
            </div>
            <div className="flex items-center space-x-3">
              <Award className="h-5 w-5 text-muted-foreground" />
              <p><strong>Skills:</strong> {user.skills}</p>
            </div>
            <div className="flex items-center space-x-3">
              <Lightbulb className="h-5 w-5 text-muted-foreground" />
              <p><strong>Interests:</strong> {user.interests}</p>
            </div>
            <div className="flex items-center space-x-3">
              <Briefcase className="h-5 w-5 text-muted-foreground" />
              <p><strong>Preferred Industries:</strong> {user.preferredIndustries}</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Career Aspirations:</h3>
            <p>{user.aspirations}</p>
          </div>
          <div className="flex justify-end mt-6">
            <Link to="/dashboard">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileDetails;
