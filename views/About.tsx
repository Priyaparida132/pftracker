
import React from 'react';
import { Code2, Database, Layout, PieChart, ShieldCheck, Zap } from 'lucide-react';

const About = () => {
  const techs = [
    {
      icon: <Code2 className="text-blue-500" />,
      name: "React (JavaScript)",
      desc: "Used for building a fast, component-based user interface. This project uses React Hooks (useState, useMemo) for state management."
    },
    {
      icon: <Layout className="text-sky-500" />,
      name: "Tailwind CSS",
      desc: "Modern CSS utility framework for professional styling without complex CSS files."
    },
    {
      icon: <PieChart className="text-indigo-500" />,
      name: "Recharts",
      desc: "The library responsible for generating beautiful bar and pie charts."
    },
    {
      icon: <Database className="text-amber-500" />,
      name: "LocalStorage",
      desc: "Browser-based database that keeps your records saved even after a page refresh."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">About This Project</h2>
        <p className="text-gray-500 mt-2">Developed for Job Selection Rounds using pure JavaScript & React.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {techs.map((t, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-gray-50 rounded-2xl">{t.icon}</div>
              <h3 className="font-bold text-gray-800">{t.name}</h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">{t.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-indigo-600 rounded-[2rem] p-8 text-white text-center">
        <h3 className="text-xl font-bold mb-2">Technical Implementation:</h3>
        <p className="text-indigo-100 text-sm opacity-80">This project follows a modular structure where UI, Logic, and Storage are separated for high maintainability.</p>
      </div>
    </div>
  );
};

export default About;
