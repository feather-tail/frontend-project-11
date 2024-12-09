import { Modal } from 'bootstrap';

const initControllers = (state, watchedState, elements) => {
  const { postsContainer } = elements;

  const { uiState } = watchedState;
  
  postsContainer.addEventListener('click', (event) => {
    const { target } = event;
    const { id } = target.dataset;
    if (!id) return;

    if (target.tagName === 'A') {
      uiState.readPosts.add(id);
    }

    if (target.tagName === 'BUTTON') {
      uiState.readPosts.add(id);
      uiState.modal.postId = id;
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
      uiState.modal.postId = null;
    }
  });
};

export default initControllers;
