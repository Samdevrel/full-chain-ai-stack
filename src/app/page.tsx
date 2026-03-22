'use client';

import { useState, useEffect } from 'react';

type AgentState = 'idle' | 'perceiving' | 'reasoning' | 'executing' | 'communicating' | 'complete';

interface AgentAction {
  id: string;
  type: 'perceive' | 'reason' | 'execute' | 'communicate';
  description: string;
  timestamp: Date;
  status: 'pending' | 'running' | 'done';
}

interface ChainData {
  name: string;
  tokens: Array<{ name: string; price: number; change24h: number }>;
  transactions: number;
  avgGas: number;
}

const agents = [
  { name: 'Sam', role: 'DevRel Agent', icon: '🔮', color: 'purple' },
  { name: 'Rex', role: 'Trading Agent', icon: '🤖', color: 'blue' },
  { name: 'Victor', role: 'Job Market Agent', icon: '🎯', color: 'green' },
  { name: 'Dante', role: 'Web Monitor', icon: '🌍', color: 'orange' },
];

const chains: ChainData[] = [
  { name: 'Ethereum', tokens: [
    { name: 'ETH', price: 2450, change24h: 2.5 },
    { name: 'USDC', price: 1.0, change24h: 0.1 },
    { name: 'WBTC', price: 42000, change24h: -1.2 },
  ], transactions: 1200000, avgGas: 25 },
  { name: 'Arbitrum', tokens: [
    { name: 'ETH', price: 2450, change24h: 2.3 },
    { name: 'ARB', price: 0.85, change24h: 5.1 },
  ], transactions: 4500000, avgGas: 0.1 },
  { name: 'Base', tokens: [
    { name: 'ETH', price: 2450, change24h: 2.4 },
    { name: 'USDC', price: 1.0, change24h: 0.1 },
  ], transactions: 6200000, avgGas: 0.08 },
  { name: 'Solana', tokens: [
    { name: 'SOL', price: 142, change24h: 8.7 },
    { name: 'RAY', price: 3.2, change24h: -2.3 },
  ], transactions: 3800000, avgGas: 0.0001 },
];

const tasks = [
  {
    name: 'DeFi Portfolio Analysis',
    description: 'Analyze portfolio across 4 chains, find arbitrage opportunities',
    agents: ['Rex', 'Dante'],
    estimatedTime: '2 min',
  },
  {
    name: 'News Aggregation',
    description: 'Monitor 10+ sources for ERC-7710 updates, draft responses',
    agents: ['Sam', 'Dante'],
    estimatedTime: '5 min',
  },
  {
    name: 'Deal Flow Monitoring',
    description: 'Track 50+ African startups, update CRM',
    agents: ['Victor', 'Rex'],
    estimatedTime: '3 min',
  },
  {
    name: 'Full-Chain Alert',
    description: 'Cross-chain anomaly detection, trigger agent coordination',
    agents: ['Dante', 'Rex', 'Victor'],
    estimatedTime: '1 min',
  },
];

