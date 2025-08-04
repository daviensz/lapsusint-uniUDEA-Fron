const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

export async function getPaymentMethods(token) {
  const res = await fetch(`${API_URL}/payment-methods`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Error al obtener métodos de pago");
  return res.json();
}

export async function addPaymentMethod(token, data) {
  const res = await fetch(`${API_URL}/payment-methods`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Error al agregar método de pago");
  return res.json();
}

export async function deletePaymentMethod(token, id) {
  const res = await fetch(`${API_URL}/payment-methods/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Error al eliminar método de pago");
}