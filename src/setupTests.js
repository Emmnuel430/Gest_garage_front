import "@testing-library/jest-dom";

// Mock window.matchMedia for Jest (used by Bootstrap Offcanvas, Modals, Responsive queries)
if (typeof window !== "undefined") {
  window.matchMedia =
    window.matchMedia ||
    function (query) {
      return {
        matches: false,
        media: query,
        onchange: null,
        addListener: function () {},
        removeListener: function () {},
        addEventListener: function () {},
        removeEventListener: function () {},
        dispatchEvent: function () {},
      };
    };
}
