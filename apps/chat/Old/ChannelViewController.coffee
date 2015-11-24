define [
	"underscore"
	"gsap"
	"js/viewcontroller/ChatListViewController"
	"js/utility/TimeUtility"
	"collectionSubset"
	"momentjs"
	], (_, TweenLite, ChatListViewController, TimeUtility) ->
	Backbone.View.extend
		className: "channel-view-controller main-view-controller"
		initialize: ->
			@timeUtil = new TimeUtility()
			Backbone.on( "create-task", @createTask, @ )
			@bouncedHandleEdited = _.debounce(@handleEditedTask, 10)
			Backbone.on( "tasklistvc/edited-task", @bouncedHandleEdited, @)
			Backbone.on( "clicked/section", @clickedSection, @)
		render: (el) ->
			@$el.html "<div style=\"text-align:center; margin-top:100px;\">Loading</div>"
			$("#app-view-controller-1 .app-content-container").html(@$el)

			setTimeout( =>
				@loadMainWindow(@mainView)
			, 5)
			@updateTopbarTitle()
		open: (type, options) ->
			@identifier = options.id
			@type = type
			@mainView = "chat"

			@showSomedayMaybe = false
			@showLaterTasks = false
			@showCompletedTasks = false

			collection = swipy.swipesCollections.channels
			if @type isnt "im"
				@currentList = collection.findWhere({name: @identifier})
			else
				@currentUser = swipy.swipesCollections.users.findWhere({name: @identifier})

				@currentList = collection.findWhere({type: "direct", user_id: @currentUser.id})

			@currentList.set("is_active_menu", true)
			@render()

		threadHeaderDidClickClear: (threadHeader) ->
			@taskListVC?.goBackFromEditMode()
		handleEditedTask: ->
			@updateTopbarTitle()
			return if !localStorage.getItem("EnableThreadedConversations")

			# Is editing
			if @taskListVC? and @taskListVC.editModel
				model = @taskListVC.editModel
				@chatListVC?.chatHandler?.startsWith = "<http://swipesapp.com/task/"+ model.id
				@currentList.skipCount = 200
				@chatListVC?.chatList.hasRendered = false
				@chatListVC?.chatList.isThread = true
				@chatListVC?.threadHeader.show(true)
				@currentList.fetchMessages(null, (res, error) =>
					if res and res.ok
						@chatListVC.chatList.hasMore = true
				)
				Backbone.trigger("reload/chathandler")
			else
				@chatListVC.chatList.hasRendered = false
				@chatListVC?.chatList.isThread = false
				@chatListVC?.threadHeader.show(false)
				@currentList.skipCount = 100
				@currentList.getMessages()
				@chatListVC?.chatHandler?.startsWith = null
				Backbone.trigger("reload/chathandler")
		updateTopbarTitle: ->
			if @type isnt "im"
				name = @currentList.get("name")
			else
				name = @currentUser.get("name")
				name = "slackbot & s.o.f.i." if name is "slackbot"
			swipy.topbar1.setTitle(name)
		loadMainWindow: (type) ->
			@vc?.destroy()
			@vc = @getChatListVC()
			@$el.html @vc.el
			@vc.render()


		createTask: ( title, options ) ->
			options = {} if !options
			options.targetUserId = @currentUser.id if @currentUser?
			now = new Date()
			now.setSeconds now.getSeconds() - 1
			options.schedule = now if !options.schedule?
			options.projectLocalId = @currentList.id
			@taskCollectionSubset?.child.createTask(title, options)
			Backbone.trigger("reload/taskhandler")
		clickedSection: (section) ->
			if section is "future-tasks"
				@showLaterTasks = true
			else if section is "someday-maybe"
				@showSomedayMaybe = true
			else if section is "completed-tasks"
				@taskListVC?.scrollToTop()
				@showCompletedTasks = true
				@taskListVC.taskList.enableDragAndDrop = false
			else if section is "hide-completed-tasks"
				@showCompletedTasks = false
				@taskListVC.taskList.enableDragAndDrop = true
			@taskListVC?.taskHandler.bouncedReloadWithEvent()

		###
			Get A ChatListViewController that filtered for this project
		###
		getChatListVC: ->
			chatListVC = new ChatListViewController()
			chatListVC.newMessage.addDelegate = @
			chatListVC.chatList.delegate = @
			chatListVC.threadHeader.clickDelegate = @
			lastRead = @currentList.get("last_read")
			lastRead = 0 if !lastRead
			chatListVC.chatList.lastRead = parseInt(lastRead)
			chatListVC.chatHandler.loadCollection(@currentList)
			if @currentUser? # if is IM
				chatListVC.newMessage.setPlaceHolder("Send a message to " + @currentUser.get("name"))
				if @currentUser.get("name") is "slackbot"
					chatListVC.newMessage.setPlaceHolder("Send a message to slackbot & s.o.f.i.")
			else
				chatListVC.newMessage.setPlaceHolder("Send a message to " + @currentList.get("name"))
			@chatListVC = chatListVC

			@currentList.fetchMessages(null, (res, error) ->
				if res and res.ok
					chatListVC.chatList.hasMore = true
					chatListVC.chatList.hasRendered = false
			)
			return chatListVC


		###
			ChatList ChatDelegate
		###
		chatListDidScrollToTop: (chatList) ->
			return if @isFetchingMore or !chatList.numberOfChats
			return if @taskListVC? and @taskListVC.editModel
			@isFetchingMore = true
			@currentList.fetchOlderMessages((res, error) =>
				@isFetchingMore = false
				if res and res.ok
					if res.messages and res.messages.length
						lastMessage = res.messages[0]
						chatList.setScrollToMessage(lastMessage.ts)
			)
		chatListMarkAsRead: (chatList, timestamp) ->
			@currentList.markAsRead()




		###
			NewMessage Delegate
		###
		newMessageSent: ( newMessage, message ) ->
			# Add thread identifier if needed
			#T_TODO trying to disable the thread completely
			if @taskListVC? and @taskListVC.editModel and localStorage.getItem("EnableThreadedConversations")
			 	model = @taskListVC.editModel
			 	message = "<http://swipesapp.com/task/" + model.id + "|" + model.get("title") + ">: " + message
			swipy.swipesSync.sendMessage( message, @currentList.id)
			@chatListVC.chatList.scrollToBottomVar = true
			@chatListVC.chatList.removeUnreadIfSeen = true
		newFileSelected: (newMessage, file) ->
			newMessage.setUploading(true)
			swipy.swipesSync.uploadFile(@currentList.id, file, (res, error) ->
				newMessage.setUploading(false)
				if res and res.ok
					console.log "success!"
				else
					alert("An error happened with the upload")
			)
		newMessageIsTyping: (newMessage ) ->
			options = {type: "typing", channel: @currentList.id }
			swipy.swipesSync.doSocketSend(options, true)

		destroy: ->
			@chatListVC?.destroy()
			Backbone.off(null,null, @)
			@vc?.destroy()
