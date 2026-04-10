import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  FolderOpen,
  Search,
  Upload,
  Download,
  Trash2,
  ChevronRight,
  ArrowLeft,
  Grid3X3,
  List,
  File,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { Header } from "../components/Header";
import { Convenio } from "../data/mockData";
import { ConvenioService } from "../services/ConvenioService";
import { ConfirmModal } from "../components/ConfirmModal";

type ViewMode = "grid" | "list";

export default function Documentos() {
  const navigate = useNavigate();
  const [convenios, setConvenios] = useState<Convenio[]>([]);
  const [search, setSearch] = useState("");
  const [selectedConvenio, setSelectedConvenio] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [uploadFile, setUploadFile] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; docId: string; nome: string; storagePath?: string }>({ open: false, docId: "", nome: "" });
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    ConvenioService.getAll()
      .then(setConvenios)
      .catch((err) => console.error("Erro ao buscar convênios:", err));
  }, []);

  const handleDelete = async () => {
    try {
      await ConvenioService.removerDocumento(deleteModal.docId, deleteModal.storagePath);
      setConvenios((prev) =>
        prev.map((c) => ({
          ...c,
          documentos: c.documentos.filter((d) => d.id !== deleteModal.docId),
        }))
      );
    } catch (err) {
      console.error("Erro ao excluir documento:", err);
    } finally {
      setDeleteModal({ open: false, docId: "", nome: "" });
    }
  };

  const conveniosFolders = convenios.filter(
    (c) =>
      c.documentos.length > 0 &&
      c.empresaNome.toLowerCase().includes(search.toLowerCase())
  );

  const selectedConvenioData = selectedConvenio
    ? convenios.find((c) => c.id === selectedConvenio)
    : null;

  const fileColors: Record<string, { bg: string; text: string }> = {
    PDF: { bg: "bg-red-50", text: "text-red-600" },
    XLSX: { bg: "bg-green-50", text: "text-green-600" },
    DOCX: { bg: "bg-blue-50", text: "text-blue-600" },
    DOC: { bg: "bg-blue-50", text: "text-blue-600" },
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Header
        title="Repositório de Documentos"
        subtitle="Documentos organizados por convênio"
      />

      <div className="flex-1 overflow-hidden flex">
        {/* Sidebar - Folder tree */}
        <div className="w-72 flex-shrink-0 border-r border-gray-100 bg-white flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar convênio..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide px-2 mb-2">Pastas</p>

            {/* All documents option */}
            <button
              onClick={() => setSelectedConvenio(null)}
              className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-left mb-1 transition-colors ${
                !selectedConvenio ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <FolderOpen size={16} className={!selectedConvenio ? "text-blue-600" : "text-gray-400"} />
              <span className="text-sm flex-1">Todos os documentos</span>
              <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                {convenios.reduce((acc, c) => acc + c.documentos.length, 0)}
              </span>
            </button>

            {conveniosFolders.length === 0 ? (
              <p className="text-xs text-gray-400 text-center mt-4 px-2">Nenhuma pasta encontrada</p>
            ) : (
              conveniosFolders.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConvenio(conv.id)}
                  className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-left mb-1 transition-colors ${
                    selectedConvenio === conv.id ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <FolderOpen size={16} className={selectedConvenio === conv.id ? "text-blue-600" : "text-amber-500"} />
                  <span className="text-sm flex-1 truncate">{conv.empresaNome}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                    selectedConvenio === conv.id ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {conv.documentos.length}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-gray-100 bg-white flex-shrink-0">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span
                className="cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => setSelectedConvenio(null)}
              >
                Documentos
              </span>
              {selectedConvenioData && (
                <>
                  <ChevronRight size={14} className="text-gray-400" />
                  <span className="text-gray-900 font-medium">{selectedConvenioData.empresaNome}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setViewMode("list")}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${viewMode === "list" ? "bg-blue-50 text-blue-600" : "text-gray-400 hover:bg-gray-100"}`}
              >
                <List size={16} />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${viewMode === "grid" ? "bg-blue-50 text-blue-600" : "text-gray-400 hover:bg-gray-100"}`}
              >
                <Grid3X3 size={16} />
              </button>
              <div className="w-px h-5 bg-gray-200" />
              <label className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium cursor-pointer transition-colors">
                <Upload size={14} />
                Upload
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setUploadFile(file.name);
                    setTimeout(() => setUploadFile(null), 3000);
                  }}
                />
              </label>
            </div>
          </div>

          {/* Upload feedback */}
          {uploadFile && (
            <div className="flex items-center gap-2 px-5 py-2.5 bg-green-50 border-b border-green-100 flex-shrink-0">
              <CheckCircle2 size={15} className="text-green-600" />
              <p className="text-sm text-green-700">"{uploadFile}" enviado com sucesso!</p>
            </div>
          )}

          {/* Upload area */}
          <div
            className="flex-1 overflow-y-auto p-5"
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              const file = e.dataTransfer.files[0];
              if (file) { setUploadFile(file.name); setTimeout(() => setUploadFile(null), 3000); }
            }}
          >
            {dragging && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-500/10 border-2 border-dashed border-blue-400 pointer-events-none">
                <div className="text-center">
                  <Upload size={40} className="text-blue-500 mx-auto mb-2" />
                  <p className="text-blue-600 font-medium">Solte o arquivo aqui</p>
                </div>
              </div>
            )}

            {/* Get all documents */}
            {(() => {
              const docs = selectedConvenioData
                ? selectedConvenioData.documentos
                : convenios.flatMap((c) => c.documentos.map((d) => ({ ...d, _conv: c.empresaNome })));

              if (docs.length === 0) {
                return (
                  <div className="flex flex-col items-center justify-center h-full min-h-48 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <FolderOpen size={28} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm">Nenhum documento nesta pasta</p>
                    <p className="text-gray-400 text-xs mt-1">Faça upload ou arraste arquivos aqui</p>
                  </div>
                );
              }

              if (viewMode === "grid") {
                return (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {docs.map((doc) => {
                      const colors = fileColors[doc.tipo] || { bg: "bg-gray-100", text: "text-gray-600" };
                      return (
                        <div
                          key={doc.id}
                          className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col items-center text-center hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
                        >
                          <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center mb-3`}>
                            <span className={`text-xs font-bold ${colors.text}`}>{doc.tipo}</span>
                          </div>
                          <p className="text-xs font-medium text-gray-900 truncate w-full">{doc.nome}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{doc.tamanho}</p>
                          {"_conv" in doc && (
                            <p className="text-xs text-blue-500 mt-1 truncate w-full">{(doc as any)._conv}</p>
                          )}
                          <div className="flex gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                              <Download size={13} />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setDeleteModal({ open: true, docId: doc.id, nome: doc.nome, storagePath: doc.storagePath }); }}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              }

              return (
                <div className="space-y-2">
                  {docs.map((doc) => {
                    const colors = fileColors[doc.tipo] || { bg: "bg-gray-100", text: "text-gray-600" };
                    return (
                      <div
                        key={doc.id}
                        className="flex items-center gap-4 p-3.5 bg-white rounded-xl border border-gray-100 hover:shadow-sm hover:border-gray-200 transition-all cursor-pointer group"
                      >
                        <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                          <span className={`text-xs font-bold ${colors.text}`}>{doc.tipo}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{doc.nome}</p>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-xs text-gray-400">{doc.tamanho}</span>
                            <span className="text-xs text-gray-400">·</span>
                            <span className="text-xs text-gray-400">{doc.uploadedAt}</span>
                            <span className="text-xs text-gray-400">·</span>
                            <span className="text-xs text-gray-400">{doc.uploadedBy}</span>
                            {"_conv" in doc && (
                              <>
                                <span className="text-xs text-gray-400">·</span>
                                <span className="text-xs text-blue-500">{(doc as any)._conv}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                            <Download size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteModal({ open: true, docId: doc.id, nome: doc.nome, storagePath: doc.storagePath })}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      <ConfirmModal
        open={deleteModal.open}
        title="Excluir Documento"
        description={`Tem certeza que deseja excluir "${deleteModal.nome}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Sim, excluir"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, docId: "", nome: "" })}
      />
    </div>
  );
}
