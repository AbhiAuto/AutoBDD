var sideex_log = {};

sideex_log.info = function(str) {
    var div = document.createElement('h4');
    div.setAttribute("class", "log-info");
    str = "[info] " + str;
    div.innerHTML = escapeHTML(str);
    document.getElementById("logcontainer").appendChild(div);
    $("#tab4").animate({
        scrollTop: ($("#logcontainer")[0].scrollHeight)
    }, 200);
};

sideex_log.error = function(str) {
    var div = document.createElement('h4');
    div.setAttribute("class", "log-error");
    str = "[error] " + str;
    div.innerHTML = escapeHTML(str);
    document.getElementById("logcontainer").appendChild(div);
    $("#tab4").animate({
        scrollTop: ($("#logcontainer")[0].scrollHeight)
    }, 200);
};

// KAT-BEGIN show log and reference
$("#show-log").on("click", function() {
    $("#logcontainer").show();
    $("#clear-log").show();
    $("#reference-container").hide();

    $("#show-reference").removeClass();
    $("#show-log").removeClass();
    $("#show-log").addClass('active');
});

$("#show-reference").on("click", function() {
    $("#logcontainer").hide();
    $("#clear-log").hide();
    $("#reference-container").show();

    $("#show-log").removeClass();
    $("#show-reference").removeClass();
    $("#show-reference").addClass('active');
});
// KAT-END

document.getElementById("clear-log").addEventListener("click", function() {
    document.getElementById("logcontainer").innerHTML = "";
    // KAT-BEGIN show log when clear log
    $("#show-log").click();
}, false);
// KAT-END