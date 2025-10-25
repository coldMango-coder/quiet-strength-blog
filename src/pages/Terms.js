import React from 'react';
import Seo from '../components/Seo';

export default function Terms(){
  return (
    <div className="container mx-auto px-6 py-16 article-container">
      <Seo title="Terms of Use" description="Terms governing the use of Quiet Strength." path="/terms" />
      <h1>Terms of Use</h1>
      <p>Last updated: {new Date().toISOString().slice(0,10)}</p>

      <h2>Acceptance of Terms</h2>
      <p>By accessing or using this website, you agree to these Terms of Use and our Privacy Policy.</p>

      <h2>Content & Disclaimer</h2>
      <p>All content is for informational purposes only and is not medical, psychological, legal, or financial advice.</p>

      <h2>Intellectual Property</h2>
      <p>Content on this site is owned by Quiet Strength unless otherwise noted. You may link to our articles but may not republish without permission.</p>

      <h2>User Conduct</h2>
      <ul>
        <li>Do not post harmful, unlawful, or infringing content.</li>
        <li>Do not attempt to disrupt site operation or security.</li>
      </ul>

      <h2>Links</h2>
      <p>We may link to external resources. We are not responsible for their content or practices.</p>

      <h2>Changes</h2>
      <p>We may update these Terms. Continued use means you accept the changes.</p>

      <h2>Contact</h2>
      <p>Email: hello@trueallyguide.com</p>
    </div>
  );
}

