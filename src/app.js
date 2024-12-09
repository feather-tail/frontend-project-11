import * as yup from 'yup';
import initI18n from './i18n.js';
import initView from './components/view.js';
import { updateFeeds } from './utils/updater.js';
import handleFormSubmit from './utils/formHandler.js';

const app = () => {
  initI18n().then((i18n) => {
    yup.setLocale({
      mixed: {
        required: 'form.errors.required',
        notOneOf: 'form.errors.notUniqueUrl',
      },
      string: {
        url: 'form.errors.notValidUrl',
      },
    });

    const elements = {
      form: document.querySelector('.rss-form'),
      input: document.querySelector('#url-input'),
      feedback: document.querySelector('.feedback'),
      feedsContainer: document.querySelector('.feeds'),
      postsContainer: document.querySelector('.posts'),
      modalContainer: document.body,
    };

    const state = {
      form: {
        status: 'filling',
        error: null,
      },
      feeds: [],
      posts: [],
      uiState: {
        readPosts: new Set(),
        modal: {
          postId: null,
        },
      },
    };

    const watchedState = initView(state, elements, i18n);

    setTimeout(() => updateFeeds(state, watchedState), 5000);

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleFormSubmit(e, state, watchedState, elements, i18n);
    });
  });
};

export default app;
