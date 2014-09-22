var cid = '';
var pid = '';
var iid = '';
function setCourse(_cid) {
    cid = _cid;
}
function setProgramme(_pid) {
    pid = _pid;
}
function setIntake(_iid) {
    iid = _iid;
}
document.addEventListener("deviceready", onDeviceReady, false);
document.addEventListener("menubutton", function () {
    $.mobile.changePage('#loginPage')
}, false);
function logout() {
    window.localStorage.clear();
    initLogin();
}
function onDeviceReady() {
    navigator.splashscreen.show();
    $.mobile.touchOverflowEnabled = true;
    var x = window.localStorage.getItem("uid");
    var y = window.localStorage.getItem("pwd");
    if (x != null && y != null) {
        verifyLogin(x, y);
    }
    else {
        document.getElementById('logoutButton').style.display = "none";
        document.getElementById('loginPanel').style.display = "block";
    }
    navigator.splashscreen.hide();
}
function initLogin() {
    var x = window.localStorage.getItem("uid");
    var y = window.localStorage.getItem("pwd");
    if (x != null && y != null) {
        $('#uName').html('Logged as: ' + window.localStorage.getItem("uname"));
        document.getElementById('logoutButton').style.display = "block";
        document.getElementById('loginPanel').style.display = "none";
    }
    else {
        $('#uName').html('');
        document.getElementById('logoutButton').style.display = "none";
        document.getElementById('loginPanel').style.display = "block";
    }
    navigator.splashscreen.hide();
}
function verifyLogin(x, y) {
    $.getJSON("http://m.eduquest.com.sg/login.ashx?u=" + x + "&p=" + y, function (data) {
        if (data.isApproved == true) {
            window.localStorage.setItem("uid", x);
            window.localStorage.setItem("pwd", y);
            window.localStorage.setItem("role", data.Role);
            window.localStorage.setItem("uname", data.Name);
            initLogin();
        }
        else {
            alert("Invalid Username or Password");
            window.localStorage.clear();
            initLogin();
        }
    });
}
function validateForm() {
    var x = btoa(document.forms["myForm"]["UID"].value);
    var y = btoa(document.forms["myForm"]["PWD"].value);
    if (x == null || x == "") {
        alert("Username cannot Blank");
        return false;
    }
    else if (y == null || y == "") {
        alert("Password cannot Blank");
        return false;
    }
    else {
        verifyLogin(x, y);
        return false;
    }
}


$(document).on("pagebeforeshow", "#courseList1", function () {
    var output = "";
    $('#lv1').html('<li style="background:transparent;"><center><div class="ui-icon-load" style="width:32px;height:32px;"></div></center></li>').listview("refresh");
    $.getJSON('http://m.eduquest.com.sg/getCourses.ashx?part=1', function (data) {
        for (i in data) {
            if (data[i].isDivider == true) {
                output += '<li data-role="list-divider">' + data[i].nodeTxt + '</li>';
            }
            else {
                output += '<li><a data-transition="none" href="#coursePage" onclick="setCourse(' + data[i].URL + ')" data-ajax="false">' + data[i].nodeTxt + '</a></li>';
            }
        }
        $('#lv1').html(output).listview("refresh");
    });
});

$(document).on("pagebeforeshow", "#courseList3", function () {
    var output = "";
    $('#lv3').html('<li style="background:transparent;"><center><div class="ui-icon-load" style="width:32px;height:32px;"></div></center></li>').listview("refresh");
    $.getJSON('http://m.eduquest.com.sg/getCourses.ashx?part=3', function (data) {
        for (i in data) {
            if (data[i].isDivider == true) {
                output += '<li data-role="list-divider">' + data[i].nodeTxt + '</li>';
            }
            else {
                output += '<li><a data-transition="none" href="#coursePage" onclick="setCourse(' + data[i].URL + ')" data-ajax="false">' + data[i].nodeTxt + '</a></li>';
            }
        }
        $('#lv3').html(output).listview("refresh");
    });
});


$(document).on("pagebeforeshow", "#courseList4", function () {
    var output = "";
    $('#lv4').html('<li style="background:transparent;"><center><div class="ui-icon-load" style="width:32px;height:32px;"></div></center></li>').listview("refresh");
    $.getJSON('http://m.eduquest.com.sg/getCourses.ashx?part=4', function (data) {
        for (i in data) {
            if (data[i].isDivider == true) {
                output += '<li data-role="list-divider">' + data[i].nodeTxt + '</li>';
            }
            else {
                output += '<li><a data-transition="none" href="#coursePage" onclick="setCourse(' + data[i].URL + ')" data-ajax="false">' + data[i].nodeTxt + '</a></li>';
            }
        }
        $('#lv4').html(output).listview("refresh");
    });
});


$(document).on("pagebeforeshow", "#coursePage", function () {
    var output = "";
    $('#courseDetail').html('<center><div class="ui-icon-load" style="width:32px;height:32px;"></div></center>');
    $.getJSON('http://m.eduquest.com.sg/getCourseDetails.ashx?cid=' + cid, function (data) {
        output += '<a href="#intakePage" onclick="setProgramme(\'' + data[0].URL + '\')" data-transition="none" class="ui-btn ui-corner-all ui-icon-check ui-nodisc-icon ui-alt-icon  ui-btn-icon-left">REGISTER</a><p>' + data[0].nodeTxt + '</p>';
        for (i in data) {
            output += '<h3>' + data[i].Header + '</h3><p>' + data[i].Content + '</p>';
        }
        $('#courseDetail').html(output);
    });
});

$(document).on("pagebeforeshow", "#intakePage", function () {
    var output = "<li data-role='list-divider'>Course Schedules</li>";
    $('#ilv').html('<li style="background:transparent;"><center><div class="ui-icon-load" style="width:32px;height:32px;"></div></center></li>').listview("refresh");
    $.getJSON('http://m.eduquest.com.sg/getIntakes.ashx?pid=' + pid, function (data) {
        for (i in data) {
            if (data[i].canRegister == true) {
                if (window.localStorage.getItem("role") == "Company") {
                    output += '<li><a href="#gregisterPage" onclick="setIntake(\'' + data[i].ID + '\')"  data-transition="none"><h2>' + data[i].Details + '</h2></a></li>';
                }
                else {
                    output += '<li><a data-transition="none" href="#loginPage">' + data[i].Details + '</a></li>';
                }
            }
            else {
                output += '<li><a data-transition="none" href="#">' + data[i].Details + '</a></li>';
            }
        }
        $('#ilv').html(output).listview("refresh");
    });
});

function validateGregister() {
    var scnt = document.forms["gregisterForm"]["scnt"].value;
    if (scnt == null || scnt == "") {
        return false;
    }
    else {
        var output = "";
        $.getJSON('http://m.eduquest.com.sg/setGroupRegister.ashx?scnt=' + scnt + '&intakeid=' + iid, function (data) {
            if (data.isSuccess == true) {
                output = '<div class="jqm-block-content"><center><h3>Your online form has been submitted to our admin office successfully.</h3><p>Our team will contact you shortly to confirm and finalise your course registration.</p><p>Thank you for choosing Eduquest International Institute as your preferred training provider.</p><a href="#homePage" class="ui-btn ui-corner-all ui-btn-a" >HOME</a></center></div>';
            }
            else {
                output = '<div class="jqm-block-content"><center><h3>Not Registered</h3><p>' + data.errorTxt + '</p><a href="#homePage" class="ui-btn ui-corner-all ui-btn-a" >HOME</a></center></div>';
            }
            $('#gregisterDetail').html(output);
        });
        return false;
    }
}