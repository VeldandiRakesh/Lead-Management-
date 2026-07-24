import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLeads } from '../context/LeadContext';
import api from '../services/api';
import { 
  FiArrowLeft, 
  FiEdit, 
  FiTrash2, 
  FiPlus, 
  FiCalendar, 
  FiBriefcase, 
  FiMail, 
  FiPhone, 
  FiUser, 
  FiTag, 
  FiMessageSquare, 
  FiActivity 
} from 'react-icons/fi';
import Button from '../components/Button';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import Skeleton from '../components/Skeleton';
import Modal from '../components/Modal';

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { deleteLead, addLeadNote } = useLeads();

  // Load details states
  const [lead, setLead] = useState(null);
  const [notes, setNotes] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Note input
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  // Delete modal context
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/leads/${id}`);
      if (response.data?.success) {
        const payload = response.data.data;
        setLead(payload.lead);
        setNotes(payload.notes || []);
        setActivities(payload.activities || []);
      }
    } catch (error) {
      console.error('[LeadDetails Page] Fetch error:', error);
      showToast('Could not find lead profile or synchronized timelines', 'error');
      navigate('/leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      setAddingNote(true);
      const response = await addLeadNote(id, newNote.trim());
      if (response?.success) {
        showToast('Comment note posted');
        // Updated notes are returned in response.data or response.data.data
        // Let's examine: response.data contains the array directly, or we can refetch details
        // To be safe, let's load from payload or trigger a full details sync
        if (response.data) {
          setNotes(response.data);
        } else {
          // Fallback refetch
          const refetch = await api.get(`/leads/${id}`);
          setNotes(refetch.data.data.notes);
          setActivities(refetch.data.data.activities);
        }
        setNewNote('');
        
        // Also trigger a full reload to synchronize the activity stream log
        const refetch = await api.get(`/leads/${id}`);
        setActivities(refetch.data.data.activities || []);
      }
    } catch (error) {
      showToast(error.message || 'Failed to submit comment note', 'error');
    } finally {
      setAddingNote(false);
    }
  };

  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const handleDeleteConfirm = async () => {
    try {
      setDeleting(true);
      const result = await deleteLead(id);
      if (result?.success) {
        showToast('Lead opportunity deleted successfully');
        navigate('/leads');
      }
    } catch (error) {
      showToast(error.message || 'Failed to delete lead', 'error');
    } finally {
      setDeleting(false);
      closeDeleteModal();
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton type="card" count={1} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2" type="card" count={2} />
          <Skeleton type="card" count={1} />
        </div>
      </div>
    );
  }

  if (!lead) return null;

  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6">
      {/* Top Navbar Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={() => navigate('/leads')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-450 hover:text-slate-205 font-bold transition-colors cursor-pointer"
        >
          <FiArrowLeft className="text-sm" />
          <span>Back to directory</span>
        </button>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="secondary"
            icon={FiEdit}
            onClick={() => navigate(`/leads/${id}/edit`)}
          >
            Edit Profile
          </Button>
          {isAdmin && (
            <Button
              variant="danger"
              icon={FiTrash2}
              onClick={openDeleteModal}
            >
              Delete Lead
            </Button>
          )}
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Client profile & timeline */}
        <div className="lg:col-span-2 space-y-6 animate-fade-in">
          {/* Main Info Card */}
          <Card bodyClassName="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b border-slate-800/80 pb-5">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Lead Profile #LF-{100 + lead.id}</span>
                <h1 className="text-2xl font-black text-slate-100 mt-1">{lead.full_name}</h1>
                <p className="text-slate-400 text-sm font-semibold mt-0.5">{lead.company}</p>
              </div>
              <div>
                <StatusBadge status={lead.status} />
              </div>
            </div>

            {/* Structured details parameters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-sm">
              <div className="flex items-center gap-2.5 text-slate-350">
                <FiMail className="text-slate-500" />
                <span className="font-semibold text-slate-450">Email:</span>
                <span className="text-slate-205">{lead.email}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-350">
                <FiPhone className="text-slate-500" />
                <span className="font-semibold text-slate-450">Phone:</span>
                <span className="text-slate-205">{lead.phone}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-350">
                <FiBriefcase className="text-slate-500" />
                <span className="font-semibold text-slate-450">Source:</span>
                <span className="text-slate-205">{lead.source || 'Website'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-350">
                <FiCalendar className="text-slate-500" />
                <span className="font-semibold text-slate-450">Added On:</span>
                <span className="text-slate-205">{new Date(lead.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </Card>

          {/* Notes Journal Timeline */}
          <Card title="Comments & Note Logs" icon={FiMessageSquare} subtitle="Timeline log of updates and customer calls">
            {/* Note form */}
            <form onSubmit={handleAddNote} className="mb-6">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Enter client conversation notes, callbacks date..."
                rows="3"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 resize-none"
              />
              <div className="flex justify-end mt-2">
                <Button
                  variant="primary"
                  type="submit"
                  icon={FiPlus}
                  disabled={addingNote || !newNote.trim()}
                >
                  {addingNote ? 'Saving...' : 'Add Note'}
                </Button>
              </div>
            </form>

            {/* Note items listing */}
            <div className="space-y-4">
              {notes.length === 0 ? (
                <p className="text-slate-500 text-center py-6 text-sm">No notes have been logged for this lead.</p>
              ) : (
                notes.map((n) => (
                  <div key={n.id} className="p-4 bg-slate-900/50 border border-slate-800/80 rounded-xl flex gap-3 items-start hover:border-slate-800 transition-colors">
                    <img
                      src={n.author_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                      alt={n.author_name || 'Author'}
                      className="w-8 h-8 rounded-full border border-slate-700 object-cover flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-extrabold text-slate-205">{n.author_name || 'Representative'}</span>
                        <span className="text-slate-500 font-semibold">
                          {new Date(n.created_at).toLocaleDateString()} at {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                        {n.note}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Right Side: Assignments & Activity logs */}
        <div className="space-y-6">
          {/* Assignment details card */}
          <Card title="Assignment Data" icon={FiUser}>
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-slate-900/50 border border-slate-850 p-3.5 rounded-xl">
                <img
                  src={lead.assigned_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                  alt={lead.assigned_name}
                  className="w-10 h-10 rounded-full border border-slate-800 object-cover flex-shrink-0"
                />
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Assigned Owner</span>
                  <span className="text-sm font-extrabold text-slate-205">{lead.assigned_name || 'Sarah Jenkins'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-900/50 border border-slate-850 p-3.5 rounded-xl text-xs text-slate-350">
                <div className="w-10 flex items-center justify-center text-slate-450 text-base">
                  <FiTag />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Created By</span>
                  <span>{lead.creator_name || 'Administrator'}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Activity audit history trails */}
          <Card title="Change History" icon={FiActivity} subtitle="System audit trail of lead updates">
            <div className="space-y-4 relative before:absolute before:top-2 before:bottom-2 before:left-[17px] before:w-[2px] before:bg-slate-800">
              {activities.length === 0 ? (
                <p className="text-slate-500 text-center py-6 text-xs">No activity changes registered.</p>
              ) : (
                activities.map((act) => (
                  <div key={act.id} className="flex gap-3 items-start relative z-10">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
                      <FiActivity className="text-xs" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-slate-205 font-bold">{act.action}</p>
                      
                      {/* Detailed parameter shifts description */}
                      {act.old_value && act.new_value && (
                        <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">
                          Changed: <span className="line-through text-rose-400">{act.old_value}</span> &rarr; <span className="text-emerald-400 font-semibold">{act.new_value}</span>
                        </p>
                      )}
                      
                      {/* Simple status descriptor fallback */}
                      {!act.old_value && act.new_value && (
                        <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">
                          Value: <span className="text-slate-300">{act.new_value}</span>
                        </p>
                      )}

                      <span className="text-[9px] text-slate-500 block mt-1">
                        By {act.user_name || 'Agent'} &bull; {new Date(act.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
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
          Are you sure you want to delete lead <strong className="text-slate-100">{lead.full_name}</strong>? 
          This action will permanently delete the lead record along with all note timelines and activity logs.
        </p>
      </Modal>
    </div>
  );
};

export default LeadDetails;
