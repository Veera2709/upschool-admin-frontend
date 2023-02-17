/*
 * wysiwyg web editor
 *
 * suneditor.js
 * Copyright 2017 JiHong Lee.
 * MIT license.
 */
'use strict';

export default {
    name: 'custombutton',
    // display: 'submenu',
    // add: function (core,targetElement) {
    //     console.log("core",core,targetElement);
    //     const context = core.context;
    //     const rangeTag = core.util.createElement('div');
    //     console.log("rangeTag",rangeTag);
    //     core.util.addClass(rangeTag, '__se__format__range_custom');
    //     context.custombutton = {
    //         targetButton: targetElement,
    //         tag: rangeTag
    //     };
    // },
    // active: function (element) {
    //     console.log("element",element);
    //     if (!element) {
    //         this.util.removeClass(this.context.custombutton.targetButton, 'active');
    //     } else if (this.util.hasClass(element, '__se__format__range_custom')) {
    //         this.util.addClass(this.context.custombutton.targetButton, 'active');
    //         return true;
    //     }

    //     return false;
    // },
    // action: function () {
    //     const rangeTag = this.util.getRangeFormatElement(this.getSelectionNode());

    //     if (this.util.hasClass(rangeTag, '__se__format__range_custom')) {
    //         this.detachRangeFormatElement(rangeTag, null, null, false, false);
    //     } else {
    //         this.applyRangeFormatElement(this.context.custombutton.tag.cloneNode(false));
    //     }
    // }
};
