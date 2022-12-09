export const SessionStorage = {
  setItem: (key, value) => { sessionStorage.setItem(key, value); },
  getItem: (key) => {
      var value = sessionStorage.getItem(key);
      if (value && value.startsWith("function")) {
          return eval("(" + value + ")()");
      }
      return value;
  },
  removeItem: (key) => { sessionStorage.removeItem(key); },
  clearAll: () => { sessionStorage.clear(); }
}