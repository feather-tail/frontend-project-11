import { Modal } from 'bootstrap';

const initControllers = (state, watchedState, elements, i18n) => {
  const { postsContainer } = elements;

  postsContainer.addEventListener('click', (event) => {
    const { target } = event;
    if (!target.dataset.id) return;

    const postId = target.dataset.id;
    if (target.tagName === 'A') {
      watchedState.uiState.readPosts.add(postId);
    }

    if (target.tagName === 'BUTTON') {
      watchedState.uiState.readPosts.add(postId);
      watchedState.uiState.modal.postId = postId;
      const modalElement = document.querySelector('#modal');
      if (modalElement) {
        const modal = Modal.getOrCreateInstance(modalElement);
        modal.show();
      }
    }
  });

  document.body.addEventListener('hidden.bs.modal', (event) => {
    const modalElement = event.target;
    if (modalElement && modalElement.id === 'modal') {
      watchedState.uiState.modal.postId = null;
    }
  });
};

export default initControllers;
