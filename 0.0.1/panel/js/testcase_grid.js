/*
 * Copyright 2017 SideeX committers
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

function cleanSelected() {
    // use jquery's API to add and remove class property
    $('#testCase-grid .selectedCase').removeClass('selectedCase');
    $('#testCase-grid .selectedSuite').removeClass('selectedSuite');
}

function setSelectedSuite(id) {
    saveOldCase();
    cleanSelected();
    $("#" + id).addClass('selectedSuite');
    clean_panel();
    // document.getElementById("records-grid").innerHTML = "";
}

function setSelectedCase(id) {
    saveOldCase();
    var suite_id = document.getElementById(id).parentNode.id;
    setSelectedSuite(suite_id);
    $("#" + id).addClass('selectedCase');
    clean_panel();
    document.getElementById("records-grid").innerHTML = escapeHTML(sideex_testCase[id].records);
    attachEvent(1, getRecordsNum());
}

function getSelectedSuite() {
    if (document.getElementById("testCase-grid").getElementsByClassName("selectedSuite")) {
        return document.getElementById("testCase-grid").getElementsByClassName("selectedSuite")[0];
    } else {
        return null;
    }
}

function getSelectedCase() {
    if (document.getElementById("testCase-grid").getElementsByClassName("selectedCase")) {
        return document.getElementById("testCase-grid").getElementsByClassName("selectedCase")[0];
    } else {
        return null;
    }
}

function saveOldCase() {
    var old_case = getSelectedCase();
    if (old_case) {
        sideex_testCase[old_case.id].records = document.getElementById("records-grid").innerHTML;
    }
}

function appendContextMenu(node, isCase) {
    var ul = document.createElement("ul");
    var a;

    if (isCase) {
        var add_case = document.createElement("li");
        a = document.createElement("a");
        a.setAttribute("href", "#");
        a.innerHTML = "Add New Test step";
        add_case.appendChild(a);
        add_case.addEventListener("click", function(event) {
            event.stopPropagation();
            document.getElementById('add-testCase').click();
        }, false);
        ul.appendChild(add_case);

        var remove_case = document.createElement("li");
        a = document.createElement("a");
        a.setAttribute("href", "#");
        a.innerHTML = "Remove Test Step";
        remove_case.appendChild(a);
        remove_case.addEventListener("click", function(event) {
            event.stopPropagation();
            document.getElementById('delete-testCase').click();
        }, false);
        ul.appendChild(remove_case);

        var rename_case = document.createElement("li");
        a = document.createElement("a");
        a.setAttribute("href", "#");
        a.innerHTML = "Rename Test Step";
        rename_case.appendChild(a);
        rename_case.addEventListener("click", function(event) {
            event.stopPropagation();
            var s_case = getSelectedCase();
            var n_title = prompt("Please enter the Test Case's title", sideex_testCase[s_case.id].title);
            // get text node
            // Begin not create test case with empty name
            if (n_title && n_title.length > 0) {
                s_case.childNodes[0].textContent = n_title;
                sideex_testCase[s_case.id].title = n_title;
            }
            // End
        }, false);
        ul.appendChild(rename_case);
    } else {
        /*var open_suite = document.createElement("li");
        a = document.createElement("a");
        a.setAttribute("href", "#");
        a.innerHTML = "Open Feature File";
        open_suite.appendChild(a);
        open_suite.addEventListener("click", function(event) {
            event.stopPropagation();
            document.getElementById('load-testSuite-hidden').click();
        }, false);
        ul.appendChild(open_suite);*/

        var add_suite = document.createElement("li");
        a = document.createElement("a");
        a.setAttribute("href", "#");
        a.innerHTML = "Add New Scenario";
        add_suite.appendChild(a);
        add_suite.addEventListener("click", function(event) {
            event.stopPropagation();
            document.getElementById("add-testSuite").click();
        }, false);
        ul.appendChild(add_suite);

        var save_suite = document.createElement("li");
        a = document.createElement("a");
        a.setAttribute("href", "#");
        a.innerHTML = "Save Test Scenario...";
        save_suite.appendChild(a);
        save_suite.addEventListener("click", function(event) {
            event.stopPropagation();
            document.getElementById('save-testSuite').click();
        }, false);
        ul.appendChild(save_suite);

		var rename_suite = document.createElement("li");
        a = document.createElement("a");
        a.setAttribute("href", "#");
        a.innerHTML = "Edit Scenario";
        rename_suite.appendChild(a);
        rename_suite.addEventListener("click", function(event) {
            event.stopPropagation();
            var s_suite = getSelectedSuite();
            var n_title = prompt("Please edit/enter the scenario", sideex_testSuite[s_suite.id].title);
            // get text node
            // Begin not create test suite with empty name
			if(n_title.includes("Scenario:"))
			{
				if (n_title && n_title.length > 0) {
					s_suite.childNodes[0].textContent = n_title;
					sideex_testSuite[s_suite.id].title = n_title;
					$(s_suite).find("strong").addClass("modified");
				}
			}
			else
			{
				n_title  = "Scenario: " + n_title;
				if (n_title && n_title.length > 0) {
					s_suite.childNodes[0].textContent = n_title;
					sideex_testSuite[s_suite.id].title = n_title;
					$(s_suite).find("strong").addClass("modified");
				}
			}
            // End
            closeConfirm(true);
        }, false);
        ul.appendChild(rename_suite);
		
        var close_suite = document.createElement("li");
        a = document.createElement("a");
        a.setAttribute("href", "#");
        a.innerHTML = "Delete Scenario";
        close_suite.appendChild(a);
        close_suite.addEventListener("click", function(event) {
            event.stopPropagation();
            document.getElementById('close-testSuite').click();
        }, false);
        ul.appendChild(close_suite);

        var add_case = document.createElement("li");
        a = document.createElement("a");
        a.setAttribute("href", "#");
        a.innerHTML = "Add New Test Step";
        add_case.appendChild(a);
        add_case.addEventListener("click", function(event) {
            event.stopPropagation();
            document.getElementById('add-testCase').click();
        }, false);
        ul.appendChild(add_case);

        
    }

    node.appendChild(ul);
}

