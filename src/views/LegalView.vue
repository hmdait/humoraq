<template>
  <DefaultLayout>
    <div class="legal-page">
      <!-- Header with Navigation -->
      <div class="legal-header">
        <div class="container">
          <h1 class="display-5 mb-4">Legal Information</h1>
          <div class="btn-group" role="group">
            <button
              @click="activeSection = 'privacy'"
              :class="['btn', activeSection === 'privacy' ? 'btn-primary' : 'btn-outline-secondary']"
            >
              Privacy Policy
            </button>
            <button
              @click="activeSection = 'terms'"
              :class="['btn', activeSection === 'terms' ? 'btn-primary' : 'btn-outline-secondary']"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="container py-5">
        <div class="card shadow-sm">
          <div class="card-body p-4 p-md-5">
            <p class="text-muted small mb-4">Last Updated: January 17, 2026</p>

            <!-- Privacy Policy Section -->
            <div v-show="activeSection === 'privacy'" class="legal-content">
              <h2 class="mb-4">Privacy Policy</h2>
              
              <!-- Section 1 -->
              <section class="mb-5">
                <h3>1. Introduction</h3>
                <p>Welcome to Humoraq. We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard information when you use our website.</p>
                <p>By using Humoraq, you agree to the collection and use of information in accordance with this policy.</p>
              </section>

              <!-- Section 2 -->
              <section class="mb-5">
                <h3>2. Information We Collect</h3>
                <h4>2.1 Information You Provide Directly</h4>
                <ul>
                  <li><strong>Email Address (Optional):</strong> When you submit jokes, you may optionally provide an email address. This is used solely for reward notifications and important communications related to your submissions.</li>
                  <li><strong>User-Submitted Content:</strong> Any jokes, titles, or other content you submit to our platform.</li>
                  <li><strong>Display Name (Optional):</strong> A pseudonym or username you choose when submitting content. If not provided, submissions are marked as "Anonymous."</li>
                </ul>

                <h4 class="mt-4">2.2 Automatically Collected Information</h4>
                <ul>
                  <li><strong>Usage Data:</strong> We collect information about how you interact with our platform, including jokes viewed, likes given, pages visited, and time spent on the platform.</li>
                  <li><strong>Technical Data:</strong> Browser type, device information, IP address, and general location data (city/country level).</li>
                  <li><strong>Cookies and Local Storage:</strong> We use browser storage to enhance your experience (see Section 3).</li>
                </ul>
              </section>

              <!-- Section 3 -->
              <section class="mb-5">
                <h3>3. Cookies and Analytics</h3>
                <h4>3.1 Essential Cookies</h4>
                <p>We use local browser storage (localStorage) to:</p>
                <ul>
                  <li>Remember your language preferences</li>
                  <li>Track which jokes you've viewed (to prevent duplicate view counts)</li>
                  <li>Track which jokes you've liked (to prevent duplicate likes)</li>
                  <li>Store your theme preference (dark/light mode)</li>
                </ul>
                <p>These are essential for the platform's functionality and are not used for tracking across websites.</p>

                <h4 class="mt-4">3.2 Analytics</h4>
                <p>We use Firebase Analytics to understand how our platform is used. This helps us improve user experience and identify issues. Analytics data is aggregated and anonymized.</p>
                <p>You can opt out of analytics by using browser privacy settings or ad-blocking extensions.</p>
              </section>

              <!-- Section 4 -->
              <section class="mb-5">
                <h3>4. How We Use Your Information</h3>
                <p>We use collected information to:</p>
                <ul>
                  <li><strong>Provide and maintain our service:</strong> Display jokes, track interactions, and maintain platform functionality.</li>
                  <li><strong>Process rewards:</strong> Contact users via email when their jokes reach reward thresholds (if an email was provided).</li>
                  <li><strong>Improve our platform:</strong> Analyze usage patterns to enhance user experience and add new features.</li>
                  <li><strong>Communicate with users:</strong> Send important updates or respond to inquiries (only if you provided contact information).</li>
                  <li><strong>Ensure platform integrity:</strong> Detect and prevent spam, abuse, or inappropriate content.</li>
                </ul>

                <div class="alert alert-info mt-3">
                  <strong>We will never:</strong>
                  <ul class="mb-0 mt-2">
                    <li>Sell your personal information to third parties</li>
                    <li>Use your email for spam or unsolicited marketing</li>
                    <li>Share your data with advertisers</li>
                    <li>Track you across other websites</li>
                  </ul>
                </div>
              </section>

              <!-- Section 5 -->
              <section class="mb-5">
                <h3>5. User-Generated Content</h3>
                <p>When you submit a joke to Humoraq:</p>
                <ul>
                  <li>Your content becomes publicly visible on our platform</li>
                  <li>You retain ownership of your original content</li>
                  <li>You grant us a license to display, distribute, and promote your content (see Terms of Service)</li>
                  <li>Your chosen display name (or "Anonymous") will be shown publicly</li>
                  <li>Your email address (if provided) remains private and is never displayed</li>
                </ul>
              </section>

              <!-- Section 6 -->
              <section class="mb-5">
                <h3>6. Data Protection and Security</h3>
                <p>We implement appropriate technical and organizational measures to protect your data:</p>
                <ul>
                  <li>Data is stored securely using Firebase Firestore with industry-standard encryption</li>
                  <li>Email addresses are stored separately and are never displayed publicly</li>
                  <li>Access to personal data is restricted to essential platform operations</li>
                  <li>We regularly review our security practices</li>
                </ul>
                <p class="fst-italic">However, no internet transmission is completely secure. While we strive to protect your data, we cannot guarantee absolute security.</p>
              </section>

              <!-- Section 7 -->
              <section class="mb-5">
                <h3>7. Your Rights</h3>
                <p>You have the right to:</p>
                <ul>
                  <li><strong>Access:</strong> Request information about the data we hold about you</li>
                  <li><strong>Correction:</strong> Request corrections to inaccurate data</li>
                  <li><strong>Deletion:</strong> Request deletion of your data (subject to legal obligations)</li>
                  <li><strong>Withdraw Consent:</strong> Stop providing optional information at any time</li>
                  <li><strong>Data Portability:</strong> Request a copy of your data in a portable format</li>
                </ul>
                <p>To exercise these rights, contact us at: <strong>humoraq.jk@gmail.com</strong></p>

                <div class="alert alert-warning mt-3">
                  <strong>For EU Users (GDPR):</strong>
                  <p class="mb-0 mt-2">You have additional rights under the General Data Protection Regulation, including the right to lodge a complaint with your local data protection authority.</p>
                </div>
              </section>

              <!-- Section 8 -->
              <section class="mb-5">
                <h3>8. Data Retention</h3>
                <ul>
                  <li><strong>User-submitted jokes:</strong> Retained indefinitely unless you request deletion</li>
                  <li><strong>Email addresses:</strong> Retained while your content is active, or until you request deletion</li>
                  <li><strong>Usage data:</strong> Aggregated analytics data retained indefinitely; individual interaction data retained for up to 2 years</li>
                  <li><strong>Browser storage:</strong> Stored locally on your device; you can clear it at any time through your browser settings</li>
                </ul>
              </section>

              <!-- Section 9 -->
              <section class="mb-5">
                <h3>9. Children's Privacy</h3>
                <p>Humoraq is intended for general audiences. We do not knowingly collect personal information from children under 13 years of age.</p>
                <p>If you believe we have inadvertently collected information from a child under 13, please contact us immediately at <strong>humoraq.jk@gmail.com</strong>, and we will promptly delete such information.</p>
              </section>

              <!-- Section 10 -->
              <section class="mb-5">
                <h3>10. International Data Transfers</h3>
                <p>Your information may be transferred to and stored on servers located outside your country of residence. By using Humoraq, you consent to such transfers. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.</p>
              </section>

              <!-- Section 11 -->
              <section class="mb-5">
                <h3>11. Changes to This Privacy Policy</h3>
                <p>We may update this Privacy Policy from time to time to reflect changes in our practices or for legal reasons. We will notify you of significant changes by:</p>
                <ul>
                  <li>Posting the new Privacy Policy on this page</li>
                  <li>Updating the "Last Updated" date at the top of this page</li>
                  <li>For material changes, sending an email notification (if you provided an email address)</li>
                </ul>
                <p>We encourage you to review this Privacy Policy periodically.</p>
              </section>

              <!-- Section 12 -->
              <section>
                <h3>12. Contact Us</h3>
                <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>
                <div class="alert alert-secondary">
                  <p><strong>Email:</strong> humoraq.jk@gmail.com</p>
                  <p class="mb-0"><strong>Response Time:</strong> We aim to respond within 24-48 hours</p>
                </div>
              </section>
            </div>

            <!-- Terms of Service Section -->
            <div v-show="activeSection === 'terms'" class="legal-content">
              <h2 class="mb-4">Terms of Service</h2>

              <!-- Section 1 -->
              <section class="mb-5">
                <h3>1. Acceptance of Terms</h3>
                <p>Welcome to Humoraq. By accessing or using our website, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our platform.</p>
                <p>These terms apply to all users of the platform, including visitors, content contributors, and anyone who accesses our services.</p>
              </section>

              <!-- Section 2 -->
              <section class="mb-5">
                <h3>2. Description of Service</h3>
                <p>Humoraq is a multilingual humor platform that allows users to:</p>
                <ul>
                  <li>Browse and read jokes in multiple languages</li>
                  <li>Submit original jokes for public viewing</li>
                  <li>Like and interact with content</li>
                  <li>View statistics related to joke performance</li>
                  <li>Potentially earn rewards based on content performance (subject to eligibility)</li>
                </ul>
              </section>

              <!-- Section 3 -->
              <section class="mb-5">
                <h3>3. User Responsibilities</h3>
                <p>When using Humoraq, you agree to:</p>
                <ul>
                  <li>Provide accurate information when submitting content</li>
                  <li>Use the platform in a lawful and respectful manner</li>
                  <li>Not impersonate others or misrepresent your affiliation with any person or entity</li>
                  <li>Not attempt to manipulate joke statistics (views, likes) through automated means or deceptive practices</li>
                  <li>Not interfere with the proper functioning of the platform</li>
                  <li>Respect the intellectual property rights of others</li>
                  <li>Comply with all applicable local, national, and international laws</li>
                </ul>
              </section>

              <!-- Section 4 -->
              <section class="mb-5">
                <h3>4. Content Ownership and License</h3>
                <h4>4.1 Your Content</h4>
                <p>You retain all ownership rights to the jokes and content you submit to Humoraq. However, by submitting content, you grant us a non-exclusive, worldwide, royalty-free, perpetual, and transferable license to:</p>
                <ul>
                  <li>Display your content on our platform</li>
                  <li>Distribute and promote your content across our services</li>
                  <li>Make your content available to other users</li>
                  <li>Create derivative works for platform functionality (e.g., translations, formatting)</li>
                  <li>Use your content for marketing and promotional purposes</li>
                </ul>

                <h4 class="mt-4">4.2 Platform Content</h4>
                <p>All content on Humoraq, excluding user-submitted jokes, including but not limited to text, graphics, logos, icons, and software, is the property of Humoraq or its licensors and is protected by copyright and other intellectual property laws.</p>
              </section>

              <!-- Section 5 -->
              <section class="mb-5">
                <h3>5. Prohibited Content</h3>
                <p>You may not submit content that:</p>
                <ul>
                  <li>Is illegal, harmful, threatening, abusive, harassing, defamatory, or invasive of privacy</li>
                  <li>Promotes hatred, discrimination, or violence against individuals or groups based on race, ethnicity, religion, gender, sexual orientation, disability, or other protected characteristics</li>
                  <li>Contains nudity, sexually explicit material, or content inappropriate for general audiences</li>
                  <li>Infringes on intellectual property rights or violates any third-party rights</li>
                  <li>Contains viruses, malware, or other harmful code</li>
                  <li>Is spam, advertising, or promotional material (unless authorized)</li>
                  <li>Impersonates any person or entity or misrepresents your affiliation</li>
                  <li>Violates any applicable law or regulation</li>
                </ul>
                <div class="alert alert-danger mt-3">
                  <strong>Important:</strong> While Humoraq is a humor platform, jokes should be appropriate for all audiences. Content that crosses the line into offensive, harmful, or inappropriate territory will be removed.
                </div>
              </section>

              <!-- Section 6 -->
              <section class="mb-5">
                <h3>6. Content Moderation and Removal</h3>
                <p>We reserve the right, but do not have the obligation, to monitor, review, edit, or remove any content at our sole discretion. This includes content that:</p>
                <ul>
                  <li>Violates these Terms of Service</li>
                  <li>Violates applicable laws</li>
                  <li>Is reported by users as inappropriate</li>
                  <li>We determine is harmful to our community or platform</li>
                </ul>
                <p>Content removal does not require prior notice. We may also suspend or terminate accounts associated with prohibited content.</p>
              </section>

              <!-- Section 7 -->
              <section class="mb-5">
                <h3>7. Rewards Program</h3>
                <div class="alert alert-warning">
                  <strong>Important Disclaimer:</strong> Humoraq may offer rewards to users whose jokes achieve certain performance milestones. However, participation in the rewards program does not guarantee any earnings or payments.
                </div>

                <p>Rewards program terms:</p>
                <ul>
                  <li><strong>Eligibility:</strong> Only users who provide a valid email address are eligible for rewards</li>
                  <li><strong>Thresholds:</strong> Rewards are based on performance metrics (views, likes) as specified on the submission page</li>
                  <li><strong>Verification:</strong> We reserve the right to verify the legitimacy of views and likes before issuing rewards</li>
                  <li><strong>Fraudulent Activity:</strong> Manipulation of statistics through bots, fake accounts, or other deceptive means will result in disqualification and account termination</li>
                  <li><strong>Payment Processing:</strong> Rewards are processed manually and may take time to fulfill</li>
                  <li><strong>No Guarantee:</strong> There is no guarantee that submitted content will achieve reward thresholds</li>
                  <li><strong>Changes:</strong> We may modify or discontinue the rewards program at any time without prior notice</li>
                  <li><strong>Taxes:</strong> You are responsible for any tax obligations related to rewards received</li>
                </ul>
              </section>

              <!-- Section 8 -->
              <section class="mb-5">
                <h3>8. Disclaimer of Warranties</h3>
                <p>Humoraq is provided on an "as is" and "as available" basis without warranties of any kind, either express or implied. We do not warrant that:</p>
                <ul>
                  <li>The platform will be uninterrupted, secure, or error-free</li>
                  <li>The results obtained from using the platform will be accurate or reliable</li>
                  <li>Any errors or defects will be corrected</li>
                  <li>User-submitted content is accurate, appropriate, or non-infringing</li>
                </ul>
              </section>

              <!-- Section 9 -->
              <section class="mb-5">
                <h3>9. Limitation of Liability</h3>
                <p>To the fullest extent permitted by law, Humoraq and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:</p>
                <ul>
                  <li>Loss of profits, data, or goodwill</li>
                  <li>Service interruption or system failures</li>
                  <li>Cost of substitute services</li>
                  <li>Any damages arising from user-submitted content</li>
                  <li>Inability to earn rewards or achieve performance milestones</li>
                </ul>
                <p>Our total liability for any claim arising from your use of Humoraq shall not exceed the amount you paid to us in the past 12 months (if any).</p>
              </section>

              <!-- Section 10 -->
              <section class="mb-5">
                <h3>10. Indemnification</h3>
                <p>You agree to indemnify and hold harmless Humoraq, its operators, and affiliates from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:</p>
                <ul>
                  <li>Your use of the platform</li>
                  <li>Your violation of these Terms of Service</li>
                  <li>Your violation of any rights of another party</li>
                  <li>Content you submit to the platform</li>
                </ul>
              </section>

              <!-- Section 11 -->
              <section class="mb-5">
                <h3>11. Account Termination</h3>
                <p>We reserve the right to suspend or terminate access to Humoraq for any user who:</p>
                <ul>
                  <li>Violates these Terms of Service</li>
                  <li>Engages in fraudulent or deceptive practices</li>
                  <li>Submits prohibited content</li>
                  <li>Interferes with platform operations</li>
                  <li>Engages in behavior harmful to other users or the platform</li>
                </ul>
                <p>Termination may occur without prior notice. Upon termination, your right to use the platform ceases immediately.</p>
              </section>

              <!-- Section 12 -->
              <section class="mb-5">
                <h3>12. Third-Party Links</h3>
                <p>Humoraq may contain links to third-party websites or services. We are not responsible for the content, privacy policies, or practices of any third-party sites. You access third-party sites at your own risk.</p>
              </section>

              <!-- Section 13 -->
              <section class="mb-5">
                <h3>13. Changes to These Terms</h3>
                <p>We may modify these Terms of Service at any time. When we make changes, we will:</p>
                <ul>
                  <li>Post the updated terms on this page</li>
                  <li>Update the "Last Updated" date</li>
                  <li>For material changes, provide notice through the platform or via email</li>
                </ul>
                <p>Your continued use of Humoraq after changes are posted constitutes acceptance of the modified terms.</p>
              </section>

              <!-- Section 14 -->
              <section class="mb-5">
                <h3>14. Governing Law</h3>
                <p>These Terms of Service shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles. Any disputes arising from these terms or your use of Humoraq shall be resolved through good faith negotiation or appropriate legal channels.</p>
              </section>

              <!-- Section 15 -->
              <section class="mb-5">
                <h3>15. Severability</h3>
                <p>If any provision of these Terms of Service is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.</p>
              </section>

              <!-- Section 16 -->
              <section>
                <h3>16. Contact Information</h3>
                <p>For questions, concerns, or notices regarding these Terms of Service, please contact us:</p>
                <div class="alert alert-secondary">
                  <p><strong>Email:</strong> humoraq.jk@gmail.com</p>
                  <p class="mb-0"><strong>Response Time:</strong> We aim to respond within 24-48 hours</p>
                </div>
              </section>

              <div class="alert alert-info mt-5">
                <strong>Thank you for using Humoraq!</strong>
                <p class="mb-0 mt-2">By using our platform, you help create a vibrant community of humor and joy. We appreciate your cooperation in maintaining a positive, respectful environment for all users.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { updateSEO } from '../utils/seo';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

