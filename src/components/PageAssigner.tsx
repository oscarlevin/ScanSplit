import { useState, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import type { PageAssignment } from '../App'
import StudentSelector from './StudentSelector'

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

interface PageAssignerProps {
  pdfFile: File
  pageCount: number
  students: string[]
  assignments: PageAssignment[]
  onAssignmentChange: (pageNumber: number, studentName: string) => void
}

function PageAssigner({ 
  pdfFile, 
  pageCount, 
  students, 
  assignments, 
  onAssignmentChange 
}: PageAssignerProps) {
  const [pdfUrl, setPdfUrl] = useState<string>('')

  useEffect(() => {
    const url = URL.createObjectURL(pdfFile)
    setPdfUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [pdfFile])

  return (
    <div className="page-assigner">
      <h2>Step 3: Assign Pages to Students</h2>
      <p>Review the top portion of each page and assign it to a student</p>
      
      <div className="pages-grid">
        {Array.from({ length: pageCount }, (_, i) => {
          const pageNumber = i + 1
          const assignment = assignments.find(a => a.pageNumber === pageNumber)
          
          return (
            <div key={pageNumber} className="page-item">
              <div className="page-header">
                <strong>Page {pageNumber}</strong>
              </div>
              
              <div className="page-preview">
                <Document file={pdfUrl} loading={<div>Loading...</div>}>
                  <Page 
                    pageNumber={pageNumber}
                    width={300}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    // Show only top portion (approximately 1 inch at 72 DPI = 72 pixels)
                    // We'll crop using CSS
                  />
                </Document>
              </div>

              <div className="student-selector">
                <StudentSelector
                  students={students}
                  selectedStudent={assignment?.studentName || ''}
                  onSelect={(name) => onAssignmentChange(pageNumber, name)}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PageAssigner
