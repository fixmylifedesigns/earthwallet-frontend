import React, { useState, useRef } from 'react';
import { Upload, Camera, AlertCircle, CheckCircle } from 'lucide-react';

const BottleDetector = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setIsUploading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('https://earthwalletapi.onrender.com/detect-bottles', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Detection failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Camera className="w-6 h-6 md:w-8 md:h-8" />
          Bottle Detection
        </h2>
        <p className="text-gray-600 text-sm md:text-base">Upload an image to detect bottles using AI</p>
      </div>

      {/* Main Content - Mobile: Stack, Desktop: Side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Upload and Visualization */}
        <div className="space-y-6">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 md:p-8 text-center cursor-pointer transition-colors ${
              dragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={triggerFileInput}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />
            
            <Upload className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg md:text-xl font-medium text-gray-700 mb-2">
              Drop an image here or click to upload
            </p>
            <p className="text-sm text-gray-500">
              Supports JPG, PNG, WEBP (max 10MB)
            </p>
          </div>

          {/* Loading State */}
          {isUploading && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                Analyzing image...
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-4 bg-red-100 border border-red-300 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-red-700 text-sm md:text-base">{error}</span>
            </div>
          )}

          {/* Visualization */}
          {result && result.visualization && (
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 border-b">
                <h3 className="font-semibold text-gray-800">Detection Results</h3>
              </div>
              <div className="p-4">
                <img
                  src={`data:image/jpeg;base64,${result.visualization}`}
                  alt="Bottle detection results"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Results and Details */}
        <div className="space-y-6">
          {/* Bottle Count */}
          {result && (
            <div className="bg-green-100 border border-green-300 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-800">Detection Complete</span>
              </div>
              <div className="text-2xl md:text-3xl font-bold text-green-800 mb-1">
                {result.bottle_count} bottle{result.bottle_count !== 1 ? 's' : ''} detected
              </div>
              {result.avg_confidence > 0 && (
                <div className="text-sm text-green-700">
                  Average confidence: {result.avg_confidence}%
                </div>
              )}
              {result.method && (
                <div className="text-xs text-green-600 mt-1">
                  Detection method: {result.method}
                </div>
              )}
            </div>
          )}

          {/* Detection Details */}
          {result && result.detections && result.detections.length > 0 && (
            <div className="border border-gray-300 rounded-lg">
              <div className="bg-gray-100 px-4 py-2 border-b">
                <h3 className="font-semibold text-gray-800">Detection Details</h3>
              </div>
              <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
                {result.detections.map((detection, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-700 truncate">
                        Bottle {index + 1}: {detection.class}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Position: {detection.box[0]}, {detection.box[1]} | Size: {detection.box[2]}×{detection.box[3]}
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <span className="text-sm font-medium text-gray-600">
                        {detection.confidence}%
                      </span>
                      <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
                        <div 
                          className="h-2 bg-green-500 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(detection.confidence, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Statistics Panel */}
          {result && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-3">Detection Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {result.bottle_count}
                  </div>
                  <div className="text-xs text-blue-700">Total Found</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {result.avg_confidence || 0}%
                  </div>
                  <div className="text-xs text-blue-700">Avg Confidence</div>
                </div>
              </div>
              {result.timestamp && (
                <div className="mt-3 text-xs text-blue-600">
                  Processed: {new Date(result.timestamp).toLocaleString()}
                </div>
              )}
            </div>
          )}

          {/* Help Text */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Tips for Better Detection</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Use clear, well-lit images</li>
              <li>• Make sure bottles are visible and not overlapping</li>
              <li>• Include the entire bottle in the frame</li>
              <li>• Works best with plastic and glass bottles</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottleDetector;