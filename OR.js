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

  // ==================== POST LIST API ====================
  postList: {
    getAllPosts() {
      const posts = [];
      document.querySelectorAll('#siteTable .thing.link').forEach(postEl => {
        posts.push({
          element: postEl,
          fullname: postEl.getAttribute('data-fullname'),
          id: postEl.id,
          author: postEl.getAttribute('data-author'),
          subreddit: postEl.getAttribute('data-subreddit'),
          subredditPrefixed: postEl.getAttribute('data-subreddit-prefixed'),
          title: postEl.querySelector('.title')?.textContent || '',
          url: postEl.getAttribute('data-url'),
          permalink: postEl.getAttribute('data-permalink'),
          score: parseInt(postEl.getAttribute('data-score')) || 0,
          commentsCount: parseInt(postEl.getAttribute('data-comments-count')) || 0,
          timestamp: postEl.getAttribute('data-timestamp'),
          isNsfw: postEl.getAttribute('data-nsfw') === 'true',
          isSpoiler: postEl.getAttribute('data-spoiler') === 'true',
          isOc: postEl.getAttribute('data-oc') === 'true',
          domain: postEl.getAttribute('data-domain')
        });
      });
      return posts;
    },

    getPostById(postId) {
      const post = document.querySelector(`#${postId}.thing.link`);
      if (!post) return null;
      return {
        element: post,
        fullname: post.getAttribute('data-fullname'),
        id: post.id,
        author: post.getAttribute('data-author'),
        subreddit: post.getAttribute('data-subreddit'),
        subredditPrefixed: post.getAttribute('data-subreddit-prefixed'),
        title: post.querySelector('.title')?.textContent || '',
        url: post.getAttribute('data-url'),
        permalink: post.getAttribute('data-permalink'),
        score: parseInt(post.getAttribute('data-score')) || 0,
        commentsCount: parseInt(post.getAttribute('data-comments-count')) || 0,
        timestamp: post.getAttribute('data-timestamp'),
        isNsfw: post.getAttribute('data-nsfw') === 'true',
        isSpoiler: post.getAttribute('data-spoiler') === 'true',
        isOc: post.getAttribute('data-oc') === 'true',
        domain: post.getAttribute('data-domain')
      };
    },

    getPostContent(postElement) {
      const content = postElement.querySelector('.usertext-body .md');
      return content ? content.textContent : null;
    },

    getPostTitle(postElement) {
      return postElement.querySelector('.title')?.textContent || null;
    },

    getPostAuthor(postElement) {
      return postElement.querySelector('.author')?.textContent || null;
    },

    getPostAuthorUrl(postElement) {
      return postElement.querySelector('.author')?.href || null;
    },

    getPostScore(postElement) {
      return parseInt(postElement.getAttribute('data-score')) || 0;
    },

    getPostCommentCount(postElement) {
      return parseInt(postElement.getAttribute('data-comments-count')) || 0;
    },

    getPostCommentLink(postElement) {
      return postElement.querySelector('.comments');
    },

    openPostComments(postElement) {
      const link = this.getPostCommentLink(postElement);
      if (link) link.click();
      return this;
    },

    upvotePost(postElement) {
      const upvoteBtn = postElement.querySelector('.arrow.up');
      if (upvoteBtn) upvoteBtn.click();
      return this;
    },

    downvotePost(postElement) {
      const downvoteBtn = postElement.querySelector('.arrow.down');
      if (downvoteBtn) downvoteBtn.click();
      return this;
    },

    savePost(postElement) {
      const saveBtn = postElement.querySelector('.save-button a');
      if (saveBtn) saveBtn.click();
      return this;
    },

    hidePost(postElement) {
      const hideBtn = postElement.querySelector('.hide-button a');
      if (hideBtn) hideBtn.click();
      return this;
    },

    reportPost(postElement) {
      const reportBtn = postElement.querySelector('.reportbtn');
      if (reportBtn) reportBtn.click();
      return this;
    },

    sharePost(postElement) {
      const shareBtn = postElement.querySelector('.post-sharing-button');
      if (shareBtn) shareBtn.click();
      return this;
    },

    crosspostPost(postElement) {
      const crosspostBtn = postElement.querySelector('.post-crosspost-button');
      if (crosspostBtn) crosspostBtn.click();
      return this;
    },

    getPostPermalink(postElement) {
      return postElement.getAttribute('data-permalink');
    },

    getPostUrl(postElement) {
      return postElement.getAttribute('data-url');
    },

    getPostTimestamp(postElement) {
      const timeEl = postElement.querySelector('.live-timestamp');
      return timeEl ? timeEl.getAttribute('datetime') : null;
    },

    getPostTimestampFormatted(postElement) {
      const timeEl = postElement.querySelector('.live-timestamp');
      return timeEl ? timeEl.textContent : null;
    },

    getPostSubreddit(postElement) {
      return postElement.getAttribute('data-subreddit');
    },

    isPostNsfw(postElement) {
      return postElement.getAttribute('data-nsfw') === 'true';
    },

    isPostSpoiler(postElement) {
      return postElement.getAttribute('data-spoiler') === 'true';
    },

    isPostOc(postElement) {
      return postElement.getAttribute('data-oc') === 'true';
    }
  },

  // ==================== COMMENT LIST API ====================
  commentList: {
    getAllComments() {
      const comments = [];
      document.querySelectorAll('.commentarea .thing.comment').forEach(commentEl => {
        comments.push(this.getCommentDetails(commentEl));
      });
      return comments;
    },

    getCommentById(commentId) {
      const commentEl = document.querySelector(`#${commentId}.thing.comment`);
      if (!commentEl) return null;
      return this.getCommentDetails(commentEl);
    },

    getCommentDetails(commentEl) {
      if (!commentEl) return null;
      return {
        element: commentEl,
        fullname: commentEl.getAttribute('data-fullname'),
        id: commentEl.id,
        author: commentEl.getAttribute('data-author'),
        authorFullname: commentEl.getAttribute('data-author-fullname'),
        subreddit: commentEl.getAttribute('data-subreddit'),
        subredditPrefixed: commentEl.getAttribute('data-subreddit-prefixed'),
        title: commentEl.querySelector('.title')?.textContent || '',
        text: commentEl.querySelector('.usertext-body .md')?.textContent || '',
        permalink: commentEl.getAttribute('data-permalink'),
        score: parseInt(commentEl.querySelector('.score.unvoted')?.textContent) || 0,
        replies: parseInt(commentEl.getAttribute('data-replies')) || 0,
        timestamp: commentEl.querySelector('.live-timestamp')?.getAttribute('datetime') || null,
        timestampFormatted: commentEl.querySelector('.live-timestamp')?.textContent || null,
        parentLink: commentEl.querySelector('.bylink[data-event-action="parent"]')?.href || null
      };
    },

    getCommentText(commentElement) {
      return commentElement.querySelector('.usertext-body .md')?.textContent || null;
    },

    getCommentAuthor(commentElement) {
      return commentElement.querySelector('.author')?.textContent || null;
    },

    getCommentScore(commentElement) {
      return parseInt(commentElement.querySelector('.score.unvoted')?.textContent) || 0;
    },

    upvoteComment(commentElement) {
      const upvoteBtn = commentElement.querySelector('.arrow.up');
      if (upvoteBtn) upvoteBtn.click();
      return this;
    },

    downvoteComment(commentElement) {
      const downvoteBtn = commentElement.querySelector('.arrow.down');
      if (downvoteBtn) downvoteBtn.click();
      return this;
    },

    saveComment(commentElement) {
      const saveBtn = commentElement.querySelector('.comment-save-button a');
      if (saveBtn) saveBtn.click();
      return this;
    },

    reportComment(commentElement) {
      const reportBtn = commentElement.querySelector('.reportbtn');
      if (reportBtn) reportBtn.click();
      return this;
    },

    replyToComment(commentElement, text) {
      const replyBtn = commentElement.querySelector('.reply-button a');
      if (replyBtn) {
        replyBtn.click();
        // In a real scenario, you'd interact with the opened textarea and submit button
        // For now, this just triggers the reply form
      }
      return this;
    },

    getCommentPermalink(commentElement) {
      return commentElement.querySelector('.bylink[data-event-action="permalink"]')?.href || null;
    },

    getCommentParent(commentElement) {
      return commentElement.querySelector('.bylink[data-event-action="parent"]')?.href || null;
    },

    getCommentForm(thingId) {
      return document.querySelector(`#form-${thingId}l9n`);
    },

    setCommentText(commentForm, text) {
      const textarea = commentForm.querySelector('textarea[name="text"]');
      if (textarea) textarea.value = text;
      return this;
    },

    submitComment(commentForm) {
      const submitBtn = commentForm.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.click();
      return this;
    }
  },

  // ==================== GLOBAL / ACCESSIBILITY API ====================
  global: {
    getHeader() {
      return document.getElementById('header');
    },
    getJumpToContentLink() {
      return document.getElementById('jumpToContent');
    },

    // Top System Bar
    getTopSystemBar() {
      return document.getElementById('sr-header-area');
    },
    getWidthClipElement() {
      return document.querySelector('#sr-header-area .width-clip');
    },

    // Redesign Opt-In
    getRedesignOptInElement() {
      return document.querySelector('.redesign-beta-optin');
    },
    getRedesignOptInButton() {
      return document.getElementById('redesign-beta-optin-btn');
    },

    // Subreddit Dropdown
    getSubredditDropdown() {
      return document.querySelector('.dropdown.srdrop');
    },
    getSelectedSubredditTitle() {
      return document.querySelector('.dropdown.srdrop .selected.title');
    },
    getSubredditDropdownChoices() {
      return Array.from(document.querySelectorAll('.drop-choices.srdrop .choice'));
    },
    getSubredditDropdownBottomOption() {
      return document.querySelector('.drop-choices.srdrop .bottom-option.choice');
    },

    // Global Navigation Links
    getGlobalSrList() {
      return document.querySelector('.sr-list');
    },
    getGlobalSrBarLinks() {
      return Array.from(document.querySelectorAll('ul.flat-list.sr-bar.hover li a.choice'));
    },
    getHomeLink() {
      return document.querySelector('a.choice[href="/"]');
    },
    getPopularLink() {
      return document.querySelector('a.choice[href="/r/popular/"]');
    },
    getAllLink() {
      return document.querySelector('a.choice[href="/r/all/"]');
    },
    getUsersLink() {
      return document.querySelector('a.choice[href="/users/"]');
    },

    // Subscribed Subreddits Bar
    getSubscribedSrBar() {
      return document.getElementById('sr-bar');
    },
    getSubscribedSrBarChoices() {
      return Array.from(document.querySelectorAll('#sr-bar li a.choice'));
    },
    getSubscribedSrMoreLink() {
      return document.getElementById('sr-more-link');
    },

    // Header Bottom Left
    getHeaderBottomLeft() {
      return document.getElementById('header-bottom-left');
    },
    getHeaderImageLink() {
      return document.getElementById('header-img-a');
    },
    getHeaderImage() {
      return document.getElementById('header-img');
    },
    getPagenameRedditname() {
      return document.querySelector('.pagename.redditname');
    },
    getPagenameRedditnameLink() {
      return document.querySelector('.pagename.redditname a');
    },

    // Tab Menu
    getTabMenu() {
      return document.querySelector('.tabmenu');
    },
    getTabMenuItems() {
      return Array.from(document.querySelectorAll('.tabmenu li'));
    },
    getSelectedTabMenuItem() {
      return document.querySelector('.tabmenu li.selected');
    },
    getTabMenuHotLink() {
      return document.querySelector('.tabmenu a.choice[href$="/"]');
    },
    getTabMenuNewLink() {
      return document.querySelector('.tabmenu a.choice[href$="/new/"]');
    },
    getTabMenuRisingLink() {
      return document.querySelector('.tabmenu a.choice[href$="/rising/"]');
    },
    getTabMenuControversialLink() {
      return document.querySelector('.tabmenu a.choice[href$="/controversial/"]');
    },
    getTabMenuTopLink() {
      return document.querySelector('.tabmenu a.choice[href$="/top/"]');
    },
    getTabMenuWikiLink() {
      return document.querySelector('.tabmenu a.choice[href$="/wiki/"]');
    },

    // Header Bottom Right
    getHeaderBottomRight() {
      return document.getElementById('header-bottom-right');
    },
    getUserSpan() {
      return document.querySelector('span.user');
    },
    getUserLink() {
      return document.querySelector('span.user a');
    },
    getUserKarma() {
      return document.querySelector('.userkarma');
    },

    // Messaging and Notifications
    getMailLink() {
      return document.getElementById('mail');
    },
    getNoHaveMailElement() {
      return document.querySelector('.nohavemail');
    },
    getNotificationsLink() {
      return document.getElementById('notifications');
    },
    getChatLink() {
      return document.getElementById('chat');
    },

    // Preferences
    getPreferencesLanguageLink() {
      return document.querySelector('a.pref-lang.choice');
    },

    // Logout
    getLogoutForm() {
      return document.querySelector('form.logout');
    },
    getLogoutLink() {
      return document.querySelector('form.logout a');
    },
    getLogoutHiddenInput() {
      return document.querySelector('form.logout input[name="uh"]');
    },

    // Shared Utility Classes (these just return the selector, not specific elements)
    getChoiceClassSelector() {
      return '.choice';
    },
    getHoverClassSelector() {
      return '.hover';
    },
    getFlatListClassSelector() {
      return '.flat-list';
    },
    getSeparatorClassSelector() {
      return '.separator';
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

// Ensure global access in browser environments
if (typeof window !== 'undefined') {
  window.OR = OR;
}
