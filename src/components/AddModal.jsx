import React, { useState, useEffect } from "react";
import { addRequest, updateRequest } from "../services/googleSheetApi";

function AddModal({ isOpen, onClose, categories, actions, onSuccess, requestToEdit }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    incomingNumber: "",
    incomingDate: "",
    ourNumber: "",
    ourDate: "",
    fromPlace: "",
    toPlace: "",
    action: "",
    notes: "",
    createdAt: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      if (requestToEdit) {
        setFormData({
          name: requestToEdit.name || "",
          category: requestToEdit.category || "",
          incomingNumber: requestToEdit.incomingNumber || "",
          incomingDate: requestToEdit.incomingDate || "",
          ourNumber: requestToEdit.ourNumber || "",
          ourDate: requestToEdit.ourDate || "",
          fromPlace: requestToEdit.fromPlace || "",
          toPlace: requestToEdit.toPlace || "",
          action: requestToEdit.action || "",
          notes: requestToEdit.notes || "",
          createdAt: requestToEdit.createdAt || ""
        });
      } else {
        setFormData({
          name: "",
          category: "",
          incomingNumber: "",
          incomingDate: "",
          ourNumber: "",
          ourDate: "",
          fromPlace: "",
          toPlace: "",
          action: "",
          notes: "",
          createdAt: ""
        });
      }
    }
  }, [isOpen, requestToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("يرجى إدخال الاسم");
      return;
    }
    
    setIsSubmitting(true);
    try {
      let result;
      if (requestToEdit) {
        result = await updateRequest(requestToEdit.id, formData);
      } else {
        result = await addRequest(formData);
      }
      
      if (result.success) {
        alert(requestToEdit ? "تم تعديل المعاملة بنجاح" : "تم حفظ المعاملة بنجاح");
        onSuccess();
        onClose();
      } else {
        alert("فشل في حفظ المعاملة: " + (result.message || "خطأ غير معروف"));
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء الاتصال بالقاعدة");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-600 p-1.5 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
            </span>
            <span>{requestToEdit ? "تعديل المعاملة" : "إضافة معاملة جديدة"}</span>
          </h2>
          
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-xl transition text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-5">
          
          {/* الاسم */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 pr-1">الاسم الكامل *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="أدخل الاسم الكامل"
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 transition"
            />
          </div>

          {/* التصنيف */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 pr-1">تصنيف المعاملة</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 transition"
            >
              <option value="">اختر التصنيف</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* رقم الوارد + تاريخ الوارد */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 pr-1">رقم الوارد</label>
              <input
                type="text"
                name="incomingNumber"
                value={formData.incomingNumber}
                onChange={handleChange}
                placeholder="رقم الوارد"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 pr-1">تاريخ الوارد</label>
              <input
                type="date"
                name="incomingDate"
                value={formData.incomingDate}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 transition"
              />
            </div>
          </div>

          {/* رقم واردنا + تاريخ واردنا */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 pr-1">رقم واردنا</label>
              <input
                type="text"
                name="ourNumber"
                value={formData.ourNumber}
                onChange={handleChange}
                placeholder="رقم واردنا"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 pr-1">تاريخ واردنا</label>
              <input
                type="date"
                name="ourDate"
                value={formData.ourDate}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 transition"
              />
            </div>
          </div>

          {/* من وإلى المكان */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 pr-1">من المكان</label>
              <input
                type="text"
                name="fromPlace"
                value={formData.fromPlace}
                onChange={handleChange}
                placeholder="من جهة/المكان"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 pr-1">إلى المكان</label>
              <input
                type="text"
                name="toPlace"
                value={formData.toPlace}
                onChange={handleChange}
                placeholder="إلى جهة/المكان"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 transition"
              />
            </div>
          </div>

          {/* الإجراء (ما تم فيه) */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 pr-1">الإجراء المتخذ (ما تم فيه)</label>
            <select
              name="action"
              value={formData.action}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 transition"
            >
              <option value="">اختر الإجراء</option>
              {actions.map((act) => (
                <option key={act.id} value={act.name}>
                  {act.name}
                </option>
              ))}
            </select>
          </div>

          {/* ملاحظات */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 pr-1">ملاحظات</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="أي ملاحظات إضافية..."
              rows={3}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 transition resize-none"
            />
          </div>

          {/* تاريخ الإنشاء */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 pr-1">تاريخ الإنشاء</label>
            <input
              type="date"
              name="createdAt"
              value={formData.createdAt}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 transition"
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-2xl transition disabled:bg-blue-400 disabled:cursor-not-allowed shadow-md shadow-blue-100 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <span>{requestToEdit ? "حفظ التعديلات" : "حفظ المعاملة"}</span>
              )}
            </button>
            
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition disabled:opacity-50"
            >
              إلغاء
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AddModal;