import { useRef } from 'react'
import Papa from 'papaparse'

interface CSVUploaderProps {
  onStudentsLoaded: (students: string[]) => void
}

function CSVUploader({ onStudentsLoaded }: CSVUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    Papa.parse(file, {
      complete: (results) => {
        // Extract student names from CSV
        // Assumes first column contains names, skip header if present
        const data = results.data as string[][]
        const names = data
          .slice(1) // Skip header row
          .map(row => row[0])
          .filter(name => name && name.trim() !== '')
          .map(name => name.trim())
        
        if (names.length > 0) {
          onStudentsLoaded(names)
        } else {
          alert('No valid student names found in CSV file')
        }
      },
      error: (error) => {
        console.error('Error parsing CSV:', error)
        alert('Error parsing CSV file. Please check the file format.')
      }
    })
  }

  return (
    <div className="uploader">
      <h2>Step 1: Upload Student List</h2>
      <p>Upload a CSV file with student names (first column, with header)</p>
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="file-input"
      />
    </div>
  )
}

export default CSVUploader
