import { TestEnvironment, TestDynamicScope } from 'glimmer-test-helpers';
import { UpdatableReference } from 'glimmer-object-reference';
import { Component, App } from './component';

let env = new TestEnvironment();

class DaySummaryComponent extends Component {
    public static template = `
<li class="card">
  <h2 style="display:inline-block; margin: 0;">{{number}}: </h2>
  {{#unless editingMode}}
    <h2 style="display:inline-block; padding-bottom: 0; margin-bottom: 0;">{{@day.title}}</h2>
    <br/>
  {{else}}
    <input type="text" value="{{@day.title}}"
      class="h1-edit" id="newTitle{{number}}"/>
    <br/>
  {{/unless}}
  <em style="color=gray;">{{this.date}}</em>
  <p>{{@day.body}}</p>
  <hr/>
  {{#unless editingMode}}
    <button class="primary" style="width: 100px; display: inline-block;" {{action this "edit"}}>Edit</button>
  {{else}}
    <button class="primary" style="width: 100px; display: inline-block;" {{action this "edit"}}>Confirm</button>
  {{/unless}}

  <button style="display: inline-block; width: 100px;" {{action this "remove"}}>X</button>
</li>`
    get number() {
        return this.attrs.day.num + 1;
    }
    get date() {
        let d = new Date('6/21/16');
        d.setDate(d.getDate() + this.attrs.day.num);
        return `${d.getMonth()}/${d.getDay()}/${d.getFullYear()}`;
    }
    public remove(m) {
        delete m.days[this.attrs.num];
    }
    public editingMode: boolean = false;
    public edit(m) {
        this.editingMode = !this.editingMode;
        if (!this.editingMode) {
            let newText = document.getElementById("newTitle" + this.number).value;
            m.days[this.attrs.day.num].title = newText;
        }
    }
}

const model = {
    days: [
        {
            num: 0, title: 'Bower and Hitchhiking',
            body: 'Glimmer requires some packages to be installed using bower, although it doesn\'t state this. Once that was fixed, though, I could hitchhike onto Glimmer\'s build system using its demos folder.'
        },
        { num: 1, title: 'A Basic Framework' },
        { num: 2, title: 'Event Handling' }
    ]
};

let self = new UpdatableReference(model);
const app = new App(env, model, self, document.body, [DaySummaryComponent], `
<h1>Days</h1>
<ol>
{{#each days key="num" as |day|}}
  <day-summary day={{day}} />
{{/each}}
</ol>`)

export function init() { app.init(); };
