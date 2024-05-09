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

async function embedAndPlacePage(output_pdf, original_page, i, total_pages){
  const embeddedPage = await output_pdf.embedPage(original_page)
  console.log("Embedding page "+i+" / "+total_pages)
  // see library documentation: https://pdf-lib.js.org/docs/api/classes/pdfdocument#addpage
  const newPage = output_pdf.addPage([original_page.getWidth(),original_page.getHeight()])
  const x = parseInt(document.getElementById('page_translate_x_pts').value);
  const y = parseInt(document.getElementById('page_translate_y_pts').value);
  const scale = parseInt(document.getElementById('page_scale').value);
  const rotationDegrees = parseInt(document.getElementById('page_rotation_degrees').value);
  const transform = {
    x: x,
    y: y,
    xScale: scale,
    yScale: scale,
    rotate: PDFLib.degrees(0)
  };
  console.log("using this transform: ", transform);

  // see library documentation: https://pdf-lib.js.org/docs/api/classes/pdfpage#drawpage
  newPage.drawPage(embeddedPage, transform);

  
  // add further mark up here
  // newPage.drawLine({
  //   start: { x: 25, y: 75 },
  //   end: { x: 125, y: 175 },
  //   thickness: 2,
  //   color: PDFLib.rgb(0.75, 0.2, 0.2),
  //   opacity: 0.75,
  // })
}

async function render(input) {
  const original_pdf = await PDFLib.PDFDocument.load(input);
  const new_pdf = await PDFLib.PDFDocument.create()
  const pages = original_pdf.getPages()
  await Promise.all(pages.map((sourcePdfPage,i) => embedAndPlacePage(new_pdf, sourcePdfPage, i, pages.length)));
  const savePdf  = document.getElementById('pdf_download').checked
  if (savePdf) 
    makeTheZip(new_pdf)
  else
    showPreview(new_pdf)
}

async function openpdf(file) {
  const input_file_name = file.name;
  const input = await file.arrayBuffer();
  window.userGivenInput = input
  render(input);
}

function handleFileChange(e) {
  const fileList = e.target.files;
  if (fileList.length > 0) {
    const updated = openpdf(fileList[0]);
  }
}

function rerender() {
  const input = window.userGivenInput;
  if (input == undefined) {
    console.log("No file");
    return;
  }
  render(input);
}


async function makeTheZip(pdfToSave) {
  let zip = new JSZip();
  await pdfToSave.save().then(pdfBytes => {
    zip.file('result_file.pdf', pdfBytes);
  });
  zip.generateAsync({ type: "blob" }).then(blob => {
    saveAs(blob, "the_result.zip");
  });
}


const fileInput = document.getElementById('input_file');
const rerenderButton = document.getElementById('rerender_btn');


fileInput.addEventListener('change', (e) => {
  handleFileChange(e);
});
rerenderButton.addEventListener('click', (e) => {
  rerender();
});
