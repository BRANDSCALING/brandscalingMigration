import PyPDF2
import os
from typing import Optional

class PDFService:
    def __init__(self, upload_dir: str = "uploads"):
        self.upload_dir = upload_dir
        os.makedirs(upload_dir, exist_ok=True)
    
    def extract_text_from_pdf(self, file_path: str) -> str:
        """Extract text from PDF file"""
        try:
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                text = ""
                for page in pdf_reader.pages:
                    text += page.extract_text()
                return text
        except Exception as e:
            return f"Error reading PDF: {str(e)}"
    
    def analyze_edna_results(self, pdf_text: str) -> dict:
        """Analyze E-DNA quiz results from PDF text"""
        # Look for key indicators in the PDF text
        edna_type = "Unknown"
        confidence = 0.0
        
        # Simple text analysis to determine E-DNA type
        text_lower = pdf_text.lower()
        
        if "architect" in text_lower:
            edna_type = "Architect"
            confidence = 0.9
        elif "alchemist" in text_lower:
            edna_type = "Alchemist"
            confidence = 0.9
        elif "blurred" in text_lower:
            edna_type = "Blurred"
            confidence = 0.9
        
        return {
            "edna_type": edna_type,
            "confidence": confidence,
            "full_text": pdf_text[:500] + "..." if len(pdf_text) > 500 else pdf_text
        }

pdf_service = PDFService()
