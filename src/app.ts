import { TestEnvironment, TestDynamicScope } from 'glimmer-test-helpers';
import { UpdatableReference } from 'glimmer-object-reference';
import { Component, App } from './component';

let env = new TestEnvironment();

class DaySummaryComponent extends Component {
    get date() {
        let d = new Date('6/21/16');
        d.setDate(d.getDate() + this.attrs.day.num);
        return `${d.getMonth()}/${d.getDay()}/${d.getFullYear()}`;
    }
    public remove() {
    }
    public edit() {
        model.days[this.attrs.day.num - 1].title = "foo";
        self.update(model);
    }
}

DaySummaryComponent.createWithTemplate(env, `
<li class="card">
    <h2 style="padding-bottom: 0; margin-bottom: 0;">{{@day.num}}: {{@day.title}}</h2>
    <em style="color=gray;">{{this.date}}</em>
    <p>{{@day.body}}</p>
    <hr/>
    <button class="primary" style="width: 100px; display: inline-block;" {{action this "edit"}}>Edit</button>
    <button style="display: inline-block; width: 100px;" {{action this "remove"}}>X</button>
</li>`)

const model = {
    days: [
        {
            num: 1, title: 'Bower and Hitchhiking',
            body: 'Glimmer requires some packages to be installed using bower, although it doesn\'t state this. Once that was fixed, though, I could hitchhike onto Glimmer\'s build system using its demos folder.'
        },
        { num: 2, title: 'A Basic Framework' },
        { num: 3, title: 'Event Handling' }
    ]
};

let self = new UpdatableReference(model);
const app = new App(env, self, document.body, `
<h1>Days</h1>
<ol>
{{#each days key="num" as |day|}}
  <day-summary day={{day}} />
{{/each}}
</ol>`)

DaySummaryComponent.addAppToLastManager(app);

export function init() {
    app.init();
}
