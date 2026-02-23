# UTP Validation PDF Merger

A Node.js tool to merge PDF documents and images into a single PDF file, specifically tailored for UTP validation processes.

## Features
- Merges multiple PDFs into one.
- Supports JPEG and PNG images (converts them as new pages in the PDF).
- Automated ordering based on file prefixes (`MAIN_`, `ITM_`, `CERTIFICATION_`, `LABORAL_`).

## Requirements
- Node.js (v24.7.0 or higher recommended)
- npm

## Usage
1. Name your files using the required prefixes and indices (e.g., `ITM_1_Calculo_Integral.pdf`).
2. Update the `files` array in `files-to-merge.json` with your filenames in the desired order.
3. Run the merge script:
```bash
node merge-pdfs.js
```

## Configuration
The `files-to-merge.json` file controls which files are merged and the name of the output file.

```json
{
  "files": [
    "MAIN_Solicitud.pdf",
    "ITM_1_File.pdf",
    ...
  ],
  "output": "UTP_Validation_Final.pdf"
}
```
