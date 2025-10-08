import { useState, useEffect, useRef } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import type { PDFDocumentProxy } from 'pdfjs-dist'
import type { PageAssignment } from '../App'
import StudentSelector from './StudentSelector'

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

interface PageAssignerProps {
  pdfFile: File
  pageCount: number
  students: string[]
  assignments: PageAssignment[]
  onAssignmentChange: (pageNumber: number, studentName: string) => void
}

interface PDFPagePreviewProps {
  pdf: PDFDocumentProxy
  pageNumber: number
}

function PDFPagePreview({ pdf, pageNumber }: PDFPagePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [error, setError] = useState<string | null>(null)
  const renderTaskRef = useRef<{ cancel: () => void; promise: Promise<void> } | null>(null)

  useEffect(() => {
    const loadPage = async () => {
      try {
        // Cancel any previous render task
        if (renderTaskRef.current) {
          renderTaskRef.current.cancel()
        }

        const page = await pdf.getPage(pageNumber)
        
        if (!canvasRef.current) return
        
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        if (!context) return

        // Set scale to fit width of 300px
        const viewport = page.getViewport({ scale: 1 })
        const scale = 300 / viewport.width
        const scaledViewport = page.getViewport({ scale })
        
        canvas.height = 120 // Show only top ~1 inch
        canvas.width = scaledViewport.width

        renderTaskRef.current = page.render({
          canvasContext: context,
          viewport: scaledViewport,
          canvas: canvas
        })
        
        await renderTaskRef.current.promise
        renderTaskRef.current = null
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'RenderingCancelledException') {
          console.error('Error loading PDF page:', err)
          setError('Failed to load page')
        }
      }
    }

    loadPage()

    return () => {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel()
      }
    }
  }, [pdf, pageNumber])

  if (error) {
    return <div>{error}</div>
  }

  return <canvas ref={canvasRef} />
}

function PageAssigner({ 
  pdfFile, 
  pageCount, 
  students, 
  assignments, 
  onAssignmentChange 
}: PageAssignerProps) {
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null)

  useEffect(() => {
    const loadPDF = async () => {
      try {
        const arrayBuffer = await pdfFile.arrayBuffer()
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
        setPdfDoc(pdf)
      } catch (err) {
        console.error('Error loading PDF:', err)
      }
    }

    loadPDF()
  }, [pdfFile])

  if (!pdfDoc) {
    return <div>Loading PDF...</div>
  }

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
                <PDFPagePreview pdf={pdfDoc} pageNumber={pageNumber} />
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
