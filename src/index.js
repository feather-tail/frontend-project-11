import "./styles.scss";
import "bootstrap";
import * as yup from "yup";
import initView from "./view.js";
import i18next from "i18next";
import ru from "../locales/ru.js";

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
      };

      const state = {
        form: {
          status: "filling",
          error: null,
        },
        feeds: [],
      };

      const watchedState = initView(state, elements, i18n);

      const buildSchema = (existingFeeds) =>
        yup.object().shape({
          url: yup.string().required().url().notOneOf(existingFeeds),
        });

      elements.form.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(elements.form);
        const url = formData.get("url").trim();

        const schema = buildSchema(state.feeds);

        schema
          .validate({ url }, { abortEarly: false })
          .then(() => {
            watchedState.feeds.push(url);
            watchedState.form.status = "success";
            watchedState.form.error = null;
          })
          .catch((err) => {
            watchedState.form.status = "error";
            watchedState.form.error = err.errors[0];
          });
      });
    });
};

runApp();
