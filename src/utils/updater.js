import axios from "axios";
import { uniqueId } from "lodash";
import parseRSS from "../utils/parser.js";
import getProxyUrl from "./utils.js";

export const updatePosts = (feed, state, watchedState) =>
  axios
    .get(getProxyUrl(feed.url))
    .then((response) => {
      const { contents } = response.data;
      const { posts } = parseRSS(contents);

      const existingLinks = state.posts.map((post) => post.link);
      const newPosts = posts
        .filter((post) => !existingLinks.includes(post.link))
        .map((post) => ({ ...post, id: uniqueId(), feedId: feed.id }));

      if (newPosts.length > 0) {
        watchedState.posts.unshift(...newPosts);
      }
    })
    .catch((err) => {
      console.error(`Ошибка обновления канала ${feed.url}:`, err);
    });

export const updateFeeds = (state, watchedState) => {
  const promises = state.feeds.map((feed) =>
    updatePosts(feed, state, watchedState)
  );

  Promise.all(promises).finally(() => {
    setTimeout(() => updateFeeds(state, watchedState), 5000);
  });
};