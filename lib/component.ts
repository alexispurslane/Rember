import { UpdatableReference } from 'glimmer-object-reference';
import { PathReference } from 'glimmer-reference';
import { TestEnvironment, TestDynamicScope } from 'glimmer-test-helpers';
import {
    ModifierManager,
    EvaluatedArgs,
    EvaluatedNamedArgs,
    IDOMHelper,
    DynamicScope,
    RenderResult
} from 'glimmer-runtime';

import { Destroyable } from 'glimmer-util';

const ID = () => '_' + Math.random().toString(36).substr(2, 9);
// Math.random should be unique because of its seeding algorithm.
// Convert it to base 36 (numbers + letters), and grab the first 9 characters
// after the decimal.

interface ManagerHolder {
    app: App;
    manager: any;
}

export class Component {
    public attrs: any;
    public element: Element;
    public name: string;
    public static managers: ManagerHolder[] = [];
    public static index = 0;
    public managerIndex = 0;
    public static template = ``;

    static createWithTemplate(env: TestEnvironment, app: App) {
        this.index++;
        let ret = env.registerEmberishGlimmerComponent('day-summary', this as any, this.template);
        this.managers.push({ manager: ret.manager, app: app });
    }

    static create({ attrs }: { attrs: any }): Component {
        return new this(attrs);
    }

    constructor(attrs: any) {
        this.name = ID();
        this.attrs = attrs;
        this.managerIndex = Component.index;
    }

    get managerHolder() {
        return Component.managers[this.managerIndex];
    }

    get manager() {
        return this.managerHolder.manager;
    }

    get app() {
        return this.managerHolder.app;
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

interface ActionModifier {
    element: Element;
    args: EvaluatedArgs;
    dom: IDOMHelper;
    destructor: Destroyable;
}

class ActionModifierManager implements ModifierManager<ActionModifier> {
    private componentIDS: any = {};
    install(element: Element, args: EvaluatedArgs, dom: IDOMHelper, dynamicScope: DynamicScope): ActionModifier {


        let component = args.positional.at(0).value();
        let action = args.positional.at(1).value();
        let id = this.componentIDS[component.name];
        let name = id + action;
        if (id == null || id == undefined) {
            let id = ID();
            this.componentIDS[component.name] = id;
            let name = id + action;
            dom.setAttribute(element, 'onclick', `${name}();`);
        }
        window[name] = () => {
            (component[args.positional.at(1).value()].bind(component))();
        }
        return {
            element,
            args,
            dom,
            destructor: {
                destroy() {
                    dom.removeAttribute(element, 'onclick');
                }
            }
        }
    }

    update(modifier: ActionModifier, element: Element, args: EvaluatedArgs, dom: IDOMHelper, dynamicScope: DynamicScope) {

        let component = args.positional.at(0).value();
        let action = args.positional.at(1).value();
        let name = this.componentIDS[component.name] + action;
        dom.setAttribute(element, 'onclick', `${name}();`);
        window[name] = () => {
            (component[action].bind(component))(component.app.model);
            component.app.self.update(component.app.model);
        }
    }

    getDestructor(modifier: ActionModifier): Destroyable {
        return modifier.destructor;
    }
}

export class App {
    private env: TestEnvironment;
    private app: any;
    private template: string;
    private targetElement: Element;
    private renderResult: RenderResult;

    public dynamicScope: TestDynamicScope;
    public self: UpdatableReference<any>;
    public model: any;

    constructor(env: TestEnvironment, model: any, self: UpdatableReference<any>, targetElement: Element, components: any[], template: string) {
        this.env = env;
        this.template = template;
        this.self = self;
        this.model = model;
        components.forEach((c) => {
            c.createWithTemplate(this.env, this);
        });
        this.app = this.env.compile(this.template);

        env.registerModifier('action', new ActionModifierManager());
    }

    public init() {
        this.env.begin();
        this.dynamicScope = new TestDynamicScope(null);
        this.renderResult = this.app.render(this.self, this.env, {
            appendTo: document.body,
            dynamicScope: this.dynamicScope
        })
        this.env.commit();
        this.startRendering();
    }

    private clear: any;
    private startRendering() {
        let callback = () => {
            this.renderResult.rerender();
            this.clear = requestAnimationFrame(callback);
        }
        callback();
    }
}

