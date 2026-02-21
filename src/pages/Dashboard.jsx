import React from 'react';

const Dashboard = () => {
  const metrics = [
    { title: "Total Users", value: "84,392", trend: "+12.5%", positive: true },
    { title: "Revenue", value: "$42,910", trend: "+4.2%", positive: true },
    { title: "Bounce Rate", value: "42.3%", trend: "-2.1%", positive: false },
    { title: "Active Sessions", value: "1,204", trend: "+18.1%", positive: true },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 font-bold text-xl text-indigo-600">
          Nexus UI
        </div>
        <nav className="flex-1 p-4 space-y-2 text-sm font-medium">
          <a href="#" className="flex items-center gap-3 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-md">
            <span>📊</span> Overview
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
            <span>👥</span> Audience
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
            <span>⚙️</span> Settings
          </a>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-2xl font-semibold text-gray-800">Overview</h1>
          <div className="flex items-center gap-4">
            <span className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold">JD</span>
          </div>
        </header>

        <div className="p-8">
          {/* KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
                <span className="text-sm text-gray-500 font-medium">{metric.title}</span>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">{metric.value}</span>
                  <span className={`text-sm font-semibold ${metric.positive ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Complex Table Section */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Recent Transactions</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-medium">Transaction ID</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                  {[1, 2, 3, 4].map((item) => (
                     <tr key={item} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">#TRX-00{item}849</td>
                      <td className="px-6 py-4">Oct {item + 10}, 2024</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                          Completed
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-medium">$1,2{item}4.00</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;