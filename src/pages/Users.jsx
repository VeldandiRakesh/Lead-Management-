import React, { useState } from 'react';
import { useLeads } from '../context/LeadContext';
import { FiUserPlus, FiUsers, FiShield, FiClock, FiSearch } from 'react-icons/fi';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';

const Users = () => {
  const { users } = useLeads();
  const [search, setSearch] = useState('');
  const [newUserModalOpen, setNewUserModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({ name: '', email: '', role: 'Agent', status: 'Active' });

  // Filter users based on search
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.role.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status) => {
    return status === 'Active' ? (
      <span className="px-2 py-0.5 text-xs font-bold rounded-lg bg-emerald-500/10 text-emerald-450 border border-emerald-500/20">
        Active
      </span>
    ) : (
      <span className="px-2 py-0.5 text-xs font-bold rounded-lg bg-slate-500/10 text-slate-450 border border-slate-500/20">
        Inactive
      </span>
    );
  };

  const getRoleBadge = (role) => {
    return role?.toLowerCase() === 'admin' ? (
      <span className="px-2 py-0.5 text-xs font-bold rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
        Administrator
      </span>
    ) : (
      <span className="px-2 py-0.5 text-xs font-bold rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
        Member
      </span>
    );
  };

  // Metrics
  const activeCount = users.filter(u => u.status === 'Active').length;
  const adminCount = users.filter(u => u.role?.toLowerCase() === 'admin').length;
  const agentCount = users.filter(u => u.role?.toLowerCase() === 'member').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Team Members</h1>
          <p className="text-slate-400 text-sm mt-0.5">Manage administrative and representative roles for lead assignment pipelines.</p>
        </div>
        <Button 
          variant="primary" 
          icon={FiUserPlus}
          onClick={() => setNewUserModalOpen(true)}
        >
          Add Team Member
        </Button>
      </div>

      {/* Analytics Widget Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card bodyClassName="flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <FiUsers className="text-xl" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Staff Members</span>
            <p className="text-lg font-extrabold text-slate-205">{activeCount} / {users.length}</p>
          </div>
        </Card>

        <Card bodyClassName="flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 text-purple-450 rounded-xl">
            <FiShield className="text-xl" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Administrators</span>
            <p className="text-lg font-extrabold text-slate-205">{adminCount}</p>
          </div>
        </Card>

        <Card bodyClassName="flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
            <FiClock className="text-xl" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Sales Agents</span>
            <p className="text-lg font-extrabold text-slate-205">{agentCount}</p>
          </div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card bodyClassName="flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <Input
            placeholder="Search representatives by name, email, or role..."
            icon={FiSearch}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </Card>

      {/* Users Table */}
      <Card bodyClassName="overflow-hidden -mx-6 -my-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700/50 bg-slate-800/20 text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-6">Name</th>
                <th className="py-3.5 px-6">Email Contact</th>
                <th className="py-3.5 px-6">System Role</th>
                <th className="py-3.5 px-6">Assigned Leads</th>
                <th className="py-3.5 px-6">Pipeline Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-extrabold text-indigo-400 text-xs shadow-inner">
                        {u.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span>{u.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-400">{u.email}</td>
                  <td className="py-4 px-6">{getRoleBadge(u.role)}</td>
                  <td className="py-4 px-6 font-semibold text-slate-300">{u.leadsCount} leads</td>
                  <td className="py-4 px-6">{getStatusBadge(u.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add New User Modal (Mock) */}
      <Modal
        isOpen={newUserModalOpen}
        onClose={() => setNewUserModalOpen(false)}
        title="Add Team Member"
        footer={
          <>
            <Button variant="secondary" onClick={() => setNewUserModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setNewUserModalOpen(false)}>
              Add Member
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Courtney Henry"
            value={newUserData.name}
            onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="courtney@leadflow.com"
            value={newUserData.email}
            onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
          />
          <Input
            label="System Role"
            type="select"
            value={newUserData.role}
            onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
            options={[
              { value: 'member', label: 'Member' },
              { value: 'admin', label: 'Administrator' }
            ]}
          />
          <Input
            label="Status"
            type="select"
            value={newUserData.status}
            onChange={(e) => setNewUserData({ ...newUserData, status: e.target.value })}
            options={[
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' }
            ]}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Users;
