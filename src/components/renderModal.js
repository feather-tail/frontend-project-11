const renderModal = (state, elements, i18n) => {
  const { modalContainer } = elements;
  const { uiState, posts } = state;
  const { postId } = uiState.modal;
  const post = posts.find((p) => p.id === postId);

  modalContainer.querySelector('.modal-title').textContent = post.title;
  modalContainer.querySelector('.modal-body').textContent = post.description;

  const fullLink = modalContainer.querySelector('.full-article-link');
  fullLink.href = post.link;
  fullLink.textContent = i18n.t('modal.readFull');

  const closeButtons = modalContainer.querySelectorAll('[data-bs-dismiss="modal"]');
  closeButtons.forEach((btn) => {
    btn.textContent = i18n.t('modal.close');
  });
};

export default renderModal;
