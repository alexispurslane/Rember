import { UpdatableReference } from 'glimmer-object-reference';
import { TestEnvironment, TestDynamicScope } from 'glimmer-test-helpers';
import {
    ModifierManager,
    EvaluatedArgs,
    IDOMHelper,
    DynamicScope
} from 'glimmer-runtime';

import { Destroyable } from 'glimmer-util';

const ID = () => '_' + Math.random().toString(36).substr(2, 9);
// Math.random should be unique because of its seeding algorithm.
// Convert it to base 36 (numbers + letters), and grab the first 9 characters
// after the decimal.

export class Component {
    public attrs: any;
    public element: Element = null;
    public name: string;

    static createWithTemplate(env: any, template: string) {
        env.registerEmberishGlimmerComponent('day-summary', this as any, template);
    }

    static create({ attrs }: { attrs: any }): Component {
        return new this(attrs);
    }

    constructor(attrs: any) {
        this.name = ID();
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

interface ActionModifier {
    element: Element;
    args: EvaluatedArgs;
    dom: IDOMHelper;
    destructor: Destroyable;
}

class ActionModifierManager implements ModifierManager<ActionModifier> {
    install(element: Element, args: EvaluatedArgs, dom: IDOMHelper,
        dynamicScope: DynamicScope): ActionModifier {

        let name = ID();
        dom.setAttribute(element, 'onclick', `${name}();`);

        let component = args.positional.at(0).value();
        window[name] = () => {
            console.log(component);
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

    update(modifier: ActionModifier, element: Element, args: EvaluatedArgs, dom: IDOMHelper,
        dynamicScope: DynamicScope) {

        dom.setAttribute(element, 'onclick', `console.log("${args.positional.at(0).value()}")`);
    }

    getDestructor(modifier: ActionModifier): Destroyable {
        return modifier.destructor;
    }
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

        env.registerModifier('action', new ActionModifierManager());
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

