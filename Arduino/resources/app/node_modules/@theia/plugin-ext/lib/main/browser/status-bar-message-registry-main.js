"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusBarMessageRegistryMainImpl = void 0;
const disposable_1 = require("@theia/core/lib/common/disposable");
const types = require("../../plugin/types-impl");
const status_bar_1 = require("@theia/core/lib/browser/status-bar/status-bar");
const color_registry_1 = require("@theia/core/lib/browser/color-registry");
class StatusBarMessageRegistryMainImpl {
    constructor(container) {
        this.entries = new Map();
        this.toDispose = new disposable_1.DisposableCollection(disposable_1.Disposable.create(() => { }));
        this.delegate = container.get(status_bar_1.StatusBar);
        this.colorRegistry = container.get(color_registry_1.ColorRegistry);
    }
    dispose() {
        this.toDispose.dispose();
    }
    async $setMessage(id, name, text, priority, alignment, color, backgroundColor, tooltip, command, accessibilityInformation, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args) {
        const ariaLabel = accessibilityInformation === null || accessibilityInformation === void 0 ? void 0 : accessibilityInformation.label;
        const role = accessibilityInformation === null || accessibilityInformation === void 0 ? void 0 : accessibilityInformation.role;
        const entry = {
            name,
            text: text || '',
            ariaLabel,
            role,
            priority,
            alignment: alignment === types.StatusBarAlignment.Left ? status_bar_1.StatusBarAlignment.LEFT : status_bar_1.StatusBarAlignment.RIGHT,
            color: color && (this.colorRegistry.getCurrentColor(color) || color),
            // In contrast to color, the backgroundColor must be a theme color. Thus, do not hand in the plain string if it cannot be resolved.
            backgroundColor: backgroundColor && (this.colorRegistry.getCurrentColor(backgroundColor)),
            tooltip,
            command,
            accessibilityInformation,
            args
        };
        this.entries.set(id, entry);
        await this.delegate.setElement(id, entry);
        if (this.toDispose.disposed) {
            this.$dispose(id);
        }
        else {
            this.toDispose.push(disposable_1.Disposable.create(() => this.$dispose(id)));
        }
    }
    $dispose(id) {
        const entry = this.entries.get(id);
        if (entry) {
            this.entries.delete(id);
            this.delegate.removeElement(id);
        }
    }
}
exports.StatusBarMessageRegistryMainImpl = StatusBarMessageRegistryMainImpl;
//# sourceMappingURL=status-bar-message-registry-main.js.map