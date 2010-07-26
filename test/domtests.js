xn.test.suite("Range", function(s) {
    function createTestNodes(parentNode, limit, copies) {
        if (limit > 0) {
            var n = parentNode.appendChild(document.createElement("div"));
            n.appendChild(document.createTextNode("Before "));
            var p = n.appendChild(document.createElement("div"));
            n.appendChild(document.createTextNode(" after"));
            for (var i = 0; i < copies; i++) {
                createTestNodes(p, limit - 1, copies);
            }
        }
    }

    var testNode = document.createElement("div");
    createTestNodes(testNode, 14, 2);

    var recursiveNodes, nonRecursiveNodes, iteratorNodes;
    var dom = rangy.dom;

    s.test("Iterate nodes (iterator)", function(t) {
        iteratorNodes = [];
        var it = dom.createIterator(testNode), node;
        while ( (node = it.next()) ) {
            iteratorNodes.push(node);
        }
    });

    s.test("Check results", function(t) {
        t.assertArraysEquivalent(recursiveNodes, nonRecursiveNodes);
    });

    s.test("Check results", function(t) {
        t.assertArraysEquivalent(iteratorNodes, nonRecursiveNodes);
    });


    var arrayContains =         function(arr, val) {
            var i = arr.length;
            while (i--) {
                if (arr[i] === val) {
                    return true;
                }
            }
            return false;
        };

    var validNodeTypes = [1, 3, 4, 5, 6, 8, 9, 10];


    var numNodeTypes = 100;
    var isValid1, isValid2;

    s.test("Node types regex", function(t) {
        isValid1 = [];
        var i = numNodeTypes;
        var regex = new RegExp("^(" + validNodeTypes.join("|") + ")$");
        while (i--) {
            isValid1[i] = regex.test((i % 12));
        }
    });

    s.test("Node types array contains", function(t) {
        isValid2 = [];
        var i = numNodeTypes;
        while (i--) {
            isValid2[i] = arrayContains(validNodeTypes, i % 12);
        }
    });

    s.test("Check results", function(t) {
        t.assertArraysEquivalent(isValid1, isValid2);
    });


}, false);
