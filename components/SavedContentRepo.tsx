import React, { useState } from "react";
import { SavedContentItem, StoredImage } from "../types";
import FormattedText from "./MarkdownRenderer";

interface SavedContentRepoProps {
  items: SavedContentItem[];
  onDelete: (ids: string[]) => void;
  onViewImage: (img: StoredImage) => void;
  onUpdate: (id: string, newContent: string) => void;
}

export const SavedContentRepo: React.FC<SavedContentRepoProps> = ({
  items,
  onDelete,
  onViewImage,
  onUpdate,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Selection State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  // Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState<string[]>([]);

  const startEdit = (item: SavedContentItem) => {
    setEditingId(item.id);
    setEditContent(item.content || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  const saveEdit = (id: string) => {
    onUpdate(id, editContent);
    setEditingId(null);
    setEditContent("");
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((item) => item.id)));
    }
  };

  // Trigger Modal
  const requestDelete = (ids: string[]) => {
    setItemsToDelete(ids);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete
  const confirmDelete = () => {
    onDelete(itemsToDelete);
    // Clear selection if deleted items were selected
    const newSelected = new Set(selectedIds);
    itemsToDelete.forEach((id) => newSelected.delete(id));
    setSelectedIds(newSelected);

    setIsDeleteModalOpen(false);
    setItemsToDelete([]);
  };

  const filteredItems = items; // Schedule filters removed, show all

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 min-h-[400px] bg-white rounded-2xl border border-gray-200 border-dashed hover:border-thai-200 transition-colors duration-300">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 shadow-inner">
          <svg
            className="w-8 h-8 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        </div>
        <p className="font-medium text-gray-500">
          သိမ်းဆည်းထားသော အရာများ မရှိသေးပါ (No saved items)
        </p>
        <p className="text-sm mt-1">
          Generate content and click "Save" to build your repository.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Header with Bulk Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100 sticky top-0 bg-[#F9FAFB] z-10 py-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Saved Content Repository
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your drafts and assets
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-end md:items-center gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSelectAll}
              className="text-xs font-bold text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
            >
              {selectedIds.size === filteredItems.length &&
              filteredItems.length > 0
                ? "Deselect All"
                : "Select All"}
            </button>

            {selectedIds.size > 0 && (
              <button
                onClick={() => requestDelete(Array.from(selectedIds))}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-sm transition-all animate-fadeIn"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete ({selectedIds.size})
              </button>
            )}

            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">
              {filteredItems.length}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`bg-white rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out border overflow-hidden flex flex-col group relative ${
              selectedIds.has(item.id)
                ? "ring-2 ring-thai-500 border-thai-500"
                : "border-gray-200"
            }`}
            onClick={(e) => {
              // Clicking card body toggles selection if we are not editing
              if (!editingId) toggleSelection(item.id);
            }}
          >
            {/* Selection Checkbox */}
            <div
              className="absolute top-3 left-3 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                checked={selectedIds.has(item.id)}
                onChange={() => toggleSelection(item.id)}
                className="w-5 h-5 text-thai-600 rounded focus:ring-thai-500 border-gray-300 cursor-pointer shadow-sm"
              />
            </div>

            {/* Type & Date Header */}
            <div className="px-4 py-2 pl-10 border-b border-gray-50 flex justify-between items-center text-[10px] font-bold uppercase tracking-wider bg-gray-50 text-gray-500">
              <span>{item.type}</span>
              <span>{new Date(item.timestamp).toLocaleDateString()}</span>
            </div>

            {/* Content Body */}
            <div
              className="flex-1 p-5 flex flex-col space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              {item.image && (
                <div
                  className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-zoom-in relative group/img shadow-inner"
                  onClick={() =>
                    onViewImage({
                      id: item.id,
                      data: item.image!,
                      prompt: item.prompt,
                      timestamp: item.timestamp,
                    })
                  }
                >
                  <img
                    src={item.image}
                    alt="Asset"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-bold bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm transform scale-90 group-hover/img:scale-100 transition-transform">
                      View
                    </span>
                  </div>
                </div>
              )}

              {item.content && (
                <div className="flex-1 max-h-[300px] custom-scrollbar">
                  {editingId === item.id ? (
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full h-full min-h-[200px] p-4 border border-gray-200 bg-gray-50 focus:bg-white rounded-xl focus:ring-2 focus:ring-thai-500/20 focus:border-thai-500 outline-none text-sm leading-relaxed resize-none transition-all shadow-inner focus:shadow-none"
                      placeholder="Edit content here..."
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <div className="max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                      <div className="prose prose-sm prose-slate line-clamp-6">
                        <FormattedText text={item.content} />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!item.image && !item.content && (
                <p className="text-gray-400 italic text-sm">
                  No content data available.
                </p>
              )}
            </div>

            {/* Actions */}
            <div
              className="p-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              {editingId === item.id ? (
                <div className="flex space-x-2 w-full justify-end animate-fadeIn">
                  <button
                    onClick={cancelEdit}
                    className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-700 bg-white border border-gray-200 rounded-lg transition-colors hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => saveEdit(item.id)}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm transition-all transform hover:scale-105 active:scale-95 flex items-center gap-1"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        requestDelete([item.id]);
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                      title="Delete Item"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                    {item.content && (
                      <button
                        onClick={() => startEdit(item)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-gray-500 hover:text-thai-600 hover:bg-white border border-transparent hover:border-gray-200 rounded-lg transition-all duration-200"
                        title="Edit Content"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Edit
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {item.content && (
                      <button
                        onClick={() => handleCopy(item.content || "", item.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 border ${
                          copiedId === item.id
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-white text-gray-600 border-gray-200 hover:text-thai-600 hover:border-thai-300"
                        }`}
                      >
                        {copiedId === item.id ? (
                          <>
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Copied
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                            Copy
                          </>
                        )}
                      </button>
                    )}

                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Reactive Confirmation Modal */}
      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Delete Content?
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Are you sure you want to delete{" "}
                <span className="font-bold text-gray-900">
                  {itemsToDelete.length}
                </span>{" "}
                item(s)? This action cannot be undone. <br />{" "}
                (ဖျက်မှာသေချာပါသလား)
              </p>
              <div className="flex space-x-3 justify-center">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 active:scale-95"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
