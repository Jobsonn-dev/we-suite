"use client";

import { useState } from "react";
import { FolderCheck, Upload, FileText, CheckCircle2, Clock, AlertCircle, Eye, Download, ShieldCheck, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DocItem {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  status: "verified" | "review" | "missing";
  expiry?: string;
}

export function LegalDocumentsScreen() {
  const [documents, setDocuments] = useState<DocItem[]>([
    {
      id: "doc-1",
      name: "MSME_Udyam_Registration_Certificate.pdf",
      type: "MSME / UDYAM",
      size: "1.4 MB",
      uploadDate: "12-Jan-2025",
      status: "verified",
      expiry: "Lifetime",
    },
    {
      id: "doc-2",
      name: "IEC_Import_Export_Code_Licence.pdf",
      type: "IEC License",
      size: "820 KB",
      uploadDate: "15-Jan-2025",
      status: "verified",
      expiry: "Lifetime",
    },
    {
      id: "doc-3",
      name: "GST_Registration_Certificate_Reg06.pdf",
      type: "GST Certificate",
      size: "2.1 MB",
      uploadDate: "18-Jan-2025",
      status: "verified",
      expiry: "Active",
    },
    {
      id: "doc-4",
      name: "Company_PAN_Card_WEBUOS.pdf",
      type: "PAN Card",
      size: "650 KB",
      uploadDate: "20-Jan-2025",
      status: "verified",
      expiry: "Valid",
    },
    {
      id: "doc-5",
      name: "ISO_9001_2015_Quality_Audit.pdf",
      type: "ISO Certification",
      size: "3.5 MB",
      uploadDate: "Yesterday",
      status: "review",
      expiry: "Under Review",
    },
  ]);

  const [isDragging, setIsDragging] = useState(false);

  const handleUploadMock = () => {
    const newDoc: DocItem = {
      id: `doc-${Date.now()}`,
      name: `Compliance_Document_${Date.now().toString().slice(-4)}.pdf`,
      type: "Business License",
      size: "1.8 MB",
      uploadDate: "Just now",
      status: "review",
      expiry: "Pending verification",
    };
    setDocuments([newDoc, ...documents]);
    toast.success("Document uploaded and submitted for admin review!");
  };

  const handleDelete = (id: string) => {
    setDocuments(documents.filter((d) => d.id !== id));
    toast.info("Document deleted.");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Legal Documents & Compliance</h2>
        <p className="mt-1 text-sm text-slate-400">
          Upload and manage your business credentials, government registrations, MSME/IEC certificates, and quality standards.
        </p>
      </div>

      {/* Upload Zone */}
      <section className="rounded-3xl border border-dashed border-white/20 bg-slate-900/40 p-8 text-center backdrop-blur-sm transition-all hover:border-cyan-500/50 hover:bg-slate-900/60">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 shadow-md shadow-cyan-500/10">
          <Upload className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-base font-bold text-white">Upload Compliance Certificates & Licenses</h3>
        <p className="mx-auto mt-1 max-w-md text-xs text-slate-400">
          Drag and drop your PDF, JPG, or PNG files here, or browse files from your computer. Max file size: 10MB per document.
        </p>
        <button
          type="button"
          onClick={handleUploadMock}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-bold text-slate-950 transition-all hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20"
        >
          <Plus className="h-4 w-4" /> Browse & Upload Document
        </button>
      </section>

      {/* Document Records List */}
      <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm sm:p-8">
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white">Submitted Compliance Records</h3>
              <p className="text-xs text-slate-400">{documents.length} documents uploaded</p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-400">
            Enterprise Verified
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {documents.map((doc) => {
            const isVerified = doc.status === "verified";
            return (
              <div
                key={doc.id}
                className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-slate-950/60 p-4 transition-all hover:border-white/15 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3.5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 text-cyan-400">
                    <FileText className="h-6 w-6" />
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-white">{doc.name}</p>
                      <span className="rounded bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                        {doc.type}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">
                      {doc.size} · Uploaded {doc.uploadDate} · Validity: {doc.expiry}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  {isVerified ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Approved
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-semibold text-amber-400">
                      <Clock className="h-3.5 w-3.5" /> Under Review
                    </span>
                  )}

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => toast.info(`Viewing ${doc.name}`)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white"
                      title="View document"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => toast.success(`Downloading ${doc.name}`)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white"
                      title="Download document"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(doc.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
                      title="Delete document"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
