import { TestEnvironment, TestDynamicScope } from 'glimmer-test-helpers';
import { UpdatableReference } from 'glimmer-object-reference';
import { Component, App, stringifyModel } from './component';

let env = new TestEnvironment();

class DaySummaryComponent extends Component {
    public static get template() {
        return `
<li class="card">
  <h2 style="display:inline-block; margin: 0;">{{number}}: </h2>
  {{#unless editingMode}}
    <h2 style="display:inline-block; padding-bottom: 0; margin-bottom: 0;">{{@day.title}}</h2>
    <br/>
  {{else}}
    <input type="text" value="{{@day.title}}"
      class="h1-edit" {{id this "newTitle"}}/>
    <br/>
  {{/unless}}
  <em style="color=gray;">{{this.date}}</em>
  {{#unless editingMode}}
    <p>{{@day.body}}</p>
  {{else}}
    <textarea class="p-edit" cols="123" {{id this "newText"}}>{{@day.body}}</textarea>
  {{/unless}}
  <hr/>
  {{#unless editingMode}}
    <button class="primary" style="width: 100px; display: inline-block;" {{action this "edit"}}>Edit</button>
  {{else}}
    <button class="primary" style="width: 100px; display: inline-block;" {{action this "edit"}}>Confirm</button>
  {{/unless}}

  <button style="display: inline-block; width: 100px;" {{action this "remove"}}>X</button>
</li>`;
    }
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
        if (this.editingMode) {
            let newTitle = this.getComponentElement("newTitle").value;
            m.days[this.attrs.day.num].title = newTitle;

            let newText = this.getComponentElement("newText").value;
            m.days[this.attrs.day.num].body = newText;
        }
        this.editingMode = !this.editingMode;
    }
}

let model = {
    days: [
        {
            num: 0, title: 'Bower and Hitchhiking',
            body: 'Glimmer requires some packages to be installed using bower, although it doesn\'t state this. Once that was fixed, though, I could hitchhike onto Glimmer\'s build system using its demos folder.'
        },
        { num: 1, title: 'A Basic Framework', body: "" },
        { num: 2, title: 'Event Handling', body: "" }
    ]
};

let options = {
    name: 'daysModel',
    storageType: 'local'
}
let self = new UpdatableReference({ model, options });
const app = new App(env, model, self, document.body, [DaySummaryComponent], `
<div class="center">
<h1>Days</h1>
<ol>
{{#each model.days key="num" as |day|}}
  <day-summary day={{day}} />
{{/each}}
<button class="primary" id="new">+</button>
</ol>
</div>`)

export function init() {
    app.init();
    document.getElementById("new").addEventListener('click', () => {
        model.days.push({
            num: model.days[model.days.length - 1].num + 1,
            title: "Untitled",
            body: ""
        })
        if (options.storageType == 'local') {
            localStorage.setItem(options.name, stringifyModel(model));
        }
    });
};
