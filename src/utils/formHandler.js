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
      const { form, feeds, posts } = watchedState;
      form.status = 'loading';
      form.error = null;

      return axios
        .get(getProxyUrl(url))
        .then((response) => {
          const { contents } = response.data;
          const { feed, posts: newPosts } = parseRSS(contents);

          const feedWithId = {
            ...feed,
            id: uniqueId(),
            url,
          };
          feeds.push(feedWithId);

          const postsWithId = newPosts.map((post) => ({
            ...post,
            id: uniqueId(),
            feedId: feedWithId.id,
          }));
          posts.unshift(...postsWithId);

          form.status = 'success';
        })
        .catch((err) => {
          form.status = 'error';
          if (err.isParsingError) {
            form.error = 'form.errors.notValidRss';
          } else if (err.isAxiosError) {
            form.error = 'form.errors.network';
          } else {
            form.error = 'form.errors.unknown';
          }
        });
    })
    .catch((err) => {
      const { form } = watchedState;
      form.status = 'error';
      const [firstError] = err.errors;
      form.error = firstError;
    });
};

export default handleFormSubmit;
