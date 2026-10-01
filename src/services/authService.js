const API_URL = `${import.meta.env.VITE_API_URL || ''}/api/Auth`

async function parseResponse(response) {
  const text = await response.text()
  let data

  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = text || null
  }

  if (!response.ok) {
    const validationMessage = data?.errors
      ? Object.values(data.errors).flat().join(' ')
      : ''
    throw new Error(validationMessage || data?.message || data?.title || 'Yêu cầu không thành công.')
  }

  return data
}

async function request(path, options = {}, token = '') {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  return parseResponse(response)
}

function getToken(data) {
  return data?.token || data?.accessToken || data?.jwt || data?.data?.token || data?.data?.accessToken || ''
}

export function normalizeUser(data) {
  const user = data?.user
    || data?.profile
    || data?.data?.user
    || data?.data?.profile
    || data?.data
    || data
    || {}
  return {
    ...user,
    id: user.id || user.userId || user.customerId,
    fullName: user.fullName || user.name || user.userName || user.username || '',
    email: user.email || '',
    phone: user.phone || user.phoneNumber || '',
    address: user.address || user.shippingAddress || '',
  }
}

function normalizeAddresses(data) {
  const addresses = data?.data?.addresses || data?.addresses || data?.data || data
  return Array.isArray(addresses) ? addresses : []
}

export async function loginCustomer(credentials) {
  const data = await request('/customer/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
  return { token: getToken(data), user: normalizeUser(data), data }
}

export async function registerCustomer(credentials) {
  const data = await request('/customer/register', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
  return { token: getToken(data), user: normalizeUser(data), data }
}

export async function getProfile(token) {
  const data = await request('/profile', {}, token)
  return normalizeUser(data)
}

export async function getAddresses(token) {
  const data = await request('/addresses', {}, token)
  return normalizeAddresses(data)
}

export async function createAddress(token, address) {
  return request('/addresses', {
    method: 'POST',
    body: JSON.stringify(address),
  }, token)
}

export async function updateAddress(token, addressId, address) {
  return request(`/addresses/${addressId}`, {
    method: 'PUT',
    body: JSON.stringify(address),
  }, token)
}

export async function deleteAddress(token, addressId) {
  return request(`/addresses/${addressId}`, { method: 'DELETE' }, token)
}

export async function setDefaultAddress(token, addressId) {
  return request(`/addresses/${addressId}/default`, { method: 'PATCH' }, token)
}

export async function updateProfile(token, profile) {
  const data = await request('/profile', {
    method: 'PUT',
    body: JSON.stringify(profile),
  }, token)
  return normalizeUser(data)
}

export async function uploadAvatar(token, file) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_URL}/avatar`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  })

  return parseResponse(response)
}