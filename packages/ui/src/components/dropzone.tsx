import React, { useRef, useState } from 'react';
import { Card, CardContent } from './card';
import { Button } from './button';

// Define the props expected by the Dropzone component
interface DropzoneProps {
  onChange: (files: { name: string; url: string }[]) => void;
  maxFiles?: number;
  className?: string;
  fileExtensions?: string[];
  maxFileSize?: number;
}

// Create the Dropzone component receiving props
export function Dropzone({
  onChange,
  className,
  fileExtensions = [],
  ...props
}: DropzoneProps) {
  // Initialize state variables using the useState hook
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Reference to file input element
  const [fileInfo, setFileInfo] = useState<string | null>(null); // Information about the uploaded file
  const [error, setError] = useState<string | null>(null); // Error message state

  // Function to handle drag over event
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Function to handle drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const { files } = e.dataTransfer;
    handleFiles(files);
  };

  // Function to handle file input change event
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files) {
      handleFiles(files);
    }
  };

  // Function to handle processing of uploaded files
  const handleFiles = (files: FileList) => {
    if (files.length !== 1) {
      setError(
        `Invalid number of files. Expected: 1, Received: ${files.length}`
      );
      return;
    }

    const uploadedFile = files[0];
    const uploadedFileExtension = uploadedFile.name.split('.').pop() ?? 'n/a';

    // Check file extension
    // .&& !uploadedFile.name.endsWith(`.${fileExtension}
    if (
      fileExtensions.length > 0 &&
      fileExtensions.includes(uploadedFileExtension)
    ) {
      setError(
        `Invalid file type. Expected: one of ${fileExtensions
          .map((e) => `.${e}`)
          .join(', ')}`
      );
      return;
    }

    const fileSizeInMb =
      Math.round((uploadedFile.size / (1024 * 1024)) * 100) / 100;

    if (fileSizeInMb > (props.maxFileSize ?? 10)) {
      setError(
        `File size exceeds the maximum limit of ${props.maxFileSize ?? 10} MB`
      );
      return;
    }

    const fileList = Array.from(files).map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    onChange(fileList);

    // Display file information
    setFileInfo(`Uploaded file: ${uploadedFile.name} (${fileSizeInMb} MB)`);
    setError(null); // Reset error state
  };

  // Function to simulate a click on the file input element
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Card
      className={`border-2 border-dashed bg-muted hover:cursor-pointer hover:border-muted-foreground/50 ${className}`}
      {...props}
    >
      <CardContent
        className='flex flex-col items-center justify-center space-y-2 px-2 py-4 text-xs'
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <div className='flex items-center justify-center text-muted-foreground'>
          <span className='font-medium'>Drag Files to Upload or</span>
          <Button
            variant='ghost'
            size='sm'
            className='ml-auto flex h-8 space-x-2 px-0 pl-1 text-xs'
          >
            Click Here
          </Button>
          <input
            ref={fileInputRef}
            type='file'
            accept={fileExtensions.length > 0 ? fileExtensions.join(', ') : ''} // Set accepted file type
            onChange={handleFileInputChange}
            className='hidden'
            multiple
          />
        </div>
        {fileInfo && <p className='text-muted-foreground'>{fileInfo}</p>}
        {error && <span className='text-red-500'>{error}</span>}
      </CardContent>
    </Card>
  );
}
