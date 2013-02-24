/*global Backbone*/
var app = app || {};

(function () {
	'use strict';

	// User Model
	// ----------

	// Our basic **User** model has 'name' and 'color' attributes.
	app.User = Backbone.Model.extend({

		// Default attributes for the user
		// and ensure that each user created has `name` and `color` keys.
		defaults: {
			name: '',
			color: ''
		}

	});

}());
