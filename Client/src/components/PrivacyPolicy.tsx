const PrivacyPolicy = () => {
    return (
        <div className="max-w-4xl mx-auto p-6 md:p-8 lg:p-10 bg-white rounded-lg shadow-sm">
            <header className="mb-8 border-b pb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
                <p className="text-gray-600">Last updated: August 05, 2025</p>
            </header>

            <div className="prose prose-lg max-w-none">
                <section className="mb-10">
                    <p className="text-gray-700 mb-4">
                        This Privacy Policy describes how GyaanDeepika collects, uses, and discloses your information when you use our service. 
                        It also explains your privacy rights and how the law protects you.
                    </p>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <p className="text-blue-800">
                            <strong>Key Point:</strong> We only collect information necessary to provide and improve our services. 
                            We never sell your personal data to third parties.
                        </p>
                    </div>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Interpretation and Definitions</h2>
                    
                    <h3 className="text-xl font-medium text-gray-700 mb-3">Interpretation</h3>
                    <p className="text-gray-700 mb-4">
                        Capitalized terms have specific meanings defined under these conditions. These definitions apply whether 
                        the terms appear in singular or plural.
                    </p>
                    
                    <h3 className="text-xl font-medium text-gray-700 mb-3">Definitions</h3>
                    <div className="grid gap-4">
                        {[
                            {
                                term: "Account",
                                definition: "A unique account created for you to access our service."
                            },
                            {
                                term: "Personal Data",
                                definition: "Any information relating to an identified or identifiable individual."
                            },
                            {
                                term: "Service",
                                definition: "The GyaanDeepika website accessible from https://gyaan-deepika.vercel.app"
                            },
                            // Add other definitions here in the same format
                        ].map((item, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded-lg">
                                <h4 className="font-medium text-gray-800">{item.term}</h4>
                                <p className="text-gray-700">{item.definition}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Data Collection and Use</h2>
                    
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 mb-6">
                        <h3 className="text-lg font-medium text-amber-800 mb-2">What We Collect</h3>
                        <ul className="list-disc pl-5 text-amber-800 space-y-1">
                            <li>Basic contact information (email, name)</li>
                            <li>Technical data (IP address, browser type)</li>
                            <li>Usage data (pages visited, time spent)</li>
                        </ul>
                    </div>

                    <h3 className="text-xl font-medium text-gray-700 mb-3">How We Use Your Data</h3>
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                        {[
                            "To provide and maintain our service",
                            "To notify you about changes",
                            "To allow participation in features",
                            "For customer support",
                            "For analysis and improvements",
                            "To monitor usage patterns"
                        ].map((use, index) => (
                            <div key={index} className="flex items-start">
                                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-700">{use}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Your Rights</h2>
                    <div className="bg-purple-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-purple-800 mb-2">You Can:</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <svg className="h-5 w-5 text-purple-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-gray-700"><strong>Access</strong> your personal data we hold</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="h-5 w-5 text-purple-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-gray-700"><strong>Correct</strong> inaccurate information</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="h-5 w-5 text-purple-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-gray-700"><strong>Request deletion</strong> of your personal data</span>
                            </li>
                        </ul>
                    </div>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Contact Us</h2>
                    <p className="text-gray-700 mb-4">
                        If you have questions about this policy or your personal data:
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-3">
                            <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="text-gray-700">Email: jojewardattatrayofficial@gmail.com</span>
                        </div>
                        <div className="flex items-center">
                            <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                            <span className="text-gray-700">Website: <a href="https://gyaan-deepika.vercel.app/Contact" className="text-blue-600 hover:underline">Contact Page</a></span>
                        </div>
                    </div>
                </section>

                <div className="text-sm text-gray-500 mt-10 border-t pt-6">
                    <p>This document was last updated on August 05, 2025.</p>
                    <p>We may update this policy periodically. We'll notify you of significant changes.</p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;