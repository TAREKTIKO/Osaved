import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import AddModal from "./components/AddModal";
import SettingsModal from "./components/SettingsModal";
import Home from "./pages/Home";
import { getInitialData, deleteRequest } from "./services/googleSheetApi";

function App() {
  const [requests, setRequests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [actions, setActions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [requestToEdit, setRequestToEdit] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await getInitialData();
      setRequests(data.requests || []);
      setCategories(data.categories || []);
      setActions(data.actions || []);
    } catch (error) {
      console.error("Failed to load initial data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditRequest = (request) => {
    setRequestToEdit(request);
    setShowAddModal(true);
  };

  const handleDeleteRequest = async (id) => {
    const isConfirmed = window.confirm("هل أنت متأكد من حذف هذه المعاملة نهائياً؟");
    if (!isConfirmed) return;

    try {
      const result = await deleteRequest(id);
      if (result.success) {
        alert("تم حذف المعاملة بنجاح");
        fetchData();
      } else {
        alert("فشل الحذف: " + (result.message || "خطأ غير معروف"));
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء الاتصال بالقاعدة للحذف");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar 
        openModal={() => { setRequestToEdit(null); setShowAddModal(true); }}
        openSettingsModal={() => setShowSettingsModal(true)}
      />

      <Home 
        requests={requests}
        categories={categories}
        actions={actions}
        isLoading={isLoading}
        onEdit={handleEditRequest}
        onDelete={handleDeleteRequest}
      />

      <AddModal
        isOpen={showAddModal}
        onClose={() => { setShowAddModal(false); setRequestToEdit(null); }}
        categories={categories}
        actions={actions}
        onSuccess={fetchData}
        requestToEdit={requestToEdit}
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        categories={categories}
        actions={actions}
        onSuccess={fetchData}
      />
    </div>
  );
}

export default App;