const activeSection = ref('privacy');

watch(activeSection, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

onMounted(() => {
  updateSEO({
    title: 'Privacy Policy & Terms of Service - Humoraq',
    description: 'Read our Privacy Policy and Terms of Service to understand how Humoraq protects your data and manages our platform.'
  });
});
</script>

<style scoped>
.legal-page {
  min-height: 100vh;
  background-color: var(--bg-light);
}

.legal-header {
  background-color: var(--card-bg);
  border-bottom: 1px solid var(--border-color);
  padding: 2rem 0;
  margin-bottom: 2rem;
  position: sticky;
  top: 72px;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.legal-content h2 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-color);
  border-bottom: 3px solid var(--primary-color);
  padding-bottom: 0.5rem;
}

.legal-content h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color);
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

.legal-content h4 {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-color);
  margin-top: 1rem;
  margin-bottom: 0.75rem;
}

.legal-content p {
  line-height: 1.7;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.legal-content ul {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.legal-content ul li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.legal-content section {
  scroll-margin-top: 150px;
}

.btn-group .btn {
  font-weight: 500;
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

/* Dark mode */
.dark-mode .legal-page {
  background-color: #1a1d20;
}

.dark-mode .legal-header {
  background-color: var(--card-bg);
  border-bottom-color: var(--border-color);
}

.dark-mode .legal-content h2 {
  border-bottom-color: var(--primary-color);
}

/* Responsive */
@media (max-width: 768px) {
  .legal-header {
    top: 64px;
    padding: 1.5rem 0;
  }

  .legal-content h2 {
    font-size: 1.75rem;
  }

  .legal-content h3 {
    font-size: 1.3rem;
  }

  .btn-group {
    width: 100%;
    display: flex;
  }

  .btn-group .btn {
    flex: 1;
    font-size: 0.9rem;
  }
}
</style>