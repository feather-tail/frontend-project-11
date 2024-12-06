export default (rssContent) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(rssContent, 'application/xml');
  const parserError = doc.querySelector('parsererror');
  if (parserError) {
    const error = new Error('Parsing Error');
    error.isParsingError = true;
    throw error;
  }

  const channel = doc.querySelector('channel');
  if (!channel) {
    const error = new Error('No channel found');
    error.isParsingError = true;
    throw error;
  }

  const feedTitleElement = channel.querySelector('title');
  const feedDescriptionElement = channel.querySelector('description');

  if (!feedTitleElement || !feedDescriptionElement) {
    const error = new Error('Missing title or description in feed');
    error.isParsingError = true;
    throw error;
  }

  const feedTitle = feedTitleElement.textContent;
  const feedDescription = feedDescriptionElement.textContent;

  const feed = {
    title: feedTitle,
    description: feedDescription,
  };

  const items = doc.querySelectorAll('item');
  const posts = Array.from(items).map((item) => {
    const titleElement = item.querySelector('title');
    const linkElement = item.querySelector('link');
    const descriptionElement = item.querySelector('description');

    const title = titleElement
      ? titleElement.textContent.trim()
      : 'Без названия';
    const link = linkElement ? linkElement.textContent.trim() : '#';
    const description = descriptionElement
      ? descriptionElement.textContent.trim()
      : '';

    return { title, link, description };
  });

  return { feed, posts };
};
