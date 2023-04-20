import { createMachine } from "./dist/index";

enum MachineValue {
  OFF = "OFF",
  ON = "ON",
}

enum MachineEvents {
  SWITCH = "SWITCH",
}

const chart = {
  initialState: MachineValue.OFF,
  states: {
    [MachineValue.OFF]: {
      actions: {
        onEnter: () => {
          console.log("enter off");
        },
        onExit: () => {
          console.log("exit off");
        },
      },
      transitions: {
        [MachineEvents.SWITCH]: {
          target: MachineValue.ON,
          action: () => {
            console.log("switch from off to on");
          },
        },
      },
    },
    [MachineValue.ON]: {
      actions: {
        onEnter: () => {
          console.log("enter on");
        },
        onExit: () => {
          console.log("exit on");
        },
      },
      transitions: {
        [MachineEvents.SWITCH]: {
          target: MachineValue.OFF,
          action: () => {
            console.log("switch from on to off");
          },
        },
      },
    },
  },
};

const machine = createMachine<MachineValue, MachineEvents>(chart);

machine.subscribe(() => {
  console.log("notify: current state " + machine.state);
});

machine.send(MachineEvents.SWITCH);
machine.send(MachineEvents.SWITCH);
