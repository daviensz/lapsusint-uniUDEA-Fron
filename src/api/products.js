const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

// Función para subir imagen de producto a S3
export async function uploadImageToS3(token, file) {
  console.log('=== UPLOAD IMAGE TO S3 ===');
  console.log('File:', file);
  console.log('File name:', file.name);
  console.log('File type:', file.type);
  console.log('File size:', file.size);
  
  if (!token) {
    throw new Error('No authentication token provided');
  }
  
  if (!file) {
    throw new Error('No file provided');
  }
  
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const res = await fetch(`${API_URL}/licenses/upload-image`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    
    console.log('Upload response status:', res.status);
    console.log('Upload response ok:', res.ok);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Upload error response:', errorText);
      throw new Error(`Error uploading image: ${res.status} - ${errorText}`);
    }
    
    const result = await res.json();
    console.log('Upload result:', result);
    return result.url; // Retorna la URL de S3
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

export async function fetchProducts() {
  const res = await fetch(`${API_URL}/licenses/products`);
  if (!res.ok) throw new Error("Error fetching products");
  return res.json();
}

export async function createProduct(token, data) {
  console.log('=== CREATE PRODUCT API ===');
  console.log('Data:', data);
  console.log('Token:', token ? 'Present' : 'Missing');
  
  if (!token) {
    throw new Error('No authentication token provided');
  }
  
  let imageUrl = null;
  
  // Si hay una imagen, subirla a S3 primero
  if (data.image && data.image instanceof File) {
    console.log('Uploading image to S3...');
    try {
      imageUrl = await uploadImageToS3(token, data.image);
      console.log('Image uploaded successfully:', imageUrl);
    } catch (error) {
      console.error('Failed to upload image:', error);
      throw new Error(`Error uploading image: ${error.message}`);
    }
  }
  
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("short_description", data.short_description || "");
  formData.append("details", data.details || "");
  formData.append("requirements", data.requirements || "");
  formData.append("version", data.version || "");
  formData.append("platform", data.platform || "");
  formData.append("description", data.description || "");
  formData.append("price", data.price);
  
  // Solo enviar precios si son mayores que 0
  formData.append("price_one_week", data.price_one_week > 0 ? data.price_one_week : "");
  formData.append("price_one_month", data.price_one_month > 0 ? data.price_one_month : "");
  formData.append("price_three_months", data.price_three_months > 0 ? data.price_three_months : "");
  formData.append("price_lifetime", data.price_lifetime > 0 ? data.price_lifetime : "");
  
  // Agregar la URL de la imagen si se subió exitosamente
  if (imageUrl) {
    formData.append("image_url", imageUrl);
  }

  console.log('FormData contents:');
  for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }

  try {
    const res = await fetch(`${API_URL}/licenses/products`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    
    console.log('Response status:', res.status);
    console.log('Response ok:', res.ok);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error response:', errorText);
      throw new Error(`Error creating product: ${res.status} - ${errorText}`);
    }
    
    const result = await res.json();
    console.log('Create result:', result);
    return result;
  } catch (error) {
    console.error('Network or parsing error:', error);
    throw error;
  }
}

export async function updateProduct(token, id, data) {
  console.log('=== UPDATE PRODUCT API ===');
  console.log('ID:', id);
  console.log('Data:', data);
  console.log('Token:', token ? 'Present' : 'Missing');
  
  if (!token) {
    throw new Error('No authentication token provided');
  }
  
  if (!id) {
    throw new Error('No product ID provided');
  }
  
  let imageUrl = null;
  
  // Si hay una imagen, subirla a S3 primero
  if (data.image && data.image instanceof File) {
    console.log('Uploading image to S3...');
    try {
      imageUrl = await uploadImageToS3(token, data.image);
      console.log('Image uploaded successfully:', imageUrl);
    } catch (error) {
      console.error('Failed to upload image:', error);
      throw new Error(`Error uploading image: ${error.message}`);
    }
  }
  
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("short_description", data.short_description || "");
  formData.append("details", data.details || "");
  formData.append("requirements", data.requirements || "");
  formData.append("version", data.version || "");
  formData.append("platform", data.platform || "");
  formData.append("description", data.description || "");
  formData.append("price", data.price);
  
  // Solo enviar precios si son mayores que 0
  formData.append("price_one_week", data.price_one_week > 0 ? data.price_one_week : "");
  formData.append("price_one_month", data.price_one_month > 0 ? data.price_one_month : "");
  formData.append("price_three_months", data.price_three_months > 0 ? data.price_three_months : "");
  formData.append("price_lifetime", data.price_lifetime > 0 ? data.price_lifetime : "");
  
  // Agregar la URL de la imagen si se subió exitosamente
  if (imageUrl) {
    formData.append("image_url", imageUrl);
  }

  const url = `${API_URL}/licenses/products/${id}`;
  console.log('Request URL:', url);
  
  console.log('FormData contents:');
  for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }

  try {
    const res = await fetch(url, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    
    console.log('Response status:', res.status);
    console.log('Response ok:', res.ok);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error response:', errorText);
      throw new Error(`Error updating product: ${res.status} - ${errorText}`);
    }
    
    const result = await res.json();
    console.log('Update result:', result);
    return result;
  } catch (error) {
    console.error('Network or parsing error:', error);
    throw error;
  }
}

export async function deleteProduct(token, id) {
  console.log('=== DELETE PRODUCT API ===');
  console.log('ID:', id);
  console.log('Token:', token ? 'Present' : 'Missing');
  
  if (!token) {
    throw new Error('No authentication token provided');
  }
  
  if (!id) {
    throw new Error('No product ID provided');
  }
  
  const url = `${API_URL}/licenses/products/${id}`;
  console.log('Request URL:', url);

  try {
    const res = await fetch(url, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    
    console.log('Response status:', res.status);
    console.log('Response ok:', res.ok);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error response:', errorText);
      throw new Error(`Error deleting product: ${res.status} - ${errorText}`);
    }
    
    const result = await res.json();
    console.log('Delete result:', result);
    return result;
  } catch (error) {
    console.error('Network or parsing error:', error);
    throw error;
  }
}

// --- NUEVAS FUNCIONES PARA EL SISTEMA DE LICENCIAS ---

export async function createOrder(token, orderData) {
  const res = await fetch(`${API_URL}/licenses/orders`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error("Error al crear orden");
  return res.json();
}

export async function completePurchase(token, orderId) {
  const res = await fetch(`${API_URL}/licenses/orders/${orderId}/complete`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al completar compra");
  return res.json();
}

export async function validateLicense(licenseKey) {
  const res = await fetch(`${API_URL}/licenses/validate-license`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ license_key: licenseKey }),
  });
  if (!res.ok) throw new Error("Licencia inválida");
  return res.json();
}

export async function getUserLicenses(token) {
  const res = await fetch(`${API_URL}/licenses/user/licenses`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al obtener licencias");
  return res.json();
}

export async function getUserOrders(token) {
  const res = await fetch(`${API_URL}/licenses/user/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al obtener órdenes");
  return res.json();
}

export async function addProductWithKey(token, licenseKey) {
  const res = await fetch(`${API_URL}/licenses/add-product-with-key`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify({ license_key: licenseKey }),
  });
  if (!res.ok) throw new Error("Error al agregar producto");
  return res.json();
}