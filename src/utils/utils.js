export const getProxyUrl = (url) =>
  `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(
    url
  )}`;

export default getProxyUrl;
