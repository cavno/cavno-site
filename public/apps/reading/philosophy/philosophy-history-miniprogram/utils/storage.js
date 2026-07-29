const PROGRESS_KEY = "courseProgress";
const FAVORITES_KEY = "favoriteLectures";

function getProgress() {
  return wx.getStorageSync(PROGRESS_KEY) || {
    lastLectureId: 1,
    readLectures: []
  };
}

function markLectureRead(lectureId) {
  const progress = getProgress();
  const readLectures = Array.from(new Set([
    ...(progress.readLectures || []),
    lectureId
  ]));
  const next = {
    lastLectureId: lectureId,
    readLectures
  };
  wx.setStorageSync(PROGRESS_KEY, next);
  return next;
}

function getFavorites() {
  return wx.getStorageSync(FAVORITES_KEY) || [];
}

function toggleFavorite(lectureId) {
  const favorites = getFavorites();
  const exists = favorites.includes(lectureId);
  const next = exists
    ? favorites.filter((id) => id !== lectureId)
    : [...favorites, lectureId];
  wx.setStorageSync(FAVORITES_KEY, next);
  return next;
}

module.exports = {
  getProgress,
  markLectureRead,
  getFavorites,
  toggleFavorite
};
