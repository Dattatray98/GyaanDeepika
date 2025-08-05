const TermsAndConditions = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 lg:p-10 bg-white rounded-lg shadow-sm">
      <header className="mb-8 border-b pb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Terms and Conditions</h1>
        <p className="text-gray-600">Last updated: August 05, 2025</p>
      </header>

      <div className="prose prose-lg max-w-none">
        <section className="mb-10">
          <p className="text-gray-700 mb-4">
            Welcome to GyaanDeepika! These terms and conditions outline the rules and regulations for the use of our website and services.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
            <p className="text-blue-800">
              <strong>Important:</strong> By accessing this website, we assume you accept these terms and conditions in full. Do not continue to use GyaanDeepika if you do not accept all of the terms and conditions stated on this page.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Definitions</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li><strong>"Website"</strong> refers to GyaanDeepika, accessible at https://gyaan-deepika.vercel.app</li>
            <li><strong>"Service"</strong> refers to the educational resources and AI-driven learning tools provided</li>
            <li><strong>"User"</strong>, "You" and "Your" refers to you, the person using our service</li>
            <li><strong>"We", "Our", "Us"</strong> refers to GyaanDeepika</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Intellectual Property</h2>
          <p className="text-gray-700 mb-4">
            Unless otherwise stated, GyaanDeepika and/or its licensors own the intellectual property rights for all material on this website. All intellectual property rights are reserved.
          </p>
          <p className="text-gray-700">
            You may view and/or print pages for your own personal use subject to restrictions set in these terms and conditions.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. User Responsibilities</h2>
          <p className="text-gray-700 mb-4">As a user of our service, you agree not to:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Republish material from this website without permission</li>
            <li>Sell, rent or sub-license material from the website</li>
            <li>Reproduce, duplicate or copy material for commercial purposes</li>
            <li>Use the service in any way that is unlawful, illegal, fraudulent or harmful</li>
            <li>Use the service to copy, store, host, transmit, send or distribute any material containing viruses or malware</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Limitations of Liability</h2>
          <p className="text-gray-700 mb-4">
            GyaanDeepika will not be liable for any consequential, incidental, indirect or special damages arising out of or in any way related to your use of this website.
          </p>
          <p className="text-gray-700">
            We make no warranties or representations about the accuracy or completeness of the content and assume no liability for any errors or omissions.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. User Content</h2>
          <p className="text-gray-700 mb-4">
            In these terms, "Your Content" shall mean any content you submit to our website, including text, images, or other material.
          </p>
          <p className="text-gray-700">
            By submitting Your Content, you grant GyaanDeepika a non-exclusive, worldwide, irrevocable license to use, reproduce, adapt, publish and distribute it in any existing or future media.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Privacy</h2>
          <p className="text-gray-700 mb-4">
            Your use of our service is also governed by our Privacy Policy, which explains how we collect, use and protect your personal information.
          </p>
          <p className="text-gray-700">
            Please review our <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a> which is incorporated into these Terms by reference.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Changes to Terms</h2>
          <p className="text-gray-700 mb-4">
            We reserve the right to modify these terms at any time. We will notify users of any changes by posting the new Terms on this page.
          </p>
          <p className="text-gray-700">
            Your continued use of the Service after any changes constitutes your acceptance of the new Terms.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Governing Law</h2>
          <p className="text-gray-700">
            These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Contact Information</h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about these Terms, please contact us:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>By email: jojewardattatrayofficial@gmail.com</li>
            <li>Through our website: <a href="/contact" className="text-blue-600 hover:underline">Contact Page</a></li>
          </ul>
        </section>

        <div className="text-sm text-gray-500 mt-10 border-t pt-6">
          <p>These terms and conditions were last updated on August 05, 2025.</p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;