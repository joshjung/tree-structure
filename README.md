tree-structure
==============

A basic tree data structure with objects for Tree and Node for Node.js.

Install
=======

    npm install tree-structure

Goals
=====

In Computer Science, a tree is a data structure constructed of nodes that contains no cycles and has a single node at its root from which all node paths extend.

The standard automaton that Turing discovered was based on the idea of a sequence of characters. As one can imagine, storing a tree on a tape with a start and an end is not ideal and therefore saving a tree to a database can be troublesome especially if one would like to reuse nodes across multiple trees.

My goal with this module and the accompanying [tree-structure-mongodb](https://github.com/joshjung/tree-structure-mongodb) module is to provide a way to create, manipulate, and store trees in a database in the most efficient possible way and to allow reuse of nodes across multiple trees (optionally).

Examples
========

Construct a basic tree from a Javascript object.

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

Decouple all the nodes from eachother so that each object simple has a `childIds` property. This prepares the data for saving to a database:

    var treeStructure = require('tree-structure'),
      Tree = treeStructure.Tree;
      TreeNode = treeStructure.TreeNode;

    var tree = new Tree('tree name');

    var flat = {
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
    }

    tree.unflatten(flat);

    console.log(tree.decouple()); // Output below

The output of the decoupled tree is JSON that looks like the following:

    { tree: 
       { id: 'some tree',
         rootId: 100,
         nodeIds: [ 1, 2, 3, 100 ],
         options: { childrenField: 'children', nodeKeyFields: [Object] } },
      nodes: 
       [ { id: 1, data: {...} },
         { id: 2, data: {...} },
         { id: 3, data: {...} },
         { id: 100, data: {...}, childIds: [ 1, 2, 3 ] } ] }

The `tree` Object in the above JSON has a reference to all of the ids of its child nodes without actually having a direct reference to them.

Each node in the `nodes` array in the JSON above has a reference to all of its child ids, but without having a direct reference to them.

As a result, one can - in two MongoDG queries - save the `tree` object and then the `nodes` object. This ensures that each node is its own document and that each tree is its own document in a separate collection.

**This is why I chose to call the function `decouple`.** Decoupling all the nodes in the tree from eachother - other than just an `id` reference - makes it easy to ave and retrieve the entire tree from the database in two queries.

UNDER CONSTRUCTION
==================

This project is still being developed as of August 11, 2014. Please let me know of any bugs on my github page and I will hopefully get to them within a day.

License
=======

The MIT License (MIT)

Copyright (c) 2014 Joshua Jung

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.