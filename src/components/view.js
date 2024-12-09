import onChange from 'on-change';
import renderFeeds from './renderFeeds.js';
import renderPosts from './renderPosts.js';
import renderModal from './renderModal.js';

const initView = (state, elements, i18n) => {
  const { input, feedback } = elements;

  const renderForm = () => {
    const { form } = state;

    feedback.classList.remove('text-danger', 'text-success');
    feedback.textContent = '';

    if (form.status === 'success') {
      input.classList.remove('is-invalid');
      input.value = '';
      input.focus();
      feedback.classList.add('text-success');
      feedback.textContent = i18n.t('form.success');
    } else if (form.status === 'error') {
      input.classList.add('is-invalid');
      feedback.classList.add('text-danger');
      feedback.textContent = i18n.t(form.error);
    }

    if (form.status === 'loading') {
      input.setAttribute('readonly', true);
    } else {
      input.removeAttribute('readonly');
    }
  };

  const watchedState = onChange(state, (path) => {
    switch (true) {
      case path === 'form.status' || path === 'form.error':
        renderForm();
        break;

      case path === 'feeds':
        renderFeeds(elements.feedsContainer, state.feeds);
        break;

      case path.startsWith('posts') || path.startsWith('uiState.readPosts'):
        renderPosts(state, elements, watchedState);
        break;

      case path === 'uiState.modal.postId':
        renderModal(state, elements);
        break;

      default:
        break;
    }
  });

  return watchedState;
};

export default initView;
