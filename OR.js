//OR.js (old reddit.js) api - interaction api wrapper
// Browser-compatible frontend interaction API for old.reddit.com elements

const OR = {
  // ==================== SEARCH API ====================
  search: {
    getSearchForm() {
      return document.getElementById('search');
    },
    
    getSearchInput() {
      return document.querySelector('input[name="q"]');
    },
    
    getRestrictCheckbox() {
      return document.querySelector('input[name="restrict_sr"]');
    },
    
    getSearchQuery() {
      const input = this.getSearchInput();
      return input ? input.value : null;
    },
    
    setSearchQuery(query) {
      const input = this.getSearchInput();
      if (input) input.value = query;
      return this;
    },
    
    toggleRestrictToSubreddit(restrict = true) {
      const checkbox = this.getRestrictCheckbox();
      if (checkbox) checkbox.checked = restrict;
      return this;
    },
    
    isRestrictedToSubreddit() {
      const checkbox = this.getRestrictCheckbox();
      return checkbox ? checkbox.checked : false;
    },
    
    submit() {
      const form = this.getSearchForm();
      if (form) form.submit();
      return this;
    },
    
    clear() {
      this.setSearchQuery('');
      return this;
    }
  },

  // ==================== POST INFO API ====================
  postInfo: {
    getPostDate() {
      const timeElement = document.querySelector('.linkinfo .date time');
      return timeElement ? timeElement.getAttribute('datetime') : null;
    },
    
    getPostDateFormatted() {
      const timeElement = document.querySelector('.linkinfo .date time');
      return timeElement ? timeElement.textContent : null;
    },
    
    getScore() {
      const scoreSpan = document.querySelector('.linkinfo .score .number');
      return scoreSpan ? parseInt(scoreSpan.textContent) : 0;
    },
    
    getUpvotePercentage() {
      const scoreText = document.querySelector('.linkinfo .score');
      const match = scoreText ? scoreText.textContent.match(/\((\d+)%/) : null;
      return match ? parseInt(match[1]) : null;
    },
    
    getShortlink() {
      const input = document.querySelector('#shortlink-text');
      return input ? input.value : null;
    },
    
    copyShortlink() {
      const shortlink = this.getShortlink();
      if (shortlink && navigator.clipboard) {
        navigator.clipboard.writeText(shortlink);
        return true;
      }
      return false;
    }
  },

  // ==================== SUBMISSION API ====================
  submission: {
    getSubmitButton() {
      return document.querySelector('.sidebox.submit a');
    },
    
    getSubmitUrl() {
      const btn = this.getSubmitButton();
      return btn ? btn.href : null;
    },
    
    openSubmit() {
      const btn = this.getSubmitButton();
      if (btn) btn.click();
      return this;
    }
  },

  // ==================== SUBREDDIT API ====================
  subreddit: {
    getSubredditName() {
      const link = document.querySelector('.titlebox .redditname a');
      return link ? link.textContent : null;
    },
    
    getSubredditUrl() {
      const link = document.querySelector('.titlebox .redditname a');
      return link ? link.href : null;
    },
    
    getSubredditDescription() {
      const md = document.querySelector('.usertext-body .md');
      return md ? md.textContent : null;
    },
    
    isSubscribed() {
      const btn = document.querySelector('.subscribe-button .option.active.add');
      return !btn; // if add button is visible, not subscribed
    },
    
    getSubscribeButton() {
      return document.querySelector('.subscribe-button .option');
    },
    
    toggleSubscribe() {
      const btn = this.getSubscribeButton();
      if (btn) btn.click();
      return this;
    },
    
    getSubredditRules() {
      const rules = [];
      document.querySelectorAll('.usertext-body .md li').forEach(li => {
        rules.push(li.textContent.trim());
      });
      return rules;
    },
    
    getCreatedDate() {
      const timeElement = document.querySelector('.bottom time');
      return timeElement ? timeElement.getAttribute('datetime') : null;
    },
    
    getCreatedDateFormatted() {
      const timeElement = document.querySelector('.bottom time');
      return timeElement ? timeElement.textContent : null;
    }
  },

  // ==================== MODERATORS API ====================
  moderators: {
    getModerators() {
      const mods = [];
      document.querySelectorAll('.sidecontentbox a.author').forEach(modLink => {
        const username = modLink.textContent;
        const url = modLink.href;
        const flair = modLink.nextElementSibling?.textContent || '';
        mods.push({ username, url, flair });
      });
      return mods;
    },
    
    getModeratorCount() {
      return this.getModerators().length;
    },
    
    getModeratorByUsername(username) {
      return this.getModerators().find(mod => mod.username === username);
    },
    
    messageModTeam() {
      const btn = document.querySelector('.sidecontentbox a.c-btn-primary');
      if (btn) btn.click();
      return this;
    },
    
    getMessageModsUrl() {
      const btn = document.querySelector('.sidecontentbox a.c-btn-primary');
      return btn ? btn.href : null;
    }
  },

  // ==================== ACCOUNT ACTIVITY API ====================
  accountActivity: {
    getActivityLink() {
      return document.querySelector('.account-activity-box a');
    },
    
    getActivityUrl() {
      const link = this.getActivityLink();
      return link ? link.href : null;
    },
    
    openActivity() {
      const link = this.getActivityLink();
      if (link) link.click();
      return this;
    }
  },

  // ==================== UTILITY METHODS ====================
  utils: {
    wait(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    
    async waitForElement(selector, timeout = 5000) {
      const startTime = Date.now();
      while (Date.now() - startTime < timeout) {
        const element = document.querySelector(selector);
        if (element) return element;
        await this.wait(100);
      }
      return null;
    },
    
    onElementReady(selector, callback, timeout = 5000) {
      const element = document.querySelector(selector);
      if (element) {
        callback(element);
        return true;
      }
      const startTime = Date.now();
      const interval = setInterval(() => {
        const el = document.querySelector(selector);
        if (el) {
          clearInterval(interval);
          callback(el);
        } else if (Date.now() - startTime > timeout) {
          clearInterval(interval);
        }
      }, 100);
      return false;
    }
  },

  // ==================== INITIALIZATION ====================
  init(options = {}) {
    console.log('OR.js initialized - Old Reddit API');
    if (options.debug) {
      console.log('Available modules:', Object.keys(this).filter(k => k !== 'init'));
    }
    return this;
  },

  version: '1.0.0'
};

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = OR;
}
