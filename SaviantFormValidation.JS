/*
Subject: Jquery Plugin for Code Reuse - Saviant Consulting 
Author: Mangesh Kulkarni / Kunal Phadnis            
Date: 19/11/2014

Functionalities:

1. Ajax Post Request.
2. Ajax Get Request
3. Loading Animation
4. Create Bootstrap Modal
5. Number Picker
6. Decimal Picker
7. Full Name Picker.
8. Email Validator
9. Char Length Validator
10.Url Picker
11.Password Picker
12.Is Required
*/
/*This Code Need to be Structured*/

(function ($) {
    /*Ajax Post: This method can be used for ajax post request*/
    /*
    Syntax:e.g. 
     $("#btn_weather").click(function () {
        $.ajaxPost("/movie/weather", { cityName: "Pune" },
            function (data) {
                $("#weatherDiv").html(data);
            });
    });

    */
    $.ajaxPost = function (ajaxUrl, dataRequisites, successCallback, errorCallback) {

        var parameters = AjaxRequestHelper.ConstructPostRequestSettings(ajaxUrl, dataRequisites, successCallback, errorCallback);
        var settings = AjaxRequestHelper.ContructSettings(parameters);
        AjaxRequestHelper.Initialize(settings);
    };

    /*Ajax Get: This method can be used for ajax get request*/
    $.ajaxGet = function (parameters) {

        var settings = AjaxRequestHelper.ContructSettings(parameters);
        AjaxRequestHelper.Initialize(settings);
    };

    /*Set Loading Animation for Ajax Request*/
    /*
    Syntax: $(document).setLoadingAnimation("div#spinner");
    */
    $.fn.setLoadingAnimation = function (object) {

        $(this).ajaxStart(function () {
            $(object).show();
        }).ajaxStop(function () {
            $(object).hide();
        });
        return this;
    };

    /*Savinat bootstrap modal*/
    $.fn.saviantModal = function (options) {
        var settings = SaviantHelperPlugin.Modal._init_(options);
        SaviantHelperPlugin.Modal.Construct(this);
        SaviantHelperPlugin.Modal.GenerateHeader(settings, this);
        SaviantHelperPlugin.Modal.GenerateFooter(settings, this);
        $(this).modal(settings.popupType);
        $(this).on('show.bs.modal', function (e) {
            settings.showEvent(e);
        });
        $(this).on('shown.bs.modal', function (e) {
            settings.shownEvent(e);
        });
        $(this).on('hide.bs.modal', function (e) {
            settings.hideEvent(e);
        });
        $(this).on('hidden.bs.modal', function (e) {
            settings.hiddenEvent(e);
        });
        $(this).on('loaded.bs.modal', function (e) {
            settings.loadedEvent(e);
        });

    };

    /*Number Picker*/
    /*Allow only numbers in text box*/
    $.fn.numberPicker = function (options) {

        var settings = SaviantHelperPlugin.Input._init_(options, "Enter Number Here");
        SaviantHelperPlugin.Input.SetPlaceHolderText(settings.text, this);
        SaviantHelperPlugin.Input.ValidateIsRequired.addAttrIfRequired(settings, this);

        $(this).keypress(function (e) {
            if ($(this).val().length + 1 <= settings.maxChar)
                return SaviantHelperPlugin.Input.EnforceNumberPicker(e);
            else
                return false;
        });

        $(this).blur(function () {
            SaviantHelperPlugin.Input.BlurFunction(this);
        });
    };

    /*Decimal Picker*/
    /*Allows Decimal and numeric values only*/
    $.fn.decimalPicker = function (options) {

        var settings = SaviantHelperPlugin.Input._init_(options, "Enter Decimal Here");
        SaviantHelperPlugin.Input.SetPlaceHolderText(settings.text, this);
        var params = SaviantHelperPlugin.Input.EnforceDecimalPicker.init(options);
        SaviantHelperPlugin.Input.ValidateIsRequired.addAttrIfRequired(settings, this);
        $(this).keypress(function (e) {
            var flag;
            if ($(this).val().length + 1 <= settings.maxChar) {
                var s = $(this).val();
                flag = SaviantHelperPlugin.Input.EnforceDecimalPicker.validate(e, this);
                if ((s.indexOf('.') != -1) && (s.substring(s.indexOf('.')).length > params.precision)) {
                    e.preventDefault();
                    flag = false;
                }
            } else
                flag = false;
            return flag;
        });
        $(this).blur(function () {
            SaviantHelperPlugin.Input.BlurFunction(this);
        });

    };

    /*Allows String with Single Spaces*/
    $.fn.namePicker = function (options) {

        var settings = SaviantHelperPlugin.Input._init_(options, "Enter Name Here");
        SaviantHelperPlugin.Input.SetPlaceHolderText(settings.text, this);
        var params = SaviantHelperPlugin.Input.EnforceNamePicker.init(options);
        SaviantHelperPlugin.Input.ValidateIsRequired.addAttrIfRequired(settings, this);
        $(this).keypress(function (e) {

            var flag;
            if (params.spaces) {
                if ($(this).val().length + 1 <= settings.maxChar)
                    flag = SaviantHelperPlugin.Input.EnforceNamePicker.validateWithSpace(e, this);
            } else {
                if ($(this).val().length + 1 <= settings.maxChar)
                    flag = SaviantHelperPlugin.Input.EnforceNamePicker.validateWithChar(e);
            }
            if (flag) {
                var s;
                switch (params.charCase.toUpperCase()) {
                    case "UPPER":
                        s = String.fromCharCode(e.charCode).toUpperCase();
                        $(this).val($(this).val() + s);
                        break;
                    case "LOWER":
                        s = String.fromCharCode(e.charCode).toLowerCase();
                        $(this).val($(this).val() + s);
                        break;
                    case "TITLE":
                        var val = $(this).val() + String.fromCharCode(e.charCode).toUpperCase();

                        var x = val.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
                        $(this).val(x);
                        break;
                    default:
                        return true;
                        break;
                }



            }
            return false;
        });

        $(this).blur(function () {
            SaviantHelperPlugin.Input.BlurFunction(this);
        });
    };

    /*Validate Email Address*/
    $.fn.emailPicker = function (options) {

        var settings = SaviantHelperPlugin.Input._init_(options, "someone@domain.com");
        SaviantHelperPlugin.Input.SetPlaceHolderText(settings.text, this);
        SaviantHelperPlugin.Input.ValidateIsRequired.addAttrIfRequired(settings, this);
        var msg;
        if (settings.errMsg != "")
            msg = settings.errMsg;
        else
            msg = SaviantHelperPlugin.Input.DefaultMessages.defaultMsg_email;
        var params = SaviantHelperPlugin.Input.EnforceEmailPicker.settings({ control: this, type: "email", errMsg: msg });
        SaviantHelperPlugin.Input.AddAttribute(params);
        $(this).blur(function () {
            SaviantHelperPlugin.Input.BlurFunction(this);
        });
        return this;
    };

    $.fn.textLengthValidator = function (options) {
        var settings = SaviantHelperPlugin.Input._init_(options, "Enter Text Here");
        SaviantHelperPlugin.Input.SetPlaceHolderText(settings.text, this);
        $(this).blur(function (e) {
            SaviantHelperPlugin.Input.ValidateCharLength(this, settings);

        });

        return this;
    };

    $.fn.urlPicker = function (options) {

        var settings = SaviantHelperPlugin.Input._init_(options, "http://www.domain.com");
        SaviantHelperPlugin.Input.SetPlaceHolderText(settings.text, this);
        SaviantHelperPlugin.Input.ValidateIsRequired.addAttrIfRequired(settings, this);
        var msg;
        if (settings.errMsg != "")
            msg = settings.errMsg;
        else
            msg = SaviantHelperPlugin.Input.DefaultMessages.defaultMsg_url;
        var params = SaviantHelperPlugin.Input.EnforceUrlPicker.settings({ control: this, type: "url", errMsg: msg });
        SaviantHelperPlugin.Input.AddAttribute(params);
        $(this).blur(function () {
            SaviantHelperPlugin.Input.BlurFunction(this);
        });
        return this;

    };

    $.fn.passwordPicker = function (options) {
        debugger;
        var settings = SaviantHelperPlugin.Input._init_(options, "Enter Password Here");
        SaviantHelperPlugin.Input.SetPlaceHolderText(settings.text, this);
       
        SaviantHelperPlugin.Input.ValidateIsRequired.addAttrIfRequired(settings, this);
        var msg;
        if (settings.errMsg != "")
            msg = settings.errMsg;
        else
            msg = SaviantHelperPlugin.Input.DefaultMessages.defaultMsg_password;
        var passSettings = SaviantHelperPlugin.Input.EnforcePasswordPicker.init({ control: this, type: "password", errMsg: msg, regx: settings.regx });
        SaviantHelperPlugin.Input.AddAttribute(passSettings);
        $(this).blur(function () {
            debugger;
            SaviantHelperPlugin.Input.BlurFunction(this);
        });

       
    };

    $.fn.regxPicker = function (options) {

        var settings = SaviantHelperPlugin.Input._init_(options, "Enter Text Here");
        SaviantHelperPlugin.Input.SetPlaceHolderText(settings.text, this);

        SaviantHelperPlugin.Input.ValidateIsRequired.addAttrIfRequired(settings, this);
        var regxSettings = SaviantHelperPlugin.Input.EnforceRegxPicker.init(settings);
        var msg;
        if (settings.errMsg != "")
            msg = settings.errMsg;
        else
            msg = SaviantHelperPlugin.Input.DefaultMessages.defaultMsg_regx;
        var params = SaviantHelperPlugin.Input.EnforceRegxPicker.settings({ control: this, type: "regx", errMsg: msg, regx: regxSettings.regx });
        SaviantHelperPlugin.Input.AddAttribute(params);
        $(this).blur(function () {
            SaviantHelperPlugin.Input.BlurFunction(this);
        });
    },

    $.fn.required = function (reqMsg) {
        var params = SaviantHelperPlugin.Input.ValidateIsRequired.settings({ control: this, type: "required", errMsg: reqMsg });
        SaviantHelperPlugin.Input.AddAttribute(params);
        $(this).blur(function () {
            SaviantHelperPlugin.Input.BlurFunction(this);
        });
        return this;
    };

    $.fn.validateS = function (options) {
       
        var flags = [];//This array will hold flag from each control

        var settings = SaviantHelperPlugin.Validate.Init(options);
        $('input', $(this)).each(function () {

            var flag = SaviantHelperPlugin.Validate.Validation(this);
            flags.push(flag);

        });

        debugger;
        for (var i = 0; i < flags.length; i++) {
            if (!flags[i]) {
                return false;
            }

        }
        settings.success();
       ;
    };

}(jQuery));

