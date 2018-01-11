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

function fileToPanel(f) {
    // set records
    var output = f.match(/<tbody>[\s\S]+?<\/tbody>/);
    if (!output) {
        return null;
    }
    output = output[0]
        .replace(/<tbody>/, "")
        .replace(/<\/tbody>/, "");
    var tr = output.match(/<tr>[\s\S]*?<\/tr>/gi);
    output = "";
    if (tr)
        for (var i = 0; i < tr.length; ++i) {
            pattern = tr[i].match(/(?:<tr>)([\s]*?)(?:<td>)([\s\S]*?)(?:<\/td>)([\s]*?)(?:<td>)([\s\S]*?)(?:<datalist>)([\s\S]*?)(?:<\/datalist>([\s]*?)<\/td>)([\s]*?)(?:<td>)([\s\S]*?)(?:<\/td>)([\s]*?)(?:<\/tr>)/);
            // remove whitespace
            // KAT-BEGIN support Selenium IDE file format
            if (!pattern) {
                pattern = tr[i].match(/(?:<tr>)([\s]*?)(?:<td>)([\s\S]*?)(?:<\/td>)([\s]*?)(?:<td>)([\s\S]*?)(?:<\/td>)([\s]*?)(?:<td>)([\s\S]*?)(?:<\/td>)([\s]*?)(?:<\/tr>)/);
                var pattern4 = pattern[4];
                var pattern5 = "\n            <option>" + pattern4 + "</option>\n        ";
                var pattern6 = "\n    ";
                pattern.splice(5, 0, pattern5);
                pattern.splice(6, 0, pattern6);
            } else {
                pattern[4] = pattern[4].slice(0, -9);
            }
            // KAT-END

            // KAT-BEGIN remove inline style
            var new_tr = '<tr>' + pattern[1] + '<td><div style="display: none;">' + pattern[2] + '</div><div></div></td>' + pattern[3] + '<td><div style="display: none;">' + pattern[4] +
                '</div><div></div>\n        ' + '<datalist>' + pattern[5] + '</datalist>' + pattern[6] + '</td>' +
                pattern[7] + '<td><div style="display: none;">' + pattern[8] + '</div><div></div></td>' + pattern[9] + '</tr>';
            // KAT-END

            output = output + new_tr + "\n";

        }
    output = '<input id="records-count" value="' + ((!tr) ? 0 : tr.length) + '" type="hidden">' + output;
    return output;
}

function readCase(f) {
    var grid_content = fileToPanel(f);
    if (grid_content) {
        clean_panel();
        document.getElementById("records-grid").innerHTML = escapeHTML(grid_content);

        var count = getRecordsNum();
        if (count !== '0') {
            reAssignId("records-1", "records-" + count);
            var r = getRecordsArray();
            for (var i = 1; i <= count; ++i) {
                // do not forget that textNode is a childNode
                for (var j = 0; j < 3; ++j) {
                    var node = document.getElementById("records-" + i).getElementsByTagName("td")[j];
                    var adjust = adjustTooLongStr(node.childNodes[0].innerHTML, node.childNodes[1]);
                    adjust = unescapeHtml(adjust);
                    node.childNodes[1].appendChild(document.createTextNode(adjust));
                }
            }
            attachEvent(1, count);
        }
    } else {
        clean_panel();
        // document.getElementById("records-grid").innerHTML = "";
    }

    // append on test grid
    var id = "case" + sideex_testCase.count;
    sideex_testCase.count++;
    var records = document.getElementById("records-grid").innerHTML;
    var case_title = f.match(/(?:<thead>[\s\S]*?<td rowspan="1" colspan="3">)([\s\S]*?)(?:<\/td>)/)[1];
    sideex_testCase[id] = {
        records: records,
        title: case_title
    };
    addTestCase(case_title, id);
}

function readSuite(f) {
    var reader = new FileReader();

    reader.readAsText(f);
    reader.onload = function() {
        var test_suite = reader.result;
        // append on test grid
        var id = "suite" + sideex_testSuite.count;
        sideex_testSuite.count++;
        addTestSuite(f.name.substring(0, f.name.lastIndexOf(".")), id);
        // name is used for download
        sideex_testSuite[id] = {
            file_name: f.name,
            title: f.name.substring(0, f.name.lastIndexOf("."))
        };

        test_case = test_suite.match(/<table[\s\S]*?<\/table>/gi);
        if (test_case) {
            for (var i = 0; i < test_case.length; ++i) {
                readCase(test_case[i]);
            }
        }

        setSelectedSuite(id);
        clean_panel();
        // document.getElementById("records-grid").innerHTML = "";
    };
    reader.onerror = function(e) {
        console.log("Error", e);
    };
}

// KAT-BEGIN to allow store test cases in browser storage
function readSuiteFromString(test_suite) {
        // append on test grid
        var id = "suite" + sideex_testSuite.count;
        sideex_testSuite.count++;
        var suiteName = parseSuiteName(test_suite);
        addTestSuite(suiteName, id);
        // name is used for download
        sideex_testSuite[id] = {
            file_name: suiteName + '.html',
            title: suiteName
        };

        test_case = test_suite.match(/<table[\s\S]*?<\/table>/gi);
        if (test_case) {
            for (var i = 0; i < test_case.length; ++i) {
                readCase(test_case[i]);
            }
        }

        setSelectedSuite(id);
        clean_panel();
}

function parseSuiteName(test_suite) {
    var pattern = /<title>(.*)<\/title>/gi;
    var suiteName = pattern.exec(test_suite)[1];
    return suiteName;
}

$(document).ready(function() {
    chrome.storage.local.get('data', function(result) {
        try {
            for (var i = 0; i < result.data.length; i++) {
                readSuiteFromString(result.data[i]);
            }
        } catch (e) {
            console.error(e);
        }
    });
});
// KAT-END

document.getElementById("load-testSuite-hidden").addEventListener("change", function(event) {
    event.stopPropagation();
    for (var i = 0; i < this.files.length; i++)
        readSuite(this.files[i]);
    // KAT-BEGIN reset input file to allow import same file multiple times
    this.value = null;
    // KAT-END
}, false);

document.getElementById("load-testSuite-show").addEventListener("click", function(event) {
    event.stopPropagation();
    document.getElementById('load-testSuite-hidden').click();
}, false);

document.getElementById("load-testSuite-show-menu").addEventListener("click", function(event) {
    event.stopPropagation();
    document.getElementById('load-testSuite-hidden').click();
}, false);