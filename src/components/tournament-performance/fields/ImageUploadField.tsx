
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, Link } from 'lucide-react';
import { TournamentPerformanceFormData } from '../TournamentPerformanceFormSchema';

interface ImageUploadFieldProps {
  form: UseFormReturn<TournamentPerformanceFormData>;
}

const ImageUploadField = ({ form }: ImageUploadFieldProps) => {
  const [uploadMode, setUploadMode] = useState<'upload' | 'url'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewUrl(result);
        // For now, we'll store the data URL in the form
        // In a real app, you'd upload to a storage service and get a URL back
        form.setValue('ft_photo_url', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (url: string) => {
    setPreviewUrl(url);
    form.setValue('ft_photo_url', url);
    setSelectedFile(null);
  };

  const currentValue = form.watch('ft_photo_url') || '';

  return (
    <FormField
      control={form.control}
      name="ft_photo_url"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Foto da Final Table</FormLabel>
          
          <div className="space-y-3">
            {/* Mode toggle buttons */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant={uploadMode === 'upload' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setUploadMode('upload')}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload
              </Button>
              <Button
                type="button"
                variant={uploadMode === 'url' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setUploadMode('url')}
                className="flex items-center gap-2"
              >
                <Link className="h-4 w-4" />
                URL
              </Button>
            </div>

            {/* Upload mode */}
            {uploadMode === 'upload' && (
              <div>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </FormControl>
                {selectedFile && (
                  <p className="text-sm text-gray-600 mt-1">
                    Arquivo selecionado: {selectedFile.name}
                  </p>
                )}
              </div>
            )}

            {/* URL mode */}
            {uploadMode === 'url' && (
              <FormControl>
                <Input
                  {...field}
                  type="url"
                  placeholder="https://exemplo.com/foto-ft.jpg"
                  onChange={(e) => handleUrlChange(e.target.value)}
                />
              </FormControl>
            )}

            {/* Preview */}
            {(previewUrl || currentValue) && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <div className="border rounded-lg p-2 bg-gray-50">
                  <img
                    src={previewUrl || currentValue}
                    alt="Preview da foto da FT"
                    className="max-w-full h-32 object-cover rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ImageUploadField;
