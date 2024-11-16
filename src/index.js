import "./styles.scss";
import "bootstrap";
import * as yup from "yup";
import initView from "./view.js";

const elements = {
  form: document.querySelector(".rss-form"),
  input: document.querySelector("#url-input"),
};

const state = {
  form: {
    status: "filling",
    error: null,
  },
  feeds: [],
};

const watchedState = initView(state, elements);

const buildSchema = (existingFeeds) =>
  yup.object().shape({
    url: yup
      .string()
      .url("Ссылка должна быть валидным URL")
      .notOneOf(existingFeeds, "RSS уже существует"),
  });

elements.form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(elements.form);
  const url = formData.get("url").trim();

  const schema = buildSchema(state.feeds);

  schema
    .validate({ url })
    .then(() => {
      watchedState.feeds.push(url);
      watchedState.form.status = "success";
      watchedState.form.error = null;
    })
    .catch((err) => {
      watchedState.form.status = "error";
      watchedState.form.error = err.message;
    });
});
