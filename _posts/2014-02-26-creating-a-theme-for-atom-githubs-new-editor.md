---
layout: post
title: Creating a Theme for Atom, GitHub's New Editor
---

GitHub just announced [Atom](https://atom.io/) (now in beta), and I was lucky enough to find myself with an invitation to try it. I use Sublime Text now, and I love the [RailsCast theme](https://github.com/tdm00/sublime-theme-railscasts), originally a [Textmate theme](http://media.railscasts.com/resources/textmate_theme.zip) from Ryan Bates, so my first instinct was to bring this color scheme over to Atom.

Atom's `apm` utility makes [converting TextMate themes](http://atom.io/docs/latest/converting-a-text-mate-theme) super easy.

    $ apm init --theme ~/.atom/packages/railscast-theme --convert ~/Downloads/Railscasts.tmTheme

Open Atom and select the new theme in Preferences -> Themes -> Syntax Theme.

Looks pretty good!

[![First look](/img/posts/creating-a-theme-for-atom-githubs-new-editor/1.png)](/img/posts/creating-a-theme-for-atom-githubs-new-editor/1.png)

But the selection highlighting isn't working quite right. It's not showing the text as selected.

[![Selection highlighting fail](/img/posts/creating-a-theme-for-atom-githubs-new-editor/2.png)](/img/posts/creating-a-theme-for-atom-githubs-new-editor/2.png)

This is where Atom shines. The entire application is implemented in HTML, CSS, and Javascript. Run it in dev mode and we can just right click and inspect the dom like you would in your browser.

    $ atom --dev ~/.atom

Digging into it a bit, there are three layers in the main editor: `.overlayer`, `.lines`, and `.underlayer`. The `.overlayer` looks like it just contains the cursor(s), `.lines` contains all of the lines of text in the editor, and the `.underlayer` contains other stuff like the current selection and spellcheck annotations.

[![Three layers](/img/posts/creating-a-theme-for-atom-githubs-new-editor/3.png)](/img/posts/creating-a-theme-for-atom-githubs-new-editor/3.png)

The selection seems to be working fine. There's a few `.region`'s in the `.selection` that make up the selection highlighting.

[![Selection](/img/posts/creating-a-theme-for-atom-githubs-new-editor/4.png)](/img/posts/creating-a-theme-for-atom-githubs-new-editor/4.png)

It looks like something's overlayed on top of it. A little more digging and we find the problem: the lines of code have a background set.

[![Background color](/img/posts/creating-a-theme-for-atom-githubs-new-editor/5.png)](/img/posts/creating-a-theme-for-atom-githubs-new-editor/5.png)

Unchecking it in the inspector temporarily solves the problem.

[![Temporary fix](/img/posts/creating-a-theme-for-atom-githubs-new-editor/6.png)](/img/posts/creating-a-theme-for-atom-githubs-new-editor/6.png)

Let's remove it from the less.

[![Remove it from the less](/img/posts/creating-a-theme-for-atom-githubs-new-editor/7.png)](/img/posts/creating-a-theme-for-atom-githubs-new-editor/7.png)

Saving reloads the theme and you can instantly see that it solved the problem.

[![Reload the theme](/img/posts/creating-a-theme-for-atom-githubs-new-editor/8.png)](/img/posts/creating-a-theme-for-atom-githubs-new-editor/8.png)

Ok, looks good. Let's publish this thing. Edit the package.json to make sure everything's in order and push it to GitHub. Make sure `repository` is the correct location of your theme on GitHub.

    {
      "name": "railscast-theme",
      "theme": "syntax",
      "version": "0.0.1",
      "private": false,
      "description": "Atom syntax theme based on Ryan Bates (@rbates) RailsCasts TextMate theme",
      "repository": "https://github.com/ericfreese/atom-railscast-theme",
      "license": "MIT",
      "engines": {
        "atom": ">0.50.0"
      }
    }

And make sure you have a tag for your first version.

    $ git tag -a v0.0.1
    $ git push origin v0.0.1

Then publish it with `apm`.

    $ apm publish --tag v0.0.1

If you get some terse error message, you can just check out the `apm` source with ``atom `which apm` `` (It's just javascript). And if all goes well, it should be published as an Atom package.

[![Published](/img/posts/creating-a-theme-for-atom-githubs-new-editor/9.png)](/img/posts/creating-a-theme-for-atom-githubs-new-editor/9.png)

All done! Check out the railscast theme at [https://atom.io/packages/railscast-theme](https://atom.io/packages/railscast-theme).
