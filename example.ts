enum State {
  OFF = "OFF",
  ON = "ON",
}

enum ChartEvent {
  SWITCH = "SWITCH",
}

interface Chart<T extends string, U extends string> {
  initialState: T;
  states: {
    [S in T]?: {
      actions?: {
        onEnter?: () => void;
        onExit?: () => void;
      };
      transitions?: {
        [E in U]?: {
          target?: T;
          action?: () => void;
        };
      };
    };
  };
}

const chart: Chart<State, ChartEvent> = {
  initialState: State.OFF,
  states: {
    [State.OFF]: {
      actions: {
        onEnter: () => {
          console.log("enter off");
        },
        onExit: () => {
          console.log("exit off");
        },
      },
      transitions: {
        [ChartEvent.SWITCH]: {
          target: State.ON,
          action: () => {
            console.log("switch from off to on");
          },
        },
      },
    },
    [State.ON]: {
      actions: {
        onEnter: () => {
          console.log("enter on");
        },
        onExit: () => {
          console.log("exit on");
        },
      },
      transitions: {
        [ChartEvent.SWITCH]: {
          target: State.OFF,
          action: () => {
            console.log("switch from on to off");
          },
        },
      },
    },
  },
};

function transition(currentState: State, event: ChartEvent) {
  const nextState = chart.states[currentState]?.transitions?.[event]?.target;
  if (!nextState)
    return {
      value: currentState,
      change: false,
    };

  chart.states[currentState]?.actions?.onExit?.();
  chart.states[currentState]?.transitions?.[event]?.action?.();
  chart.states[nextState]?.actions?.onEnter?.();

  return {
    value: nextState,
    change: true,
  };
}

let state = chart.initialState;
console.log(`current state: ${state}`);
state = transition(state, ChartEvent.SWITCH).value;
console.log(`current state: ${state}`);
state = transition(state, ChartEvent.SWITCH).value;
console.log(`current state: ${state}`);