var AjaxRequestHelper = {
    ContructSettings: function (parameters) {
        var settings = $.extend({
            'type': 'POST',
            'url': '',
            'data': null,
            'dataType': 'json',
            'contentType': '',
            'async': true,
            'cache': false,
            'traditional': true,
            'success': function (data, status, extra) {

            },
            'error': function (data, status, extra) { }
        }, parameters);
        return settings;
    },
    ConstructPostRequestSettings: function (ajaxUrl, dataRequisites, successCallback, errorCallback) {
        var postParameters = {
            url: ajaxUrl,
            data: dataRequisites,
            success: successCallback,
            error: errorCallback,

        };
        return postParameters;
    },
    Initialize: function (settings) {
        $.ajax({
            type: settings.type,
            url: settings.url,
            data: settings.data,
            dataType: settings.dataType,
            async: settings.async,
            cache: settings.cache,
            traditional: settings.traditional,

            success: function (data, status, extra) {
                settings.success(data, status, extra);

            },
            error: function (data, status, extra) {
                settings.error(data, status, extra);
            }
        });
    }
};

/*Prototype by KP*/
var flags = [];
var SaviantHelperPlugin = {
    Modal: {
        _init_: function (options) {
            var settings = $.extend({
                popupType: "show",
                backdrop: true,
                keyboard: true,
                show: true,
                title: 'Modal',
                buttons: {
                    Cancel: {
                        type: "button",
                        cssClass: "btn btn-default",
                        name: "Cancel",
                        event: function () {
                        }
                    },
                    Save: {
                        type: "button",
                        cssClass: "btn btn-primary",
                        name: "Save Changes",
                        event: function () {
                        }
                    }
                },
                content: "Modal Content",
                showEvent: function (e) {
                },
                shownEvent: function (e) {
                },
                hideEvent: function (e) {

                },
                hiddenEvent: function (e) {
                },
                loadedEvent: function (e) {
                }
            }, options);
            return settings;
        },
        Construct: function (modalObject) {
            $(modalObject).html("<div class='modal-dialog'><div class='modal-content'><div class='modal-header'></div><div class='modal-body'></div><div class='modal-footer'></div></div></div>");
        },
        GenerateHeader: function (settings, modalObject) {

            $(modalObject).find('.modal-header').append("<button type='button' class='close' data-dismiss='modal'><span aria-hidden='true'>&times;</span><span class='sr-only'>Close</span></button>");
            $(modalObject).find('.modal-header').append("<h4 class='modal-title'>" + settings.title + "</h4>");

        },
        GenerateContent: function () {

        },
        GenerateFooter: function (settings, modalObject) {
            if (settings.buttons != null) {
                var arr = $.map(settings.buttons, function (el) { return el; });
                for (var i = 0; i < arr.length; i++) {

                    var button = arr[i];
                    var buttonId = button.id + "_" + button.name;

                    var control = "<button data-dismiss=" + button.datadismiss + "  id='" + buttonId + "' class='" + button.cssClass + "'>" + button.name + "</button>";

                    $(modalObject).find('.modal-footer').append(control);
                    $('#' + buttonId).bind("click", arr[i].event);


                }
            }
        },
    },
    Input: {
        _init_: function (options, text) {
            var settings = $.extend({
                text: text,
                minChar: 0,
                maxChar: 255,
                required: false,
                reqErrMsg: "",
                errMsg: "",
                onValid: function (control) {

                    $(control).css("border", "1px solid #e2e2e2");
                },
                onInvalid: function (control) {

                    $(control).css("border", "1px solid red");
                }
            }, options);
            return settings;
        },
        EnforceRegxPicker: {
            init: function (options) {
                var par = $.extend({ regx: null }, options);
                return par;
            },
            settings: function (options) {
                var params = $.extend({
                    regx: null
                }, options);
                return params;
            },
            validate: function (regx, control) {

                var regxExp = new RegExp(regx);
                var text = $(control).val();
                if (text != "") {
                    if (!regxExp.test(text))
                        return false;
                    else
                        return true;


                }
                return false;
            }
        },
        EnforceNumberPicker: function (e) {
            if (e.which !== 8 && e.which !== 0 && (e.which < 48 || e.which > 57))
                return false;
            return true;
        },
        EnforceDecimalPicker: {
            init: function (options) {
                var params = $.extend({ precision: 3 }, options);
                return params;
            },
            validate: function (e, control) {
                if (e.which !== 8 && e.which !== 0 && (e.which < 48 || e.which > 57) && (e.which != 46 || $(control).val().indexOf('.') != -1))
                    return false;
                return true;
            }
        },
        EnforceNamePicker: {
            init: function (options) {
                var params = $.extend({ charCase: "none", spaces: true }, options);
                return params;
            },
            validateWithSpace: function (e, control) {
                var ele = SaviantHelperPlugin.Input.GetCursorPosition($(control).get(0));
                if (e.which == 8 || e.which == 0 || e.which >= 65 && e.which <= 122 || (e.which == 32 && control.value[ele - 1] != " " && control.value[ele] != " ")) {
                    return true;
                }
                return false;
            },
            validateWithChar: function (e) {
                if (e.which == 8 || e.which == 0 || e.which >= 65 && e.which <= 122) {
                    return true;
                }
                return false;
            }
        },
        EnforceEmailPicker: {
            settings: function (options) {
                var params = $.extend({
                    control: null,
                    type: "",
                    errMsg: ""

                }, options);
                return params;
            },
            validateEmail: function (control) {
                var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                var emailaddress = $(control).val();
                if (emailaddress != "") {
                    if (!emailReg.test(emailaddress)) {
                        return false;
                    } else {
                        return true;
                    }
                }
                return false;
            },
        },
        GetCursorPosition: function (el) {
            var pos = 0;
            if ('selectionStart' in el) {
                pos = el.selectionStart;
            } else if ('selection' in document) {
                el.focus();
                var sel = document.selection.createRange();
                var selLength = document.selection.createRange().text.length;
                sel.moveStart('character', -el.value.length);
                pos = sel.text.length - selLength;
            }
            return pos;
        },
        SetPlaceHolderText: function (text, control) {
            $(control).attr("placeholder", text);
        },
        ValidateCharLength: function (control, settings) {
            var s = $(control).val();
            if (s.length < settings.minChar || s.length > settings.maxChar) {

                settings.onInvalid(control);
            } else {

                settings.onValid(control);
            }
        },
        ValidateIsRequired: {
            settings: function (options) {
                var ops = $.extend({
                    control: null,
                    errMsg: "",
                    type: ""
                }, options);
                return ops;
            },
            isValid: function (control) {
                if ($(control).val().length <= 0) {

                    return false;
                } else {
                    return true;

                }

            },
            addAttrIfRequired: function (settings, control) {
                if (settings.required) {
                    var msg;
                    if (settings.reqErrMsg != "") {
                        msg = settings.reqErrMsg;
                    } else {
                        msg = SaviantHelperPlugin.Input.DefaultMessages.defaultMsg_required;
                    }
                    var params = SaviantHelperPlugin.Input.ValidateIsRequired.settings({ control: control, type: "required", errMsg: msg });
                    SaviantHelperPlugin.Input.AddAttribute(params);
                }
            }
        },
        EnforceUrlPicker: {
            settings: function (options) {
                var params = $.extend({
                    control: null,
                    type: "",
                    errMsg: ""

                }, options);
                return params;
            },
            validate: function (control) {//Need tobe optimize
                var urlregex = new RegExp("^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
                var url = $(control).val();
                if (url != "") {
                    if (!urlregex.test(url))
                        return false;
                    else
                        return true;


                }
                return false;
            }
        },

        EnforcePasswordPicker: {
            init: function (options) {
                var passSettings = $.extend({
                    regx: /^.*(?=.{6,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/g,
                    control: null,
                    type: "passswod",
                    errMsg:""
                }, options);
                return passSettings;
            },
            validate: function (control) {
                var regx = /^.*(?=.{6,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/g;
                var regExp = new RegExp(regx);
                var data = $(control).val();
                if (data != "") {
                    if (!regExp.test(data)) {
                        return false;
                    } else {
                        return true;
                    }
                }
            }
        },
        AddAttribute: function (params) {

            switch (params.type) {
                case "required":
                    var hasReqAttr = $(params.control).attr('data-required');
                    var hasErrMsg = $(params.control).attr('data-errMsg');
                    if (typeof hasReqAttr == typeof undefined) {
                        $(params.control).attr("data-required", "true");
                    }
                    if (typeof hasErrMsg == typeof undefined) {
                        $(params.control).attr("data-errMsg", params.errMsg);
                    }
                    break;
                case "email":

                    var hasType = $(params.control).attr('data-validType');
                    var hasValidError = $(params.control).attr('data-validTypeMsg');
                    if (typeof hasType == typeof undefined) {
                        $(params.control).attr("data-validType", "email");
                    }
                    if (typeof hasValidError == typeof undefined) {
                        $(params.control).attr("data-validTypeMsg", params.errMsg);
                    }
                    break;
                case "url":
                    var hasTypeUrl = $(params.control).attr('data-validType');
                    var hasValidUrlError = $(params.control).attr('data-validTypeMsg');
                    if (typeof hasTypeUrl == typeof undefined) {
                        $(params.control).attr("data-validType", "url");
                    }
                    if (typeof hasValidUrlError == typeof undefined) {
                        $(params.control).attr("data-validTypeMsg", params.errMsg);
                    }
                    break;
                case "regx":
                    var hasTypeRegx = $(params.control).attr('data-validType');
                    var hasValidRegxError = $(params.control).attr('data-validTypeMsg');
                    var hasRegExp = $(params.control).attr("data-regx");
                    if (typeof hasTypeRegx == typeof undefined) {
                        $(params.control).attr("data-validType", "regx");
                    }
                    if (typeof hasValidRegxError == typeof undefined) {
                        $(params.control).attr("data-validTypeMsg", params.errMsg);
                    }
                    if (typeof hasRegExp == typeof undefined) {
                        $(params.control).attr("data-regx", params.regx);
                    }
                    break;
                case "password":
                    var hasTypePass = $(params.control).attr('data-validType');
                    var hasValidPass = $(params.control).attr('data-validTypeMsg');
                    if (typeof hasTypePass == typeof undefined) {
                        $(params.control).attr("data-validType", "password");
                    }
                    if (typeof hasValidPass == typeof undefined) {
                        $(params.control).attr("data-validTypeMsg", params.errMsg);
                    }
                    break;
            }

        },
        BlurFunction: function (control) {
            SaviantHelperPlugin.Validate.Validation(control);
        },
        DefaultMessages: {
            defaultMsg_required: "This field is required",
            defaultMsg_email: "Invalid email address",
            defaultMsg_password: "Password is in invalid format",
            defaultMsg_url: "Website format is invalid",
            defaultMsg_regx: "Expression Invalid"
        }

    },
    Validate: {
        Init: function (options) {
            var params = $.extend({
                success: function () { },
                fail: function () { }
            }, options);
            return params;
        },
        Validation: function (control) {
            debugger;
            var flag = true;
            if ($(control).attr("data-required") || $(control).val() != "") {
                var validType = $(control).attr("data-validtype");
                switch (validType) {
                    case "email":

                        if (SaviantHelperPlugin.Input.EnforceEmailPicker.validateEmail(control)) {
                            SaviantHelperPlugin.Validate.onValid(control);
                            flag = true;
                        } else {
                            SaviantHelperPlugin.Validate.onInvalid(control, SaviantHelperPlugin.Input.DefaultMessages.defaultMsg_email, validType);
                            flag = false;
                        }
                        break;
                    case "url":

                        if (SaviantHelperPlugin.Input.EnforceUrlPicker.validate(control)) {
                            SaviantHelperPlugin.Validate.onValid(control);
                            flag = true;
                        } else {
                            SaviantHelperPlugin.Validate.onInvalid(control, SaviantHelperPlugin.Input.DefaultMessages.defaultMsg_url, validType);
                            flag = false;
                        }
                        break;
                    case "regx":

                        var regx = $(control).attr("data-regx");
                        if (SaviantHelperPlugin.Input.EnforceRegxPicker.validate(regx, control)) {
                            SaviantHelperPlugin.Validate.onValid(control);
                            flag = true;
                        } else {
                            SaviantHelperPlugin.Validate.onInvalid(control, SaviantHelperPlugin.Input.DefaultMessages.defaultMsg_url, validType);
                            flag = false;
                        }
                        break;
                    case "password":
                        if (SaviantHelperPlugin.Input.EnforcePasswordPicker.validate(control)) {
                            SaviantHelperPlugin.Validate.onValid(control);
                            flag = true;
                        } else {
                            SaviantHelperPlugin.Validate.onInvalid(control, SaviantHelperPlugin.Input.DefaultMessages.defaultMsg_password, validType);
                            flag = false;
                        }
                        break;
                    default:
                        var isRequired = $(control).attr("data-required");
                        if (isRequired) {
                            if (SaviantHelperPlugin.Input.ValidateIsRequired.isValid(control)) {

                                SaviantHelperPlugin.Validate.onValid(control);
                                flag = true;
                            } else {
                                SaviantHelperPlugin.Validate.onInvalid(control, SaviantHelperPlugin.Input.DefaultMessages.defaultMsg_required, validType);
                                flag = false;
                            }

                        }
                        break;
                }

            } else {
                SaviantHelperPlugin.Validate.onValid(control);
                flag = true;
            }
            return flag;
        },
        onValid: function (control) {
            $(control).removeClass("validation-error");
            $(control).addClass("validation-valid");
            $(control).next().html("");

        },
        onInvalid: function (control, defaultMsg, validType) {//Need to be structured

            var msg;
            switch (validType) {
                case "email":
                    msg = $(control).attr("data-validtypemsg");
                    break;
                case "url":
                    msg = $(control).attr("data-validtypemsg");
                    break;
                case "regx":
                    msg = $(control).attr("data-validtypemsg");
                    break;
                case "password":
                    msg = $(control).attr("data-validtypemsg");
                    break;

                default:
                    msg = $(control).attr("data-errMsg");
                    break;
            }

            $(control).removeClass("validation-valid");
            $(control).addClass("validation-error");
            var c = $(control).next();

            if (c.attr('id') != "error") {
                $(control).after('<div id="error"><span class="validation-errorMsg">' + msg + '</span></div>');
            } else {
                $(c).html('<span class="validation-errorMsg">' + msg + '</span>');
            }
            return false;

        }

    }



};

/*Ends*/
