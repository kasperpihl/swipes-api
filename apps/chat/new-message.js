var NewMessage = (function() {
  function NewMessage() {
    console.log("Test");
    this.placeholder = "Write new message";
    this.$el = $('.chat-new-message');
  }
  NewMessage.prototype.render = function(){
    
  };
  return NewMessage;

})();

/*
(function() {
  define(["underscore", "text!templates/chatlist/new-message.html"], function(_, Tmpl) {
    return Backbone.View.extend({
      className: "chat-new-message",
      offset: null,
      initialize: function() {
        var self, textarea;
        self = this;
        this.placeholder = "Write new message";
        this.template = _.template(Tmpl, {
          variable: "data"
        });
        this.render();
        _.bindAll(this, "pressedKey");
        textarea = this.$el.find('textarea');
        return this.offset = textarea[0].offsetHeight - textarea[0].clientHeight;
      },
      events: {
        "keyup textarea": "pressedKey",
        "keydown textarea": "keyDown",
        "click .attach-button-container": "clickedAttach",
        "change #file-input": "fileChanged"
      },
      render: function() {
        this.$el.html(this.template({
          placeholder: this.placeholder
        }));
        this.delegateEvents();
        return this;
      },
      setPlaceHolder: function(placeholder) {
        this.placeholder = placeholder;
        return this.$el.find('textarea').attr('placeholder', placeholder);
      },
      autoExpand: function() {
        var chatContainer, newMessageCont, newMessageContHeight, textarea;
        chatContainer = $('.chat-list-container');
        textarea = this.$el.find('textarea');
        textarea.css('height', 'auto').css('height', textarea[0].scrollHeight + this.offset);
        newMessageCont = $('.chat-new-message');
        newMessageContHeight = newMessageCont.height();
        chatContainer.css('height', 'calc(100% - ' + newMessageContHeight + 'px - 0px)');
      },
      pressedKey: function(e) {
        var keepGoing, message, nowStamp, ref;
        nowStamp = new Date().getTime();
        if ((this.lastSentTyping == null) || (this.lastSentTyping + 3500) < nowStamp) {
          this.lastSentTyping = new Date().getTime();
          if ((this.addDelegate != null) && _.isFunction(this.addDelegate.newMessageIsTyping)) {
            this.addDelegate.newMessageIsTyping(this);
          }
        }
        message = this.$el.find("textarea").val();
        keepGoing = (ref = this.autoCompleteList) != null ? ref.updateWithEventAndText(e, message) : void 0;
        if (!keepGoing) {
          return false;
        }
        if (e.keyCode === 13 && !e.shiftKey) {
          this.sendMessage();
        }
        this.autoExpand();
        return false;
      },
      keyDown: function(e) {
        var keepGoing, ref;
        keepGoing = (ref = this.autoCompleteList) != null ? ref.keyDownHandling(e) : void 0;
        if (!keepGoing) {
          return false;
        }
        if (e.keyCode === 13 && !e.shiftKey) {
          return e.preventDefault();
        }
      },
      clickedAttach: function() {
        return $("#file-input").click();
      },
      fileChanged: function(e) {
        var file;
        file = $("#file-input")[0].files[0];
        if ((this.addDelegate != null) && _.isFunction(this.addDelegate.newFileSelected)) {
          return this.addDelegate.newFileSelected(this, file);
        }
      },
      setUploading: function(isUploading) {
        return this.$el.find(".attach-button-container").toggleClass("isUploading", isUploading);
      },
      acListSelectedItem: function(acList, result) {
        var firstPart, lastPart, message, newMessage, newSelectionIndex, replacementText, textAreaJSEl;
        message = this.$el.find("textarea").val();
        firstPart = message.substr(0, acList.searchStartIndex);
        replacementText = result.name + " ";
        lastPart = message.substr(acList.searchStartIndex + acList.searchText.length);
        newMessage = firstPart + replacementText + lastPart;
        newSelectionIndex = acList.searchStartIndex + replacementText.length;
        this.$el.find("textarea").val(newMessage);
        this.$el.find("textarea").focus();
        textAreaJSEl = document.getElementById("new-message-textarea");
        textAreaJSEl.selectionStart = newSelectionIndex;
        return textAreaJSEl.selectionEnd = newSelectionIndex;
      },
      sendMessage: function() {
        var message;
        message = this.$el.find("textarea").val();
        if (message.length === 0) {
          return;
        }
        if ((this.addDelegate != null) && _.isFunction(this.addDelegate.newMessageSent)) {
          this.addDelegate.newMessageSent(this, message);
        } else {
          throw new Error("NewMessage must have an addDelegate that implements newMessageSent");
        }
        return this.$el.find("textarea").val("");
      },
      remove: function() {
        this.destroy();
        return this.$el.empty();
      },
      destroy: function() {
        return this.undelegateEvents();
      }
    });
  });

}).call(this);
*/
