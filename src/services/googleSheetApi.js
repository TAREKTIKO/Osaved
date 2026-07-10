const API_URL = "https://script.google.com/macros/s/AKfycbyDnhV3n15qBgtqP8A5L3rXrF83dr7l6jI7mymXMu8SAFAebtzy2uQyJLj4RvXK2Snd/exec";



// Adapter: map actual API request field names to React field names
// Based on actual API response:
//   category_id = person name, name = category, incoming_number, incoming_date,
//   our_number, our_date, from_place, to_place, action_id
function mapRequest(raw) {
  return {
    id: raw.id,
    name: raw.category_id || raw.name || "",
    category: raw.name || raw.category || "",
    incomingNumber: raw.incoming_number || raw.incomingNumber || "",
    incomingDate: toInputDate(raw.incoming_date || raw.incomingDate || ""),
    ourNumber: raw.our_number || raw.ourNumber || "",
    ourDate: toInputDate(raw.our_date || raw.ourDate || ""),
    fromPlace: raw.from_place || raw.fromPlace || "",
    toPlace: raw.to_place || raw.toPlace || "",
    action: raw.action_id || raw.action || "",
    notes: raw.notes || "",
    createdAt: toInputDate(raw.created_at || raw.createdAt || ""),
  };
}

// Convert ISO date string → YYYY-MM-DD (required by <input type="date">)
function toInputDate(dateStr) {
  if (!dateStr) return "";
  try {
    // Already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(String(dateStr))) return String(dateStr);
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
  } catch {
    return "";
  }
}

// GET ALL INITIAL DATA (Requests, Categories, Actions)
export async function getInitialData() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    return {
      requests: (data.requests || []).map(mapRequest),
      categories: data.categories || [],
      actions: data.actions || [],
    };
  } catch (error) {
    console.error("Error fetching initial data:", error);
    return { requests: [], categories: [], actions: [] };
  }
}

// Reverse-map React field names → actual sheet column names for POST requests
function toSheetFields(formData) {
  return {
    category_id: formData.name || "",
    name: formData.category || "",
    incoming_number: formData.incomingNumber || "",
    incoming_date: formData.incomingDate || "",
    our_number: formData.ourNumber || "",
    our_date: formData.ourDate || "",
    from_place: formData.fromPlace || "",
    to_place: formData.toPlace || "",
    action_id: formData.action || "",
    notes: formData.notes || "",
    created_at: formData.createdAt || "",
  };
}

// ADD NEW REQUEST
export async function addRequest(requestData) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify({
        type: "request",
        actionType: "add",
        ...toSheetFields(requestData)
      })
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error adding request:", error);
    return { success: false };
  }
}

// ADD NEW CATEGORY
export async function addCategory(name) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify({
        type: "category",
        actionType: "add",
        name
      })
    });
    return await response.json();
  } catch (error) {
    console.error("Error adding category:", error);
    return { success: false };
  }
}

// DELETE CATEGORY
export async function deleteCategory(id) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify({
        type: "category",
        actionType: "delete",
        id
      })
    });
    return await response.json();
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false };
  }
}

// ADD NEW ACTION
export async function addAction(name) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify({
        type: "action",
        actionType: "add",
        name
      })
    });
    return await response.json();
  } catch (error) {
    console.error("Error adding action:", error);
    return { success: false };
  }
}

// DELETE ACTION
export async function deleteAction(id) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify({
        type: "action",
        actionType: "delete",
        id
      })
    });
    return await response.json();
  } catch (error) {
    console.error("Error deleting action:", error);
    return { success: false };
  }
}

// DELETE REQUEST
export async function deleteRequest(id) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify({
        type: "request",
        actionType: "delete",
        id
      })
    });
    return await response.json();
  } catch (error) {
    console.error("Error deleting request:", error);
    return { success: false };
  }
}

// UPDATE REQUEST
export async function updateRequest(id, requestData) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify({
        type: "request",
        actionType: "edit",
        id,
        ...toSheetFields(requestData)
      })
    });
    return await response.json();
  } catch (error) {
    console.error("Error updating request:", error);
    return { success: false };
  }
}