enum StateValue {
  OFF = "OFF",
  ON = "ON",
}

enum ChartEvent {
  SWITCH = "SWITCH",
}

interface MachineEvent {
  type: ChartEvent.SWITCH;
  payload: {
    id: number;
  };
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

const chart: Chart<StateValue, ChartEvent> = {
  initialState: StateValue.OFF,
  states: {
    [StateValue.OFF]: {
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
          target: StateValue.ON,
          action: () => {
            console.log("switch from off to on");
          },
        },
      },
    },
    [StateValue.ON]: {
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
          target: StateValue.OFF,
          action: () => {
            console.log("switch from on to off");
          },
        },
      },
    },
  },
};

function transition(currentState: State, event: MachineEvent) {
  const nextState =
    chart.states[currentState.value]?.transitions?.[event.type]?.target;
  if (!nextState)
    return {
      ...currentState,
      change: false,
    };

  chart.states[currentState.value]?.actions?.onExit?.();
  chart.states[currentState.value]?.transitions?.[event.type]?.action?.();
  chart.states[nextState]?.actions?.onEnter?.();

  return {
    value: nextState,
    change: true,
    context: {
      ...currentState.context,
      id: event.payload.id,
    },
  };
}

const subscriptions = new Set<Function>();
function subscribe(fn: Function) {
  subscriptions.add(fn);
  return function unSubscribe() {
    subscriptions.delete(fn);
  };
}

function notify() {
  subscriptions.forEach((f) => f());
}

interface State {
  value: StateValue;
  context: {
    id: null | number;
  };
}

let state: State = {
  value: chart.initialState,
  context: { id: null },
};

function send(event: MachineEvent) {
  const { value, context, change } = transition(state, event);
  if (change) {
    state = {
      value,
      context,
    };
    notify();
  }
}

subscribe(() => {
  console.log(`current state: ${state.value} ${state.context.id}`);
});

send({
  type: ChartEvent.SWITCH,
  payload: {
    id: 1,
  },
});

send({
  type: ChartEvent.SWITCH,
  payload: {
    id: 2,
  },
});
