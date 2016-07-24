import { TestEnvironment, TestDynamicScope } from 'glimmer-test-helpers';
import { UpdatableReference } from 'glimmer-object-reference';
import { Component, App } from './component';

let env = new TestEnvironment();

class DaySummaryComponent extends Component {
    get date() {
        let d = new Date('6/21/16');
        d.setDate(d.getDate() + this.attrs.num);
        return `${d.getMonth()}/${d.getDay()}/${d.getFullYear()}`;
    }
    public remove() {
        alert(this.attrs.num);
    }
    get show() {
        return this.attrs.num != 0;
    }
}

DaySummaryComponent.createWithTemplate(env, `
<li>
  {{#if show}}
    <h2>{{@num}}: {{@title}}</h2>
    <hr/>
    <b>{{this.date}}</b>
    <button {{action this "remove"}}>X</button>
  {{/if}}
</li>`)



let self, result;
const model = {
    days: [
        { num: 1, title: 'Bower, the Undocumented Necessity' },
        { num: 2, title: 'The Future!' }
    ]
};
const app = new App(env, model, document.body, `
<h1>Days</h1>
<ol>
{{#each days key="num" as |day|}}
  <day-summary num={{day.num}} title={{day.title}} date={{day.date}} />
{{/each}}
</ol>`)

export function init() {
    app.init();
}
