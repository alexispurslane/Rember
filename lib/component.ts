import { UpdateableReference } from 'glimmer-object-reference';
import { TestEnvironment, TestDynamicScope } from 'glimmer-test-helpers';

export class Component {
    public attrs: any;
    public element: Element = null;

    static create({ attrs }: { attrs: any }, template: string): Component {
        return new this(attrs, template);
    }

    constructor(attrs: any, template: string) {
        this.attrs = attrs;
        this.attrs.template = template;
        this.attrs.env.registerEmberishGlimmerComponent(this.attrs.name, this as any,
            this.attrs.template)
    }

    set(key: string, value: any) {
        this[key] = value;
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
    public environment: TestEnvironment;

    constructor(attrs: any, template: string) {
        this.template = template;
        this.attrs = attrs;
        this.environment = new TestEnvironment();
        this.app = this.environment.compile(this.template);
    }

    init() {
        let output = document.getElementById(this.attrs.outputElement);
        this.environment.begin();
        this.app.render(this.attrs.model, this.environment, {
            appendTo: output,
            dynamicScope: new TestDynamicScope(null)
        });
        this.environment.commit();
    }
}
