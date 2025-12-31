'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/lib/toastContext';
import type { Receipt } from '@/lib/store';

export default function ReceiptsPage() {
  const router = useRouter();
  const { success, error: showError, info } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [showExtractedData, setShowExtractedData] = useState(false);

  const user = useAppStore((state) => state.user);
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const receipts = useAppStore((state) => state.receipts);
  const setReceipts = useAppStore((state) => state.setReceipts);
  const addReceipt = useAppStore((state) => state.addReceipt);
  const removeReceipt = useAppStore((state) => state.removeReceipt);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    const loadReceipts = async () => {
      if (user?.uid) {
        try {
          // Receipts are stored locally in Zustand store
          // No Firebase loading needed
          setIsLoading(false);
        } catch (error) {
          console.error('Error loading receipts:', error);
          setIsLoading(false);
        }
      }
    };

    loadReceipts();
  }, [user, isAuthenticated, router, setReceipts]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    try {
      // Mock OCR extraction (in production, use Tesseract.js or API)
      const extractedData = await mockOCRExtraction(file);

      // Save receipt to local store
      const receiptId = Date.now().toString();

      addReceipt({
        id: receiptId,
        fileName: file.name,
        fileUrl: URL.createObjectURL(file),
        uploadedAt: new Date(),
        extractedData,
        status: 'processed',
        createdAt: new Date(),
      });

      success('Receipt uploaded and processed successfully!');
    } catch (error) {
      console.error('Error uploading receipt:', error);
      showError('Error uploading receipt. Please try again.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const mockOCRExtraction = async (file: File): Promise<Receipt['extractedData']> => {
    // Mock OCR extraction - in production, use Tesseract.js
    // For now, return mock data
    return {
      amount: Math.floor(Math.random() * 5000) + 100,
      date: new Date(),
      merchant: 'Sample Merchant',
      category: 'Food',
      description: 'Receipt from ' + file.name,
      confidence: 0.85,
    };
  };

  const handleDeleteReceipt = async (receiptId: string) => {
    if (!user) return;

    try {
      // Just remove from local store
      removeReceipt(receiptId);
      success('Receipt deleted successfully');
    } catch (error) {
      console.error('Error deleting receipt:', error);
      showError('Error deleting receipt');
    }
  };

  const handleUseExtractedData = async (receipt: Receipt) => {
    // This would typically navigate to the expense form with pre-filled data
    // For now, just show a message
    info(
      `Using extracted data:\nAmount: ₹${receipt.extractedData?.amount}\nMerchant: ${receipt.extractedData?.merchant}`
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-2xl md:text-2xl font-bold text-white">📸 Receipt Scanning</h1>
          <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg transition font-semibold cursor-pointer whitespace-nowrap text-sm md:text-base">
            + Upload Receipt
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
            />
          </label>
        </div>

        {/* Info Card */}
        <div className="bg-blue-900 border border-blue-700 rounded-lg p-4 mb-8 text-blue-100">
          <p className="text-sm">
            💡 Upload receipt images to automatically extract expense details like amount, date, and
            merchant. The extracted data can be used to quickly create expenses.
          </p>
        </div>

        {/* Receipts Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {isLoading ? (
            <div className="col-span-full bg-slate-700 rounded-lg p-8 text-center text-slate-300">
              <p className="text-lg">Loading receipts...</p>
            </div>
          ) : receipts.length === 0 ? (
            <div className="col-span-full bg-slate-700 rounded-lg p-8 text-center text-slate-300">
              <p className="text-lg">No receipts yet</p>
              <p className="text-sm mt-2">Upload your first receipt to get started</p>
            </div>
          ) : (
            receipts.map((receipt) => (
              <div
                key={receipt.id}
                className="bg-slate-700 rounded-lg overflow-hidden hover:bg-slate-600 transition cursor-pointer"
                onClick={() => {
                  setSelectedReceipt(receipt);
                  setShowExtractedData(true);
                }}
              >
                {/* Receipt Image Preview */}
                <div className="bg-slate-800 h-32 md:h-40 flex items-center justify-center">
                  <img
                    src={receipt.fileUrl}
                    alt={receipt.fileName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23475569" width="100" height="100"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="12"%3E📄%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>

                {/* Receipt Info */}
                <div className="p-3 md:p-4">
                  <p className="font-semibold text-white truncate text-sm md:text-base">{receipt.fileName}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(receipt.uploadedAt).toLocaleDateString()}
                  </p>

                  {/* Extracted Data Preview */}
                  {receipt.extractedData && (
                    <div className="mt-2 md:mt-3 bg-slate-800 rounded p-2 text-xs text-slate-300">
                      <p>
                        💰 ₹{receipt.extractedData.amount || 'N/A'} •{' '}
                        {receipt.extractedData.merchant || 'N/A'}
                      </p>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="mt-2 md:mt-3 flex gap-2">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        receipt.status === 'processed'
                          ? 'bg-green-600 text-white'
                          : receipt.status === 'pending'
                          ? 'bg-yellow-600 text-white'
                          : 'bg-red-600 text-white'
                      }`}
                    >
                      {receipt.status}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="mt-2 md:mt-3 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUseExtractedData(receipt);
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs transition"
                    >
                      Use Data
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteReceipt(receipt.id);
                      }}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Receipt Detail Modal */}
      {showExtractedData && selectedReceipt && (
        <ReceiptDetailModal
          receipt={selectedReceipt}
          onClose={() => {
            setShowExtractedData(false);
            setSelectedReceipt(null);
          }}
          onUseData={handleUseExtractedData}
        />
      )}
    </main>
  );
}

// Receipt Detail Modal Component
function ReceiptDetailModal({
  receipt,
  onClose,
  onUseData,
}: {
  receipt: Receipt;
  onClose: () => void;
  onUseData: (receipt: Receipt) => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-4">Receipt Details</h2>

        {/* Receipt Image */}
        <div className="mb-6 bg-slate-700 rounded-lg overflow-hidden">
          <img
            src={receipt.fileUrl}
            alt={receipt.fileName}
            className="w-full h-auto max-h-96 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23475569" width="100" height="100"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="12"%3E📄%3C/text%3E%3C/svg%3E';
            }}
          />
        </div>

        {/* Extracted Data */}
        {receipt.extractedData && (
          <div className="bg-slate-700 rounded-lg p-4 mb-6 space-y-3">
            <h3 className="font-semibold text-white mb-3">Extracted Information</h3>

            <div>
              <label className="text-sm text-slate-300">Amount</label>
              <p className="text-xl font-bold text-white">₹{receipt.extractedData.amount || 'N/A'}</p>
            </div>

            <div>
              <label className="text-sm text-slate-300">Merchant</label>
              <p className="text-white">{receipt.extractedData.merchant || 'N/A'}</p>
            </div>

            <div>
              <label className="text-sm text-slate-300">Date</label>
              <p className="text-white">
                {receipt.extractedData.date
                  ? new Date(receipt.extractedData.date).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>

            <div>
              <label className="text-sm text-slate-300">Category</label>
              <p className="text-white">{receipt.extractedData.category || 'N/A'}</p>
            </div>

            <div>
              <label className="text-sm text-slate-300">Description</label>
              <p className="text-white">{receipt.extractedData.description || 'N/A'}</p>
            </div>

            <div>
              <label className="text-sm text-slate-300">Confidence</label>
              <div className="w-full bg-slate-600 rounded-full h-2 mt-1">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{
                    width: `${(receipt.extractedData.confidence || 0) * 100}%`,
                  }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {Math.round((receipt.extractedData.confidence || 0) * 100)}% confidence
              </p>
            </div>
          </div>
        )}

        {/* File Info */}
        <div className="bg-slate-700 rounded-lg p-4 mb-6">
          <p className="text-sm text-slate-300">
            <span className="font-semibold">File:</span> {receipt.fileName}
          </p>
          <p className="text-sm text-slate-300 mt-1">
            <span className="font-semibold">Uploaded:</span>{' '}
            {new Date(receipt.uploadedAt).toLocaleString()}
          </p>
          <p className="text-sm text-slate-300 mt-1">
            <span className="font-semibold">Status:</span>{' '}
            <span
              className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                receipt.status === 'processed'
                  ? 'bg-green-600 text-white'
                  : receipt.status === 'pending'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-red-600 text-white'
              }`}
            >
              {receipt.status}
            </span>
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="bg-slate-600 hover:bg-slate-500 text-white px-6 py-2 rounded-lg transition"
          >
            Close
          </button>
          <button
            onClick={() => {
              onUseData(receipt);
              onClose();
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition font-semibold"
          >
            Use This Data
          </button>
        </div>
      </div>
    </div>
  );
}
