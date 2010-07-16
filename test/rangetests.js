xn.test.suite("Range", function(s) {
    function createJsDomRange(doc) {
        return new DomRange(doc);
    }

    function createNativeDomRange(doc) {
        return doc.createRange();
    }

    var hasNativeDomRange = "createRange" in document;

    s.setUp = function(t) {
        var div = document.createElement("div");
        var plainText = div.appendChild(document.createTextNode("plain"));
        var b = div.appendChild(document.createElement("b"));
        var boldText = b.appendChild(document.createTextNode("bold"));
        var i = b.appendChild(document.createElement("i"));
        var boldAndItalicText = i.appendChild(document.createTextNode("bold and italic"));
        document.body.appendChild(div);
        t.nodes = {
            div: div,
            plainText: plainText,
            b: b,
            boldText: boldText,
            i: i,
            boldAndItalicText: boldAndItalicText
        };
    };

    s.tearDown = function(t) {
        document.body.removeChild(t.nodes.div);
        t.nodes = null;
    };


    function testBothRangeTypes(name, testFunc) {
        s.test(name + " (Custom Range)", function(t) {
            testFunc(t, createJsDomRange);
        });

        if (hasNativeDomRange) {
            s.test(name + " (Native Range)", function(t) {
                testFunc(t, createNativeDomRange);
            });
        }
    }

    testBothRangeTypes("Initial Range values", function(t, rangeCreator) {
        var range = rangeCreator(document);
        t.assertEquivalent(range.startContainer, document);
        t.assertEquivalent(range.startOffset, 0);
        t.assertEquivalent(range.endContainer, document);
        t.assertEquivalent(range.endOffset, 0);
    });


    testBothRangeTypes("setStart after end test", function(t, rangeCreator) {
        var range = rangeCreator(document);
        range.setStart(t.nodes.plainText, 2);
        t.assert(range.collapsed);
        t.assertEquivalent(range.startContainer, t.nodes.plainText);
        t.assertEquivalent(range.startOffset, 2);
        t.assertEquivalent(range.endContainer, t.nodes.plainText);
        t.assertEquivalent(range.endOffset, 2);
    });

    testBothRangeTypes("setEnd after start test", function(t, rangeCreator) {
        var range = rangeCreator(document);
        range.setEnd(t.nodes.b, 1);
        t.assertFalse(range.collapsed);
        t.assertEquivalent(range.startContainer, document);
        t.assertEquivalent(range.startOffset, 0);
        t.assertEquivalent(range.endContainer, t.nodes.b);
        t.assertEquivalent(range.endOffset, 1);
    });

    testBothRangeTypes("setStart after interesting end test", function(t, rangeCreator) {
        var range = rangeCreator(document);
        range.setEnd(t.nodes.b, 1);
        range.setStart(t.nodes.boldAndItalicText, 2);
        t.assert(range.collapsed);
        t.assertEquivalent(range.startContainer, t.nodes.boldAndItalicText);
        t.assertEquivalent(range.startOffset, 2);
        t.assertEquivalent(range.endContainer, t.nodes.boldAndItalicText);
        t.assertEquivalent(range.endOffset, 2);
    });

    testBothRangeTypes("compareBoundaryPoints 1", function(t, rangeCreator) {
        var range1 = rangeCreator(document);
        var range2 = rangeCreator(document);
        range1.setStart(t.nodes.b, 1);
        range1.setEnd(t.nodes.boldAndItalicText, 2);
        range2.setStart(t.nodes.plainText, 1);
        range2.setEnd(t.nodes.b, 1);

        t.assertEquivalent(range1.compareBoundaryPoints(range1.START_TO_START, range2), 1);
        t.assertEquivalent(range1.compareBoundaryPoints(range1.START_TO_END, range2), 1);
        t.assertEquivalent(range1.compareBoundaryPoints(range1.END_TO_START, range2), 0);
        t.assertEquivalent(range1.compareBoundaryPoints(range1.END_TO_END, range2), 1);
    });

    testBothRangeTypes("cloneContents 1", function(t, rangeCreator) {
        var range = rangeCreator(document);
        range.setStart(t.nodes.plainText, 1);
        range.setEnd(t.nodes.b, 1);
        var frag = range.cloneContents();
        var div = document.createElement("div");
        div.appendChild(frag);
        log.info(range.toString(), div.innerHTML);

/*
        range.deleteContents();
        log.info(t.nodes.div.innerHTML);
*/
        if (range.getNodes) {
            console.log(range.getNodes());
        }
    });


}, false);
