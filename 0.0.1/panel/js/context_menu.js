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

// Trigger action when the contexmenu is about to be shown
$(document).bind("contextmenu", function(event) {

    // KAT-BEGIN relocate context menu
    // $(".menu").css("left", event.pageX);
    // $(".menu").css("top", event.pageY);
    // KAT-END

    if (event.target.id == "testCase-container") {
        event.preventDefault();
        $("#suite-grid-menu").show();
        return;
    }

    var child = document.getElementById("tempChild");
    if (child) document.getElementById("command-grid-menu").childNodes[1].removeChild(child);

    var temp = event.target;
    var inCommandGrid = false;
    while (temp.tagName.toLowerCase() != "body") {
        if (/records-(\d)+/.test(temp.id)) {
            var exe = document.createElement("li");
            exe.setAttribute("id", "tempChild");
            a = document.createElement("a");
            a.setAttribute("href", "#");
            a.innerHTML = "Execute";
            exe.appendChild(a);
            var index = temp.id.split("-")[1];
            exe.addEventListener("click", function(event) {
                executeCommand(index);
            }, true);

            document.getElementById("command-grid-menu").childNodes[1].appendChild(exe);
        }
        if (temp.id == "command-grid") {
            inCommandGrid = true;
            break;
        } else temp = temp.parentElement;
    }
    
    if (inCommandGrid) {
        // KAT-BEGIN remove grid context menu
        // event.preventDefault();
        // $("#command-grid-menu").show();
        // KAT-END
    };
});


// If the document is clicked somewhere
$(document).bind("mousedown", function(e) {
    if (!$(e.target).parents(".menu").length > 0) $(".menu").hide();
    // KAT-BEGIN fix context menu not work with touchpad
    else setTimeout(function() { $(".menu").hide(); }, 500);
    // KAT-END

    if (!$(e.target).parents("#script-grid-menu").length > 0) $("#script-grid-menu").hide();
    else setTimeout(function() { $("#script-grid-menu").hide(); }, 500);
    // KAT-END
});

// KAT-BEGIN export test case
$("#export").click(function() {
    handleGenerateToScript();
});

$("#select-script-language-id").change(function() {
    handleGenerateToScript();
});

function handleGenerateToScript() {
    var selectedTestCase = getSelectedCase();
    if (selectedTestCase) {
        var language = $("#select-script-language-id").val();        
        loadScripts(language, generateScripts);
    } else {
        alert('Please select a testcase');
    }
}

function copyToClipboard() {
    $("#txt-script-id").show();
    $("#txt-script-id").select();
    document.execCommand("copy");
}

function saveToFile() {
    var $textarea = $("#txt-script-id");
    var cm = $textarea.data('cm');
    var format = '.' + options.defaultExtension;
    var fileName = testClassName(getTestCaseName()) + format;
    var content = cm.getValue();
    saveAsFileOfTestCase(fileName, content);
}

$( "#generateToScriptsDialog" ).dialog({
    autoOpen: false,
    modal: true,
    height: 600,
    width: '90%',
    buttons: {
        "Copy to Clipboard": copyToClipboard,
        "Save As File...": saveToFile,
        Close: function() {
            $(this).dialog("close");
        }
    }
});

function getCommandsToGenerateScripts() {
    var ret = [];
    let commands = getRecordsArray();
    for (var index=0; index<commands.length; index++) {
        let commandName = getCommandName(commands[index]);
        let commandTarget = getCommandTarget(commands[index]);
        let commandValue = getCommandValue(commands[index]);

        ret.push(new Command(commandName, commandTarget, commandValue));
    }
    return ret;
}

