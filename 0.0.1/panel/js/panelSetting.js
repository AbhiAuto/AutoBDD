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

// KAT-BEGIN for Selenium IDE
function Log() {
}

Log.prototype = console;

this.log = console; // remove Selenium IDE Log
// KAT-END

$(document).ready(function() {

    // KAT-BEGIN init
    $.ajax({
        url: 'panel/js/selenium-ide/iedoc-core.xml',
        success: function (document) {
            Command.apiDocuments = new Array(document);
        },
        async: false,
        dataType: 'xml'
    });

    $(".tablesorter").tablesorter();
    // KAT-END

    //init dropdown width
    $("#command-dropdown").css({
        'width': $("#command-command").width() + 29 + "px"
    });
    $("#target-dropdown").css({
        'width': $("#command-target").width() + 29 + "px"
    });
    //dropdown width change with input's width
    $(window).resize(function() {
        $("#command-dropdown").css({
            'width': $("#command-command").width() + 29 + "px"
        });
        $("#target-dropdown").css({
            'width': $("#command-target").width() + 29 + "px"
        });
    });
    //dropdown when click the down icon
    $(".fa-chevron-down").click(function() {
        dropdown($("#" + $(this).attr("id") + "dropdown"));
        $(".w3-show").bind("mouseleave", function() {
            dropdown($(this));
        });
    });

    $("#command-grid").colResizable({ liveDrag: true, minWidth: 75 });
    $(function() {
        $.fn.fixMe = function() {
            return this.each(function() {
                var $this = $(this),
                    $t_fixed;

                function init() {
                    $this.wrap('<div class="container" />');
                    $t_fixed = $this.clone();
                    $t_fixed.find("tbody").remove().end().addClass("fixed").insertBefore($this);
                    $t_fixed.find("th").each(function(index) {
                        var $self = $(this);
                        $this.find("th").eq(index).bind("DOMAttrModified", function(e) {
                            $self.css("width", $(this).outerWidth() + "px");
                        });
                    });
                    resizeFixed();
                }

                function resizeFixed() {
                    $t_fixed.find("th").each(function(index) {
                        $(this).css("width", $this.find("th").eq(index).outerWidth() + "px");
                    });
                }

                function scrollFixed() {
                    var offset = $(this).scrollTop(),
                        tableOffsetTop = $this.offset().top,
                        tableOffsetBottom = tableOffsetTop + $this.height() - $this.find("thead").height();
                    if (offset < tableOffsetTop || offset > tableOffsetBottom) {
                        $t_fixed.hide();
                    } else if (offset >= tableOffsetTop && offset <= tableOffsetBottom && $t_fixed.is(":hidden")) {
                        $t_fixed.show();
                    }
                    var tboffBottom = (parseInt(tableOffsetBottom));
                    var tboffTop = (parseInt(tableOffsetTop));

                    if (offset >= tboffBottom && offset <= tableOffsetBottom) {
                        $t_fixed.find("th").each(function(index) {
                            $(this).css("width", $this.find("th").eq(index).outerWidth() + "px");
                        });
                    }
                }
                $(window).resize(resizeFixed);
                $(window).scroll(scrollFixed);
                init();
            });
        };
    });

    $(".fixed").width($("table:not(.fixed)").width());

    $("#command-dropdown,#command-command-list").html(genCommandDatalist());

    // KAT-BEGIN reference
    $("#command-command").on('input', function(){
        var value = $(this).val();
        var command = new Command(value);
        var def = command.getDefinition();
        $("#reference-container").html((def) ? def.getReferenceFor(command): '');
        $("#show-reference").click();
    });
    // KAT-END

    $(".record-bottom").click(function() { 
        $(this).addClass("active");
        $('#records-grid .selectedRecord').removeClass('selectedRecord'); 
    });
});

var dropdown = function(node) {
    if (!node.hasClass("w3-show")) {
        node.addClass("w3-show");
    }
    // KAT-BEGIN close dropdown on click
    setTimeout(function() {
        $(document).bind("click", clickWhenDropdownHandler);
    }, 200);
    // KAT-END
};

