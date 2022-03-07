import ElevatorControl from './ElevatorControl';

const floors = ['1', '2', '3', '4', '5', '6'];
const initialPosition = 0;
const travelInterval = 100;
const floorInterval = 200;
const buttonCallBack = jest.fn();
const positionCallBack = jest.fn();
var controller;

global.console = {
  log: jest.fn(), // console.log are ignored in tests

  // Keep native behavior for other methods
  error: console.error,
  warn: console.warn,
  info: console.info,
  debug: console.debug,
};

beforeEach(() => {
  controller = new ElevatorControl({
    floors,
    initialPosition,
    buttonCallBack,
    positionCallBack,
    travelInterval,
    floorInterval,
  });
  buttonCallBack.mockClear();
  positionCallBack.mockClear();
});

describe('Individual Elevator Requests:', () => {
  it('handles floor request', async () => {
    controller.requestElevator('up', '2');
    expect(buttonCallBack.mock.calls[0][0]).toStrictEqual({
      type: 'floor',
      location: floors.indexOf('2'),
      button: 'up',
      active: true,
    });
  });

  it('handles car request', async () => {
    controller.requestElevator('5');
    expect(buttonCallBack.mock.calls[0][0]).toStrictEqual({
      type: 'car',
      location: floors.indexOf('5'),
      active: true,
    });
  });
});
