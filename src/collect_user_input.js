async function showPreview(resultPDF){
  console.log("I see PDF : ",resultPDF)
  const pdfDataUri = await resultPDF.saveAsBase64({ dataUri: true });
  const viewerPrefs = resultPDF.catalog.getOrCreateViewerPreferences();
  viewerPrefs.setHideToolbar(false);
  viewerPrefs.setHideMenubar(false);
  viewerPrefs.setHideWindowUI(false);
  viewerPrefs.setFitWindow(true);
  viewerPrefs.setCenterWindow(true);
  viewerPrefs.setDisplayDocTitle(true);
  const previewFrame = document.getElementById('pdf_preview');
  previewFrame.parentNode.style.display = '';
  previewFrame.src = pdfDataUri;
  window.scrollTo(0, document.body.scrollHeight);
}

async function embedAndPlacePage(output_pdf, original_page, i){
  const embeddedPage = await output_pdf.embedPage(original_page)
  // see library documentation: https://pdf-lib.js.org/docs/api/classes/pdfdocument#addpage
  const newPage = output_pdf.addPage([original_page.getWidth(),original_page.getHeight()])
  const x = 0;
  const y = 0;
  const scale = 1;
  // see library documentation: https://pdf-lib.js.org/docs/api/classes/pdfpage#drawpage
  newPage.drawPage(embeddedPage, { x: x, y: y, xScale: scale, yScale: scale});

  // add further mark up here
  newPage.drawLine({
    start: { x: 25, y: 75 },
    end: { x: 125, y: 175 },
    thickness: 2,
    color: PDFLib.rgb(0.75, 0.2, 0.2),
    opacity: 0.75,
  })
}

async function openpdf(file) {
  const input_file_name = file.name;
  const input = await file.arrayBuffer();
  const original_pdf = await PDFLib.PDFDocument.load(input);
  const new_pdf = await PDFLib.PDFDocument.create()
  await Promise.all(original_pdf.getPages().map((sourcePdfPage,i) => embedAndPlacePage(new_pdf, sourcePdfPage, i)));
  showPreview(new_pdf)
}

function handleFileChange(e) {
  const fileList = e.target.files;
  if (fileList.length > 0) {
    const updated = openpdf(fileList[0]);
  }
}

const fileInput = document.getElementById('input_file');

fileInput.addEventListener('change', (e) => {
  handleFileChange(e);
});
