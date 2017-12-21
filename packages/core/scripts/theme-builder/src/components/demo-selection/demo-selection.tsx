import { Component, Event, EventEmitter, Prop } from '@stencil/core';


@Component({
  tag: 'demo-selection',
  styleUrl: 'demo-selection.css',
  shadow: true
})
export class DemoSelection {

  @Prop() demoData: { name: string, url: string }[];

  @Event() demoUrlChange: EventEmitter;

  onChangeUrl(ev) {
    this.demoUrlChange.emit(ev.currentTarget.value);
  }

  render() {
    return [
      <div>
        <select onChange={this.onChangeUrl.bind(this)}>
          {this.demoData.map(d => <option value={d.url}>{d.name}</option>)}
        </select>
      </div>
    ];
  }
}
