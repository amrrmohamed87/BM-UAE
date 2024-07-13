import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";

export const exportToExcel = (formatDataForExcel, filename = "table-data") => {
  const workSheet = formatDataForExcel();
  const convertToExcelData = XLSX.utils.json_to_sheet(workSheet);
  const workBook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workBook, convertToExcelData, filename);

  const excelBuffer = XLSX.write(workBook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });

  saveAs(blob, `${filename}.xlsx`);
};

export const exportToPDF = (data, columns, filename = "table-data") => {
  const pdfDocument = new jsPDF();

  pdfDocument.autoTable({
    head: [columns],
    body: data.map((row) => columns.map((col) => row[col])),
  });

  pdfDocument.save(`${filename}.pdf`);
};
