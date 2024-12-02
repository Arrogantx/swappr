import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Shield } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { submitIdentityVerification, submitSkillVerification } from '../../services/verificationService';
import { toast } from 'sonner';

interface VerificationModalProps {
  type: 'identity' | 'skill';
  skillId?: string;
  onClose: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  type,
  skillId,
  onClose,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) return;

    setIsLoading(true);
    try {
      if (type === 'identity') {
        await submitIdentityVerification(files);
      } else if (skillId) {
        await submitSkillVerification(skillId, files);
      }
      toast.success('Verification documents submitted successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to submit verification documents');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg w-full max-w-md p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-bold">
            {type === 'identity' ? 'Identity Verification' : 'Skill Verification'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
              className="hidden"
              id="file-upload"
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                Click to upload verification documents
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: PDF, JPG, PNG
              </p>
            </label>
          </div>

          {files.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Selected files:
              </p>
              <ul className="space-y-1">
                {files.map((file, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    {file.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={files.length === 0}
            >
              Submit for Verification
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};