import React from "react";

function SearchBox({ value, onChange }) {
  return (
    <div className="relative flex-grow">
      <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </span>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="ابحث بالاسم، رقم الوارد، أو الأماكن..."
        className="w-full pr-11 pl-10 py-3 bg-white border border-gray-200 rounded-2xl text-gray-850 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm text-sm font-medium"
      />

      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 hover:text-gray-650 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default SearchBox;