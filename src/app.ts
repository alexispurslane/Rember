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
}

DaySummaryComponent.createWithTemplate(env, `
<li>
    <h2>{{@title}}</h2>
    <hr/>
    <b>{{date}}</b>
</li>`)

let self, result;
const days = [
    { num: 1, title: 'Bower, the Undocumented Necessity' },
    { num: 2, title: 'The Future!' }
];
const model = { days };
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
