var assert = require('assert'),
	treeStructure = require('../index'),
	Tree = treeStructure.Tree,
	TreeNode = treeStructure.TreeNode;

describe('TreeStructure', function() {
	describe('new Tree() should work', function() {
		var tree = new Tree();

		it('Should have no root node.', function() {
			assert.equal(tree.root, undefined);
		});

		it('Should have no id.', function() {
			assert.equal(tree.id, undefined);
		});

		it('Should have default options.', function() {
			assert.notEqual(tree.options, undefined);
		});

		it('Should have default options childrenField of "children".', function() {
			assert.equal(tree.options.childrenField, 'children');
		});

		it('Should have default options nodeKeyFields of ["id"].', function() {
			assert.equal(JSON.stringify(tree.options.nodeKeyFields), JSON.stringify(['id']));
		});
	});

	describe('new Tree() should work with parameters', function() {
		var tree = new Tree('some id', {
			childrenField: 'sons',
			nodeKeyFields: ['name', 'zip']
		});

		it('Should have no root node.', function() {
			assert.equal(tree.root, undefined);
		});

		it('Should have an id of "some id".', function() {
			assert.equal(tree.id, 'some id');
		});

		it('Should have default options.', function() {
			assert.notEqual(tree.options, undefined);
		});

		it('Should have default options childrenField of "sons".', function() {
			assert.equal(tree.options.childrenField, 'sons');
		});

		it('Should have default options nodeKeyFields of [["data", "name"],["data","zip"], "id"].', function() {
			assert.equal(JSON.stringify(tree.options.nodeKeyFields), JSON.stringify([
				['data', 'name'],
				['data', 'zip'], 'id'
			]));
		});
	});

	describe('new Tree() should unflatten a flattened structure.', function() {
		var tree = new Tree();

		tree.callback = function(type, value) {

		};

		var flattened = {
			id: 'some tree',
			options: {
				childrenField: 'children',
				nodeKeyFields: ['id']
			},
			root: {
				id: 1,
				children: [{
					id: 2
				}, {
					id: 3
				}, {
					id: 4
				}]
			}
		}

		tree.unflatten(flattened);

		it('Should have a root node.', function() {
			assert.notEqual(tree.root, undefined);
		});

		it('Should have an id of "some tree".', function() {
			assert.equal(tree.id, 'some tree');
		});

		it('Should have default options.', function() {
			assert.notEqual(tree.options, undefined);
		});

		it('Should have default options childrenField of "sons".', function() {
			assert.equal(tree.options.childrenField, 'children');
		});

		it('Should have default options nodeKeyFields of ["id"].', function() {
			assert.equal(JSON.stringify(tree.options.nodeKeyFields), JSON.stringify(['id']));
		});

		it('Should have 4 nodes.', function() {
			assert.equal(tree.nodes.all.length, 4);
		});
	});

	describe('new Tree() should flatten an unflattened structure and be the same.', function() {
		var tree = new Tree();

		var flattened = {
			id: 'some tree',
			options: {
				childrenField: 'children',
				nodeKeyFields: ['id']
			},
			root: {
				id: 1,
				children: [{
					id: 2
				}, {
					id: 3
				}, {
					id: 4
				}]
			}
		}

		tree.unflatten(flattened);

		it('Should have flattened be the same as unflattened.', function() {
			assert.deepEqual(tree.flatten(), flattened);
		});
	});

	describe('Adding tree nodes should by default generator uuid via node-uuid.', function() {
		var tree = new Tree();

		var flattened = {
			id: 'some tree',
			options: {
				idGenerator: undefined
			},
			root: {}
		}

		tree.unflatten(flattened);

		it('id should be auto-generated for the root node', function() {
			assert.equal(typeof tree.root.id, 'string');
		});
	});

	describe('Decoupling a node should detach a node so that its only references to the tree are via ids to its children.', function() {
		var tree = new Tree();

		var flattened = {
			id: 'some tree',
			options: {
				idGenerator: undefined
			},
			root: {
				data: {
					text: "Some data string."
				},
				children: [{
					id: 1,
					data: {
						text: "Some data string."
					}
				}]
			}
		}

		tree.unflatten(flattened);

		var rootDecoupled = tree.root.decouple();
		var childDecoupled = tree.nodes.get(1).decouple();

		it('Decoupled node should have an id.', function() {
			assert.equal(rootDecoupled._id, tree.root.id);
		});

		it('Decoupled node should have data.', function() {
			assert.strictEqual(rootDecoupled.data, tree.root.data);
		});

		it('Decoupled node should childIds.', function() {
			assert.deepEqual(rootDecoupled.childIds, [1]);
		});

		it('Decoupled node without children should not have childIds.', function() {
			assert.deepEqual(childDecoupled.childIds, undefined);
		});
	});

	describe('Decoupling a tree should produce predictable JSON.', function() {
		var tree = new Tree();
		var flattened = {
			id: 'some tree',
			options: {
				idGenerator: undefined
			},
			root: {
				id: 100,
				data: {
					text: "Some data string 100."
				},
				children: [{
					id: 1,
					data: {
						text: "Some data string 1."
					}
				}, {
					id: 2,
					data: {
						text: "Some data string 2."
					}
				}, {
					id: 3,
					data: {
						text: "Some data string 3."
					}
				}]
			}
		};

		tree.unflatten(flattened);
	});

	describe('Decoupling a tree should return a reference to a tree and all nodes completely detached.', function() {
		var tree = new Tree();

		var flattened = {
			id: 'some tree',
			options: {
				idGenerator: undefined
			},
			root: {
				id: 100,
				data: {
					text: "Some data string."
				},
				children: [{
					id: 1,
					data: {
						text: "Some data string."
					}
				}, {
					id: 2,
					data: {
						text: "Some data string."
					}
				}, {
					id: 3,
					data: {
						text: "Some data string."
					}
				}]
			}
		}

		tree.unflatten(flattened);

		var beforeJSON = JSON.stringify(tree.flatten());

		var treeDecoupled = tree.decouple();

		it('Decoupled tree should have an id.', function() {
			assert.equal(treeDecoupled.tree._id, tree.id);
		});

		it('Decoupled tree should have no root.', function() {
			assert.strictEqual(treeDecoupled.tree.root, undefined);
		});

		it('Decoupled tree should have root node id.', function() {
			assert.strictEqual(treeDecoupled.tree.rootId, 100);
		});

		it('Decoupled tree should have no children.', function() {
			assert.strictEqual(treeDecoupled.tree.nodes, undefined);
		});

		it('Decoupled node should nodes.', function() {
			assert.deepEqual(treeDecoupled.nodes.length, 4);
		});

		tree.recouple(treeDecoupled.tree, treeDecoupled.nodes);

		var afterJSON = JSON.stringify(tree.flatten());

		it('Decoupled and recoupled should be the same.', function() {
			assert.equal(beforeJSON, afterJSON);
		});
	});
});