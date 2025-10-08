import { useState, useRef, useEffect } from 'react'

interface StudentSelectorProps {
  students: string[]
  selectedStudent: string
  onSelect: (name: string) => void
}

function StudentSelector({ students, selectedStudent, onSelect }: StudentSelectorProps) {
  const [searchTerm, setSearchTerm] = useState(selectedStudent)
  const [isOpen, setIsOpen] = useState(false)
  const [filteredStudents, setFilteredStudents] = useState<string[]>([])
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSearchTerm(selectedStudent)
  }, [selectedStudent])

  useEffect(() => {
    if (searchTerm) {
      const filtered = students.filter(student =>
        student.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredStudents(filtered)
    } else {
      setFilteredStudents(students)
    }
  }, [searchTerm, students])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setIsOpen(true)
    setHighlightedIndex(-1)
  }

  const handleStudentSelect = (student: string) => {
    setSearchTerm(student)
    onSelect(student)
    setIsOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex(prev => 
        prev < filteredStudents.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0)
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault()
      handleStudentSelect(filteredStudents[highlightedIndex])
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  const handleFocus = () => {
    setIsOpen(true)
  }

  const handleBlur = (e: React.FocusEvent) => {
    // Delay to allow click on dropdown item
    setTimeout(() => {
      if (!dropdownRef.current?.contains(e.relatedTarget as Node)) {
        setIsOpen(false)
      }
    }, 200)
  }

  return (
    <div className="student-selector-wrapper">
      <input
        ref={inputRef}
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Search student name..."
        className="student-input"
      />
      
      {isOpen && filteredStudents.length > 0 && (
        <div ref={dropdownRef} className="student-dropdown">
          {filteredStudents.map((student, index) => (
            <div
              key={student}
              className={`student-option ${index === highlightedIndex ? 'highlighted' : ''} ${student === selectedStudent ? 'selected' : ''}`}
              onClick={() => handleStudentSelect(student)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {student}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default StudentSelector
