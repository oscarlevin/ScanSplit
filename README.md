# ScanSplit

A web application for splitting multi-page PDF scans by assigning each page to a student. Perfect for processing scanned exams or assignments for upload to an LMS.

## Features

- **CSV Student List**: Upload a CSV file containing student names (stored in localStorage for convenience)
- **PDF Upload**: Load multi-page PDF files
- **Page Preview**: View the top portion (~1 inch) of each PDF page
- **Predictive Search**: Quickly assign pages to students with intelligent search/filtering
- **Automatic Splitting**: Generate individual PDF files for each student
- **Batch Download**: Download all split PDFs at once

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/oscarlevin/ScanSplit.git
cd ScanSplit
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

### Step 1: Upload Student List

Create a CSV file with student names in the first column. The first row should be a header (e.g., "Name").

Example CSV:
```csv
Name
Alice Johnson
Bob Smith
Charlie Brown
```

Upload this file using the "Choose File" button in Step 1. The student names will be saved to your browser's localStorage.

### Step 2: Upload PDF

Select the multi-page PDF file you want to split. The application will load and display the total number of pages.

### Step 3: Assign Pages to Students

For each page:
1. Review the preview showing the top portion of the page
2. Click in the student name field
3. Type to search or select from the dropdown list
4. The selected student name will be assigned to that page

### Step 4: Split and Download

Once all pages are assigned, click "Split PDF and Download". Individual PDF files will be automatically downloaded for each student, with filenames based on their names.

## Technologies Used

- **Vite**: Build tool and development server
- **React**: UI framework with TypeScript
- **pdf-lib**: PDF manipulation and splitting
- **pdfjs-dist**: PDF rendering for previews
- **papaparse**: CSV parsing

## License

MIT License - see LICENSE file for details
