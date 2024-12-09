import { Modal } from 'bootstrap';

const renderModal = (stateArg, elementsArg, i18n) => {
  const state = stateArg;
  const { modalContainer } = elementsArg;
  const { posts, uiState } = state;
  const { postId } = uiState.modal;

  const post = posts.find((p) => p.id === postId);
  if (!postId || !post) return;

  let modalElement = document.querySelector('#modal');

  if (!modalElement) {
    modalElement = document.createElement('div');
    modalElement.classList.add('modal', 'fade');
    modalElement.id = 'modal';
    modalElement.tabIndex = '-1';
    modalElement.setAttribute('aria-labelledby', 'modal-title');
    modalElement.setAttribute('aria-hidden', 'true');

    modalElement.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modal-title"></h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="${i18n.t('modal.close')}"
            ></button>
          </div>
          <div class="modal-body"></div>
          <div class="modal-footer">
            <a
              href="#"
              class="btn btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              ${i18n.t('modal.readMore')}
            </a>
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              ${i18n.t('modal.close')}
            </button>
          </div>
        </div>
      </div>
    `;

    modalContainer.appendChild(modalElement);
  }

  const titleElement = modalElement.querySelector('.modal-title');
  const bodyElement = modalElement.querySelector('.modal-body');
  const linkElement = modalElement.querySelector('.modal-footer a');

  titleElement.textContent = post.title;
  bodyElement.textContent = post.description;
  linkElement.href = post.link;

  const modal = Modal.getOrCreateInstance(modalElement);
  modal.show();
};

export default renderModal;
