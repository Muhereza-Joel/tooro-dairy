import React from "react";
import { Modal } from "rsuite";
import { PDFViewer } from "@react-pdf/renderer";

const SalesPDFModal = ({ openPdfModal, pdfData, onClose }) => {
  return (
    <Modal open={openPdfModal} onClose={onClose} size='calc(100% - 120px)'>
      <Modal.Body>
        {pdfData && (
          <div style={{ height: "calc(100vh - 200px)" }}>
            <PDFViewer style={{ height: "99%", width: "99%" }}>
              {pdfData}
            </PDFViewer>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default SalesPDFModal;
