export default (elements, watchedState) => {
  const { postsContainer, modalContainer } = elements;

  postsContainer.addEventListener('click', (event) => {
    const { target } = event;
    if (target.tagName === 'A' && target.dataset.id) {
      const postId = target.dataset.id;
      watchedState.uiState.readPosts.add(postId);
    }
    if (target.tagName === 'BUTTON' && target.dataset.id) {
      const postId = target.dataset.id;
      watchedState.uiState.readPosts.add(postId);
      watchedState.uiState.modal.postId = postId;
    }
  });

  const modalElement = modalContainer.querySelector('#modal');
  modalElement.addEventListener('hidden.bs.modal', () => {
    watchedState.uiState.modal.postId = null;
  });
};
