tree-structure
==============

A basic tree data structure with objects for Tree and Node for Node.js.

Install
=======

    npm install tree-structure

Goals
=====

In Computer Science, a tree is a data structure constructed of Nodes, where there is a root node and all nodes extend from the root.

The standard automaton that Turing discovered was based on the idea of a tape of characters. As one can imagine, storing a tree on a tape with a start and an end is not ideal.

My goal with this module and the accompanying [tree-structure-mongodb](https://github.com/joshjung/tree-structure-mongodb) module is to provide a way to create, manipulate, and store trees in a database in the most efficient possible way.

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