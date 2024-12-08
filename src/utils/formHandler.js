import axios from 'axios';
import { uniqueId } from 'lodash';
import parseRSS from './parser.js';
import buildSchema from './schema.js';
import getProxyUrl from './utils.js';

const handleFormSubmit = (event, stateArg, watchedStateArg, elements, i18n) => {
  const state = stateArg;
  const watchedState = watchedStateArg;

  const formData = new FormData(elements.form);
  const url = formData.get('url').trim();
  const schema = buildSchema(state.feeds.map((feed) => feed.url));

  schema
    .validate({ url }, { abortEarly: false })
    .then(() => {
      watchedState.form.status = 'loading';
      watchedState.form.error = null;

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
          watchedState.feeds.push(feedWithId);

          const postsWithId = posts.map((post) => ({
            ...post,
            id: uniqueId(),
            feedId: feedWithId.id,
          }));
          watchedState.posts.unshift(...postsWithId);

          watchedState.form.status = 'success';
        })
        .catch((err) => {
          watchedState.form.status = 'error';
          if (err.isParsingError) {
            watchedState.form.error = 'form.errors.notValidRss';
          } else if (err.isAxiosError) {
            watchedState.form.error = 'form.errors.network';
          } else {
            watchedState.form.error = 'form.errors.unknown';
          }
        });
    })
    .catch((err) => {
      watchedState.form.status = 'error';
      watchedState.form.error = err.errors[0];
    });
};

export default handleFormSubmit;
