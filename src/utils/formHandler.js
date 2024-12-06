import axios from 'axios';
import { uniqueId } from 'lodash';
import parseRSS from './parser.js';
import buildSchema from './schema.js';
import getProxyUrl from './utils.js';

const handleFormSubmit = (event, state, watchedState, elements) => {
  const formData = new FormData(elements.form);
  const url = formData.get('url').trim();

  const schema = buildSchema(state.feeds.map((feed) => feed.url));

  schema
    .validate({ url }, { abortEarly: false })
    .then(() => {
      const updatedForm = {
        ...watchedState.form,
        status: 'loading',
        error: null,
      };
      watchedState.form = updatedForm;

      return axios
        .get(getProxyUrl(url))
        .then((response) => {
          const { contents } = response.data;
          const { feed, posts } = parseRSS(contents);

          const feedWithId = {
            ...feed,
            id: uniqueId(),
            url,
          };

          const updatedFeeds = [...watchedState.feeds, feedWithId];
          watchedState.feeds = updatedFeeds;

          const postsWithId = posts.map((post) => ({
            ...post,
            id: uniqueId(),
            feedId: feedWithId.id,
          }));

          const updatedPosts = [...postsWithId, ...watchedState.posts];
          watchedState.posts = updatedPosts;

          const successForm = { ...watchedState.form, status: 'success' };
          watchedState.form = successForm;
        })
        .catch((err) => {
          const errorForm = { ...watchedState.form, status: 'error' };
          if (err.isParsingError) {
            errorForm.error = 'form.errors.notValidRss';
          } else if (err.isAxiosError) {
            errorForm.error = 'form.errors.network';
          } else {
            errorForm.error = 'form.errors.unknown';
          }
          watchedState.form = errorForm;
        });
    })
    .catch((err) => {
      const errorForm = {
        ...watchedState.form,
        status: 'error',
        error: err.errors[0],
      };
      watchedState.form = errorForm;
    });
};

export default handleFormSubmit;
