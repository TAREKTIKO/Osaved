import React, { useState } from "react";
import { addCategory, deleteCategory, addAction, deleteAction } from "../services/googleSheetApi";

function SettingsModal({ isOpen, onClose, categories, actions, onSuccess }) {
  const [activeTab, setActiveTab] = useState("categories"); // "categories" or "actions"
  const [newItemName, setNewItemName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    setIsProcessing(true);
    try {
      let result;
      if (activeTab === "categories") {
        result = await addCategory(newItemName.trim());
      } else {
        result = await addAction(newItemName.trim());
      }

      if (result.success) {
        setNewItemName("");
        onSuccess();
      } else {
        alert("فشل الإجراء: " + (result.message || "خطأ غير معروف"));
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء الإضافة");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteItem = async (id, name) => {
    const isConfirmed = window.confirm(`هل أنت متأكد من حذف "${name}"؟ قد يؤثر هذا على المعاملات المرتبطة به.`);
    if (!isConfirmed) return;

    setIsProcessing(true);
    try {
      let result;
      if (activeTab === "categories") {
        result = await deleteCategory(id);
      } else {
        result = await deleteAction(id);
      }

      if (result.success) {
        onSuccess();
      } else {
        alert("فشل الحذف: " + (result.message || "خطأ غير معروف"));
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء الحذف");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
            <span className="bg-gray-100 text-gray-700 p-1.5 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </span>
            <span>إعدادات النظام</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-xl transition text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-gray-150/60 bg-gray-50 px-4 pt-2 gap-2">
          <button
            onClick={() => { setActiveTab("categories"); setNewItemName(""); }}
            className={`px-4 py-2.5 font-bold text-sm rounded-t-xl transition-all ${
              activeTab === "categories"
                ? "bg-white border-t border-x border-gray-100 text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            التصنيفات
          </button>
          
          <button
            onClick={() => { setActiveTab("actions"); setNewItemName(""); }}
            className={`px-4 py-2.5 font-bold text-sm rounded-t-xl transition-all ${
              activeTab === "actions"
                ? "bg-white border-t border-x border-gray-100 text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            الإجراءات (القرارات)
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-grow p-6 flex flex-col min-h-0">
          
          {/* List Area */}
          <div className="flex-grow overflow-y-auto mb-4 border border-gray-200 rounded-2xl divide-y divide-gray-100 bg-gray-50/50">
            {activeTab === "categories" ? (
              categories.length > 0 ? (
                categories.map((cat) => (
                  <div key={cat.id} className="flex justify-between items-center px-4 py-3 hover:bg-white transition-colors">
                    <span className="text-sm font-semibold text-gray-800">{cat.name}</span>
                    <button
                      onClick={() => handleDeleteItem(cat.id, cat.name)}
                      disabled={isProcessing}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-xl transition disabled:opacity-50"
                      title="حذف"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-400 text-xs font-semibold">لا يوجد تصنيفات حالياً</div>
              )
            ) : (
              actions.length > 0 ? (
                actions.map((act) => (
                  <div key={act.id} className="flex justify-between items-center px-4 py-3 hover:bg-white transition-colors">
                    <span className="text-sm font-semibold text-gray-800">{act.name}</span>
                    <button
                      onClick={() => handleDeleteItem(act.id, act.name)}
                      disabled={isProcessing}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-xl transition disabled:opacity-50"
                      title="حذف"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-400 text-xs font-semibold">لا يوجد إجراءات حالياً</div>
              )
            )}
          </div>

          {/* Add Item Form */}
          <form onSubmit={handleAddItem} className="flex gap-2">
            <input
              type="text"
              required
              disabled={isProcessing}
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder={activeTab === "categories" ? "اسم التصنيف الجديد..." : "اسم الإجراء الجديد..."}
              className="flex-grow bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 transition"
            />
            
            <button
              type="submit"
              disabled={isProcessing || !newItemName.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-2xl transition disabled:bg-blue-400 disabled:cursor-not-allowed text-sm flex items-center gap-1 shadow-md shadow-blue-100"
            >
              <span>+ إضافة</span>
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}

export default SettingsModal;
