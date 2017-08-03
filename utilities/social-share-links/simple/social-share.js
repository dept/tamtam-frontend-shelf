import Events from './util/events';

class SocialShare {

  constructor() {

    this.bindEvents();

  }

  bindEvents() {

    Events.$on('social-share::facebook', () => this.showFacebookDialogue());
    Events.$on('social-share::twitter', () => this.showTwitterDialogue());
    Events.$on('social-share::email', () => this.showEmailDialogue());

  }

  showFacebookDialogue() {

    this.openDialogue( `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}` );

  }

  showTwitterDialogue() {

    this.openDialogue( `https://twitter.com/home?status=${window.location.href}`);

  }

  showEmailDialogue() {

    window.location.href = `mailto:?body=${window.location.href}`;

  }

  openDialogue(url) {
    window.open(encodeURI(url), 'Delen','height=500,width=700');
  }

}

export default new SocialShare();