function loadScripts(language, callback) {
    var scriptNames = [];
    switch (language) {
        case 'cs-wd-nunit':
            scriptNames = [
                'panel/js/selenium-ide/formatCommandOnlyAdapter.js',
                'panel/js/selenium-ide/remoteControl.js',
                "panel/js/selenium-ide/format/csharp/cs-rc.js",
                'panel/js/selenium-ide/webdriver.js',
                "panel/js/selenium-ide/format/csharp/cs-wd.js"
            ];
            break;
        case 'katalon':
            scriptNames = [
                'panel/js/selenium-ide/formatCommandOnlyAdapter.js',
                'panel/js/selenium-ide/remoteControl.js',
                "panel/js/selenium-ide/format/java/java-rc.js",
                "panel/js/selenium-ide/format/java/java-rc-junit4.js",
                "panel/js/selenium-ide/format/java/java-rc-testng.js",
                "panel/js/selenium-ide/format/java/java-backed-junit4.js",
                "panel/js/selenium-ide/format/katalon/katalon.js"
            ];
            break;
        case 'java-wd-testng':
            scriptNames = [
                'panel/js/selenium-ide/formatCommandOnlyAdapter.js',
                'panel/js/selenium-ide/remoteControl.js',
                "panel/js/selenium-ide/format/java/java-rc.js",
                "panel/js/selenium-ide/format/java/java-rc-junit4.js",
                "panel/js/selenium-ide/format/java/java-rc-testng.js",
                'panel/js/selenium-ide/webdriver.js',
                "panel/js/selenium-ide/format/java/webdriver-testng.js"
            ];
            break;
        case 'java-wd-junit':
            scriptNames = [
                'panel/js/selenium-ide/formatCommandOnlyAdapter.js',
                'panel/js/selenium-ide/remoteControl.js',
                "panel/js/selenium-ide/format/java/java-rc.js",
                "panel/js/selenium-ide/format/java/java-rc-junit4.js",
                "panel/js/selenium-ide/format/java/java-rc-testng.js",
                'panel/js/selenium-ide/webdriver.js',
                "panel/js/selenium-ide/format/java/webdriver-junit4.js"
            ];
            break;
        case 'java-rc-junit':
            scriptNames = [
                'panel/js/selenium-ide/formatCommandOnlyAdapter.js',
                'panel/js/selenium-ide/remoteControl.js',
                "panel/js/selenium-ide/format/java/java-rc.js",
                "panel/js/selenium-ide/format/java/java-rc-junit4.js",
                "panel/js/selenium-ide/format/java/java-rc-testng.js",
                "panel/js/selenium-ide/format/java/java-backed-junit4.js"
            ];
            break;
        case 'python2-wd-unittest':
            scriptNames = [
                'panel/js/selenium-ide/formatCommandOnlyAdapter.js',
                'panel/js/selenium-ide/remoteControl.js',
                "panel/js/selenium-ide/format/python/python2-rc.js",
                'panel/js/selenium-ide/webdriver.js',
                "panel/js/selenium-ide/format/python/python2-wd.js"
            ];
            break;
        case 'robot':
            scriptNames = [
                'panel/js/selenium-ide/formatCommandOnlyAdapter.js',
                'panel/js/selenium-ide/format/robot/robot.js'
            ];
            break;
        case 'ruby-wd-rspec':
            scriptNames = [
                'panel/js/selenium-ide/formatCommandOnlyAdapter.js',
                'panel/js/selenium-ide/remoteControl.js',
                "panel/js/selenium-ide/format/ruby/ruby-rc.js",
                "panel/js/selenium-ide/format/ruby/ruby-rc-rspec.js",
                'panel/js/selenium-ide/webdriver.js',
                "panel/js/selenium-ide/format/ruby/ruby-wd-rspec.js"
            ];
            break;
    }

    $("[id^=formatter-script-language-id-]").remove();
    var j = 0;
    for (var i = 0; i < scriptNames.length; i++) {
        var script = document.createElement('script');
        script.id = "formatter-script-language-id-" + language + '-' + i;
        script.src = scriptNames[i];
        script.async = false; // This is required for synchronous execution
        script.onload = function() {
            j++;
        }
        document.head.appendChild(script);
    }
    var interval = setInterval(
        function() {
            if (j == scriptNames.length) {
                clearInterval(interval);
                callback();
            }
        },
        100
    );
}

function displayOnCodeMirror(outputScript) {
    var $textarea = $("#txt-script-id");
    $textarea.val(outputScript);  
    var textarea = $textarea.get(0);

    var language = $("#select-script-language-id").val();
    var mode;
    switch (language) {
        case 'cs-wd-nunit':
            mode = 'text/x-csharp';
            break;
        case 'katalon':
            mode = 'text/x-groovy';
            break;
        case 'java-wd-testng':
        case 'java-wd-junit':
        case 'java-rc-junit':
            mode = 'text/x-java';
            break;
        case 'python2-wd-unittest':
            mode = 'text/x-python';
            break;
        case 'robot':
            break;
        case 'ruby-wd-rspec':
            mode = 'text/x-ruby';
            break;
    }
    var options = {
        lineNumbers: true,
        matchBrackets: true,
        readOnly: true,
        lineWrapping: true
    };
    if (mode) {
        options.mode = mode;
    }
    var cm = CodeMirror.fromTextArea(textarea, options);
    $textarea.data('cm', cm);
}

function getTestCaseName() {
    var selectedTestCase = getSelectedCase();
    return sideex_testCase[selectedTestCase.id].title;
}

function generateScripts() {
    var $textarea = $("#txt-script-id");
    var cm = $textarea.data('cm');
    if (cm) {
        cm.toTextArea();
    }
    $textarea.data('cm', null);
    $("#generateToScriptsDialog").dialog("open");
    let commands = getCommandsToGenerateScripts();
    var name = getTestCaseName();
    var testCase = new TestCase(name);
    testCase.commands = commands;
    testCase.formatLocal(name).header = "";
    testCase.formatLocal(name).footer = "";
    displayOnCodeMirror(format(testCase, name)); 

    var language = $("#select-script-language-id").val();
    if (language == 'katalon') {
        $('.kat').show();
        $('.CodeMirror').removeClass('kat-90').removeClass('kat-75').addClass('kat-75');
    } else {
        $('.kat').hide();
        $('.CodeMirror').removeClass('kat-75').removeClass('kat-90').addClass('kat-90');
    }
}
// KAT-END