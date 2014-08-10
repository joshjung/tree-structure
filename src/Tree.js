var HashArray = require('hasharray'),
	TreeNode = require('./TreeNode'),
	uuid = require('node-uuid');

/**
 * id: id of the tree. Used for debugging or for saving to a db.
 * options: {
 *    childrenField: 'children',
 *    nodeKeyFields: ['keys', 'for', 'hasharray']
 *  }
 */
var Tree = function(id, options, nodes, callback) {
	this.id = id;

	this.validateOptions = function() {
		this.options = this.options || {};
		this.options.childrenField = this.options.childrenField || 'children';
		this.options.idGenerator = this.options.idGenerator || function(node) {
			return uuid.v4();
		};
		if (options && options.nodeKeyFields) {
			var kf = options.nodeKeyFields.concat();
			for (var i = 0; i < kf.length; i++)
				kf[i] = ['data', kf[i]];
			kf.push('id');
			this.options.nodeKeyFields = kf;
		} else {
			this.options.nodeKeyFields = ['id'];
		}
	}

	this.options = options;
	this.validateOptions();

	this.nodes = new HashArray(['id']);

	this.__defineGetter__('root', function() {
		return this._root;
	});

	this.__defineSetter__('root', function(value) {
		this._root = value;
		this.refresh();
	});

	this.__defineSetter__('callback', function(value) {
		this._callback = this.nodes.callback = value;
	});
};

Tree.prototype = {
	refresh: function() {
		var that = this;
		this.nodes = new HashArray(this.options.nodeKeyFields, this._callback);
		this.root.each(function(child, ix) {
			that.nodes.add(child);
		});
	},
	get: function(key) {
		return this.allNodes.get(key);
	},
	flatten: function() {
		return {
			id: this.id,
			options: this.options,
			root: this.root.flatten()
		};
	},
	unflatten: function(data) {
		this.id = data.id;
		this.options = data.options;
		this.validateOptions();
		this.root = new TreeNode(this);
		this.root.unflatten(data.root, this);
	},
	toTreeAndNodes: function() {
		var nodes = [];
		var tree = {
			'_id': this.id
		};

		root.forEach(function(node, ix) {
			nodes.push(node.toDBNode());
		});
	},
	nodesAddedHandler: function(node, nodes) {
		this.nodes.add.apply(this.nodes, nodes);
	},
	nodesRemovedHandler: function(node, nodes) {
		this.nodes.remove(nodes);
	},
	clone: function() {
		//TODO
	}
};

module.exports = Tree;