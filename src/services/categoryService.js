const API_URL = '/api/Category'

export async function getCategories() {
  const response = await fetch(API_URL)

  if (!response.ok) {
    throw new Error('Không thể lấy danh sách Category')
  }

  const result = await response.json()
  return Array.isArray(result) ? result : result.data || []
}