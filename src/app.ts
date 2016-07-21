import { Component, App } from '../lib/component.ts';

export = new App({ outputElement: 'output', model: { text: 'Hello, world!' } }, `<h1>{{text}}</h1>`)
