'use client';

import React from 'react';
import { pdf } from '@react-pdf/renderer';
import SpkDocument from './SpkDocument';
import { SpkData } from '@/utils/pdfGenerator';

interface PDFRendererProps {
  data: SpkData;
}

const PDFRenderer: React.FC<PDFRendererProps> = ({ data }) => {
  const handleGenerate = async () => {
    try {
      const doc = <SpkDocument data={data} />;
      const pdfBlob = await pdf(doc).toBlob();

      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `SPK-${data.spkNumber}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handlePreview = async () => {
    try {
      const doc = <SpkDocument data={data} />;
      const pdfBlob = await pdf(doc).toBlob();

      // Open in new tab
      const url = URL.createObjectURL(pdfBlob);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error previewing PDF:', error);
    }
  };

  return null;
};

export default PDFRenderer;