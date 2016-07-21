# Rember

Rember is a lightweight Ember-like SDK. It is for applications that
don't need the full Ember framework and dependancy list.
Rember uses a few core technologies:

1. Glimmer 2
2. Zepto
3. TypeScript
4. Mini-Framework
5. Ember-Cli

## Glimmer 2

Glimmer 2 handles the view and component layer of Rember, just as it
will with Ember. Glimmer uses Handlebars, so your templates should
look just like those you would use with Ember.

## Zepto

Rember uses Zepto to handle events, where the controller normally
would in Ember.

## TypeScript

This project will be written in TypeScript becouse of its reliability.

## Mini-Framework

Rember will come with a mini-framework to hold together the rest of
these technologies. This mini-framework will handle things like
linking the model up to the Zepto event handlers and Glimmer.

## Ember-Cli

Although it has "Ember" in its name, Ember-Cli is actually a really
good stand-alone build tool, and since Rember will need a build tool,
why reinvent the wheel?