function addTestCase(title, id) {
    if (!getSelectedSuite()) {
        var suite_id = "suite" + sideex_testSuite.count;
        sideex_testSuite.count++;
        sideex_testSuite[suite_id] = {
            file_name: "Scenario.html",
            title: "Scenario: "
        };
        addTestSuite("Scenario: ", suite_id);
    }

    var p = document.createElement("p");
    p.innerHTML = escapeHTML(title);
    p.setAttribute("id", id);
    p.setAttribute("contextmenu", "menu" + id);

    var s_case = getSelectedCase();
    if (s_case) {
        s_case.parentNode.insertBefore(p, s_case.nextSibling);
    } else {
        getSelectedSuite().appendChild(p);
    }

    cleanSelected();
    p.classList.add("selectedCase");
    p.parentNode.classList.add("selectedSuite");

    if (sideex_testCase[id]) { // load file
        clean_panel();
        document.getElementById("records-grid").innerHTML = escapeHTML(sideex_testCase[id].records);
        if (getRecordsNum() !== '0') {
            reAssignId("records-1", "records-" + getRecordsNum());
            attachEvent(1, getRecordsNum());
        }
    } else { // add new testCase
        clean_panel();
        document.getElementById("records-grid").innerHTML = escapeHTML('<input id="records-count" type=hidden value=0></input>');
        sideex_testCase[id] = {
            records: "",
            title: title
        };
        p.classList.add("modified");
        p.parentNode.getElementsByTagName("strong")[0].classList.add("modified");
    }

    // attach event
    p.addEventListener("click", function(event) {
        event.stopPropagation();
        saveOldCase();
        // use jquery's API to add and remove class property
        cleanSelected();
        this.classList.add("selectedCase");
        this.parentNode.classList.add("selectedSuite");
        if (sideex_testCase[this.id].records) {
            clean_panel();
            document.getElementById("records-grid").innerHTML = escapeHTML(sideex_testCase[this.id].records);
            if (getRecordsNum() !== '0') {
                reAssignId("records-1", "records-" + getRecordsNum());
                attachEvent(1, getRecordsNum());
            }
        } else {
            clean_panel();
            document.getElementById("records-grid").innerHTML = escapeHTML('<input id="records-count" type=hidden value=0></input>');
        }
        // prevent event trigger on parent from child
        event.stopPropagation();
    }, false);

    var menu = document.createElement("div");
    menu.setAttribute("class", "menu");
    menu.setAttribute("id", "menu" + id);
    appendContextMenu(menu, true);
    p.appendChild(menu);

    // right click
    p.addEventListener("contextmenu", function(event) {
        event.preventDefault();
        event.stopPropagation();
        saveOldCase();
        setSelectedCase(this.id);
        var mid = "#" + "menu" + id;
        // Begin relocate context menu
        // $(".menu").css("left", event.pageX);
        // $(".menu").css("top", event.pageY);
        // End
        $(mid).show();
    }, false);

    closeConfirm(true);
}

