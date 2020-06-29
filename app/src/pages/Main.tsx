import React from "react";
import { Apollo } from "../components/Apollo";

interface Props {}

export const Main: React.FC<Props> = () => {
  return (
    <div>
      <Apollo title={"Apollo Experiment"} />
    </div>
  );
};
