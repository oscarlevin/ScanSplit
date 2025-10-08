#!/usr/bin/env python3
"""
Generate a simple test PDF with 5 pages, each containing a student name at the top.
This is used for testing the PDF splitting functionality.
"""

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

def create_test_pdf(filename):
    """Create a PDF with 5 pages, each with a student name at the top."""
    
    # Student names to use for each page
    student_names = [
        "Alice Johnson",
        "Bob Smith",
        "Charlie Davis",
        "Diana Martinez",
        "Ethan Wilson"
    ]
    
    # Create the PDF
    c = canvas.Canvas(filename, pagesize=letter)
    width, height = letter
    
    for i, name in enumerate(student_names, start=1):
        # Add student name at the top of the page
        c.setFont("Helvetica-Bold", 16)
        c.drawString(72, height - 72, f"Student Name: {name}")
        
        # Add page number
        c.setFont("Helvetica", 10)
        c.drawString(72, height - 100, f"Page {i} of {len(student_names)}")
        
        # Add some additional content to make it look more realistic
        c.setFont("Helvetica", 12)
        y_position = height - 140
        c.drawString(72, y_position, "Test Exam")
        y_position -= 30
        c.drawString(72, y_position, "Score: ______ / 100")
        y_position -= 40
        c.drawString(72, y_position, "Problem 1: ______________________________________")
        y_position -= 30
        c.drawString(72, y_position, "Problem 2: ______________________________________")
        y_position -= 30
        c.drawString(72, y_position, "Problem 3: ______________________________________")
        
        # Move to next page (except on the last page)
        if i < len(student_names):
            c.showPage()
    
    # Save the PDF
    c.save()
    print(f"Test PDF created successfully: {filename}")

if __name__ == "__main__":
    output_file = "test-data/test_students.pdf"
    create_test_pdf(output_file)
