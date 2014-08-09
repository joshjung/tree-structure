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
			//			console.log(type, value);
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

		tree.callback = function(type, value) {
			//			console.log(type, value);
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

		it('Should have flattened be the same as unflattened.', function() {
			assert.deepEqual(tree.flatten(), flattened);
		});
	});
});