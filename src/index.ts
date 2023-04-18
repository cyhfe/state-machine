import {foo} from './comp'
foo(1,2)
function echo<T>(arg: T) {
  console.log(arg);
}

export interface A {
  a: string
}

const a = {
  a: '1'
}

export  {
  foo,
  echo,
  a
}
