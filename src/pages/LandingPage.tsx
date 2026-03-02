import { Link } from 'react-router-dom';
import { Code2, Video, BarChart3 } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-24 bg-gradient-to-b from-primary/5 to-white">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">
          Ace Your Placement
        </h1>
        <p className="text-xl text-gray-600 mb-8 text-center max-w-xl">
          Practice, assess, and prepare for your dream job
        </p>
        <Link
          to="/dashboard"
          className="px-8 py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg transition-colors inline-block"
        >
          Get Started
        </Link>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Code2 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Practice Problems
            </h3>
            <p className="text-gray-600 text-sm">
              Solve coding challenges across topics to sharpen your skills.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Video className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Mock Interviews
            </h3>
            <p className="text-gray-600 text-sm">
              Simulate real interview scenarios with timed mock sessions.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Track Progress
            </h3>
            <p className="text-gray-600 text-sm">
              Monitor your performance and identify areas to improve.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-500 text-sm border-t border-gray-200">
        <Link to="/" className="text-primary hover:underline mr-4">
          Home
        </Link>
        <span>© {new Date().getFullYear()} Placement Readiness Platform. All rights reserved.</span>
      </footer>
    </div>
  );
}
