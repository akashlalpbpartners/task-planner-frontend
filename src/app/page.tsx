import React from 'react';

// This is a basic representation of a Next.js App Router page component.
// In a real application, this file would contain the main layout and content
// for your task list dashboard.
export default function HomePage() {
  const handleGoogleRedirect = () => {
    window.location.href = 'https://www.google.com';
  };

  return (
    <main className="relative min-h-screen bg-gray-100 p-8">
      {/* This div represents the main content area of your dashboard. */}
      {/* The button is positioned absolutely within this main element. */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Task List Dashboard</h1>

      {/* Button for Google redirect - positioned top right */}
      <div className="absolute top-4 right-4">
        <button
          onClick={handleGoogleRedirect}
          className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg
                     shadow-md hover:bg-red-700 focus:outline-none focus:ring-2
                     focus:ring-red-500 focus:ring-opacity-75 transition duration-300 ease-in-out"
        >
          google
        </button>
      </div>

      {/* Placeholder for task list content */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Tasks</h2>
        <p className="text-gray-600">
          This is where your task list would be displayed.
          Click the 'google' button in the top right to redirect.
        </p>
        {/* Further task list components would go here */}
      </section>
    </main>
  );
}
