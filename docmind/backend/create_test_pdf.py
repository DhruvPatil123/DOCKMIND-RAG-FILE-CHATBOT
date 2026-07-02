from reportlab.pdfgen import canvas

def create_pdf(filename):
    c = canvas.Canvas(filename)
    c.drawString(100, 750, "Welcome to DocMind Testing")
    c.drawString(100, 730, "This is a test document for RAG verification.")
    c.drawString(100, 710, "The secret password is: CLAUDE_SOPHISTICATED_RAG.")
    c.save()

if __name__ == "__main__":
    create_pdf("test_doc.pdf")
