import { motion, AnimatePresence } from 'framer-motion'

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function DeleteConfirmationModal({ isOpen, onCancel, onConfirm }: DeleteConfirmationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-md p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900">Delete Project</h2>
            <p className="mt-2 text-sm text-gray-600">Are you sure you want to delete this project? This action cannot be undone.</p>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}