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

async function openpdf(file) {
  const inputpdf = file.name;
  const input = await file.arrayBuffer();
  const currentdoc = await PDFLib.PDFDocument.load(input);
  // Do things here to mark up the PDF!
  showPreview(currentdoc)
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
