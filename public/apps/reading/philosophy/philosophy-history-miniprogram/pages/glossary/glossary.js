const { categories, terms } = require("../../data/glossary");

Page({
  data: {
    categories,
    activeCategory: "全部",
    keyword: "",
    filteredTerms: terms,
    resultCount: terms.length
  },

  onInput(event) {
    this.setData({
      keyword: event.detail.value
    });
    this.filterTerms(event.detail.value, this.data.activeCategory);
  },

  clearSearch() {
    this.setData({
      keyword: ""
    });
    this.filterTerms("", this.data.activeCategory);
  },

  selectCategory(event) {
    const category = event.currentTarget.dataset.category;
    this.setData({
      activeCategory: category
    });
    this.filterTerms(this.data.keyword, category);
  },

  filterTerms(keyword, category) {
    const normalized = String(keyword || "").trim().toLowerCase();
    const filteredTerms = terms.filter((item) => {
      const inCategory = category === "全部" || item.category === category;
      const haystack = [
        item.term,
        item.original,
        item.brief,
        item.evolution
      ].join(" ").toLowerCase();
      return inCategory && (!normalized || haystack.includes(normalized));
    });

    this.setData({
      filteredTerms,
      resultCount: filteredTerms.length
    });
  },

  goLecture(event) {
    const id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/lecture/lecture?id=${id}`
    });
  }
});
