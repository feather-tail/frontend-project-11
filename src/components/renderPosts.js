const renderPosts = (stateArg, elementsArg, watchedStateArg, i18n) => {
  const state = stateArg;
  const elements = elementsArg;

  const { postsContainer } = elements;
  const { posts, uiState } = state;
  postsContainer.innerHTML = '';

  if (posts.length === 0) return;

  const postsTitle = document.createElement('h2');
  postsTitle.textContent = i18n.t('posts.title');
  postsContainer.appendChild(postsTitle);

  const ul = document.createElement('ul');
  ul.classList.add('list-group');

  posts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
    );

    const a = document.createElement('a');
    a.href = post.link;
    a.textContent = post.title;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.dataset.id = post.id;

    const isRead = uiState.readPosts.has(post.id);
    a.classList.add(isRead ? 'fw-normal' : 'fw-bold');

    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('btn', 'btn-primary', 'btn-sm');
    button.textContent = i18n.t('posts.viewButton');
    button.dataset.id = post.id;

    li.appendChild(a);
    li.appendChild(button);
    ul.appendChild(li);
  });

  postsContainer.appendChild(ul);
};

export default renderPosts;
