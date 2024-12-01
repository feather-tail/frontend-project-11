import onChange from "on-change";

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

const renderPosts = (postsContainer, posts) => {
  postsContainer.innerHTML = "";

  const postsTitle = document.createElement("h2");
  postsTitle.textContent = "Посты";
  postsContainer.appendChild(postsTitle);

  const ul = document.createElement("ul");
  ul.classList.add("list-group");

  posts.forEach((post) => {
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

    li.appendChild(a);
    ul.appendChild(li);
  });

  postsContainer.appendChild(ul);
};

const initView = (state, elements, i18n) => {
  const { form, input, feedback, feedsContainer, postsContainer } = elements;

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

  const renderFeedsList = () => {
    renderFeeds(feedsContainer, state.feeds);
  };

  const renderPostsList = () => {
    renderPosts(postsContainer, state.posts);
  };

  const watchedState = onChange(state, (path) => {
    if (path === "form.status" || path === "form.error") {
      renderForm();
    }

    if (path === "feeds") {
      renderFeedsList();
    }

    if (path === "posts") {
      renderPostsList();
    }
  });

  return watchedState;
};

export default initView;
