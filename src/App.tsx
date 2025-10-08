import { useState, useEffect } from 'react'
import './App.css'
import CSVUploader from './components/CSVUploader'
import PDFUploader from './components/PDFUploader'
import PageAssigner from './components/PageAssigner'
import { PDFDocument } from 'pdf-lib'

export interface PageAssignment {
  pageNumber: number;
  studentName: string;
}

function App() {
  const [students, setStudents] = useState<string[]>([])
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null)
  const [pageCount, setPageCount] = useState<number>(0)
  const [assignments, setAssignments] = useState<PageAssignment[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  // Load students from localStorage on mount
  useEffect(() => {
    const savedStudents = localStorage.getItem('studentNames')
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents))
    }
  }, [])

  const handleStudentsLoaded = (studentList: string[]) => {
    setStudents(studentList)
    localStorage.setItem('studentNames', JSON.stringify(studentList))
  }

  const handlePDFLoaded = async (file: File) => {
    setPdfFile(file)
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(arrayBuffer)
    setPdfDoc(pdf)
    const count = pdf.getPageCount()
    setPageCount(count)
    // Initialize assignments
    setAssignments(Array.from({ length: count }, (_, i) => ({
      pageNumber: i + 1,
      studentName: ''
    })))
  }

  const handleAssignmentChange = (pageNumber: number, studentName: string) => {
    setAssignments(prev => prev.map(a => 
      a.pageNumber === pageNumber ? { ...a, studentName } : a
    ))
  }

  const handleSplitPDF = async () => {
    if (!pdfDoc || !pdfFile) return
    
    setIsProcessing(true)
    try {
      // Group pages by student
      const studentPages: { [key: string]: number[] } = {}
      assignments.forEach(assignment => {
        if (assignment.studentName) {
          if (!studentPages[assignment.studentName]) {
            studentPages[assignment.studentName] = []
          }
          studentPages[assignment.studentName].push(assignment.pageNumber - 1)
        }
      })

      // Create PDFs for each student
      for (const [studentName, pageIndices] of Object.entries(studentPages)) {
        const newPdf = await PDFDocument.create()
        const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices)
        copiedPages.forEach(page => newPdf.addPage(page))
        
        const pdfBytes = await newPdf.save()
        const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${studentName.replace(/[^a-z0-9]/gi, '_')}.pdf`
        link.click()
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error splitting PDF:', error)
      alert('Error splitting PDF. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const allPagesAssigned = assignments.every(a => a.studentName !== '')

  return (
    <div className="app">
      <header>
        <h1>ScanSplit - PDF Page Splitter</h1>
        <p>Split a multi-page PDF by assigning each page to a student</p>
      </header>

      <main>
        <div className="upload-section">
          <CSVUploader onStudentsLoaded={handleStudentsLoaded} />
          {students.length > 0 && (
            <div className="info">
              ✓ {students.length} students loaded
            </div>
          )}
        </div>

        {students.length > 0 && (
          <div className="upload-section">
            <PDFUploader onPDFLoaded={handlePDFLoaded} />
            {pageCount > 0 && (
              <div className="info">
                ✓ PDF loaded with {pageCount} pages
              </div>
            )}
          </div>
        )}

        {pdfFile && pdfDoc && pageCount > 0 && (
          <>
            <PageAssigner
              pdfFile={pdfFile}
              pageCount={pageCount}
              students={students}
              assignments={assignments}
              onAssignmentChange={handleAssignmentChange}
            />

            <div className="action-section">
              <button
                onClick={handleSplitPDF}
                disabled={!allPagesAssigned || isProcessing}
                className="split-button"
              >
                {isProcessing ? 'Processing...' : 'Split PDF and Download'}
              </button>
              {!allPagesAssigned && (
                <p className="warning">Please assign all pages before splitting</p>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default App
