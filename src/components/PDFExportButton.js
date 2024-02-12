import React, { useState } from "react";
import { Document, Page, span, pdfjs } from "react-pdf";
import { Button } from "rsuite";

const PdfExportButton = ({ data }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const exportToPdf = () => {
    const pdfContent = (
      <Document>
        <Page size="A4">
          <span style={{ fontSize: 18, marginBottom: 10 }}>Table Content</span>
          {/* Header Row */}
          <span
            style={{
              display: "flex",
              flexDirection: "row",
              fontWeight: "bold",
            }}
          >
            <span style={{ flex: 1 }}>SNo.</span>
            <span style={{ flex: 2 }}>Username</span>
            <span style={{ flex: 2 }}>Email</span>
            <span style={{ flex: 1 }}>Role</span>
            <span style={{ flex: 2 }}>Added On</span>
            <span style={{ flex: 2 }}>Last Updated On</span>
          </span>

          {/* Data Rows */}
          {data.map((item, index) => (
            <span key={index} style={{ display: "flex", flexDirection: "row" }}>
              <span style={{ flex: 1 }}>{index + 1}</span>
              <span style={{ flex: 2 }}>{item.username}</span>
              <span style={{ flex: 2 }}>{item.email}</span>
              <span style={{ flex: 1 }}>{item.role}</span>
              <span style={{ flex: 2 }}>{item.created_at}</span>
              <span style={{ flex: 2 }}>{item.updated_at}</span>
            </span>
          ))}
        </Page>
      </Document>
    );

    const pdfWindow = window.open("");
    pdfWindow.document.write(`
      <html>
        <head>
          <title>PDF Export</title>
        </head>
        <body>
          <h1>PDF Export</h1>
          ${pdfContent}
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
