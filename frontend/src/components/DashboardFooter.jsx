import React from 'react';

const DashboardFooter = () => {
  return (
    <footer className="bg-card shadow-md mt-8 py-4">
      <div className="container mx-auto px-6 text-center text-muted-foreground text-sm">
        &copy; {new Date().getFullYear()} Project Satori. All rights reserved.
      </div>
    </footer>
  );
};

export default DashboardFooter;
