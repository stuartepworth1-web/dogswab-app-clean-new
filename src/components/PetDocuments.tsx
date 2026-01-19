import React, { useState, useEffect } from 'react';
import { Upload, FileText, X, Eye, Download, Plus } from 'lucide-react';

interface PetDocument {
  id: string;
  pet_id: string;
  document_type: 'medical_record' | 'vaccination' | 'lab_result' | 'prescription' | 'other';
  title: string;
  file_url: string;
  file_name: string;
  file_size: number;
  upload_date: string;
  notes?: string;
  extracted_data?: any;
}

interface Pet {
  id: string;
  name: string;
}

interface PetDocumentsProps {
  userId: string;
  pets: Pet[];
  isPremium: boolean;
}

export default function PetDocuments({ userId, pets, isPremium }: PetDocumentsProps) {
  const [documents, setDocuments] = useState<PetDocument[]>([]);
  const [selectedPet, setSelectedPet] = useState<string>('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    document_type: 'medical_record' as const,
    notes: '',
    file: null as File | null
  });

  const freeLimit = 3;
  const canUploadMore = isPremium || documents.filter(d => d.pet_id === selectedPet).length < freeLimit;

  useEffect(() => {
    if (selectedPet) {
      loadDocuments(selectedPet);
    }
  }, [selectedPet]);

  useEffect(() => {
    if (pets.length > 0 && !selectedPet) {
      setSelectedPet(pets[0].id);
    }
  }, [pets]);

  const loadDocuments = async (petId: string) => {
    const storedDocs = localStorage.getItem(`pet_documents_${petId}`);
    if (storedDocs) {
      setDocuments(JSON.parse(storedDocs));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      setUploadForm({ ...uploadForm, file });
    }
  };

  const handleUpload = async () => {
    if (!uploadForm.file || !uploadForm.title || !selectedPet) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = () => {
        const newDocument: PetDocument = {
          id: Date.now().toString(),
          pet_id: selectedPet,
          document_type: uploadForm.document_type,
          title: uploadForm.title,
          file_url: reader.result as string,
          file_name: uploadForm.file!.name,
          file_size: uploadForm.file!.size,
          upload_date: new Date().toISOString(),
          notes: uploadForm.notes,
          extracted_data: {}
        };

        const updatedDocs = [...documents, newDocument];
        setDocuments(updatedDocs);
        localStorage.setItem(`pet_documents_${selectedPet}`, JSON.stringify(updatedDocs));

        setShowUploadModal(false);
        setUploadForm({ title: '', document_type: 'medical_record', notes: '', file: null });
      };
      reader.readAsDataURL(uploadForm.file);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const deleteDocument = (docId: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      const updatedDocs = documents.filter(d => d.id !== docId);
      setDocuments(updatedDocs);
      localStorage.setItem(`pet_documents_${selectedPet}`, JSON.stringify(updatedDocs));
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const petDocuments = documents.filter(d => d.pet_id === selectedPet);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pet Documents</h2>
          <p className="text-gray-600 mt-1">
            Upload and manage your pet's medical records, vaccination certificates, and more
          </p>
        </div>
        <button
          onClick={() => canUploadMore ? setShowUploadModal(true) : alert('Upgrade to Premium for unlimited document uploads')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Upload Document
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
            <strong>Free Plan:</strong> {petDocuments.length}/{freeLimit} documents used.
            <button className="ml-2 text-amber-900 underline font-medium">
              Upgrade to Premium
            </button> for unlimited document storage.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {petDocuments.map(doc => (
          <div
            key={doc.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{doc.title}</h3>
                  <span className="text-xs text-gray-500 capitalize">
                    {doc.document_type.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <button
                onClick={() => deleteDocument(doc.id)}
                className="text-gray-400 hover:text-red-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>File:</strong> {doc.file_name}</p>
              <p><strong>Size:</strong> {formatFileSize(doc.file_size)}</p>
              <p><strong>Uploaded:</strong> {new Date(doc.upload_date).toLocaleDateString()}</p>
              {doc.notes && (
                <p className="text-gray-700"><strong>Notes:</strong> {doc.notes}</p>
              )}
            </div>

            <div className="flex gap-2 mt-4">
              <a
                href={doc.file_url}
                download={doc.file_name}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </a>
              <a
                href={doc.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Eye className="w-4 h-4" />
                View
              </a>
            </div>
          </div>
        ))}

        {petDocuments.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>No documents uploaded yet</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Upload your first document
            </button>
          </div>
        )}
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Upload Document</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Title
                </label>
                <input
                  type="text"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Annual Checkup 2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Type
                </label>
                <select
                  value={uploadForm.document_type}
                  onChange={(e) => setUploadForm({ ...uploadForm, document_type: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="medical_record">Medical Record</option>
                  <option value="vaccination">Vaccination Certificate</option>
                  <option value="lab_result">Lab Result</option>
                  <option value="prescription">Prescription</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={uploadForm.notes}
                  onChange={(e) => setUploadForm({ ...uploadForm, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add any additional notes..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select File (Max 10MB)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    {uploadForm.file ? (
                      <div>
                        <p className="text-gray-900 font-medium">{uploadForm.file.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(uploadForm.file.size)}</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-700 font-medium">Click to upload</p>
                        <p className="text-sm text-gray-500">PDF, JPG, PNG, DOC (Max 10MB)</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!uploadForm.file || !uploadForm.title || uploading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
