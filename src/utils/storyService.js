/*
 * Assignment create by Group 2
 */

const API_BASE_URL = 'http://localhost:5000';

// Hàm lấy danh sách sách từ API
export const getStories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/stories`);
    if (!response.ok) {
      throw new Error('Failed to fetch stories');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching stories:', error);
    return [];
  }
};

// Hàm lấy sách theo ID
export const getStoryById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/stories/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch story');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching story:', error);
    return null;
  }
};

// Hàm cập nhật lượt xem
export const updateStoryViewCount = async (id, newViewCount) => {
  try {
    const response = await fetch(`${API_BASE_URL}/stories/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ viewCount: newViewCount }),
    });
    if (!response.ok) {
      throw new Error('Failed to update view count');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating view count:', error);
    return null;
  }
};

// Hàm lấy sách theo thể loại
export const getStoriesByGenre = async (genre) => {
  try {
    const response = await fetch(`${API_BASE_URL}/stories?genre=${encodeURIComponent(genre)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch stories by genre');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching stories by genre:', error);
    return [];
  }
};

// Hàm tìm kiếm sách
export const searchStories = async (query) => {
  try {
    const response = await fetch(`${API_BASE_URL}/stories?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search stories');
    }
    return await response.json();
  } catch (error) {
    console.error('Error searching stories:', error);
    return [];
  }
};
