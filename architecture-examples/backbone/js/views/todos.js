/*global Backbone _ $ ENTER_KEY*/
var app = app || {};

$(function () {
	'use strict';

	// Todo Item View
	// --------------
	var userSelect = false;
	var activeItem;
	// The DOM element for a todo item...
	app.TodoView = Backbone.View.extend({

		//... is a list tag.
		tagName:  'li',

		// Cache the template function for a single item.
		template: _.template($('#item-template').html()),

		// The DOM events specific to an item.
		events: {
			'click .toggle':	'toggleCompleted',
			'dblclick label':	'edit',
			'click .destroy':	'clear',
			'keypress .edit':	'updateOnEnter',
			'blur .update':		'close',
			'focus select':		'setSelect',
			'blur select':		'removeSelect',
			'mouseover label':  'showUser',
			'mouseleave label': 'hideUser'
		},

		// The TodoView listens for changes to its model, re-rendering. Since there's
		// a one-to-one correspondence between a **Todo** and a **TodoView** in this
		// app, we set a direct reference on the model for convenience.
		initialize: function () {
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
			this.listenTo(this.model, 'visible', this.toggleVisible);
		},

		// Re-render the titles of the todo item.
		render: function () {
			this.$el.html(this.template(this.model.toJSON()));
			this.$el.toggleClass('completed', this.model.get('completed'));

			this.toggleVisible();
			this.$input = this.$('.edit');
			return this;
		},

		toggleVisible: function () {
			this.$el.toggleClass('hidden',  this.isHidden());
		},

		isHidden: function () {
			var isCompleted = this.model.get('completed');
			return (// hidden cases only
				(!isCompleted && app.TodoFilter === 'completed') ||
				(isCompleted && app.TodoFilter === 'active')
			);
		},

		// Toggle the `"completed"` state of the model.
		toggleCompleted: function () {
			this.model.toggle();
		},

		// Focus on the 'select' tag
		setSelect: function(){
			userSelect = true;
		},
		
		// Remove focus from the 'select' tag
		removeSelect: function(){
			this.$el.removeClass('editing');
			userSelect = false;
		},

		// Switch this view into `"editing"` mode, displaying the input field.
		edit: function () {
			var select = this.$el.find('select');
			select.html('');
			select.html('<option val = "Unassigned">Unassigned</option>');
			var username = this.model.get('user');
			if (username != "Unassigned" && username != "")
				select.append('<option val = '+username+'>'+username+'</option>');
			select.val(username);
			var seen = {};
			app.Todos.each(function(todo){
				var name = todo.attributes.user;
				if (username != name && seen[name]!=true && name != "Unassigned" && name != "" && app.Users.where({name:name})==0){
					app.Users.create({name:name});
				}
			});
			app.Users.each(function(user){
				var name = user.attributes.name;
				if (username != name && name != "Unassigned" && seen[name]!=true){
					select.append('<option val = '+name+'>'+name+'</option>');
					seen[name]=true;
				}
			});
			this.$el.addClass('editing');
			this.$input.focus();
		},

		// Close the `"editing"` mode, saving changes to the todo.
		close: function () {
			var value = this.$input.val().trim();

			if (value) {
				this.model.save({ title: value });
			} else {
				this.clear();
			}
			
			value = this.$el.find('select').val();
			this.model.save({user : value});
			
			activeItem = this;

			setTimeout(function(){
				if (!userSelect){
					activeItem.$el.removeClass('editing');
				}
			}, 150);
		},
		
		// If you hit `enter`, we're through editing the item.
		updateOnEnter: function (e) {
			if (e.which === ENTER_KEY) {
				this.close();
			}
		},

		// Remove the item, destroy the model from *localStorage* and delete its view.
		clear: function () {
			this.model.destroy();
		},
		
		showUser: function(){
			if (this.model.get('user') == "" || this.model.get('user') == "Unassigned") $('#header').attr('data-user',"Unassigned");
			else $('#header').attr('data-user',"Assigned to: "+this.model.get('user'));
		},
		
		hideUser: function(){
			$('#header').attr("data-user", "");
		}
		
	});
});
