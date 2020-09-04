// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = acquireVsCodeApi();

    // const oldState = vscode.getState();

    // const counter = document.getElementById('lines-of-code-counter');
    // console.log(oldState);
    // let currentCount = (oldState && oldState.count) || 0;
    // counter.textContent = currentCount;

    // setInterval(() => {
    //     counter.textContent = currentCount++;

    //     // Update state
    //     vscode.setState({ count: currentCount });

    //     // Alert the extension when the cat introduces a bug
    //     if (Math.random() < Math.min(0.001 * currentCount, 0.05)) {
    //         // Send a message back to the extension
    //         vscode.postMessage({
    //             command: 'alert',
    //             text: '🐛  on line ' + currentCount
    //         });
    //     }
    // }, 100);

    // // Handle messages sent from the extension to the webview
    // window.addEventListener('message', event => {
    //     const message = event.data; // The json data that the extension sent
    //     switch (message.command) {
    //         case 'refactor':
    //             currentCount = Math.ceil(currentCount * 0.5);
    //             counter.textContent = currentCount;
    //             break;
    //     }
    // });

    document.getElementById("clear").addEventListener("click", function(){
        const yaml = document.getElementById("yaml");
        yaml.innerHTML = "";
    }, false);

    // document.getElementById("editable-right").addEventListener("keyup", function(e) {
    //     // setTimeout(function() {onPaste('editable-left');}, 0)
    //     console.log("keyup event fired");

    //     const editable = document.getElementById("editable-right");
    //     const dockerCompose = editable.innerText;
    //     editable.innerHTML = `<code id='yaml' class='language-yaml line-numbers'></code>`;

    //     const yaml = document.getElementById("yaml");

    //     yaml.innerHTML = Prism.highlight(
    //         dockerCompose,
    //         Prism.languages.yaml,
    //         "yaml"
    //     );

    //     setTimeout(function() {
    //         Prism.highlightAll();
    //     }, 0);
    // }, false);

    document.getElementById("editable-right").addEventListener("input", function() {
        // var restore = saveCaretPosition(this);
        // Prism.highlightElement(this);
        // const savedSel = rangy.saveSelection();


        console.log("input event fired");

        const editable = document.getElementById("editable-right");
        const dockerCompose = editable.innerText;
        editable.innerHTML = `<code id='yaml' class='language-yaml line-numbers'></code>`;

        const yaml = document.getElementById("yaml");

        yaml.innerHTML = Prism.highlight(
            dockerCompose,
            Prism.languages.yaml,
            "yaml"
        );


        setTimeout(function() {
            Prism.highlightAll();
        }, 0);

        // rangy.restoreSelection(savedSel);

    }, false);
}());



















