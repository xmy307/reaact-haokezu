const CITY_KEY = "hkz_city";

// 从本地缓存中拿数据
export const getCity = () => JSON.parse(localStorage.getItem(CITY_KEY));

// 从本地缓存中存数据
export const setCity = curCity => {
  localStorage.setItem(CITY_KEY, JSON.stringify(curCity));
};
