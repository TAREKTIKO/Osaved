import React from "react";

function DataTable({ requests, sortField, sortDirection, onSortChange, onEdit, onDelete }) {
  // Format YYYY-MM-DD for display in the table
  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr + "T00:00:00");
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("ar-EG", { year: "numeric", month: "2-digit", day: "2-digit" });
    } catch {
      return dateStr;
    }
  };

  const getActionBadge = (action) => {
    const actionStr = String(action || "").trim();
    if (actionStr === "موافقة" || actionStr.toLowerCase() === "approved") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-150">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          موافقة
        </span>
      );
    }
    if (actionStr === "رفض" || actionStr.toLowerCase() === "rejected") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-150">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
          رفض
        </span>
      );
    }
    if (actionStr === "حفظ" || actionStr.toLowerCase() === "saved") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-150">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
          حفظ
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-50 text-gray-650 border border-gray-200">
        <span className="h-1.5 w-1.5 rounded-full bg-gray-400"></span>
        {action || "قيد الانتظار"}
      </span>
    );
  };

  const renderHeader = (label, field) => {
    const isSorted = sortField === field;
    return (
      <th
        onClick={() => onSortChange(field)}
        className="p-4 cursor-pointer hover:bg-gray-100 transition select-none group text-right text-xs font-bold text-gray-500 uppercase tracking-wider"
      >
        <div className="flex items-center gap-1.5 justify-start">
          <span>{label}</span>
          <span className={`transition-colors ${isSorted ? "text-blue-600" : "text-gray-300 group-hover:text-gray-400"}`}>
            {isSorted ? (
              sortDirection === "asc" ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            )}
          </span>
        </div>
      </th>
    );
  };

  return (
    <div className="mt-6 overflow-hidden bg-white rounded-3xl border border-gray-200 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-right border-collapse">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {renderHeader("الاسم", "name")}
              {renderHeader("التصنيف", "category")}
              {renderHeader("رقم الوارد", "incomingNumber")}
              {renderHeader("واردنا", "ourNumber")}
              {renderHeader("من المكان", "fromPlace")}
              {renderHeader("إلى المكان", "toPlace")}
              {renderHeader("ما تم فيه", "action")}
              <th className="p-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">العمليات</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {requests.length > 0 ? (
              requests.map((item) => (
                <tr
                  key={String(item.id)}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 font-semibold text-gray-800">
                    {item.name}
                  </td>
                  <td className="p-4 text-gray-600 font-medium">
                    {item.category}
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-gray-750">{item.incomingNumber}</div>
                    <div className="text-gray-400 text-xs mt-0.5 font-medium">
                      {formatDateDisplay(item.incomingDate)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-gray-755">{item.ourNumber}</div>
                    <div className="text-gray-400 text-xs mt-0.5 font-medium">
                      {formatDateDisplay(item.ourDate)}
                    </div>
                  </td>
                  <td className="p-4 text-gray-650 font-medium">
                    {item.fromPlace}
                  </td>
                  <td className="p-4 text-gray-650 font-medium">
                    {item.toPlace}
                  </td>
                  <td className="p-4">
                    {getActionBadge(item.action)}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onEdit && onEdit(item)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-xl transition"
                        title="تعديل"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDelete && onDelete(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-xl transition"
                        title="حذف"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-12 text-center text-gray-400 font-medium">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>لم يتم العثور على طلبات مطابقة للبحث</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;