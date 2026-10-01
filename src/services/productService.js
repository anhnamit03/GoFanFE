const API_URL = '/api/Product'

function normalizeProduct(product) {
  return {
    ...product,
    price: product.discountPrice ?? product.salePrice ?? product.basePrice ?? 0,
    salePrice: product.discountPrice ?? product.salePrice ?? null,
    discountPercent: product.promotion?.discountPercent ?? product.discountPercent,
    image: product.imageUrl || 'https://placehold.co/600x600?text=GoFan',
  }
}

export async function getProducts() {
  const response = await fetch(API_URL)

  if (!response.ok) {
    throw new Error('Không thể lấy danh sách Product')
  }

  const result = await response.json()
  const products = Array.isArray(result) ? result : result.data || []
  return products.map(normalizeProduct)
}

export async function getProductById(id) {
  const response = await fetch(`${API_URL}/${id}`)

  if (!response.ok) {
    throw new Error('Không thể lấy Product')
  }

  const result = await response.json()
  return normalizeProduct(result.data || result)
}