import React from "react";

function Filter({
  categories,
  actions,
  selectedCategory,
  onChangeCategory,
  selectedAction,
  onChangeAction,
  sortField,
  onChangeSortField,
  sortDirection,
  onChangeSortDirection,
  onReset
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:gap-4 md:flex-wrap">
      
      {/* Category Filter */}
      <div className="flex-grow md:flex-1 min-w-[200px]">
        <label className="block text-xs font-semibold text-gray-500 mb-1.5 pr-1">تصفية حسب التصنيف</label>
        <select
          value={selectedCategory}
          onChange={(e) => onChangeCategory(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 transition"
        >
          <option value="">كل التصنيفات</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Action Filter */}
      <div className="flex-grow md:flex-1 min-w-[200px]">
        <label className="block text-xs font-semibold text-gray-500 mb-1.5 pr-1">تصفية حسب الإجراء</label>
        <select
          value={selectedAction}
          onChange={(e) => onChangeAction(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 transition"
        >
          <option value="">كل الإجراءات</option>
          {actions.map((act) => (
            <option key={act.id} value={act.name}>
              {act.name}
            </option>
          ))}
        </select>
      </div>

      {/* Sort Field */}
      <div className="flex-grow md:flex-1 min-w-[180px]">
        <label className="block text-xs font-semibold text-gray-500 mb-1.5 pr-1">ترتيب حسب</label>
        <select
          value={sortField}
          onChange={(e) => onChangeSortField(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 transition"
        >
          <option value="name">الاسم</option>
          <option value="incomingDate">تاريخ الوارد</option>
          <option value="incomingNumber">رقم الوارد</option>
          <option value="category">التصنيف</option>
          <option value="action">الإجراء</option>
        </select>
      </div>

      {/* Sort Direction Toggle */}
      <div className="flex flex-col justify-end pt-5 md:pt-0">
        <button
          onClick={() => onChangeSortDirection(sortDirection === "asc" ? "desc" : "asc")}
          className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-4 py-2.5 rounded-2xl hover:bg-gray-50 transition text-sm font-semibold shadow-sm h-[44px]"
          title={sortDirection === "asc" ? "ترتيب تصاعدي" : "ترتيب تنازلي"}
        >
          {sortDirection === "asc" ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              <span>تصاعدي</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h9m5-1v12m0 0l-4-4m4 4l4-4" />
              </svg>
              <span>تنازلي</span>
            </>
          )}
        </button>
      </div>

      {/* Reset Button */}
      {(selectedCategory || selectedAction || sortField !== "incomingDate" || sortDirection !== "desc") && (
        <div className="flex flex-col justify-end pt-5 md:pt-0">
          <button
            onClick={onReset}
            className="flex items-center justify-center gap-1.5 text-red-600 hover:text-red-700 px-4 py-2.5 transition text-sm font-semibold rounded-2xl hover:bg-red-50 h-[44px]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>إعادة تعيين</span>
          </button>
        </div>
      )}
      
    </div>
  );
}

export default Filter;
