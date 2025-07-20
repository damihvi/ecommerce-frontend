import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { uploadAPI, productsAPI } from '../services/api';

export interface ImageUploadProps {
  onImageUploaded?: (imageUrl: string) => void;
  currentImageUrl?: string;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUploaded,
  currentImageUrl,
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update preview when currentImageUrl changes
  useEffect(() => {
    if (currentImageUrl) {
      // If it's a backend image path, construct the full URL
      if (currentImageUrl && !currentImageUrl.startsWith('http') && !currentImageUrl.startsWith('blob:')) {
        setPreview(productsAPI.getImageUrl(currentImageUrl));
      } else {
        setPreview(currentImageUrl);
      }
    } else {
      setPreview(null);
    }
  }, [currentImageUrl]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('El archivo es demasiado grande. Máximo 5MB permitido');
      return;
    }

    try {
      setIsUploading(true);
      
      // Create preview immediately for better UX
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Try to upload to backend, but fallback gracefully if endpoint doesn't exist
      try {
        const response = await uploadAPI.uploadImage(file);
        
        // Handle different possible response structures
        const imageUrl = response.data.imageUrl || response.data.data?.imageUrl || response.data.filename;
        
        if (imageUrl) {
          // Update the form with the backend image path
          onImageUploaded?.(imageUrl);
          toast.success('Imagen subida al servidor');
          
          // Update preview to show the backend image
          setPreview(productsAPI.getImageUrl(imageUrl));
          return;
        }
      } catch (uploadError) {
        console.log('Backend upload not available, using local storage fallback');
        
        // Use local storage fallback
        try {
          const localResponse = await uploadAPI.uploadImageLocal(file) as any;
          const localImageUrl = localResponse.data.imageUrl;
          
          onImageUploaded?.(localImageUrl);
          toast.success('Imagen guardada localmente (backend no disponible)');
          // Keep the current preview from FileReader
          return;
        } catch (localError) {
          console.log('Local storage failed, using filename fallback');
        }
      }
      
      // Fallback: Use local file storage until backend endpoint is ready
      const localImageUrl = file.name.replace(/\s+/g, '-').toLowerCase();
      onImageUploaded?.(localImageUrl);
      toast.success('Imagen cargada (modo local)');
      
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error al procesar la imagen');
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageUploaded?.('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-gray-400">
          {preview ? (
            <div className="relative w-full h-full">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click para subir</span> o arrastra y suelta
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF hasta 5MB
              </p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isUploading}
          />
        </label>
      </div>
      
      {isUploading && (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
          <span className="ml-2 text-sm text-gray-600">Subiendo imagen...</span>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;