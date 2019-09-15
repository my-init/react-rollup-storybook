import React from 'react';
import ReactDOM from "react-dom";

ReactDOM.render(
  <div>
    <h1>{((): string=>'hello')()}</h1>
  </div>,
  document.getElementById("root")
);