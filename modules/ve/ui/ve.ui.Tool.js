/*!
 * VisualEditor UserInterface Tool class.
 *
 * @copyright 2011-2013 VisualEditor Team and others; see AUTHORS.txt
 * @license The MIT License (MIT); see LICENSE.txt
 */

/**
 * UserInterface tool.
 *
 * @class
 * @abstract
 * @extends ve.ui.Widget
 *
 * @constructor
 * @param {ve.ui.Toolbar} toolbar
 * @param {Object} [config] Config options
 */
ve.ui.Tool = function VeUiTool( toolbar, config ) {
	// Parent constructor
	ve.ui.Widget.call( this, config );

	// Properties
	this.toolbar = toolbar;

	// Events
	this.toolbar.addListenerMethods(
		this, { 'updateState': 'onUpdateState' }
	);
	ve.triggerRegistry.addListenerMethods(
		this, { 'register': 'onTriggerRegistryRegister' }
	);

	// Initialization
	this.setTitle();
	this.$.addClass( 've-ui-Tool' );
};

/* Inheritance */

ve.inheritClass( ve.ui.Tool, ve.ui.Widget );

/* Static Properties */

/**
 * Symbolic name of tool.
 *
 * @abstract
 * @static
 * @property {string}
 */
ve.ui.Tool.static.name = '';

/**
 * CSS class name, rendered as ve-ui-dropdownTool-cssName
 *
 * If this is left as null, static.name is used instead.
 *
 * @abstract
 * @static
 * @property {string}
 */
ve.ui.Tool.static.cssName = null;

/**
 * Message key for tool title.
 *
 * @abstract
 * @static
 * @property {string}
 */
ve.ui.Tool.static.titleMessage = null;

/* Methods */

/**
 * Handle trigger registry register events.
 *
 * If a trigger is registered after the tool is loaded, this handler will ensure the tool's title is
 * updated to reflect the available key command for the tool.
 *
 * @param {string} name Symbolic name of trigger
 */
ve.ui.Tool.prototype.onTriggerRegistryRegister = function ( name ) {
	if ( name === this.constructor.static.name ) {
		this.setTitle();
	}
};

/**
 * Handle the toolbar state being updated.
 *
 * This is an abstract method that must be overridden in a concrete subclass.
 *
 * @abstract
 * @method
 */
ve.ui.Tool.prototype.onUpdateState = function () {
	throw new Error(
		've.ui.Tool.onUpdateState not implemented in this subclass:' + this.constructor
	);
};

/**
 * Sets the tool title attribute in the dom.
 *
 * Combines trigger i18n with tooltip message if trigger exists.
 * Otherwise defaults to titleMessage value.
 *
 * @abstract
 * @method
 * @chainable
 */
ve.ui.Tool.prototype.setTitle = function () {
	var trigger = ve.triggerRegistry.lookup( this.constructor.static.name ),
		labelMessage = this.constructor.static.titleMessage,
		labelText = labelMessage ? ve.msg( labelMessage ) : '';

	if ( trigger ) {
		labelText += ' [' + trigger.getMessage() + ']';
	}
	this.$.attr( 'title', labelText );
	return this;
};
