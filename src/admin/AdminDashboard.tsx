import { useState, useEffect } from 'react';
import { 
  Users, Briefcase, DollarSign, 
  Activity, Search, MoreVertical,
  CheckCircle, XCircle, Clock, AlertCircle
} from 'lucide-react';
import { dashboardAPI, clientAPI } from '@/services/api';

interface DashboardStats {
  totalClients: number;
  totalCases: number;
  activeCases: number;
  pendingCases: number;
  resolvedCases: number;
  totalCollected: number;
}

interface Client {
  client_id: string;
  email: string;
  first_name: string;
  last_name: string;
  company_name: string;
  status: string;
  created_at: string;
  last_login: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, clientsRes] = await Promise.all([
        dashboardAPI.getStats(),
        clientAPI.getAll()
      ]);

      if (statsRes.success) {
        setStats(statsRes.data);
      }

      if (clientsRes.success) {
        setClients(clientsRes.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.company_name && client.company_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="text-green-500" size={18} />;
      case 'inactive':
        return <XCircle className="text-gray-500" size={18} />;
      case 'suspended':
        return <AlertCircle className="text-red-500" size={18} />;
      default:
        return <Clock className="text-yellow-500" size={18} />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-purple-900 text-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">MDRG Admin Dashboard</h1>
            <p className="text-purple-200 text-sm">Client Management System</p>
          </div>
          <button 
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-yellow-400 text-purple-900 rounded font-semibold hover:bg-yellow-500"
          >
            Refresh Data
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-6">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            <StatCard 
              icon={<Users className="text-blue-500" />}
              title="Total Clients"
              value={stats.totalClients}
            />
            <StatCard 
              icon={<Briefcase className="text-purple-500" />}
              title="Total Cases"
              value={stats.totalCases}
            />
            <StatCard 
              icon={<Activity className="text-green-500" />}
              title="Active Cases"
              value={stats.activeCases}
            />
            <StatCard 
              icon={<Clock className="text-yellow-500" />}
              title="Pending Cases"
              value={stats.pendingCases}
            />
            <StatCard 
              icon={<CheckCircle className="text-teal-500" />}
              title="Resolved Cases"
              value={stats.resolvedCases}
            />
            <StatCard 
              icon={<DollarSign className="text-green-600" />}
              title="Total Collected"
              value={`£${stats.totalCollected.toLocaleString()}`}
            />
          </div>
        )}

        {/* Clients Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-xl font-bold">Clients</h2>
              
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search clients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
          </div>

          {/* Clients Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredClients.map((client) => (
                  <tr key={client.client_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-900">
                      {client.client_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {client.first_name} {client.last_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {client.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {client.company_name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(client.status)}`}>
                        {getStatusIcon(client.status)}
                        {client.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(client.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {client.last_login ? new Date(client.last_login).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-purple-900 hover:text-purple-700">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredClients.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <Users className="mx-auto mb-4 text-gray-300" size={48} />
              <p>No clients found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Summary Footer */}
        <div className="mt-6 text-sm text-gray-600">
          Showing {filteredClients.length} of {clients.length} clients
        </div>
      </main>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string | number }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-gray-100 rounded-lg">
          {icon}
        </div>
      </div>
      <p className="text-gray-600 text-sm">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
