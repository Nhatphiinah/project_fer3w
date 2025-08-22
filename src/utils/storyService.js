/*
 * Assignment create by Group 2
 */
import storyList from "../data/stories.json";

// Hàm đồng bộ dữ liệu từ stories.json vào localStorage
export const initializeStories = () => {
  const storedStories = localStorage.getItem("stories");

  if (!storedStories) {
    // Nếu localStorage chưa có dữ liệu, sao chép từ stories.json
    localStorage.setItem("stories", JSON.stringify(storyList.stories));
  }
};

// Hàm lấy danh sách sách từ localStorage
export const getStories = () => {
  const storedStories = localStorage.getItem("stories");
  return storedStories ? JSON.parse(storedStories) : [];
};

// Hàm cập nhật danh sách sách trong localStorage
export const updateStories = (updatedStories) => {
  localStorage.setItem("stories", JSON.stringify(updatedStories));
};
