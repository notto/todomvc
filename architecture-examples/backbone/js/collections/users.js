/*global Backbone Store*/
var app = app || {};

(function () {
	'use strict';

	// User Collection
	// ---------------

	// The collection of users is backed by *localStorage*
	var UserList = Backbone.Collection.extend({

		// Reference to this collection's model.
		model: app.User,

		// Save all of the todo items under the `"users"` namespace.
		localStorage: new Store('users-backbone'),

		// We keep the Users in sequential order, despite being saved by unordered
		// GUID in the database. This generates the next order number for new items.
		nextOrder: function () {
			if (!this.length) {
				return 1;
			}
			return this.last().get('order') + 1;
		},

		// Todos are sorted by their original insertion order.
		comparator: function (user) {
			return user.get('order');
		}
	});

	// Create our global collection of **Todos**.
	app.Users = new UserList();

}());