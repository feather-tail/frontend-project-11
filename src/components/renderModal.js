import { Modal } from 'bootstrap';

const renderModal = (state, elements) => {
  const { modalContainer } = elements;
  const { posts, uiState } = state;
  const postId = uiState.modal.postId;
  const post = posts.find((p) => p.id === postId);

  if (!post) return;

  const existingModal = document.querySelector('.modal');
  if (existingModal) {
    existingModal.remove();
  }

  const modalElement = document.createElement('div');
  modalElement.classList.add('modal', 'fade');
  modalElement.id = 'modal';
  modalElement.tabIndex = '-1';
  modalElement.setAttribute('aria-labelledby', 'modal-title');
  modalElement.setAttribute('aria-hidden', 'true');

  modalElement.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modal-title">${post.title}</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Закрыть"
          ></button>
        </div>
        <div class="modal-body">
          ${post.description}
        </div>
        <div class="modal-footer">
          <a
            href="${post.link}"
            class="btn btn-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Читать полностью
          </a>
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.appendChild(modalElement);

  const modal = new Modal(modalElement);
  modal.show();

  modalElement.addEventListener('hidden.bs.modal', () => {
    modalElement.remove();
    state.uiState.modal.postId = null;
  });
};

export default renderModal;
