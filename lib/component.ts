import { UpdatableReference } from 'glimmer-object-reference';
import { TestEnvironment, TestDynamicScope } from 'glimmer-test-helpers';

export class Component {
    public attrs: any;
    public element: Element = null;

    static createWithTemplate(env: any, template: string) {
        env.registerEmberishGlimmerComponent('day-summary', this as any, template);
    }

    static create({ attrs }: { attrs: any }): Component {
        return new this(attrs);
    }

    constructor(attrs: any) {
        this.attrs = attrs;
    }

    set(key: string, value: any) {
        this[key] = value;
    }

    didInitAttrs() {
        return this.attrs;
    }
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
    private env: any;
    private app: any;
    private template: string;
    private self: UpdatableReference;
    private targetElement: Element;

    constructor(env: any, model: any, targetElement: Element, template: string) {
        this.env = env;
        this.template = template;
        this.self = new UpdatableReference(model);
        this.app = this.env.compile(this.template);
    }

    public init() {
        this.env.begin();
        this.app.render(this.self, this.env, {
            appendTo: document.body,
            dynamicScope: new TestDynamicScope(null)
        })
        this.env.commit();
    }
}

