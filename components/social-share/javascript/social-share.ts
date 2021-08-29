import Events from '@/utilities/events'

class SocialShare {
  constructor() {
    this.bindEvents()
  }

  bindEvents() {
    Events.$on('social-share::facebook', () => this.showFacebookDialogue())
    Events.$on('social-share::twitter', () => this.showTwitterDialogue())
    Events.$on('social-share::pinterest', () => this.showPinterestDialogue())
    Events.$on('social-share::linkedin', () => this.showLinkedInDialogue())
    Events.$on('social-share::email', () => this.showEmailDialogue())
  }

  showFacebookDialogue() {
    this.openDialogue(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`)
  }

  showTwitterDialogue() {
    this.openDialogue(`https://twitter.com/intent/tweet?text=${window.location.href}`)
  }

  showPinterestDialogue() {
    this.openDialogue(`http://pinterest.com/pin/create/button/?url=${window.location.href}`)
  }

  showLinkedInDialogue() {
    this.openDialogue(`https://www.linkedin.com/shareArticle?url=${window.location.href}`)
  }

  showEmailDialogue() {
    window.location.href = `mailto:?body=${window.location.href}`
  }

  openDialogue(url: string) {
    window.open(encodeURI(url), 'Share', 'height=500,width=700')
  }
}

export default new SocialShare()
