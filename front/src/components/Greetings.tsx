import React from "react";
interface GreetingProps {
  name: string;
  mark: string;
  optional?: string;
}

function Greetings({ name, mark, optional }: GreetingProps) {
  return (
    <div>
      Hello, {name} {mark}
      {optional && <p>{optional}</p>}
    </div>
  );
}

Greetings.defaultProps = {
  mark: "!"
};

export default Greetings;
