import { useRef } from 'react'

interface PDFUploaderProps {
  onPDFLoaded: (file: File) => void
}

function PDFUploader({ onPDFLoaded }: PDFUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      onPDFLoaded(file)
    } else {
      alert('Please select a valid PDF file')
    }
  }

  return (
    <div className="uploader">
      <h2>Step 2: Upload PDF</h2>
      <p>Upload the multi-page PDF to split</p>
      <input
        type="file"
        accept=".pdf"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="file-input"
      />
    </div>
  )
}

export default PDFUploader
