tree-structure
==============

A basic tree data structure with objects for Tree and Node for Node.js.

Install
=======

    npm install tree-structure

Examples
========

    var treeStructure = require('tree-structure'),
      Tree = treeStructure.Tree;
      TreeNode = treeStructure.TreeNode;

    var tree = new Tree('tree name', {
        childrenField: 'children'
      });

    var flat = {
      id: 1,
      data: {
        text: 'hello there'
      },
      children: [
        {
          id: 2,
          data: {
            text: 'whats up'
          }
        },
        {
          id: 3,
          data: {
            text: 'this is a sweeet library for sure'
          }
        }
      ]
    };

    tree.unflatten(flat);

    var root = tree.root; // Return the root node.
    console.log(root == tree.get(1)); // 'true'

    var node = new TreeNode();