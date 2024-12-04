import onChange from "on-change";
import { Modal } from "bootstrap";

const renderFeeds = (feedsContainer, feeds) => {
  feedsContainer.innerHTML = "";

  const feedsTitle = document.createElement("h2");
  feedsTitle.textContent = "Фиды";
  feedsContainer.appendChild(feedsTitle);

  const ul = document.createElement("ul");
  ul.classList.add("list-group", "mb-5");

  feeds.forEach((feed) => {
    const li = document.createElement("li");
    li.classList.add("list-group-item");

    const feedTitle = document.createElement("h3");
    feedTitle.textContent = feed.title;

    const feedDescription = document.createElement("p");
    feedDescription.textContent = feed.description;

    li.appendChild(feedTitle);
    li.appendChild(feedDescription);
    ul.appendChild(li);
  });

  feedsContainer.appendChild(ul);
};

const renderPosts = (state, elements, watchedState) => {
  const { postsContainer } = elements;
  postsContainer.innerHTML = "";

  const postsTitle = document.createElement("h2");
  postsTitle.textContent = "Посты";
  postsContainer.appendChild(postsTitle);

  const ul = document.createElement("ul");
  ul.classList.add("list-group");

  state.posts.forEach((post) => {
    const li = document.createElement("li");
    li.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-start"
    );

    const a = document.createElement("a");
    a.href = post.link;
    a.textContent = post.title;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.dataset.id = post.id;

    const isRead = state.uiState.readPosts.has(post.id);
    a.classList.add(isRead ? "fw-normal" : "fw-bold");

    a.addEventListener("click", (e) => {
      e.preventDefault();
      watchedState.uiState.readPosts.add(post.id);
      watchedState.uiState.modal.postId = post.id;
    });

    const button = document.createElement("button");
    button.type = "button";
    button.classList.add("btn", "btn-primary", "btn-sm");
    button.textContent = "Просмотр";
    button.dataset.id = post.id;

    button.addEventListener("click", () => {
      watchedState.uiState.readPosts.add(post.id);
      watchedState.uiState.modal.postId = post.id;

      const modalElement = document.querySelector("#modal");
      const modal = new Modal(modalElement);
      modal.show();
    });

    li.appendChild(a);
    li.appendChild(button);
    ul.appendChild(li);
  });

  postsContainer.appendChild(ul);
};

const renderModal = (state, elements) => {
  const { modal } = elements;
  const postId = state.uiState.modal.postId;
  const post = state.posts.find((p) => p.id === postId);

  if (post) {
    modal.title.textContent = post.title;
    modal.body.textContent = post.description;
    modal.fullArticleLink.href = post.link;
  }
};

const initView = (state, elements, i18n) => {
  const { input, feedback, feedsContainer, postsContainer } = elements;

  const renderForm = () => {
    feedback.classList.remove("text-danger", "text-success");
    feedback.textContent = "";

    if (state.form.status === "success") {
      input.classList.remove("is-invalid");
      input.value = "";
      input.focus();
      feedback.classList.add("text-success");
      feedback.textContent = i18n.t("form.success");
    } else if (state.form.status === "error") {
      input.classList.add("is-invalid");
      feedback.classList.add("text-danger");
      feedback.textContent = i18n.t(state.form.error);
    }

    if (state.form.status === "loading") {
      input.setAttribute("readonly", true);
    } else {
      input.removeAttribute("readonly");
    }
  };

  const watchedState = onChange(state, (path) => {
    if (path === "form.status" || path === "form.error") {
      renderForm();
    }

    if (path === "feeds") {
      renderFeeds(feedsContainer, state.feeds);
    }

    if (path.startsWith("posts") || path.startsWith("uiState.readPosts")) {
      renderPosts(state, elements, watchedState);
    }

    if (path === "uiState.modal.postId") {
      renderModal(state, elements);
    }
  });

  return watchedState;
};

export default initView;
