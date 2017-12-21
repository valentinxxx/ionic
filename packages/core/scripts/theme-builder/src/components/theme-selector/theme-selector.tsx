import { Component, Event, EventEmitter, Listen, Prop, State } from '@stencil/core';
import { getThemeName, THEME_VARIABLES } from '../../theme-variables';


@Component({
  tag: 'theme-selector',
  styleUrl: 'theme-selector.css',
  shadow: true
})
export class ThemeSelector {

  @State() themeUrl: string;
  @State() themeVariables: { property: string; value?: string; isRgb?: boolean; }[] = [];
  @Prop() themeData: { name: string, url: string }[];
  @Event() themeCssChange: EventEmitter;


  onChangeUrl(ev) {
    this.themeUrl = ev.currentTarget.value;
    localStorage.setItem(STORED_THEME_KEY, this.themeUrl);

    this.loadThemeCss();
  }

  componentWillLoad() {
    const storedThemeUrl = localStorage.getItem(STORED_THEME_KEY);
    const defaultThemeUrl = this.themeData[0].url;
    this.themeUrl = storedThemeUrl || defaultThemeUrl;

    this.loadThemeCss();
  }

  loadThemeCss() {
    console.log('ThemeSelector loadThemeCss');

    return fetch(this.themeUrl).then(rsp => {
      return rsp.text().then(css => {
        this.parseCss(css);
        this.generateCss();
      });
    });
  }

  parseCss(css: string) {
    console.log('ThemeSelector parseCss');

    const themer = document.getElementById('themer') as HTMLStyleElement;
    themer.innerHTML = css;

    const computed = window.getComputedStyle(document.body);

    this.themeVariables = THEME_VARIABLES.map(themeVariable => {
      const value = (computed.getPropertyValue(themeVariable.property) || '#eeeeee').trim().toLowerCase();
      return {
        property: themeVariable.property.trim(),
        value: value,
        isRgb: value.indexOf('rgb') > -1
      };
    });
  }

  generateCss() {
    console.log('ThemeSelector generateCss', this.themeUrl);

    const themeName = getThemeName(this.themeUrl);

    const c: string[] = [];
    c.push(`/** ${themeName} theme **/`);
    c.push(`\n`);
    c.push(':root {');

    this.themeVariables.forEach(themeVariable => {
      themeVariable.value = (themeVariable.value || '').trim();
      c.push(`  ${themeVariable.property}: ${themeVariable.value};`);
    });

    c.push('}');

    const cssText = c.join('\n');
    this.themeCssChange.emit({
      cssText: cssText,
      themeUrl: this.themeUrl
    });
  }

  @Listen('colorChange')
  onColorChange(ev) {
    console.log('ThemeSelector colorChange');

    this.themeVariables = this.themeVariables.map(themeVariable => {
      let value = themeVariable.value;

      if (ev.detail.property === themeVariable.property) {
        value = ev.detail.value;
      }

      return {
        property: themeVariable.property,
        value: value,
        isRgb: themeVariable.isRgb
      };
    });

    this.generateCss();
  }

  render() {
    return [
      <div>
        <select onChange={this.onChangeUrl.bind(this)}>
          {this.themeData.map(d => <option value={d.url} selected={this.themeUrl === d.url}>{d.name}</option>)}
        </select>

        <section>
          {this.themeVariables.map(d => <color-selector property={d.property} value={d.value} isRgb={d.isRgb}></color-selector>)}
        </section>
      </div>
    ];
  }
}

const STORED_THEME_KEY = 'theme-builder-theme-url';
