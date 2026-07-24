import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useLeads } from '../context/LeadContext';
import api from '../services/api';
import { FiSave, FiRotateCcw, FiX, FiEdit } from 'react-icons/fi';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import Skeleton from '../components/Skeleton';

const EditLead = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { updateLead, users } = useLeads();

  // Prefill loading contexts
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    source: '',
    status: '',
    assignedTo: '',
  });

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchLeadForEdit = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/leads/${id}`);
        if (response.data?.success) {
          const lead = response.data.data.lead;
          const prefill = {
            name: lead.full_name,
            company: lead.company,
            email: lead.email,
            phone: lead.phone,
            source: lead.source || 'Website',
            status: lead.status || 'New',
            assignedTo: lead.assigned_name || 'Sarah Jenkins',
          };
          setFormData(prefill);
          setInitialData(prefill);
        }
      } catch (error) {
        showToast('Could not fetch lead details for editing', 'error');
        navigate('/leads');
      } finally {
        setLoading(false);
      }
    };

    fetchLeadForEdit();
  }, [id]);

  const validate = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Full Name is required';
    if (!formData.company.trim()) tempErrors.company = 'Company is required';
    
    // Email Check
    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Invalid email format';
    }

    // Phone Check
    if (!formData.phone.trim()) {
      tempErrors.phone = 'Phone number is required';
    } else if (formData.phone.replace(/\D/g, '').length < 7) {
      tempErrors.phone = 'Phone number must be at least 7 digits';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleReset = () => {
    if (initialData) {
      setFormData(initialData);
      setErrors({});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please correct form errors before saving', 'error');
      return;
    }

    try {
      setSaving(true);
      const response = await updateLead(id, formData);
      if (response?.success) {
        showToast('Lead updated successfully');
        navigate(`/leads/${id}`);
      }
    } catch (error) {
      showToast(error.message || 'Failed to update lead info', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton type="card" count={1} />
        <Skeleton type="button" count={2} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
          <FiEdit className="text-xl" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Edit Lead Information</h1>
          <p className="text-slate-400 text-sm mt-0.5">Modify parameters or update status fields for client #LF-{100 + Number(id)}.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card bodyClassName="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <Input
              label="Full Name *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="e.g. Eleanor Pena"
            />

            {/* Company */}
            <Input
              label="Company *"
              name="company"
              value={formData.company}
              onChange={handleChange}
              error={errors.company}
              placeholder="e.g. Acme Corporation"
            />

            {/* Email */}
            <Input
              label="Email Address *"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="e.g. eleanor@acme.com"
            />

            {/* Phone */}
            <Input
              label="Phone Number *"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              placeholder="e.g. (205) 555-0100"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Source */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-400 tracking-wide">Lead Source</label>
              <select
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500/50 cursor-pointer"
              >
                <option value="Website">Website</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Referral">Referral</option>
                <option value="Cold Call">Cold Call</option>
                <option value="Partner">Partner</option>
              </select>
            </div>

            {/* Status */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-400 tracking-wide">Pipeline Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500/50 cursor-pointer"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Won">Won</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            {/* Assigned Representative */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-400 tracking-wide">Assigned Owner *</label>
              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500/50 cursor-pointer"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.name}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="secondary"
            type="button"
            icon={FiRotateCcw}
            onClick={handleReset}
            disabled={saving}
          >
            Revert Changes
          </Button>
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              type="button"
              icon={FiX}
              onClick={() => navigate(`/leads/${id}`)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              icon={FiSave}
              disabled={saving}
            >
              {saving ? 'Updating...' : 'Save Updates'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditLead;
