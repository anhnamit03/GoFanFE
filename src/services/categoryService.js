const API_URL = 'http://localhost:5142/api/Category'

export async function getCategories() {
  const response = await fetch(API_URL)

  if (!response.ok) {
    throw new Error('Không thể lấy danh sách Category')
  }

  return await response.json()
}