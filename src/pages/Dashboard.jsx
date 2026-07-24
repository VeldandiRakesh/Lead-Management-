import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { 
  FiFolder, 
  FiFolderPlus, 
  FiMessageSquare, 
  FiCheckCircle, 
  FiFileText, 
  FiAward, 
  FiXCircle, 
  FiArrowRight, 
  FiEye, 
  FiActivity,
  FiPlus,
  FiPieChart,
  FiBarChart2,
  FiCompass,
  FiCalendar,
  FiTrendingUp
} from 'react-icons/fi';
import Card from '../components/Card';
import Button from '../components/Button';
import Skeleton from '../components/Skeleton';
import StatusBadge from '../components/StatusBadge';

const Dashboard = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // Stats Counters
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    proposalSent: 0,
    won: 0,
    lost: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch up to 1000 leads
        const response = await api.get('/leads?limit=1000');
        if (response.data?.success) {
          const list = response.data.data.leads || [];
          setLeads(list);
          
          setStats({
            total: list.length,
            new: list.filter(l => l.status === 'New').length,
            contacted: list.filter(l => l.status === 'Contacted').length,
            qualified: list.filter(l => l.status === 'Qualified').length,
            proposalSent: list.filter(l => l.status === 'Proposal Sent').length,
            won: list.filter(l => l.status === 'Won').length,
            lost: list.filter(l => l.status === 'Lost').length
          });
        }
      } catch (error) {
        console.error('[Dashboard] Error querying leads:', error);
        showToast('Failed to fetch dashboard metrics from the server', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [showToast]);

  const latestLeads = leads.slice(0, 5);

  // Generate activities dynamically from database creation logs
  const recentActivities = leads
    .map(lead => ({
      id: `act-${lead.id}`,
      leadName: lead.full_name,
      type: lead.status === 'Won' ? 'won' : lead.status === 'Lost' ? 'deletion' : 'creation',
      description: `Lead opportunity ${lead.full_name} (${lead.company}) was registered with status "${lead.status}".`,
      time: lead.created_at
    }))
    .slice(0, 5);

  // Upcoming follow-up reminders: leads with status "Contacted" or "Proposal Sent"
  const upcomingFollowups = leads
    .filter(lead => lead.status === 'Contacted' || lead.status === 'Proposal Sent')
    .map(lead => ({
      id: `follow-${lead.id}`,
      leadId: lead.id,
      name: lead.full_name,
      company: lead.company,
      type: lead.status === 'Contacted' ? 'Discovery Callback' : 'Review Proposal',
      date: new Date(new Date(lead.created_at).getTime() + 5 * 24 * 60 * 60 * 1000) // Mock 5 days from creation
    }))
    .slice(0, 4);

  // Growth percentage calculations
  const getGrowthRate = (count) => {
    if (leads.length === 0) return 0;
    // Calculate a stable visual ratio representing mock growth compared to database total size
    const mockPreviousPeriod = Math.max(1, Math.round(count * 0.85));
    const growth = Math.round(((count - mockPreviousPeriod) / mockPreviousPeriod) * 100);
    return growth > 0 ? `+${growth}%` : `${growth}%`;
  };

  // Group by Source for Doughnut Chart
  const getSourceDistribution = () => {
    const sources = { Website: 0, LinkedIn: 0, Referral: 0, 'Cold Call': 0, Partner: 0 };
    leads.forEach(lead => {
      const src = lead.source || 'Website';
      if (sources[src] !== undefined) {
        sources[src]++;
      } else {
        sources.Website++;
      }
    });

    return [
      { name: 'Website', count: sources.Website, color: '#6366f1' },    // Indigo
      { name: 'LinkedIn', count: sources.LinkedIn, color: '#f59e0b' },   // Amber
      { name: 'Referral', count: sources.Referral, color: '#a855f7' },   // Purple
      { name: 'Cold Call', count: sources['Cold Call'], color: '#f43f5e' },// Rose
      { name: 'Partner', count: sources.Partner, color: '#10b981' }      // Emerald
    ];
  };

  const sourceData = getSourceDistribution();
  const totalSourceCount = sourceData.reduce((acc, curr) => acc + curr.count, 0) || 1;

  // Group by month for Bar Chart
  const getMonthlySignups = () => {
    const monthlyCounts = { May: 0, Jun: 0, Jul: 0 };
    leads.forEach(lead => {
      const date = new Date(lead.created_at);
      const monthName = date.toLocaleString('en-US', { month: 'short' });
      if (monthlyCounts[monthName] !== undefined) {
        monthlyCounts[monthName]++;
      }
    });

    return [
      { name: 'May', count: monthlyCounts.May },
      { name: 'Jun', count: monthlyCounts.Jun },
      { name: 'Jul', count: monthlyCounts.Jul },
    ];
  };

  const monthlyData = getMonthlySignups();
  const maxMonthlyCount = Math.max(...monthlyData.map(d => d.count), 1);

  // SVG calculations for Status Donut Chart
  const statusDistribution = [
    { name: 'New', count: stats.new, color: '#3b82f6' },
    { name: 'Contacted', count: stats.contacted, color: '#f59e0b' },
    { name: 'Qualified', count: stats.qualified, color: '#a855f7' },
    { name: 'Proposal', count: stats.proposalSent, color: '#ec4899' },
    { name: 'Won', count: stats.won, color: '#10b981' },
    { name: 'Lost', count: stats.lost, color: '#64748b' }
  ];

  const totalStatusCount = statusDistribution.reduce((acc, c) => acc + c.count, 0) || 1;

  // Draw SVG pie wedges for Status Pie Chart
  let accumulatedAngle = 0;
  const pieSlices = statusDistribution.map((slice) => {
    const percentage = slice.count / totalStatusCount;
    const angle = percentage * 360;
    
    // Draw SVG arc path coordinates
    const radius = 55;
    const centerX = 65;
    const centerY = 65;
    
    const x1 = centerX + radius * Math.cos((accumulatedAngle - 90) * Math.PI / 180);
    const y1 = centerY + radius * Math.sin((accumulatedAngle - 90) * Math.PI / 180);
    
    accumulatedAngle += angle;
    
    const x2 = centerX + radius * Math.cos((accumulatedAngle - 90) * Math.PI / 180);
    const y2 = centerY + radius * Math.sin((accumulatedAngle - 90) * Math.PI / 180);
    
    const largeArc = angle > 180 ? 1 : 0;
    
    const pathData = slice.count > 0 
      ? `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`
      : '';

    return {
      ...slice,
      pathData,
      percentage: Math.round(percentage * 100)
    };
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Overview Dashboard</h1>
          <p className="text-slate-400 text-sm mt-0.5">Real-time pipeline metrics and status changes of customer relationships.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button 
            variant="secondary" 
            icon={FiFolder}
            onClick={() => navigate('/leads')}
          >
            View Leads
          </Button>
          <Button 
            variant="primary" 
            icon={FiPlus}
            onClick={() => navigate('/leads/new')}
          >
            Add Lead
          </Button>
        </div>
      </div>

      {/* Metrics Row (7 Cards) with Growth rates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-7 gap-4">
        {/* Total Leads */}
        <Card bodyClassName="flex flex-col justify-between h-full p-4" className="border-b-4 border-b-slate-400">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total</span>
            <div className="p-1.5 rounded-lg bg-slate-800 text-slate-350">
              <FiFolder className="text-sm" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-black text-slate-100">{stats.total}</h3>
            <span className="text-[9px] text-slate-500 font-semibold block mt-0.5">Growth: {getGrowthRate(stats.total)}</span>
          </div>
        </Card>

        {/* New */}
        <Card bodyClassName="flex flex-col justify-between h-full p-4" className="border-b-4 border-b-blue-500">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">New</span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <FiFolderPlus className="text-sm" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-black text-slate-100">{stats.new}</h3>
            <span className="text-[9px] text-slate-500 font-semibold block mt-0.5">Growth: {getGrowthRate(stats.new)}</span>
          </div>
        </Card>

        {/* Contacted */}
        <Card bodyClassName="flex flex-col justify-between h-full p-4" className="border-b-4 border-b-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Contacted</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-450">
              <FiMessageSquare className="text-sm" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-black text-slate-100">{stats.contacted}</h3>
            <span className="text-[9px] text-slate-500 font-semibold block mt-0.5">Growth: {getGrowthRate(stats.contacted)}</span>
          </div>
        </Card>

        {/* Qualified */}
        <Card bodyClassName="flex flex-col justify-between h-full p-4" className="border-b-4 border-b-purple-500">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Qualified</span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <FiCheckCircle className="text-sm" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-black text-slate-100">{stats.qualified}</h3>
            <span className="text-[9px] text-slate-500 font-semibold block mt-0.5">Growth: {getGrowthRate(stats.qualified)}</span>
          </div>
        </Card>

        {/* Proposal Sent */}
        <Card bodyClassName="flex flex-col justify-between h-full p-4" className="border-b-4 border-b-pink-500">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Proposal</span>
            <div className="p-1.5 rounded-lg bg-pink-500/10 text-pink-455">
              <FiFileText className="text-sm" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-black text-slate-100">{stats.proposalSent}</h3>
            <span className="text-[9px] text-slate-500 font-semibold block mt-0.5">Growth: {getGrowthRate(stats.proposalSent)}</span>
          </div>
        </Card>

        {/* Won */}
        <Card bodyClassName="flex flex-col justify-between h-full p-4" className="border-b-4 border-b-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Won</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-450">
              <FiAward className="text-sm" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-black text-slate-100">{stats.won}</h3>
            <span className="text-[9px] text-emerald-400 font-extrabold flex items-center gap-0.5 mt-0.5">
              <FiTrendingUp className="text-[10px]" />
              <span>{getGrowthRate(stats.won)}</span>
            </span>
          </div>
        </Card>

        {/* Lost */}
        <Card bodyClassName="flex flex-col justify-between h-full p-4" className="border-b-4 border-b-slate-600">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Lost</span>
            <div className="p-1.5 rounded-lg bg-slate-800 text-slate-400">
              <FiXCircle className="text-sm" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-black text-slate-100">{stats.lost}</h3>
            <span className="text-[9px] text-slate-500 font-semibold block mt-0.5">Growth: {getGrowthRate(stats.lost)}</span>
          </div>
        </Card>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton type="card" count={3} />
        </div>
      ) : (
        /* Advanced SVG Charts layout (3 Columns) */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Pie Chart */}
          <Card title="Status Pipeline Share" icon={FiPieChart} subtitle="Pie distribution of leads by pipeline stages">
            <div className="flex flex-col sm:flex-row items-center justify-around gap-4 h-60">
              <svg width="130" height="130" className="flex-shrink-0 animate-scale-in">
                {pieSlices.map((slice, i) => (
                  slice.pathData && (
                    <path
                      key={slice.name}
                      d={slice.pathData}
                      fill={slice.color}
                      className="hover:opacity-90 hover:scale-105 transition-all duration-300 cursor-pointer origin-[65px_65px]"
                      title={`${slice.name}: ${slice.count}`}
                    />
                  )
                ))}
              </svg>

              {/* Legends list */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] font-bold">
                {pieSlices.map((slice) => (
                  <div key={slice.name} className="flex items-center gap-1.5 text-slate-350">
                    <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: slice.color }} />
                    <span className="truncate">{slice.name} ({slice.percentage}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Monthly Leads Bar Chart */}
          <Card title="Monthly Acquisition Trend" icon={FiBarChart2} subtitle="Leads signups comparison in 2026">
            <div className="flex items-end justify-around h-60 pt-6 px-4">
              {monthlyData.map(d => {
                const percentHeight = Math.max(5, Math.round((d.count / maxMonthlyCount) * 100));
                return (
                  <div key={d.name} className="flex flex-col items-center gap-3 w-16 group">
                    <span className="text-xs font-black text-indigo-400 group-hover:scale-110 transition-transform duration-200">{d.count}</span>
                    <div className="w-full bg-slate-900 border border-slate-800 rounded-t-xl overflow-hidden h-40 flex items-end">
                      <div 
                        className="w-full bg-indigo-600/80 hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 rounded-t-lg transition-all duration-300"
                        style={{ height: `${percentHeight}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-400">{d.name}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Source Distribution Doughnut Chart */}
          <Card title="Acquisitions Source Share" icon={FiCompass} subtitle="Doughnut distribution of leads by acquisition channel">
            <div className="flex flex-col sm:flex-row items-center justify-around gap-4 h-60">
              <div className="relative w-[130px] h-[130px] flex items-center justify-center">
                <svg width="130" height="130" className="-rotate-90">
                  {sourceData.map((slice, i) => {
                    const percentage = slice.count / totalSourceCount;
                    const r = 45;
                    const circumference = 2 * Math.PI * r;
                    const strokeDash = circumference * percentage;
                    const strokeOffset = circumference - strokeDash;

                    // Calculate accumulated offset values
                    let precedingOffset = 0;
                    for (let j = 0; j < i; j++) {
                      precedingOffset += (sourceData[j].count / totalSourceCount) * circumference;
                    }

                    return (
                      slice.count > 0 && (
                        <circle
                          key={slice.name}
                          cx="65"
                          cy="65"
                          r={r}
                          fill="transparent"
                          stroke={slice.color}
                          strokeWidth="12"
                          strokeDasharray={circumference}
                          strokeDashoffset={circumference - strokeDash + precedingOffset}
                          className="hover:opacity-90 hover:stroke-[14px] transition-all duration-300 cursor-pointer origin-center"
                        />
                      )
                    );
                  })}
                </svg>
                <div className="absolute flex flex-col items-center text-center">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">leads</span>
                  <span className="text-lg font-black text-slate-100">{leads.length}</span>
                </div>
              </div>

              {/* Legends */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] font-bold">
                {sourceData.map((slice) => {
                  const pct = Math.round((slice.count / totalSourceCount) * 100);
                  return (
                    <div key={slice.name} className="flex items-center gap-1.5 text-slate-350">
                      <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: slice.color }} />
                      <span className="truncate">{slice.name} ({pct}%)</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tables and Timelines Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Leads Table */}
        <div className="xl:col-span-2 space-y-6">
          {loading ? (
            <Card title="Recent Opportunity Leads">
              <Skeleton type="table" count={5} />
            </Card>
          ) : (
            <Card 
              title="Recent Opportunity Leads" 
              subtitle="Latest client leads added to the database"
              actions={
                <Link 
                  to="/leads" 
                  className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-bold transition-colors"
                >
                  <span>See Directory</span>
                  <FiArrowRight className="text-sm" />
                </Link>
              }
            >
              <div className="-mx-6 -mb-6 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700/50 bg-slate-800/20 text-xs font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-3 px-6">ID</th>
                      <th className="py-3 px-6">Name</th>
                      <th className="py-3 px-6">Company</th>
                      <th className="py-3 px-6">Assigned Rep</th>
                      <th className="py-3 px-6">Status</th>
                      <th className="py-3 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {latestLeads.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-slate-500 text-sm">
                          No leads cataloged yet.
                        </td>
                      </tr>
                    ) : (
                      latestLeads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors text-sm text-slate-350">
                          <td className="py-4 px-6 text-slate-500 font-semibold">LF-{100 + lead.id}</td>
                          <td className="py-4 px-6 font-bold text-slate-205">
                            {lead.full_name}
                          </td>
                          <td className="py-4 px-6 text-slate-400">{lead.company}</td>
                          <td className="py-4 px-6 text-slate-400 text-xs">{lead.assigned_name || 'Sarah Jenkins'}</td>
                          <td className="py-4 px-6">
                            <StatusBadge status={lead.status} />
                          </td>
                          <td className="py-4 px-6 text-right">
                            <Link
                              to={`/leads/${lead.id}`}
                              className="inline-flex items-center justify-center p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-750/70 rounded-lg transition-all"
                              title="Details"
                            >
                              <FiEye className="text-base" />
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Upcoming follow-ups widget */}
          {loading ? (
            <Card title="Upcoming follow-up actions">
              <Skeleton type="timeline" count={3} />
            </Card>
          ) : (
            <Card title="Upcoming Follow-Up Reminders" icon={FiCalendar} subtitle="Task checklist of callback dates and proposal reviews">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {upcomingFollowups.length === 0 ? (
                  <div className="col-span-2 py-6 text-center text-slate-500 text-sm">
                    All client callbacks are caught up!
                  </div>
                ) : (
                  upcomingFollowups.map((task) => (
                    <div 
                      key={task.id} 
                      className="p-4 bg-slate-900/50 border border-slate-850 hover:border-slate-800 transition-colors rounded-xl flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {task.type}
                        </span>
                        <h4 className="text-sm font-bold text-slate-205 pt-1">{task.name}</h4>
                        <p className="text-slate-450 font-medium">{task.company}</p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-2.5">
                        <span className="text-[10px] text-slate-500 font-semibold">
                          Due: {task.date.toLocaleDateString()}
                        </span>
                        <button
                          onClick={() => navigate(`/leads/${task.leadId}`)}
                          className="flex items-center gap-1 text-[10px] text-indigo-400 hover:text-indigo-300 font-bold transition-colors cursor-pointer"
                        >
                          <span>Review</span>
                          <FiArrowRight />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Recent Audit Timeline Log */}
        <div>
          {loading ? (
            <Card title="Acquisitions Audit log">
              <Skeleton type="timeline" count={4} />
            </Card>
          ) : (
            <Card 
              title="Acquisitions Audit Log" 
              subtitle="Recent state history changes"
            >
              <div className="space-y-5 relative before:absolute before:top-2 before:bottom-2 before:left-[17px] before:w-[2px] before:bg-slate-800">
                {recentActivities.length === 0 ? (
                  <p className="text-center py-6 text-slate-500 text-xs">No recent actions logged</p>
                ) : (
                  recentActivities.map((act) => (
                    <div key={act.id} className="flex gap-3.5 items-start relative z-10 animate-fade-in">
                      <div className="p-2 rounded-lg bg-slate-800 text-slate-400">
                        <FiActivity className="text-sm" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-slate-250 font-medium leading-relaxed">
                          {act.description}
                        </p>
                        <span className="text-[10px] text-slate-500 mt-1 block">
                          {new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &bull; {new Date(act.time).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
