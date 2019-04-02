/*  FlowDynamics Embed Api | (c) 2018-2019 Upsilon Dynamics Inc. 
    Not for redistribution or use outside of the FlowDynamics platform
    https://www.flowdynamics.ca | http://www.upsilondynamics.com
*/

var service_location;
var parameters;
var frame_width;
var frame_height;
var border_style;
var scroll_style;
var formid;
var frameid;
var icon_url_off = 'https://raw.githubusercontent.com/upsilondynamics/flowdynamics-docs/master/images/ico_square.jpg';
var icon_url_on = 'https://raw.githubusercontent.com/upsilondynamics/flowdynamics-docs/master/images/ico_square.jpg';

function resetVariables() {
    var base_url = $("#baseurl");
    if ($(base_url).length) {
        var v_url = base_url.val();
        service_location = v_url + "/Engine/Flow/EmbedFlow";
    } else {
        service_location = "https://flowdynamicsdev.azurewebsites.net/Engine/Flow/EmbedFlow";        
    }

    parameters = {};
    frame_width = "100%";
    frame_height = "";
    border_style = "none";
    scroll_style = "hidden";
    formid = "FlowEmbedAction";
    frameid = "FlowFrame";    
}

function generateid(len) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < len; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function resizeIframe(obj) {    
    //$(obj).height($(window).height() + "px");
}

//Initializes the Flow window inside of div as a slider object is on the screen
jQuery.fn.extend({
    InitializeSlider: function (label, flow_id, api_key, flow_state_id = "", width = frame_width, height = frame_height, border = false, scroll = false, language = 'Eng') {
        resetVariables();

        var sliderDivId = $(this).attr('id');

        //Empty contents
        $(this).empty();

        //Hide div
        $(this).hide();
        $(this).attr('style', 'position:absolute;z-index:99999;height:100%;width:0px;right:0px;top:0px;background-color: rgba(10, 10, 10, .9);padding: 0px;border-width: 0px 0px 0px 1px;border-style: solid;border-color: #0055ff;color: #fff;');

        //Add a link to the body which will contain an image of the icon which will open the slider
        $('<a>').attr({
            id: "flowdynamics-slider-grab",
            onclick: function() {
                var openWidth = 300;
                var closeWidth = 30;
                var menuWidth = 275;

                var isOpen = $("#" + sliderDivId).width() > closeWidth;

                if (isOpen) {
                    $("#" + sliderDivId).animate({ width: closeWidth }, 'fast', function () {
                        $("#quick-dash").hide();
                    });

                    $("#flowdynamics-control-slider-img").attr("src", icon_url_off);
                } else {
                    $("#flowdynamics-dash").show();
                    $("#" + sliderDivId).animate({ width: openWidth }, 'fast');
                    $("#flowdynamics-control-slider-img").attr("src", icon_url_on);

                }
            }
        }).appendTo($("body"));

        //Add image activator button, bottom right hand side of screen
        $('<img>').attr({
            src: icon_url,
            id: 'flowdynamics-control-slider-img',
            style: 'position:fixed;bottom:0px;right:0px;width:32px; height:32px;',
            title: label
        }).appendTo($("#flowdynamics-action-btn"));


        //Add image activator button, bottom right hand side of screen
        $('<div>').attr({
            src: icon_url,
            id: 'flowdynamics-dash',
            style: 'margin-top: 10px;margin-left: 25px;margin-right: 5px;border-color: #fff !important;width: 275px;display: none;'
        }).appendTo($("#" + sliderDivId));

        $(this).attr("style", "height:100%");
        $(this).Initialize(flow_id, api_key, flow_state_id, width, height, border, scroll, language, false);
    }
});

//Initializes the Flow window inside of div as is on the screen
jQuery.fn.extend({
    Initialize: function (flow_id, api_key, flow_state_id = "", width = frame_width, height = frame_height, border = false, scroll = false, language = 'Eng', empty = false) {

        //Clear this div out of all junk inside
        if (empty) {
            $(this).empty();
        }

        resetVariables();

        //Generate random id's for the objects
        formid = generateid(10);
        frameid = generateid(10);

        //Setup some of these options - border and scroll bars
        border_style = border ? "solid" : border_style;
        scroll_style = scroll ? "auto" : scroll_style;
        
        //Add main form object
        $('<form>').attr({
            action: service_location,
            target: frameid,
            id: formid,
            method: 'post'
        }).appendTo($(this));

        //Add individual inputs required for the request
        $('<input>').attr({
            type: 'hidden',
            id: 'FlowId',
            name: 'FlowId',
            value: flow_id
        }).appendTo($("#" + formid));

        $('<input>').attr({
            type: 'hidden',
            id: 'FlowStateId',
            name: 'FlowStateId',
            value: flow_state_id
        }).appendTo($("#" + formid));

        $('<input>').attr({
            type: 'hidden',
            id: 'ApiKey',
            name: 'ApiKey',
            value: api_key
        }).appendTo($("#" + formid));

        $('<input>').attr({
            type: 'hidden',
            id: 'Language',
            name: 'Language',
            value: language
        }).appendTo($("#" + formid));

        $('<input>').attr({
            type: 'hidden',
            id: 'Elements',
            name: 'Elements',
            value: ""
        }).appendTo($("#" + formid));

        //Add iFrame
        $('<iframe>').attr({
            name: frameid,
            id: frameid,
            scrolling: scroll ? "auto" : "no",
            onload: (frame_height === '') ? "resizeIframe(this)" : "",
            frameBorder:border ? "1" : "0",
            style: `width:${width}; height:${height}; overflow:${scroll_style}; border-style:${border_style}; border-width:0px;`
        }).appendTo($("#" + formid));

        
        $("#" + frameid).width(width);
        $("#" + frameid).height(height);


        return this;
    }
});

jQuery.fn.extend({
    AddVariable: function (element_key, value) {
        parameters[element_key] = value;
        var serialized = JSON.stringify(parameters);
        $("#Elements").val(serialized);
        return this;
    }
});

jQuery.fn.extend({
    LoadFlowContent: function () {        
        $("#" + formid).submit();
        return this;
    }
});

resetVariables();