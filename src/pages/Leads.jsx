import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLeads } from '../context/LeadContext';
import { useDebounce } from '../hooks/useDebounce';
import api from '../services/api';
import { 
  FiPlus, 
  FiSearch, 
  FiFilter, 
  FiTrash2, 
  FiEdit, 
  FiEye,
  FiChevronUp,
  FiChevronDown,
  FiDownload,
  FiPrinter,
  FiCheckSquare,
  FiSquare,
  FiUserPlus,
  FiRefreshCw
} from 'react-icons/fi';
import Button from '../components/Button';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';
import FilterDropdown from '../components/FilterDropdown';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';

const Leads = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { deleteLead, updateLead } = useLeads();

  // State variables
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalLeads, setTotalLeads] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Filters & Sorting state
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [statusFilter, setStatusFilter] = useState('');
  const [assignedFilter, setAssignedFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest'

  // Selected row tracking for bulk operations
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkActionProgress, setBulkActionProgress] = useState(false);
  const [bulkProgressText, setBulkProgressText] = useState('');

  // Modals status
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Query database entries
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        search: debouncedSearch,
        status: statusFilter,
        assignedTo: assignedFilter,
        sort: sortBy
      });

      const response = await api.get(`/leads?${params.toString()}`);
      
      if (response.data?.success) {
        const payload = response.data.data;
        setLeads(payload.leads || []);
        setTotalLeads(payload.total || 0);
        setTotalPages(payload.totalPages || 1);
        
        // Reset selections on page changes
        setSelectedIds([]);
      }
    } catch (error) {
      console.error('[Leads Page] Fetch error:', error);
      showToast('Could not sync leads list with the server', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Run database sync on filter changes or debounced query updates
  useEffect(() => {
    fetchLeads();
  }, [currentPage, statusFilter, assignedFilter, sortBy, debouncedSearch]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setAssignedFilter('');
    setSortBy('newest');
    setCurrentPage(1);
  };

  const toggleSort = () => {
    setSortBy(prev => prev === 'newest' ? 'oldest' : 'newest');
    setCurrentPage(1);
  };

  // Selected state checks
  const handleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAllVisible = () => {
    if (selectedIds.length === leads.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(leads.map((l) => l.id));
    }
  };

  // 1. Bulk Delete Action
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    const confirm = window.confirm(`Are you sure you want to delete the ${selectedIds.length} selected leads?`);
    if (!confirm) return;

    try {
      setBulkActionProgress(true);
      setBulkProgressText(`Deleting ${selectedIds.length} leads...`);
      
      // Execute deletions in sequential parallel batches
      for (const id of selectedIds) {
        await deleteLead(id);
      }
      
      showToast(`Successfully deleted ${selectedIds.length} lead records`);
      setSelectedIds([]);
      
      // Fallback page alignment
      if (leads.length === selectedIds.length && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        fetchLeads();
      }
    } catch (err) {
      showToast('Error executing bulk deletions', 'error');
    } finally {
      setBulkActionProgress(false);
      setBulkProgressText('');
    }
  };

  // 2. Bulk Status Update
  const handleBulkStatusChange = async (e) => {
    const newStatus = e.target.value;
    if (!newStatus || selectedIds.length === 0) return;

    try {
      setBulkActionProgress(true);
      setBulkProgressText(`Updating status to ${newStatus} for ${selectedIds.length} leads...`);

      for (const id of selectedIds) {
        const lead = leads.find((l) => l.id === id);
        if (lead) {
          await updateLead(id, {
            name: lead.full_name,
            company: lead.company,
            email: lead.email,
            phone: lead.phone,
            source: lead.source,
            status: newStatus,
            assignedTo: lead.assigned_to
          });
        }
      }

      showToast(`Updated status of ${selectedIds.length} leads`);
      setSelectedIds([]);
      fetchLeads();
    } catch (err) {
      showToast('Error updating bulk statuses', 'error');
    } finally {
      setBulkActionProgress(false);
      setBulkProgressText('');
      e.target.value = ''; // Re-align dropdown selection index
    }
  };

  // 3. Bulk Assign User
  const handleBulkAssign = async (e) => {
    const newAssigneeId = e.target.value;
    if (!newAssigneeId || selectedIds.length === 0) return;

    try {
      setBulkActionProgress(true);
      setBulkProgressText(`Reassigning ${selectedIds.length} leads...`);

      for (const id of selectedIds) {
        const lead = leads.find((l) => l.id === id);
        if (lead) {
          await updateLead(id, {
            name: lead.full_name,
            company: lead.company,
            email: lead.email,
            phone: lead.phone,
            source: lead.source,
            status: lead.status,
            assignedTo: Number(newAssigneeId)
          });
        }
      }

      showToast(`Assigned ${selectedIds.length} leads to new representative`);
      setSelectedIds([]);
      fetchLeads();
    } catch (err) {
      showToast('Error assigning bulk representatives', 'error');
    } finally {
      setBulkActionProgress(false);
      setBulkProgressText('');
      e.target.value = '';
    }
  };

  // 4. Export visible list to CSV
  const handleExportCSV = () => {
    const listToExport = selectedIds.length > 0
      ? leads.filter((l) => selectedIds.includes(l.id))
      : leads;

    if (listToExport.length === 0) {
      showToast('No leads available to export', 'warning');
      return;
    }

    // Construct CSV Header
    const headers = ['Lead ID', 'Full Name', 'Company', 'Email', 'Phone', 'Source', 'Status', 'Assigned Rep', 'Created Date'];
    const rows = listToExport.map((l) => [
      `LF-${100 + l.id}`,
      l.full_name,
      l.company,
      l.email,
      l.phone,
      l.source || 'Website',
      l.status,
      l.assigned_name || 'Sarah Jenkins',
      new Date(l.created_at).toLocaleDateString()
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `LeadFlow_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${listToExport.length} records to CSV`);
  };

  // 5. Export to PDF Print Optimized Tab
  const handlePrintPDF = () => {
    const listToPrint = selectedIds.length > 0
      ? leads.filter((l) => selectedIds.includes(l.id))
      : leads;

    if (listToPrint.length === 0) {
      showToast('No leads available to print', 'warning');
      return;
    }

    const printWindow = window.open('', '_blank');
    const tableRows = listToPrint.map((l) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">LF-${100 + l.id}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">${l.full_name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${l.company}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${l.email}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${l.phone}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${l.status}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${l.assigned_name || 'Sarah Jenkins'}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>LeadFlow CRM - Leads Report</title>
          <style>
            body { font-family: 'Inter', system-ui, sans-serif; color: #333; margin: 30px; }
            h1 { font-size: 20px; font-weight: 800; margin-bottom: 5px; }
            p { font-size: 12px; color: #666; margin-bottom: 25px; }
            table { width: 100%; border-collapse: collapse; text-align: left; font-size: 11px; }
            th { background-color: #f3f4f6; padding: 10px; font-weight: bold; border-bottom: 2px solid #ddd; }
          </style>
        </head>
        <body>
          <h1>LeadFlow CRM Leads Report</h1>
          <p>Generated on ${new Date().toLocaleString()}</p>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Company</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Assigned Rep</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Deletes single modal trigger
  const openDeleteModal = (lead) => {
    setLeadToDelete(lead);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setLeadToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!leadToDelete) return;
    try {
      setDeleting(true);
      const result = await deleteLead(leadToDelete.id);
      if (result?.success) {
        showToast('Lead record deleted successfully');
        if (leads.length === 1 && currentPage > 1) {
          setCurrentPage(prev => prev - 1);
        } else {
          fetchLeads();
        }
      }
    } catch (error) {
      showToast(error.message || 'Failed to delete lead', 'error');
    } finally {
      setDeleting(false);
      closeDeleteModal();
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Leads Directory</h1>
          <p className="text-slate-400 text-sm mt-0.5">Filter, search, organize, and edit customer acquisition pipelines.</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Button
            variant="secondary"
            icon={FiDownload}
            onClick={handleExportCSV}
          >
            Export CSV
          </Button>
          <Button
            variant="secondary"
            icon={FiPrinter}
            onClick={handlePrintPDF}
          >
            Print PDF
          </Button>
          <Button
            variant="primary"
            icon={FiPlus}
            onClick={() => navigate('/leads/new')}
          >
            Create Lead
          </Button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <Card bodyClassName="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between p-4">
        {/* Debounced Search input */}
        <div className="w-full lg:max-w-xs relative">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, company or email..."
          />
          {searchQuery && (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] text-slate-500 font-bold bg-slate-800 px-1.5 py-0.5 rounded animate-pulse">
              typing...
            </span>
          )}
        </div>

        {/* Filters and sorting */}
        <div className="flex flex-wrap items-center gap-3">
          <FilterDropdown
            label="Status"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            options={[
              { value: 'New', label: 'New' },
              { value: 'Contacted', label: 'Contacted' },
              { value: 'Qualified', label: 'Qualified' },
              { value: 'Proposal Sent', label: 'Proposal Sent' },
              { value: 'Won', label: 'Won' },
              { value: 'Lost', label: 'Lost' },
            ]}
          />

          <FilterDropdown
            label="Assigned Rep"
            value={assignedFilter}
            onChange={(e) => {
              setAssignedFilter(e.target.value);
              setCurrentPage(1);
            }}
            options={[
              { value: '1', label: 'Sarah Jenkins (Admin)' },
              { value: '2', label: 'Alex Rivera (Member)' },
            ]}
          />

          <button
            onClick={toggleSort}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-350 border border-slate-800 rounded-lg cursor-pointer transition-colors"
          >
            <span>Date Added</span>
            {sortBy === 'newest' ? <FiChevronDown className="text-sm" /> : <FiChevronUp className="text-sm" />}
          </button>

          {(searchQuery || statusFilter || assignedFilter || sortBy !== 'newest') && (
            <button
              onClick={handleClearFilters}
              className="text-xs font-bold text-rose-455 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </Card>

      {/* Progress alert banner for client-side batch API operations */}
      {bulkActionProgress && (
        <div className="p-4 bg-slate-900 border border-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <FiRefreshCw className="animate-spin text-lg" />
            <span className="text-xs font-extrabold">{bulkProgressText}</span>
          </div>
        </div>
      )}

      {/* Bulk Operations Toolbar Panel (Revealed when rows are checked) */}
      {selectedIds.length > 0 && !bulkActionProgress && (
        <Card bodyClassName="flex flex-wrap items-center justify-between gap-4 p-4 bg-indigo-550/5 border border-indigo-500/20">
          <div className="text-xs font-bold text-slate-205">
            Checked: <strong className="text-indigo-400">{selectedIds.length}</strong> leads selected
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* Bulk Status Update */}
            <select
              onChange={handleBulkStatusChange}
              className="bg-slate-900 border border-slate-800 text-[11px] font-bold px-2.5 py-1.5 rounded-lg cursor-pointer text-slate-350 focus:outline-none"
            >
              <option value="">Bulk Status Update</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Proposal Sent">Proposal Sent</option>
              <option value="Won">Won</option>
              <option value="Lost">Lost</option>
            </select>

            {/* Bulk User Assignment */}
            <select
              onChange={handleBulkAssign}
              className="bg-slate-900 border border-slate-800 text-[11px] font-bold px-2.5 py-1.5 rounded-lg cursor-pointer text-slate-350 focus:outline-none"
            >
              <option value="">Bulk Assign Owner</option>
              <option value="1">Sarah Jenkins (Admin)</option>
              <option value="2">Alex Rivera (Member)</option>
            </select>

            {/* Bulk Delete */}
            {isAdmin && (
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-1 bg-rose-600/10 border border-rose-500/20 hover:bg-rose-600 hover:text-white transition-all text-[11px] font-bold px-3 py-1.5 rounded-lg text-rose-455 cursor-pointer"
              >
                <FiTrash2 />
                <span>Bulk Delete</span>
              </button>
            )}
          </div>
        </Card>
      )}

      {/* Main Content Layout */}
      {loading && !searchQuery ? (
        <Card>
          <Skeleton type="table" count={8} />
        </Card>
      ) : leads.length === 0 ? (
        <EmptyState
          title="No leads matching filters"
          description="Adjust your search criteria or register a new customer profile to populate this tab."
          action={
            <Button variant="primary" icon={FiPlus} onClick={() => navigate('/leads/new')}>
              Add Lead
            </Button>
          }
        />
      ) : (
        <Card bodyClassName="p-0 animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700/50 bg-slate-800/20 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6 w-12 text-center">
                    <button onClick={handleSelectAllVisible} className="text-slate-400 hover:text-indigo-400 cursor-pointer">
                      {selectedIds.length === leads.length ? (
                        <FiCheckSquare className="text-base text-indigo-500" />
                      ) : (
                        <FiSquare className="text-base" />
                      )}
                    </button>
                  </th>
                  <th className="py-4 px-6">Lead ID</th>
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Company</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Phone</th>
                  <th className="py-4 px-6">Assigned Rep</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm text-slate-350">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 text-center">
                      <button onClick={() => handleSelectRow(lead.id)} className="text-slate-500 hover:text-indigo-400 cursor-pointer">
                        {selectedIds.includes(lead.id) ? (
                          <FiCheckSquare className="text-base text-indigo-500" />
                        ) : (
                          <FiSquare className="text-base" />
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-slate-500 font-semibold">LF-{100 + lead.id}</td>
                    <td className="py-4 px-6 font-bold text-slate-205">
                      {lead.full_name}
                    </td>
                    <td className="py-4 px-6 text-slate-400">{lead.company}</td>
                    <td className="py-4 px-6 text-slate-400">{lead.email}</td>
                    <td className="py-4 px-6 text-slate-400">{lead.phone}</td>
                    <td className="py-4 px-6 text-slate-450 text-xs">
                      {lead.assigned_name || 'Sarah Jenkins'}
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-1">
                        <Link
                          to={`/leads/${lead.id}`}
                          className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Details"
                        >
                          <FiEye className="text-base" />
                        </Link>
                        <Link
                          to={`/leads/${lead.id}/edit`}
                          className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FiEdit className="text-base" />
                        </Link>
                        {isAdmin && (
                          <button
                            onClick={() => openDeleteModal(lead)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <FiTrash2 className="text-base" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-800/80">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          )}
        </Card>
      )}

      {/* Delete Confirmation Popup */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title="Confirm Lead Deletion"
        onConfirm={handleDeleteConfirm}
        confirmText={deleting ? 'Deleting...' : 'Delete'}
        confirmVariant="danger"
        disabled={deleting}
      >
        <p className="text-sm text-slate-350 leading-relaxed">
          Are you sure you want to delete lead <strong className="text-slate-100">{leadToDelete?.full_name}</strong>? 
          This action will permanently delete the lead record along with all note timelines and activity logs.
        </p>
      </Modal>
    </div>
  );
};

export default Leads;
