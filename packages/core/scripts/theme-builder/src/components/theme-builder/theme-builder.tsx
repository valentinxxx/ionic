import { Component, Listen, State } from '@stencil/core';


@Component({
  tag: 'theme-builder',
  styleUrl: 'theme-builder.css',
  shadow: true
})
export class ThemeBuilder {

  demoData: { name: string, url: string }[];
  themeData: { name: string, url: string }[];

  @State() demoUrl: string;
  @State() cssText: string = '';

  componentWillLoad() {
    return fetch('/scripts/theme-builder/www/assets/data.json').then(rsp => {
      return rsp.json().then(data => {
        this.demoData = data.demos;
        this.themeData = data.themes;
        this.demoUrl = this.demoData[0].url;
      });
    }).catch(err => {
      console.log('ThemeBuilder componentWillLoad', err);
    });
  }

  @Listen('demoUrlChange')
  onDemoUrlChange(ev) {
    this.demoUrl = ev.detail;
  }

  @Listen('themeCssChange')
  onThemeCssChange(ev) {
    this.cssText = ev.detail;
  }

  render() {
    return [
      <main>

        <section>
          <demo-selection demoData={this.demoData}></demo-selection>
          <app-preview demoUrl={this.demoUrl}></app-preview>
        </section>

        <section>
          <theme-selector themeData={this.themeData}></theme-selector>
        </section>

        <section>
          <css-text value={this.cssText}></css-text>
        </section>

      </main>
    ];
  }

}
