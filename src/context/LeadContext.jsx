import React, { createContext, useContext, useState } from 'react';
import api from '../services/api';

const LeadContext = createContext(null);

export const LeadProvider = ({ children }) => {
  // Constant users list mapped to backend SQLite primary keys
  const [users] = useState([
    { id: 1, name: 'Sarah Jenkins', email: 'admin@leadflow.com', role: 'admin', status: 'Active', leadsCount: 10 },
    { id: 2, name: 'Alex Rivera', email: 'member@leadflow.com', role: 'member', status: 'Active', leadsCount: 11 },
  ]);

  const addLead = async (leadData) => {
    try {
      // Map assignedTo name string or number to SQLite user ID
      const assignedToId = leadData.assignedTo === 'Alex Rivera' || Number(leadData.assignedTo) === 2 ? 2 : 1;

      const response = await api.post('/leads', {
        full_name: leadData.name,
        company: leadData.company,
        email: leadData.email,
        phone: leadData.phone,
        source: leadData.source || 'Website',
        status: leadData.status || 'New',
        assigned_to: assignedToId,
      });

      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Failed to create lead';
      throw new Error(msg);
    }
  };

  const updateLead = async (id, updatedData) => {
    try {
      // Map assignedTo name string or number to SQLite user ID
      let assignedToId = 1;
      if (updatedData.assignedTo === 'Alex Rivera' || Number(updatedData.assignedTo) === 2 || Number(updatedData.assigned_to) === 2) {
        assignedToId = 2;
      }

      const response = await api.put(`/leads/${id}`, {
        full_name: updatedData.name || updatedData.full_name,
        company: updatedData.company,
        email: updatedData.email,
        phone: updatedData.phone,
        source: updatedData.source,
        status: updatedData.status,
        assigned_to: assignedToId,
      });

      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Failed to update lead';
      throw new Error(msg);
    }
  };

  const deleteLead = async (id) => {
    try {
      const response = await api.delete(`/leads/${id}`);
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Failed to delete lead';
      throw new Error(msg);
    }
  };

  const addLeadNote = async (leadId, noteText, author) => {
    try {
      const response = await api.post(`/leads/${leadId}/notes`, {
        note: noteText,
      });
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Failed to add note';
      throw new Error(msg);
    }
  };

  return (
    <LeadContext.Provider
      value={{
        users,
        addLead,
        updateLead,
        deleteLead,
        addLeadNote,
      }}
    >
      {children}
    </LeadContext.Provider>
  );
};

export const useLeads = () => {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error('useLeads must be used within a LeadProvider');
  }
  return context;
};
