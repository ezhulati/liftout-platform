'use client';

import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function TermsOfServicePage() {
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
          <h1 className="text-3xl font-bold text-text-primary mb-2">Terms of Service</h1>
          <p className="text-text-tertiary mb-8">Last updated: January 1, 2025</p>

          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">1. Acceptance of Terms</h2>
              <p className="text-text-secondary mb-4">
                By accessing or using the Liftout platform ("Service"), you agree to be bound by these Terms of Service
                ("Terms"). If you disagree with any part of the terms, you may not access the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">2. Description of Service</h2>
              <p className="text-text-secondary mb-4">
                Liftout is a team-based hiring marketplace that connects companies seeking to acquire high-performing
                intact teams with teams looking for new opportunities together. Our platform facilitates:
              </p>
              <ul className="list-disc pl-6 text-text-secondary space-y-2 mb-4">
                <li>Team profile creation and verification</li>
                <li>Opportunity posting and discovery</li>
                <li>Secure communication between parties</li>
                <li>Due diligence and matching services</li>
                <li>Transaction facilitation and support</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">3. User Accounts</h2>
              <p className="text-text-secondary mb-4">
                When you create an account with us, you must provide accurate, complete, and current information.
                Failure to do so constitutes a breach of the Terms.
              </p>
              <p className="text-text-secondary mb-4">
                You are responsible for safeguarding the password used to access the Service and for any activities
                or actions under your password. You must notify us immediately upon becoming aware of any breach of
                security or unauthorized use of your account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">4. User Types and Responsibilities</h2>

              <h3 className="text-lg font-medium text-text-primary mb-3">4.1 Team Users</h3>
              <p className="text-text-secondary mb-4">
                Team users represent groups of professionals seeking new opportunities together. Team users agree to:
              </p>
              <ul className="list-disc pl-6 text-text-secondary space-y-2 mb-4">
                <li>Provide accurate information about team composition and capabilities</li>
                <li>Maintain current employment information</li>
                <li>Represent only teams they are authorized to represent</li>
                <li>Comply with any existing employment agreements and non-compete clauses</li>
              </ul>

              <h3 className="text-lg font-medium text-text-primary mb-3">4.2 Company Users</h3>
              <p className="text-text-secondary mb-4">
                Company users represent organizations seeking to acquire teams. Company users agree to:
              </p>
              <ul className="list-disc pl-6 text-text-secondary space-y-2 mb-4">
                <li>Provide accurate company and opportunity information</li>
                <li>Have authority to post opportunities on behalf of their organization</li>
                <li>Conduct hiring practices in compliance with applicable laws</li>
                <li>Maintain confidentiality of team information as agreed</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">5. Confidentiality</h2>
              <p className="text-text-secondary mb-4">
                Users may gain access to confidential information through the platform. All users agree to:
              </p>
              <ul className="list-disc pl-6 text-text-secondary space-y-2 mb-4">
                <li>Maintain the confidentiality of information shared on the platform</li>
                <li>Not disclose team or company information without explicit consent</li>
                <li>Use information only for purposes related to the liftout process</li>
                <li>Delete confidential information upon request or termination of discussions</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">6. Prohibited Uses</h2>
              <p className="text-text-secondary mb-4">You may not use the Service:</p>
              <ul className="list-disc pl-6 text-text-secondary space-y-2 mb-4">
                <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>To violate any international, federal, or state regulations, rules, or laws</li>
                <li>To infringe upon or violate our intellectual property rights or those of others</li>
                <li>To harass, abuse, insult, harm, defame, or discriminate</li>
                <li>To submit false or misleading information</li>
                <li>To upload or transmit viruses or any other type of malicious code</li>
                <li>To collect or track personal information of others without consent</li>
                <li>To spam, phish, or engage in social engineering</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">7. Fees and Payment</h2>
              <p className="text-text-secondary mb-4">
                Certain features of the Service may be subject to fees. Any applicable fees will be disclosed before
                you incur them. Payment terms and refund policies will be specified at the time of purchase.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">8. Intellectual Property</h2>
              <p className="text-text-secondary mb-4">
                The Service and its original content (excluding content provided by users), features, and functionality
                are and will remain the exclusive property of Liftout and its licensors. The Service is protected by
                copyright, trademark, and other laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">9. Termination</h2>
              <p className="text-text-secondary mb-4">
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason,
                including breach of these Terms. Upon termination, your right to use the Service will cease immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">10. Limitation of Liability</h2>
              <p className="text-text-secondary mb-4">
                In no event shall Liftout, nor its directors, employees, partners, agents, suppliers, or affiliates,
                be liable for any indirect, incidental, special, consequential, or punitive damages, including without
                limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access
                to or use of or inability to access or use the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">11. Disclaimer</h2>
              <p className="text-text-secondary mb-4">
                Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE"
                basis. The Service is provided without warranties of any kind, whether express or implied, including,
                but not limited to, implied warranties of merchantability, fitness for a particular purpose,
                non-infringement, or course of performance.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">12. Governing Law</h2>
              <p className="text-text-secondary mb-4">
                These Terms shall be governed and construed in accordance with the laws of the State of Delaware,
                United States, without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">13. Changes to Terms</h2>
              <p className="text-text-secondary mb-4">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will
                try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a
                material change will be determined at our sole discretion.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">14. Contact Us</h2>
              <p className="text-text-secondary mb-4">
                If you have any questions about these Terms, please contact us at:
              </p>
              <p className="text-text-secondary">
                <strong>Email:</strong> legal@liftout.com<br />
                <strong>Address:</strong> 123 Innovation Drive, San Francisco, CA 94105
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
