"use strict";
// *****************************************************************************
// Copyright (C) 2020 TypeFox and others.
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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// based on https://github.com/microsoft/vscode/blob/04c36be045a94fee58e5f8992d3e3fd980294a84/src/vs/base/common/buffer.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinaryBufferWriteableStream = exports.BinaryBufferReadableBufferedStream = exports.BinaryBufferReadableStream = exports.BinaryBufferReadable = exports.BinaryBuffer = void 0;
/* eslint-disable no-null/no-null */
const safer_buffer_1 = require("safer-buffer");
const iconv = require("iconv-lite");
const streams = require("./stream");
const hasBuffer = (typeof Buffer !== 'undefined');
const hasTextEncoder = (typeof TextEncoder !== 'undefined');
const hasTextDecoder = (typeof TextDecoder !== 'undefined');
let textEncoder;
let textDecoder;
class BinaryBuffer {
    constructor(buffer) {
        this.buffer = buffer;
        this.byteLength = this.buffer.byteLength;
    }
    static alloc(byteLength) {
        if (hasBuffer) {
            return new BinaryBuffer(Buffer.allocUnsafe(byteLength));
        }
        else {
            return new BinaryBuffer(new Uint8Array(byteLength));
        }
    }
    static wrap(actual) {
        if (hasBuffer && !(Buffer.isBuffer(actual))) {
            // https://nodejs.org/dist/latest-v10.x/docs/api/buffer.html#buffer_class_method_buffer_from_arraybuffer_byteoffset_length
            // Create a zero-copy Buffer wrapper around the ArrayBuffer pointed to by the Uint8Array
            actual = Buffer.from(actual.buffer, actual.byteOffset, actual.byteLength);
        }
        return new BinaryBuffer(actual);
    }
    static fromString(source) {
        if (hasBuffer) {
            return new BinaryBuffer(Buffer.from(source));
        }
        else if (hasTextEncoder) {
            if (!textEncoder) {
                textEncoder = new TextEncoder();
            }
            return new BinaryBuffer(textEncoder.encode(source));
        }
        else {
            return new BinaryBuffer(iconv.encode(source, 'utf8'));
        }
    }
    static concat(buffers, totalLength) {
        if (typeof totalLength === 'undefined') {
            totalLength = 0;
            for (let i = 0, len = buffers.length; i < len; i++) {
                totalLength += buffers[i].byteLength;
            }
        }
        const ret = BinaryBuffer.alloc(totalLength);
        let offset = 0;
        for (let i = 0, len = buffers.length; i < len; i++) {
            const element = buffers[i];
            ret.set(element, offset);
            offset += element.byteLength;
        }
        return ret;
    }
    toString() {
        if (hasBuffer) {
            return this.buffer.toString();
        }
        else if (hasTextDecoder) {
            if (!textDecoder) {
                textDecoder = new TextDecoder();
            }
            return textDecoder.decode(this.buffer);
        }
        else {
            return iconv.decode(safer_buffer_1.Buffer.from(this.buffer), 'utf8');
        }
    }
    slice(start, end) {
        // IMPORTANT: use subarray instead of slice because TypedArray#slice
        // creates shallow copy and NodeBuffer#slice doesn't. The use of subarray
        // ensures the same, performant, behaviour.
        return new BinaryBuffer(this.buffer.subarray(start, end));
    }
    set(array, offset) {
        if (array instanceof BinaryBuffer) {
            this.buffer.set(array.buffer, offset);
        }
        else {
            this.buffer.set(array, offset);
        }
    }
    readUInt32BE(offset) {
        return (this.buffer[offset] * 2 ** 24
            + this.buffer[offset + 1] * 2 ** 16
            + this.buffer[offset + 2] * 2 ** 8
            + this.buffer[offset + 3]);
    }
    writeUInt32BE(value, offset) {
        this.buffer[offset + 3] = value;
        value = value >>> 8;
        this.buffer[offset + 2] = value;
        value = value >>> 8;
        this.buffer[offset + 1] = value;
        value = value >>> 8;
        this.buffer[offset] = value;
    }
    readUInt32LE(offset) {
        return (((this.buffer[offset + 0] << 0) >>> 0) |
            ((this.buffer[offset + 1] << 8) >>> 0) |
            ((this.buffer[offset + 2] << 16) >>> 0) |
            ((this.buffer[offset + 3] << 24) >>> 0));
    }
    writeUInt32LE(value, offset) {
        this.buffer[offset + 0] = (value & 0b11111111);
        value = value >>> 8;
        this.buffer[offset + 1] = (value & 0b11111111);
        value = value >>> 8;
        this.buffer[offset + 2] = (value & 0b11111111);
        value = value >>> 8;
        this.buffer[offset + 3] = (value & 0b11111111);
    }
    readUInt8(offset) {
        return this.buffer[offset];
    }
    writeUInt8(value, offset) {
        this.buffer[offset] = value;
    }
}
exports.BinaryBuffer = BinaryBuffer;
var BinaryBufferReadable;
(function (BinaryBufferReadable) {
    function toBuffer(readable) {
        return streams.consumeReadable(readable, chunks => BinaryBuffer.concat(chunks));
    }
    BinaryBufferReadable.toBuffer = toBuffer;
    function fromBuffer(buffer) {
        return streams.toReadable(buffer);
    }
    BinaryBufferReadable.fromBuffer = fromBuffer;
    function fromReadable(readable) {
        return {
            read() {
                const value = readable.read();
                if (typeof value === 'string') {
                    return BinaryBuffer.fromString(value);
                }
                return null;
            }
        };
    }
    BinaryBufferReadable.fromReadable = fromReadable;
})(BinaryBufferReadable = exports.BinaryBufferReadable || (exports.BinaryBufferReadable = {}));
var BinaryBufferReadableStream;
(function (BinaryBufferReadableStream) {
    function toBuffer(stream) {
        return streams.consumeStream(stream, chunks => BinaryBuffer.concat(chunks));
    }
    BinaryBufferReadableStream.toBuffer = toBuffer;
    function fromBuffer(buffer) {
        return streams.toStream(buffer, chunks => BinaryBuffer.concat(chunks));
    }
    BinaryBufferReadableStream.fromBuffer = fromBuffer;
})(BinaryBufferReadableStream = exports.BinaryBufferReadableStream || (exports.BinaryBufferReadableStream = {}));
var BinaryBufferReadableBufferedStream;
(function (BinaryBufferReadableBufferedStream) {
    async function toBuffer(bufferedStream) {
        if (bufferedStream.ended) {
            return BinaryBuffer.concat(bufferedStream.buffer);
        }
        return BinaryBuffer.concat([
            // Include already read chunks...
            ...bufferedStream.buffer,
            // ...and all additional chunks
            await BinaryBufferReadableStream.toBuffer(bufferedStream.stream)
        ]);
    }
    BinaryBufferReadableBufferedStream.toBuffer = toBuffer;
})(BinaryBufferReadableBufferedStream = exports.BinaryBufferReadableBufferedStream || (exports.BinaryBufferReadableBufferedStream = {}));
var BinaryBufferWriteableStream;
(function (BinaryBufferWriteableStream) {
    function create(options) {
        return streams.newWriteableStream(chunks => BinaryBuffer.concat(chunks), options);
    }
    BinaryBufferWriteableStream.create = create;
})(BinaryBufferWriteableStream = exports.BinaryBufferWriteableStream || (exports.BinaryBufferWriteableStream = {}));
//# sourceMappingURL=buffer.js.map