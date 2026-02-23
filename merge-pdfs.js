const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function mergePdfs() {
  try {
    const configPath = path.join(__dirname, 'files-to-merge.json');
    if (!fs.existsSync(configPath)) {
      console.error('Error: files-to-merge.json not found');
      return;
    }

    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const { files, output: configOutput } = config;

    // Check for output file as a command-line parameter
    const cliOutput = process.argv[2];
    const finalOutputName = cliOutput || configOutput || 'Merged_Output.pdf';

    if (!files || !Array.isArray(files) || files.length === 0) {
      console.error('Error: No files specified in config');
      return;
    }

    const mergedPdf = await PDFDocument.create();

    for (const fileName of files) {
      const filePath = path.join(__dirname, fileName);
      if (!fs.existsSync(filePath)) {
        console.warn(`Warning: File not found, skipping: ${fileName}`);
        continue;
      }

      console.log(`Processing ${fileName}...`);
      const fileBytes = fs.readFileSync(filePath);
      const extension = path.extname(fileName).toLowerCase();

      if (extension === '.pdf') {
        const pdf = await PDFDocument.load(fileBytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      } else if (['.jpg', '.jpeg', '.png'].includes(extension)) {
        let image;
        if (extension === '.png') {
          image = await mergedPdf.embedPng(fileBytes);
        } else {
          image = await mergedPdf.embedJpg(fileBytes);
        }

        const { width, height } = image.scale(1);
        const page = mergedPdf.addPage([width, height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: width,
          height: height,
        });
      } else {
        console.warn(`Warning: Unsupported file type, skipping: ${fileName}`);
      }
    }

    const outputPath = path.isAbsolute(finalOutputName)
      ? finalOutputName
      : path.join(__dirname, finalOutputName);

    const mergedPdfBytes = await mergedPdf.save();
    fs.writeFileSync(outputPath, mergedPdfBytes);

    console.log(`Successfully created: ${outputPath}`);
  } catch (error) {
    console.error('Error merging files:', error);
  }
}

mergePdfs();
