import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "../assets/logoIcon.png";

const getMonthName = (monthIndex) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames[monthIndex];
};

const getCurrentDate = () => {
  const todaysDate = new Date();
  return `${todaysDate.getDate()} of ${getMonthName(
    todaysDate.getMonth()
  )}, ${todaysDate.getFullYear()}`;
};

const getOrderNumber = () => {
  const index = parseInt(localStorage.getItem("orderNumber") || "0", 10) + 1;
  localStorage.setItem("orderNumber", index.toString());
  return `POBMI-CAP-${index}-24`;
};

export const printPO = (data, columns) => {
  const doc = new jsPDF();
  const date = getCurrentDate();
  const orderNumber = getOrderNumber();

  //--------------------------------------

  doc.addImage(logo, "PNG", 12, 10, 60, 20);

  doc.setFontSize(12);
  doc.text(`Date: ${date}`, 12, 40);

  // Set font to bold
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Purchase Order", 105, 50, { align: "center" });

  // Draw underline
  const textWidth = doc.getTextWidth("Purchase Order");
  const startXX = 105 - textWidth / 2;
  const endX = startXX + textWidth;
  doc.setDrawColor(0); // Black color
  doc.line(startXX, 52, endX, 52); // Underline position, adjust the y-coordinate as needed

  // Reset font style for other text
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Purchase Order Number: ${orderNumber}`, 130, 57, { align: "left" });

  doc.setFontSize(14);
  // Position for the text, adjusted to fit within the box
  // Basic setup
  const startX = 5; // Starting X position for the boxes
  const startY = 60; // Starting Y position for the boxes
  const boxWidth = 100; // Width of each box
  const boxHeight = 15; // Height of each box

  //------------------------------------------------

  // Draw boxes and add text
  // To Boxes
  // Set font for text inside boxes
  doc.setFontSize(12);

  doc.rect(startX + boxWidth, startY, boxWidth, boxHeight); // First box
  doc.text(
    "To: College of American Pathologists",
    startX + boxWidth + 3,
    startY + 7
  );

  doc.rect(startX + boxWidth, startY + 2 * boxHeight, boxWidth, boxHeight); // Third box
  doc.text(
    "Address: 325 Waukegan Road Northfield,",
    startX + boxWidth + 3,
    startY + 2 * 10.5
  );
  doc.text("IL 60093, USA", startX + boxWidth + 5, startY + 2 * 13.5);

  doc.rect(startX + boxWidth, startY + boxHeight, boxWidth, boxHeight); // Second box

  // Extra line for address

  // From Boxes
  doc.rect(startX, startY, boxWidth, boxHeight); // First box
  doc.text("From: Benchmark Innovation, LLC", startX + 3, startY + 7);

  doc.rect(startX, startY + boxHeight, boxWidth, boxHeight); // Second box
  doc.text(
    "Address: 25 AbdelMoneim Shousha, Giza, Egypt",
    startX + 3,
    startY + boxHeight + 6
  );

  doc.rect(startX, startY + 2 * boxHeight, boxWidth, boxHeight); // Third box
  doc.text("AR #: 893414701", startX + 3, startY + 2 * boxHeight + 7);

  //----------------------------------------------

  doc.text("Dear Sir / Madam,", 12, 115);

  doc.text(
    "Kindly find here the Purchase order from Benchmark Innovation, LLC- Egypt for 2024 programs;",
    12,
    120
  );

  let finalY = 130; // Initial Y position to start the table

  // Calculate the total of 'PFI Value', assuming it's formatted like "$1,234.56"
  const sumPFIValues = data.reduce((acc, row) => {
    // Ensure the value exists and is in string format, then remove any non-numeric except decimal point
    const pfiValue = row["PFI Value"]
      ? parseFloat(row["PFI Value"].toString().replace(/[\$,]/g, ""))
      : 0;
    return acc + pfiValue;
  }, 0);

  // Format the sum to a suitable string format, e.g., "$1,234.56"
  const formattedSum = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(sumPFIValues);

  doc.autoTable({
    head: [columns],
    body: data.map((row) => columns.map((col) => row[col])),
    startY: finalY,
    theme: "grid",
    headStyles: {
      fillColor: "#acd491", // light pistachio
      textColor: [0, 0, 139], // dark blue
    },
    styles: {
      lineColor: [0, 0, 0],
      lineWidth: 0.5,
    },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { cellWidth: "auto" },
    },
    didDrawPage: (data) => {
      const finalY = data.cursor.y; // Y position after the last row of the table

      // Draw rectangle for total
      const pageWidth = doc.internal.pageSize.getWidth();
      doc.setDrawColor(0);
      doc.rect(14, finalY + 5, pageWidth - 28, 10); // Rectangle for total row

      // Write "Total" text aligned to the right within the rectangle
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      const totalText = `Total Value: ${formattedSum}`;
      const totalTextWidth = doc.getTextWidth(totalText);
      doc.text(totalText, pageWidth - totalTextWidth - 18, finalY + 12);

      // Add "Best Regards" text below the total row
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Best Regards", 12, finalY + 25);
      doc.text("Benchmark Innovation LLC.", 12, finalY + 30);
    },
  });

  // Get the height of the page
  const pageHeight = doc.internal.pageSize.getHeight();

  // Set the Y position close to the bottom of the page
  const footerY = pageHeight - 30; // 10 mm from the bottom

  doc.setFontSize(10);
  doc.setDrawColor(0); // Set color for line if needed
  doc.line(12, footerY - 3, 200, footerY - 3); // Draw line slightly above the footer text

  // Position the footer text slightly above the line we just drew
  doc.text("Benchmark Innovation LLC,", 12, footerY + 2);
  doc.text("www.benchmark-innovation.com", 12, footerY + 7);
  doc.text("18 AlTayaran St., Nasr City", 12, footerY + 12);
  doc.text("Cairo, Egypt", 12, footerY + 16);

  doc.text("Commercial Record: 10047", 150, footerY + 2);
  doc.text("Tax card: 579-742-792", 150, footerY + 7);

  doc.save(`${orderNumber}.pdf`);
};