export default function Home() {
  const [currentTask, setCurrentTask] = useState(0);
  const [agentActions, setAgentActions] = useState<AgentAction[]>([]);
  const [agentStatuses, setAgentStatuses] = useState<Record<string, AgentState>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [alerts, setAlerts] = useState<Array<{ time: Date; message: string; agent: string }>>([]);

  const startTask = async () => {
    setIsRunning(true);
    setCurrentTask(0);
    setAgentActions([]);
    setAlerts([]);

    const current = tasks[currentTask];

    // Start each agent in sequence
    for (const agentName of current.agents) {
      await runAgent(agentName);
    }

    setIsRunning(false);
  };

  const runAgent = async (agentName: string) => {
    setAgentStatuses(prev => ({ ...prev, [agentName]: 'perceiving' }));
    
    // Add perceive action
    const perceiveAction: AgentAction = {
      id: `action-${Date.now()}-${Math.random()}`,
      type: 'perceive',
      description: `Scanning ${agentName} chains for relevant data`,
      timestamp: new Date(),
      status: 'pending',
    };
    setAgentActions(prev => [...prev, perceiveAction]);

    await simulateAction(agentName, 'perceiving', 'Action...');

    setAgentStatuses(prev => ({ ...prev, [agentName]: 'reasoning' }));

    // Add reason action
    const reasonAction: AgentAction = {
      id: `action-${Date.now()}-${Math.random()}`,
      type: 'reason',
      description: `Analyzing data patterns and formulating strategy`,
      timestamp: new Date(),
      status: 'pending',
    };
    setAgentActions(prev => [...prev, reasonAction]);

    await simulateAction(agentName, 'reasoning', 'Thinking...');

    setAgentStatuses(prev => ({ ...prev, [agentName]: 'executing' }));

    // Add execute action
    const executeAction: AgentAction = {
      id: `action-${Date.now()}-${Math.random()}`,
      type: 'execute',
      description: `${agentName} executing on-chain/off-chain operations`,
      timestamp: new Date(),
      status: 'pending',
    };
    setAgentActions(prev => [...prev, executeAction]);

    await simulateAction(agentName, 'executing', 'Executing...');

    // If agent has communication tasks
    if (agentName === 'Sam' || agentName === 'Dante') {
      setAgentStatuses(prev => ({ ...prev, [agentName]: 'communicating' }));

      const communicateAction: AgentAction = {
        id: `action-${Date.now()}-${Math.random()}`,
        type: 'communicate',
        description: `Collaborating with ${tasks[currentTask].agents.filter(a => a !== agentName).join(', ')} agents`,
        timestamp: new Date(),
        status: 'pending',
      };
      setAgentActions(prev => [...prev, communicateAction]);

      await simulateAction(agentName, 'communicating', 'Syncing...');

      // Add alert
      setAlerts(prev => [...prev, {
        time: new Date(),
        message: `${agentName} completed task. Collaborating with peers.`,
        agent: agentName,
      }]);
    }

    setAgentStatuses(prev => ({ ...prev, [agentName]: 'idle' }));
  };

  const simulateAction = async (agent: string, state: AgentState, step: string) => {
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000));
    setAgentActions(prev => prev.map(a => a.id.includes(step) ? { ...a, status: 'done' } : a));
    setAgentStatuses(prev => ({ ...prev, [agent]: state }));
  };

  const nextTask = () => {
    setCurrentTask(prev => (prev + 1) % tasks.length);
    setAgentActions([]);
    setAlerts([]);
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <header className="border-b-4 border-purple-400 bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-black">Full-Chain AI Stack</h1>
          <p className="text-gray-400 mt-2">Perceive → Reason → Execute → Communicate</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Current Task */}
        <section className="bg-gray-900 border-4 border-purple-400 p-6">
          <h2 className="text-sm font-bold text-gray-400 mb-4">CURRENT TASK</h2>
          <div className="p-4 bg-purple-900/30 border-2 border-purple-500">
            <h3 className="text-2xl font-bold mb-2">{tasks[currentTask].name}</h3>
            <p className="text-gray-300 mb-4">{tasks[currentTask].description}</p>
            <div className="flex gap-4 text-sm">
              <span className="text-purple-400 font-bold">👥 Agents: {tasks[currentTask].agents.join(', ')}</span>
              <span className="text-gray-400">⏱️ Time: {tasks[currentTask].estimatedTime}</span>
            </div>
          </div>
        </section>

        {/* Agents Grid */}
        <section className="grid md:grid-cols-2 gap-6">
          {agents.map((agent) => (
            <div key={agent.name} className="bg-gray-900 border-4 border-gray-700 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">{agent.icon}</div>
                <div>
                  <h3 className="text-xl font-bold">{agent.name}</h3>
                  <p className="text-sm text-gray-400">{agent.role}</p>
                </div>
                <div className="ml-auto">
                  <div className={`px-3 py-1 text-xs font-bold rounded ${
                    agentStatuses[agent.name] === 'idle' ? 'bg-gray-700 text-gray-400' :
                    agentStatuses[agent.name] === 'complete' ? 'bg-green-600 text-white' :
                    `bg-${agent.color}-600 text-white animate-pulse`
                  }`}>
                    {agentStatuses[agent.name]?.toUpperCase() || 'IDLE'}
                  </div>
                </div>
              </div>

              {/* Live Chain Data */}
              <div className="space-y-2 mb-4">
                {chains.slice(0, 2).map((chain) => (
                  <div key={chain.name} className="p-3 bg-gray-800 border border-gray-600 rounded">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold" style={{ color: agentStatuses[agent.name] !== 'idle' ? '#F59E0B' : undefined }}>
                        {chain.name}
                      </span>
                      {agentStatuses[agent.name] !== 'idle' && (
                        <span className="text-xs text-green-400">● Live</span>
                      )}
                    </div>
                    <div className="space-y-1 text-sm">
                      {chain.tokens.slice(0, 2).map((token) => (
                        <div key={token.name} className="flex justify-between">
                          <span className="text-gray-400">{token.name}</span>
                          <span className={token.change24h >= 0 ? 'text-green-400' : 'text-red-400'}>
                            ${token.price} ({token.change24h >= 0 ? '+' : ''}{token.change24h}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Agent Capabilities */}
              <div className="flex gap-2 flex-wrap">
                {agent.role === 'DevRel Agent' && (
                  <>
                    <span className="px-2 py-1 bg-purple-900 text-purple-300 text-xs rounded">X Posts</span>
                    <span className="px-2 py-1 bg-purple-900 text-purple-300 text-xs rounded">Blogs</span>
                    <span className="px-2 py-1 bg-purple-900 text-purple-300 text-xs rounded">Trends</span>
                  </>
                )}
                {agent.role === 'Trading Agent' && (
                  <>
                    <span className="px-2 py-1 bg-blue-900 text-blue-300 text-xs rounded">DEX</span>
                    <span className="px-2 py-1 bg-blue-900 text-blue-300 text-xs rounded">Arbitrage</span>
                    <span className="px-2 py-1 bg-blue-900 text-blue-300 text-xs rounded">Gas Ops</span>
                  </>
                )}
                {agent.role === 'Job Market Agent' && (
                  <>
                    <span className="px-2 py-1 bg-green-900 text-green-300 text-xs rounded">LinkedIn</span>
                    <span className="px-2 py-1 bg-green-900 text-green-300 text-xs rounded">Niche Scraper</span>
                    <span className="px-2 py-1 bg-green-900 text-green-300 text-xs rounded">CRM</span>
                  </>
                )}
                {agent.role === 'Web Monitor' && (
                  <>
                    <span className="px-2 py-1 bg-orange-900 text-orange-300 text-xs rounded">RSS</span>
                    <span className="px-2 py-1 bg-orange-900 text-orange-300 text-xs rounded">Alerts</span>
                    <span className="px-2 py-1 bg-orange-900 text-orange-300 text-xs rounded">Delegation</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </section>

        {/* Action Timeline */}
        {agentActions.length > 0 && (
          <section className="bg-gray-900 border-4 border-gray-700 p-6">
            <h2 className="text-sm font-bold text-gray-400 mb-4">ACTION TIMELINE</h2>
            <div className="space-y-3">
              {agentActions.map((action) => (
                <div key={action.id} className="flex items-center gap-4 p-3 bg-gray-800 border-l-4 border-purple-400">
                  <div className={`w-3 h-3 rounded-full ${
                    action.status === 'done' ? 'bg-purple-500' : 'bg-gray-600 animate-pulse'
                  }`} />
                  <div className="flex-1">
                    <div className="font-bold text-sm">
                      {action.type === 'perceive' && '👁️ Perceive'}
                      {action.type === 'reason' && '🧠 Reason'}
                      {action.type === 'execute' && '⚡ Execute'}
                      {action.type === 'communicate' && '💬 Communicate'}
                    </div>
                    <div className="text-sm text-gray-400">{action.description}</div>
                  </div>
                  <div className="text-xs text-gray-500">{action.timestamp.toLocaleTimeString()}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Live Alerts */}
        {alerts.length > 0 && (
          <section className="bg-gray-900 border-4 border-yellow-400 p-6">
            <h2 className="text-sm font-bold text-yellow-400 mb-4">LIVE ALERTS</h2>
            <div className="space-y-2">
              {alerts.map((alert, i) => (
                <div key={i} className="p-3 bg-yellow-900/30 border border-yellow-500 rounded">
                  <div className="flex justify-between items-start">
                    <div className="font-bold text-yellow-400">{alert.agent}</div>
                    <div className="text-xs text-gray-500">{alert.time.toLocaleTimeString()}</div>
                  </div>
                  <div className="text-sm mt-1">{alert.message}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Control Panel */}
        <section className="bg-gray-900 border-4 border-gray-700 p-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              {tasks.map((task, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentTask(i);
                    setAgentActions([]);
                    setAlerts([]);
                  }}
                  className={`px-4 py-2 font-bold border-4 transition-all ${
                    currentTask === i
                      ? 'bg-purple-400 text-black border-purple-400'
                      : 'bg-gray-800 text-white border-gray-600 hover:border-gray-500'
                  }`}
                >
                  {task.name}
                </button>
              ))}
            </div>
            <button
              onClick={isRunning ? undefined : startTask}
              disabled={isRunning}
              className="px-8 py-4 bg-purple-500 text-white font-bold border-4 border-purple-400 hover:bg-purple-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? 'Running...' : '▶️ Start Task'}
            </button>
          </div>
        </section>

        {/* Next Task Button */}
        {agentActions.length > 0 && agentActions.every(a => a.status === 'done') && (
          <button
            onClick={nextTask}
            className="w-full py-4 bg-green-500 text-white font-bold border-4 border-green-400 hover:bg-green-400"
          >
            Next Task →
          </button>
        )}

        {/* How It Works */}
        <section className="bg-gray-900 border-4 border-purple-400 p-6">
          <h2 className="text-xl font-black text-purple-400 mb-4">Full-Chain AI Agent Architecture</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-800 border-2 border-gray-600 text-center">
              <div className="text-3xl mb-2">👁️</div>
              <div className="font-bold text-blue-400">1. Perceive</div>
              <div className="text-xs text-gray-400 mt-2">
                Scan on-chain (blocks, transactions, events)<br />
                Scan off-chain (RSS, social, web)
              </div>
            </div>
            <div className="p-4 bg-gray-800 border-2 border-gray-600 text-center">
              <div className="text-3xl mb-2">🧠</div>
              <div className="font-bold text-purple-400">2. Reason</div>
              <div className="text-xs text-gray-400 mt-2">
                Analyze data patterns<br />
                Formulate strategy<br />
                Plan next actions
              </div>
            </div>
            <div className="p-4 bg-gray-800 border-2 border-gray-600 text-center">
              <div className="text-3xl mb-2">⚡</div>
              <div className="font-bold text-green-400">3. Execute</div>
              <div className="text-xs text-gray-400 mt-2">
                Sign transactions on-chain<br />
                Update off-chain data<br />
                Call APIs
              </div>
            </div>
            <div className="p-4 bg-gray-800 border-2 border-gray-600 text-center">
              <div className="text-3xl mb-2">💬</div>
              <div className="font-bold text-orange-400">4. Communicate</div>
              <div className="text-xs text-gray-400 mt-2">
                Sync with other agents<br />
                Share findings<br />
                Coordinate complex tasks
              </div>
            </div>
          </div>
        </section>

        {/* Agent Stack */}
        <section className="bg-gray-900 border-4 border-gray-700 p-6">
          <h2 className="text-sm font-bold text-gray-400 mb-4">AGENT STACK COMPONENTS</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-800 border-2 border-purple-500">
              <h3 className="font-bold text-purple-400 mb-2">Agent Orchestrator</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Task distribution</li>
                <li>• Coordination management</li>
                <li>• Error recovery</li>
                <li>• Priority scheduling</li>
              </ul>
            </div>
            <div className="p-4 bg-gray-800 border-2 border-blue-500">
              <h3 className="font-bold text-blue-400 mb-2">Full-Chain Execution</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Multi-chain wallets</li>
                <li>• Smart contract interaction</li>
                <li>• Gas optimization</li>
                <li>• Transaction bundling</li>
              </ul>
            </div>
            <div className="p-4 bg-gray-800 border-2 border-green-500">
              <h3 className="font-bold text-green-400 mb-2">Agent Communication</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• WebSocket channels</li>
                <li>• Event streaming</li>
                <li>• Message queues</li>
                <li>• State synchronization</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Context */}
        <section className="bg-gray-900 border-4 border-gray-700 p-6">
          <h2 className="text-sm font-bold text-gray-400 mb-4">WHY FULL-CHAIN AGENTS MATTER</h2>
          <p className="text-gray-300 mb-4">
            The agent ecosystem is moving from siloed tools to coordinated systems. 
            Agents that can <span className="text-purple-400">perceive, reason, execute, and communicate</span> 
            across entire chains are building the new automated Web3 infrastructure.
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-bold text-blue-400 mb-2">Use Cases</h3>
              <ul className="text-gray-400 space-y-1">
                <li>• Cross-chain arbitrage coordination</li>
                <li>• Real-time risk monitoring</li>
                <li>• Deal flow aggregation</li>
                <li>• Content creation at scale</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-green-400 mb-2">Key Innovations</h3>
              <ul className="text-gray-400 space-y-1">
                <li>• Modular agent skills (like Binance's stack)</li>
                <li>• Agent-to-agent communication protocols</li>
                <li>• Shared memory and state</li>
                <li>• Execution layer abstraction</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm py-8 border-t border-gray-800">
          <p>
            Built by <a href="https://x.com/samdevrel" className="text-purple-400 hover:underline">@samdevrel</a>
            {' • '}
            Inspired by Full-Chain AI Stack (Tearline, 19M transactions)
          </p>
        </footer>
      </div>
    </main>
  );
}
