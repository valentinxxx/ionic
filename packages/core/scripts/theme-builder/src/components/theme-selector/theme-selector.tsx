import { Component, Event, EventEmitter, Listen, Prop, State } from '@stencil/core';
import { THEME_VARIABLES } from '../../theme-variables';


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
    this.loadThemeCss();
  }

  componentWillLoad() {
    this.themeUrl = this.themeData[0].url;
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
    console.log('ThemeSelector generateCss');

    const c: string[] = [];
    c.push(':root {');

    this.themeVariables.forEach(themeVariable => {
      c.push(`  ${themeVariable.property}: ${themeVariable.value};`);
    });

    c.push('}');

    const css = c.join('\n');
    this.themeCssChange.emit(css);
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
          {this.themeData.map(d => <option value={d.url}>{d.name} - {d.url}</option>)}
        </select>

        <div>
          {this.themeVariables.map(d => <color-selector property={d.property} value={d.value} isRgb={d.isRgb}></color-selector>)}
        </div>
      </div>
    ];
  }
}
