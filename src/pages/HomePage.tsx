import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Users, Shield } from 'lucide-react';

export const HomePage = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
          Share Skills, Grow Together
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Join our community of skilled individuals and exchange your expertise with others.
          Learn, teach, and grow together.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/skills"
            className="inline-flex items-center px-6 py-3 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            Browse Skills
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
            <Sparkles className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">AI-Powered Matching</h3>
          <p className="text-gray-600">
            Our smart algorithm finds the perfect skill matches based on your interests and expertise.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
            <Users className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Verified Community</h3>
          <p className="text-gray-600">
            Connect with trusted members in our growing community of skilled professionals.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
          <p className="text-gray-600">
            Exchange skills with confidence on our secure and trusted platform.
          </p>
        </div>
      </section>
    </div>
  );
};