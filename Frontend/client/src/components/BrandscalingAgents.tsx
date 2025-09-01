import React, { useState } from "react";

const agents = [
  { id: "startup", label: "Startup", color: "#841477" },      // Deep Plum
  { id: "scaleup", label: "ScaleUp", color: "#F6782F" },      // Scale Orange
  { id: "architect", label: "Architect", color: "#42047D" },  // Architect Indigo
  { id: "alchemist", label: "Alchemist", color: "#EC4049" },  // Founder Red
];

const AgentChatPlaceholder = ({ active }: { active: string }) => (
  <div className="border rounded-lg bg-white p-5 shadow-md text-sm mt-6">
    <div className="text-gray-700 mb-2">
      <span className="capitalize font-semibold">{active}</span> Agent is standing by.
    </div>
    <div className="border rounded p-4 bg-gray-50 text-gray-500 italic">
      AI assistant coming soon… This will be a real-time Brandscaling GPT.
    </div>
  </div>
);

const BrandscalingAgents = () => {
  const [activeAgent, setActiveAgent] = useState<string | null>(null);

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold text-[#42047D] mb-4">
        Meet Your Brandscaling Agents
      </h2>
      <p className="text-lg text-gray-700 mb-8">
        Choose your zone. We'll bring the clarity, direction, and next best move—instantly.
      </p>

      <div className="flex flex-wrap gap-4 mb-6">
        {agents.map((agent) => (
          <button
            key={agent.id}
            onClick={() => setActiveAgent(agent.id)}
            className={`px-6 py-2 rounded-full text-white font-semibold shadow-sm transition ${
              activeAgent === agent.id ? "scale-105" : "opacity-90 hover:opacity-100"
            }`}
            style={{ backgroundColor: agent.color }}
          >
            {agent.label}
          </button>
        ))}
      </div>

      {activeAgent && <AgentChatPlaceholder active={activeAgent} />}
    </div>
  );
};

export default BrandscalingAgents;