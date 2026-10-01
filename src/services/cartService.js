const API_URL = '/api/Cart'

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
    throw new Error(validationMessage || data?.message || data?.title || 'Thao tác giỏ hàng thất bại.')
  }

  return data?.data ?? data
}

async function request(path = '', options = {}, token = '') {
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

export function normalizeCartItem(serverItem) {
  return {
    id: serverItem.productId ?? serverItem.id,
    cartItemId: serverItem.id,
    name: serverItem.name,
    sku: serverItem.sku || '',
    price: Number(serverItem.unitPrice ?? serverItem.basePrice ?? 0),
    basePrice: Number(serverItem.basePrice ?? serverItem.unitPrice ?? 0),
    discountPercent: serverItem.discountPercent,
    image: serverItem.image || 'https://placehold.co/600x600?text=GoFan',
    quantity: serverItem.quantity,
    subtotal: Number(serverItem.subtotal ?? 0),
    relatedProducts: (serverItem.addOns || []).map((addon) => ({
      id: addon.addOnProductId,
      addOnProductId: addon.addOnProductId,
      name: addon.name,
      sku: addon.sku,
      price: addon.unitPrice,
      image: addon.image,
      quantity: addon.quantity,
    })),
  }
}

export function normalizeCart(serverCart) {
  const items = Array.isArray(serverCart?.items)
    ? serverCart.items.map(normalizeCartItem)
    : []

  return {
    id: serverCart?.id,
    customerId: serverCart?.customerId,
    totalAmount: Number(serverCart?.totalAmount ?? 0),
    totalItems: Number(serverCart?.totalItems ?? 0),
    items,
  }
}

export async function getCartApi(token) {
  const data = await request('', { method: 'GET' }, token)
  return normalizeCart(data)
}

export async function addToCartApi(token, { productId, quantity = 1, addOnProductIds = [] }) {
  const data = await request('/items', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity, addOnProductIds }),
  }, token)
  return normalizeCart(data)
}

export async function updateCartItemQuantityApi(token, cartItemId, quantity) {
  const data = await request(`/items/${cartItemId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  }, token)
  return normalizeCart(data)
}

export async function removeCartItemApi(token, cartItemId) {
  const data = await request(`/items/${cartItemId}`, {
    method: 'DELETE',
  }, token)
  return normalizeCart(data)
}

export async function clearCartApi(token) {
  const data = await request('', {
    method: 'DELETE',
  }, token)
  return normalizeCart(data)
}

export async function syncCartApi(token, items) {
  const syncItems = items.map((item) => ({
    productId: item.productId || item.id,
    quantity: item.quantity,
    addOnProductIds: Array.isArray(item.relatedProducts)
      ? item.relatedProducts.map((r) => r.addOnProductId || r.id).filter(Boolean)
      : [],
  }))

  const data = await request('/sync', {
    method: 'POST',
    body: JSON.stringify({ items: syncItems }),
  }, token)
  return normalizeCart(data)
}
