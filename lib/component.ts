import { UpdateableReference } from 'glimmer-object-reference';
import { TestEnvironment, TestDynamicScope } from 'glimmer-test-helpers';

type HandlerFun = (c: Component, s: string, e: string) => null;

export class Component {
    public attrs: any;
    public element: Element = null;

    static create({ attrs }: { attrs: any }, template: string): Component {
        return new this(attrs, template);
    }

    constructor(attrs: any, template: string) {
        this.attrs = attrs;
        this.attrs.template = template;
        this.attrs.app.env.registerEmberishGlimmerComponent(this.attrs.name, this as any,
            this.attrs.template)
    }

    set(key: string, value: any) {
        this[key] = value;
    }

    handle(selector: string, eventType: string, handler: HandlerFun) {
        let element = document.querySelector(selector);
        element.addEventListener(eventType, function () {
            handler(this, selector, eventType);
        });
    }

    handleClick(selector: string, handler: HandlerFun) {
        this.handle(selector, 'click', handler);
    }

    didInitAttrs() { }
    didUpdateAttrs() { }
    didReceiveAttrs() { }
    willInsertElement() { }
    willUpdate() { }
    willRender() { }
    didInsertElement() { }
    didUpdate() { }
    didRender() { }
}

export class App {
    private template: string;
    private outputElement: string;
    private attrs: any;
    public app: any;
    public env: TestEnvironment;

    constructor(attrs: any, template: string) {
        this.template = template;
        this.attrs = attrs;
        this.env = new TestEnvironment();
        this.app = this.env.compile(this.template);
    }

    init() {
        let output = document.getElementById(this.attrs.outputElement);
        this.env.begin();
        this.app.render(this.attrs.model, this.env, {
            appendTo: output,
            dynamicScope: new TestDynamicScope(null)
        });
        this.env.commit();
    }
}