var clickWhenDropdownHandler = function(e) {
    var event = $(e.target);
    if ($(".w3-show").is(event.parent())) {
        $(".w3-show").prev().prev().val(event.val()).trigger("input");
    }
    // KAT-BEGIN close dropdown on click
    $(".w3-show").unbind("mouseleave");
    $(".w3-show").removeClass("w3-show");
    $(document).unbind("click", clickWhenDropdownHandler);
    // KAT-END
};

// KAT-BEGIN load Selenium IDE commands
function closeConfirm(bool) {
    // KAT-BEGIN autosave no need to confirm
    // if (bool) {
    //     $(window).bind("beforeunload", function(e) {
    //         var confirmationMessage = "You have a modified suite!";
    //         e.returnValue = confirmationMessage; // Gecko, Trident, Chrome 34+
    //         return confirmationMessage; // Gecko, WebKit, Chrome <34
    //     });
    // } else {
    //     if (!$("#testCase-grid").find(".modified").length)
    //         $(window).unbind("beforeunload");
    // }
    // KAT-END
}

function genCommandDatalist() {
    /*var supportedCommand = [
        "addSelection",
        "answerOnNextPrompt",
        "assertAlert",
        "assertConfirmation",
        "assertPrompt",
        "assertText",
        "assertTitle",
        "chooseCancelOnNextConfirmation",
        "chooseCancelOnNextPrompt",
        "chooseOkOnNextConfirmation",
        "clickAt",
        "doubleClickAt",
        "dragAndDropToObject",
        "echo",
        "editContent",
        "mouseDownAt",
        "mouseMoveAt",
        "mouseOut",
        "mouseOver",
        "mouseUpAt",
        "open",
        "pause",
        "removeSelection",
        "runScript",
        "select",
        "selectFrame",
        "selectWindow",
        "sendKeys",
        "store",
        "storeText",
        "storeTitle",
        "type",
        "verifyText",
        "verifyTitle"
    ];
    */

    var commands = _loadSeleniumCommands();

    var datalistHTML = "";
    if (commands && commands.length > 0) {
        for (var j=0; j<commands.length; j++) {
            var value = commands[j];
            datalistHTML += ('<option value="' + value + '">' + value + '</option>\n');
        }
    }

    return datalistHTML;
}

function _loadSeleniumCommands() {
    var commands = [];
    
    var nonWaitActions = ['open', 'selectWindow', 'chooseCancelOnNextConfirmation', 'answerOnNextPrompt', 'close', 'setContext', 'setTimeout', 'selectFrame'];
    
    for (func in Selenium.prototype) {
        //this.log.debug("func=" + func);
        var r;
        if (func.match(/^do[A-Z]/)) {
            var action = func.substr(2,1).toLowerCase() + func.substr(3);
            commands.push(action);
            if (!action.match(/^waitFor/) && nonWaitActions.indexOf(action) < 0) {
                commands.push(action + "AndWait");
            }
        } else if (func.match(/^assert.+/)) {
            commands.push(func);
            commands.push("verify" + func.substr(6));
        } else if ((r = func.match(/^(get|is)(.+)$/))) {
            var base = r[2];
            commands.push("assert" + base);
            commands.push("verify" + base);
            commands.push("store" + base);
            commands.push("waitFor" + base);
            var r2;
            if ((r = func.match(/^is(.*)Present$/))) {
                base = r[1];
                commands.push("assert" + base + "NotPresent");
                commands.push("verify" + base + "NotPresent");
                commands.push("waitFor" + base + "NotPresent");
            } else {
                commands.push("assertNot" + base);
                commands.push("verifyNot" + base);
                commands.push("waitForNot" + base);
            }
        }
    }
    
    commands.push("pause");
    commands.push("store");
    commands.push("echo");
    commands.push("break");

    commands.sort();

    var uniqueCommands = [];
    var previousCommand = null;
    for (var i = 0; i < commands.length; i++) {
        var currentCommand = commands[i];
        if (previousCommand != currentCommand) {
            uniqueCommands.push(currentCommand);
        }
        previousCommand = currentCommand;
    }

    return uniqueCommands;
}
// KAT-END