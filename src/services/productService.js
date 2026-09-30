const API_URL = 'http://localhost:5142/api/Product'

function normalizeProduct(product) {
  return {
    ...product,
    price: product.salePrice ?? product.basePrice ?? 0,
    image: product.imageUrl || 'https://placehold.co/600x600?text=GoFan',
  }
}

export async function getProducts() {
  const response = await fetch(API_URL)

  if (!response.ok) {
    throw new Error('Không thể lấy danh sách Product')
  }

  const products = await response.json()
  return products.map(normalizeProduct)
}

export async function getProductById(id) {
  const response = await fetch(`${API_URL}/${id}`)

  if (!response.ok) {
    throw new Error('Không thể lấy Product')
  }

  const product = await response.json()
  return normalizeProduct(product)
}