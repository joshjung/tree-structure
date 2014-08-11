var HashArray = require('hasharray');

var TreeNode = function(parent, id, children, data) {
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

	this.parent = parent;
	this.clear();
	this.data = data;
	this.id = id ? id : this.parentTree.options.idGenerator(this);

	if (children)
		this._children.add.apply(this._children, children);

	function childNodeChanged(type, value) {
		switch (type) {
			case 'add':
				// One or more child nodes have been added.
				that.parentTree.nodesAddedHandler(that, value);
				break;
			case 'remove':
			case 'removeByKey':
				// One or more chidl nodes have been removed.
				that.parentTree.nodesRemovedHandler(that, value);
				break;
			case 'construct':
				break;
			case 'removeAll':
				// All child nodes have been set to nothing.
				that.parentTree.nodesRemovedHandler(that);
				break;
		}
	}
};

TreeNode.prototype = {
	each: function(callback) {
		this.eachChild(function(child) {
			child.each(callback);
		});
		callback(this);
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
			id: this.id
		};

		if (this._children.all.length) {
			c = ret[this.options.childrenField] = [];
			this.eachChild(function(child) {
				c.push(child.flatten());
			});
		}

		if (this.data) {
			ret.data = this.data;
		}

		return ret;
	},
	unflatten: function(data, parent) {
		this.parent = parent;
		this.clear();
		this.id = data.id ? data.id : parent.options.idGenerator();

		var children = data[this.options.childrenField];
		for (var ix in children) {
			var newChild = new TreeNode(this);
			newChild.unflatten(children[ix], this);
			this._children.add(newChild);
		}

		if (data.data) {
			this.data = data.data;
		}
	},
	decouple: function() {
		var ids = [];
		this.eachChild(function(child) {
			ids.push(child.id);
		});

		return {
			_id: this.id,
			data: this.data,
			childIds: ids.length ? ids : undefined
		};
	},
	recouple: function() {
		if (this.childIds) {
			for (var i in this.childIds) {
				var id = this.childIds[i];
				var node = this.parentTree.nodes.get(id);
				if (!node) {
					throw Error('node not defined for ' + id);
				}
				this._children.add(node);
				node.recouple();
			}
		}
	}
};

module.exports = TreeNode;