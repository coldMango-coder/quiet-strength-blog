import React from 'react';
import Seo from '../components/Seo';

const Terms = () => {
  return (
    <>
      <Seo
        title="Terms of Use - Quiet Strength"
        description="Terms of Use for Quiet Strength: Self-Help for Introverted Women."
      />
      <div className="bg-white min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <h1 className="text-4xl font-bold text-brand-emphasis mb-8">Terms of Use</h1>
          <div className="prose prose-lg text-gray-600">
            <p>Last updated: {new Date().toLocaleDateString()}</p>

            <h2>1. Introduction</h2>
            <p>Welcome to Quiet Strength. By accessing this website, you agree to be bound by these Terms of Use, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>

            <h2>2. Use License</h2>
            <p>Permission is granted to temporarily download one copy of the materials (information or software) on Quiet Strength's website for personal, non-commercial transitory viewing only.</p>

            <h2>3. Disclaimer</h2>
            <p>The materials on Quiet Strength's website are provided on an 'as is' basis. Quiet Strength makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>

            <h2>4. Limitations</h2>
            <p>In no event shall Quiet Strength or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Quiet Strength's website.</p>

            <h2>5. Revisions and Errata</h2>
            <p>The materials appearing on Quiet Strength's website could include technical, typographical, or photographic errors. Quiet Strength does not warrant that any of the materials on its website are accurate, complete, or current.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Terms;
