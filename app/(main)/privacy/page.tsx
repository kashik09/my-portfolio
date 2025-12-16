export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: December 16, 2025</p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">1. Introduction</h2>
          <p className="text-foreground leading-relaxed mb-4">
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services. By using our services, you consent to the data practices described in this policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">2. Information We Collect</h2>

          <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">2.1 Personal Information</h3>
          <p className="text-foreground leading-relaxed mb-4">
            We may collect personal information that you voluntarily provide to us, including:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
            <li>Name and contact information (email, phone number)</li>
            <li>Company name and business information</li>
            <li>Project details and requirements</li>
            <li>Payment and billing information</li>
            <li>Account credentials (username, password)</li>
            <li>Communication preferences</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">2.2 Automatically Collected Information</h3>
          <p className="text-foreground leading-relaxed mb-4">
            When you visit our website, we may automatically collect:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
            <li>IP address and location data</li>
            <li>Browser type and version</li>
            <li>Device information</li>
            <li>Pages visited and time spent on site</li>
            <li>Referring website addresses</li>
            <li>Interaction with site features</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">2.3 Cookies and Tracking Technologies</h3>
          <p className="text-foreground leading-relaxed mb-4">
            We use cookies and similar tracking technologies to enhance your experience. These may include:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
            <li>Session cookies for authentication</li>
            <li>Preference cookies to remember your settings</li>
            <li>Analytics cookies to understand site usage</li>
            <li>Third-party cookies from integrated services</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">3. How We Use Your Information</h2>
          <p className="text-foreground leading-relaxed mb-4">
            We use the collected information for various purposes:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
            <li>To provide, maintain, and improve our services</li>
            <li>To process project requests and communicate with you</li>
            <li>To send administrative information and updates</li>
            <li>To respond to inquiries and provide customer support</li>
            <li>To process payments and manage billing</li>
            <li>To personalize your experience on our platform</li>
            <li>To analyze usage patterns and optimize our website</li>
            <li>To detect, prevent, and address technical issues</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">4. Information Sharing and Disclosure</h2>
          <p className="text-foreground leading-relaxed mb-4">
            We do not sell your personal information. We may share your information in the following circumstances:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
            <li><strong>Service Providers:</strong> With third-party vendors who perform services on our behalf (e.g., payment processors, hosting providers, analytics services)</li>
            <li><strong>Legal Requirements:</strong> When required by law, court order, or governmental authority</li>
            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            <li><strong>With Your Consent:</strong> When you explicitly authorize us to share specific information</li>
            <li><strong>Protection of Rights:</strong> To protect our rights, privacy, safety, or property, or that of others</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">5. Data Security</h2>
          <p className="text-foreground leading-relaxed mb-4">
            We implement appropriate technical and organizational security measures to protect your personal information:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
            <li>Encryption of data in transit and at rest</li>
            <li>Secure authentication mechanisms</li>
            <li>Regular security assessments and updates</li>
            <li>Access controls and authorization protocols</li>
            <li>Employee training on data protection</li>
          </ul>
          <p className="text-foreground leading-relaxed mt-4">
            However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">6. Data Retention</h2>
          <p className="text-foreground leading-relaxed mb-4">
            We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When information is no longer needed, we will securely delete or anonymize it.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">7. Your Rights and Choices</h2>
          <p className="text-foreground leading-relaxed mb-4">
            Depending on your location, you may have certain rights regarding your personal information:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
            <li><strong>Access:</strong> Request access to your personal information</li>
            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
            <li><strong>Deletion:</strong> Request deletion of your personal information</li>
            <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
            <li><strong>Objection:</strong> Object to certain processing of your information</li>
            <li><strong>Restriction:</strong> Request restriction of processing</li>
            <li><strong>Withdraw Consent:</strong> Withdraw consent where processing is based on consent</li>
          </ul>
          <p className="text-foreground leading-relaxed mt-4">
            To exercise these rights, please contact us using the information provided at the end of this policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">8. Third-Party Links</h2>
          <p className="text-foreground leading-relaxed mb-4">
            Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">9. Children's Privacy</h2>
          <p className="text-foreground leading-relaxed mb-4">
            Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">10. International Data Transfers</h2>
          <p className="text-foreground leading-relaxed mb-4">
            Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. By using our services, you consent to such transfers.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">11. Changes to This Privacy Policy</h2>
          <p className="text-foreground leading-relaxed mb-4">
            We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Your continued use of our services after changes are posted constitutes your acceptance of the revised policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">12. Cookie Management</h2>
          <p className="text-foreground leading-relaxed mb-4">
            Most web browsers allow you to control cookies through their settings. You can:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
            <li>View cookies stored on your device</li>
            <li>Delete existing cookies</li>
            <li>Block future cookies</li>
            <li>Set preferences for specific websites</li>
          </ul>
          <p className="text-foreground leading-relaxed mt-4">
            Note that disabling cookies may affect the functionality of our website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">13. Contact Us</h2>
          <p className="text-foreground leading-relaxed mb-4">
            If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us through:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
            <li>The contact form on our website</li>
            <li>Email or phone provided on our contact page</li>
          </ul>
          <p className="text-foreground leading-relaxed mt-4">
            We will respond to your inquiry within a reasonable timeframe.
          </p>
        </section>

        <div className="mt-12 p-6 bg-muted rounded-lg border border-border">
          <p className="text-sm text-muted-foreground">
            By using our website and services, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.
          </p>
        </div>
      </div>
    </div>
  )
}
