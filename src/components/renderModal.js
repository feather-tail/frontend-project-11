import { Modal } from 'bootstrap';

const renderModal = (stateArg, elementsArg, i18n) => {
  const state = stateArg;
  const { modalContainer } = elementsArg;
  const { posts, uiState } = state;
  const { postId } = uiState.modal;

  const post = posts.find((p) => p.id === postId);
  if (!post) return;

  const modalElement = modalContainer.querySelector('#modal');
  const modalTitle = modalElement.querySelector('.modal-title');
  const modalBody = modalElement.querySelector('.modal-body');
  const fullLink = modalElement.querySelector('.full-article-link');
  const closeButtons = modalElement.querySelectorAll('[data-bs-dismiss="modal"]');
  const btnClose = modalElement.querySelector('.btn-close');

  modalTitle.textContent = post.title;
  modalBody.textContent = post.description;

  fullLink.href = post.link;
  fullLink.textContent = i18n.t('modal.readFull');

  closeButtons.forEach((btn) => {
    if (!btn.classList.contains('btn-close')) {
      btn.textContent = i18n.t('modal.close');
    }
  });

  btnClose.setAttribute('aria-label', i18n.t('modal.close'));

  const modal = new Modal(modalElement);
  modal.show();
};

export default renderModal;
