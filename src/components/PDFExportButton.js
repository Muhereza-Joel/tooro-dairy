import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "rsuite";

const PdfExportButton = ({ data }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const generatePdfContent = () => {
    return (
      <div>
        <h2>Table Content</h2>
        <table>
          <thead>
            <tr>
              <th>SNo.</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Added On</th>
              <th>Last Updated On</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.username}</td>
                <td>{item.email}</td>
                <td>{item.role}</td>
                <td>{item.created_at}</td>
                <td>{item.updated_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const exportToPdf = () => {
    const pdfWindow = window.open("");
    pdfWindow.document.write(`
      <html>
        <head>
          <title>PDF Export</title>
        </head>
        <body>
          <h1>PDF Export</h1>
          ${generatePdfContent().outerHTML}
        </body>
      </html>
    `);
  };

  return (
    <div>
      <Button onClick={exportToPdf}>Export to PDF</Button>
      <Document
        file={{ data: URL.createObjectURL(new Blob([JSON.stringify(data)])) }}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page pageNumber={pageNumber} />
      </Document>
    </div>
  );
};

export default PdfExportButton;
