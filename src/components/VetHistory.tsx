import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Stethoscope, Edit2, Trash2, X, Check } from 'lucide-react';

interface VetHistoryEntry {
  id: string;
  pet_id: string;
  visit_date: string;
  visit_type: 'checkup' | 'vaccination' | 'emergency' | 'surgery' | 'dental' | 'grooming' | 'other';
  vet_name?: string;
  reason?: string;
  diagnosis?: string;
  treatment?: string;
  medications_prescribed: string[];
  follow_up_needed: boolean;
  follow_up_date?: string;
  cost?: number;
  notes?: string;
  created_at: string;
}

interface Pet {
  id: string;
  name: string;
}

interface VetHistoryProps {
  userId: string;
  pets: Pet[];
  isPremium: boolean;
}

export default function VetHistory({ userId, pets, isPremium }: VetHistoryProps) {
  const [history, setHistory] = useState<VetHistoryEntry[]>([]);
  const [selectedPet, setSelectedPet] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<VetHistoryEntry>>({
    visit_date: new Date().toISOString().split('T')[0],
    visit_type: 'checkup',
    medications_prescribed: [],
    follow_up_needed: false
  });

  const freeLimit = 10;
  const canAddMore = isPremium || history.filter(h => h.pet_id === selectedPet).length < freeLimit;

  useEffect(() => {
    if (selectedPet) {
      loadHistory(selectedPet);
    }
  }, [selectedPet]);

  useEffect(() => {
    if (pets.length > 0 && !selectedPet) {
      setSelectedPet(pets[0].id);
    }
  }, [pets]);

  const loadHistory = (petId: string) => {
    const storedHistory = localStorage.getItem(`vet_history_${petId}`);
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  };

  const saveHistory = (updatedHistory: VetHistoryEntry[]) => {
    setHistory(updatedHistory);
    localStorage.setItem(`vet_history_${selectedPet}`, JSON.stringify(updatedHistory));
  };

  const handleSubmit = () => {
    if (!formData.visit_date || !selectedPet) return;

    if (editingEntry) {
      const updatedHistory = history.map(entry =>
        entry.id === editingEntry
          ? { ...entry, ...formData, medications_prescribed: formData.medications_prescribed || [] }
          : entry
      );
      saveHistory(updatedHistory);
      setEditingEntry(null);
    } else {
      const newEntry: VetHistoryEntry = {
        id: Date.now().toString(),
        pet_id: selectedPet,
        visit_date: formData.visit_date!,
        visit_type: formData.visit_type || 'checkup',
        vet_name: formData.vet_name,
        reason: formData.reason,
        diagnosis: formData.diagnosis,
        treatment: formData.treatment,
        medications_prescribed: formData.medications_prescribed || [],
        follow_up_needed: formData.follow_up_needed || false,
        follow_up_date: formData.follow_up_date,
        cost: formData.cost,
        notes: formData.notes,
        created_at: new Date().toISOString()
      };
      saveHistory([...history, newEntry]);
    }

    setShowAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      visit_date: new Date().toISOString().split('T')[0],
      visit_type: 'checkup',
      medications_prescribed: [],
      follow_up_needed: false
    });
  };

  const handleEdit = (entry: VetHistoryEntry) => {
    setFormData(entry);
    setEditingEntry(entry.id);
    setShowAddModal(true);
  };

  const handleDelete = (entryId: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      const updatedHistory = history.filter(h => h.id !== entryId);
      saveHistory(updatedHistory);
    }
  };

  const addMedication = (medication: string) => {
    if (medication.trim()) {
      setFormData({
        ...formData,
        medications_prescribed: [...(formData.medications_prescribed || []), medication.trim()]
      });
    }
  };

  const removeMedication = (index: number) => {
    const updated = [...(formData.medications_prescribed || [])];
    updated.splice(index, 1);
    setFormData({ ...formData, medications_prescribed: updated });
  };

  const petHistory = history
    .filter(h => h.pet_id === selectedPet)
    .sort((a, b) => new Date(b.visit_date).getTime() - new Date(a.visit_date).getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Veterinary History</h2>
          <p className="text-gray-600 mt-1">
            Track vet visits, treatments, and medical events
          </p>
        </div>
        <button
          onClick={() => canAddMore ? setShowAddModal(true) : alert('Upgrade to Premium for unlimited history entries')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Entry
        </button>
      </div>

      {pets.length > 1 && (
        <div className="flex gap-2">
          {pets.map(pet => (
            <button
              key={pet.id}
              onClick={() => setSelectedPet(pet.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedPet === pet.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {pet.name}
            </button>
          ))}
        </div>
      )}

      {!isPremium && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-amber-800">
            <strong>Free Plan:</strong> {petHistory.length}/{freeLimit} history entries used.
            <button className="ml-2 text-amber-900 underline font-medium">
              Upgrade to Premium
            </button> for unlimited history tracking.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {petHistory.map(entry => (
          <div
            key={entry.id}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg capitalize">
                    {entry.visit_type.replace('_', ' ')}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(entry.visit_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(entry)}
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {entry.vet_name && (
                <div>
                  <span className="font-medium text-gray-700">Veterinarian:</span>
                  <p className="text-gray-900">{entry.vet_name}</p>
                </div>
              )}
              {entry.reason && (
                <div>
                  <span className="font-medium text-gray-700">Reason:</span>
                  <p className="text-gray-900">{entry.reason}</p>
                </div>
              )}
              {entry.diagnosis && (
                <div>
                  <span className="font-medium text-gray-700">Diagnosis:</span>
                  <p className="text-gray-900">{entry.diagnosis}</p>
                </div>
              )}
              {entry.treatment && (
                <div>
                  <span className="font-medium text-gray-700">Treatment:</span>
                  <p className="text-gray-900">{entry.treatment}</p>
                </div>
              )}
              {entry.cost && (
                <div>
                  <span className="font-medium text-gray-700">Cost:</span>
                  <p className="text-gray-900">${entry.cost.toFixed(2)}</p>
                </div>
              )}
            </div>

            {entry.medications_prescribed.length > 0 && (
              <div className="mt-4">
                <span className="font-medium text-gray-700 text-sm">Medications:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {entry.medications_prescribed.map((med, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                    >
                      {med}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {entry.follow_up_needed && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-amber-900 font-medium text-sm">
                  Follow-up Required
                  {entry.follow_up_date && `: ${new Date(entry.follow_up_date).toLocaleDateString()}`}
                </p>
              </div>
            )}

            {entry.notes && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700 text-sm">Notes:</span>
                <p className="text-gray-900 mt-1 text-sm">{entry.notes}</p>
              </div>
            )}
          </div>
        ))}

        {petHistory.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Stethoscope className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>No veterinary history recorded yet</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Add your first entry
            </button>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingEntry ? 'Edit' : 'Add'} Vet Visit
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingEntry(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Visit Date *
                  </label>
                  <input
                    type="date"
                    value={formData.visit_date}
                    onChange={(e) => setFormData({ ...formData, visit_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Visit Type *
                  </label>
                  <select
                    value={formData.visit_type}
                    onChange={(e) => setFormData({ ...formData, visit_type: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="checkup">Checkup</option>
                    <option value="vaccination">Vaccination</option>
                    <option value="emergency">Emergency</option>
                    <option value="surgery">Surgery</option>
                    <option value="dental">Dental</option>
                    <option value="grooming">Grooming</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Veterinarian/Clinic Name
                </label>
                <input
                  type="text"
                  value={formData.vet_name || ''}
                  onChange={(e) => setFormData({ ...formData, vet_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Dr. Smith / Pet Care Clinic"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Visit
                </label>
                <input
                  type="text"
                  value={formData.reason || ''}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Annual checkup, limping, skin irritation, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diagnosis
                </label>
                <textarea
                  value={formData.diagnosis || ''}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="What did the vet diagnose?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Treatment
                </label>
                <textarea
                  value={formData.treatment || ''}
                  onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="What treatment was provided?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medications Prescribed
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    id="medication-input"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter medication name"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.currentTarget;
                        addMedication(input.value);
                        input.value = '';
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('medication-input') as HTMLInputElement;
                      addMedication(input.value);
                      input.value = '';
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    Add
                  </button>
                </div>
                {formData.medications_prescribed && formData.medications_prescribed.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.medications_prescribed.map((med, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-2"
                      >
                        {med}
                        <button
                          onClick={() => removeMedication(idx)}
                          className="hover:text-purple-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cost
                  </label>
                  <input
                    type="number"
                    value={formData.cost || ''}
                    onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Follow-up Date
                  </label>
                  <input
                    type="date"
                    value={formData.follow_up_date || ''}
                    onChange={(e) => setFormData({ ...formData, follow_up_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="follow-up"
                  checked={formData.follow_up_needed}
                  onChange={(e) => setFormData({ ...formData, follow_up_needed: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="follow-up" className="text-sm font-medium text-gray-700">
                  Follow-up appointment needed
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Any other important details..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingEntry(null);
                  resetForm();
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!formData.visit_date}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {editingEntry ? 'Update' : 'Add'} Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
