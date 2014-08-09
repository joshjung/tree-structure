var HashArray = require('hasharray');

var TreeNode = function(parent, id, children) {
	var that = this;

	this.__defineSetter__('_children', function(value) {
		this[this.options.childrenField] = value;
	});

	this.__defineGetter__('_children', function() {
		return this[this.options.childrenField];
	});

	this.__defineSetter__('parent', function(value) {
		if (value.constructor !== TreeNode) {
			this.parentTree = value;
		} else {
			this._parent = value;
			this.parentTree = value.parentTree;
		}
		this.options = this.parentTree.options;
	});

	this.__defineGetter__('parent', function() {
		return this._parent;
	});

	this.clear = function() {
		this._children = new HashArray(this.options.nodeKeyFields, childNodeChanged);
		this.data = undefined;
	};

	this.id = id;
	this.parent = parent;
	this.clear();

	if (children)
		this._children.add.apply(this._children, children);

	function childNodeChanged(type, value) {
		switch (type) {
			case 'add':
				// One or more child nodes have been added.
				this.parent.nodesAddedHandler(that, value);
				break;
			case 'remove':
			case 'removeByKey':
				// One or more chidl nodes have been removed.
				this.parent.nodesRemovedHandler(that, value);
				break;
			case 'construct':
				break;
			case 'removeAll':
				// All child nodes have been set to nothing.
				this.parent.nodesRemovedHandler(value);
				break;
		}
	}
};

TreeNode.prototype = {
	each: function(callback) {
		this.eachChild(function(child) {
			callback(child);
			child.each(callback);
		});
	},
	eachChild: function(callback) {
		var children = this._children.all.concat(),
			len = children.length;

		for (var i = 0; i < len; i++) {
			callback(children[i], i);
		}
	},
	add: function(node) {
		node.parent = this;
		this._children.add(node);
	},
	flatten: function() {
		var ret = {
				id: this.id,
				data: this.data
			},
			c = ret[this.options.childrenField] = [];

		this.each(function(child) {
			c.push(child.flatten());
		});

		return ret;
	},
	unflatten: function(data, parent) {
		this.id = data.id;
		this.parent = parent;
		this.clear();

		for (var ix in data[this.options.nodeKeyFields]) {
			var newChild = this.unflatten(data[this.options.nodeKeyFields][ix], this);
			this._children.add(newChild);
		}

		this.data = data.data;
	}
};

module.exports = TreeNode;