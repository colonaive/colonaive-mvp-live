import React, { useState } from 'react';
import { Container } from '../components/ui/Container';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Filter,
  Search,
  Calendar,
  ArrowUpDown,
  FileText,
  AlertCircle
} from 'lucide-react';

type ReferralStatus = 'Pending' | 'Test Done' | 'Consult Only' | 'No Show';

interface Referral {
  id: string;
  patient: string;
  referralDate: string;
  testType: string;
  status: ReferralStatus;
  notes?: string;
  nextFollowUp?: string;
}

const initialReferrals: Referral[] = [
  { 
    id: '001',
    patient: 'M. Lee',
    referralDate: '2025-05-01',
    testType: 'ColonAiQ',
    status: 'Pending',
    nextFollowUp: '2025-05-15'
  },
  { 
    id: '002',
    patient: 'Suzie T.',
    referralDate: '2025-04-30',
    testType: 'Colonoscopy',
    status: 'Test Done',
    notes: 'Follow-up in 6 months'
  },
  { 
    id: '003',
    patient: 'Rajesh N.',
    referralDate: '2025-04-28',
    testType: 'ColonAiQ',
    status: 'Consult Only',
    notes: 'Patient opted for screening at later date'
  }
];

const statusColors = {
  'Pending': 'text-yellow-600 bg-yellow-50',
  'Test Done': 'text-green-600 bg-green-50',
  'Consult Only': 'text-blue-600 bg-blue-50',
  'No Show': 'text-red-600 bg-red-50'
};

const statusIcons = {
  'Pending': <Clock className="h-4 w-4" />,
  'Test Done': <CheckCircle className="h-4 w-4" />,
  'Consult Only': <FileText className="h-4 w-4" />,
  'No Show': <XCircle className="h-4 w-4" />
};

export default function ClinicianReferralDashboard() {
  const [referrals, setReferrals] = useState(initialReferrals);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReferralStatus | 'All'>('All');
  const [sortBy, setSortBy] = useState<'date' | 'patient'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const updateStatus = (id: string, newStatus: ReferralStatus) => {
    setReferrals(prev => 
      prev.map(ref => 
        ref.id === id ? { ...ref, status: newStatus } : ref
      )
    );
  };

  const filteredAndSortedReferrals = referrals
    .filter(ref => {
      const matchesSearch = ref.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ref.testType.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || ref.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? new Date(a.referralDate).getTime() - new Date(b.referralDate).getTime()
          : new Date(b.referralDate).getTime() - new Date(a.referralDate).getTime();
      } else {
        return sortOrder === 'asc'
          ? a.patient.localeCompare(b.patient)
          : b.patient.localeCompare(a.patient);
      }
    });

  const toggleSort = (field: 'date' | 'patient') => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Referral Management</h1>
            <p className="text-gray-600">Track and update patient referrals through Project COLONAiVE™</p>
          </div>
          <Button>New Referral</Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Referrals', value: referrals.length, color: 'bg-blue-50 text-blue-600' },
            { label: 'Pending', value: referrals.filter(r => r.status === 'Pending').length, color: 'bg-yellow-50 text-yellow-600' },
            { label: 'Completed', value: referrals.filter(r => r.status === 'Test Done').length, color: 'bg-green-50 text-green-600' },
            { label: 'No Shows', value: referrals.filter(r => r.status === 'No Show').length, color: 'bg-red-50 text-red-600' }
          ].map((stat, index) => (
            <Card key={index}>
              <CardContent className={`p-4 ${stat.color}`}>
                <p className="text-sm font-medium">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patients or test types..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <select
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as ReferralStatus | 'All')}
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Test Done">Test Done</option>
                  <option value="Consult Only">Consult Only</option>
                  <option value="No Show">No Show</option>
                </select>
                <Button variant="outline" onClick={() => toggleSort('date')} className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Date
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Referrals List */}
        <div className="space-y-4">
          {filteredAndSortedReferrals.map((ref) => (
            <Card key={ref.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{ref.patient}</h3>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm font-medium ${statusColors[ref.status]}`}>
                        {statusIcons[ref.status]}
                        {ref.status}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Test: {ref.testType}</p>
                      <p>Referral Date: {new Date(ref.referralDate).toLocaleDateString()}</p>
                      {ref.nextFollowUp && (
                        <p className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Follow-up: {new Date(ref.nextFollowUp).toLocaleDateString()}
                        </p>
                      )}
                      {ref.notes && (
                        <p className="flex items-center gap-1 text-gray-500 italic">
                          <AlertCircle className="h-4 w-4" />
                          {ref.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant={ref.status === 'Test Done' ? 'outline' : 'primary'}
                      onClick={() => updateStatus(ref.id, 'Test Done')}
                      className="min-w-[120px]"
                    >
                      Mark Test Done
                    </Button>
                    <Button
                      size="sm"
                      variant={ref.status === 'Consult Only' ? 'outline' : 'secondary'}
                      onClick={() => updateStatus(ref.id, 'Consult Only')}
                      className="min-w-[120px]"
                    >
                      Consult Only
                    </Button>
                    <Button
                      size="sm"
                      variant={ref.status === 'No Show' ? 'outline' : 'secondary'}
                      onClick={() => updateStatus(ref.id, 'No Show')}
                      className="min-w-[120px]"
                    >
                      Mark No Show
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredAndSortedReferrals.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-600">No referrals found matching your criteria</p>
              </CardContent>
            </Card>
          )}
        </div>
      </Container>
    </div>
  );
}