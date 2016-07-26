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

import { Destroyable, merge } from 'glimmer-util';

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
    public static get template() {
        return ``;
    }

    public getComponentElement(e: string) {
        return document.getElementById(this.name + e);
    }

    public destroy() { }

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

interface BaseModifier {
    element: Element;
    args: EvaluatedArgs;
    dom: IDOMHelper;
    destructor: Destroyable;
}

class ComponentIDModifierManager implements ModifierManager<BaseModifier> {
    install(element: Element, args: EvaluatedArgs, dom: IDOMHelper, dynamicScope: DynamicScope): BaseModifier {
        let component = args.positional.at(0).value();
        let id = args.positional.at(1).value();
        element.setAttribute('id', id + component.name);

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

    update(modifier: BaseModifier, element: Element, args: EvaluatedArgs, dom: IDOMHelper, dynamicScope: DynamicScope) {
        let component = args.positional.at(0).value();
        let id = args.positional.at(1).value();
        element.setAttribute('id', id + component.name);
    }

    getDestructor(modifier: BaseModifier): Destroyable {
        return modifier.destructor;
    }
}

class ActionModifierManager implements ModifierManager<BaseModifier> {
    private componentIDS: any = {};

    private createEventCallback(component: Component, action: string) {
        return () => {
            (component[action].bind(component))(component.app.model);

            let storageType = component.app.options.storageType;
            if (storageType != 'none') {
                let name = component.app.options.name;
                let stringifiedModel = stringifyModel(component.app.model);
                let storage = getStorage(storageType);

                if (storage) storage.setItem(name, stringifiedModel);
            }
        }
    }
    install(element: Element, args: EvaluatedArgs, dom: IDOMHelper, dynamicScope: DynamicScope): BaseModifier {
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
        window[name] = this.createEventCallback(component, action);

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

    update(modifier: BaseModifier, element: Element, args: EvaluatedArgs, dom: IDOMHelper, dynamicScope: DynamicScope) {
        let component = args.positional.at(0).value();
        let action = args.positional.at(1).value();
        let name = this.componentIDS[component.name] + action;
        dom.setAttribute(element, 'onclick', `${name}();`);
        window[name] = this.createEventCallback(component, action);
    }

    getDestructor(modifier: BaseModifier): Destroyable {
        return modifier.destructor;
    }
}

interface ModelOptions {
    name: string;
    storageType: string;
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
    public options: ModelOptions;

    constructor(env: TestEnvironment, model: any, self: UpdatableReference<any>, targetElement: Element, components: any[], template: string) {
        this.env = env;
        this.template = template;
        this.self = self;
        this.options = self.value().options;
        let type = this.options.storageType;
        if (type != 'none') {
            let storage = getStorage(type);
            this.model = JSON.parse(storage.getItem(this.options.name));
            if (!this.model) {
                this.model = model;
                storage.setItem(this.options.name, JSON.stringify(model));
            }
        } else {
            this.model = model;
        }
        components.forEach((c) => {
            c.createWithTemplate(this.env, this);
        });
        this.app = this.env.compile(this.template);

        env.registerModifier('action', new ActionModifierManager());
        env.registerModifier('id', new ComponentIDModifierManager());
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

export function stringifyModel(obj) {
    return JSON.stringify(obj, (k, v) => {
        if (k == "_meta") {
            return null;
        }
        return v;
    });
}

function getStorage(st: string) {
    if (st == 'local') {
        return localStorage;
    } else if (st == 'session') {
        return sessionStorage;
    }
}
