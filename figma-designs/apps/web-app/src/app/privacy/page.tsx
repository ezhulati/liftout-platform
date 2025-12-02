/* eslint-disable react/no-unescaped-entities */
'use client';

import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-bg-surface">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-navy transition-colors mb-8"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="bg-bg-elevated rounded-lg border border-border p-8 md:p-12">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Privacy Policy</h1>
          <p className="text-text-tertiary mb-8">Last updated: January 1, 2025</p>

          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">1. Introduction</h2>
              <p className="text-text-secondary mb-4">
                Liftout ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains
                how we collect, use, disclose, and safeguard your information when you use our team-based hiring
                marketplace platform ("Service").
              </p>
              <p className="text-text-secondary mb-4">
                Please read this Privacy Policy carefully. By using the Service, you agree to the collection and use
                of information in accordance with this policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">2. Information We Collect</h2>

              <h3 className="text-lg font-medium text-text-primary mb-3">2.1 Personal Information</h3>
              <p className="text-text-secondary mb-4">
                We may collect personal information that you voluntarily provide when using our Service, including:
              </p>
              <ul className="list-disc pl-6 text-text-secondary space-y-2 mb-4">
                <li>Name, email address, and contact information</li>
                <li>Professional experience, skills, and qualifications</li>
                <li>Current and past employment information</li>
                <li>Education history</li>
                <li>Team membership and role information</li>
                <li>Company information (for company users)</li>
                <li>Payment information (processed by secure third-party providers)</li>
              </ul>

              <h3 className="text-lg font-medium text-text-primary mb-3">2.2 Team Information</h3>
              <p className="text-text-secondary mb-4">
                For teams registered on our platform, we collect:
              </p>
              <ul className="list-disc pl-6 text-text-secondary space-y-2 mb-4">
                <li>Team composition and member profiles</li>
                <li>Team cohesion metrics and working history</li>
                <li>Professional achievements and track record</li>
                <li>Availability and liftout preferences</li>
                <li>Compensation expectations</li>
              </ul>

              <h3 className="text-lg font-medium text-text-primary mb-3">2.3 Automatically Collected Information</h3>
              <p className="text-text-secondary mb-4">
                When you access the Service, we automatically collect certain information, including:
              </p>
              <ul className="list-disc pl-6 text-text-secondary space-y-2 mb-4">
                <li>Device information (browser type, operating system)</li>
                <li>IP address and general location</li>
                <li>Usage data (pages viewed, features used, time spent)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">3. How We Use Your Information</h2>
              <p className="text-text-secondary mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 text-text-secondary space-y-2 mb-4">
                <li>Provide, maintain, and improve our Service</li>
                <li>Match teams with relevant opportunities</li>
                <li>Facilitate communication between teams and companies</li>
                <li>Process transactions and send related information</li>
                <li>Send promotional communications (with your consent)</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Monitor and analyze trends, usage, and activities</li>
                <li>Detect, investigate, and prevent fraudulent or unauthorized activities</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">4. Information Sharing and Disclosure</h2>
              <p className="text-text-secondary mb-4">We may share your information in the following circumstances:</p>

              <h3 className="text-lg font-medium text-text-primary mb-3">4.1 With Other Users</h3>
              <p className="text-text-secondary mb-4">
                When you create a team profile or company profile, certain information may be visible to other users
                of the platform as necessary to facilitate the matching and hiring process. You control the visibility
                of your profile through your privacy settings.
              </p>

              <h3 className="text-lg font-medium text-text-primary mb-3">4.2 With Service Providers</h3>
              <p className="text-text-secondary mb-4">
                We may share information with third-party vendors and service providers who perform services on our
                behalf, such as payment processing, data analysis, email delivery, hosting, and customer service.
              </p>

              <h3 className="text-lg font-medium text-text-primary mb-3">4.3 For Legal Purposes</h3>
              <p className="text-text-secondary mb-4">
                We may disclose information if required to do so by law or in response to valid requests by public
                authorities, or to protect our rights, privacy, safety, or property.
              </p>

              <h3 className="text-lg font-medium text-text-primary mb-3">4.4 Business Transfers</h3>
              <p className="text-text-secondary mb-4">
                In connection with any merger, sale of company assets, financing, or acquisition of all or a portion
                of our business, your information may be transferred as part of such transaction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">5. Data Security</h2>
              <p className="text-text-secondary mb-4">
                We implement appropriate technical and organizational security measures to protect your personal
                information, including:
              </p>
              <ul className="list-disc pl-6 text-text-secondary space-y-2 mb-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and audits</li>
                <li>Access controls and authentication measures</li>
                <li>Employee training on data protection</li>
                <li>Incident response procedures</li>
              </ul>
              <p className="text-text-secondary mb-4">
                However, no method of transmission over the Internet or electronic storage is 100% secure. While we
                strive to protect your personal information, we cannot guarantee its absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">6. Data Retention</h2>
              <p className="text-text-secondary mb-4">
                We retain your personal information for as long as necessary to provide the Service and fulfill the
                purposes described in this Privacy Policy, unless a longer retention period is required or permitted
                by law. When we no longer need your information, we will securely delete or anonymize it.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">7. Your Rights and Choices</h2>
              <p className="text-text-secondary mb-4">
                Depending on your location, you may have certain rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 text-text-secondary space-y-2 mb-4">
                <li><strong>Access:</strong> Request access to your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                <li><strong>Opt-out:</strong> Opt out of marketing communications</li>
                <li><strong>Restriction:</strong> Request restriction of certain processing</li>
              </ul>
              <p className="text-text-secondary mb-4">
                To exercise these rights, please contact us at privacy@liftout.com.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">8. Cookies and Tracking Technologies</h2>
              <p className="text-text-secondary mb-4">
                We use cookies and similar tracking technologies to track activity on our Service and store certain
                information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being
                sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
              </p>
              <p className="text-text-secondary mb-4">Types of cookies we use:</p>
              <ul className="list-disc pl-6 text-text-secondary space-y-2 mb-4">
                <li><strong>Essential Cookies:</strong> Required for the Service to function</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors use the Service</li>
                <li><strong>Preference Cookies:</strong> Remember your preferences and settings</li>
                <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">9. International Data Transfers</h2>
              <p className="text-text-secondary mb-4">
                Your information may be transferred to and processed in countries other than your country of residence.
                These countries may have data protection laws that are different from the laws of your country. We take
                appropriate safeguards to ensure that your personal information remains protected in accordance with
                this Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">10. Children's Privacy</h2>
              <p className="text-text-secondary mb-4">
                Our Service is not intended for individuals under the age of 18. We do not knowingly collect personal
                information from children under 18. If you are a parent or guardian and believe your child has provided
                us with personal information, please contact us.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">11. California Privacy Rights</h2>
              <p className="text-text-secondary mb-4">
                California residents have additional rights under the California Consumer Privacy Act (CCPA), including
                the right to know what personal information we collect, the right to request deletion, and the right to
                opt-out of the sale of personal information. We do not sell personal information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">12. Changes to This Privacy Policy</h2>
              <p className="text-text-secondary mb-4">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the
                new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this
                Privacy Policy periodically for any changes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">13. Contact Us</h2>
              <p className="text-text-secondary mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <p className="text-text-secondary">
                <strong>Email:</strong> privacy@liftout.com<br />
                <strong>Address:</strong> 123 Innovation Drive, San Francisco, CA 94105<br />
                <strong>Data Protection Officer:</strong> dpo@liftout.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
