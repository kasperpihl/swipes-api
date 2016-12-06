import { bindAll, debounce } from './utils';
import Subscriber from './subscriber';
import { api } from 'actions';

export default class SwipesUrlProvider {
  constructor(store) {
    bindAll(this, ['subscribe', 'unsubscribe', 'fetch', 'setThrottleThreshold']);
    this._shortUrlData = {};
    this.store = store;
    this.subscriber = new Subscriber();
    this.urlsToFetch = [];
    this.fetchingUrls = null;
    this.setThrottleThreshold(30);
  }
  setThrottleThreshold(duration) {
    this.throttleThreshold = duration;
    this.throttledFetch = debounce(this.fetch, duration);
  }
  fetch(shortUrl) {
    if (typeof shortUrl === 'string') {
      this.urlsToFetch.push(shortUrl);
      return this.throttledFetch();
    }
    if (this.fetchingUrls) {
      return undefined; // Already fetching!
    }

    this.fetchingUrls = [...new Set(this.urlsToFetch)];
    this.urlsToFetch = [];
    this.store.dispatch(api.request('share.getData', { shareIds: this.fetchingUrls })).then((res) => {
      if (res && res.ok) {
        this.fetchingUrls.forEach((url, i) => {
          this.save(url, res.links[i].meta);
        });
      } else {
        this.urlsToFetch = this.fetchingUrls.concat(this.urlsToFetch);
      }
      this.fetchingUrls = null;
      if (this.urlsToFetch.length) {
        this.throttledFetch();
      }
    });

    return undefined;
  }
  get(url) {
    return this._shortUrlData[url];
  }
  save(url, data) {
    this._shortUrlData[url] = data;
    this.notify(url, data);
  }
  notify(shortUrl, data) {
    this.subscriber.notify(shortUrl, data);
  }

  subscribe(shortUrl, listener, ctx) {
    this.subscriber.add(shortUrl, listener, ctx);
    const currentData = this.get(shortUrl);
    if (currentData) {
      listener(currentData);
    }
    // Only fetch if it is not the checksum.
    if (shortUrl.length < 12) {
      this.fetch(shortUrl);
    }
  }
  unsubscribe(shortUrl, listener, ctx) {
    this.subscriber.remove(shortUrl, listener, ctx);
  }

}
