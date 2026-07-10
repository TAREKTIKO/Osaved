import { useState, useMemo } from "react";
import SearchBox from "../components/SearchBox";
import Filter from "../components/Filter";
import DataTable from "../components/DataTable";

function Home({ requests, categories, actions, isLoading, onEdit, onDelete }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [sortField, setSortField] = useState("incomingDate");
  const [sortDirection, setSortDirection] = useState("desc");

  // Helper to normalize Arabic text (for spelling variants in searches)
  const normalizeArabic = (text) => {
    if (!text) return "";
    return text
      .toString()
      .toLowerCase()
      .replace(/[أإآ]/g, "ا") // Normalizing Alifs
      .replace(/ة/g, "ه")     // Normalizing Ta Marbuta to Haa
      .replace(/ى/g, "ي")     // Normalizing Alif Maqsura to Yaa
      .replace(/[\u064B-\u065F]/g, ""); // Removing Harakat (diacritics)
  };

  // 1. FILTERING LOGIC
  const filteredRequests = useMemo(() => {
    return requests.filter((item) => {
      // Search matching across multiple columns
      const normalizedQuery = normalizeArabic(searchQuery);
      
      const matchesSearch = normalizedQuery === "" || (
        normalizeArabic(item.name).includes(normalizedQuery) ||
        normalizeArabic(item.category).includes(normalizedQuery) ||
        normalizeArabic(item.incomingNumber).includes(normalizedQuery) ||
        normalizeArabic(item.ourNumber).includes(normalizedQuery) ||
        normalizeArabic(item.fromPlace).includes(normalizedQuery) ||
        normalizeArabic(item.toPlace).includes(normalizedQuery)
      );

      // Category matching
      const matchesCategory = !selectedCategory || item.category === selectedCategory;

      // Action matching
      const matchesAction = !selectedAction || item.action === selectedAction;

      return matchesSearch && matchesCategory && matchesAction;
    });
  }, [requests, searchQuery, selectedCategory, selectedAction]);

  // 2. SORTING LOGIC
  const sortedRequests = useMemo(() => {
    return [...filteredRequests].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (valA === undefined || valA === null) valA = "";
      if (valB === undefined || valB === null) valB = "";

      // Numeric comparison
      if (sortField === "incomingNumber" || sortField === "ourNumber") {
        const numA = parseFloat(valA);
        const numB = parseFloat(valB);
        if (!isNaN(numA) && !isNaN(numB)) {
          return sortDirection === "asc" ? numA - numB : numB - numA;
        }
      }

      // String comparison (works for text, and ISO Dates YYYY-MM-DD)
      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();

      if (strA < strB) return sortDirection === "asc" ? -1 : 1;
      if (strA > strB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredRequests, sortField, sortDirection]);

  // 3. STATS COMPUTATION
  const stats = useMemo(() => {
    const total = requests.length;
    const approved = requests.filter(r => String(r.action).trim() === "موافقة" || String(r.action).toLowerCase() === "approved").length;
    const rejected = requests.filter(r => String(r.action).trim() === "رفض" || String(r.action).toLowerCase() === "rejected").length;
    const saved = requests.filter(r => String(r.action).trim() === "حفظ" || String(r.action).toLowerCase() === "saved").length;

    return { total, approved, rejected, saved };
  }, [requests]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedAction("");
    setSortField("incomingDate");
    setSortDirection("desc");
  };

  const handleSortChangeFromTable = (field) => {
    if (sortField === field) {
      // Toggle direction
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <main className="flex-grow p-4 md:p-8 max-w-7xl w-full mx-auto space-y-6">
      
      {/* Dashboard Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Requests */}
        <div className="bg-white p-5 rounded-3xl border border-gray-250/60 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-bold text-gray-400">إجمالي المعاملات</div>
            <div className="text-2xl font-black text-gray-800">{stats.total}</div>
          </div>
          <span className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </span>
        </div>

        {/* Approved Requests */}
        <div className="bg-white p-5 rounded-3xl border border-gray-250/60 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-bold text-gray-400">تمت الموافقة</div>
            <div className="text-2xl font-black text-emerald-600">{stats.approved}</div>
          </div>
          <span className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
        </div>

        {/* Saved Requests */}
        <div className="bg-white p-5 rounded-3xl border border-gray-250/60 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-bold text-gray-400">حفظ بالأرشيف</div>
            <div className="text-2xl font-black text-blue-600">{stats.saved}</div>
          </div>
          <span className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20" />
            </svg>
          </span>
        </div>

        {/* Rejected Requests */}
        <div className="bg-white p-5 rounded-3xl border border-gray-250/60 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-bold text-gray-400">طلبات مرفوضة</div>
            <div className="text-2xl font-black text-rose-600">{stats.rejected}</div>
          </div>
          <span className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
        </div>
      </div>

      {/* Control Panel (Search & Filters) */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <SearchBox 
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>

        <Filter 
          categories={categories}
          actions={actions}
          selectedCategory={selectedCategory}
          onChangeCategory={setSelectedCategory}
          selectedAction={selectedAction}
          onChangeAction={setSelectedAction}
          sortField={sortField}
          onChangeSortField={setSortField}
          sortDirection={sortDirection}
          onChangeSortDirection={setSortDirection}
          onReset={handleResetFilters}
        />
      </div>

      {/* Loading & Data Table */}
      {isLoading ? (
        <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center shadow-sm">
          <div className="flex flex-col items-center justify-center gap-3">
            <svg className="animate-spin h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-gray-500 font-semibold text-sm">جاري تحميل البيانات من قاعدة البيانات...</span>
          </div>
        </div>
      ) : (
        <DataTable 
          requests={sortedRequests}
          sortField={sortField}
          sortDirection={sortDirection}
          onSortChange={handleSortChangeFromTable}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}

    </main>
  );
}

export default Home;