import React from 'react';
import { Link } from 'react-router-dom';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-20 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service for Summit Land USA</h1>
            <p className="text-gray-600 mb-8">Last Updated: December 22, 2025</p>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-8">
                Welcome to Summit Land USA. These Terms of Service ("Terms") govern your use of our website (summitlandusa.com) and any services we provide in connection with buying or selling land across America. By accessing or using our website, you agree to be bound by these Terms.
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-700 mb-4">
                  By accessing and using our website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these Terms, please do not use our website or services.
                </p>
                <p className="text-gray-700">
                  We reserve the right to modify these Terms at any time. Any changes will be effective immediately upon posting on our website. Your continued use of our services after any modifications indicates your acceptance of the updated Terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Services</h2>
                <p className="text-gray-700 mb-4">
                  Summit Land USA provides a platform for buying and selling land properties across the United States. Our services include:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li><strong>Property Listings:</strong> We display available land properties for sale with detailed information including location, acreage, price, and property features.</li>
                  <li><strong>Cash Offers:</strong> We provide cash offers to landowners looking to sell their property quickly and efficiently.</li>
                  <li><strong>Property Information:</strong> We offer tools and resources to help buyers and sellers make informed decisions about land transactions.</li>
                  <li><strong>Transaction Facilitation:</strong> We assist in facilitating the buying and selling process, including connecting buyers with sellers and coordinating closing procedures.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
                <p className="text-gray-700 mb-4">
                  To access certain features of our website, you may be required to create an account. When creating an account, you agree to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Provide accurate, current, and complete information during the registration process.</li>
                  <li>Maintain and promptly update your account information to keep it accurate and current.</li>
                  <li>Maintain the security and confidentiality of your login credentials.</li>
                  <li>Accept responsibility for all activities that occur under your account.</li>
                  <li>Notify us immediately of any unauthorized use of your account or any other breach of security.</li>
                </ul>
                <p className="text-gray-700">
                  We reserve the right to suspend or terminate your account at any time for any reason, including if we believe you have violated these Terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Property Listings and Information</h2>
                <p className="text-gray-700 mb-4">
                  While we strive to provide accurate and up-to-date information about properties listed on our website, we do not guarantee the accuracy, completeness, or reliability of any property information. Users are responsible for:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Conducting their own due diligence before making any purchase decisions.</li>
                  <li>Verifying all property information, including but not limited to boundaries, zoning, access, utilities, and legal descriptions.</li>
                  <li>Obtaining professional advice from attorneys, surveyors, and other qualified professionals as needed.</li>
                  <li>Understanding that property photos and descriptions may not reflect current conditions.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Purchasing and Selling Land</h2>
                <p className="text-gray-700 mb-4">
                  When buying or selling land through Summit Land USA:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li><strong>No Guarantee of Sale:</strong> We do not guarantee that any property will be sold or that any offer will be accepted.</li>
                  <li><strong>Pricing:</strong> All prices listed are subject to change without notice until a binding agreement is executed.</li>
                  <li><strong>Closing Costs:</strong> Buyers and sellers are responsible for their respective closing costs unless otherwise agreed in writing.</li>
                  <li><strong>Title and Ownership:</strong> All sales are subject to clear title. We recommend title insurance for all transactions.</li>
                  <li><strong>Financing:</strong> If applicable, purchases may be subject to financing approval.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Prohibited Activities</h2>
                <p className="text-gray-700 mb-4">
                  You agree not to engage in any of the following prohibited activities:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Using our website for any unlawful purpose or in violation of any applicable laws or regulations.</li>
                  <li>Providing false, misleading, or fraudulent information.</li>
                  <li>Interfering with or disrupting the operation of our website or servers.</li>
                  <li>Attempting to gain unauthorized access to any portion of our website or systems.</li>
                  <li>Using automated systems, bots, or scripts to access our website without our express written permission.</li>
                  <li>Copying, reproducing, or distributing any content from our website without authorization.</li>
                  <li>Harassing, threatening, or intimidating other users or our staff.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
                <p className="text-gray-700 mb-4">
                  All content on our website, including but not limited to text, graphics, logos, images, photographs, and software, is the property of Summit Land USA or its content suppliers and is protected by United States and international copyright laws.
                </p>
                <p className="text-gray-700">
                  You may not reproduce, distribute, modify, create derivative works of, publicly display, or otherwise use any content from our website without our prior written consent.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Disclaimer of Warranties</h2>
                <p className="text-gray-700 mb-4">
                  OUR WEBSITE AND SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Warranties of merchantability, fitness for a particular purpose, or non-infringement.</li>
                  <li>Warranties that our website will be uninterrupted, secure, or error-free.</li>
                  <li>Warranties regarding the accuracy, reliability, or completeness of any information provided.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
                <p className="text-gray-700 mb-4">
                  TO THE FULLEST EXTENT PERMITTED BY LAW, SUMMIT LAND USA AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Loss of profits, revenue, or data.</li>
                  <li>Property damage or personal injury.</li>
                  <li>Any damages arising from your use of or inability to use our website or services.</li>
                  <li>Any damages arising from unauthorized access to or alteration of your data.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Indemnification</h2>
                <p className="text-gray-700">
                  You agree to indemnify, defend, and hold harmless Summit Land USA and its officers, directors, employees, agents, and affiliates from and against any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or related to your use of our website, your violation of these Terms, or your violation of any rights of another party.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law and Dispute Resolution</h2>
                <p className="text-gray-700 mb-4">
                  These Terms shall be governed by and construed in accordance with the laws of the State of Texas, without regard to its conflict of law provisions.
                </p>
                <p className="text-gray-700">
                  Any dispute arising out of or relating to these Terms or your use of our website shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. The arbitration shall take place in Texas, and the decision of the arbitrator shall be final and binding.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Severability</h2>
                <p className="text-gray-700">
                  If any provision of these Terms is found to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect. The invalid or unenforceable provision shall be modified to the minimum extent necessary to make it valid and enforceable.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Entire Agreement</h2>
                <p className="text-gray-700">
                  These Terms, together with our Privacy Policy and any other legal notices published on our website, constitute the entire agreement between you and Summit Land USA regarding your use of our website and services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Contact Information</h2>
                <p className="text-gray-700 mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <ul className="list-none text-gray-700 space-y-2">
                  <li><strong>Email:</strong> legal@summitlandusa.com</li>
                  <li><strong>Phone:</strong> (555) 123-4567</li>
                  <li><strong>Address:</strong> Summit Land USA, 123 Main Street, Austin, TX 78701</li>
                </ul>
              </section>

              <div className="mt-12 pt-8 border-t border-gray-200">
                <p className="text-gray-600 text-sm">
                  By using our website, you acknowledge that you have read and understood these Terms of Service and agree to be bound by them. If you have any questions, please{' '}
                  <Link to="/contact" className="text-[#27AE60] hover:underline">
                    contact us
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
