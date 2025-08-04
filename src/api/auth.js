const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export async function login(username, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ username, password }),
  });
  if (!res.ok) throw new Error("Credenciales incorrectas");
  return res.json();
}

export async function register({ username, password, email, role }) {
  const body = { username, password, email };
  if (role) body.role = role;
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Error al registrar usuario");
  return res.json();
}

export async function deleteUserLicenseUser(token, licenseId) {
  const res = await fetch(`${API_URL}/user/licenses/${licenseId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al eliminar licencia");
  return res.json();
}

export async function getAllLicenses(token) {
  const res = await fetch(`${API_URL}/licenses/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al obtener licencias");
  return res.json();
}

export async function adminDeleteLicense(token, licenseId) {
  const res = await fetch(`${API_URL}/admin/licenses/${licenseId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al eliminar licencia");
  return res.json();
}

export async function getAllUsers(token) {
  const res = await fetch(`${API_URL}/users/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al obtener usuarios");
  return res.json();
}

export async function updateUserRole(token, userId, newRole) {
  const res = await fetch(`${API_URL}/users/${userId}`, {
    method: "PUT",
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ role: newRole })
  });
  if (!res.ok) throw new Error("Error al actualizar rol");
  return res.json();
}

export async function getSystemStatistics(token) {
  console.log('🔍 getSystemStatistics API llamado');
  console.log('📋 token disponible:', token ? 'Sí' : 'No');
  
  try {
    const url = `${API_URL}/dev/statistics`;
    console.log('📡 URL:', url);
    
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    console.log('📡 Response status:', res.status);
    console.log('📡 Response ok:', res.ok);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ Error response:', errorText);
      throw new Error(`Error al obtener estadísticas: ${res.status} - ${errorText}`);
    }
    
    const data = await res.json();
    console.log('✅ getSystemStatistics exitoso:', data);
    return data;
  } catch (error) {
    console.error('❌ Error en getSystemStatistics:', error);
    throw error;
  }
}

export async function getUserDetails(token, userId) {
  console.log('🔍 getUserDetails API llamado');
  console.log('📋 userId:', userId, 'tipo:', typeof userId);
  console.log('📋 token disponible:', token ? 'Sí' : 'No');
  
  try {
    const url = `${API_URL}/dev/users/${userId}/details`;
    console.log('📡 URL:', url);
    
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    console.log('📡 Response status:', res.status);
    console.log('📡 Response ok:', res.ok);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ Error response:', errorText);
      throw new Error(`Error al obtener detalles del usuario: ${res.status} - ${errorText}`);
    }
    
    const data = await res.json();
    console.log('✅ getUserDetails exitoso:', data);
    return data;
  } catch (error) {
    console.error('❌ Error en getUserDetails:', error);
    throw error;
  }
}

export async function deleteUserLicense(token, licenseId) {
  console.log('🔍 deleteUserLicense API llamado');
  console.log('📋 licenseId:', licenseId, 'tipo:', typeof licenseId);
  console.log('📋 token disponible:', token ? 'Sí' : 'No');
  
  try {
    const url = `${API_URL}/dev/licenses/${licenseId}`;
    console.log('📡 URL:', url);
    
    const res = await fetch(url, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    
    console.log('📡 Response status:', res.status);
    console.log('📡 Response ok:', res.ok);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ Error response:', errorText);
      throw new Error(`Error al eliminar licencia: ${res.status} - ${errorText}`);
    }
    
    const data = await res.json();
    console.log('✅ deleteUserLicense exitoso:', data);
    return data;
  } catch (error) {
    console.error('❌ Error en deleteUserLicense:', error);
    throw error;
  }
}

export async function deleteUser(token, userId) {
  console.log('🔍 deleteUser API llamado');
  console.log('📋 userId:', userId, 'tipo:', typeof userId);
  console.log('📋 token disponible:', token ? 'Sí' : 'No');
  
  try {
    const url = `${API_URL}/users/${userId}`;
    console.log('📡 URL:', url);
    
    const res = await fetch(url, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    
    console.log('📡 Response status:', res.status);
    console.log('📡 Response ok:', res.ok);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ Error response:', errorText);
      throw new Error(`Error al eliminar usuario: ${res.status} - ${errorText}`);
    }
    
    const data = await res.json();
    console.log('✅ deleteUser exitoso:', data);
    return data;
  } catch (error) {
    console.error('❌ Error en deleteUser:', error);
    throw error;
  }
}

export async function getUserLicenses(token) {
  const res = await fetch(`${API_URL}/licenses/user/licenses`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Error al obtener licencias");
  return res.json();
}

// Función temporal para debug sin autenticación
export async function debugGetUserDetails(userId) {
  console.log('🔍 debugGetUserDetails API llamado');
  console.log('📋 userId:', userId);
  
  try {
    const url = `${API_URL}/debug/user-details/${userId}`;
    console.log('📡 URL:', url);
    
    const res = await fetch(url);
    
    console.log('📡 Response status:', res.status);
    console.log('📡 Response ok:', res.ok);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ Error response:', errorText);
      throw new Error(`Error en debug: ${res.status} - ${errorText}`);
    }
    
    const data = await res.json();
    console.log('✅ debugGetUserDetails exitoso:', data);
    return data;
  } catch (error) {
    console.error('❌ Error en debugGetUserDetails:', error);
    throw error;
  }
}

// Función temporal para debug eliminar licencias sin autenticación
export async function debugDeleteUserLicense(licenseId) {
  console.log('🔍 debugDeleteUserLicense API llamado');
  console.log('📋 licenseId:', licenseId, 'tipo:', typeof licenseId);
  
  try {
    const url = `${API_URL}/debug/licenses/${licenseId}/delete`;
    console.log('📡 URL:', url);
    
    const res = await fetch(url, {
      method: "POST"
    });
    
    console.log('📡 Response status:', res.status);
    console.log('📡 Response ok:', res.ok);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ Error response:', errorText);
      throw new Error(`Error en debug eliminar: ${res.status} - ${errorText}`);
    }
    
    const data = await res.json();
    console.log('✅ debugDeleteUserLicense exitoso:', data);
    return data;
  } catch (error) {
    console.error('❌ Error en debugDeleteUserLicense:', error);
    throw error;
  }
}

// Función temporal para debug estadísticas sin autenticación
export async function debugGetStatistics() {
  console.log('🔍 debugGetStatistics API llamado');
  
  try {
    const url = `${API_URL}/debug/statistics`;
    console.log('📡 URL:', url);
    
    const res = await fetch(url);
    
    console.log('📡 Response status:', res.status);
    console.log('📡 Response ok:', res.ok);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ Error response:', errorText);
      throw new Error(`Error en debug estadísticas: ${res.status} - ${errorText}`);
    }
    
    const data = await res.json();
    console.log('✅ debugGetStatistics exitoso:', data);
    return data;
  } catch (error) {
    console.error('❌ Error en debugGetStatistics:', error);
    throw error;
  }
}

// Función para subir foto de perfil a S3
export async function uploadProfilePic(token, file) {
  console.log('=== UPLOAD PROFILE PIC TO S3 ===');
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
    const res = await fetch(`${API_URL}/upload-profile-pic`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    
    console.log('Upload response status:', res.status);
    console.log('Upload response ok:', res.ok);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Upload error response:', errorText);
      throw new Error(`Error uploading profile picture: ${res.status} - ${errorText}`);
    }
    
    const result = await res.json();
    console.log('Upload result:', result);
    return result.url; // Retorna la URL de S3
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}