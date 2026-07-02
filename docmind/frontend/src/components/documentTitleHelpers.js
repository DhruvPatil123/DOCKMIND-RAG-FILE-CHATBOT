const sampleRename = [
  "Indeed_Resume_JohnDoe.pdf",
  "Offer_Letter_Q2.pdf",
  "Product_Spec_Growth.pdf",
  "Budget_Approval_2025.pdf",
  "Team_Retrospective.pdf",
];

export function formatDocumentTitle(title, docId, index = 0) {
  const normalized = title?.trim() || "Untitled Document";
  if (normalized.toLowerCase() === "indeed resume") {
    const idx = docId
      ? Array.from(docId).reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % sampleRename.length
      : index % sampleRename.length;
    return sampleRename[idx];
  }

  if (normalized === "Untitled" || normalized === "document") {
    return `Document_${index + 1}.pdf`;
  }

  return normalized;
}

export function uniqueDisplayTitles(documents) {
  const seen = new Map();
  return documents.map((doc, index) => {
    const title = formatDocumentTitle(doc.title, doc.doc_id, index);
    const count = seen.get(title) || 0;
    seen.set(title, count + 1);
    return count > 0 ? `${title} (${count + 1})` : title;
  });
}
