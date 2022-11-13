"use strict";
// *****************************************************************************
// Copyright (C) 2019 Ericsson and others.
//
// This program and the accompanying materials are made available under the
// terms of the Eclipse Public License v. 2.0 which is available at
// http://www.eclipse.org/legal/epl-2.0.
//
// This Source Code may also be made available under the following Secondary
// Licenses when the conditions for such availability set forth in the Eclipse
// Public License v. 2.0 are satisfied: GNU General Public License, version 2
// with the GNU Classpath Exception which is available at
// https://www.gnu.org/software/classpath/license.html.
//
// SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
// *****************************************************************************
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetDecoration = void 0;
/**
 * Namespace for the decoration data and the styling refinements for the decorated widgets.
 */
var WidgetDecoration;
(function (WidgetDecoration) {
    /**
     * CSS styles for the decorators.
     */
    let Styles;
    (function (Styles) {
        Styles.CAPTION_HIGHLIGHT_CLASS = 'theia-caption-highlight';
        Styles.CAPTION_PREFIX_CLASS = 'theia-caption-prefix';
        Styles.CAPTION_SUFFIX_CLASS = 'theia-caption-suffix';
        Styles.ICON_WRAPPER_CLASS = 'theia-icon-wrapper';
        Styles.DECORATOR_SIZE_CLASS = 'theia-decorator-size';
        Styles.DECORATOR_SIDEBAR_SIZE_CLASS = 'theia-decorator-sidebar-size';
        Styles.TOP_RIGHT_CLASS = 'theia-top-right';
        Styles.BOTTOM_RIGHT_CLASS = 'theia-bottom-right';
        Styles.BOTTOM_RIGHT_SIDEBAR_CLASS = 'theia-bottom-right-sidebar';
        Styles.BOTTOM_LEFT_CLASS = 'theia-bottom-left';
        Styles.TOP_LEFT_CLASS = 'theia-top-left';
    })(Styles = WidgetDecoration.Styles || (WidgetDecoration.Styles = {}));
    let TailDecoration;
    (function (TailDecoration) {
        function isDotDecoration(decoration) {
            return decoration.icon === 'circle';
        }
        TailDecoration.isDotDecoration = isDotDecoration;
    })(TailDecoration = WidgetDecoration.TailDecoration || (WidgetDecoration.TailDecoration = {}));
    /**
     * Enumeration for the quadrant to overlay the image on.
     */
    let IconOverlayPosition;
    (function (IconOverlayPosition) {
        /**
         * Overlays the top right quarter of the original image.
         */
        IconOverlayPosition[IconOverlayPosition["TOP_RIGHT"] = 0] = "TOP_RIGHT";
        /**
         * Overlays the bottom right of the original image.
         */
        IconOverlayPosition[IconOverlayPosition["BOTTOM_RIGHT"] = 1] = "BOTTOM_RIGHT";
        /**
         * Overlays the bottom left segment of the original image.
         */
        IconOverlayPosition[IconOverlayPosition["BOTTOM_LEFT"] = 2] = "BOTTOM_LEFT";
        /**
         * Occupies the top left quarter of the original icon.
         */
        IconOverlayPosition[IconOverlayPosition["TOP_LEFT"] = 3] = "TOP_LEFT";
    })(IconOverlayPosition = WidgetDecoration.IconOverlayPosition || (WidgetDecoration.IconOverlayPosition = {}));
    (function (IconOverlayPosition) {
        /**
         * Returns with the CSS class style for the enum.
         */
        function getStyle(position, inSideBar) {
            switch (position) {
                case IconOverlayPosition.TOP_RIGHT:
                    return WidgetDecoration.Styles.TOP_RIGHT_CLASS;
                case IconOverlayPosition.BOTTOM_RIGHT:
                    return inSideBar ? WidgetDecoration.Styles.BOTTOM_RIGHT_SIDEBAR_CLASS : WidgetDecoration.Styles.BOTTOM_RIGHT_CLASS;
                case IconOverlayPosition.BOTTOM_LEFT:
                    return WidgetDecoration.Styles.BOTTOM_LEFT_CLASS;
                case IconOverlayPosition.TOP_LEFT:
                    return WidgetDecoration.Styles.TOP_LEFT_CLASS;
            }
        }
        IconOverlayPosition.getStyle = getStyle;
    })(IconOverlayPosition = WidgetDecoration.IconOverlayPosition || (WidgetDecoration.IconOverlayPosition = {}));
    let CaptionHighlight;
    (function (CaptionHighlight) {
        let Range;
        (function (Range) {
            /**
             * `true` if the `arg` is contained in the range. The ranges are closed ranges, hence the check is inclusive.
             */
            function contains(arg, range) {
                return arg >= range.offset && arg <= (range.offset + range.length);
            }
            Range.contains = contains;
        })(Range = CaptionHighlight.Range || (CaptionHighlight.Range = {}));
        /**
         * Splits the `caption` argument based on the ranges from the `highlight` argument.
         */
        function split(caption, highlight) {
            const result = [];
            const ranges = highlight.ranges.slice();
            const containerOf = (index) => ranges.findIndex(range => Range.contains(index, range));
            let data = '';
            for (let i = 0; i < caption.length; i++) {
                const containerIndex = containerOf(i);
                if (containerIndex === -1) {
                    data += caption[i];
                }
                else {
                    if (data.length > 0) {
                        result.push({ data });
                    }
                    const { length } = ranges.splice(containerIndex, 1).shift();
                    result.push({ data: caption.substr(i, length), highlight: true });
                    data = '';
                    i = i + length - 1;
                }
            }
            if (data.length > 0) {
                result.push({ data });
            }
            if (ranges.length !== 0) {
                throw new Error('Error occurred when splitting the caption. There was a mismatch between the caption and the corresponding highlighting ranges.');
            }
            return result;
        }
        CaptionHighlight.split = split;
    })(CaptionHighlight = WidgetDecoration.CaptionHighlight || (WidgetDecoration.CaptionHighlight = {}));
    let Data;
    (function (Data) {
        /**
         * Compares the decoration data based on the priority. Lowest priorities come first (i.e. left.priority - right.priority).
         */
        Data.comparePriority = (left, right) => (left.priority || 0) - (right.priority || 0);
    })(Data = WidgetDecoration.Data || (WidgetDecoration.Data = {}));
})(WidgetDecoration = exports.WidgetDecoration || (exports.WidgetDecoration = {}));
//# sourceMappingURL=widget-decoration.js.map