function addTestSuite(title, id) {
    var text = document.createElement("strong");
    text.innerHTML = escapeHTML(title);
    var div = document.createElement("div");
    div.setAttribute("id", id);
    div.setAttribute("contextmenu", "menu" + id);
    div.setAttribute("class", "message");
    div.appendChild(text);

    var s_suite = getSelectedSuite();
    if (s_suite) {
        s_suite.parentNode.insertBefore(div, s_suite.nextSibling);
    } else {
        document.getElementById("testCase-grid").appendChild(div);
    }

    cleanSelected();
    div.classList.add("selectedSuite");
    // attach event
    div.addEventListener("click", function(event) {
        if (this.getElementsByTagName("p").length != 0) {
            this.getElementsByTagName("p")[0].click();
        } else {
            event.stopPropagation();
            saveOldCase();
            cleanSelected();
            this.classList.add("selectedSuite");
            clean_panel();
            // document.getElementById("records-grid").innerHTML = "";
        }
    }, false);

    var menu = document.createElement("div");
    menu.setAttribute("class", "menu");
    menu.setAttribute("id", "menu" + id);
    appendContextMenu(menu, false);
    div.appendChild(menu);

    // right click
    div.addEventListener("contextmenu", function(event) {
        event.preventDefault();
        event.stopPropagation();
        saveOldCase();
        setSelectedSuite(this.id);
        var mid = "#" + "menu" + id;
        // Begin relocate context menu
        // $(".menu").css("left", event.pageX);
        // $(".menu").css("top", event.pageY);
        // End
        $(mid).show();
    }, false);

    makeCaseSortable(div);
}

document.getElementById("add-testSuite").addEventListener("click", function(event) {
    event.stopPropagation();
    var title = prompt("Please enter the Test Scenario context", "Test Scenario context");
	title = "Scenario: " + title;
    if (title) {
        var id = "suite" + sideex_testSuite.count;
        sideex_testSuite.count++;
        sideex_testSuite[id] = {
            file_name: title + ".html",
            title: title
        };
        addTestSuite(title, id);
    }
}, false);

document.getElementById("add-testSuite-menu").addEventListener("click", function(event) {
    event.stopPropagation();
    document.getElementById('add-testSuite').click();
}, false);

var confirmCloseSuite = function(question) {
    var defer = $.Deferred();
    $('<div></div>')
        .html(question)
        .dialog({
            title: "Save?",
            resizable: false,
            height: "auto",
            width: 400,
            modal: true,
            buttons: {
                "Yes": function() {
                    defer.resolve("true");
                    $(this).dialog("close");
                },
                "No": function() {
                    defer.resolve("false");
                    $(this).dialog("close");
                },
                Cancel: function() {
                    $(this).dialog("close");
                }
            },
            close: function() {
                $(this).remove();
            }
        });
    return defer.promise();
};

var remove_testSuite = function() {
    var s_suite = getSelectedSuite();
    sideex_testSuite[s_suite.id] = null;
    s_suite.parentNode.removeChild(s_suite);
    clean_panel();
};

document.getElementById("close-testSuite").addEventListener('click', function(event) {
    event.stopPropagation();
    var s_suite = getSelectedSuite();
    if (s_suite) {
        if ($(s_suite).find(".modified").length) {
            confirmCloseSuite("Would you like to save this test suite?").then(function(answer) {
                if (answer === "true")
                    downloadSuite(s_suite, remove_testSuite);
                else
                    remove_testSuite(s_suite);
            });
        } else {
            remove_testSuite(s_suite);
        }
        // document.getElementById("records-grid").innerHTML = "";
    }
}, false);

document.getElementById("add-testCase").addEventListener("click", function(event) {
	var varKeyword = prompt("Please enter Given, When, And or Then keyword for your teststep",varKeyword);
	var title = prompt("Please enter the Test Step", "Test step");
    if (title) {
        var id = "case" + sideex_testCase.count;
        sideex_testCase.count++;
        addTestCase(varKeyword + " " + title, id);
    }
}, false);

// Add test case
document.getElementById("new").addEventListener("click", function(event) {
    saveOldCase();
    document.getElementById('add-testCase').click();
}, false);
// End

var remove_testCase = function() {
    var s_case = getSelectedCase();
    sideex_testCase[s_case.id] = null;
    s_case.parentNode.removeChild(s_case);
    clean_panel();
};

document.getElementById("delete-testCase").addEventListener('click', function() {
    var s_case = getSelectedCase();
    if (s_case) {
        if ($(s_case).hasClass("modified")) {
            confirmCloseSuite("Would you like to save this test case?").then(function(answer) {
                if (answer === "true")
                    downloadSuite(getSelectedSuite(), remove_testCase);
                else
                    remove_testCase();
            });
        } else {
            remove_testCase();
        }
        // document.getElementById("records-grid").innerHTML = "";
    }
}, false);
