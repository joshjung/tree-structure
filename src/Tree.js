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

	this.clear = function() {
		this.nodes = new HashArray(['id']);
	}

	this.clear();
	this.options = options;
	this.validateOptions();

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
	decouple: function() {
		var nodes = [];
		var tree = {
			_id: this.id,
			rootId: this.root.id,
			nodeIds: [],
			options: {
				childrenField: this.options.childrenField,
				nodeKeyFields: this.options.nodeKeyFields
			}
		};

		this.root.each(function(node, ix) {
			nodes.push(node.decouple());
			tree.nodeIds.push(node.id);
		});

		return {
			tree: tree,
			nodes: nodes
		};
	},
	recouple: function(tree, nodes) {
		if (!tree)
			throw Error('tree must be defined!');

		if (!nodes)
			throw Error('nodes must be defined!');

		this.clear();
		this.id = tree._id;
		this.options = tree.options;
		this.validateOptions();

		// First we construct all the nodes as orphaned nodes in our
		// hasharray, making sure to assing ids.
		for (var i = 0; i < nodes.length; i++) {
			var node = new TreeNode(this, nodes[i]._id);
			node.data = nodes[i].data;
			node.childIds = nodes[i].childIds;
			this.nodes.add(node);
		}

		this._root = this.nodes.get(tree.rootId);

		// Now we recouple starting with the root node.
		this.root.recouple(tree, nodes);
	},
	nodesAddedHandler: function(node, nodes) {
		this.nodes.add.apply(this.nodes, nodes);
	},
	nodesRemovedHandler: function(node, nodes) {
		this.nodes.remove(nodes);
	},
	clone: function() {
		//TODO
	},
	randomize: function(nodeCount) {
		/*var tree = {
			id: 'random',
			root: {}
		};

		for (var i = 0; i < nodeCount; i++) {

		}*/
	}
};

module.exports = Tree;