import "./styles.scss";
import "bootstrap";
import axios from "axios";
import * as yup from "yup";
import initView from "./view.js";
import i18next from "i18next";
import ru from "../locales/ru.js";
import parseRSS from "./parser.js";
import { uniqueId } from "lodash";

const runApp = () => {
  const i18n = i18next.createInstance();
  i18n
    .init({
      lng: "ru",
      debug: false,
      resources: {
        ru,
      },
    })
    .then(() => {
      yup.setLocale({
        mixed: {
          required: "form.errors.required",
          notOneOf: "form.errors.notUniqueUrl",
        },
        string: {
          url: "form.errors.notValidUrl",
        },
      });

      const elements = {
        form: document.querySelector(".rss-form"),
        input: document.querySelector("#url-input"),
        feedback: document.querySelector(".feedback"),
        feedsContainer: document.querySelector(".feeds"),
        postsContainer: document.querySelector(".posts"),
      };

      const state = {
        form: {
          status: "filling",
          error: null,
        },
        feeds: [],
        posts: [],
      };

      const watchedState = initView(state, elements, i18n);

      const buildSchema = (existingFeeds) =>
        yup.object().shape({
          url: yup.string().required().url().notOneOf(existingFeeds),
        });

      const getProxyUrl = (url) =>
        `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`;

      const updateFeeds = async () => {
        try {
          const promises = state.feeds.map(async (feed) => {
            try {
              const response = await axios.get(getProxyUrl(feed.url));
              const { contents } = response.data;
              const { feed: newFeed, posts } = parseRSS(contents);

              if (
                newFeed.title !== feed.title ||
                newFeed.description !== feed.description
              ) {
                console.warn(`Фид ${feed.url} изменился, обновление данных.`);
              }

              const existingLinks = state.posts.map((post) => post.link);
              const newPosts = posts
                .filter((post) => !existingLinks.includes(post.link))
                .map((post) => ({
                  ...post,
                  id: uniqueId(),
                  feedId: feed.id,
                }));

              if (newPosts.length > 0) {
                watchedState.posts.push(...newPosts);
              }
            } catch (err) {
              console.error(`Ошибка обновления канала ${feed.url}:`, err);
            }
          });

          await Promise.all(promises);
          console.log("Обновление каналов завершено");
        } catch (err) {
          console.error("Ошибка при обновлении каналов:", err);
        }
      };

      const updateInterval = 5000;
      setInterval(updateFeeds, updateInterval);

      elements.form.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(elements.form);
        const url = formData.get("url").trim();

        const schema = buildSchema(state.feeds.map((feed) => feed.url));

        schema
          .validate({ url }, { abortEarly: false })
          .then(() => {
            watchedState.form.status = "loading";
            watchedState.form.error = null;

            return axios
              .get(getProxyUrl(url))
              .then((response) => {
                const { contents } = response.data;
                const { feed, posts } = parseRSS(contents);

                if (!feed.title || !feed.description) {
                  throw new Error("form.errors.notValidRss");
                }

                const feedWithId = {
                  ...feed,
                  id: uniqueId(),
                  url,
                };
                watchedState.feeds.push(feedWithId);

                const postsWithId = posts.map((post) => ({
                  ...post,
                  id: uniqueId(),
                  feedId: feedWithId.id,
                }));
                watchedState.posts.push(...postsWithId);

                watchedState.form.status = "success";
                watchedState.form.status = "success";
              })
              .catch((err) => {
                watchedState.form.status = "error";
                if (err.message === "form.errors.notValidRss") {
                  watchedState.form.error = "form.errors.notValidRss";
                } else if (err.isAxiosError) {
                  watchedState.form.error = "form.errors.network";
                } else {
                  watchedState.form.error = "form.errors.unknown";
                }
              });
          })
          .catch((err) => {
            watchedState.form.status = "error";
            watchedState.form.error = err.errors[0];
          });
      });
    });
};

runApp();
