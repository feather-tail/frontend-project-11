const renderFeeds = (feedsContainerArg, feeds) => {
  const feedsContainer = feedsContainerArg;
  feedsContainer.innerHTML = '';

  if (feeds.length === 0) return;

  const feedsTitle = document.createElement('h2');
  feedsTitle.textContent = 'Фиды';
  feedsContainer.appendChild(feedsTitle);

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'mb-5');

  feeds.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');

    const feedTitle = document.createElement('h3');
    feedTitle.textContent = feed.title;

    const feedDescription = document.createElement('p');
    feedDescription.textContent = feed.description;

    li.appendChild(feedTitle);
    li.appendChild(feedDescription);
    ul.appendChild(li);
  });

  feedsContainer.appendChild(ul);
};

export default renderFeeds;
