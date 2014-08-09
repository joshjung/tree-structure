var HashArray = require('hasharray'),
	TreeNode = require('./TreeNode');

/**
 * id: id of the tree. Used for debugging or for saving to a db.
 * options: {
 *    childrenField: 'children',
 *    nodeKeyFields: ['keys', 'for', 'hasharray']
 *  }
 */
var Tree = function(id, options, nodes) {
	this.id = id;

	this.options = options || {};
	this.options.childrenField = this.options.childrenField || 'children';

	this.nodes = new HashArray(['id']);

	if (options && options.nodeKeyFields) {
		var kf = options.nodeKeyFields.concat();
		for (var i = 0; i < kf.length; i++)
			kf[i] = ['data', kf[i]];
		kf.push('id');
		this.options.nodeKeyFields = kf;
	} else {
		this.options.nodeKeyFields = ['id'];
	}

	this.__defineGetter__('root', function() {
		return this._root;
	});

	this.__defineSetter__('root', function(value) {
		this._root = value;
		this.refresh();
	});
};

Tree.prototype = {
	refresh: function() {
		this.allNodes = new HashArray(this.options.nodeKeyFields);
		this.root.each(function(child, ix) {
			this.allNodes.add(child);
		});
	},
	get: function(key) {
		return this.allNodes.get(key);
	},
	flatten: function() {
		return {
			id: id,
			options: this.options,
			root: root.flatten()
		};
	},
	unflatten: function(data) {
		this.id = data.id;
		this.options = data.options;
		this.root = new TreeNode(this);
		this.root.unflatten(data.root, this);
	},
	nodesAddedHandler: function(nodes) {
		this.nodes.add(nodes);
	},
	nodesRemovedHandler: function(nodes) {
		this.nodes.remove(nodes);
	}
};

module.exports = Tree;