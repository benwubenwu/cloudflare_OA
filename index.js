const links = [
  { 'name': 'Where I want to work', 'url': 'https://www.cloudflare.com/' },
  { 'name': 'Something I developed', 'url': 'http://ben-lab-project.herokuapp.com/' },
  { 'name': 'A nice tune', 'url': 'https://www.youtube.com/watch?v=kXF3VYYa5TI&ab_channel=LouieZong' },

];

const socials = [
  { 'url': 'https://www.linkedin.com/in/benwu73', 'icon': 'https://www.flaticon.com/svg/static/icons/svg/1384/1384889.svg' },
  { 'url': 'mailto:benjaminwu@college.harvard.edu', 'icon': 'https://www.flaticon.com/svg/static/icons/svg/281/281786.svg' }
];

const json = JSON.stringify(links);

class LinksTransformer {
  constructor(links) {
    this.links = links;
  }

  async element(element) {
    this.links.forEach(link => element.append('<a href=' + link.url + '>' + link.name + '</a>', { html: true }));
  }
}

class ProfileTransformer {
  async element(element) {
    element.removeAttribute('style');
  }
}

class AvatarTransformer {
  async element(element) {
    element.setAttribute('src', 'https://www.flaticon.com/svg/static/icons/svg/3571/3571555.svg');
  }
}

class NameTransformer {
  async element(element) {
    element.setInnerContent('benwu73');
  }
}

class SocialsTransformer {
  constructor(socials) {
    this.socials = socials;
  }

  async element(element) {
    element.removeAttribute('style');
    this.socials.forEach(social => element.append('<a href=' + social.url + '>' + '<img src=' + social.icon + '>' + '</a>', { html: true }));
  }
}

class TitleTransformer {
  async element(element) {
    element.setInnerContent('Benjamin Wu');
  }
}

class BodyTransformer {
  async element(element) {
    element.setAttribute('style', 'background: #f6d7b0');
  }
}


const staticSiteContent = new HTMLRewriter()
  .on('div#links', new LinksTransformer(links))
  .on('div#profile', new ProfileTransformer())
  .on('img#avatar', new AvatarTransformer())
  .on('h1#name', new NameTransformer())
  .on('div#social', new SocialsTransformer(socials))
  .on('title', new TitleTransformer())
  .on('body', new BodyTransformer());

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function otherLinkHandler() {
  const staticUrl = 'https://static-links-page.signalnerve.workers.dev';
  const response = await fetch(staticUrl);
  return await staticSiteContent.transform(response);
}


/**
 * Respond with JSON object or HTMl page
 * @param {Request} request
 */
async function handleRequest(request) {
  if (request.url.endsWith('/links')) {
    return new Response(json, { headers: { 'content-type': 'application/json' } });
  }
  else {
    return await otherLinkHandler();
  }
}