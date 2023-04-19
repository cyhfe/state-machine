interface MachineDedinition<
  MachineStates extends string,
  MachineEvents extends string
> {
  initialState: MachineStates;

  states: {
    [MachineState in MachineStates]?: {
      actions?: {
        onEnter?: () => void;
        onExit?: () => void;
      };
      transitions?: {
        [MachineEvent in MachineEvents]?: {
          target?: MachineStates;
          action?: () => void;
        };
      };
    };
  };
}

function createMachine<
  MachineStates extends string,
  MachineEvents extends string
>(machineDedinition: MachineDedinition<MachineStates, MachineEvents>) {
  let machine = {
    state: machineDedinition.initialState,
    subscriptions: new Set<Function>([]),
    subscribe(fn: Function) {
      this.subscriptions.add(fn);
      return () => {
        this.subscriptions.delete(fn);
      };
    },
    notify() {
      this.subscriptions.forEach((cb) => cb());
    },

    send(event: MachineEvents) {
      let { change } = this.transition(event);
      if (change) {
        this.notify();
      }
    },

    transition(event: MachineEvents) {
      const currentState = this.state;
      const nextState =
        machineDedinition.states[currentState]?.transitions?.[event]?.target;

      if (!nextState) {
        return {
          state: currentState,
          change: false,
        };
      }

      machineDedinition.states[currentState]?.actions?.onExit?.();
      this.state = nextState;
      machineDedinition.states[currentState]?.transitions?.[event]?.action?.();
      machineDedinition.states[nextState]?.actions?.onEnter?.();
      return {
        state: this.state,
        change: true,
      };
    },
  };
  return machine;
}

export { createMachine };
