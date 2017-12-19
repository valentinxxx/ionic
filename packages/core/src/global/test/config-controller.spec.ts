import { createConfigController } from '../config-controller';

describe('Config', () => {
  it('should get a value from the config', () => {
    // const blah = 'Doc Brown';
    // expect(blah).toEqual('Doc Brown');
    const config = createConfigController({ name: 'Doc Brown' }, null);
    console.log(config)
    expect(config.get('name')).toEqual('Doc Brown');
  });
});
