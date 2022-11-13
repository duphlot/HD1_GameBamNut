"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentGlyphWidget = void 0;
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// some code copied and modified from https://github.com/microsoft/vscode/blob/1.49.3/src/vs/workbench/contrib/comments/browser/commentGlyphWidget.ts
class CommentGlyphWidget {
    constructor(editor) {
        this.commentsDecorations = [];
        this.commentsOptions = {
            isWholeLine: true,
            linesDecorationsClassName: 'comment-range-glyph comment-thread'
        };
        this.editor = editor;
    }
    getPosition() {
        const model = this.editor.getModel();
        const range = model && this.commentsDecorations && this.commentsDecorations.length
            ? model.getDecorationRange(this.commentsDecorations[0])
            : null;
        return range ? range.startLineNumber : this.lineNumber;
    }
    setLineNumber(lineNumber) {
        this.lineNumber = lineNumber;
        const commentsDecorations = [{
                range: {
                    startLineNumber: lineNumber, startColumn: 1,
                    endLineNumber: lineNumber, endColumn: 1
                },
                options: this.commentsOptions
            }];
        this.commentsDecorations = this.editor.deltaDecorations(this.commentsDecorations, commentsDecorations);
    }
    dispose() {
        if (this.commentsDecorations) {
            this.editor.deltaDecorations(this.commentsDecorations, []);
        }
    }
}
exports.CommentGlyphWidget = CommentGlyphWidget;
//# sourceMappingURL=comment-glyph-widget.js.map