/**
* This is ported from Rangy's selection save and restore module and has no dependencies.
* Copyright 2019, Tim Down
* Licensed under the MIT license.
*
* Documentation: https://github.com/timdown/rangy/wiki/Selection-Save-Restore-Module
* Use "rangeSelectionSaveRestore" instead of "rangy"
*/
var rangy = (function() {
    var markerTextChar = "\ufeff";
    var selectionHasExtend = (typeof window.getSelection().extend !== "undefined");

    function gEBI(id, doc) {
        return (doc || document).getElementById(id);
    }

    function removeNode(node) {
        node.parentNode.removeChild(node);
    }

    // Utility function to support direction parameters in the API that may be a string ("backward", "backwards",
    // "forward" or "forwards") or a Boolean (true for backwards).
    function isDirectionBackward(dir) {
        return (typeof dir == "string") ? /^backward(?:s)?$/i.test(dir) : !!dir;
    }

    function isSelectionBackward(sel) {
        var backward = false;
        if (!sel.isCollapsed) {
            var range = document.createRange();
            range.setStart(sel.anchorNode, sel.anchorOffset);
            range.setEnd(sel.focusNode, sel.focusOffset);
            backward = range.collapsed;
        }
        return backward;
    }

    function selectRangeBackwards(sel, range) {
        if (selectionHasExtend) {
            var endRange = range.cloneRange();
            endRange.collapse(false);
            sel.removeAllRanges();
            sel.addRange(endRange);
            sel.extend(range.startContainer, range.startOffset);
            return true;
        } else {
            // Just select the range forwards
            sel.removeAllRanges();
            sel.addRange(range);
            return false;
        }
    }

    function insertRangeBoundaryMarker(range, atStart) {
        var markerId = "selectionBoundary_" + (+new Date()) + "_" + ("" + Math.random()).slice(2);
        var markerEl;
        var doc = range.startContainer.ownerDocument;

        // Clone the Range and collapse to the appropriate boundary point
        var boundaryRange = range.cloneRange();
        boundaryRange.collapse(atStart);

        // Create the marker element containing a single invisible character using DOM methods and insert it
        markerEl = doc.createElement("span");
        markerEl.id = markerId;
        markerEl.style.lineHeight = "0";
        markerEl.style.display = "none";
        markerEl.textContent = markerTextChar;

        boundaryRange.insertNode(markerEl);
        return markerEl;
    }

    function setRangeBoundary(doc, range, markerId, atStart) {
        var markerEl = gEBI(markerId, doc);
        if (markerEl) {
            range[atStart ? "setStartBefore" : "setEndBefore"](markerEl);
            removeNode(markerEl);
        } else {
            module.warn("Marker element has been removed. Cannot restore selection.");
        }
    }

    function compareRanges(r1, r2) {
        return r2.compareBoundaryPoints(r1.START_TO_START, r1);
    }

    function saveRange(range, direction) {
        var startEl, endEl, doc = range.startContainer.ownerDocument, text = range.toString();

        if (range.collapsed) {
            endEl = insertRangeBoundaryMarker(range, false);
            return {
                document: doc,
                markerId: endEl.id,
                collapsed: true
            };
        } else {
            endEl = insertRangeBoundaryMarker(range, false);
            startEl = insertRangeBoundaryMarker(range, true);

            return {
                document: doc,
                startMarkerId: startEl.id,
                endMarkerId: endEl.id,
                collapsed: false,
                backward: isDirectionBackward(direction),
                toString: function() {
                    return "original text: '" + text + "', new text: '" + range.toString() + "'";
                }
            };
        }
    }

    function restoreRange(rangeInfo) {
        var doc = rangeInfo.document;
        if (typeof normalize == "undefined") {
            normalize = true;
        }
        var range = doc.createRange(doc);
        if (rangeInfo.collapsed) {
            var markerEl = gEBI(rangeInfo.markerId, doc);
            if (markerEl) {
                markerEl.style.display = "inline";
                var previousNode = markerEl.previousSibling;

                if (previousNode && previousNode.nodeType == 3) {
                    removeNode(markerEl);
                    range.setStart(previousNode, previousNode.length);
                    range.collapse(true);
                } else {
                    range.setEndBefore(markerEl);
                    range.collapse(false);
                    removeNode(markerEl);
                }
            } else {
                console.warn("Marker element has been removed. Cannot restore selection.");
            }
        } else {
            setRangeBoundary(doc, range, rangeInfo.startMarkerId, true);
            setRangeBoundary(doc, range, rangeInfo.endMarkerId, false);
        }

        return range;
    }

    function saveRanges(ranges, direction) {
        // Order the ranges by position within the DOM, latest first, cloning the array to leave the original untouched
        ranges = ranges.slice(0);
        ranges.sort(compareRanges);
        var backward = isDirectionBackward(direction);

        var rangeInfos = ranges.map(function(range) {
            return saveRange(range, backward)
        });

        // Now that all the markers are in place and DOM manipulation is over, adjust each range's boundaries to lie
        // between its markers
        for (var i = ranges.length - 1, range, doc; i >= 0; --i) {
            range = ranges[i];
            doc = range.startContainer.ownerDocument;
            if (range.collapsed) {
                range.setStartAfter(gEBI(rangeInfos[i].markerId, doc));
                range.collapse(true);
            } else {
                range.setEndBefore(gEBI(rangeInfos[i].endMarkerId, doc));
                range.setStartAfter(gEBI(rangeInfos[i].startMarkerId, doc));
            }
        }

        return rangeInfos;
    }

    function saveSelection(win) {
        win = win || window;
        var sel = win.getSelection();
        var ranges = [];
        for (var i = 0; i < sel.rangeCount; ++i) {
            ranges.push( sel.getRangeAt(i) );
        }
        var backward = (ranges.length == 1 && isSelectionBackward(sel));
        var rangeInfos = saveRanges(ranges, backward);

        // Ensure current selection is unaffected
        sel.removeAllRanges();
        if (backward) {
            selectRangeBackwards(sel, ranges[0]);
        } else {
            ranges.forEach(function(range) {
                sel.addRange(range);
            });
        }

        return {
            win: win,
            rangeInfos: rangeInfos,
            restored: false
        };
    }

    function restoreRanges(rangeInfos) {
        var ranges = [];

        // Ranges are in reverse order of appearance in the DOM. We want to restore earliest first to avoid
        // normalization affecting previously restored ranges.
        var rangeCount = rangeInfos.length;

        for (var i = rangeCount - 1; i >= 0; i--) {
            ranges[i] = restoreRange(rangeInfos[i], true);
        }

        return ranges;
    }

    function restoreSelection(savedSelection, preserveDirection) {
        if (!savedSelection.restored) {
            var rangeInfos = savedSelection.rangeInfos;
            var sel = savedSelection.win.getSelection();
            var ranges = restoreRanges(rangeInfos);
            var rangeCount = rangeInfos.length;

            sel.removeAllRanges();
            if (rangeCount == 1 && preserveDirection && selectionHasExtend && rangeInfos[0].backward) {
                selectRangeBackwards(sel, ranges[0]);
            } else {
                ranges.forEach(function(range) {
                    sel.addRange(range);
                });
            }

            savedSelection.restored = true;
        }
    }

    function removeMarkerElement(doc, markerId) {
        var markerEl = gEBI(markerId, doc);
        if (markerEl) {
            removeNode(markerEl);
        }
    }

    function removeMarkers(savedSelection) {
        savedSelection.rangeInfos.forEach(function(rangeInfo) {
            if (rangeInfo.collapsed) {
                removeMarkerElement(savedSelection.doc, rangeInfo.markerId);
            } else {
                removeMarkerElement(savedSelection.doc, rangeInfo.startMarkerId);
                removeMarkerElement(savedSelection.doc, rangeInfo.endMarkerId);
            }
        });
    }

    return {
        saveRange: saveRange,
        restoreRange: restoreRange,
        saveRanges: saveRanges,
        restoreRanges: restoreRanges,
        saveSelection: saveSelection,
        restoreSelection: restoreSelection,
        removeMarkerElement: removeMarkerElement,
        removeMarkers: removeMarkers
    };
})();