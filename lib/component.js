var glimmer_test_helpers_1 = require('glimmer-test-helpers');
var Component = (function () {
    function Component(attrs, template) {
        this.element = null;
        this.attrs = attrs;
        this.attrs.template = template;
        this.attrs.app.env.registerEmberishGlimmerComponent(this.attrs.name, this, this.attrs.template);
    }
    Component.create = function (_a, template) {
        var attrs = _a.attrs;
        return new this(attrs, template);
    };
    Component.prototype.set = function (key, value) {
        this[key] = value;
    };
    Component.prototype.handle = function (selector, eventType, handler) {
        var element = document.querySelector(selector);
        element.addEventListener(eventType, function () {
            handler(this, selector, eventType);
        });
    };
    Component.prototype.didInitAttrs = function () { };
    Component.prototype.didUpdateAttrs = function () { };
    Component.prototype.didReceiveAttrs = function () { };
    Component.prototype.willInsertElement = function () { };
    Component.prototype.willUpdate = function () { };
    Component.prototype.willRender = function () { };
    Component.prototype.didInsertElement = function () { };
    Component.prototype.didUpdate = function () { };
    Component.prototype.didRender = function () { };
    return Component;
})();
exports.Component = Component;
var App = (function () {
    function App(attrs, template) {
        this.template = template;
        this.attrs = attrs;
        this.env = new glimmer_test_helpers_1.TestEnvironment();
        this.app = this.env.compile(this.template);
    }
    App.prototype.init = function () {
        var output = document.getElementById(this.attrs.outputElement);
        this.env.begin();
        this.app.render(this.attrs.model, this.env, {
            appendTo: output,
            dynamicScope: new glimmer_test_helpers_1.TestDynamicScope(null)
        });
        this.env.commit();
    };
    return App;
})();
exports.App = App;
