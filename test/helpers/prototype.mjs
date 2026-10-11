// Deliberately small DOM adapter, not a browser: no layout, HTML repair,
// event bubbling, accessibility tree or CSS execution. Run real page scripts.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createContext, runInContext } from "node:vm";

const pageURL = new URL("../../index.html", import.meta.url);

export function loadPrototype() {
  const html = readFileSync(pageURL, "utf8");
  const elements = new Map();
  const timers = [];
  let now = 100_000;
  const document = {
    activeElement: null,
    getElementById: (id) => elements.get(id) ?? null,
    createElement: (tag) => new Element(tag),
  };

  class Element {
    constructor(tag) {
      this.tagName = tag.toUpperCase();
      this.children = [];
      this.className = "";
      this.disabled = false;
      this.style = {};
      this.listeners = new Map();
      this.content = "";
      this.offsetWidth = 0;
      this.classList = {
        contains: (name) => this.className.split(/\s+/).includes(name),
        add: (...names) => { this.className = [...new Set([...this.className.split(/\s+/).filter(Boolean), ...names])].join(" "); },
        remove: (...names) => { this.className = this.className.split(/\s+/).filter((name) => !names.includes(name)).join(" "); },
        toggle: (name, force) => {
          const add = force ?? !this.classList.contains(name);
          this.classList[add ? "add" : "remove"](name);
          return add;
        },
      };
    }
    set innerHTML(value) { this.content = value; this.children = []; }
    get innerHTML() { return this.content + this.children.map((child) => child.innerHTML).join(""); }
    set textContent(value) { this.innerHTML = String(value); }
    get textContent() { return this.innerHTML.replace(/<[^>]*>/g, ""); }
    appendChild(child) { this.children.push(child); return child; }
    addEventListener(type, listener) {
      if (!this.listeners.has(type)) this.listeners.set(type, []);
      this.listeners.get(type).push(listener);
    }
    click(target = this) {
      if (this.disabled) return;
      for (const listener of this.listeners.get("click") ?? []) listener({ target });
    }
    focus() { document.activeElement = this; }
    scrollIntoView() {} // No layout in this adapter.
  }

  document.body = new Element("body");
  // Read actual IDs/classes/disabled attributes; missing page elements fail
  // during script execution rather than being silently manufactured by tests.
  const markup = html.slice(0, html.indexOf("<script"));
  for (const match of markup.matchAll(/<([a-z][\w-]*)\b([^>]*\bid="([^"]+)"[^>]*)>/g)) {
    const [, tag, attributes, id] = match;
    assert.ok(!elements.has(id), `Duplicate page ID: ${id}`);
    const element = new Element(tag);
    element.className = attributes.match(/\bclass="([^"]*)"/)?.[1] ?? "";
    element.disabled = /\sdisabled(?:\s|$|=)/.test(attributes);
    elements.set(id, element);
  }

  const context = createContext({
    document,
    window: { scrollTo() {} },
    Date: class extends Date { static now() { return now; } },
    setTimeout: (callback) => { timers.push(callback); return timers.length; },
    console: { assert: (condition, message) => assert.ok(condition, message) },
  });
  let scriptCount = 0;
  for (const [, attributes, body] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
    const src = attributes.match(/\bsrc="([^"]+)"/)?.[1];
    const source = src ? readFileSync(new URL(src, pageURL), "utf8") : body;
    runInContext(source, context, { filename: src ?? "index.html:inline", timeout: 1000 });
    scriptCount++;
  }
  assert.equal(scriptCount, 2, "Expected case data followed by the prototype script");
  return {
    document,
    el(id) { assert.ok(elements.has(id), `Missing element: ${id}`); return elements.get(id); },
    advance(ms) { now += ms; },
    flushTimers() { while (timers.length) timers.shift()(); },
  };
}
