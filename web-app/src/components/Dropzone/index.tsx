import React from 'react';
import { useDropzone } from 'react-dropzone';

//UI
import './styles.css';
import { FiUpload } from 'react-icons/fi';

//STATIC
import { textLabels } from '../../static/textLabels';

interface DropzoneProps {
  onFileUploaded: (file: File) => void;
}

const Dropzone: React.FC<DropzoneProps> = ({ onFileUploaded }) => {
  const [selectedFileURL, setSelectedFileURL] = React.useState('');

  const onDrop = React.useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const fileURL = URL.createObjectURL(file);

      setSelectedFileURL(fileURL);
      onFileUploaded(file);
    },
    [onFileUploaded]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
  });
  const { createPoint } = textLabels;

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} accept="image/*" />
      {selectedFileURL ? (
        <img src={selectedFileURL} alt="Point thumbnail" />
      ) : (
        <p>
          <FiUpload />
          {createPoint.dropzone}
        </p>
      )}
    </div>
  );
};

export default Dropzone;
