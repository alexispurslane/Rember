# Day 1: Setup

Zepto, Typescript, and ember-cli were easy to install and set up. No
hiches there.  Glimmer was harder, but the demos look like something I
could use to learn Glimmer's API, and looking at them, I see several
ways that I could link Zepto and a POJO model to Glimmer. I am looking
at Glimmer's ember-cli-build.js for information on how to use
ember-cli as a build tool. Documentation is scarce.

Running Glimmer's tests with Ember-Cli causes a load of errors that
I'm not sure how to fix. It seems to be unable to find several files,
suchas QUnit, and `/assets/loader.js`, whatever that is. I'm going to
try it out with `npm start`.

Running with `npm start` causes another load of hideous errors. Hmm.

This happens when I try to run the demos, too. Apparently, it really
needs `loader.js`, which is missing.

Okay! The documention **does not mention** doing a `bower install`,
but apparently you need to to get some important dependancies. This
should fix the problem, and I should be on my way to linking Zepto and
a POJO model to Glimmer. Once that is done, I'll set up a build
process using ember-cli that will complie my TypeScript.

Now I am done writing the component and app part of the
mini-framework. I just have to decide how to handle events, which
should be fairly simple. This testing this is pending getting bower to
work, though, so none of this is testable. I will also begin writing
an exmaple app with my mini-framework. I also still need to get
Ember-CLI working as a build tool, which should be reasonably simple.
