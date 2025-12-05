import React from 'react';
import Seo from '../components/Seo';

export default function PrivacyPolicy(){
  return (
    <div className="container mx-auto px-6 py-16 article-container">
      <Seo title="Privacy Policy" description="How Quiet Strength collects, uses, and protects your information." path="/privacy-policy" />
      <h1>Privacy Policy</h1>
      <p>Last updated: {new Date().toISOString().slice(0,10)}</p>

      <h2>Overview</h2>
      <p>Quiet Strength ("we", "us", "our") operates this website to provide educational content for womenâ€™s personal and professional growth.</p>

      <h2>Information We Collect</h2>
      <h3>Voluntary Information</h3>
      <p>When you subscribe, comment, or contact us, we collect your name, email, and any message you send.</p>
      <h3>Automatic Data</h3>
      <p>We use cookies and analytics to understand traffic and improve content. You can control cookies in your browser.</p>

      <h2>How We Use Information</h2>
      <ul>
        <li>To deliver content and newsletters you request</li>
        <li>To improve site performance and user experience</li>
        <li>To respond to inquiries and support requests</li>
      </ul>

      <h2>Third-Party Services</h2>
      <p>We may use reputable providers (e.g., hosting, analytics). They process data on our behalf under contractual safeguards.</p>

      <h2>Your Choices</h2>
      <p>You may unsubscribe at any time via the link in our emails. Contact us to request access or deletion of your data where applicable.</p>

      <h2>Contact</h2>
      <p>Email: hello@trueallyguide.com</p>
    </div>
  );
}

